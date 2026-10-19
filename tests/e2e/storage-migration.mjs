import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { launch } from '../fixtures/browser.mjs';

const html = await readFile('dist/godpower.html');
const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(request.url === '/seed' ? '<!doctype html><title>isolated seed</title>' : html);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launch();
const root = `http://127.0.0.1:${server.address().port}`;
const results = [];
const legacy = {
  schemaVersion: 1,
  seasonId: 'season-existing',
  groups: Array.from({ length: 14 }, (_, index) => ({
    id: index + 1, name: `迁移测试${index + 1}组`, score: index * 12 - 3,
    members: [`${index + 1}甲`, `${index + 1}乙`, `${index + 1}丙`, `${index + 1}丁`],
    color: '#2F7DD1', inventory: index ? [] : [{ key: 'triple_green', charges: 2, acquiredAt: 17 }],
  })),
  picker: { mode: 'group', antiRepeat: true, pickedGroupIds: [2] },
  round: { roundActive: true, evaluated: false, correctAns: 'A', hasStartedOnce: true },
  itemGlobal: { totalDraws: 3, pkTotal: 7 },
  history: [], zoomLevel: 1, columnMode: 'double', resizerEnabled: true, resizerHeight: 120,
};
async function scenario(name, seed, check, init) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(root + '/seed');
    await page.evaluate(values => { for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value); }, seed);
    if (init) await context.addInitScript(init);
    await page.goto(root, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.classroomReady);
    await check(page);
    assert.deepEqual(errors, []);
    results.push({ name, status: 'PASS', errors });
    console.log('PASS', name);
  } finally { await context.close(); }
}
try {
  const source = JSON.stringify(legacy);
  await scenario('v1 startup copy, refresh and source retention', { godpower_state_v1: source }, async page => {
    const first = await page.evaluate(() => ({
      status: window.classroomMigrationResult.status,
      groups: state.groups.map(group => ({ name: group.name, score: group.score, members: group.members, groupUid: group.groupUid })),
      item: state.groups[0].inventory[0],
      old: localStorage.getItem('godpower_state_v1'),
      current: JSON.parse(localStorage.getItem(Reliability.stateKey)),
      receipt: JSON.parse(localStorage.getItem('godpower_migration_v2_receipt')),
    }));
    assert.equal(first.status, 'migrated');
    assert.equal(first.groups.length, 14);
    assert.deepEqual(first.groups.map(group => group.score), legacy.groups.map(group => group.score));
    assert.equal(first.old, source);
    assert.equal(first.current.schemaVersion, 2);
    assert.equal(first.receipt.status, 'complete');
    assert.equal(first.item.charges, 2);
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.deepEqual(await page.evaluate(() => state.groups.map(group => group.groupUid)), first.groups.map(group => group.groupUid));
    assert.equal(await page.evaluate(() => window.classroomMigrationResult.status), 'current');
    assert.equal(await page.evaluate(() => { state.isLocked = false; state.groups[0].score += 2; return saveState().ok; }), true);
    assert.equal(await page.evaluate(() => localStorage.getItem('godpower_state_v1')), source);
  });
  await scenario('quota failure keeps valid old classroom usable in memory', { godpower_state_v1: source }, async page => {
    const state = await page.evaluate(() => ({
      count: window.classroomReady && state.groups.length,
      score: state.groups[0].score, recovery: !!window.classroomRecoveryRequired,
      warning: !!window.classroomUnsavedChanges, old: localStorage.getItem('godpower_state_v1'),
      current: localStorage.getItem('godpower_state_v2'), status: window.classroomMigrationResult.status,
    }));
    assert.equal(state.count, 14);
    assert.equal(state.score, -3);
    assert.equal(state.recovery, false);
    assert.equal(state.warning, true);
    assert.equal(state.old, source);
    assert.equal(state.current, null);
    assert.equal(state.status, 'failed');
  }, () => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'godpower_state_v2') throw new DOMException('isolated test quota', 'QuotaExceededError');
      return set.call(this, key, value);
    };
  });
  await scenario('corrupt current data is protected without fallback overwrite', { godpower_state_v1: source, godpower_state_v2: '{bad' }, async page => {
    assert.equal(await page.evaluate(() => !!window.classroomRecoveryRequired), true);
    assert.equal(await page.evaluate(() => saveState().ok), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('godpower_state_v2')), '{bad');
    assert.equal(await page.evaluate(() => localStorage.getItem('godpower_state_v1')), source);
    const restored = await page.evaluate(data => { state.isLocked = false; return importClassroomData(data); }, legacy);
    assert.equal(restored.ok, true);
    assert.equal(await page.evaluate(() => !!window.classroomRecoveryRequired), false);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('godpower_recovery_before_import_v2')).raw), '{bad');
    assert.equal(await page.evaluate(() => state.groups.length), 14);
  });
  await scenario('legacy mirrors retain missing preference defaults', { politics_groups_data: JSON.stringify(legacy.groups) }, async page => {
    assert.deepEqual(await page.evaluate(() => ({ volume: state.masterVolume, zoom: state.zoomLevel, saveAllIn: state.saveAllIn })), { volume: 0.85, zoom: 1, saveAllIn: true });
    assert.equal(await page.evaluate(() => state.groups.length), 14);
  });
} finally {
  await mkdir('artifacts/v3-migration', { recursive: true });
  await writeFile('artifacts/v3-migration/results.json', JSON.stringify({ browser: browser.version(), viewport: '1920x1080', deviceScaleFactor: 1, results }, null, 2));
  await browser.close(); server.close();
}
