# Plan: DSP RAG Skill Distribution Model (`@dsprag/cli` + `@dsprag/core`)

## Objective

Adopt the same product model as UI/UX Pro Max:

- a dedicated CLI package to install skill files for many AI platforms
- base markdown templates + per-platform JSON manifests
- one shared core package reusable from Node.js and WASM/frontend

This plan shifts the project from a single-repo/manual setup to a versioned, installable skill ecosystem.

---

## Target install DSP RAG

### Global CLI install

```bash
npm install -g @dsprag/cli
```

### Skill install per AI assistant

```bash
dsprag init --ai claude      # Claude Code
dsprag init --ai cursor      # Cursor
dsprag init --ai windsurf    # Windsurf
dsprag init --ai antigravity # Antigravity
dsprag init --ai copilot     # GitHub Copilot
dsprag init --ai kiro        # Kiro
dsprag init --ai codex       # Codex CLI
dsprag init --ai qoder       # Qoder
dsprag init --ai roocode     # Roo Code
dsprag init --ai gemini      # Gemini CLI
dsprag init --ai trae        # Trae
dsprag init --ai opencode    # OpenCode
dsprag init --ai continue    # Continue
dsprag init --ai codebuddy   # CodeBuddy
dsprag init --ai droid       # Droid (Factory)
dsprag init --ai kilocode    # KiloCode
dsprag init --ai warp        # Warp
dsprag init --ai augment     # Augment
dsprag init --ai all         # All assistants
```

### CLI lifecycle commands

```bash
dsprag versions              # List available versions
dsprag update                # Update to latest version
dsprag init --offline        # Skip GitHub download, use bundled assets
dsprag uninstall             # Remove skill (auto-detect platform)
dsprag uninstall --ai claude # Remove specific platform
dsprag uninstall --global    # Remove from global install
```

---

## Product architecture (new)

### Monorepo packages

```
packages/
  cli/                       # @dsprag/cli (install/update/uninstall/templates)
  core/                      # @dsprag/core (search/retrieval/embeddings contracts)
  mcp/                       # @dsprag/mcp (MCP server: init/config/start/stop)
  skill-assets/              # source-of-truth skill content and templates
```

### Why split this way

- `@dsprag/cli`: distribution + platform mapping + filesystem install workflows
- `@dsprag/core`: reusable runtime logic for Node.js and browser/wasm adapters
- `@dsprag/mcp`: MCP server package runnable via `npx` or imported programmatically
- `skill-assets`: deterministic content generation (same source for every platform)

---

## Template system (same model requested)

Use a template-driven system inspired by UI/UX Pro Max:

### Base templates (`md`)

```
packages/skill-assets/templates/base/
  skill-content.md
  quick-reference.md
```

These files are the canonical text blocks reused across platforms.

### Platform manifests (`json`)

```
packages/skill-assets/templates/platforms/
  claude.json
  cursor.json
  windsurf.json
  antigravity.json
  copilot.json
  kiro.json
  codex.json
  qoder.json
  roocode.json
  gemini.json
  trae.json
  opencode.json
  continue.json
  codebuddy.json
  droid.json
  kilocode.json
  warp.json
  augment.json
```

### Platform manifest format (`platform.json`)

Use this exact shape for each file in `templates/platforms/*.json`:

```json
{
  "platform": "",
  "displayName": "",
  "installType": "full",
  "folderStructure": {
    "root": "",
    "skillPath": "",
    "filename": ""
  },
  "scriptPath": "",
  "frontmatter": {
    "name": "dsprag",
    "description": ""
  },
  "sections": {
    "quickReference": false
  },
  "title": "",
  "description": "",
  "skillOrWorkflow": "Skill"
}
```

`skillOrWorkflow` accepted values:

- `Skill`
- `Workflow`

Each platform JSON defines:

- install root folder (example: `.cursor`, `.codex`, `.github`, etc.)
- destination skill path (`skills/...` or `prompts/...`)
- filename (`SKILL.md`, `PROMPT.md`, etc.)
- script path used in generated commands
- frontmatter and rendering options (`skill` vs `workflow`, optional sections)

### Generation flow

1. Load base markdown templates
2. Load platform JSON manifest
3. Render final template for that platform
4. Copy scripts/data assets into destination skill folder
5. Write install metadata for future `update` and `uninstall`

---

## CLI behavior contract (`@dsprag/cli`)

### `dsprag init --ai <platform>`

- resolves platform manifest
- tries remote release assets first (latest stable)
- falls back to bundled assets
- supports `--offline` and `--global`
- supports `--force` (overwrite existing files)

### `dsprag versions`

- lists available released skill versions
- highlights installed version(s) locally

### `dsprag update`

- checks latest release
- upgrades installed platforms in place
- preserves local user files not owned by the installer

### `dsprag uninstall`

- auto-detects installed platform(s) from install metadata
- removes only generated files/folders from this installer
- `--ai <platform>` limits to one platform
- `--global` targets global install paths

---

## `@dsprag/core` package (Node.js + WASM-ready)

Create a standalone core package reusable by CLI, server API, and browser bundles.

### Scope

- shared RAG contracts (query/search/chat payload shape)
- chunk ranking/search helpers
- optional embedding provider adapters
- source parsing/chunking normalization
- platform-agnostic utilities (no direct filesystem coupling)

### Build targets

- `node` export (`module` + types)
- `browser` export (no Node built-ins)
- optional `wasm` companion adapter for frontend SIMD/vector paths

