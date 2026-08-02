import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

copyFileSync(join(root, 'src/styles/lightbox.css'), join(dist, 'lightbox.css'));

const banner = '"use client";\n';

for (const file of ['index.js', 'index.cjs']) {
  const path = join(dist, file);
  const source = readFileSync(path, 'utf8');
  if (!source.startsWith('"use client"') && !source.startsWith("'use client'")) {
    writeFileSync(path, banner + source);
  }
}

console.log('postbuild: copied CSS and ensured "use client" banner');
