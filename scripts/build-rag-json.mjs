import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { buildRichPdfChunks } from './lib/pdf-pipeline.mjs';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

/** Bump when the JSON shape or chunking/embed semantics change. */
const SCHEMA_VERSION = 5;

/** CJS require so pdf-parse does not run its debug self-test (broken under ESM). */
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const PDF_PATH = process.env.PDF_PATH || './DesigningAudioEffectPlugins.pdf';

/** Default PDF directory when `RAG_SOURCE_DIR` / `SOURCE_DIR` are unset. Must be a folder path, not a glob (`*.pdf` is stripped if pasted by mistake). */
function normalizedDefaultPdfDir() {
  const fallback = './pdf';
  const raw = (process.env.DEFAULT_PDF_DIR || '').trim();
  if (!raw) return fallback;
  let s = raw.replace(/\/\*\.pdf\/?$/i, '');
  s = s.replace(/\/+$/, '');
  return s || fallback;
}
const DEFAULT_PDF_DIR = normalizedDefaultPdfDir();
/** One URL per line; `#` starts a comment. If non-empty, crawl runs instead of PDFs (unless RAG_IGNORE_SITES_TXT). */
const DEFAULT_SITES_TXT = './sources/sites.txt';
const DEFAULT_TRANSCRIPTS_DIR = './sources/transcripts';
/** Public site origin for chunk links, e.g. `https://docs.example.com` (no trailing slash required). */
const SITE_BASE_URL = (process.env.SITE_BASE_URL || '').replace(/\/$/, '');

const OUT_PATH = './public/rag.json';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const CRAWL_DELAY_MS = Math.max(0, Number(process.env.CRAWL_DELAY_MS || 400));

const RAG_PDF_LEGACY = ['1', 'true', 'yes'].includes((process.env.RAG_PDF_LEGACY || '').toLowerCase());
const RAG_PDF_VISION = ['1', 'true', 'yes'].includes((process.env.RAG_PDF_VISION || '').toLowerCase());
const RAG_VISION_MODEL = process.env.RAG_VISION_MODEL || 'gpt-4o-mini';
const RAG_PDF_MAX_FIGURES = Math.max(0, Number(process.env.RAG_PDF_MAX_FIGURES || 24));
const RAG_PDF_RENDER_SCALE = Math.max(0.5, Math.min(3, Number(process.env.RAG_PDF_RENDER_SCALE || 1.5)));
const ASSETS_DIR = path.join(repoRoot, 'public', 'rag-assets');

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
    return { text: parsed.text, bytes: buf.length, finalUrl, pdfBuffer: buf };
  }
  if (ct.includes('pdf')) {
    const parsed = await pdf(buf);
    return { text: parsed.text, bytes: buf.length, finalUrl, pdfBuffer: buf };
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

function listTextFiles(rootDir) {
  const absRoot = path.resolve(rootDir);
  if (!fs.existsSync(absRoot) || !fs.statSync(absRoot).isDirectory()) return [];
  return walkFiles(absRoot)
    .filter((f) => /\.(txt|md|markdown)$/i.test(f))
    .map((abs) => {
      const rel = path.relative(absRoot, abs);
      const relPosix = toPosix(rel);
      return { abs, relPosix, name: path.basename(abs) };
    })
    .sort((a, b) => a.relPosix.localeCompare(b.relPosix, 'en'));
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

async function pdfBufferToChunks(buffer, ctx) {
  const {
    relPosix,
    baseMetadata,
    idCounter,
    fileSha256
  } = ctx;
  if (RAG_PDF_LEGACY) {
    const parsed = await pdf(buffer);
    return {
      chunks: await chunkText(parsed.text, baseMetadata, idCounter),
      pdfPipeline: null
    };
  }
  const rich = await buildRichPdfChunks(buffer, {
    relPosix,
    baseMetadata,
    idCounter,
    fileSha256,
    assetsDir: ASSETS_DIR,
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    visionEnabled: RAG_PDF_VISION,
    visionModel: RAG_VISION_MODEL,
    maxFigures: RAG_PDF_MAX_FIGURES,
    renderScale: RAG_PDF_RENDER_SCALE
  });
  return {
    chunks: rich.chunks,
    pdfPipeline: {
      limits: rich.limits,
      outlinePresent: rich.outlinePresent,
      sourceKey: rich.sourceKey,
      assetPrefix: rich.assetUrlPrefix
    }
  };
}

async function chunkText(text, baseMetadata, idCounter, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const clean = text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!clean) return [];

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: overlap
  });
  const docs = await splitter.createDocuments([clean], [baseMetadata]);
  return docs
    .map((doc) => ({
      id: `chunk_${++idCounter.n}`,
      text: doc.pageContent.trim(),
      metadata: { ...baseMetadata }
    }))
    .filter((c) => c.text);
}

