import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { launch } from "../fixtures/browser.mjs";
import { legacy } from "../fixtures/save-v2.mjs";
await mkdir("artifacts/save-document-v2", { recursive: true });
const scripts = [];
for (const f of [
  "domain/identity.js",
  "domain/save-document.js",
  "application/save-migration.js",
  "infrastructure/save-repository.js",
  "application/save-session.js",
])
  if (existsSync("src/" + f)) scripts.push(await readFile("src/" + f, "utf8"));
const html =
  '<!doctype html><meta charset="UTF-8">' +
  scripts.map((s) => "<script>" + s + "</script>").join("");
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const p = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await p.goto(`http://127.0.0.1:${server.address().port}`);
  assert.equal(
    await p.evaluate(() => typeof SaveRepository),
    "object",
    "save repository must be available",
  );
  const result = await p.evaluate(async (raw) => {
    const repo = await SaveRepository.open({
      name: "save-test-" + crypto.randomUUID(),
    });
    const a = await SaveMigration.preview({
      rawText: JSON.stringify(raw),
      name: "存档A",
    });
    const first = await repo.importPreview(a, { activate: true });
    if (!first.ok) throw Error(JSON.stringify(first));
    const duplicate = await repo.importPreview(a, { activate: true });
    const list = await repo.list();
    const id = list.index.activeSaveId;
    const loaded = await repo.load(id);
    const draft = structuredClone(loaded.document);
    draft.match.groups[0].score += 2;
    const saved = await repo.commit(id, loaded.document.revision, draft, {
      expectedGeneration: list.index.generation,
    });
    const conflict = await repo.commit(id, loaded.document.revision, draft, {
      expectedGeneration: list.index.generation,
    });
    raw.groups[0].score = 777;
    const b = await SaveMigration.preview({
      rawText: JSON.stringify(raw),
      name: "存档B",
    });
    await repo.importPreview(b, { activate: false });
    const switched = await repo.switchActive(b.documents[0].saveId, {
      expectedGeneration: list.index.generation,
    });
    const stale = await repo.commit(
      id,
      saved.document.revision,
      saved.document,
      { expectedGeneration: list.index.generation },
    );
    const prefs = await repo.savePreferences(
      { theme: "marx", masterVolume: 0.3 },
      { expectedRevision: 0 },
    );
    const source = await repo.getSource(a.sourceDigest);
    const final = await repo.list();
    repo.close();
    const reopened = await SaveRepository.open({ name: repo.name });
    const afterRestart = await reopened.load(id);
    const globalPrefs = await reopened.loadPreferences();
    return {
      first: first.ok,
      duplicate: duplicate.idempotent,
      initialCount: list.index.entries.length,
      initialStudents: loaded.document.roster.students.length,
      saved: saved.ok,
      newScore: saved.document.match.groups[0].score,
      conflict: conflict.code,
      switched: switched.ok,
      stale: stale.code,
      sourcePreserved: (await source.raw.text()) === a.sourceText,
      count: final.index.entries.length,
      restartedScore: afterRestart.document.match.groups[0].score,
      prefs: prefs.ok,
      globalTheme: globalPrefs.preferences.values.theme,
    };
  }, legacy());
  assert.deepEqual(result, {
    first: true,
    duplicate: true,
    initialCount: 1,
    initialStudents: 3,
    saved: true,
    newScore: 102,
    conflict: "REVISION_CONFLICT",
    switched: true,
    stale: "GENERATION_CONFLICT",
    sourcePreserved: true,
    count: 2,
    restartedScore: 102,
    prefs: true,
    globalTheme: "marx",
  });
  const aborted = await p.evaluate(async (raw) => {
    const repo = await SaveRepository.open({
      name: "abort-test-" + crypto.randomUUID(),
    });
    const preview = await SaveMigration.preview({
      rawText: JSON.stringify(raw),
    });
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const request = original.apply(this, args);
      if (this.name === "documents") this.transaction.abort();
      return request;
    };
    let imported;
    try {
      imported = await repo.importPreview(preview, { activate: true });
    } finally {
      IDBObjectStore.prototype.put = original;
    }
    return {
      ok: imported.ok,
      entries: (await repo.list()).index.entries.length,
      source: await repo.getSource(preview.sourceDigest),
    };
  }, legacy());
  assert.equal(aborted.ok, false);
  assert.equal(aborted.entries, 0);
  assert.equal(aborted.source, null);
  assert.equal(
    await p.evaluate(() => typeof SaveSession),
    "object",
    "active-save session must exist",
  );
  const sessionResult = await p.evaluate(async (raw) => {
    const repo = await SaveRepository.open({
      name: "session-" + crypto.randomUUID(),
    });
    const a = await SaveMigration.preview({ rawText: JSON.stringify(raw) });
    raw.groups[0].score = 300;
    const b = await SaveMigration.preview({ rawText: JSON.stringify(raw) });
    await repo.importPreview(a, { activate: true });
    await repo.importPreview(b);
    const applied = [];
    const session = await SaveSession.create({
      repository: repo,
      apply: (doc) => applied.push(doc.saveId),
    });
    const original = session.token();
    let release;
    const gate = new Promise((r) => (release = r));
    const writing = session.update(async (doc) => {
      await gate;
      doc.match.groups[0].score += 2;
      return { document: doc };
    });
    const switching = session.switchTo(b.documents[0].saveId);
    const blocked = await session.update((doc) => ({ document: doc }));
    const before = applied.length;
    release();
    const saved = await writing;
    const switched = await switching;
    const late = await session.update((doc) => ({ document: doc }), {
      token: original,
    });
    const first = await repo.load(a.documents[0].saveId);
    const active = session.snapshot();
    repo.close();
    return {
      saved: saved.ok,
      switched: switched.ok,
      before,
      after: applied.length,
      blocked: blocked.code,
      late: late.code,
      oldScore: first.document.match.groups[0].score,
      activeScore: active.match.groups[0].score,
    };
  }, legacy());
  assert.deepEqual(sessionResult, {
    saved: true,
    switched: true,
    before: 1,
    after: 2,
    blocked: "SAVE_SWITCHING",
    late: "GENERATION_CONFLICT",
    oldScore: 102,
    activeScore: 300,
  });
  const avatarResult = await p.evaluate(async (raw) => {
    const repo = await SaveRepository.open({
      name: "avatar-commit-" + crypto.randomUUID(),
    });
    const preview = await SaveMigration.preview({
      rawText: JSON.stringify(raw),
    });
    await repo.importPreview(preview, { activate: true });
    raw.groups[0].groupAvatar =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    const extracted = await SaveMigration.preview({
      rawText: JSON.stringify(raw),
    });
    const doc = preview.documents[0],
      asset = extracted.assets[0];
    doc.assetReferences.push(asset.resourceId);
    doc.roster.students[0].avatarResourceId = asset.resourceId;
    const saved = await repo.commit(doc.saveId, doc.revision, doc, {
      expectedGeneration: 1,
      assets: [asset],
    });
    if (!saved.ok) return saved;
    const bad = structuredClone(asset);
    bad.dataBase64 = "AAAA";
    const failed = await repo.commit(
      doc.saveId,
      saved.document.revision,
      saved.document,
      { expectedGeneration: 1, assets: [bad] },
    );
    const loaded = await repo.load(doc.saveId);
    const stored = await repo.getAsset(asset.resourceId);
    repo.close();
    return {
      ok: saved.ok,
      failed: failed.ok,
      revision: loaded.document.revision,
      avatar:
        loaded.document.roster.students[0].avatarResourceId ===
        asset.resourceId,
      bytes: stored.raw.size === asset.byteLength,
    };
  }, legacy());
  assert.deepEqual(avatarResult, {
    ok: true,
    failed: false,
    revision: 2,
    avatar: true,
    bytes: true,
  });
  await writeFile(
    "artifacts/save-document-v2/repository-result.json",
    JSON.stringify(
      { status: "PASS", result, transactionRollback: aborted },
      null,
      2,
    ),
  );
  console.log(
    "PASS real IndexedDB import, CAS, generation, idempotency, preferences, source preservation, reopen and transaction rollback",
  );
} finally {
  await browser.close();
  server.close();
}
