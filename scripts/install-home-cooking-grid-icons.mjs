// Split reviewed image_gen sheets by connected silhouettes rather than cutting dishes at cell borders.
// Usage: node scripts/install-home-cooking-grid-icons.mjs <source-directory> [--inspect]
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Pass the generated-image directory.');
const inspectOnly = process.argv.includes('--inspect');
const spec = JSON.parse(await fs.readFile(new URL('./assets/home-cooking-grid-icons.json', import.meta.url), 'utf8'));
const manifestPath = path.join(root, 'public/dishes/manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const outputs = [];

for (const group of spec.groups) {
  const source = path.join(sourceDirectory, group.source);
  const metadata = await sharp(source).metadata();
  if (!metadata.hasAlpha) throw new Error(`${group.key}: missing alpha`);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const labels = new Int32Array(width * height);
  const queue = new Int32Array(width * height);
  const components = [];
  let id = 0;
  for (let start = 0; start < labels.length; start++) {
    if (labels[start] || data[start * 4 + 3] <= 8) continue;
    id++;
    let head = 0, tail = 1;
    queue[0] = start;
    labels[start] = id;
    let left = width, right = 0, top = height, bottom = 0;
    while (head < tail) {
      const pixel = queue[head++];
      const x = pixel % width, y = Math.floor(pixel / width);
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
      const neighbors = [];
      if (x > 0) neighbors.push(pixel - 1);
      if (x + 1 < width) neighbors.push(pixel + 1);
      if (y > 0) neighbors.push(pixel - width);
      if (y + 1 < height) neighbors.push(pixel + width);
      for (const next of neighbors) {
        if (!labels[next] && data[next * 4 + 3] > 8) {
          labels[next] = id;
          queue[tail++] = next;
        }
      }
    }
    if (tail > 1000) components.push({ id, pixels: tail, left, top, right, bottom });
  }
  console.log(JSON.stringify({ group: group.key, width, height, components }));
  if (inspectOnly) continue;
  if (components.length !== group.keys.length) throw new Error(`${group.key}: expected ${group.keys.length} separate silhouettes, got ${components.length}`);
  // Sheet layouts can drift slightly. Use row-major centers while retaining each entire silhouette.
  components.sort((a, b) => (a.top + a.bottom) - (b.top + b.bottom));
  for (let row = 0; row < group.rows; row++) {
    const rowComponents = components.slice(row * group.columns, (row + 1) * group.columns)
      .sort((a, b) => (a.left + a.right) - (b.left + b.right));
    for (let col = 0; col < group.columns; col++) {
      const component = rowComponents[col];
      const key = group.keys[row * group.columns + col];
      const left = Math.max(0, component.left - 2), top = Math.max(0, component.top - 2);
      const cropWidth = Math.min(width, component.right + 3) - left;
      const cropHeight = Math.min(height, component.bottom + 3) - top;
      const crop = Buffer.alloc(cropWidth * cropHeight * 4);
      for (let y = 0; y < cropHeight; y++) for (let x = 0; x < cropWidth; x++) {
        const sx = left + x, sy = top + y, pixel = sy * width + sx;
        // Keep the silhouette's antialiased edge, excluding other dishes and isolated background flecks.
        let belongs = labels[pixel] === component.id;
        if (!belongs && data[pixel * 4 + 3] <= 8) {
          for (let dy = -2; dy <= 2 && !belongs; dy++) for (let dx = -2; dx <= 2; dx++) {
            const nx = sx + dx, ny = sy + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && labels[ny * width + nx] === component.id) belongs = true;
          }
        }
        if (belongs) data.copy(crop, (y * cropWidth + x) * 4, pixel * 4, pixel * 4 + 4);
      }
      const image = await sharp(crop, { raw: { width: cropWidth, height: cropHeight, channels: 4 } })
        .resize(448, 448, { fit: 'contain', background: '#00000000' })
        .extend({ top: 32, bottom: 32, left: 32, right: 32, background: '#00000000' })
        .png({ compressionLevel: 9 }).toBuffer();
      outputs.push({ group: group.key, key, buffer: image });
    }
  }
}
if (!inspectOnly) {
  for (const output of outputs) {
    const file = `icons/${output.key}.png`;
    const target = path.join(root, 'public/dishes', file);
    try { await fs.writeFile(target, output.buffer, { flag: 'wx' }); }
    catch (error) {
      if (error.code !== 'EEXIST' || !(await fs.readFile(target)).equals(output.buffer)) throw error;
    }
    let group = manifest.groups.find(group => group.key === output.group);
    if (!group) { group = { key: output.group, count: 0, icons: [] }; manifest.groups.push(group); }
    if (!manifest.groups.some(group => group.icons.some(icon => icon.key === output.key))) group.icons.push({ key: output.key, file });
    group.count = group.icons.length;
  }
  manifest.count = manifest.groups.reduce((count, group) => count + group.icons.length, 0);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Installed ${outputs.length} icons. Total: ${manifest.count}. Run refresh-dish-icon-manifest.mjs.`);
}
