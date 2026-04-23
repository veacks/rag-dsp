# @dsprag/core

Portable core contracts and retrieval helpers for DSP RAG workflows.

## Public API

- `normalizeText(value)` and `tokenize(value)`
- `rankCandidates(request, candidates, options?)`
- `buildCitations(ranked, options?)`
- `createSearchResponse(request, ranked, options?)`
- `search(request, seedCandidates, extensions?)`
- `createCoreRuntime(extensions?)`
- `createSqliteVectorSearch(options)` from `@dsprag/core/sqlite`

## Stable contracts

- `SearchRequest`
- `SearchResponse`
- `SearchCandidate` / `RankedCandidate`
- `ChatRequest` / `ChatResponse`
- `CoreRuntimeExtensions`

Types are exported from `dist/index.d.ts` and available through package exports.

## Browser and Node support

This package ships dual ESM exports:

- Default/Node import: `dist/node/index.mjs`
- Browser condition import: `dist/browser/index.mjs`

Both outputs are free of Node-only built-ins.

## SQLite vector search

`@dsprag/core/sqlite` uses `@dao-xyz/sqlite3-vec` for SQLite vector search:

- Node: native SQLite through `better-sqlite3`.
- Browser: SQLite WASM with OPFS when available.

```js
import { createSqliteVectorSearch, search } from '@dsprag/core/sqlite';

const vectorSearch = await createSqliteVectorSearch({
  mode: 'native',
  sqlDatasetDir: './packages/core/ragdataset/sqlite'
});

const response = await search(
  { query: 'fft filters', embedding: queryEmbedding, limit: 8 },
  [],
  { vectorSearch }
);

await vectorSearch.close();
```

The caller supplies `embedding`; core does not call an embedding provider.
By default, core can bootstrap from SQL dataset files (`manifest.json`, `schema.sql`, `data-xxx.sql`).
