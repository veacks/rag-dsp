# @dsprag/core

Portable core contracts and retrieval helpers for DSP RAG workflows.

## Public API

- `normalizeText(value)` and `tokenize(value)`
- `rankCandidates(request, candidates, options?)`
- `buildCitations(ranked, options?)`
- `createSearchResponse(request, ranked, options?)`
- `search(request, seedCandidates, extensions?)`
- `createCoreRuntime(extensions?)`

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
