import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { packageRoot as skillAssetsRoot, readBaseTemplates, renderTemplate } from '@dsprag/skill-assets';

const SKILL_ID = 'skill-generator-rag';
const INSTALLER_VERSION = '0.1.0';
const METADATA_DIR = '.dsprag';
const METADATA_FILE = 'install-manifest.json';
const RELEASES_FALLBACK = {
  latest: INSTALLER_VERSION,
  versions: [INSTALLER_VERSION]
};

function parseArgs(argv) {
  const flags = {
    ai: null,
    offline: false,
    force: false,
    global: false,
    json: false
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
    if (arg === '--json') {
      flags.json = true;
      continue;
    }
    positional.push(arg);
  }
  return { flags, positional };
}

function formatResult(command, payload, jsonOnly) {
  if (!jsonOnly) {
    if (command === 'versions') {
      console.log(`Latest: ${payload.latest}`);
      console.log(`Available: ${payload.available.join(', ')}`);
      if (payload.installed.length === 0) {
        console.log('Installed: none');
      } else {
        console.log('Installed:');
        for (const row of payload.installed) {
          console.log(`- ${row.platform} @ ${row.installerVersion}`);
        }
      }
    }
    if (command === 'update') {
      if (payload.updated.length === 0) {
        console.log('No installed platforms found.');
      } else {
        for (const row of payload.updated) {
          console.log(`Updated ${row.platform}: ${row.file}`);
        }
      }
    }
    if (command === 'uninstall') {
      if (payload.removed.length === 0) {
        console.log('Nothing to uninstall.');
      } else {
        for (const row of payload.removed) {
          console.log(`Uninstalled ${row.platform}`);
        }
      }
      if (payload.missing.length > 0) {
        console.log(`Already absent: ${payload.missing.join(', ')}`);
      }
    }
    if (command === 'init') {
      for (const row of payload.installed) {
        console.log(`Installed ${row.platform}: ${row.file}`);
      }
    }
    if (command === 'export') {
      console.log(payload.output);
    }
  }
  console.log(JSON.stringify({ command, ...payload }));
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

async function loadReleaseMetadata(offline) {
  const releasesUrl = process.env.DSPRAG_RELEASES_URL;
  if (!offline && releasesUrl) {
    try {
      const response = await fetch(releasesUrl);
      if (response.ok) {
        const body = await response.json();
        if (Array.isArray(body?.versions) && typeof body?.latest === 'string') {
          return body;
        }
      }
    } catch {
      // Fall back to local release metadata.
    }
  }
  return RELEASES_FALLBACK;
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

function removeIfEmpty(dir) {
  if (!existsSync(dir)) {
    return;
  }
  if (!lstatSync(dir).isDirectory()) {
    return;
  }
  if (readdirSync(dir).length === 0) {
    rmdirSync(dir);
  }
}

function uninstallPlatform(targetBase, platform, installEntry) {
  const managed = [...(installEntry.managedFiles ?? [])];
  const files = managed.filter((item) => !item.endsWith('/')).sort((a, b) => b.length - a.length);
  for (const relativePath of files) {
    const absolutePath = path.join(targetBase, relativePath);
    if (!existsSync(absolutePath)) {
      continue;
    }
    const st = lstatSync(absolutePath);
    if (st.isDirectory()) {
      continue;
    }
    rmSync(absolutePath, { force: true });
  }

  const skillRoot = path.join(targetBase, installEntry.root, installEntry.skillPath);
  const dataDir = path.join(skillRoot, 'data');
  removeIfEmpty(dataDir);
  removeIfEmpty(skillRoot);
}

async function runInit(flags) {
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
  formatResult('init', { installed, targetBase }, flags.json);
}

async function runVersions(flags) {
  const targetBase = flags.global ? os.homedir() : process.cwd();
  const release = await loadReleaseMetadata(flags.offline);
  const installManifest = readInstallManifest(targetBase);
  const installed = Object.values(installManifest.installs ?? {}).map((row) => ({
    platform: row.platform,
    installerVersion: row.installerVersion ?? 'unknown'
  }));
  formatResult(
    'versions',
    {
      latest: release.latest,
      available: release.versions,
      installed,
      targetBase
    },
    flags.json
  );
}

async function runUpdate(flags) {
  const targetBase = flags.global ? os.homedir() : process.cwd();
  const release = await loadReleaseMetadata(flags.offline);
  const installManifest = readInstallManifest(targetBase);
  const platforms = Object.keys(installManifest.installs ?? {});
  const updated = [];
  for (const platform of platforms) {
    const manifest = await loadManifest(platform, flags.offline);
    const file = installPlatform(targetBase, platform, manifest, true);
    updated.push({ platform, file, toVersion: release.latest });
  }
  formatResult('update', { updated, latest: release.latest, targetBase }, flags.json);
}

async function runUninstall(flags) {
  const targetBase = flags.global ? os.homedir() : process.cwd();
  const installManifest = readInstallManifest(targetBase);
  const installed = installManifest.installs ?? {};
  const targets = flags.ai ? [flags.ai] : Object.keys(installed);
  const removed = [];
  const missing = [];

  for (const platform of targets) {
    const entry = installed[platform];
    if (!entry) {
      missing.push(platform);
      continue;
    }
    uninstallPlatform(targetBase, platform, entry);
    delete installed[platform];
    removed.push({ platform });
  }

  installManifest.installs = installed;
  writeInstallManifest(targetBase, installManifest);
  formatResult('uninstall', { removed, missing, targetBase }, flags.json);
}

async function runExport(args, flags) {
  const scriptPath = path.join(process.cwd(), 'scripts', 'export-vector-db.mjs');
  if (!existsSync(scriptPath)) {
    throw new Error('Cannot find scripts/export-vector-db.mjs in the current project.');
  }
  const output = execFileSync(process.execPath, [scriptPath, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
  formatResult('export', { output }, flags.json);
}

export async function runCli(argv = process.argv.slice(2)) {
  const { positional, flags } = parseArgs(argv);
  const command = positional[0];
  if (!command) {
    throw new Error(
      'Usage: dsprag <init|versions|update|uninstall|export> [flags] (use --json for machine-readable output)'
    );
  }
  if (command === 'init') {
    await runInit(flags);
    return;
  }
  if (command === 'versions') {
    await runVersions(flags);
    return;
  }
  if (command === 'update') {
    await runUpdate(flags);
    return;
  }
  if (command === 'uninstall') {
    await runUninstall(flags);
    return;
  }
  if (command === 'export') {
    await runExport(positional.slice(1), flags);
    return;
  }
  throw new Error('Usage: dsprag <init|versions|update|uninstall|export> [flags]');
}
