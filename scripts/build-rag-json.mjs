import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
import OpenAI from 'openai';
import 'dotenv/config';

/** Bump when the JSON shape or chunking/embed semantics change. */
const SCHEMA_VERSION = 3;

/** CJS require so pdf-parse does not run its debug self-test (broken under ESM). */
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const PDF_PATH = process.env.PDF_PATH || './DesigningAudioEffectPlugins.pdf';
/** Default folder in the repo for PDFs (`rager build` / `npm run build:rag` uses it when it contains at least one `*.pdf`). */
const DEFAULT_PDF_DIR = './pdf';
/** One URL per line; `#` starts a comment. If non-empty, crawl runs instead of PDFs (unless RAG_IGNORE_SITES_TXT). */
const DEFAULT_SITES_TXT = './sources/sites.txt';
/** Public site origin for chunk links, e.g. `https://docs.example.com` (no trailing slash required). */
const SITE_BASE_URL = (process.env.SITE_BASE_URL || '').replace(/\/$/, '');

const OUT_PATH = './public/rag.json';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const CRAWL_DELAY_MS = Math.max(0, Number(process.env.CRAWL_DELAY_MS || 400));

function toPosix(p) {
  return p.split(path.sep).join('/');
}

/** URL to this document on the site (optional). */
function siteUrlForRelative(relPosix) {
  if (!SITE_BASE_URL || !relPosix) return undefined;
  const base = SITE_BASE_URL.endsWith('/') ? SITE_BASE_URL : `${SITE_BASE_URL}/`;
  const segments = relPosix.split('/').map((s) => encodeURIComponent(s));
  return new URL(segments.join('/'), base).href;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseSitesList(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const urls = [];
  for (const line of raw.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    try {
      const u = new URL(s);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
      urls.push(u.href);
    } catch {
      console.warn(`Ignoring invalid URL line: ${s.slice(0, 120)}`);
    }
  }
  return urls;
}

function htmlToText(html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');
  const withBreaks = stripped.replace(/<\/(p|div|br|h[1-6]|li|tr|section|article)[^>]*>/gi, '\n');
  return withBreaks
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#[0-9]+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function metadataFromFetchedUrl(finalUrl) {
  const u = new URL(finalUrl);
  const pathPart = u.pathname === '/' ? '' : u.pathname;
  const label = `${u.hostname}${pathPart}` || u.hostname;
  return {
    source: label,
    url: u.href,
    sitePath: u.pathname || '/',
    path: `${u.pathname}${u.search || ''}`
  };
}

async function fetchUrlText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      'User-Agent': 'flowise-dsp-rag-build/1.0 (local RAG indexer)'
    },
    signal: AbortSignal.timeout(60000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const finalUrl = res.url;
  const ct = (res.headers.get('content-type') || '').toLowerCase();

  if (buf.length >= 4 && buf.slice(0, 4).toString() === '%PDF') {
    const parsed = await pdf(buf);
    return { text: parsed.text, bytes: buf.length, finalUrl };
  }
  if (ct.includes('pdf')) {
    const parsed = await pdf(buf);
    return { text: parsed.text, bytes: buf.length, finalUrl };
  }

  const raw = buf.toString('utf8');
  const text = htmlToText(raw);
  return { text, bytes: buf.length, finalUrl };
}

function walkFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function listPdfFiles(rootDir) {
  const absRoot = path.resolve(rootDir);
  if (!fs.existsSync(absRoot) || !fs.statSync(absRoot).isDirectory()) {
    return [];
  }
  return walkFiles(absRoot)
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((abs) => {
      const rel = path.relative(absRoot, abs);
      const relPosix = toPosix(rel);
      return {
        abs,
        relPosix,
        name: path.basename(abs)
      };
    })
    .sort((a, b) => a.relPosix.localeCompare(b.relPosix, 'en'));
}

function chunkText(text, baseMetadata, idCounter, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const clean = text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    let slice = clean.slice(start, end);
    if (end < clean.length) {
      const lastBreak = Math.max(
        slice.lastIndexOf('\n\n'),
        slice.lastIndexOf('. '),
        slice.lastIndexOf('\n')
      );
      if (lastBreak > Math.floor(chunkSize * 0.6)) {
        slice = slice.slice(0, lastBreak + 1);
      }
    }
    chunks.push({
      id: `chunk_${++idCounter.n}`,
      text: slice.trim(),
      metadata: { ...baseMetadata }
    });
    start += Math.max(1, slice.length - overlap);
  }
  return chunks.filter((c) => c.text);
}

