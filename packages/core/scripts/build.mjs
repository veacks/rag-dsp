import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const copies = [
  ['src/index.mjs', 'dist/node/index.mjs'],
  ['src/index.mjs', 'dist/browser/index.mjs'],
  ['dist/index.d.ts', 'dist/node/index.d.ts'],
  ['dist/index.d.ts', 'dist/browser/index.d.ts'],
];

for (const [srcRel, dstRel] of copies) {
  const src = resolve(root, srcRel);
  const dst = resolve(root, dstRel);
  await mkdir(dirname(dst), { recursive: true });
  await copyFile(src, dst);
}
