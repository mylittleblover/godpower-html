import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { launch, setup } from '../fixtures/browser.mjs';

const html = await readFile('dist/godpower.html');
const evidenceRoot = process.env.GLOBAL_DRAW_ARTIFACT_DIR || 'artifacts/code-review-3.0.61';
const server = createServer((_, response) => response.end(html));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launch();
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  const normal = await page.evaluate(async () => {
    const before = state.itemGlobal.totalDraws;
    globalItemDraw();
    await new Promise(resolve => setTimeout(resolve, 1800));
    return { awarded: state.groups.reduce((sum, group) => sum + group.inventory.length, 0), countDelta: state.itemGlobal.totalDraws - before };
  });
  assert.deepEqual(normal, { awarded: 4, countDelta: 4 });
  results.push({ scenario: 'one count per awarded item', result: normal });
  await page.waitForFunction(() => !itemDrawBusy);
  for (const delay of [100, 1800]) {
    await setup(page, 4);
    const undo = await page.evaluate(async delay => {
      const before = JSON.stringify(state.itemGlobal);
      globalItemDraw();
      await new Promise(resolve => setTimeout(resolve, delay));
      await undoLast();
      await new Promise(resolve => setTimeout(resolve, 3200));
      return { restored: before === JSON.stringify(state.itemGlobal), inventory: state.groups.reduce((sum, group) => sum + group.inventory.length, 0), busy: itemDrawBusy, overlays: document.querySelectorAll('.card-item-roulette').length };
    }, delay);
    assert.deepEqual(undo, { restored: true, inventory: 0, busy: false, overlays: 0 });
    results.push({ scenario: `undo at ${delay}ms`, result: undo });
  }
  await setup(page, 4);
  const overlap = await page.evaluate(async () => {
    globalItemDraw();
    await new Promise(resolve => setTimeout(resolve, 200));
    await undoLast();
    itemDrawBusy = false;
    globalItemDraw();
    await new Promise(resolve => setTimeout(resolve, 1800));
    const revealed = { inventory: state.groups.reduce((sum, group) => sum + group.inventory.length, 0), total: state.itemGlobal.totalDraws, busy: itemDrawBusy };
    await new Promise(resolve => setTimeout(resolve, 1600));
    return { revealed, busy: itemDrawBusy, overlays: document.querySelectorAll('.card-item-roulette').length };
  });
  assert.deepEqual(overlap, { revealed: { inventory: 4, total: 4, busy: true }, busy: false, overlays: 0 });
  results.push({ scenario: 'old owner cannot cancel newer draw', result: overlap });
  assert.deepEqual(errors, []);
  await mkdir(evidenceRoot, { recursive: true });
  await writeFile(`${evidenceRoot}/draw-after.json`, JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ status: 'PASS', results }));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
