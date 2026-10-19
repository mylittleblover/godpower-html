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
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: 'domcontentloaded' });
  await setup(page, 4);
  const result = await page.evaluate(() => {
    const originalSeasonId = state.seasonId;
    const stableGroupIds = state.groups.map(group => group.groupUid);
    state.groups[0].score = 25;
    state.hasStartedOnce = true;
    const first = confirmFinalSettlement();
    const firstArchive = getSettlementHistory().find(record => record.seasonId === originalSeasonId);
    const freshSeasonId = state.seasonId;

    // Simulate recovering the prior classroom snapshot after the archive write
    // succeeded but before the reset snapshot became authoritative.
    state.seasonId = originalSeasonId;
    state.groups[0].score = 25;
    state.hasStartedOnce = true;
    const retry = confirmFinalSettlement();
    const archivedSeasonRecords = getSettlementHistory().filter(record => record.seasonId === originalSeasonId);
    closeGrandSettlementModal();
    return {
      firstOk: first.ok,
      retryOk: retry.ok,
      originalSeasonId,
      freshSeasonId,
      nextSeasonId: state.seasonId,
      archivedSeasonRecords: archivedSeasonRecords.length,
      archivedScore: firstArchive?.clearedData?.groups?.[0]?.score,
      archiveSeasonId: firstArchive?.clearedData?.seasonId,
      archivedGroupId: firstArchive?.clearedData?.groups?.[0]?.groupUid,
      groupIdsBefore: stableGroupIds,
      groupIdsAfter: state.groups.map(group => group.groupUid),
      currentScores: state.groups.map(group => group.score),
    };
  });
  assert.equal(result.firstOk, true);
  assert.equal(result.retryOk, true);
  assert.notEqual(result.originalSeasonId, result.freshSeasonId);
  assert.notEqual(result.originalSeasonId, result.nextSeasonId);
  assert.equal(result.archivedSeasonRecords, 1);
  assert.equal(result.archivedScore, 25);
  assert.equal(result.archiveSeasonId, result.originalSeasonId);
  assert.equal(result.archivedGroupId, result.groupIdsBefore[0]);
  assert.deepEqual(result.groupIdsAfter, result.groupIdsBefore);
  assert.deepEqual(result.currentScores, [0, 0, 0, 0]);
  console.log('PASS settlement uses unique season IDs, retries archives idempotently, and keeps group identity');
} finally {
  await browser.close();
  server.close();
}
