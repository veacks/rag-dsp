---
name: skill-generator-rag
description: >-
  Scaffolds new agent skills with optional RAG retrieval via remote rag.json URL or embedded
  standalone index file. Use when creating or installing skills that ground answers in chunked
  embeddings, when the user asks for a skill generator, RAG-backed skills, or skill-install for
  Cursor, Claude, Codex, or Antigravity.
---

# Skill generator (RAG)

## What this skill does

Helps author **new skills** that optionally **retrieve from a RAG index** (`rag.json` shape: chunks with `text`, optional `embedding`, metadata). Two retrieval modes:

| Mode | When to use | Agent behavior |
|------|-------------|----------------|
| **RAG URL** | Index is served over HTTP(S) or a stable URL | Read `RAG_JSON_URL` in the generated skill, `fetch` the JSON, then run retrieval over chunks (similarity or keyword) before answering. |
| **Embedded** | Index lives in the repo or a known path (standalone, no server) | Read the file at `RAG_EMBEDDED_PATH` (repo-relative), parse JSON, retrieve locally. |

## Scaffold a new skill (CLI)

From the **flowise-dsp-rag** repo root (or anywhere with `node` pointing at these scripts):

```bash
node scripts/generate-skill.mjs --name my-domain-skill --rag url --rag-url https://example.com/rag.json --out ./out/my-domain-skill
node scripts/generate-skill.mjs --name my-domain-skill --rag embedded --rag-path ./public/rag.json --out ./out/my-domain-skill
```

Or via `rager`:

```bash
rager skill-generate --name my-domain-skill --rag url --rag-url https://example.com/rag.json --out ./out/my-domain-skill
```

Generated output includes `SKILL.md` with frontmatter (`name`, `description`) and RAG sections the agent must follow.

## Authoring rules for RAG-backed skills

1. **Description** must state that the skill uses RAG and name the domain; include trigger phrases.
2. **One RAG mode per skill** in the body: either URL or embedded path—do not mix without a clear branch.
3. **Retrieval**: Prefer cosine similarity on embeddings when `embedding` arrays exist and the runtime can embed the query; otherwise keyword overlap / BM25-style ranking over chunk `text`.
4. **Citation**: When answering from chunks, cite source id or `metadata.source` when present.

## Install this meta-skill (Cursor, Claude, Codex, Antigravity)

Copies `skills/skill-generator-rag/` into each tool’s skills directory so agents discover it globally and/or in the project.

```bash
node scripts/install-skill-generator.mjs --all
# or
rager skill-install --all
```

Flags:

- `--targets cursor,claude,codex,antigravity` — subset (default: all).
- `--scope user` — only user home directories (`~/.cursor/skills`, `~/.claude/skills`, `~/.codex/skills`, `~/.gemini/antigravity/skills`).
- `--scope project` — only project dirs in **current working directory** (`.cursor/skills`, `.codex/skills`, `.agents/skills`).
- `--scope both` — default: user + project.

## Path reference (install targets)

| Tool | User scope | Project scope |
|------|------------|-----------------|
| Cursor | `~/.cursor/skills/skill-generator-rag` | `./.cursor/skills/skill-generator-rag` |
| Claude | `~/.claude/skills/skill-generator-rag` | `./.claude/skills/skill-generator-rag` |
| Codex | `~/.codex/skills/skill-generator-rag` | `./.codex/skills/skill-generator-rag` |
| Antigravity | `~/.gemini/antigravity/skills/skill-generator-rag` | `./.agents/skills/skill-generator-rag` |

## Bundled flowise-dsp-rag RAG

To **build** a standalone `rag.json` for embedded mode or to host for URL mode: `rager build`, then `rager serve` (serves `public/` including `rag.json`). Point `--rag-url` at `http://localhost:3333/rag.json` for local URL mode.
