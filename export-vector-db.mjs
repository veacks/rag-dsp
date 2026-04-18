import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const DEFAULT_RAG = './public/rag.json';
const DEFAULT_OUT = './export/vector-db';

function parseArgs(argv) {
  let ragPath = process.env.RAG_PATH || DEFAULT_RAG;
  let outDir = process.env.EXPORT_DIR || DEFAULT_OUT;
  let vectorsOnly = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' && argv[i + 1]) {
      outDir = argv[++i];
    } else if (a === '--rag' && argv[i + 1]) {
      ragPath = argv[++i];
    } else if (a === '--vectors-only') {
      vectorsOnly = true;
    } else if (a === '--help' || a === '-h') {
      console.log(`Usage: node export-vector-db.mjs [options]

Reads ${DEFAULT_RAG} (or RAG_PATH) and writes a portable vector export:

  manifest.json   — schema, source fingerprint, embedding model, chunking (no vectors)
  chunks.jsonl      — one JSON object per line: id, text, metadata, embedding
  vectors.jsonl     — only with --vectors-only: id, embedding per line

Options:
  --rag <file>     Input rag.json (default: ${DEFAULT_RAG})
  --out <dir>      Output directory (default: ${DEFAULT_OUT}, or EXPORT_DIR)
  --vectors-only   Also write vectors.jsonl (id + embedding only)

Environment: RAG_PATH, EXPORT_DIR`);
      process.exit(0);
    }
  }
  return { ragPath, outDir, vectorsOnly };
}

function loadRag(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(raw)) {
    return {
      schemaVersion: 0,
      builtAt: null,
      source: null,
      embeddingModel: null,
      chunking: null,
      chunkCount: raw.length,
      chunks: raw
    };
  }
  const chunks = raw.chunks ?? [];
  return { ...raw, chunks };
}

function main() {
  const { ragPath, outDir, vectorsOnly } = parseArgs(process.argv);

  if (!fs.existsSync(ragPath)) {
    console.error(`RAG file not found: ${ragPath}`);
    console.error('Run: npm run build:rag');
    process.exit(1);
  }

  const data = loadRag(ragPath);
  const { chunks, ...meta } = data;
  const manifest = {
    ...meta,
    chunkCount: chunks.length,
    exportedAt: new Date().toISOString(),
    exportSource: path.resolve(ragPath)
  };

  fs.mkdirSync(outDir, { recursive: true });

  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const chunksPath = path.join(outDir, 'chunks.jsonl');
  const lines = chunks.map((c) => JSON.stringify(c));
  fs.writeFileSync(chunksPath, lines.join('\n') + (lines.length ? '\n' : ''));

  let extra = '';
  if (vectorsOnly) {
    const vecPath = path.join(outDir, 'vectors.jsonl');
    const vlines = chunks.map((c) =>
      JSON.stringify({ id: c.id, embedding: c.embedding })
    );
    fs.writeFileSync(vecPath, vlines.join('\n') + (vlines.length ? '\n' : ''));
    extra = `, ${path.basename(vecPath)}`;
  }

  console.log(
    `Exported ${chunks.length} vectors → ${outDir}/ (${path.basename(manifestPath)}, ${path.basename(chunksPath)}${extra})`
  );
}

main();
