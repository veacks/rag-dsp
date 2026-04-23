# T007 - `@dsprag/mcp` Runtime Package

## Goal

Create an MCP server package that supports lifecycle commands and programmatic embedding.

## Tasks

- Scaffold `packages/mcp` with bin entry.
- Implement commands:
  - `npx @dsprag/mcp init`
  - `npx @dsprag/mcp config ...`
  - `npx @dsprag/mcp start`
  - `npx @dsprag/mcp stop`
- Implement local config file management (example `.dsprag/mcp.config.json`).
- Expose programmatic API:
  - `createMcpServer(config)`
  - `start()`
  - `stop()`
- Add graceful shutdown and lock/pid strategy to avoid duplicate start.

## Acceptance Criteria

- Lifecycle commands work end-to-end from a clean project.
- `start` + `stop` are stable and idempotent.
- Import API works in a local Node project.
