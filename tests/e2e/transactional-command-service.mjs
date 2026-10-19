import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { launch } from '../fixtures/browser.mjs';
let scripts = '';
for (const file of ['domain/values.js', 'domain/events.js', 'infrastructure/indexeddb/repository.js', 'application/transactional-command-service.js']) {
  try { scripts += await readFile('src/' + file, 'utf8') + '\n'; } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const server = createServer((_, response) => response.end('<!doctype html><title>Transactional command</title>'));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await launch(); const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.addScriptTag({ content: scripts + '\nwindow.commandApi = typeof TransactionalCommandService === "undefined" ? null : TransactionalCommandService;' });
  assert.equal(await page.evaluate(() => typeof window.commandApi?.create), 'function');
  const results = await page.evaluate(async () => {
    const ensure = (test, message) => { if (!test) throw Error(message); };
    const failure = async (operation, code) => {
      try { await operation(); } catch (error) { ensure(error.code === code, `${code}: ${error.code}: ${error.message}`); return; }
      throw Error('expected failure ' + code);
    };
    const repository = await TransactionalRepository.open({ name: 'isolated-command-service' });
    await repository.importSnapshot({ migrationId: 'seed', sourceManifest: [], aggregateId: 'classroom-a', snapshot: { groups: [{ groupUid: 'group-a', score: 10 }] } });
    let calculations = 0, publishes = 0, presentationErrors = 0;
    let finishWait, startedWait;
    const waitStarted = new Promise(resolve => { startedWait = resolve; });
    const handlers = {
      ADD_SCORE: (snapshot, payload, context) => {
        calculations++;
        ensure(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.groups), 'handler input is frozen');
        const next = structuredClone(snapshot); next.groups[0].score += payload.points;
        context.emit('SCORE_CHANGED', { type: 'group', id: 'group-a' }, { before: snapshot.groups[0].score, after: next.groups[0].score });
        return { snapshot: next };
      },
      FAIL: () => { throw Error('calculation refused'); },
      NON_FINITE: () => ({ snapshot: { groups: [{ score: Infinity }] } }),
      WAIT: (snapshot, payload, context) => new Promise(resolve => {
        finishWait = () => { const next = structuredClone(snapshot); next.groups[0].score += 50; context.emit('ITEM_USED', { type: 'group', id: 'group-a' }, { itemKey: 'spiny' }); resolve({ snapshot: next }); };
        startedWait();
      }),
    };
    const options = {
      repository, handlers,
      authorize: request => request.actorId === 'teacher-a' && request.aggregateId === 'classroom-a',
      publish: async transaction => {
        ensure((await repository.read('classroom-a')).revision >= transaction.revision, 'publish only after persistence'); publishes++;
      },
      reportPresentationError: () => { presentationErrors++; },
    };
    let service = commandApi.create(options);
    const command = { commandId: 'cmd-1', aggregateId: 'classroom-a', expectedRevision: 1, actorId: 'teacher-a', source: 'manual', type: 'ADD_SCORE', payload: { points: 2 } };
    const pending = service.dispatch(command);
    const duplicate = service.dispatch(structuredClone(command));
    command.payload.points = 999;
    ensure(publishes === 0, 'no premature publication');
    await Promise.all([pending, duplicate]);
    ensure(calculations === 1 && publishes === 1, 'one calculation and one publication');
    ensure((await repository.read('classroom-a')).snapshot.groups[0].score === 12, 'immutable request payload');
    ensure((await repository.listEvents('classroom-a')).length === 1, 'one persisted event');
    service = commandApi.create(options);
    ensure((await service.dispatch({ ...command, payload: { points: 2 } })).duplicate, 'persistent retry receipt');
    ensure(calculations === 1 && publishes === 1, 'restart does not recalculate or republish');
    await failure(() => service.dispatch({ ...command, payload: { points: 9 } }), 'COMMAND_REUSED');
    await failure(() => service.dispatch({ ...command, commandId: 'unauthorized', expectedRevision: 2, actorId: 'teacher-b' }), 'FORBIDDEN');
    await failure(() => service.dispatch({ ...command, commandId: 'stale' }), 'REVISION_CONFLICT');
    await failure(() => service.dispatch({ ...command, commandId: 'failed', expectedRevision: 2, type: 'FAIL' }), 'OPERATION_FAILED');
    ensure((await repository.read('classroom-a')).snapshot.groups[0].score === 12, 'rejections preserve state');
    const faultyPresentation = commandApi.create({ ...options, publish: () => { throw Error('UI subscriber failed'); } });
    await faultyPresentation.dispatch({ ...command, commandId: 'cmd-2', expectedRevision: 2, payload: { points: 3 } });
    ensure((await repository.read('classroom-a')).snapshot.groups[0].score === 15, 'presentation cannot roll back commit');
    ensure(presentationErrors === 1, 'presentation failure reported');
    const cyclic = {}; cyclic.self = cyclic;
    await failure(() => service.dispatch({ ...command, commandId: 'cyclic', expectedRevision: 3, payload: cyclic }), 'INVALID_COMMAND');
    await failure(() => service.dispatch({ ...command, commandId: 'non-json', expectedRevision: 3, payload: { date: new Date() } }), 'INVALID_COMMAND');
    await failure(() => service.dispatch({ ...command, commandId: 'non-finite', expectedRevision: 3, type: 'NON_FINITE' }), 'OPERATION_FAILED');
    ensure((await repository.read('classroom-a')).snapshot.groups[0].score === 15, 'invalid calculation cannot reach storage');
    await failure(() => service.dispatch({ ...command, commandId: 'bad-source', expectedRevision: 3, source: 'unknown' }), 'INVALID_COMMAND');
    const cancellation = new AbortController();
    const waiting = service.dispatch({ ...command, commandId: 'waiting', expectedRevision: 3, type: 'WAIT' }, { signal: cancellation.signal });
    await waitStarted;
    cancellation.abort(); finishWait();
    await failure(() => waiting, 'CANCELLED');
    ensure((await repository.read('classroom-a')).revision === 3, 'cancelled async operation does not commit');
    ensure((await repository.listEvents('classroom-a')).length === 2, 'cancelled async operation emits no persisted event');
    repository.close();
    return ['async atomic command and one publication', 'in-flight and persistent command deduplication', 'caller mutation isolated', 'actor/scope/revision rejection', 'calculation failure preserves prior state', 'presentation failure preserves committed state', 'invalid JSON and non-finite calculation rejected', 'pending async decision cancellation preserves state and event log'];
  });
  results.forEach(result => console.log('PASS', result));
} finally { await browser.close(); server.close(); }
