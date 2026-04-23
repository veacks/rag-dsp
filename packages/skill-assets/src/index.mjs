import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const packageRoot = path.resolve(__dirname, '..');
export const templatesRoot = path.join(packageRoot, 'templates', 'base');
export const assetsRoot = path.join(packageRoot, 'assets');

export const PLACEHOLDERS = Object.freeze([
  'skill_id',
  'title',
  'description',
  'script_path',
  'generate_command',
  'install_command',
  'quick_reference'
]);

export function readBaseTemplates() {
  return {
    skillContent: readFileSync(path.join(templatesRoot, 'skill-content.md'), 'utf8'),
    quickReference: readFileSync(path.join(templatesRoot, 'quick-reference.md'), 'utf8')
  };
}

export function renderTemplate(template, variables) {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_m, key) => {
    if (!(key in variables)) {
      throw new Error(`Missing template variable: ${key}`);
    }
    return String(variables[key]);
  });
}

// Merge order: base template <- platform manifest <- runtime overrides.
export function mergeTemplateData(baseData = {}, platformManifest = {}, runtimeOverrides = {}) {
  return {
    ...baseData,
    ...platformManifest,
    ...runtimeOverrides
  };
}
