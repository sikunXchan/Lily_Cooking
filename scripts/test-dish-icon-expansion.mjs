import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { DISH_ICON_SLUGS, getDishIconSlug, getDishIconCategory, getDishIconDisplayName } from '../src/lib/dishIcons.ts';

const spec = JSON.parse(await fs.readFile(new URL('./assets/home-cooking-grid-icons.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(await fs.readFile(new URL('../public/dishes/manifest.json', import.meta.url), 'utf8'));
const icons = manifest.groups.flatMap(group => group.icons);
assert.equal(manifest.count, 200);
assert.equal(icons.length, 200);
assert.equal(new Set(icons.map(icon => icon.key)).size, 200);
let aliases = 0;
for (const dish of spec.icons) {
  assert.ok(DISH_ICON_SLUGS.includes(dish.key));
  assert.equal(getDishIconCategory(dish.key), dish.category, dish.key);
  assert.equal(getDishIconDisplayName(dish.key, 'ja'), dish.ja);
  assert.equal(getDishIconDisplayName(dish.key, 'en').toLowerCase(), dish.en.toLowerCase());
  for (const title of [...dish.keywords, `Homemade ${dish.en}`, `手作り${dish.ja}`]) {
    assert.equal(getDishIconSlug(title), dish.key, title);
    aliases++;
  }
  const icon = icons.find(icon => icon.key === dish.key);
  assert.ok(icon, dish.key);
  assert.deepEqual(icon.qa.size, [512, 512]);
  assert.deepEqual(icon.qa.alpha_extrema, [0, 255]);
  assert.ok(icon.qa.minimum_margin >= 30, dish.key);
  await fs.access(new URL(`../public/dishes/${icon.file}`, import.meta.url));
}
for (const [title, expected] of [
  ['Stir-fried shrimp with broccoli', 'vegetable_stir_fry'],
  ['Tempura rice bowl', 'tendon'], ['Shrimp tempura', 'tempura'],
  ['French toast', 'french_toast'], ['Avocado toast', 'toast'],
  ['Pork miso soup', 'tonjiru'], ['Miso soup', 'miso_soup'],
  ['Mochi soup', 'ozoni'], ['Mochi', 'mochi'],
  ['Mapo eggplant', 'mapo_eggplant'], ['Mapo tofu', 'mapo_tofu'],
  ['Caprese salad', 'caprese'], ['Potato salad', 'salad'],
  ['Braised pork belly', 'pork_kakuni'], ['Pork and cabbage stir-fry', 'meat_stir_fry'],
]) assert.equal(getDishIconSlug(title), expected, title);
console.log(`PASS: 200 unique dish icons, ${aliases} new title cases, categories, names, alpha/margins and neighboring dish regressions.`);
