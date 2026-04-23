# T002 - Skill Assets and Template Base

## Goal

Establish the source-of-truth templates and content blocks used by the installer.

## Tasks

- Create base templates:
  - `packages/skill-assets/templates/base/skill-content.md`
  - `packages/skill-assets/templates/base/quick-reference.md`
- Move/normalize existing skill docs, scripts, and data into `packages/skill-assets`.
- Define rendering placeholders used in markdown templates (title, description, script path).
- Document template merge rules (base + platform manifest).

## Acceptance Criteria

- Base markdown templates exist and are reusable across platforms.
- Asset source is centralized under `packages/skill-assets`.
- A short developer doc explains how output is generated from templates.
