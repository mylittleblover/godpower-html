import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch } from "../fixtures/browser.mjs";
let source = "";
for (const file of [
  "domain/values.js",
  "domain/events.js",
  "application/command-lifecycle.js",
  "infrastructure/indexeddb/repository.js",
])
  source += (await readFile("src/" + file, "utf8")) + "\n";
const server = createServer((_, res) =>
  res.end("<!doctype html><title>Async compatibility adapter</title>"),
);
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.addScriptTag({ content: source });
  const result = await page.evaluate(async () => {
    const ensure = (ok, message) => {
      if (!ok) throw Error(message);
    };
    localStorage.setItem("legacy-classroom-sentinel", "unchanged");
    const name = "isolated-legacy-async-commit",
      aggregateId = "classroom-a";
    let repository = await TransactionalRepository.open({ name });
    let snapshot = {
      groups: Array.from({ length: 14 }, (_, i) => ({
        id: i + 1,
        groupUid: "group-" + (i + 1),
        score: 10,
      })),
      history: [],
    };
    await repository.importSnapshot({
      migrationId: "seed",
      sourceManifest: [],
      aggregateId,
      snapshot,
    });
    let revision = 1,
      sequence = 0,
      active = false,
      result,
      stale = false,
      secondRan = false;
    const publications = [],
      failures = [];
    const controller = CommandLifecycle.create({
      active: () => active,
      setActive: (value) => {
        active = value;
      },
      commandId: () => `legacy-async-${++sequence}`,
      actorId: () => "local-teacher",
      createEventScope: (options) => DomainEvents.createScope(options),
      invalidate: () => {},
      snapshot: () => structuredClone(snapshot),
      restore: (before) => {
        snapshot = before;
      },
      record: (description) =>
        snapshot.history.push({
          description,
          groups: structuredClone(snapshot.groups),
        }),
      validate: () => {
        if (snapshot.groups.some((g) => !Number.isSafeInteger(g.score)))
          throw Error("overflow");
      },
      persist: (transaction) => {
        ensure(
          !controller.isPending(),
          "legacy synchronous save must not defer itself",
        );
        const captured = structuredClone(snapshot);
        return repository
          .commit({
            commandId: transaction.commandId,
            aggregateId,
            expectedRevision: stale ? 0 : revision,
            snapshot: captured,
            events: transaction.events,
          })
          .then((receipt) => {
            revision = receipt.revision;
            return { ok: true, eventsPersisted: true };
          });
      },
      result: (value) => {
        result = value;
      },
      warning: (error) => failures.push(error),
      error: (error) => failures.push(error.message),
      render: () => {},
      committed: (transaction) => publications.push(transaction),
    });
    const idle = async () => {
      for (let i = 0; i < 1000 && controller.isPending(); i++)
        await new Promise((r) => setTimeout(r, 2));
      ensure(!controller.isPending(), "commit timed out");
    };
    const add = (points) => (context) => {
      const before = snapshot.groups[0].score;
      snapshot.groups[0].score += points;
      context.emit(
        "SCORE_CHANGED",
        { type: "group", id: "group-1" },
        { before, after: snapshot.groups[0].score },
      );
      return true;
    };
    ensure(
      controller.run("manual +5", add(5), { source: "manual" }),
      "command accepted",
    );
    ensure(
      controller.isPending() && result.pending && !result.persisted,
      "durability not claimed before IndexedDB acknowledgement",
    );
    ensure(publications.length === 0, "no early event publication");
    ensure(
      !controller.run("overlap", () => {
        secondRan = true;
      }),
      "overlap denied",
    );
    ensure(!secondRan, "overlap does not execute");
    await idle();
    ensure(
      result.persisted && publications.length === 1,
      "one postcommit publication",
    );
    ensure(
      (await repository.read(aggregateId)).snapshot.groups[0].score === 15,
      "committed score",
    );
    ensure(
      (await repository.listEvents(aggregateId)).length === 1,
      "one persisted event",
    );
    stale = true;
    controller.run("stale commit", add(50), {
      source: "manual",
      retainOnPersistenceFailure: false,
    });
    await idle();
    ensure(
      result.ok === false &&
        snapshot.groups[0].score === 15 &&
        snapshot.history.length === 1,
      "revision failure rolls back strict compatibility state and history",
    );
    ensure(
      (await repository.read(aggregateId)).snapshot.groups[0].score === 15 &&
        publications.length === 1,
      "failed commit preserves DB and event publication count",
    );
    stale = false;
    controller.run("retry as new command", add(2), { source: "manual" });
    await idle();
    ensure(
      result.persisted && snapshot.groups[0].score === 17,
      "queue recovers after failure",
    );
    repository.close();
    repository = await TransactionalRepository.open({ name });
    ensure(
      (await repository.read(aggregateId)).snapshot.groups[0].score === 17,
      "restart retains final score",
    );
    ensure(
      (await repository.listEvents(aggregateId)).length === 2,
      "restart retains exactly two confirmed events",
    );
    ensure(
      localStorage.getItem("legacy-classroom-sentinel") === "unchanged",
      "legacy source unchanged",
    );
    repository.close();
    return {
      groups: 14,
      score: 17,
      events: 2,
      publications: publications.length,
      revision,
      history: snapshot.history.length,
      rejection: failures,
      sourcePreserved: true,
    };
  });
  assert.equal(result.publications, 2);
  assert.deepEqual(errors, []);
  await mkdir("artifacts/v3-async-lifecycle", { recursive: true });
  await writeFile(
    "artifacts/v3-async-lifecycle/repository.json",
    JSON.stringify({ result, errors }, null, 2),
  );
  console.log(
    "PASS legacy command lifecycle with actual IndexedDB atomic persistence",
    result,
  );
} finally {
  await browser.close();
  server.close();
}
