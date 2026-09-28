// Import the reviewed generated artwork; resize only, preserving the alpha channel.
// Generated with the built-in image_gen tool; teriyaki_chicken.png is a style reference.
// Final prompt:
// Use case: stylized-concept. Asset type: square transparent PNG dish illustration for Sikurepi cooking app.
// Reference image is STYLE REFERENCE ONLY, not edit target. Create a distinct Japanese nikumaki dish:
// four browned thin pork slices rolled around green beans and orange carrot sticks, two rolls sliced
// to expose colorful vegetable cross-sections, glossy light teriyaki glaze, arranged on a small ivory
// oval plate with the same friendly face (two black eyes, small smile, pink cheeks) as reference.
// Match reference's cute warm hand-painted food icon style, strong clean silhouette, three-quarter view
// from above. Center the entire plate and food with generous transparent margins, no clipping.
// GENUINELY TRANSPARENT BACKGROUND with alpha, no checkerboard or colored backdrop.
// No external cast shadow, text, logo, watermark, cutlery, or extra objects.
// This must visibly read as meat wrapped around vegetables, not chicken slices, sushi or stir fry.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const input = process.argv[2];
if (!input) throw new Error('Pass the generated transparent PNG path.');
const metadata = await sharp(input).metadata();
if (!metadata.hasAlpha) throw new Error('The generated icon must have real transparency.');
const target = path.join(root, 'public/dishes/icons/meat_rolls.png');
await sharp(input).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(target);
const manifestPath = path.join(root, 'public/dishes/manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
if (!manifest.groups.some(group => group.icons.some(icon => icon.key === 'meat_rolls'))) {
  manifest.groups.push({ key: 'home_cooking_01', count: 1, icons: [{ key: 'meat_rolls', file: 'icons/meat_rolls.png' }] });
  manifest.count += 1;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}
console.log('Installed meat_rolls.png; run refresh-dish-icon-manifest.mjs to record alpha QA.');
