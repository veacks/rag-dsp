import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { createDatabase } from '@dao-xyz/sqlite3-vec';

const DEFAULT_RAG = './public/rag.json';
const DEFAULT_OUT = './packages/core/ragdataset';
const DEFAULT_RAG_SETTINGS = './sources/rag-settings.json';
const DEFAULT_SQL_MAX_MB = 45;

function parseArgs(argv) {
  let ragPath = process.env.RAG_PATH || DEFAULT_RAG;
  let outDir = process.env.EXPORT_DIR || DEFAULT_OUT;
  let vectorsOnly = false;
  let sqlite = false;
  let sqliteOnly = false;
  let sqliteDb = false;
  let withSkills = false;
  let exportAllSkills = false;
  let skillsDir = process.env.SKILLS_DIR || './skills';
  let wasm = false;
  let skillName = '';
  let ragSettingsPath = process.env.RAG_SETTINGS_PATH || DEFAULT_RAG_SETTINGS;
  let sqlMaxMb = DEFAULT_SQL_MAX_MB;
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
    } else if (a === '--sqlite-only') {
      sqlite = true;
      sqliteOnly = true;
    } else if (a === '--sqlite-db') {
      sqlite = true;
      sqliteDb = true;
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
    } else if (a === '--sql-max-mb' && argv[i + 1]) {
      sqlMaxMb = argv[++i];
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
  --sqlite-only    Write only SQLite+vector export files under <out>/sqlite
  --sqlite-db      Also generate sqlite/rag.sqlite (opt-in, off by default)
  --with-skills    Also export generated skills under <out>/skills
  --all-skills     Also copy every skill under --skills-dir into <out>/skills/all
  --skills-dir     Source skills directory for --all-skills (default: ./skills)
  --skill-name     Override skill name (else read from rag-settings)
  --rag-settings   rag-settings JSON path (default: ${DEFAULT_RAG_SETTINGS})
  --sql-max-mb     Max size per sqlite data SQL file in MB (default: ${DEFAULT_SQL_MAX_MB})
  --wasm           Also write browser WASM bundle (worker + front API + OPFS)

Environment: RAG_PATH, EXPORT_DIR, RAG_SETTINGS_PATH, SKILLS_DIR`);
      process.exit(0);
    }
  }
  const parsedSqlMaxMb = Number(sqlMaxMb);
  if (!Number.isFinite(parsedSqlMaxMb) || parsedSqlMaxMb <= 0) {
    console.error(
      `Invalid --sql-max-mb value: ${sqlMaxMb}. Expected a positive number.`
    );
    process.exit(1);
  }
  const sqlMaxBytes = Math.floor(parsedSqlMaxMb * 1024 * 1024);
  if (sqlMaxBytes <= 0) {
    console.error(
      `Invalid --sql-max-mb value: ${sqlMaxMb}. Size must be at least 1 byte.`
    );
    process.exit(1);
  }

  return {
    ragPath,
    outDir,
    vectorsOnly,
    sqlite,
    sqliteOnly,
    sqliteDb,
    withSkills,
    exportAllSkills,
    skillsDir,
    wasm,
    skillName,
    ragSettingsPath,
    sqlMaxMb: parsedSqlMaxMb,
    sqlMaxBytes
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

function writeWasmExport(outDir, manifest, sqliteManifest) {
  const webDir = path.join(outDir, 'web');
  fs.mkdirSync(webDir, { recursive: true });
  const dim = Number(sqliteManifest?.sqlite?.dimension ?? 0);
  if (!dim) {
    console.error('Cannot create WASM export: missing sqlite dimension metadata.');
    process.exit(1);
  }
  const defaultManifestPath = '../sqlite/manifest.json';

  const workerJs = `/* Generated by rager export --wasm */
import { createDatabase } from "@dao-xyz/sqlite3-vec";

let db;
let initialized = false;
let loadedManifestUrl = null;

async function openDb(directory = "/dsprag") {
  if (db) return db;
  db = await createDatabase({ mode: "wasm", directory });
  await db.open();
  return db;
}

function vectorBuffer(value) {
  return new Float32Array(value || []).buffer;
}

async function rowCount() {
  try {
    const stmt = await db.prepare("SELECT COUNT(*) AS count FROM rag_chunks");
    return stmt.get({})?.count || 0;
  } catch {
    return 0;
  }
}

async function loadSqlDataset(manifestUrl, forceReload = false) {
  const res = await fetch(manifestUrl);
  if (!res.ok) throw new Error("Failed to fetch sqlite manifest: " + res.status);
  const manifest = await res.json();
  const sqlite = manifest?.sqlite || {};
  const schemaFile = sqlite.schemaFile || "schema.sql";
  const dataFiles = Array.isArray(sqlite.dataSqlFiles) ? sqlite.dataSqlFiles : [];
  if (dataFiles.length === 0) {
    throw new Error("sqlite manifest missing sqlite.dataSqlFiles.");
  }
  if (!forceReload && (await rowCount()) > 0 && loadedManifestUrl === manifestUrl) {
    return { skipped: true, manifest };
  }
  await db.exec("BEGIN");
  try {
    if (forceReload) {
      try {
        await db.exec("DELETE FROM rag_vec; DELETE FROM rag_chunks;");
      } catch {}
    }
    const schemaRes = await fetch(new URL(schemaFile, manifestUrl).toString());
    if (!schemaRes.ok) throw new Error("Failed to fetch schema.sql: " + schemaRes.status);
    await db.exec(await schemaRes.text());
    for (const file of dataFiles) {
      const dataRes = await fetch(new URL(file, manifestUrl).toString());
      if (!dataRes.ok) throw new Error("Failed to fetch " + file + ": " + dataRes.status);
      await db.exec(await dataRes.text());
    }
    loadedManifestUrl = manifestUrl;
    await db.exec("COMMIT");
  } catch (err) {
    await db.exec("ROLLBACK");
    throw err;
  }
  return { skipped: false, manifest };
}

async function handleMessage(data) {
  const { id, type, payload } = data || {};
  try {
    if (type === "init") {
      await openDb(payload?.directory || "/dsprag");
      const bootstrap = await loadSqlDataset(payload?.manifestUrl || "${defaultManifestPath}", Boolean(payload?.forceReload));
      initialized = true;
      const versionStmt = await db.prepare("SELECT vec_version() AS version");
      return {
        id,
        ok: true,
        result: {
          ready: true,
          sqliteVec: versionStmt.get({})?.version,
          cachedRows: await rowCount(),
          manifest: bootstrap?.manifest || null,
          bootstrapped: !bootstrap?.skipped
        }
      };
    }
    if (!initialized) throw new Error("Worker not initialized. Call init first.");
    if (type === "bootstrap") {
      const bootstrap = await loadSqlDataset(payload?.manifestUrl || "${defaultManifestPath}", Boolean(payload?.forceReload));
      return { id, ok: true, result: { rows: await rowCount(), manifest: bootstrap?.manifest || null, bootstrapped: !bootstrap?.skipped } };
    }
    if (type === "search") {
      const queryEmbedding = payload?.embedding || [];
      const topK = Math.max(1, Math.min(50, Number(payload?.topK || 5)));
      const stmt = await db.prepare(\`
SELECT c.chunk_id AS id, c.text AS text, c.metadata_json AS metadata_json, c.source AS source,
       vec_distance_l2(v.embedding, ?) AS distance
FROM rag_vec v
JOIN rag_chunks c ON c.rowid = v.rowid
ORDER BY distance ASC
LIMIT ?
\`);
      const scored = stmt.all([vectorBuffer(queryEmbedding), topK]).map((row) => ({
        id: row.id,
        text: row.text,
        metadata: JSON.parse(row.metadata_json || "{}"),
        source: row.source,
        distance: row.distance,
        score: 1 / (1 + Math.max(0, Number(row.distance || 0)))
      }));
      return { id, ok: true, result: { hits: scored } };
    }
    if (type === "stats") {
      return {
        id,
        ok: true,
        result: {
          rows: await rowCount(),
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
    const manifestUrl = options.manifestUrl || new URL("${defaultManifestPath}", import.meta.url).toString();
    return this.call("init", { ...options, manifestUrl });
  }

  bootstrap(options = {}) {
    const manifestUrl = options.manifestUrl || new URL("${defaultManifestPath}", import.meta.url).toString();
    return this.call("bootstrap", { ...options, manifestUrl });
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
- \`rag-api.js\` — Frontend API wrapper for init/bootstrap/search/stats
- \`../sqlite/manifest.json\` — SQL dataset manifest loaded by worker
- \`../sqlite/schema.sql\` + \`../sqlite/data-xxx.sql\` — SQL files executed in order

The worker imports \`@dao-xyz/sqlite3-vec\`; serve it through a bundler or provide
a browser import map that resolves that package.

## Frontend usage

\`\`\`js
import { RagWasmClient } from "./rag-api.js";

const client = new RagWasmClient();
await client.init({
  directory: "/dsprag", // OPFS-backed when available, in-memory fallback otherwise
  manifestUrl: new URL("../sqlite/manifest.json", import.meta.url).toString()
});
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
          sqliteManifest: '../sqlite/manifest.json'
        }
      },
      null,
      2
    )
  );
  return webDir;
}

function renderDataSql(statements) {
  const lines = [
    '-- SQLite data generated by rager export --sqlite',
    'BEGIN TRANSACTION;',
    ...statements,
    'COMMIT;'
  ];
  return `${lines.join('\n')}\n`;
}

async function writeSqliteExport(outDir, chunks, manifest, options = {}) {
  const sqliteDir = path.join(outDir, 'sqlite');
  fs.mkdirSync(sqliteDir, { recursive: true });
  const sqlMaxBytes = Number(options.sqlMaxBytes) > 0 ? Number(options.sqlMaxBytes) : DEFAULT_SQL_MAX_MB * 1024 * 1024;
  const sqlMaxMb = Number(options.sqlMaxMb) > 0 ? Number(options.sqlMaxMb) : DEFAULT_SQL_MAX_MB;
  const includeDatabase = Boolean(options.includeDatabase);

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

  const allDataStatements = [];
  const dataSqlChunks = [];
  let currentChunkStatements = [];
  let currentChunkBytes = 0;
  const envelopeBytes = Buffer.byteLength(renderDataSql([]), 'utf8');

  function flushDataSqlChunk() {
    dataSqlChunks.push(renderDataSql(currentChunkStatements));
    currentChunkStatements = [];
    currentChunkBytes = 0;
  }

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const rowid = i + 1;
    const metadataJson = JSON.stringify(c.metadata ?? {});
    const source = c?.metadata?.source ?? null;
    const sourcePath = c?.metadata?.path ?? null;
    const url = c?.metadata?.url ?? null;
    const embeddingJson = JSON.stringify(c.embedding);
    const chunkInsert = `INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url) VALUES (${rowid}, ${sqlQuote(c.id)}, ${sqlQuote(c.text ?? '')}, ${sqlQuote(metadataJson)}, ${sqlNullOrQuoted(source)}, ${sqlNullOrQuoted(sourcePath)}, ${sqlNullOrQuoted(url)});`;
    const vecInsert = `INSERT INTO rag_vec(rowid, embedding) VALUES (${rowid}, ${sqlQuote(embeddingJson)});`;
    allDataStatements.push(chunkInsert, vecInsert);
    const rowPairBytes = Buffer.byteLength(`${chunkInsert}\n${vecInsert}\n`, 'utf8');
    const projectedBytes = envelopeBytes + currentChunkBytes + rowPairBytes;
    if (currentChunkStatements.length > 0 && projectedBytes > sqlMaxBytes) {
      flushDataSqlChunk();
    }
    currentChunkStatements.push(chunkInsert, vecInsert);
    currentChunkBytes += rowPairBytes;
  }
  if (currentChunkStatements.length > 0 || dataSqlChunks.length === 0) {
    flushDataSqlChunk();
  }

  const chunkDigits = Math.max(3, String(dataSqlChunks.length).length);
  const dataSqlFiles = dataSqlChunks.map((content, idx) => {
    const fileName = `data-${String(idx + 1).padStart(chunkDigits, '0')}.sql`;
    fs.writeFileSync(path.join(sqliteDir, fileName), content);
    return fileName;
  });

  const sqliteDatabaseFile = includeDatabase ? 'rag.sqlite' : null;
  if (includeDatabase) {
    const sqlitePath = path.join(sqliteDir, sqliteDatabaseFile);
    for (const suffix of ['', '-wal', '-shm']) {
      fs.rmSync(`${sqlitePath}${suffix}`, { force: true });
    }
    const db = await createDatabase({ database: sqlitePath, mode: 'native' });
    await db.open();
    try {
      const versionStmt = await db.prepare('SELECT vec_version() AS version');
      versionStmt.get({});
      await db.exec(schemaSql);
      const chunkStmt = await db.prepare(
        'INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url) VALUES(?, ?, ?, ?, ?, ?, ?)'
      );
      await db.exec('BEGIN TRANSACTION;');
      try {
        for (let i = 0; i < chunks.length; i++) {
          const c = chunks[i];
          const rowid = i + 1;
          const metadataJson = JSON.stringify(c.metadata ?? {});
          const source = c?.metadata?.source ?? null;
          const sourcePath = c?.metadata?.path ?? null;
          const url = c?.metadata?.url ?? null;
          const embeddingJson = JSON.stringify(c.embedding);
          chunkStmt.run([
            rowid,
            String(c.id),
            String(c.text ?? ''),
            metadataJson,
            source,
            sourcePath,
            url
          ]);
          const vecStmt = await db.prepare(
            `INSERT INTO rag_vec(rowid, embedding) VALUES(${rowid}, ?)`
          );
          vecStmt.run([embeddingJson]);
        }
        await db.exec('COMMIT;');
      } catch (error) {
        await db.exec('ROLLBACK;');
        throw error;
      }
      try {
        await db.exec('PRAGMA wal_checkpoint(TRUNCATE)');
      } catch {}
    } finally {
      await db.close();
    }
  }

  const sqliteFilesSummary = [
    'schema.sql',
    `${dataSqlFiles[0]}${dataSqlFiles.length > 1 ? ` ... ${dataSqlFiles[dataSqlFiles.length - 1]}` : ''}`
  ];
  if (sqliteDatabaseFile) sqliteFilesSummary.push(sqliteDatabaseFile);
  sqliteFilesSummary.push('manifest.json');

  const readme = `# SQLite + Vector Export

Generated by: rager export --sqlite

Files:
${sqliteFilesSummary.map((file) => `- ${file}`).join('\n')}

Quick start:
1. Open sqlite and load sqlite-vec extension.
2. Run schema.sql, then all data SQL files in order (${dataSqlFiles.join(', ')}).
3. Optional: add --sqlite-db to generate rag.sqlite for native tools that expect a DB file.
4. Query nearest chunks with vec_distance_cosine (or vec_search helper if available).

Notes:
- Rows in rag_chunks and rag_vec share the same rowid.
- Embedding dimension: ${dim}
- Embedding model: ${manifest.embeddingModel ?? 'unknown'}
- Data SQL split size: ${sqlMaxMb}MB per file (approx max bytes: ${sqlMaxBytes}).
- You must embed user queries with the same embedding model/profile.
`;
  fs.writeFileSync(path.join(sqliteDir, 'README.md'), readme);

  const sqliteManifest = {
    ...manifest,
    sqlite: {
      extension: 'sqlite-vec',
      chunkTable: 'rag_chunks',
      vectorTable: 'rag_vec',
      dimension: dim,
      rowidJoin: 'rag_chunks.rowid = rag_vec.rowid',
      schemaFile: 'schema.sql',
      database: sqliteDatabaseFile,
      dataSqlFiles,
      dataSqlMaxMb: sqlMaxMb,
      dataSqlMaxBytes: sqlMaxBytes
    }
  };
  fs.writeFileSync(path.join(sqliteDir, 'manifest.json'), JSON.stringify(sqliteManifest, null, 2));
  return { sqliteDir, sqliteManifest };
}

async function main() {
  const {
    ragPath,
    outDir,
    vectorsOnly,
    sqlite,
    sqliteOnly,
    sqliteDb,
    withSkills,
    exportAllSkills,
    skillsDir,
    wasm,
    skillName,
    ragSettingsPath,
    sqlMaxMb,
    sqlMaxBytes
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
  if (!sqliteOnly) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  const chunksPath = path.join(outDir, 'chunks.jsonl');
  if (!sqliteOnly) {
    const lines = chunks.map((c) => JSON.stringify(c));
    fs.writeFileSync(chunksPath, lines.join('\n') + (lines.length ? '\n' : ''));
  }

  let extra = '';
  if (!sqliteOnly && vectorsOnly) {
    const vecPath = path.join(outDir, 'vectors.jsonl');
    const vlines = chunks.map((c) =>
      JSON.stringify({ id: c.id, embedding: c.embedding })
    );
    fs.writeFileSync(vecPath, vlines.join('\n') + (vlines.length ? '\n' : ''));
    extra = `, ${path.basename(vecPath)}`;
  }
  if (sqlite) {
    const sqliteOutput = await writeSqliteExport(outDir, chunks, manifest, {
      sqlMaxMb,
      sqlMaxBytes,
      includeDatabase: sqliteDb
    });
    extra += `${extra ? ', ' : ', '}${path.relative(outDir, sqliteOutput.sqliteDir)}/`;
    if (!sqliteOnly && wasm) {
      const webDir = writeWasmExport(outDir, manifest, sqliteOutput.sqliteManifest);
      extra += `${extra ? ', ' : ', '}${path.relative(outDir, webDir)}/`;
    }
  }
  if (!sqliteOnly && withSkills) {
    const skillConfig = resolveSkillConfig({
      overrideSkillName: skillName,
      ragSettingsPath,
      outDir
    });
    const skills = writeSkillsExport(outDir, skillConfig);
    extra += `${extra ? ', ' : ', '}skills(${skills.created.length})`;
  }
  if (!sqliteOnly && exportAllSkills) {
    const allSkills = writeAllSkillsExport(outDir, skillsDir);
    extra += `${extra ? ', ' : ', '}all-skills(${allSkills.skillCount})`;
  }
  if (!sqliteOnly && wasm && !sqlite) {
    console.error('--wasm requires --sqlite so web assets can bootstrap from sqlite manifest + SQL files.');
    process.exit(1);
  }

  if (sqliteOnly) {
    console.log(`Exported ${chunks.length} vectors → ${outDir}/ (sqlite/)`);
  } else {
    console.log(
      `Exported ${chunks.length} vectors → ${outDir}/ (${path.basename(manifestPath)}, ${path.basename(chunksPath)}${extra})`
    );
  }
}

await main();
