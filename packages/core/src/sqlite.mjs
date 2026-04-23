export * from './index.mjs';

import { createDatabase } from '@dao-xyz/sqlite3-vec';

const DEFAULT_SQL_DATASET_DIR = './packages/core/ragdataset/sqlite';
const DEFAULT_SQL_MANIFEST_URL = './sqlite/manifest.json';

function toVectorBuffer(value) {
  if (!value) {
    throw new Error('SQLite vector search requires request.embedding.');
  }
  if (value instanceof Float32Array) {
    return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  }
  if (Array.isArray(value)) {
    return new Float32Array(value).buffer;
  }
  if (ArrayBuffer.isView(value)) {
    return new Float32Array(Array.from(value)).buffer;
  }
  throw new Error('request.embedding must be a number[] or Float32Array.');
}

function parseMetadata(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeOptions(options = {}) {
  const mode = options.mode ?? 'auto';
  if (!['auto', 'native', 'wasm'].includes(mode)) {
    throw new Error(`Unsupported SQLite vector mode: ${mode}`);
  }
  const databaseName = options.databaseName ?? 'rag.sqlite';
  const directory =
    mode === 'wasm' && options.directory && options.databaseName
      ? `${String(options.directory).replace(/\/$/, '')}/${databaseName.replace(/\.sqlite(?:3)?$/i, '')}`
      : options.directory;
  return {
    ...options,
    mode,
    databaseName,
    directory,
    sqlDatasetDir: options.sqlDatasetDir ?? DEFAULT_SQL_DATASET_DIR,
    sqlManifestPath:
      options.sqlManifestPath ??
      `${String(options.sqlDatasetDir ?? DEFAULT_SQL_DATASET_DIR).replace(/\/$/, '')}/manifest.json`,
    sqlManifestUrl: options.sqlManifestUrl ?? DEFAULT_SQL_MANIFEST_URL,
    bootstrapSqlDataset: options.bootstrapSqlDataset ?? true,
    forceReloadSqlDataset: options.forceReloadSqlDataset ?? false
  };
}

async function assertVecAvailable(db) {
  try {
    const statement = await db.prepare('SELECT vec_version() AS version');
    statement.get({});
  } catch (error) {
    throw new Error(
      `sqlite-vec is not available in this database runtime: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

async function readNodeManifest(manifestPath) {
  const [{ readFile }, { resolve }] = await Promise.all([
    import('node:fs/promises'),
    import('node:path')
  ]);
  const fullPath = resolve(manifestPath);
  const raw = await readFile(fullPath, 'utf8');
  return { manifest: JSON.parse(raw), manifestPath: fullPath };
}

async function readNodeSqlBundle(manifestPath, manifest) {
  const [{ readFile }, { dirname, resolve }] = await Promise.all([
    import('node:fs/promises'),
    import('node:path')
  ]);
  const root = dirname(manifestPath);
  const schemaFile = manifest?.sqlite?.schemaFile ?? 'schema.sql';
  const dataSqlFiles = Array.isArray(manifest?.sqlite?.dataSqlFiles) ? manifest.sqlite.dataSqlFiles : [];
  if (dataSqlFiles.length === 0) {
    throw new Error('SQLite manifest has no sqlite.dataSqlFiles entries.');
  }
  const schemaSql = await readFile(resolve(root, schemaFile), 'utf8');
  const dataSql = [];
  for (const file of dataSqlFiles) {
    dataSql.push(await readFile(resolve(root, file), 'utf8'));
  }
  return { schemaSql, dataSql };
}

async function readBrowserManifest(manifestUrl) {
  const res = await fetch(manifestUrl);
  if (!res.ok) {
    throw new Error(`Unable to fetch sqlite manifest at ${manifestUrl}: ${res.status}`);
  }
  return res.json();
}

async function readBrowserSqlBundle(manifestUrl, manifest) {
  const schemaFile = manifest?.sqlite?.schemaFile ?? 'schema.sql';
  const dataSqlFiles = Array.isArray(manifest?.sqlite?.dataSqlFiles) ? manifest.sqlite.dataSqlFiles : [];
  if (dataSqlFiles.length === 0) {
    throw new Error('SQLite manifest has no sqlite.dataSqlFiles entries.');
  }
  const schemaUrl = new URL(schemaFile, manifestUrl).toString();
  const schemaRes = await fetch(schemaUrl);
  if (!schemaRes.ok) {
    throw new Error(`Unable to fetch sqlite schema at ${schemaUrl}: ${schemaRes.status}`);
  }
  const schemaSql = await schemaRes.text();
  const dataSql = [];
  for (const file of dataSqlFiles) {
    const fileUrl = new URL(file, manifestUrl).toString();
    const res = await fetch(fileUrl);
    if (!res.ok) {
      throw new Error(`Unable to fetch sqlite data at ${fileUrl}: ${res.status}`);
    }
    dataSql.push(await res.text());
  }
  return { schemaSql, dataSql };
}

async function getExistingRowCount(db) {
  try {
    const statement = await db.prepare('SELECT COUNT(*) AS count FROM rag_chunks');
    return Number(statement.get({})?.count ?? 0);
  } catch {
    return 0;
  }
}

async function bootstrapSqlDataset(db, options) {
  if (!options.bootstrapSqlDataset) return;
  const existing = await getExistingRowCount(db);
  if (!options.forceReloadSqlDataset && existing > 0) return;

  let schemaSql = '';
  let dataSql = [];
  if (options.mode === 'wasm') {
    const manifest = await readBrowserManifest(options.sqlManifestUrl);
    ({ schemaSql, dataSql } = await readBrowserSqlBundle(options.sqlManifestUrl, manifest));
  } else {
    const { manifest, manifestPath } = await readNodeManifest(options.sqlManifestPath);
    ({ schemaSql, dataSql } = await readNodeSqlBundle(manifestPath, manifest));
  }

  if (options.forceReloadSqlDataset) {
    try {
      await db.exec('DELETE FROM rag_vec; DELETE FROM rag_chunks;');
    } catch {}
  }
  await db.exec(schemaSql);
  for (const sql of dataSql) {
    await db.exec(sql);
  }
}

/**
 * Create a vectorSearch extension backed by rag_chunks + rag_vec.
 *
 * @param {{
 *   database?: string,
 *   mode?: 'auto' | 'native' | 'wasm',
 *   directory?: string,
 *   databaseName?: string,
 *   sqlDatasetDir?: string,
 *   sqlManifestPath?: string,
 *   sqlManifestUrl?: string,
 *   bootstrapSqlDataset?: boolean,
 *   forceReloadSqlDataset?: boolean,
 *   loadExtension?: string,
 *   logger?: { print?: (...args: any[]) => void, printErr?: (...args: any[]) => void },
 * }} options
 */
export async function createSqliteVectorSearch(options = {}) {
  const normalized = normalizeOptions(options);
  const db = await createDatabase({
    mode: normalized.mode,
    database: normalized.database,
    directory: normalized.directory,
    loadExtension: normalized.loadExtension,
    logger: normalized.logger,
  });
  await db.open();
  await assertVecAvailable(db);
  await bootstrapSqlDataset(db, normalized);

  const sql = `
SELECT
  c.chunk_id AS id,
  c.text AS text,
  c.metadata_json AS metadata_json,
  c.source AS source,
  c.path AS path,
  c.url AS url,
  vec_distance_l2(v.embedding, ?) AS distance
FROM rag_vec v
JOIN rag_chunks c ON c.rowid = v.rowid
ORDER BY distance ASC
LIMIT ?
`;
  const statement = await db.prepare(sql, 'dsprag-vector-search');

  async function vectorSearch(request = {}) {
    const limit = Math.max(1, Math.min(100, Number(request.limit ?? normalized.limit ?? 5)));
    const embedding = toVectorBuffer(request.embedding);
    const rows = statement.all([embedding, limit]);
    return rows
      .map((row) => {
        const distance = Number(row.distance ?? 0);
        const semanticScore = 1 / (1 + Math.max(0, distance));
        const metadata = {
          ...parseMetadata(row.metadata_json),
          sqliteDistance: distance,
        };
        return {
          id: String(row.id),
          text: String(row.text ?? ''),
          source: row.source ?? row.url ?? row.path ?? metadata.source,
          title: metadata.title,
          semanticScore,
          metadata,
        };
      })
      .filter((candidate) => candidate.semanticScore >= Number(request.minScore ?? 0));
  }

  vectorSearch.close = async () => {
    await db.close();
  };
  vectorSearch.database = db;
  return vectorSearch;
}
