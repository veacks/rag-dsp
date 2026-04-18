#!/usr/bin/env node
/**
 * Copies skills/skill-generator-rag into Cursor, Claude, Codex, and Antigravity skill locations.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const SOURCE = path.join(repoRoot, 'skills', 'skill-generator-rag');

function parseArgs(argv) {
  const out = {
    all: false,
    targets: [],
    scope: 'both',
    help: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '-h' || a === '--help') out.help = true;
    else if (a === '--all') out.all = true;
    else if (a === '--targets') out.targets = next().split(',').map((s) => s.trim().toLowerCase());
    else if (a === '--scope') out.scope = next().toLowerCase();
  }
  return out;
}

function printHelp() {
  console.log(`install-skill-generator — copy skill-generator-rag into agent skill dirs

Usage:
  node scripts/install-skill-generator.mjs --all [options]

Options:
  --all            Install to all targets (cursor, claude, codex, antigravity)
  --targets <list> Comma-separated: cursor, claude, codex, antigravity
  --scope          user | project | both (default: both)

  user     — ~/.cursor/skills, ~/.claude/skills, ~/.codex/skills, ~/.gemini/antigravity/skills
  project  — ./.cursor/skills, ./.claude/skills, ./.codex/skills, ./.agents/skills (cwd)
  both     — user + project

Requires: ${SOURCE}/SKILL.md
`);
}

const TARGET_DEFS = {
  cursor: {
    user: ['.cursor', 'skills'],
    project: ['.cursor', 'skills']
  },
  claude: {
    user: ['.claude', 'skills'],
    project: ['.claude', 'skills']
  },
  codex: {
    user: ['.codex', 'skills'],
    project: ['.codex', 'skills']
  },
  antigravity: {
    user: ['.gemini', 'antigravity', 'skills'],
    project: ['.agents', 'skills']
  }
};

const SKILL_NAME = 'skill-generator-rag';

function copySkillDir(destDir) {
  if (!existsSync(path.join(SOURCE, 'SKILL.md'))) {
    console.error(`Missing source skill: ${SOURCE}/SKILL.md`);
    process.exit(1);
  }
  mkdirSync(path.dirname(destDir), { recursive: true });
  if (existsSync(destDir)) rmSync(destDir, { recursive: true });
  cpSync(SOURCE, destDir, { recursive: true });
}

function installForTarget(target, scope, projectRoot, home) {
  const def = TARGET_DEFS[target];
  if (!def) return;
  const jobs = [];
  if (scope === 'user' || scope === 'both') {
    jobs.push(path.join(home, ...def.user, SKILL_NAME));
  }
  if (scope === 'project' || scope === 'both') {
    jobs.push(path.join(projectRoot, ...def.project, SKILL_NAME));
  }
  for (const dest of jobs) {
    copySkillDir(dest);
    console.log(`Installed → ${dest}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.all && args.targets.length === 0) {
    printHelp();
    process.exit(1);
  }

  let targets = args.targets;
  if (args.all) {
    targets = ['cursor', 'claude', 'codex', 'antigravity'];
  }

  const valid = new Set(['cursor', 'claude', 'codex', 'antigravity']);
  for (const t of targets) {
    if (!valid.has(t)) {
      console.error(`Unknown target: ${t}`);
      process.exit(1);
    }
  }

  if (!['user', 'project', 'both'].includes(args.scope)) {
    console.error('--scope must be user, project, or both');
    process.exit(1);
  }

  const home = os.homedir();
  const projectRoot = process.cwd();

  for (const t of targets) {
    installForTarget(t, args.scope, projectRoot, home);
  }
}

main();
