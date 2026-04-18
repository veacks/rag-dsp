import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import OpenAI from 'openai';
import 'dotenv/config';

/** CJS require so pdf-parse does not run its debug self-test (broken under ESM). */
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const PDF_PATH = process.env.PDF_PATH || './DesigningAudioEffectPlugins.pdf';
const OUT_PATH = './public/rag.json';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;

const sourceName = path.basename(PDF_PATH);

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const clean = text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const chunks = [];
  let start = 0;
  let id = 0;
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
      id: `chunk_${++id}`,
      text: slice.trim(),
      metadata: {
        source: sourceName
      }
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
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`PDF not found: ${PDF_PATH}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const buffer = fs.readFileSync(PDF_PATH);
  const parsed = await pdf(buffer);
  const chunks = chunkText(parsed.text);
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
  fs.writeFileSync(OUT_PATH, JSON.stringify(chunks));
  console.log(`Saved: ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
