import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createDatabase } from '@dao-xyz/sqlite3-vec';
import { createSqliteVectorSearch, search } from '../src/sqlite.mjs';

async function canUseNativeSqliteVec() {
  try {
    const db = await createDatabase({ database: ':memory:', mode: 'native' });
    await db.open();
    const statement = await db.prepare('SELECT vec_version() AS version');
    statement.get({});
    await db.close();
    return true;
  } catch {
    return false;
  }
}

async function createFixtureDatabase(database) {
  const db = await createDatabase({ database, mode: 'native' });
  await db.open();
  await db.exec(`
CREATE TABLE rag_chunks (
  rowid INTEGER PRIMARY KEY,
  chunk_id TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  metadata_json TEXT,
  source TEXT,
  path TEXT,
  url TEXT
);
CREATE VIRTUAL TABLE rag_vec USING vec0(embedding float[3]);
INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url)
  VALUES (1, 'fft', 'Fast Fourier transform bins', '{"title":"FFT"}', 'dsp', NULL, NULL);
INSERT INTO rag_vec(rowid, embedding) VALUES (1, '[1,0,0]');
INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url)
  VALUES (2, 'filter', 'Low pass filter design', '{"title":"Filter"}', 'dsp', NULL, NULL);
INSERT INTO rag_vec(rowid, embedding) VALUES (2, '[0,1,0]');
INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url)
  VALUES (3, 'noise', 'White noise generation', '{"title":"Noise"}', 'dsp', NULL, NULL);
INSERT INTO rag_vec(rowid, embedding) VALUES (3, '[0,0,1]');
`);
  await db.close();
}

async function createSqlDatasetFixture(dir) {
  const sqliteDir = path.join(dir, 'sqlite-fixture');
  await mkdir(sqliteDir, { recursive: true });
  const schemaSql = `CREATE TABLE rag_chunks (
  rowid INTEGER PRIMARY KEY,
  chunk_id TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  metadata_json TEXT,
  source TEXT,
  path TEXT,
  url TEXT
);
CREATE VIRTUAL TABLE rag_vec USING vec0(embedding float[3]);
`;
  const dataSql = `BEGIN TRANSACTION;
INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url)
  VALUES (1, 'fft', 'Fast Fourier transform bins', '{"title":"FFT"}', 'dsp', NULL, NULL);
INSERT INTO rag_vec(rowid, embedding) VALUES (1, '[1,0,0]');
INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url)
  VALUES (2, 'filter', 'Low pass filter design', '{"title":"Filter"}', 'dsp', NULL, NULL);
INSERT INTO rag_vec(rowid, embedding) VALUES (2, '[0,1,0]');
INSERT INTO rag_chunks(rowid, chunk_id, text, metadata_json, source, path, url)
  VALUES (3, 'noise', 'White noise generation', '{"title":"Noise"}', 'dsp', NULL, NULL);
INSERT INTO rag_vec(rowid, embedding) VALUES (3, '[0,0,1]');
COMMIT;
`;
  const manifest = {
    sqlite: {
      schemaFile: 'schema.sql',
      dataSqlFiles: ['data-001.sql']
    }
  };
  await writeFile(path.join(sqliteDir, 'schema.sql'), schemaSql, 'utf8');
  await writeFile(path.join(sqliteDir, 'data-001.sql'), dataSql, 'utf8');
  await writeFile(path.join(sqliteDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  return sqliteDir;
}

test('createSqliteVectorSearch returns nearest chunks from sqlite-vec', { skip: !(await canUseNativeSqliteVec()) }, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsprag-core-sqlite-'));
  const database = path.join(dir, 'rag.sqlite');
  try {
    await createFixtureDatabase(database);
    const vectorSearch = await createSqliteVectorSearch({ database, mode: 'native' });
    const response = await search(
      { query: 'fourier bins', embedding: [0.95, 0.05, 0], limit: 2 },
      [],
      { vectorSearch }
    );
    await vectorSearch.close();

    assert.equal(response.results[0].id, 'fft');
    assert.equal(response.results.length, 2);
    assert.equal(response.results[0].source, 'dsp');
    assert.equal(response.results[0].title, 'FFT');
    assert.equal(typeof response.results[0].semanticScore, 'number');
    assert.equal(typeof response.results[0].metadata.sqliteDistance, 'number');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('createSqliteVectorSearch can bootstrap from sql dataset files', { skip: !(await canUseNativeSqliteVec()) }, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsprag-core-sqlite-dataset-'));
  try {
    const sqlDatasetDir = await createSqlDatasetFixture(dir);
    const vectorSearch = await createSqliteVectorSearch({
      database: ':memory:',
      mode: 'native',
      sqlDatasetDir
    });
    const response = await search(
      { query: 'fourier bins', embedding: [0.95, 0.05, 0], limit: 2 },
      [],
      { vectorSearch }
    );
    await vectorSearch.close();
    assert.equal(response.results[0].id, 'fft');
    assert.equal(response.results.length, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
