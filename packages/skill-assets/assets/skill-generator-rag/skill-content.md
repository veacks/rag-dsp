# Skill generator (RAG)

## What this skill does

Scaffolds new agent skills with optional retrieval from a `rag.json` index.

## RAG modes

- URL mode: fetches `rag.json` from `RAG_JSON_URL`.
- Embedded mode: reads local `RAG_EMBEDDED_PATH`.

## Retrieval workflow

1. Load index data.
2. Normalize chunks (`id`, `text`, optional `embedding`, `metadata`).
3. Rank chunks from query (embedding similarity when available, keyword fallback).
4. Answer with source-aware citations when available.

## Install targets

Supported targets are driven by platform manifests merged at render time.
