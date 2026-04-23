# DSP RAG - Todo Backlog

This folder contains implementation tasks derived from `RAG-API.md`.

Execution order and parallelization:

## Wave 1 (sequential prerequisite)

1. `T001-monorepo-foundation.md`

`T001` is required before starting other tasks.

## Wave 2 (parallelizable after T001)

- `T002-skill-assets-templates.md`
- `T005-platform-manifests.md`
- `T006-core-package-node-browser.md`
- `T007-mcp-package-runtime.md`

These can run in parallel once workspace/package structure exists.

## Wave 3 (depends on Wave 2 outputs)

2. `T003-cli-init-command.md` (depends on `T002` + initial `T005`)
3. `T004-cli-lifecycle-commands.md` (depends on `T003`)

## Wave 4 (final convergence)

4. `T008-release-verification.md` (depends on all previous tasks)

Dependency summary:

- `T001` -> required by all
- `T002` + `T005` -> required by `T003`
- `T003` -> required by `T004`
- `T004`, `T006`, `T007`, `T005` -> required by `T008`

Definition of done (global):

- Commands in docs are runnable and tested.
- Generated files are deterministic.
- Update and uninstall are safe and idempotent.
- Platform install paths are validated.
