#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const requiredFiles = [
  'templates/base/skill-content.md',
  'templates/base/quick-reference.md',
  'assets/skill-generator-rag/skill-content.md',
  'assets/skill-generator-rag/quick-reference.md',
  'assets/skill-generator-rag/data/defaults.json',
  'assets/skill-generator-rag/data/scripts.json',
  'docs/template-generation.md'
];

const requiredPlaceholders = ['title', 'description', 'script_path'];

for (const rel of requiredFiles) {
  readFileSync(path.join(root, rel), 'utf8');
}

const skillTpl = readFileSync(path.join(root, 'templates/base/skill-content.md'), 'utf8');
const refTpl = readFileSync(path.join(root, 'templates/base/quick-reference.md'), 'utf8');

for (const key of requiredPlaceholders) {
  const marker = `{{${key}}}`;
  if (!skillTpl.includes(marker) && !refTpl.includes(marker)) {
    throw new Error(`Missing required placeholder: ${marker}`);
  }
}

console.log('skill-assets validation: ok');
