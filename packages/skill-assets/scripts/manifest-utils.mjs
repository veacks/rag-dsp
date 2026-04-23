import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PLATFORMS_FROM_RAG_API = [
  'claude',
  'cursor',
  'windsurf',
  'antigravity',
  'copilot',
  'kiro',
  'codex',
  'qoder',
  'roocode',
  'gemini',
  'trae',
  'opencode',
  'continue',
  'codebuddy',
  'droid',
  'kilocode',
  'warp',
  'augment'
];

export const ROOT_DIR = path.resolve(__dirname, '..');
export const PLATFORM_DIR = path.join(ROOT_DIR, 'templates/platforms');
export const SCHEMA_PATH = path.join(PLATFORM_DIR, 'schema.json');

export function listManifestFiles() {
  return fs
    .readdirSync(PLATFORM_DIR)
    .filter((name) => name.endsWith('.json') && name !== 'schema.json')
    .sort();
}

export function readManifest(filename) {
  const fullPath = path.join(PLATFORM_DIR, filename);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

export function readSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
}
