# T001 - Monorepo Foundation

## Goal

Create the monorepo structure for `@dsprag/cli`, `@dsprag/core`, `@dsprag/mcp`, and `skill-assets`.

## Tasks

- Add workspace configuration at repo root (`workspaces` or `pnpm-workspace.yaml`).
- Create package folders:
  - `packages/cli`
  - `packages/core`
  - `packages/mcp`
  - `packages/skill-assets`
- Add minimal `package.json` files for each package with name/version/type.
- Ensure each package builds or type-checks with placeholder entrypoints.

## Acceptance Criteria

- Workspace install succeeds from root.
- `npm run -w @dsprag/cli <script>` style commands resolve packages.
- Package names match plan:
  - `@dsprag/cli`
  - `@dsprag/core`
  - `@dsprag/mcp`
