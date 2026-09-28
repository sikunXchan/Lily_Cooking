import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { getSwipeAxis, clampDeleteOffset } from '../src/lib/swipeGesture.ts';
import { keepScreenAwake } from '../src/lib/screenWakeLock.ts';
import { getDishIconSlug, getDishIconDisplayName, getDishIconCategory } from '../src/lib/dishIcons.ts';

for (const [dx, dy, expected] of [
  [0, 0, 'pending'], [5, 4, 'pending'], [-9, 3, 'pending'],
  [-14, 3, 'horizontal'], [60, 5, 'horizontal'], [-8, 40, 'vertical'],
  [-40, 80, 'vertical'], [-20, 20, 'vertical'], [-35, 25, 'vertical'],
]) assert.equal(getSwipeAxis(dx, dy), expected);
// Once a scroll is classified as vertical, later sideways motion is ignored.
let axis = 'pending';
for (const [dx, dy] of [[1, 3], [-3, 20], [-80, 40]]) {
  if (axis === 'pending') axis = getSwipeAxis(dx, dy);
}
assert.equal(axis, 'vertical');
assert.equal(clampDeleteOffset(-200), -76);
assert.equal(clampDeleteOffset(10), 0);
assert.equal(clampDeleteOffset(-40), -40);

const dishes = [
  ['和風おろしハンバーグ', 'hamburger_steak'], ['豆腐ハンバーグ', 'hamburger_steak'],
  ['Juicy hamburger steak with mushroom sauce', 'hamburger_steak'],
  ['Salisbury steak', 'hamburger_steak'], ['Tofu hamburg', 'hamburger_steak'],
  ['ほくほく肉じゃが', 'nikujaga'], ['Nikujaga with snow peas', 'nikujaga'],
  ['Japanese beef and potato stew', 'nikujaga'],
  ['トマト煮込みロールキャベツ', 'cabbage_rolls'], ['Stuffed cabbage rolls', 'cabbage_rolls'],
  ['豚ロースの生姜焼き', 'ginger_pork'], ['豚肉のしょうが焼き', 'ginger_pork'],
  ['Ginger-glazed pork', 'ginger_pork'], ['Pork ginger set meal', 'ginger_pork'],
  ['Shōgayaki', 'ginger_pork'],
  ['ふわとろオムライス', 'omurice'], ['Omurice with tomato sauce', 'omurice'],
  ['Japanese omelette rice', 'omurice'],
  ['だし巻き卵', 'tamagoyaki'], ['甘い玉子焼き', 'tamagoyaki'],
  ['Japanese rolled omelette', 'tamagoyaki'], ['Tamagoyaki', 'tamagoyaki'],
  ['タルタルたっぷりチキン南蛮', 'chicken_nanban'], ['Chicken nanban with tartar sauce', 'chicken_nanban'],
  ['海老とマカロニのグラタン', 'gratin'], ['きのこドリア', 'gratin'],
  ['Potato gratin', 'gratin'], ['Chicken doria', 'gratin'],
  ['しいたけ入り茶碗蒸し', 'chawanmushi'], ['Chawanmushi', 'chawanmushi'],
  ['Savory egg custard', 'chawanmushi'],
  ['ぷりぷりエビチリ', 'shrimp_chili'], ['海老のチリソース煮', 'shrimp_chili'],
  ['Shrimp in chili sauce', 'shrimp_chili'], ['Chilli shrimp', 'shrimp_chili'],
  // Neighboring generic dishes must retain their own images.
  ['Hamburger with cheese', 'burger'], ['Grilled beef steak', 'steak'],
  ['Beef and potato stew', 'stew'], ['Vegetable omelette', 'omelet'],
  ['Scrambled egg', 'egg_dish'], ['Lasagna', 'baked_pasta'],
  ['Chocolate custard', 'custard'], ['Stir-fried pork with ginger', 'meat_stir_fry'],
  ['いんげんとにんじんの肉巻き', 'meat_rolls'],
  ['えのきの豚バラ巻き', 'meat_rolls'], ['アスパラのベーコン巻き', 'meat_rolls'],
  ['Teriyaki pork-wrapped asparagus', 'meat_rolls'],
  ['Green beans wrapped in beef', 'meat_rolls'], ['Japanese pork rolls', 'meat_rolls'],
  ['鶏ももの照り焼き', 'teriyaki_chicken'], ['Chicken teriyaki', 'teriyaki_chicken'],
  ['豚バラとキャベツの旨辛炒め', 'meat_stir_fry'],
  ['Stir-fried chicken with broccoli', 'meat_stir_fry'],
  ['Beef and vegetable stir-fry', 'meat_stir_fry'],
  ['Stir-fried tofu and mushrooms', 'vegetable_stir_fry'],
  ['Vegetable stir-fry', 'vegetable_stir_fry'], ['Fried chicken', 'fried_chicken'],
  ['Chicken fried rice', 'fried_rice'], ['Stir-fried noodles with pork', 'noodle_stir_fry'],
  ['Grilled lemon chicken', 'grilled_chicken'], ['Lemon roasted chicken', 'roast_chicken'],
  ['Salmon sautéed with herbs', 'grilled_fish'], ['Pan-seared cod with lemon', 'grilled_fish'],
  ['Steamed broccoli', 'steamed_vegetables'], ['Steamed white rice', 'plain_rice'],
  ['Tofu salad', 'salad'], ['Lentil soup', 'bean_soup'], ['Tomato soup with tofu', 'tomato_soup'],
  ['Creamy chicken pasta', 'pasta'], ['Pork curry', 'curry_rice'], ['Miso soup', 'miso_soup'],
  ['Black tea', 'hot_drink'], ['Steamed buns', 'steamed_bun'], ['Crepes', 'crepe'],
  ['Avocado toast', 'toast'], ['Avocado baked with cheese', 'baked_dish'],
  ['Photograph', null], ['Steamed', null],
];
for (const [title, expected] of dishes) assert.equal(getDishIconSlug(title), expected, title);
for (const [slug, expected] of [
  ['hamburger_steak', 'meat'], ['nikujaga', 'soup_stew'], ['cabbage_rolls', 'soup_stew'],
  ['ginger_pork', 'meat'], ['omurice', 'rice'], ['tamagoyaki', 'egg_bean'],
  ['chicken_nanban', 'meat'], ['gratin', 'soup_stew'], ['chawanmushi', 'egg_bean'],
  ['shrimp_chili', 'seafood'],
]) {
  assert.equal(getDishIconCategory(slug), expected, slug);
  assert.ok(getDishIconDisplayName(slug, 'ja'));
  assert.ok(getDishIconDisplayName(slug, 'en'));
}
assert.equal(getDishIconDisplayName('meat_rolls', 'ja'), '肉巻き');
assert.ok(getDishIconDisplayName('meat_rolls', 'en'));
for (const slug of new Set(dishes.map(([, slug]) => slug).filter(Boolean))) {
  await fs.access(new URL(`../public/dishes/icons/${slug}.png`, import.meta.url));
}

