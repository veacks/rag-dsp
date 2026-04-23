# T005 - Platform Manifests Coverage

## Goal

Provide complete `templates/platforms/*.json` coverage and validate schema.

## Tasks

- Add one manifest per platform listed in `RAG-API.md`.
- Enforce manifest format:
  - `platform`, `displayName`, `installType`
  - `folderStructure.root|skillPath|filename`
  - `scriptPath`
  - `frontmatter`
  - `sections.quickReference`
  - `title`, `description`
  - `skillOrWorkflow` (`Skill` | `Workflow`)
- Create JSON schema and validation step in CI.
- Add smoke tests that render output for each platform.

## Acceptance Criteria

- Every platform has a valid manifest.
- Invalid `skillOrWorkflow` fails validation.
- Render tests pass for all platforms.
