#!/usr/bin/env node
/**
 * rager — CLI for build, export, Flowise upsert, static serve, and Flowise server.
 */
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadPkg() {
  const p = path.join(root, 'package.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

function prependPathToEnv(env, segment) {
  const sep = path.delimiter;
  return { ...env, PATH: `${segment}${sep}${env.PATH ?? ''}` };
}

function runNode(scriptName, args, extraEnv = {}) {
  const script = path.join(root, 'scripts', scriptName);
  if (!existsSync(script)) {
    console.error(`Missing script: ${script}`);
    process.exit(1);
  }
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, ...extraEnv }
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) reject(new Error(`Signal ${signal}`));
      else if (code === 0) resolve();
      else process.exit(code ?? 1);
    });
  });
}

function runPackageBin(name, args) {
  const binDir = path.join(root, 'node_modules', '.bin');
  if (!existsSync(binDir)) {
    console.error('node_modules/.bin not found. Run npm install in the project root.');
    process.exit(1);
  }
  return new Promise((resolve, reject) => {
    const child = spawn(name, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: prependPathToEnv(process.env, binDir),
      shell: process.platform === 'win32'
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) reject(new Error(`Signal ${signal}`));
      else if (code === 0) resolve();
      else process.exit(code ?? 1);
    });
  });
}

function printHelp() {
  const pkg = loadPkg();
  console.log(`rager v${pkg.version}

Usage:
  rager <command> [options]

Commands:
  build              Build public/rag.json from PDFs or crawled sources (embeddings)
  transcripts        Fetch YouTube transcripts into local text files
  export             Export manifest + JSONL (see: rager export --help)
  upsert             POST RAG chunks to Flowise vector upsert API
  serve [args]       Static file server (default: public -p 3333; extra args passed to serve)
  flowise [args]     Start Flowise (same as: flowise start …)
  skill-generate …   Scaffold a skill with RAG URL or embedded rag.json (→ scripts/generate-skill.mjs)
  skill-install …    Install skill-generator-rag into Cursor, Claude, Codex, Antigravity dirs

Options:
  -h, --help         Show this help
  -v, --version      Print version

Examples:
  rager build
  rager transcripts
  rager export --out ./export/vector-db
  rager upsert
  rager serve
  rager serve dist -p 8080
  rager flowise start
  rager skill-generate --name my-skill --rag embedded --rag-path ./public/rag.json --out ./.cursor/skills/my-skill
  rager skill-install --all --scope both
`);
}

async function main() {
  const argv = process.argv.slice(2);
  const first = argv[0];

  if (!first || first === '-h' || first === '--help') {
    printHelp();
    process.exit(first ? 0 : 1);
  }

  if (first === '-v' || first === '--version') {
    console.log(loadPkg().version);
    return;
  }

  const rest = argv.slice(1);

  switch (first) {
    case 'build':
      await runNode('build-rag-json.mjs', rest);
      break;
    case 'transcripts':
      await runNode('fetch-youtube-transcripts.mjs', rest);
      break;
    case 'export':
      await runNode('export-vector-db.mjs', rest);
      break;
    case 'upsert':
      await runNode('upsert-flowise.mjs', rest);
      break;
    case 'serve': {
      const serveArgs = rest.length > 0 ? rest : ['public', '-p', '3333'];
      await runPackageBin('serve', serveArgs);
      break;
    }
    case 'flowise':
      await runPackageBin('flowise', rest.length > 0 ? rest : ['start']);
      break;
    case 'skill-generate':
      await runNode('generate-skill.mjs', rest);
      break;
    case 'skill-install':
      await runNode('install-skill-generator.mjs', rest);
      break;
    default:
      console.error(`Unknown command: ${first}\n`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
