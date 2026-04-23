# T008 - Release and Verification

## Goal

Finalize release workflow and verify all documented commands.

## Tasks

- Add root `skill.json` metadata aligned with platform manifests.
- Add release pipeline for:
  - `@dsprag/cli`
  - `@dsprag/core`
  - `@dsprag/mcp`
- Add end-to-end tests for documented commands:
  - `dsprag init --ai cursor`
  - `dsprag init --ai all`
  - `dsprag versions`
  - `dsprag update`
  - `dsprag uninstall`
  - `npx @dsprag/mcp init/config/start/stop`
- Update top-level docs with final install and migration notes.

## Acceptance Criteria

- Docs commands match real behavior.
- Release artifacts are reproducible from CI.
- Final smoke test passes on at least macOS + Linux environments.