async function embedBatch(client, texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts
  });
  return res.data.map((d) => d.embedding);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in environment (.env)');
    process.exit(1);
  }

  const sitesTxtPath = process.env.SITES_TXT || DEFAULT_SITES_TXT;
  const ignoreSites = ['1', 'true', 'yes'].includes(
    (process.env.RAG_IGNORE_SITES_TXT || '').toLowerCase()
  );
  const crawlUrls = ignoreSites ? [] : parseSitesList(sitesTxtPath);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const idCounter = { n: 0 };
  const chunks = [];
  /** @type {Record<string, unknown>} */
  let sourceSummary;

  if (crawlUrls.length > 0) {
    console.log(`Crawl mode: ${crawlUrls.length} URL(s) from ${path.resolve(sitesTxtPath)}`);
    const fetched = [];
    for (let i = 0; i < crawlUrls.length; i++) {
      const url = crawlUrls[i];
      if (i > 0 && CRAWL_DELAY_MS) await sleep(CRAWL_DELAY_MS);
      try {
        const { text, bytes, finalUrl } = await fetchUrlText(url);
        if (!text || text.length < 20) {
          console.warn(`Skip (empty or tiny body): ${finalUrl}`);
          continue;
        }
        const sha256 = crypto.createHash('sha256').update(text).digest('hex');
        fetched.push({ url: finalUrl, requested: url, bytes, sha256 });
        const baseMetadata = metadataFromFetchedUrl(finalUrl);
        const part = chunkText(text, baseMetadata, idCounter);
        chunks.push(...part);
        console.log(`Fetched ${finalUrl}: ${part.length} chunk(s), ${text.length} chars`);
      } catch (e) {
        console.warn(`Skip ${url}: ${e instanceof Error ? e.message : e}`);
      }
    }
    if (chunks.length === 0) {
      console.error('No usable content from any URL. Fix URLs or use PDF mode (empty sites list / RAG_IGNORE_SITES_TXT=1).');
      process.exit(1);
    }
    sourceSummary = {
      type: 'urls',
      listFile: path.resolve(sitesTxtPath),
      urlCount: crawlUrls.length,
      fetchedCount: fetched.length,
      siteBaseUrl: SITE_BASE_URL || null,
      fetched
    };
  } else {
    const envSourceDir = (process.env.RAG_SOURCE_DIR || process.env.SOURCE_DIR || '').trim();
    let effectiveDir = '';
    if (envSourceDir) {
      effectiveDir = envSourceDir;
    } else {
      const defAbs = path.resolve(DEFAULT_PDF_DIR);
      if (fs.existsSync(defAbs) && fs.statSync(defAbs).isDirectory()) {
        effectiveDir = DEFAULT_PDF_DIR;
      }
    }

    let pdfFiles = effectiveDir ? listPdfFiles(effectiveDir) : null;

    if (pdfFiles && pdfFiles.length === 0) {
      if (envSourceDir) {
        console.error(`No PDFs found under RAG_SOURCE_DIR=${effectiveDir}`);
        process.exit(1);
      }
      console.log(`No PDFs in ${DEFAULT_PDF_DIR}, falling back to PDF_PATH.`);
      pdfFiles = null;
    }

    if (!pdfFiles && !fs.existsSync(PDF_PATH)) {
      console.error(`PDF not found: ${PDF_PATH}`);
      console.error(
        `Tip: add URLs to ${DEFAULT_SITES_TXT} or place PDFs in ${DEFAULT_PDF_DIR}/`
      );
      process.exit(1);
    }

    if (pdfFiles) {
      const absSource = path.resolve(effectiveDir);
      const fileRows = [];
      for (const file of pdfFiles) {
        const buffer = fs.readFileSync(file.abs);
        const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
        fileRows.push({
          path: file.relPosix,
          name: file.name,
          sha256,
          bytes: buffer.length
        });
        const baseMetadata = {
          source: file.name,
          path: file.relPosix,
          sitePath: `/${file.relPosix}`
        };
        const mapped = siteUrlForRelative(file.relPosix);
        if (mapped) baseMetadata.url = mapped;

        const parsed = await pdf(buffer);
        const part = chunkText(parsed.text, baseMetadata, idCounter);
        chunks.push(...part);
        console.log(`Parsed ${file.relPosix}: ${part.length} chunks`);
      }
      sourceSummary = {
        type: 'directory',
        path: absSource,
        siteBaseUrl: SITE_BASE_URL || null,
        fileCount: pdfFiles.length,
        files: fileRows
      };
    } else {
      const buffer = fs.readFileSync(PDF_PATH);
      const sourceName = path.basename(PDF_PATH);
      const sourceSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
      const relFromCwd = toPosix(path.relative(process.cwd(), path.resolve(PDF_PATH)));
      const baseMetadata = {
        source: sourceName,
        path: relFromCwd,
        sitePath: `/${relFromCwd}`
      };
      const mapped = siteUrlForRelative(relFromCwd);
      if (mapped) baseMetadata.url = mapped;

      const parsed = await pdf(buffer);
      chunks.push(...chunkText(parsed.text, baseMetadata, idCounter));
      sourceSummary = {
        type: 'file',
        path: path.resolve(PDF_PATH),
        name: sourceName,
        sha256: sourceSha256,
        bytes: buffer.length,
        siteBaseUrl: SITE_BASE_URL || null
      };
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  console.log(`Chunks: ${chunks.length}`);
  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await embedBatch(client, batch.map((c) => c.text));
    batch.forEach((chunk, idx) => {
      chunk.embedding = vectors[idx];
    });
    console.log(`Embedded ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`);
  }

  const payload = {
    schemaVersion: SCHEMA_VERSION,
    builtAt: new Date().toISOString(),
    source: sourceSummary,
    embeddingModel: EMBEDDING_MODEL,
    chunking: {
      size: CHUNK_SIZE,
      overlap: CHUNK_OVERLAP
    },
    chunkCount: chunks.length,
    chunks
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 0));
  let hint = '';
  if (sourceSummary.type === 'directory') {
    hint = `${sourceSummary.fileCount} files from ${sourceSummary.path}`;
  } else if (sourceSummary.type === 'urls') {
    hint = `${sourceSummary.fetchedCount}/${sourceSummary.urlCount} URLs from ${sourceSummary.listFile}`;
  } else {
    hint = `source sha256=${sourceSummary.sha256.slice(0, 12)}…`;
  }
  console.log(`Saved: ${OUT_PATH} (schema v${SCHEMA_VERSION}, ${chunks.length} chunks, ${hint})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
