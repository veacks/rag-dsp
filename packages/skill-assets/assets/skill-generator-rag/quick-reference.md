### Skill generator quick reference

- Create URL-based skill:
  - `node scripts/generate-skill.mjs --name <skill-name> --rag url --rag-url <https-url> --out <dir>`
- Create embedded skill:
  - `node scripts/generate-skill.mjs --name <skill-name> --rag embedded --rag-path ./public/rag.json --out <dir>`
- Install to all supported tools:
  - `node scripts/install-skill-generator.mjs --all`
