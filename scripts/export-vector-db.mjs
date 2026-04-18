import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const DEFAULT_RAG = './public/rag.json';
const DEFAULT_OUT = './export/vector-db';
const DEFAULT_RAG_SETTINGS = './sources/rag-settings.json';

function parseArgs(argv) {
  let ragPath = process.env.RAG_PATH || DEFAULT_RAG;
  let outDir = process.env.EXPORT_DIR || DEFAULT_OUT;
  let vectorsOnly = false;
  let sqlite = false;
  let withSkills = false;
  let exportAllSkills = false;
  let skillsDir = process.env.SKILLS_DIR || './skills';
  let wasm = false;
  let skillName = '';
  let ragSettingsPath = process.env.RAG_SETTINGS_PATH || DEFAULT_RAG_SETTINGS;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' && argv[i + 1]) {
      outDir = argv[++i];
    } else if (a === '--rag' && argv[i + 1]) {
      ragPath = argv[++i];
    } else if (a === '--vectors-only') {
      vectorsOnly = true;
    } else if (a === '--sqlite') {
      sqlite = true;
    } else if (a === '--with-skills') {
      withSkills = true;
    } else if (a === '--all-skills') {
      exportAllSkills = true;
      withSkills = true;
    } else if (a === '--skills-dir' && argv[i + 1]) {
      skillsDir = argv[++i];
    } else if (a === '--skill-name' && argv[i + 1]) {
      skillName = argv[++i];
    } else if (a === '--rag-settings' && argv[i + 1]) {
      ragSettingsPath = argv[++i];
    } else if (a === '--wasm') {
      wasm = true;
    } else if (a === '--help' || a === '-h') {
      console.log(`Usage: rager export [options]   (or: node scripts/export-vector-db.mjs [options])

Reads ${DEFAULT_RAG} (or RAG_PATH) and writes a portable vector export:

  manifest.json   — schema, source fingerprint, embedding model, chunking (no vectors)
  chunks.jsonl    — one JSON object per line: id, text, metadata, embedding
  vectors.jsonl   — only with --vectors-only: id, embedding per line
  sqlite/*        — only with --sqlite: sqlite-vec schema + data SQL files
  skills/*        — only with --with-skills: generated skill folders
  web/*           — only with --wasm: browser SQLite WASM worker + API

Options:
  --rag <file>     Input rag.json (default: ${DEFAULT_RAG})
  --out <dir>      Output directory (default: ${DEFAULT_OUT}, or EXPORT_DIR)
  --vectors-only   Also write vectors.jsonl (id + embedding only)
  --sqlite         Also write SQLite+vector export files (sqlite-vec)
  --with-skills    Also export generated skills under <out>/skills
  --all-skills     Also copy every skill under --skills-dir into <out>/skills/all
  --skills-dir     Source skills directory for --all-skills (default: ./skills)
  --skill-name     Override skill name (else read from rag-settings)
  --rag-settings   rag-settings JSON path (default: ${DEFAULT_RAG_SETTINGS})
  --wasm           Also write browser WASM bundle (worker + front API + OPFS)

Environment: RAG_PATH, EXPORT_DIR, RAG_SETTINGS_PATH, SKILLS_DIR`);
      process.exit(0);
    }
  }
  return {
    ragPath,
    outDir,
    vectorsOnly,
    sqlite,
    withSkills,
    exportAllSkills,
    skillsDir,
    wasm,
    skillName,
    ragSettingsPath
  };
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

