import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { launch } from '../fixtures/browser.mjs';
let source = '';
try { source = await readFile('src/infrastructure/legacy/audio-migration.js', 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const server = createServer((_, response) => response.end('<!doctype html><title>Isolated audio migration</title>'));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.addScriptTag({ content: source + '\nwindow.audioMigration = typeof LegacyAudioMigration === "undefined" ? null : LegacyAudioMigration;' });
  assert.equal(await page.evaluate(() => typeof window.audioMigration?.run), 'function');
  const results = await page.evaluate(async () => {
    const open = name => new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('sounds', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const seed = (db, records) => new Promise((resolve, reject) => {
      const tx = db.transaction('sounds', 'readwrite');
      records.forEach(record => tx.objectStore('sounds').put(record));
      tx.oncomplete = resolve; tx.onabort = () => reject(tx.error);
    });
    const read = (db, key) => new Promise((resolve, reject) => {
      const request = db.transaction('sounds').objectStore('sounds').get(key);
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const ensure = (test, message) => { if (!test) throw Error(message); };
    const old = await open('test-old-audio');
    const current = await open('test-current-audio');
    const bytes = value => new Uint8Array([value]).buffer;
    await seed(old, [{ id: 'fx_existing', arrayBuffer: bytes(1) }, { id: 'bgm_thinking', arrayBuffer: bytes(3), name: 'old tune' }]);
    await seed(current, [{ id: 'fx_existing', arrayBuffer: bytes(9) }]);
    const before = (await indexedDB.databases()).map(db => db.name).sort().join();
    const result = await audioMigration.run({ indexedDB, destination: current, storage: localStorage, sourceNames: ['test-old-audio', 'missing-old-audio'], markerKey: 'test-audio-marker' });
    ensure(result.copied === 1 && result.skipped === 1, 'only missing sounds copied');
    ensure(new Uint8Array((await read(current, 'fx_existing')).arrayBuffer)[0] === 9, 'current custom sound retained');
    ensure(new Uint8Array((await read(current, 'bgm_set_0_thinking')).arrayBuffer)[0] === 3, 'renamed legacy sound copied');
    ensure((await read(current, 'bgm_set_0_thinking')).name === 'old tune', 'metadata retained');
    ensure(new Uint8Array((await read(old, 'fx_existing')).arrayBuffer)[0] === 1, 'source unchanged');
    ensure(localStorage.getItem('test-audio-marker') === '1', 'marker after committed copy');
    ensure((await indexedDB.databases()).map(db => db.name).sort().join() === before, 'missing sources not created');
    const failed = await open('test-failed-audio');
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function(value, key) {
      if (value.id === 'bgm_set_0_thinking') throw new DOMException('test quota', 'QuotaExceededError');
      return key === undefined ? original.call(this, value) : original.call(this, value, key);
    };
    let rejected = false;
    try { await audioMigration.run({ indexedDB, destination: failed, storage: localStorage, sourceNames: ['test-old-audio'], markerKey: 'test-failed-marker' }); }
    catch (_) { rejected = true; }
    finally { IDBObjectStore.prototype.add = original; }
    ensure(rejected, 'failed copy reports rejection');
    ensure(localStorage.getItem('test-failed-marker') === null, 'failed copy never marks complete');
    ensure(await read(failed, 'fx_existing') === undefined, 'partial copy rolled back');
    await audioMigration.run({ indexedDB, destination: failed, storage: localStorage, sourceNames: ['test-old-audio'], markerKey: 'test-failed-marker' });
    ensure(new Uint8Array((await read(failed, 'fx_existing')).arrayBuffer)[0] === 1, 'retry succeeds');
    localStorage.setItem('politics_audio_migration_v1', '1');
    const recovery = await open('test-audio-old-marker');
    await audioMigration.run({ indexedDB, destination: recovery, storage: localStorage, sourceNames: ['test-old-audio'] });
    ensure(localStorage.getItem('politics_audio_migration_v2') === '1', 'unsafe old marker does not bypass verified migration');
    ensure(new Uint8Array((await read(recovery, 'fx_existing')).arrayBuffer)[0] === 1, 'old incomplete migration can recover');
    const readback = await open('test-readback-audio');
    const originalGet = IDBObjectStore.prototype.get;
    const reads = new Map();
    IDBObjectStore.prototype.get = function(key) {
      if (this.transaction.db.name === 'test-readback-audio') {
        const count = (reads.get(key) || 0) + 1; reads.set(key, count);
        if (count > 1) return originalGet.call(this, 'missing-for-readback-test');
      }
      return originalGet.call(this, key);
    };
    let verificationFailed = false;
    try { await audioMigration.run({ indexedDB, destination: readback, storage: localStorage, sourceNames: ['test-old-audio'], markerKey: 'readback-marker' }); }
    catch (_) { verificationFailed = true; }
    finally { IDBObjectStore.prototype.get = originalGet; }
    ensure(verificationFailed, 'readback failure must be reported');
    ensure(localStorage.getItem('readback-marker') === null, 'readback failure cannot mark complete');
    old.close(); current.close(); failed.close(); recovery.close(); readback.close();
    return ['existing custom audio preserved', 'legacy aliases and metadata copied', 'missing source databases not created', 'failed transaction has no completion marker or partial sound', 'retry after failure succeeds'];
  });
  for (const result of results) console.log('PASS', result);
} finally { await browser.close(); server.close(); }
