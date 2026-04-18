#!/usr/bin/env node
/**
 * POST built RAG chunks to Flowise vector upsert API.
 *
 * Prerequisites:
 * - Import `rag-chat-flow/*.json` in Flowise and copy the Chatflow UUID.
 * - Create an API key in the same workspace as that chatflow (Flowise → API Keys).
 * - If the chatflow is bound to a specific API key in settings, use that key.
 *
 * Note: Memory Vector Store is in-RAM only; for persistence use PGVector, Pinecone, etc.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const RAG_PATH = process.env.RAG_PATH || './public/rag.json';
const FLOWISE_BASE_URL = (process.env.FLOWISE_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const FLOWISE_CHATFLOW_ID = process.env.FLOWISE_CHATFLOW_ID || '';
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY || '';
const FLOWISE_FLOW_JSON =
  process.env.FLOWISE_FLOW_JSON || path.join(repoRoot, 'rag-chat-flow', 'rag-dsp-chatlow.json');
const FLOWISE_STOP_NODE_ID = process.env.FLOWISE_STOP_NODE_ID || '';

function loadRag(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(raw)) return { chunks: raw };
  return { chunks: raw.chunks ?? [], meta: raw };
}

function getStopNodeIdFromFlowJson(flowPath) {
  if (!fs.existsSync(flowPath)) return '';
  try {
    const d = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
    const nodes = d.nodes || [];
    const vs = nodes.filter((n) => n.data?.category === 'Vector Stores');
    if (vs.length === 1) return vs[0].data.id;
    if (vs.length > 1) {
      console.warn(
        `Multiple vector store nodes in ${flowPath}; set FLOWISE_STOP_NODE_ID explicitly.`
      );
    }
  } catch (e) {
    console.warn(`Could not parse flow JSON ${flowPath}:`, e.message);
  }
  return '';
}

/** Naive wrap for PDF (Helvetica, mostly Latin-1). */
function chunkLines(text, maxChars) {
  const out = [];
  for (const para of text.split(/\n/)) {
    let rest = para;
    while (rest.length > maxChars) {
      let cut = rest.lastIndexOf(' ', maxChars);
      if (cut < maxChars * 0.5) cut = maxChars;
      out.push(rest.slice(0, cut).trimEnd());
      rest = rest.slice(cut).trimStart();
    }
    if (rest) out.push(rest);
  }
  return out;
}

async function buildPdfFromChunks(chunks) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 9;
  const lineHeight = fontSize * 1.35;
  const margin = 48;
  const pageW = 595.28;
  const pageH = 841.89;
  const maxChars = 95;

  const parts = [];
  for (const c of chunks) {
    const meta = c.metadata || {};
    const header = `[${c.id}] ${meta.source || ''} ${meta.url || ''}`.trim();
    parts.push(header, '', c.text || '', '', '---', '');
  }
  const body = parts.join('\n');
  const lines = chunkLines(body, maxChars);

  let page = pdfDoc.addPage([pageW, pageH]);
  let y = pageH - margin;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([pageW, pageH]);
      y = pageH - margin;
    }
    try {
      page.drawText(line.length > maxChars ? line.slice(0, maxChars) : line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
    } catch {
      page.drawText(line.replace(/[^\x00-\xFF]/g, '?'), {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
    }
    y -= lineHeight;
  }

  return pdfDoc.save();
}

async function main() {
  if (!FLOWISE_CHATFLOW_ID) {
    console.error('Set FLOWISE_CHATFLOW_ID to the chatflow UUID (Flowise UI after import).');
    process.exit(1);
  }
  if (!FLOWISE_API_KEY) {
    console.error('Set FLOWISE_API_KEY (Bearer token from Flowise API Keys, same workspace).');
    process.exit(1);
  }
  if (!fs.existsSync(RAG_PATH)) {
    console.error(`RAG file not found: ${RAG_PATH} — run: rager build (or npm run build:rag)`);
    process.exit(1);
  }

  const { chunks } = loadRag(RAG_PATH);
  if (!chunks.length) {
    console.error('No chunks in RAG file.');
    process.exit(1);
  }

  console.warn(
    '[flowise] If your chatflow uses Memory Vector Store, vectors are not persisted across restarts.'
  );

  const stopNodeId = FLOWISE_STOP_NODE_ID || getStopNodeIdFromFlowJson(FLOWISE_FLOW_JSON);
  const pdfBytes = await buildPdfFromChunks(chunks);

  const url = `${FLOWISE_BASE_URL}/api/v1/vector/upsert/${FLOWISE_CHATFLOW_ID}`;
  const form = new FormData();
  form.append(
    'files',
    new Blob([pdfBytes], { type: 'application/pdf' }),
    'rag-chunks-from-build.pdf'
  );
  if (stopNodeId) form.append('stopNodeId', stopNodeId);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FLOWISE_API_KEY}`
    },
    body: form
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  if (!res.ok) {
    console.error(`Upsert failed HTTP ${res.status}:`, json);
    process.exit(1);
  }

  console.log('Flowise upsert OK:', JSON.stringify(json, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