function sqlQuote(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNullOrQuoted(value) {
  if (value == null) return 'NULL';
  return sqlQuote(value);
}

function sanitizeSkillName(name) {
  const n = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
  if (!n || !/^[a-z0-9][a-z0-9-]{0,62}$/.test(n)) {
    return null;
  }
  return n;
}

function loadRagSettings(settingsPath) {
  if (!settingsPath || !fs.existsSync(settingsPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (err) {
    console.error(`Invalid rag-settings JSON at ${settingsPath}: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

function resolveSkillConfig({ overrideSkillName, ragSettingsPath, outDir }) {
  const settings = loadRagSettings(ragSettingsPath);
  const root = settings?.skill && typeof settings.skill === 'object' ? settings.skill : {};
  const rawName = overrideSkillName || root.name;
  const name = sanitizeSkillName(rawName);
  if (!name) {
    console.error(
      `Missing/invalid skill name. Provide --skill-name or set skill.name in ${ragSettingsPath}.`
    );
    process.exit(1);
  }
  const description =
    (typeof root.description === 'string' && root.description.trim()) ||
    `Embedded RAG skill for ${name.replace(/-/g, ' ')}.`;
  const requestedTargets = Array.isArray(root.targets) ? root.targets : ['cursor', 'claude', 'codex'];
  const allowedTargets = new Set(['cursor', 'claude', 'codex', 'antigravity']);
  const targets = requestedTargets
    .map((t) => String(t).toLowerCase().trim())
    .filter((t) => allowedTargets.has(t));
  const uniqueTargets = [...new Set(targets.length ? targets : ['cursor', 'claude', 'codex'])];
  return {
    name,
    description,
    targets: uniqueTargets,
    ragPath: path.join(path.relative(process.cwd(), outDir), 'manifest.json').startsWith('.')
      ? path.join(path.relative(process.cwd(), outDir), 'manifest.json')
      : `./${path.join(path.relative(process.cwd(), outDir), 'manifest.json')}`
  };
}

function buildSkillMarkdown({ name, description, ragPath }) {
  const yamlDesc = String(description).replace(/\n/g, ' ').trim();
  return `---
name: ${name}
description: >-
  ${yamlDesc}
---

# ${name}

## RAG (embedded standalone export)

- **Export manifest**: \`${ragPath}\`
- **Data files**: \`manifest.json\` and \`chunks.jsonl\` in the same export folder.

### Retrieval workflow

1. Read the manifest to understand embedding model and chunk count.
2. Read chunks from \`chunks.jsonl\` and parse each line as JSON.
3. Retrieve by embeddings when available; otherwise fallback to lexical ranking.
4. Answer using retrieved chunks and cite \`chunk.id\` or \`metadata.source\`.

---

_Generated by rager export --with-skills. Skill: **${name}**._
`;
}

function writeSkillsExport(outDir, skillConfig) {
  const skillsRoot = path.join(outDir, 'skills');
  fs.mkdirSync(skillsRoot, { recursive: true });
  const body = buildSkillMarkdown(skillConfig);
  const created = [];
  for (const target of skillConfig.targets) {
    const skillDir = path.join(skillsRoot, target, skillConfig.name);
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), body);
    created.push(path.relative(outDir, skillDir));
  }
  const skillManifest = {
    generatedAt: new Date().toISOString(),
    skill: {
      name: skillConfig.name,
      description: skillConfig.description,
      ragPath: skillConfig.ragPath,
      targets: skillConfig.targets
    },
    paths: created
  };
  fs.writeFileSync(path.join(skillsRoot, 'manifest.json'), JSON.stringify(skillManifest, null, 2));
  return { skillsRoot, created };
}

function copyDirRecursive(srcDir, destDir, copiedFiles) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(src, dest, copiedFiles);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
      copiedFiles.push(dest);
    }
  }
}

function writeAllSkillsExport(outDir, skillsDir) {
  const skillsSource = path.resolve(skillsDir);
  if (!fs.existsSync(skillsSource) || !fs.statSync(skillsSource).isDirectory()) {
    console.error(`Skills directory not found: ${skillsSource}`);
    process.exit(1);
  }
  const allRoot = path.join(outDir, 'skills', 'all');
  fs.mkdirSync(allRoot, { recursive: true });
  const entries = fs.readdirSync(skillsSource, { withFileTypes: true }).filter((e) => e.isDirectory());
  const copied = [];
  for (const entry of entries) {
    const src = path.join(skillsSource, entry.name);
    const dest = path.join(allRoot, entry.name);
    copyDirRecursive(src, dest, copied);
  }
  fs.writeFileSync(
    path.join(allRoot, 'manifest.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceDir: skillsSource,
        skillCount: entries.length,
        copiedFileCount: copied.length,
        skills: entries.map((e) => e.name).sort()
      },
      null,
      2
    )
  );
  return { allRoot, skillCount: entries.length, copiedFileCount: copied.length };
}