/** When set, also index local PDFs after a URL crawl (same paths as PDF-only mode). Default: on unless `RAG_MERGE_PDFS=0`. */
function shouldMergeLocalPdfsAfterCrawl() {
  const v = (process.env.RAG_MERGE_PDFS ?? '1').toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(v);
}

/**
 * Discover *.pdf under RAG_SOURCE_DIR / DEFAULT_PDF_DIR, then under PDF_PATH if it is a directory or a single file.
 * @returns {{ entries: { abs: string, relPosix: string, name: string }[], envSourceDir: string, effectiveDir: string, usedPdfPathFallback: boolean }}
 */
function resolveLocalPdfFileEntries() {
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

  let entries = effectiveDir ? listPdfFiles(effectiveDir) : [];
  let usedPdfPathFallback = false;

  if (entries.length === 0) {
    const resolved = path.resolve(PDF_PATH);
    if (fs.existsSync(resolved)) {
      const st = fs.statSync(resolved);
      if (st.isDirectory()) {
        entries = listPdfFiles(PDF_PATH);
        usedPdfPathFallback = entries.length > 0;
      } else {
        entries = [
          {
            abs: resolved,
            relPosix: toPosix(path.relative(process.cwd(), resolved)),
            name: path.basename(resolved)
          }
        ];
        usedPdfPathFallback = true;
      }
    }
  }

  return { entries, envSourceDir, effectiveDir, usedPdfPathFallback };
}

async function appendChunksFromPdfFileEntries(fileEntries, idCounter, chunks, pdfPipelineRuns) {
  const fileRows = [];
  for (const file of fileEntries) {
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

    const out = await pdfBufferToChunks(buffer, {
      relPosix: file.relPosix,
      baseMetadata,
      idCounter,
      fileSha256: sha256
    });
    chunks.push(...out.chunks);
    if (out.pdfPipeline) pdfPipelineRuns.push({ path: file.relPosix, ...out.pdfPipeline });
    console.log(`Parsed ${file.relPosix}: ${out.chunks.length} chunks`);
  }
  return fileRows;
}

function shouldMergeLocalTranscripts() {
  const v = (process.env.RAG_MERGE_TRANSCRIPTS ?? '1').toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(v);
}

function resolveTranscriptFileEntries() {
  const dir = (process.env.RAG_TRANSCRIPTS_DIR || DEFAULT_TRANSCRIPTS_DIR).trim() || DEFAULT_TRANSCRIPTS_DIR;
  return {
    dir,
    entries: listTextFiles(dir)
  };
}

async function appendChunksFromTextFileEntries(fileEntries, idCounter, chunks) {
  const fileRows = [];
  for (const file of fileEntries) {
    const text = fs.readFileSync(file.abs, 'utf8');
    const clean = text.trim();
    if (!clean) continue;
    const sha256 = crypto.createHash('sha256').update(clean).digest('hex');
    fileRows.push({
      path: file.relPosix,
      name: file.name,
      sha256,
      chars: clean.length
    });
    const baseMetadata = {
      source: file.name,
      path: `transcripts/${file.relPosix}`,
      sitePath: `/transcripts/${file.relPosix}`,
      contentType: 'transcript'
    };
    const part = await chunkText(clean, baseMetadata, idCounter);
    chunks.push(...part);
    console.log(`Parsed transcript ${file.relPosix}: ${part.length} chunks`);
  }
  return fileRows;
}

function mergeTranscriptSummary(sourceSummary, transcriptSummary) {
  return {
    type: 'with_transcripts',
    base: sourceSummary,
    transcripts: transcriptSummary
  };
}

