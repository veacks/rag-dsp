# flowise-dsp-rag

Build an OpenAI-embedded RAG index from PDFs or crawled pages, export it for inspection or other tools, and optionally load it into [Flowise](https://github.com/FlowiseAI/Flowise). A small static page in `public/` can load `rag.json` for quick chunk browsing (demo search uses a placeholder embedder—use Flowise or your own pipeline for real retrieval).

## Requirements

- **Node.js** 20+ (see `.nvmrc` and `package.json` `engines`)
- **OpenAI API key** for `rager build` / `npm run build:rag` (embeddings)

## CLI (`rager`)

- **In this repo:** run `node bin/rager.mjs <command>` or use the npm scripts below (they call the same entry).
- **When this package is installed** (`npm install -g flowise-dsp-rag` or as a dependency), the **`rager`** binary is linked on your `PATH`.

Commands:

| Command | Purpose |
|--------|---------|
| `rager build` | Build `public/rag.json` |
| `rager transcripts` | Fetch YouTube transcripts into `sources/transcripts/youtube` |
| `rager export` | Export manifest + JSONL (`rager export --help`) |
| `rager upsert` | Upsert chunks to Flowise |
| `rager serve` | Static server (default: `public` on port **3333**) |
| `rager flowise` | Start Flowise (same as `flowise start`) |

Global options: `rager --help`, `rager --version`.

## Setup

```bash
nvm use   # optional: switch to Node 20
cp .env.example .env
# Edit .env — at minimum set OPENAI_API_KEY
npm install
```

## Build the RAG JSON

`scripts/build-rag-json.mjs` writes `./public/rag.json` (chunked text, metadata, embeddings).

**Sources (pick one path):**

1. **URLs** — add one `http(s)` URL per line in `./sources/sites.txt` (lines starting with `#` are ignored). If this list has at least one valid URL, the build crawls those pages first (unless you set `RAG_IGNORE_SITES_TXT=1`).
2. **Local course assets (PDF + MAT + notebooks)** — put `*.pdf`, optional `*.mat`, and `.ipynb` files in your source folder (`./pdf` by default, or `RAG_SOURCE_DIR`). Local assets are merged as one resource (`RAG_LOCAL_RESOURCE_NAME`, default `dsp-course-materials`).
3. **Transcripts (optional merge)** — fetch YouTube transcripts from `./sources/youtube.txt` into `./sources/transcripts/youtube`, then `rager build` automatically merges those local text files (`RAG_MERGE_TRANSCRIPTS=1` by default).

Useful variables are documented in `.env.example` (e.g. `CRAWL_DELAY_MS`, `SITE_BASE_URL`, `PDF_PATH`).

```bash
rager transcripts   # optional: build local transcript text files first
rager build
# or: npm run build:rag
```

## Export vectors

Portable export next to the repo (manifest + JSONL):

```bash
rager export
# or: npm run export:vectors
# Defaults: RAG_PATH=./public/rag.json, EXPORT_DIR=./export/vector-db
# See: rager export --help
```

SQLite + vector export (`sqlite-vec` compatible):

```bash
rager export --sqlite
# writes ./export/vector-db/sqlite/{rag.sqlite,schema.sql,data.sql,manifest.json,README.md}
```

Data + skills export (skill name from `sources/rag-settings.json`):

```bash
rager export --sqlite --with-skills
# writes ./export/vector-db/skills/<target>/<skill-name>/SKILL.md
```

Skill naming options:

- Default: `skill.name` in `sources/rag-settings.json`
- Override from CLI: `rager export --with-skills --skill-name my-skill`

Export every skill inside the repo `skills/` folder:

```bash
rager export --all-skills
# or with a custom folder:
rager export --all-skills --skills-dir ./some/skills
```

Browser WASM export (Web Worker + SQLite WASM loader + OPFS + frontend API):

```bash
rager export --wasm
# writes ./export/vector-db/web/{rag-sqlite.worker.js,rag-api.js,rows.jsonl,manifest.json}
```

The generated worker imports `@dao-xyz/sqlite3-vec`, so browser usage should go through a bundler or an import map that resolves that package.

The forward-facing monorepo CLI exposes the same export path:

```bash
npx @dsprag/cli export --sqlite --wasm
```

Runtime SQLite vector search is available from `@dsprag/core/sqlite`. Query embeddings must be generated with the same embedding model used to build `rag.json`.

```js
import { createSqliteVectorSearch, search } from '@dsprag/core/sqlite';

const vectorSearch = await createSqliteVectorSearch({
  database: './export/vector-db/sqlite/rag.sqlite',
  mode: 'native'
});

const response = await search(
  { query: 'filters and FFT', embedding: queryEmbedding, limit: 8 },
  [],
  { vectorSearch }
);

await vectorSearch.close();
```

Standalone integration contracts:

- `contracts/manifest.schema.json` — validation schema for exported `manifest.json`
- `contracts/standalone-rag-api.md` — minimal `/search` and `/chat` API contract for plugging into Cursor, Codex, Claude, or custom clients

## Flowise

1. Start Flowise: `rager flowise` or `npm start` (or your own deployment).
2. Import the chatflow JSON from `rag-chat-flow/` (e.g. `rag-dsp-chatlow.json`) in the Flowise UI and note the chatflow ID.
3. Create an API key in the same workspace.
4. Set `FLOWISE_BASE_URL`, `FLOWISE_CHATFLOW_ID`, and `FLOWISE_API_KEY` in `.env` (see `.env.example`).
5. Upsert chunks from the built RAG file:

```bash
rager upsert
# or: npm run upsert:flowise
```

Memory vector stores in Flowise are in-RAM unless you switch to a persisted store (e.g. PGVector, Pinecone).

## Static demo (chunk browser)

Serves `public/` (includes `index.html` and `main.js`):

```bash
rager serve
# or: npm run serve:rag
# http://127.0.0.1:3333 — loads ./rag.json
```

Run `rager build` first so `public/rag.json` exists. The page’s search uses a **placeholder** embedding for demos; real Q&A should go through Flowise or an app that calls the same embedding model as the build (`text-embedding-3-small` in `scripts/build-rag-json.mjs`).

## npm scripts

These call **`rager`** under the hood (`rager build`, `rager export`, etc.):

| Script | Purpose |
|--------|---------|
| `npm start` | Start Flowise (`rager flowise`) |
| `npm run build:rag` | Generate `public/rag.json` from configured sources |
| `npm run build:transcripts` | Fetch YouTube transcripts from `sources/youtube.txt` |
| `npm run export:vectors` | Export `manifest.json` + `chunks.jsonl` (and optional `vectors.jsonl`) |
| `npm run upsert:flowise` | POST RAG chunks to Flowise vector upsert API |
| `npm run serve:rag` | Static server for `public/` on port 3333 |

## Publishing to npm

This package declares `"bin": { "rager": "./bin/rager.mjs" }` and a `"files"` list so the tarball stays small. From the repo root:

```bash
npm publish
```

Use a [scoped name](https://docs.npmjs.com/cli/v10/using-npm/scope) (`@your-scope/flowise-dsp-rag`) if the unscoped name is taken; update `"name"` in `package.json` first.

## DSPRAG Monorepo Packages

This repository now also contains scoped packages for multi-platform skill installation and MCP runtime:

- `@dsprag/cli` (`dsprag` binary)
- `@dsprag/core`
- `@dsprag/mcp` (`dsprag-mcp` binary)
- `@dsprag/skill-assets`

### Install and Init

```bash
npx @dsprag/cli init --ai cursor
npx @dsprag/cli init --ai all
```

Offline mode:

```bash
npx @dsprag/cli init --ai cursor --offline
```

Lifecycle commands:

```bash
npx @dsprag/cli versions
npx @dsprag/cli update
npx @dsprag/cli uninstall
```

### MCP Runtime Commands

```bash
npx @dsprag/mcp init
npx @dsprag/mcp config show
npx @dsprag/mcp start
npx @dsprag/mcp stop
```

### Migration Notes

- Previous ad-hoc skill installs can be migrated by running `npx @dsprag/cli init --ai <platform> --force`.
- Installer metadata is tracked in `.dsprag/install-manifest.json` to ensure safe update/uninstall behavior.
- Uninstall removes installer-managed files only; unrelated files are preserved.

## License

ISC (see `package.json`).
