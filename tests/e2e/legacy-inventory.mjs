import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { launch } from '../fixtures/browser.mjs';
const files = ['domain/identity.js', 'infrastructure/legacy/classroom-repository.js', 'infrastructure/legacy/schema-migrations.js', 'core/reliability.js', 'infrastructure/indexeddb/repository.js', 'infrastructure/legacy/inventory.js', 'application/migration-coordinator.js'];
let scripts = '';
for (const file of files) { try { scripts += await readFile('src/' + file, 'utf8') + '\n'; } catch (error) { if (error.code !== 'ENOENT') throw error; } }
const server = createServer((_, response) => response.end('<!doctype html><title>Legacy inventory</title>'));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launch(); const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.addScriptTag({ content: scripts + '\nwindow.inventory = typeof LegacyStorageInventory === "undefined" ? null : LegacyStorageInventory; window.coordinator = typeof MigrationCoordinator === "undefined" ? null : MigrationCoordinator;' });
  assert.equal(await page.evaluate(() => typeof window.inventory?.capture), 'function');
  const result = await page.evaluate(async () => {
    const ensure = (test, message) => { if (!test) throw Error(message); };
    localStorage.setItem('godpower_state_v1', JSON.stringify({ schemaVersion: 1, groups: [{ id: 1, name: '原小组', score: 23, members: ['甲'], inventory: [{ key: 'coin', charges: 1 }] }] }));
    localStorage.setItem('politics_settlement_history', JSON.stringify([{ id: 17, title: '旧赛季', groups: [{ name: '原小组', score: 19 }] }]));
    localStorage.setItem('godpower_ui_preferences_v1', '{"motion":"full"}');
    localStorage.setItem('unrelated-application', 'do not import');
    async function seed(name, store, key, value) {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(name, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(store);
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
      await new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite'); tx.objectStore(store).put(value, key);
        tx.oncomplete = resolve; tx.onabort = () => reject(tx.error);
      });
      db.close();
    }
    await seed('PoliticsScoreSoundDB_Unified', 'sounds', 'fx_one', { id: 'fx_one', name: '音效', arrayBuffer: new Uint8Array([2, 4, 6]).buffer });
    await seed('PoliticsUiDB', 'kv', 'wallpaper', new Blob(['wallpaper-bytes'], { type: 'image/png' }));
    const beforeKeys = Object.fromEntries(Object.entries(localStorage));
    const beforeDBs = (await indexedDB.databases()).map(db => db.name).sort().join();
    const captured = await inventory.capture();
    ensure(captured.ready, 'capture ready');
    ensure(captured.sourceManifest.every(entry => /^[0-9a-f]{64}$/.test(entry.sha256)), 'all sources have SHA-256');
    ensure(!captured.localEntries.some(entry => entry.key === 'unrelated-application'), 'foreign app excluded');
    const plan = await inventory.prepare(captured);
    const repeatedPlan = await inventory.prepare(captured);
    ensure(typeof coordinator?.create === 'function', 'migration coordinator required');
    let openCount = 0;
    const stage = coordinator.create({ inventory, openRepository: plan => { openCount++; return TransactionalRepository.open({ name: 'isolated-stage-' + plan.migrationId, validateSnapshot: Reliability.validateBackup }); } });
    const preview = await stage.preview();
    const staged = await stage.execute(preview);
    ensure(staged.ok && staged.status === 'STAGED_VERIFIED' && !staged.authorityChanged, 'verified staging never switches authority');
    ensure((await stage.execute(preview)).receipt.duplicate, 'coordinator restart/retry is idempotent');
    const reopenedStage = await TransactionalRepository.open({name:'isolated-stage-'+plan.migrationId});
    const journal = await reopenedStage.getMigration(plan.migrationId);
    ensure(journal.verification.status === 'VERIFIED' && journal.verification.sourceRechecked && journal.verification.authorityChanged === false, 'verification journal survives close and reopen without switching authority');
    let invalidStatusRejected = false;
    try { await reopenedStage.recordMigrationStatus(plan, {status:'VERIFIED', sourceRechecked:true, integrity:{ok:true,verifiedArchives:99,verifiedResources:0}}); } catch (_) {invalidStatusRejected=true;}
    ensure(invalidStatusRejected, 'incomplete readback counts cannot create a verified journal');
    const interrupted = await reopenedStage.recordMigrationStatus(plan, {status:'VERIFYING'});
    ensure(interrupted.status === 'VERIFYING', 'new attempt durably invalidates prior verified state');
    reopenedStage.close();
    const recovered = await stage.execute(preview);
    ensure(recovered.ok && recovered.receipt.duplicate && recovered.journal.status === 'VERIFIED', 'interrupted verification resumes without importing twice');

    ensure(JSON.stringify(plan.snapshot) === JSON.stringify(repeatedPlan.snapshot), 'same source produces identical retry snapshot');
    ensure(plan.snapshot.groups[0].score === 23, 'score preserved');
    ensure(plan.archives.length === 1, 'archive preserved');
    const audio = plan.resources.find(resource => resource.database === 'PoliticsScoreSoundDB_Unified');
    ensure(new Uint8Array(audio.payload.arrayBuffer).join() === '2,4,6', 'audio bytes preserved');
    const wallpaper = plan.resources.find(resource => resource.database === 'PoliticsUiDB');
    ensure(await wallpaper.payload.text() === 'wallpaper-bytes', 'wallpaper preserved');
    ensure((await inventory.verify(plan)).ok, 'source recheck before commit');
    const target = await TransactionalRepository.open({ name: 'isolated-full-migration', validateSnapshot: Reliability.validateBackup });
    await target.importSnapshot(plan);
    ensure(typeof inventory.verifyDestination === 'function', 'generic destination verifier required');
    ensure((await inventory.verifyDestination(target, plan)).ok, 'full destination verified');
    const copiedAudio = await target.readResource(audio.resourceId);
    ensure(new Uint8Array(copiedAudio.payload.arrayBuffer).join() === '2,4,6', 'target retains audio bytes');
    ensure((await target.read(plan.aggregateId)).snapshot.groups[0].score === 23, 'target score verified');
    ensure(JSON.stringify(Object.fromEntries(Object.entries(localStorage))) === JSON.stringify(beforeKeys), 'local source bytes unchanged');
    const afterDBs = (await indexedDB.databases()).map(db => db.name).filter(name => name !== 'isolated-full-migration' && !name.startsWith('isolated-stage-')).sort().join();
    ensure(afterDBs === beforeDBs, 'absent legacy databases not created');
    const corruptDb = await new Promise(resolve => { const request = indexedDB.open('isolated-full-migration'); request.onsuccess = () => resolve(request.result); });
    await new Promise((resolve, reject) => { const tx = corruptDb.transaction('resources', 'readwrite'); tx.objectStore('resources').put({ ...copiedAudio, payload: { ...copiedAudio.payload, arrayBuffer: new Uint8Array([0]).buffer } }); tx.oncomplete = resolve; tx.onabort = () => reject(tx.error); });
    corruptDb.close();
    ensure(!(await inventory.verifyDestination(target, plan)).ok, 'target byte corruption blocks cutover');
    const brokenStage = coordinator.create({ inventory, openRepository: () => TransactionalRepository.open({ name: 'isolated-full-migration' }) });
    ensure((await brokenStage.execute(preview)).status === 'DESTINATION_INVALID', 'coordinator blocks corrupt destination');
    ensure((await target.getMigration(plan.migrationId)).verification.status === 'DESTINATION_INVALID', 'failed readback is durable and never remains verified');
    localStorage.setItem('godpower_ui_preferences_v1', '{"motion":"off"}');
    ensure(!(await inventory.verify(plan)).ok, 'source mutation detected before import');
    ensure((await stage.execute(preview)).status === 'SOURCE_CHANGED', 'coordinator rejects obsolete preview');
    ensure(openCount === 3, 'obsolete preview never opens or writes target');
    await seed('PoliticsScoreSoundDB_Unified', 'sounds', 'unsupported', new Map([['hidden', 1]]));
    let unsupportedRejected = false;
    try { await inventory.capture(); } catch (_) { unsupportedRejected = true; }
    ensure(unsupportedRejected, 'unsupported resource prototypes cannot be hashed as empty objects');
    target.close();
    return { sourceRecords: captured.sourceManifest.length, resources: plan.resources.length, archives: plan.archives.length, sha256: true, sourcePreserved: true, mutationDetected: true };
  });
  console.log('PASS legacy dry-run and isolated atomic import', JSON.stringify(result));
} finally { await browser.close(); server.close(); }
