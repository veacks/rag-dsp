import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { listManifestFiles, readManifest, ROOT_DIR } from './manifest-utils.mjs';

function renderOutput(manifest) {
  const outPath = path.posix.join(
    manifest.folderStructure.root,
    manifest.folderStructure.skillPath,
    manifest.folderStructure.filename
  );

  return [
    `# ${manifest.title}`,
    '',
    manifest.description,
    '',
    `- Platform: ${manifest.platform}`,
    `- Display Name: ${manifest.displayName}`,
    `- Type: ${manifest.skillOrWorkflow}`,
    `- Script Path: ${manifest.scriptPath}`,
    `- Install Path: ${outPath}`,
    `- Quick Reference: ${manifest.sections.quickReference ? 'enabled' : 'disabled'}`
  ].join('\n');
}

function main() {
  const files = listManifestFiles();
  const outputDir = path.join(ROOT_DIR, 'tests', 'artifacts', 'platform-render-smoke');

  // This smoke test validates that every manifest can be rendered deterministically.
  for (const file of files) {
    const manifest = readManifest(file);
    const rendered = renderOutput(manifest);

    assert(rendered.includes(`# ${manifest.title}`), `${file}: titre absent du rendu`);
    assert(rendered.includes(`Platform: ${manifest.platform}`), `${file}: platform absente du rendu`);
    assert(rendered.includes(`Script Path: ${manifest.scriptPath}`), `${file}: scriptPath absent du rendu`);

    const outputFile = path.join(outputDir, file.replace(/\.json$/u, '.md'));
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, `${rendered}\n`, 'utf8');
  }

  console.log(`Render smoke OK: ${files.length} manifests rendus dans ${outputDir}`);
}

main();
