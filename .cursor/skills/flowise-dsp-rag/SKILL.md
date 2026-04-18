---
name: flowise-dsp-rag
description: >-
  Builds OpenAI-embedded RAG (`public/rag.json`) from crawled URLs or local PDFs,
  exports vectors, upserts into Flowise, and serves a static chunk browser. Use when
  editing `scripts/build-rag-json.mjs`, `sources/sites.txt`, PDF sources, `.env`
  RAG variables, Flowise upsert, `rag-chat-flow/*.json`, or `public/main.js`.
---

# flowise-dsp-rag

## Source modes (pick one per build)

**URL mode** — crawl and chunk web pages:

- Add one `http(s)` URL per line in `./sources/sites.txt` (`#` = comment).
- If the file has at least one valid URL, the build uses **URLs**, not PDFs.
- To force PDFs instead: set `RAG_IGNORE_SITES_TXT=1` in `.env`.
- Optional: `CRAWL_DELAY_MS`, `SITE_BASE_URL` (see `.env.example`).

**Embedded index mode** (local documents + vectors in `rag.json`):

- Put `*.pdf` in `./pdf`, or set `RAG_SOURCE_DIR`.
- If no sites (or sites ignored) and no PDFs in the folder, a single file via `PDF_PATH` (default `./DesigningAudioEffectPlugins.pdf` if present).
- `npm run build:rag` chunks text and calls OpenAI embeddings (`text-embedding-3-small` in `scripts/build-rag-json.mjs`); vectors are **embedded** in each chunk in `rag.json`.

## Commands

| Command | Purpose |
|--------|---------|
| `npm run build:rag` | Produce `./public/rag.json` |
| `npm run export:vectors` | Manifest + JSONL next to repo (`RAG_PATH`, `EXPORT_DIR`) |
| `npm run upsert:flowise` | POST chunks to Flowise (`FLOWISE_*` in `.env`) |
| `npm run serve:rag` | Static server for `public/` (port 3333) |
| `npm start` | Run Flowise |

## Flowise

1. Import `rag-chat-flow/*.json`, note chatflow ID, create API key in the workspace.
2. Set `FLOWISE_BASE_URL`, `FLOWISE_CHATFLOW_ID`, `FLOWISE_API_KEY` (and optional `FLOWISE_FLOW_JSON` / `FLOWISE_STOP_NODE_ID`).
3. Run `npm run upsert:flowise` after `build:rag`.

## Static demo (`public/`)

`main.js` loads `./rag.json` and uses a **placeholder** embedder for browser search; real retrieval should match the build embedding model or use Flowise.

## Files to touch

- Crawl list: `sources/sites.txt`
- Build logic: `scripts/build-rag-json.mjs`
- Env: `.env` (copy from `.env.example`)
- Chatflow export: `rag-chat-flow/`
