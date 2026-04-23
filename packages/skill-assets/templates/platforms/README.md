# Platform manifests

This folder contains one JSON manifest per supported assistant platform.

## Coverage source

The canonical platform list comes from `RAG-API.md` (`dsprag init --ai <platform>` section):

- claude
- cursor
- windsurf
- antigravity
- copilot
- kiro
- codex
- qoder
- roocode
- gemini
- trae
- opencode
- continue
- codebuddy
- droid
- kilocode
- warp
- augment

## Required manifest fields

Each manifest must include:

- `platform`, `displayName`, `installType`
- `folderStructure.root|skillPath|filename`
- `scriptPath`
- `frontmatter`
- `sections.quickReference`
- `title`, `description`
- `skillOrWorkflow` (`Skill` or `Workflow`)

Schema: `templates/platforms/schema.json`

## Validation and smoke tests

Run from repo root:

```bash
npm run -w @dsprag/skill-assets validate:platform-manifests
npm run -w @dsprag/skill-assets test:render-platforms
```

The validator checks:

- platform coverage matches `RAG-API.md`
- each manifest matches schema
- `skillOrWorkflow` rejects invalid enum values

Smoke tests render one deterministic markdown output per manifest into:

- `packages/skill-assets/tests/artifacts/platform-render-smoke/*.md`
