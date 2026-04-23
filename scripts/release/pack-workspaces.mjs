import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = process.cwd();
const packages = ['@dsprag/cli', '@dsprag/core', '@dsprag/mcp'];
const outDir = join(repoRoot, 'artifacts', 'release');
const npmCacheDir = join(repoRoot, '.npm-cache');
mkdirSync(outDir, { recursive: true });
mkdirSync(npmCacheDir, { recursive: true });

const manifest = [];
for (const workspace of packages) {
  const json = execFileSync('npm', ['pack', '-w', workspace, '--json'], {
    encoding: 'utf8',
    cwd: repoRoot,
    env: { ...process.env, npm_config_cache: npmCacheDir }
  });
  const data = JSON.parse(json);
  const filename = data[0].filename;
  const filePath = join(repoRoot, filename);
  const targetPath = join(outDir, basename(filename));
  execFileSync('cp', [filePath, targetPath], { cwd: repoRoot });
  const buf = await readFile(targetPath);
  const sha256 = createHash('sha256').update(buf).digest('hex');
  manifest.push({ workspace, file: basename(filename), sha256 });
}

writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Packed ${manifest.length} workspaces into ${outDir}`);
