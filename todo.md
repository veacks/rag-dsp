# RAG pipeline — backlog

Roadmap for richer retrieval beyond plain text chunking (`scripts/build-rag-json.mjs`, `public/rag.json`).

## PDF

- [ ] **Extract embedded images** from PDFs (per-page rasterization and/or XObject streams) and persist assets with stable IDs tied to source file + page + bbox/order.
- [ ] **Vision analysis** — run a vision model on each extracted figure (caption, diagram type, entities, relationships) and store structured summaries alongside embeddings.
- [ ] **Tables** — detect tabular regions; export as Markdown/CSV or structured JSON; chunk with row/column context so retrieval preserves headers and units.
- [ ] **Schemas / structured blocks** — preserve headings hierarchy, lists, footnotes, and cross-references where the parser exposes them; map to chunk metadata (`section`, `page`, `figure_id`).
- [ ] **Code in text** — detect monospace / code blocks in PDF text layer; prefer minimal splitting inside fenced or indented regions; tag chunks with `content_type: code` when reliable.
- [ ] **Full PDF feature coverage** — bookmarks/outline, annotations (where needed), multi-column reading order, and vector-vs-raster figure handling; document limits of each path in build output.

## Web (crawl / `sources/sites.txt`)

- [ ] **Images from pages** — collect `<img>` (and CSS background where practical), resolve absolute URLs, dedupe, optional download to `public/` or a manifest; skip tracking pixels by default.
- [ ] **Context for images** — for each image, attach surrounding heading, `alt`, `title`, figure caption (`<figure>` / nearby text), and parent section path for chunk text + metadata.
- [ ] **Optional vision pass** on downloaded images (same schema as PDF figures) for diagrams and screenshots.

## Cross-cutting

- [ ] **Chunk schema** — extend `rag.json` / export JSONL with optional fields: `assets[]`, `vision_summary`, `table_json`, `code_language`, `parent_section`, unified `source_kind` (`pdf` | `web`).
- [ ] **Embeddings** — multimodal strategy: text-only embeddings for captions + vision summaries, or dedicated image embeddings if the stack supports them; align with Flowise upsert and chatflow.
- [ ] **Cost & limits** — env flags for max images per doc, vision model choice, and skipping vision for text-only builds.
