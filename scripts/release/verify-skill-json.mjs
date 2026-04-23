import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const skillJsonPath = path.join(repoRoot, 'skill.json');
const platformsDir = path.join(repoRoot, 'packages', 'skill-assets', 'templates', 'platforms');

const skill = JSON.parse(readFileSync(skillJsonPath, 'utf8'));
const manifests = readdirSync(platformsDir)
  .filter((name) => name.endsWith('.json') && name !== 'schema.json')
  .map((name) => name.replace(/\.json$/, ''))
  .sort();
const skillPlatforms = [...(skill.platforms ?? [])].sort();

if (JSON.stringify(manifests) !== JSON.stringify(skillPlatforms)) {
  console.error('skill.json platforms are not aligned with templates/platforms manifests.');
  console.error('manifests:', manifests.join(', '));
  console.error('skill.json:', skillPlatforms.join(', '));
  process.exit(1);
}

console.log(`skill.json verified: ${manifests.length} platforms aligned.`);