function buildSourceHint(sourceSummary) {
  if (sourceSummary.type === 'directory') {
    return `${sourceSummary.fileCount} files from ${sourceSummary.path}`;
  }
  if (sourceSummary.type === 'urls') {
    return `${sourceSummary.fetchedCount}/${sourceSummary.urlCount} URLs from ${sourceSummary.listFile}`;
  }
  if (sourceSummary.type === 'urls_and_pdfs') {
    const u = sourceSummary.urls;
    const p = sourceSummary.pdfs;
    const pdfHint = p.type === 'directory' ? `${p.fileCount} PDF(s) from ${p.path}` : p.name;
    return `${u.fetchedCount}/${u.urlCount} URLs + ${pdfHint}`;
  }
  if (sourceSummary.type === 'with_transcripts') {
    const baseHint = buildSourceHint(sourceSummary.base);
    const t = sourceSummary.transcripts;
    return `${baseHint} + ${t.fileCount} transcript file(s) from ${t.path}`;
  }
  return `source sha256=${sourceSummary.sha256.slice(0, 12)}…`;
}

function buildPdfSourceSummary(fileRows, effectiveDir, usedPdfPathFallback) {
  const pdfPathResolved = path.resolve(PDF_PATH);
  const singleFileFromPdfPath =
    fileRows.length === 1 &&
    !effectiveDir &&
    usedPdfPathFallback &&
    fs.existsSync(pdfPathResolved) &&
    fs.statSync(pdfPathResolved).isFile();
  if (singleFileFromPdfPath) {
    const r = fileRows[0];
    return {
      type: 'file',
      path: pdfPathResolved,
      name: r.name,
      sha256: r.sha256,
      bytes: r.bytes,
      siteBaseUrl: SITE_BASE_URL || null
    };
  }
  const absSource = effectiveDir ? path.resolve(effectiveDir) : pdfPathResolved;
  return {
    type: 'directory',
    path: absSource,
    siteBaseUrl: SITE_BASE_URL || null,
    fileCount: fileRows.length,
    files: fileRows
  };
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

  const embeddings = new OpenAIEmbeddings({
    model: EMBEDDING_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    batchSize: 50
  });
  const idCounter = { n: 0 };
  const chunks = [];
  /** @type {Record<string, unknown>[]} */
  const pdfPipelineRuns = [];
  /** @type {Record<string, unknown>} */
  let sourceSummary;

  if (crawlUrls.length > 0) {
    console.log(`Crawl mode: ${crawlUrls.length} URL(s) from ${path.resolve(sitesTxtPath)}`);
    const fetched = [];
    for (let i = 0; i < crawlUrls.length; i++) {
      const url = crawlUrls[i];
      if (i > 0 && CRAWL_DELAY_MS) await sleep(CRAWL_DELAY_MS);
      try {
        const { text, bytes, finalUrl, pdfBuffer } = await fetchUrlText(url);
        if (!text || text.length < 20) {
          console.warn(`Skip (empty or tiny body): ${finalUrl}`);
          continue;
        }
        const sha256 = crypto
          .createHash('sha256')
          .update(pdfBuffer || text)
          .digest('hex');
        fetched.push({ url: finalUrl, requested: url, bytes, sha256 });
        const baseMetadata = metadataFromFetchedUrl(finalUrl);
        let part;
        if (pdfBuffer) {
          const u = new URL(finalUrl);
          const relPosix = toPosix(u.pathname.replace(/^\/+/, '') || 'remote.pdf');
          const out = await pdfBufferToChunks(pdfBuffer, {
            relPosix,
            baseMetadata,
            idCounter,
            fileSha256: sha256
          });
          part = out.chunks;
          if (out.pdfPipeline) pdfPipelineRuns.push({ path: relPosix, url: finalUrl, ...out.pdfPipeline });
        } else {
          part = await chunkText(text, baseMetadata, idCounter);
        }
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
    const crawlSourceSummary = {
      type: 'urls',
      listFile: path.resolve(sitesTxtPath),
      urlCount: crawlUrls.length,
      fetchedCount: fetched.length,
      siteBaseUrl: SITE_BASE_URL || null,
      fetched
    };
    sourceSummary = crawlSourceSummary;

    if (shouldMergeLocalPdfsAfterCrawl()) {
      const { entries, effectiveDir, usedPdfPathFallback } = resolveLocalPdfFileEntries();
      if (entries.length > 0) {
        const label = effectiveDir
          ? path.resolve(effectiveDir)
          : usedPdfPathFallback
            ? path.resolve(PDF_PATH)
            : 'local';
        console.log(`Merging ${entries.length} local PDF(s) after crawl (${label})`);
        const fileRows = await appendChunksFromPdfFileEntries(entries, idCounter, chunks, pdfPipelineRuns);
        sourceSummary = {
          type: 'urls_and_pdfs',
          urls: crawlSourceSummary,
          pdfs: buildPdfSourceSummary(fileRows, effectiveDir, usedPdfPathFallback)
        };
      }
    }

    if (shouldMergeLocalTranscripts()) {
      const { dir, entries } = resolveTranscriptFileEntries();
      if (entries.length > 0) {
        console.log(`Merging ${entries.length} local transcript file(s) (${path.resolve(dir)})`);
        const fileRows = await appendChunksFromTextFileEntries(entries, idCounter, chunks);
        sourceSummary = mergeTranscriptSummary(sourceSummary, {
          type: 'directory',
          path: path.resolve(dir),
          fileCount: fileRows.length,
          files: fileRows
        });
      }
    }
  } else {
    const { entries, effectiveDir, usedPdfPathFallback } = resolveLocalPdfFileEntries();

    if (entries.length === 0) {
      console.error(
        'No PDFs found. Set RAG_SOURCE_DIR or DEFAULT_PDF_DIR, or set PDF_PATH to a .pdf file or a folder of PDFs.'
      );
      console.error(
        `Tip: add URLs to ${DEFAULT_SITES_TXT}, or use RAG_IGNORE_SITES_TXT=1 with local PDFs.`
      );
      process.exit(1);
    }

    const fileRows = await appendChunksFromPdfFileEntries(entries, idCounter, chunks, pdfPipelineRuns);
    sourceSummary = buildPdfSourceSummary(fileRows, effectiveDir, usedPdfPathFallback);

    if (shouldMergeLocalTranscripts()) {
      const { dir, entries: transcriptEntries } = resolveTranscriptFileEntries();
      if (transcriptEntries.length > 0) {
        console.log(`Merging ${transcriptEntries.length} local transcript file(s) (${path.resolve(dir)})`);
        const transcriptRows = await appendChunksFromTextFileEntries(transcriptEntries, idCounter, chunks);
        sourceSummary = mergeTranscriptSummary(sourceSummary, {
          type: 'directory',
          path: path.resolve(dir),
          fileCount: transcriptRows.length,
          files: transcriptRows
        });
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  for (let i = chunks.length - 1; i >= 0; i--) {
    if (!(chunks[i].text || '').trim()) {
      console.warn(`Dropping empty-text chunk ${chunks[i].id}`);
      chunks.splice(i, 1);
    }
  }

  console.log(`Chunks: ${chunks.length}`);
  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await embeddings.embedDocuments(batch.map((c) => c.text));
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
      overlap: CHUNK_OVERLAP,
      splitter: 'RecursiveCharacterTextSplitter',
      embeddings: 'OpenAIEmbeddings',
      pdfLegacy: RAG_PDF_LEGACY
    },
    ...(pdfPipelineRuns.length
      ? {
          pdfPipeline: {
            version: 1,
            legacy: RAG_PDF_LEGACY,
            visionEnabled: RAG_PDF_VISION,
            visionModel: RAG_VISION_MODEL,
            maxFigures: RAG_PDF_MAX_FIGURES,
            renderScale: RAG_PDF_RENDER_SCALE,
            assetDir: 'public/rag-assets',
            runs: pdfPipelineRuns
          }
        }
      : {}),
    chunkCount: chunks.length,
    chunks
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 0));
  const hint = buildSourceHint(sourceSummary);
  console.log(`Saved: ${OUT_PATH} (schema v${SCHEMA_VERSION}, ${chunks.length} chunks, ${hint})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