### Suggested exports

```ts
import {
  createSearchEngine,
  rankChunks,
  normalizeQuery,
  buildCitations,
  type SearchRequest,
  type SearchResponse
} from '@dsprag/core'
```

---

## `@dsprag/mcp` package (MCP server runtime)

Create a dedicated package to run a DSP RAG MCP server that can be initialized, configured, started, and stopped.

### Goals

- start quickly via `npx` (no global install required)
- support local project usage via import (`@dsprag/mcp`)
- provide lifecycle commands: `init`, `config`, `start`, `stop`
- store runtime config in a predictable local file (example: `.dsprag/mcp.config.json`)

### CLI examples (via `npx`)

```bash
npx @dsprag/mcp init
npx @dsprag/mcp config set port 8811
npx @dsprag/mcp config set ragPath ./public/rag.json
npx @dsprag/mcp start
npx @dsprag/mcp stop
```

### Programmatic usage (import in a project)

```ts
import { createMcpServer } from '@dsprag/mcp'

const server = await createMcpServer({
  port: 8811,
  ragPath: './public/rag.json'
})

await server.start()
// ...
await server.stop()
```

### Commands contract

- `init`: scaffold local MCP config and defaults
- `config`: read/write MCP settings (port, paths, providers, keys indirection)
- `start`: boot MCP server using current config
- `stop`: graceful shutdown of the running server

---

## Repository layout proposal

```
.
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── init.ts
│   │   │   │   ├── versions.ts
│   │   │   │   ├── update.ts
│   │   │   │   └── uninstall.ts
│   │   │   ├── installers/
│   │   │   │   ├── renderer.ts
│   │   │   │   ├── platform-resolver.ts
│   │   │   │   └── fs-writer.ts
│   │   │   └── index.ts
│   │   ├── assets/                     # built assets copied from skill-assets
│   │   └── package.json                # name: @dsprag/cli, bin: dsprag
│   ├── core/
│   │   ├── src/
│   │   ├── package.json                # name: @dsprag/core
│   │   └── tsconfig.json
│   ├── mcp/
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── init.ts
│   │   │   │   ├── config.ts
│   │   │   │   ├── start.ts
│   │   │   │   └── stop.ts
│   │   │   ├── server/
│   │   │   │   ├── create-server.ts
│   │   │   │   └── lifecycle.ts
│   │   │   └── index.ts
│   │   └── package.json                # name: @dsprag/mcp, bin: dsprag-mcp
│   └── skill-assets/
│       ├── templates/
│       │   ├── base/
│       │   │   ├── skill-content.md
│       │   │   └── quick-reference.md
│       │   └── platforms/
│       │       ├── cursor.json
│       │       ├── codex.json
│       │       └── ...
│       ├── scripts/
│       └── data/
└── skill.json
```

---

## `skill.json` contract

At repo root, add/update `skill.json` as package metadata for marketplaces and docs:

- `name`, `displayName`, `description`, `version`
- `platforms` list aligned with platform template JSON files
- install command template:
  - `npx @dsprag/cli init --ai {{platform}}`
  - or `dsprag init --ai {{platform}}` when globally installed

---

## Migration plan (phased)

### Phase 1 — Foundation

1. Create `packages/cli`, `packages/core`, `packages/skill-assets`
2. Move current skill docs/scripts/data into `skill-assets` source of truth
3. Add base templates and first platform manifests (`cursor`, `claude`, `codex`)

### Phase 2 — CLI installer

4. Implement `init`, `uninstall`, `versions`, `update`
5. Implement template renderer from `base/*.md + platforms/*.json`
6. Add bundled asset build step from `skill-assets` to `cli/assets`

### Phase 3 — Core package

7. Extract shared logic into `@dsprag/core`
8. Add dual output (Node.js + browser-friendly build)
9. Add optional wasm integration points for frontend acceleration

### Phase 4 — MCP package

10. Create `@dsprag/mcp` with `init/config/start/stop`
11. Add `npx @dsprag/mcp ...` usage and local config lifecycle
12. Expose programmatic API (`createMcpServer`) for in-project usage

### Phase 5 — Platform coverage

13. Add all platform JSON manifests listed above
14. Validate generated output path and filename for each assistant
15. Finalize install docs and release flow

---

## Verification checklist

```bash
# Install CLI locally for test
npm i -g @dsprag/cli

# Install to one platform
dsprag init --ai cursor

# Install all platforms
dsprag init --ai all

# Offline install from bundled assets
dsprag init --ai codex --offline

# Version and update
dsprag versions
dsprag update

# MCP runtime lifecycle
npx @dsprag/mcp init
npx @dsprag/mcp config set port 8811
npx @dsprag/mcp start
npx @dsprag/mcp stop

# Uninstall paths
dsprag uninstall --ai cursor
dsprag uninstall --global
```

Release is considered ready when:

- every platform manifest generates valid destination files
- `init`, `update`, `uninstall` are idempotent
- `@dsprag/core` builds and can be imported in Node.js and browser bundles
- `@dsprag/mcp` supports `npx` lifecycle (`init/config/start/stop`) and programmatic start/stop
- documentation examples match real command behavior

---

## Notes

- Keep all generation deterministic: same inputs must produce same installed files.
- Never hand-edit generated platform outputs in tests; always update base/templates and regenerate.
- Preserve user-local custom files by tracking installer-owned files in a manifest.
