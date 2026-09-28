// Import reviewed image_gen outputs; preserve their genuine alpha and never repaint them.
// Usage: node scripts/install-home-cooking-icons.mjs <generated-image-directory>
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const inputDirectory = process.argv[2];
if (!inputDirectory) throw new Error('Pass the directory containing the reviewed generated images.');
const spec = JSON.parse(await fs.readFile(new URL('./assets/home-cooking-icons.json', import.meta.url), 'utf8'));
const manifestPath = path.join(root, 'public/dishes/manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const buffers = [];
for (const icon of spec.icons) {
  const source = path.join(inputDirectory, icon.source);
  const metadata = await sharp(source).metadata();
  if (!metadata.hasAlpha) throw new Error(`${icon.key}: missing transparency`);
  const buffer = await sharp(source)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 }).toBuffer();
  buffers.push({ icon, buffer });
}
for (const { icon, buffer } of buffers) {
  const target = path.join(root, 'public/dishes', icon.file);
  try {
    await fs.writeFile(target, buffer, { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    if (!(await fs.readFile(target)).equals(buffer)) throw new Error(`Refusing to overwrite ${target}`);
  }
}
let group = manifest.groups.find(group => group.key === spec.group);
if (!group) {
  group = { key: spec.group, count: 0, icons: [] };
  manifest.groups.push(group);
}
for (const { key, file } of spec.icons) {
  if (!manifest.groups.some(group => group.icons.some(icon => icon.key === key))) group.icons.push({ key, file });
}
group.count = group.icons.length;
manifest.count = manifest.groups.reduce((total, group) => total + group.icons.length, 0);
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Installed ${spec.icons.length} icons. Run refresh-dish-icon-manifest.mjs for alpha QA.`);
