import fs from 'node:fs';
import path from 'node:path';
import { fetchTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';
import 'dotenv/config';

const YOUTUBE_LIST_PATH = process.env.YOUTUBE_URLS_TXT || './sources/youtube.txt';
const OUT_DIR = process.env.RAG_TRANSCRIPTS_DIR || './sources/transcripts/youtube';
const REQUEST_DELAY_MS = Math.max(0, Number(process.env.YOUTUBE_TRANSCRIPT_DELAY_MS || 350));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseUrlLines(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const out = [];
  for (const line of raw.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    try {
      const u = new URL(s);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
      out.push(u.href);
    } catch {
      console.warn(`Ignoring invalid URL line: ${s.slice(0, 120)}`);
    }
  }
  return [...new Set(out)];
}

function youtubeVideoId(url) {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  if (host === 'youtu.be') {
    const id = u.pathname.split('/').filter(Boolean)[0] || '';
    return id || null;
  }
  if (host !== 'youtube.com' && host !== 'm.youtube.com') return null;
  if (u.pathname === '/watch') return u.searchParams.get('v');
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts[0] === 'shorts' || parts[0] === 'embed') return parts[1] || null;
  return null;
}

function safeSlug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'video';
}

function transcriptToMarkdown({ url, videoId, transcript }) {
  const title = transcript.find((line) => line.text)?.text?.slice(0, 80) || videoId;
  const lines = transcript
    .map((line) => {
      const t = Number(line.offset || 0).toFixed(2);
      return `[${t}s] ${String(line.text || '').replace(/\s+/g, ' ').trim()}`;
    })
    .filter(Boolean);
  return [
    '# YouTube Transcript',
    '',
    `- URL: ${url}`,
    `- Video ID: ${videoId}`,
    `- Segments: ${lines.length}`,
    '',
    `## Transcript (${title})`,
    '',
    ...lines,
    ''
  ].join('\n');
}

async function main() {
  const urls = parseUrlLines(YOUTUBE_LIST_PATH);
  if (urls.length === 0) {
    console.error(`No URLs found in ${path.resolve(YOUTUBE_LIST_PATH)}.`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let skipped = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (i > 0 && REQUEST_DELAY_MS) await sleep(REQUEST_DELAY_MS);
    const videoId = youtubeVideoId(url);
    if (!videoId) {
      skipped += 1;
      console.warn(`Skip non-video YouTube URL: ${url}`);
      continue;
    }
    try {
      const transcript = await fetchTranscript(url);
      if (!Array.isArray(transcript) || transcript.length === 0) {
        skipped += 1;
        console.warn(`No transcript segments for: ${url}`);
        continue;
      }
      const stem = safeSlug(`${videoId}-${new URL(url).pathname}`);
      const outPath = path.join(OUT_DIR, `${stem}.md`);
      const content = transcriptToMarkdown({ url, videoId, transcript });
      fs.writeFileSync(outPath, content, 'utf8');
      ok += 1;
      console.log(`Saved transcript: ${path.relative(process.cwd(), outPath)} (${transcript.length} segments)`);
    } catch (err) {
      skipped += 1;
      console.warn(`Failed transcript for ${url}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`Done. Saved ${ok} transcript file(s), skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
