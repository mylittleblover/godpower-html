import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { launch, setup } from '../fixtures/browser.mjs';

const server = createServer(async (_, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(await readFile('dist/godpower.html'));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: 'domcontentloaded' });
  await setup(page, 4);
  const imported = await page.evaluate(() => {
    const backup = buildClassroomBackup();
    const legacy = {
      ...backup,
      schemaVersion: 1,
      groups: backup.groups.map(({ groupUid, ...group }) => group),
    };
    legacy.groups[0].inventory = [{ key: 'triple_green', charges: 3, acquiredAt: 123 }];
    legacy.groups[1].inventory = [{ key: 'triple_green', charges: 3, acquiredAt: 456 }];
    const before = legacy.groups.map(({ id, score }) => ({ id, score }));
    const result = importClassroomData(legacy);
    return {
      result,
      before,
      after: state.groups.map(({ id, score, groupUid }) => ({ id, score, groupUid })),
      items: state.groups.slice(0, 2).map(group => ({ ...group.inventory[0] })),
      persisted: JSON.parse(localStorage.getItem(Reliability.stateKey)).groups,
    };
  });

  assert.deepEqual(imported.result, { ok: true });
  assert.deepEqual(imported.after.map(({ id, score }) => ({ id, score })), imported.before);
  assert.ok(imported.after.every(group => typeof group.groupUid === 'string' && group.groupUid.length > 0));
  assert.equal(new Set(imported.after.map(group => group.groupUid)).size, 4);
  assert.ok(imported.items.every(item => typeof item.itemInstanceId === 'string' && item.itemInstanceId.startsWith('item-')));
  assert.notEqual(imported.items[0].itemInstanceId, imported.items[1].itemInstanceId);
  assert.deepEqual(imported.persisted.map(group => group.groupUid), imported.after.map(group => group.groupUid));

  const identities = imported.after.map(group => group.groupUid);
  const itemIds = imported.items.map(item => item.itemInstanceId);
  const decrementedId = await page.evaluate(() => {
    consumeInventoryItem(state.groups[0], 0);
    saveState();
    renderAll();
    return state.groups[0].inventory[0].itemInstanceId;
  });
  assert.equal(decrementedId, itemIds[0]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const restored = await page.evaluate(() => ({
    groups: state.groups.map(group => group.groupUid),
    items: state.groups.slice(0, 2).map(group => group.inventory[0].itemInstanceId),
  }));
  assert.deepEqual(restored.groups, identities);
  assert.deepEqual(restored.items, itemIds);
  assert.deepEqual(pageErrors, []);
  console.log('PASS legacy V2 groups receive persistent UIDs without changing IDs, scores, or roster');
} finally {
  await browser.close();
  server.close();
}
