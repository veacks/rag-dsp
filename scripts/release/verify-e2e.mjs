import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createSqliteVectorSearch, search } from '../../packages/core/src/sqlite.mjs';

const repoRoot = process.cwd();
const cliBin = path.join(repoRoot, 'packages', 'cli', 'bin', 'dsprag.mjs');

function run(cmd, args, cwd) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: path.join(repoRoot, '.npm-cache') }
  }).trim();
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'dsprag-release-'));
const cliDir = path.join(tempRoot, 'cli-case');
const mcpDir = path.join(tempRoot, 'mcp-case');
execFileSync('mkdir', ['-p', cliDir, mcpDir]);

try {
  run('node', [cliBin, 'init', '--ai', 'cursor', '--offline'], cliDir);
  assert(existsSync(path.join(cliDir, '.cursor', 'rules', 'dsprag', 'SKILL.md')), 'cursor skill missing');

  run('node', [cliBin, 'init', '--ai', 'all', '--offline', '--force'], cliDir);
  const versionsOut = run('node', [cliBin, 'versions', '--offline', '--json'], cliDir);
  assert(versionsOut.includes('"command":"versions"'), 'versions output invalid');

  run('node', [cliBin, 'update', '--offline'], cliDir);
  run('node', [cliBin, 'update', '--offline'], cliDir);

  const ragPath = path.join(cliDir, 'rag.json');
  const exportDir = path.join(cliDir, 'vector-export');
  writeFileSync(
    ragPath,
    `${JSON.stringify({
      schemaVersion: 5,
      embeddingModel: 'release-smoke',
      chunks: [
        { id: 'fft', text: 'Fast Fourier transform bins', metadata: { source: 'dsp' }, embedding: [1, 0, 0] },
        { id: 'filter', text: 'Low pass filter design', metadata: { source: 'dsp' }, embedding: [0, 1, 0] },
        { id: 'noise', text: 'White noise generation', metadata: { source: 'dsp' }, embedding: [0, 0, 1] }
      ]
    })}\n`,
    'utf8'
  );
  run('node', [cliBin, 'export', '--rag', ragPath, '--out', exportDir, '--sqlite', '--wasm'], repoRoot);
  assert(existsSync(path.join(exportDir, 'sqlite', 'rag.sqlite')), 'sqlite database export missing');
  assert(existsSync(path.join(exportDir, 'web', 'rag-sqlite.worker.js')), 'wasm worker export missing');
  const vectorSearch = await createSqliteVectorSearch({
    database: path.join(exportDir, 'sqlite', 'rag.sqlite'),
    mode: 'native'
  });
  const searchResponse = await search(
    { query: 'fourier bins', embedding: [0.95, 0.05, 0], limit: 2 },
    [],
    { vectorSearch }
  );
  await vectorSearch.close();
  assert(searchResponse.results[0]?.id === 'fft', 'sqlite vector search returned wrong nearest chunk');

  const keepPath = path.join(cliDir, '.cursor', 'rules', 'dsprag', 'KEEP.txt');
  writeFileSync(keepPath, 'keep\n', 'utf8');
  run('node', [cliBin, 'uninstall'], cliDir);
  run('node', [cliBin, 'uninstall'], cliDir);
  assert(existsSync(keepPath), 'uninstall removed unmanaged file');

  const mcpPackJson = run('npm', ['pack', '-w', '@dsprag/mcp', '--json'], repoRoot);
  const mcpPack = JSON.parse(mcpPackJson)[0].filename;
  const mcpPkgRef = path.join(repoRoot, mcpPack);
  const unpackDir = path.join(tempRoot, 'mcp-unpack');
  execFileSync('mkdir', ['-p', unpackDir]);
  execFileSync('tar', ['-xzf', mcpPkgRef, '-C', unpackDir], { cwd: repoRoot });
  const extractedBin = path.join(unpackDir, 'package', 'bin', 'dsprag-mcp.mjs');

  // Validate documented npx-style execution for init/config.
  run('npm', ['exec', '--yes', '--package', mcpPkgRef, '--', 'dsprag-mcp', 'init'], mcpDir);
  run('npm', ['exec', '--yes', '--package', mcpPkgRef, '--', 'dsprag-mcp', 'config', 'set', 'port', '19093'], mcpDir);
  const show = run('npm', ['exec', '--yes', '--package', mcpPkgRef, '--', 'dsprag-mcp', 'config', 'show'], mcpDir);
  assert(show.includes('19093'), 'mcp config set/get failed');
  // Validate lifecycle start/stop from the packed artifact runtime itself.
  run('node', [extractedBin, 'start'], mcpDir);
  run('node', [extractedBin, 'stop'], mcpDir);

  console.log('Release verification smoke: OK');
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