function writeWasmExport(outDir, chunks, manifest) {
  const webDir = path.join(outDir, 'web');
  fs.mkdirSync(webDir, { recursive: true });
  const dim = chunks.find((c) => Array.isArray(c.embedding) && c.embedding.length > 0)?.embedding.length || 0;
  if (!dim) {
    console.error('Cannot create WASM export: no embedding vectors found in chunks.');
    process.exit(1);
  }
  const rowsPath = path.join(webDir, 'rows.jsonl');
  const rowLines = chunks.map((c) =>
    JSON.stringify({
      id: c.id,
      text: c.text ?? '',
      metadata: c.metadata ?? {},
      embedding: c.embedding
    })
  );
  fs.writeFileSync(rowsPath, rowLines.join('\n') + (rowLines.length ? '\n' : ''));

  const workerJs = `/* Generated by rager export --wasm */
let sqlite3;
let db;
let initialized = false;
let vectors = [];
const DEFAULT_WASM = "https://sqlite.org/wasm/sqlite3.wasm";
const DEFAULT_JS = "https://sqlite.org/wasm/sqlite3.mjs";

async function ensureSqlite(moduleUrl = DEFAULT_JS, wasmUrl = DEFAULT_WASM) {
  if (sqlite3) return sqlite3;
  const mod = await import(moduleUrl);
  sqlite3 = await mod.default({
    locateFile: (file) => (file.endsWith(".wasm") ? wasmUrl : file)
  });
  return sqlite3;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const av = a[i] || 0;
    const bv = b[i] || 0;
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function openDb(storage = "opfs") {
  const s3 = await ensureSqlite();
  if (db) return db;
  if (storage === "opfs" && s3.opfs) {
    db = new s3.oo1.OpfsDb("/rag.db");
  } else {
    db = new s3.oo1.DB(":memory:", "ct");
  }
  db.exec("CREATE TABLE IF NOT EXISTS rag_chunks (chunk_id TEXT PRIMARY KEY, text TEXT NOT NULL, metadata_json TEXT NOT NULL, embedding_json TEXT NOT NULL)");
  return db;
}

function loadVectorsFromDb() {
  vectors = [];
  const rows = db.selectArrays("SELECT chunk_id, text, metadata_json, embedding_json FROM rag_chunks");
  for (const row of rows) {
    try {
      vectors.push({
        id: row[0],
        text: row[1],
        metadata: JSON.parse(row[2]),
        embedding: JSON.parse(row[3])
      });
    } catch {
      // Skip malformed rows.
    }
  }
}

async function importRows(rowsUrl) {
  const res = await fetch(rowsUrl);
  if (!res.ok) throw new Error("Failed to fetch rows: " + res.status);
  const raw = await res.text();
  const lines = raw.split(/\\r?\\n/).filter(Boolean);
  db.exec("BEGIN");
  try {
    for (const line of lines) {
      const row = JSON.parse(line);
      db.exec({
        sql: "INSERT OR REPLACE INTO rag_chunks(chunk_id, text, metadata_json, embedding_json) VALUES(?, ?, ?, ?)",
        bind: [row.id, row.text || "", JSON.stringify(row.metadata || {}), JSON.stringify(row.embedding || [])]
      });
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  loadVectorsFromDb();
  return lines.length;
}

async function handleMessage(data) {
  const { id, type, payload } = data || {};
  try {
    if (type === "init") {
      await ensureSqlite(payload?.sqliteJsUrl, payload?.sqliteWasmUrl);
      await openDb(payload?.storage || "opfs");
      initialized = true;
      loadVectorsFromDb();
      return { id, ok: true, result: { ready: true, cachedRows: vectors.length } };
    }
    if (!initialized) throw new Error("Worker not initialized. Call init first.");
    if (type === "import") {
      const count = await importRows(payload?.rowsUrl || "./rows.jsonl");
      return { id, ok: true, result: { imported: count } };
    }
    if (type === "search") {
      const queryEmbedding = payload?.embedding || [];
      const topK = Math.max(1, Math.min(50, Number(payload?.topK || 5)));
      const scored = vectors
        .map((v) => ({
          id: v.id,
          text: v.text,
          metadata: v.metadata,
          score: cosineSimilarity(queryEmbedding, v.embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
      return { id, ok: true, result: { hits: scored } };
    }
    if (type === "stats") {
      return {
        id,
        ok: true,
        result: {
          rows: vectors.length,
          embeddingDimension: ${dim},
          sourceModel: ${JSON.stringify(manifest.embeddingModel ?? 'unknown')}
        }
      };
    }
    throw new Error("Unknown message type: " + type);
  } catch (error) {
    return { id, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

self.onmessage = async (event) => {
  const result = await handleMessage(event.data);
  self.postMessage(result);
};
`;
  fs.writeFileSync(path.join(webDir, 'rag-sqlite.worker.js'), workerJs);

  const apiJs = `/* Generated by rager export --wasm */
export class RagWasmClient {
  constructor(options = {}) {
    const workerUrl = options.workerUrl || new URL("./rag-sqlite.worker.js", import.meta.url);
    this.worker = new Worker(workerUrl, { type: "module" });
    this.seq = 0;
    this.pending = new Map();
    this.worker.onmessage = (event) => {
      const msg = event.data || {};
      const slot = this.pending.get(msg.id);
      if (!slot) return;
      this.pending.delete(msg.id);
      if (msg.ok) slot.resolve(msg.result);
      else slot.reject(new Error(msg.error || "Worker error"));
    };
  }

  call(type, payload = {}) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({ id, type, payload });
    });
  }

  init(options = {}) {
    return this.call("init", options);
  }

  importRows(rowsUrl = new URL("./rows.jsonl", import.meta.url).toString()) {
    return this.call("import", { rowsUrl });
  }

  search(embedding, topK = 5) {
    return this.call("search", { embedding, topK });
  }

  stats() {
    return this.call("stats");
  }

  destroy() {
    this.worker.terminate();
    this.pending.clear();
  }
}
`;
  fs.writeFileSync(path.join(webDir, 'rag-api.js'), apiJs);

  const readme = `# Browser WASM Export

Generated by: \`rager export --wasm\`

This folder includes:
- \`rag-sqlite.worker.js\` — Web Worker that loads SQLite WASM and persists to OPFS when available
- \`rag-api.js\` — Frontend API wrapper for init/import/search/stats
- \`rows.jsonl\` — Chunk rows with vectors for worker import

## Frontend usage

\`\`\`js
import { RagWasmClient } from "./rag-api.js";

const client = new RagWasmClient();
await client.init({
  // Optional overrides:
  // sqliteJsUrl: "https://sqlite.org/wasm/sqlite3.mjs",
  // sqliteWasmUrl: "https://sqlite.org/wasm/sqlite3.wasm",
  storage: "opfs" // or "memory"
});
await client.importRows(new URL("./rows.jsonl", import.meta.url).toString());
const result = await client.search(queryEmbedding, 8);
\`\`\`

Notes:
- Embedding dimension: ${dim}
- Embedding model: ${manifest.embeddingModel ?? 'unknown'}
- Query embeddings must be generated with the same model/profile as the exported vectors.
`;
  fs.writeFileSync(path.join(webDir, 'README.md'), readme);

  fs.writeFileSync(
    path.join(webDir, 'manifest.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceModel: manifest.embeddingModel ?? null,
        embeddingDimension: dim,
        files: {
          worker: 'rag-sqlite.worker.js',
          api: 'rag-api.js',
          rows: 'rows.jsonl'
        }
      },
      null,
      2
    )
  );
  return webDir;
}

