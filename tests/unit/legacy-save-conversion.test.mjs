import test from "node:test";
import assert from "node:assert/strict";
import { saveCore, legacy } from "../fixtures/save-v2.mjs";
const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
test("conversion preserves scores, inventory charges, history, achievements and original input", async () => {
  const { migration } = saveCore(),
    raw = legacy();
  raw.history = [
    { groups: structuredClone(raw.groups), desc: "旧记录", time: "10:00" },
  ];
  const text = JSON.stringify(raw);
  const p = await migration.preview({ rawText: text });
  assert.equal(JSON.stringify(raw), text);
  const restored = migration.toLegacy(
    p.documents[0],
    p.assets,
    p.appPreferences,
  );
  assert.equal(JSON.stringify(restored), text);
  assert.equal(p.report.groups, 2);
  assert.equal(p.report.students, 3);
});
test("same source imports are deterministic while different same-name students stay separate", async () => {
  const { migration } = saveCore();
  const text = JSON.stringify(legacy());
  const a = await migration.preview({ rawText: text }),
    b = await migration.preview({ rawText: text });
  assert.equal(a.sourceDigest, b.sourceDigest);
  assert.equal(a.documents[0].saveId, b.documents[0].saveId);
  assert.deepEqual(
    a.documents[0].roster.students,
    b.documents[0].roster.students,
  );
});
test("repeated inline avatars in history are extracted once and restore losslessly", async () => {
  const { migration } = saveCore(),
    raw = legacy();
  raw.groups[0].groupAvatar = png;
  raw.history = Array.from({ length: 40 }, () => ({
    groups: structuredClone(raw.groups),
    desc: "记录",
    time: "10:00",
  }));
  const text = JSON.stringify(raw);
  const p = await migration.preview({ rawText: text });
  assert.equal(p.assets.length, 1);
  assert.ok(!JSON.stringify(p.documents).includes("data:image/"));
  assert.equal(p.report.history, 40);
  assert.equal(p.report.extractedOccurrences, 41);
  assert.equal(
    JSON.stringify(
      migration.toLegacy(p.documents[0], p.assets, p.appPreferences),
    ),
    text,
  );
});
test("program preferences stay outside the match and missing assets refuse restoration", async () => {
  const { migration } = saveCore(),
    raw = legacy();
  raw.groups[0].groupAvatar = png;
  const p = await migration.preview({ rawText: JSON.stringify(raw) });
  assert.equal(p.appPreferences.values.masterVolume, 0.4);
  assert.equal("masterVolume" in p.documents[0].match, false);
  assert.throws(
    () => migration.toLegacy(p.documents[0], [], p.appPreferences),
    /asset|资源/,
  );
});
test("broken JSON and missing group identities fail without producing a partial save", async () => {
  const { migration } = saveCore();
  await assert.rejects(migration.preview({ rawText: "{broken" }));
  const x = legacy();
  x.groups[0].groupUid = x.groups[1].groupUid;
  await assert.rejects(
    migration.preview({ rawText: JSON.stringify(x) }),
    /identity|身份|duplicate/,
  );
});

test("portable save bundle preserves resource bytes and restores avatar references on import", async () => {
  const { migration } = saveCore(),
    raw = legacy();
  raw.groups[0].groupAvatar = png;
  const a = await migration.preview({ rawText: JSON.stringify(raw) });
  const text = JSON.stringify(migration.bundle(a.documents[0], a.assets));
  const b = await migration.preview({ rawText: text });
  assert.equal(b.documents[0].saveId, a.documents[0].saveId);
  assert.deepEqual(b.assets, a.assets);
  assert.equal(
    JSON.stringify(
      migration.toLegacy(b.documents[0], b.assets, a.appPreferences),
    ),
    JSON.stringify(raw),
  );
});
test("portable bundles reject missing or corrupted resources before returning an import preview", async () => {
  const { migration } = saveCore(),
    raw = legacy();
  raw.groups[0].groupAvatar = png;
  const a = await migration.preview({ rawText: JSON.stringify(raw) });
  const bundle = migration.bundle(a.documents[0], a.assets);
  bundle.assets = [];
  await assert.rejects(
    migration.preview({ rawText: JSON.stringify(bundle) }),
    /asset|资源/,
  );
  bundle.assets = structuredClone(a.assets);
  bundle.assets[0].dataBase64 = "AAAA";
  await assert.rejects(
    migration.preview({ rawText: JSON.stringify(bundle) }),
    /asset|资源|digest/,
  );
});

test("an explicitly versioned empty classroom remains a valid empty save", async () => {
  const { migration } = saveCore(),
    raw = legacy();
  raw.groups = [];
  const preview = await migration.preview({ rawText: JSON.stringify(raw) });
  assert.equal(preview.documents[0].roster.students.length, 0);
  assert.equal(preview.documents[0].match.groups.length, 0);
});
