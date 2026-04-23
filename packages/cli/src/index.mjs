import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { packageRoot as skillAssetsRoot, readBaseTemplates, renderTemplate } from '@dsprag/skill-assets';

const SKILL_ID = 'skill-generator-rag';
const INSTALLER_VERSION = '0.1.0';
const METADATA_DIR = '.dsprag';
const METADATA_FILE = 'install-manifest.json';

function parseArgs(argv) {
  const flags = {
    ai: null,
    offline: false,
    force: false,
    global: false
  };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--ai') {
      flags.ai = argv[i + 1] ?? null;
      i += 1;
      continue;
    }
    if (arg === '--offline') {
      flags.offline = true;
      continue;
    }
    if (arg === '--force') {
      flags.force = true;
      continue;
    }
    if (arg === '--global') {
      flags.global = true;
      continue;
    }
    positional.push(arg);
  }
  return { flags, positional };
}

function listLocalPlatforms() {
  const dir = path.join(skillAssetsRoot, 'templates', 'platforms');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json') && name !== 'schema.json')
    .map((name) => name.replace(/\.json$/, ''));
}

function loadLocalManifest(platform) {
  const manifestPath = path.join(skillAssetsRoot, 'templates', 'platforms', `${platform}.json`);
  if (!existsSync(manifestPath)) {
    throw new Error(`Unknown platform: ${platform}`);
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

async function loadManifest(platform, offline) {
  const remoteBase = process.env.DSPRAG_MANIFEST_BASE_URL;
  if (!offline && remoteBase) {
    const url = `${remoteBase.replace(/\/$/, '')}/${platform}.json`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fall back to local manifest if network is unavailable.
    }
  }
  return loadLocalManifest(platform);
}

function getBaseData() {
  const defaultsPath = path.join(skillAssetsRoot, 'assets', SKILL_ID, 'data', 'defaults.json');
  const quickReferencePath = path.join(skillAssetsRoot, 'assets', SKILL_ID, 'quick-reference.md');
  const defaults = JSON.parse(readFileSync(defaultsPath, 'utf8'));
  return {
    ...defaults,
    quick_reference: readFileSync(quickReferencePath, 'utf8').trim()
  };
}

function renderSkillFile(manifest) {
  const templates = readBaseTemplates();
  const baseData = getBaseData();
  const merged = {
    ...baseData,
    title: manifest.title ?? baseData.title,
    description: manifest.description ?? baseData.description
  };
  const content = renderTemplate(templates.skillContent, merged);
  const quickRefEnabled = manifest.sections?.quickReference !== false;
  if (!quickRefEnabled) {
    return content.replace(/^## Quick Reference[\s\S]*?## Install Script/m, '## Install Script');
  }
  return content;
}

function toPosixRelative(targetBase, absolutePath) {
  const relative = path.relative(targetBase, absolutePath);
  return relative.split(path.sep).join('/');
}

function readInstallManifest(targetBase) {
  const metadataPath = path.join(targetBase, METADATA_DIR, METADATA_FILE);
  if (!existsSync(metadataPath)) {
    return { installs: {} };
  }
  return JSON.parse(readFileSync(metadataPath, 'utf8'));
}

function writeInstallManifest(targetBase, data) {
  const metadataDir = path.join(targetBase, METADATA_DIR);
  mkdirSync(metadataDir, { recursive: true });
  const metadataPath = path.join(metadataDir, METADATA_FILE);
  writeFileSync(metadataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function isInstallerManaged(existingManifest, platform, relativeFile) {
  const entry = existingManifest.installs?.[platform];
  if (!entry) {
    return false;
  }
  return entry.managedFiles?.includes(relativeFile) === true;
}

function ensureWritable(targetBase, platform, absoluteFile, force, existingManifest) {
  if (!existsSync(absoluteFile)) {
    return;
  }
  const relative = toPosixRelative(targetBase, absoluteFile);
  if (!force) {
    throw new Error(`File exists (use --force): ${relative}`);
  }
  if (!isInstallerManaged(existingManifest, platform, relative)) {
    throw new Error(`Refusing to overwrite unmanaged file: ${relative}`);
  }
}

function collectFiles(dir, targetBase) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...collectFiles(full, targetBase));
      continue;
    }
    results.push(toPosixRelative(targetBase, full));
  }
  return results;
}

function installPlatform(targetBase, platform, manifest, force) {
  const existing = readInstallManifest(targetBase);
  const rootDir = path.join(targetBase, manifest.folderStructure.root);
  const skillDir = path.join(rootDir, manifest.folderStructure.skillPath);
  const skillFile = path.join(skillDir, manifest.folderStructure.filename);
  const sourceAssetsDir = path.join(skillAssetsRoot, 'assets', SKILL_ID);

  ensureWritable(targetBase, platform, skillFile, force, existing);
  mkdirSync(skillDir, { recursive: true });

  if (existsSync(path.join(skillDir, 'data'))) {
    const relativeData = toPosixRelative(targetBase, path.join(skillDir, 'data'));
    if (!force && !isInstallerManaged(existing, platform, relativeData)) {
      throw new Error(`Directory exists (use --force): ${relativeData}`);
    }
    if (force && isInstallerManaged(existing, platform, relativeData)) {
      rmSync(path.join(skillDir, 'data'), { recursive: true, force: true });
    }
  }
  writeFileSync(skillFile, `${renderSkillFile(manifest)}\n`, 'utf8');
  cpSync(path.join(sourceAssetsDir, 'data'), path.join(skillDir, 'data'), { recursive: true });
  const installScriptPath = path.join(skillDir, path.basename(manifest.scriptPath));
  const installScript = [
    '#!/usr/bin/env node',
    '',
    "console.log('This installation is managed by dsprag.');",
    "console.log('Run `dsprag init --ai " + platform + " --force` to refresh managed files.');",
    ''
  ].join('\n');
  writeFileSync(installScriptPath, installScript, 'utf8');

  const managedFiles = [
    toPosixRelative(targetBase, skillFile),
    ...collectFiles(path.join(skillDir, 'data'), targetBase),
    toPosixRelative(targetBase, installScriptPath),
    toPosixRelative(targetBase, path.join(skillDir, 'data'))
  ];

  const nextManifest = readInstallManifest(targetBase);
  nextManifest.installs[platform] = {
    platform,
    displayName: manifest.displayName,
    installedAt: new Date().toISOString(),
    installerVersion: INSTALLER_VERSION,
    skillId: SKILL_ID,
    root: manifest.folderStructure.root,
    skillPath: manifest.folderStructure.skillPath,
    filename: manifest.folderStructure.filename,
    managedFiles: Array.from(new Set(managedFiles)).sort()
  };
  writeInstallManifest(targetBase, nextManifest);
  return toPosixRelative(targetBase, skillFile);
}

export async function runCli(argv = process.argv.slice(2)) {
  const { positional, flags } = parseArgs(argv);
  const command = positional[0];
  if (command !== 'init') {
    throw new Error('Usage: dsprag init --ai <platform|all> [--offline] [--global] [--force]');
  }
  if (!flags.ai) {
    throw new Error('Missing required flag: --ai <platform|all>');
  }

  const targetBase = flags.global ? os.homedir() : process.cwd();
  const platforms = flags.ai === 'all' ? listLocalPlatforms() : [flags.ai];
  const installed = [];
  for (const platform of platforms) {
    const manifest = await loadManifest(platform, flags.offline);
    const file = installPlatform(targetBase, platform, manifest, flags.force);
    installed.push({ platform, file });
  }
  for (const item of installed) {
    console.log(`Installed ${item.platform}: ${item.file}`);
  }
}