class FakeDocument extends EventTarget {
  visibilityState = 'visible';
  visibility(state) {
    this.visibilityState = state;
    this.dispatchEvent(new Event('visibilitychange'));
  }
}
class FakeLock extends EventTarget {
  released = false;
  releases = 0;
  async release() {
    this.releases++;
    this.released = true;
    this.dispatchEvent(new Event('release'));
  }
}
const tick = () => new Promise(resolve => setImmediate(resolve));
{
  const doc = new FakeDocument();
  const locks = [];
  const api = { request: async type => {
    assert.equal(type, 'screen');
    const lock = new FakeLock(); locks.push(lock); return lock;
  } };
  const cleanup = keepScreenAwake(doc, api);
  await tick();
  assert.equal(locks.length, 1);
  doc.visibility('visible'); await tick();
  assert.equal(locks.length, 1, 'No duplicate lock');
  doc.visibility('hidden'); await tick();
  assert.equal(locks[0].releases, 1);
  doc.visibility('visible'); await tick();
  assert.equal(locks.length, 2);
  cleanup(); await tick();
  assert.equal(locks[1].releases, 1);
  doc.visibility('visible'); await tick();
  assert.equal(locks.length, 2, 'Removed listener after close');
}
{
  const doc = new FakeDocument();
  let resolveRequest;
  const cleanup = keepScreenAwake(doc, { request: () => new Promise(resolve => { resolveRequest = resolve; }) });
  cleanup();
  const lock = new FakeLock(); resolveRequest(lock); await tick();
  assert.equal(lock.releases, 1, 'Release a request that completes after unmount');
}
{
  const doc = new FakeDocument();
  let resolveFirst;
  let calls = 0;
  const first = new FakeLock(), second = new FakeLock();
  const cleanup = keepScreenAwake(doc, { request: () => {
    calls++;
    return calls === 1 ? new Promise(resolve => { resolveFirst = resolve; }) : Promise.resolve(second);
  } });
  doc.visibility('hidden'); doc.visibility('visible');
  resolveFirst(first); await tick();
  assert.equal(first.releases, 1);
  assert.equal(calls, 2, 'Reacquire after visibility changes during a pending request');
  cleanup(); await tick(); assert.equal(second.releases, 1);
}
{
  const doc = new FakeDocument(); doc.visibilityState = 'hidden';
  let calls = 0;
  const cleanup = keepScreenAwake(doc, { request: async () => { calls++; throw new Error('Denied'); } });
  await tick(); assert.equal(calls, 0);
  doc.visibility('visible'); await tick(); assert.equal(calls, 1);
  await tick(); assert.equal(calls, 1, 'No retry loop when OS refuses');
  cleanup(); keepScreenAwake(doc)();
}
console.log(`History gestures, ${dishes.length} dish mappings and wake-lock lifecycle tests passed.`);
