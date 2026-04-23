export * from './index.mjs';

import { createDatabase } from '@dao-xyz/sqlite3-vec';

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

/**
 * Create a vectorSearch extension backed by rag_chunks + rag_vec.
 *
 * @param {{
 *   database?: string,
 *   mode?: 'auto' | 'native' | 'wasm',
 *   directory?: string,
 *   databaseName?: string,
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
