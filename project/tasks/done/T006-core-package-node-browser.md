# T006 - `@dsprag/core` Node and Browser Build

## Goal

Extract reusable RAG logic into `@dsprag/core` with Node.js and browser-friendly outputs.

## Tasks

- Move shared contracts and retrieval helpers into `packages/core/src`.
- Export stable types (`SearchRequest`, `SearchResponse`, chat/retrieval contracts).
- Configure dual build output:
  - Node (`module` + types)
  - Browser-safe bundle (no Node built-ins)
- Add optional extension points for wasm/vector acceleration.
- Add unit tests for ranking and citation helpers.

## Acceptance Criteria

- `@dsprag/core` imports successfully in Node and browser build pipelines.
- Public API is documented and type-safe.
- Core tests pass in CI.