function writeSqliteExport(outDir, chunks, manifest) {
  const sqliteDir = path.join(outDir, 'sqlite');
  fs.mkdirSync(sqliteDir, { recursive: true });

  const dim = chunks.find((c) => Array.isArray(c.embedding) && c.embedding.length > 0)?.embedding.length || 0;
  if (!dim) {
    console.error('Cannot create SQLite vector export: no embedding vectors found in chunks.');
    process.exit(1);
  }
  const badDim = chunks.find((c) => !Array.isArray(c.embedding) || c.embedding.length !== dim);
  if (badDim) {
    console.error(`Cannot create SQLite vector export: inconsistent vector dimensions (failed at chunk ${badDim.id}).`);
    process.exit(1);
  }

  const schemaSql = `-- SQLite + sqlite-vec schema generated by rager export --sqlite
CREATE TABLE IF NOT EXISTS rag_chunks (
  rowid INTEGER PRIMARY KEY,
  chunk_id TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  metadata_json TEXT,
  source TEXT,
  path TEXT,
  url TEXT
);

-- Requires sqlite-vec extension:
-- https://github.com/asg017/sqlite-vec
CREATE VIRTUAL TABLE IF NOT EXISTS rag_vec USING vec0(
  embedding float[${dim}]
);

CREATE INDEX IF NOT EXISTS rag_chunks_chunk_id_idx ON rag_chunks(chunk_id);
`;
  fs.writeFileSync(path.join(sqliteDir, 'schema.sql'), schemaSql);

  const dataLines = [];
  dataLines.push('-- SQLite data generated by rager export --sqlite');
  dataLines.push('BEGIN TRANSACTION;');
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const rowid = i + 1;
    const metadataJson = JSON.stringify(c.metadata ?? {});
    const source = c?.metadata?.source ?? null;
    const sourcePath = c?.metadata?.path ?? null;
    const url = c?.metadata?.url ?? null;
    const embeddingJson = JSON.stringify(c.embedding);
    dataLines.push(
      `INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url) VALUES (${rowid}, ${sqlQuote(c.id)}, ${sqlQuote(c.text ?? '')}, ${sqlQuote(metadataJson)}, ${sqlNullOrQuoted(source)}, ${sqlNullOrQuoted(sourcePath)}, ${sqlNullOrQuoted(url)});`
    );
    dataLines.push(
      `INSERT INTO rag_vec(rowid, embedding) VALUES (${rowid}, ${sqlQuote(embeddingJson)});`
    );
  }
  dataLines.push('COMMIT;');
  fs.writeFileSync(path.join(sqliteDir, 'data.sql'), dataLines.join('\n') + '\n');

  const readme = `# SQLite + Vector Export

Generated by: rager export --sqlite

Files:
- schema.sql
- data.sql
- manifest.json

Quick start:
1. Open sqlite and load sqlite-vec extension.
2. Run schema.sql, then data.sql.
3. Query nearest chunks with vec_distance_cosine (or vec_search helper if available).

Notes:
- Rows in rag_chunks and rag_vec share the same rowid.
- Embedding dimension: ${dim}
- Embedding model: ${manifest.embeddingModel ?? 'unknown'}
- You must embed user queries with the same embedding model/profile.
`;
  fs.writeFileSync(path.join(sqliteDir, 'README.md'), readme);

  fs.writeFileSync(path.join(sqliteDir, 'manifest.json'), JSON.stringify({
    ...manifest,
    sqlite: {
      extension: 'sqlite-vec',
      chunkTable: 'rag_chunks',
      vectorTable: 'rag_vec',
      dimension: dim,
      rowidJoin: 'rag_chunks.rowid = rag_vec.rowid'
    }
  }, null, 2));

  return sqliteDir;
}

