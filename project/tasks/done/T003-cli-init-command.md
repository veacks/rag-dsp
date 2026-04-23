# T003 - `@dsprag/cli` Init Command

## Goal

Implement `dsprag init --ai <platform>` with online-first and offline fallback behavior.

## Tasks

- Add CLI bin `dsprag` in `@dsprag/cli`.
- Implement command parsing for:
  - `init --ai <platform>`
  - `init --ai all`
  - `init --offline`
  - `init --global`
  - `init --force`
- Build template renderer:
  - load `base/*.md`
  - load `platforms/<platform>.json`
  - produce final platform output
- Copy scripts/data assets into installed destination.
- Write install metadata manifest to support update/uninstall.

## Acceptance Criteria

- `dsprag init --ai cursor` generates expected files in target path.
- `--offline` does not require network.
- `--force` overwrites installer-managed files only.
- `--ai all` installs all declared platforms.
