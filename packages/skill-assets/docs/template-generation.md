# Template generation (T002)

`packages/skill-assets` is the source-of-truth for installer markdown assets.

## Base templates

- `templates/base/skill-content.md`
- `templates/base/quick-reference.md`

These files are platform-neutral and reusable.

## Placeholders

Supported placeholders:

- `{{skill_id}}`
- `{{title}}`
- `{{description}}`
- `{{script_path}}`
- `{{generate_command}}`
- `{{install_command}}`
- `{{quick_reference}}`

## Merge rules

The final output is built using this precedence (last wins):

1. Base template data (`assets/**/data/defaults.json`)
2. Platform manifest values (from T005 outputs)
3. Runtime overrides (CLI flags / explicit inputs)

This keeps base templates stable while allowing platform-specific install paths and command variants.