function main() {
  const {
    ragPath,
    outDir,
    vectorsOnly,
    sqlite,
    withSkills,
    exportAllSkills,
    skillsDir,
    wasm,
    skillName,
    ragSettingsPath
  } = parseArgs(process.argv);

  if (!fs.existsSync(ragPath)) {
    console.error(`RAG file not found: ${ragPath}`);
    console.error('Run: rager build (or npm run build:rag)');
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
  if (sqlite) {
    const sqliteDir = writeSqliteExport(outDir, chunks, manifest);
    extra += `${extra ? ', ' : ', '}${path.relative(outDir, sqliteDir)}/`;
  }
  if (withSkills) {
    const skillConfig = resolveSkillConfig({
      overrideSkillName: skillName,
      ragSettingsPath,
      outDir
    });
    const skills = writeSkillsExport(outDir, skillConfig);
    extra += `${extra ? ', ' : ', '}skills(${skills.created.length})`;
  }
  if (exportAllSkills) {
    const allSkills = writeAllSkillsExport(outDir, skillsDir);
    extra += `${extra ? ', ' : ', '}all-skills(${allSkills.skillCount})`;
  }
  if (wasm) {
    const webDir = writeWasmExport(outDir, chunks, manifest);
    extra += `${extra ? ', ' : ', '}${path.relative(outDir, webDir)}/`;
  }

  console.log(
    `Exported ${chunks.length} vectors → ${outDir}/ (${path.basename(manifestPath)}, ${path.basename(chunksPath)}${extra})`
  );
}

main();
