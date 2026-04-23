# T004 - CLI Lifecycle Commands

## Goal

Implement command lifecycle for installed skills.

## Tasks

- Implement `dsprag versions`:
  - list available released versions
  - show currently installed version(s)
- Implement `dsprag update`:
  - fetch latest release metadata
  - upgrade installed platforms safely
- Implement `dsprag uninstall`:
  - auto-detect installed platforms
  - support `--ai <platform>`
  - support `--global`
- Ensure uninstall removes only installer-owned files.

## Acceptance Criteria

- Commands return consistent machine-readable + human-readable output.
- Running update twice is idempotent.
- Running uninstall twice does not error and does not delete unrelated files.
