import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { saveCore, legacy } from "../fixtures/save-v2.mjs";
async function fixture() {
  const c = saveCore();
  for (const f of ["domain/save-roster.js", "application/save-projection.js"])
    vm.runInContext(readFileSync("src/" + f, "utf8"), c.context);
  return {
    ...c,
    projection: c.context.SaveProjection,
    document: (await c.migration.preview({ rawText: JSON.stringify(legacy()) }))
      .documents[0],
  };
}
test("runtime projection carries small resource references without decoding inline avatars into history", async () => {
  const { migration, projection } = await fixture(),
    raw = legacy();
  raw.groups[0].groupAvatar =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  raw.history = [{ groups: structuredClone(raw.groups) }];
  const p = await migration.preview({ rawText: JSON.stringify(raw) });
  const runtime = projection.toRuntime(p.documents[0], {
    values: { masterVolume: 0.2 },
  });
  assert.equal(runtime.groups[0].groupAvatar, "");
  assert.equal(runtime.groups[0].avatarResourceId, p.assets[0].resourceId);
  assert.equal(JSON.stringify(runtime).includes("data:image/"), false);
  assert.equal(runtime.masterVolume, 0.2);
  const stored = await projection.fromRuntime(p.documents[0], runtime);
  assert.equal(
    stored.document.match.groups[0].groupAvatar.$asset,
    p.assets[0].resourceId,
  );
  assert.equal(
    migration.toLegacy(stored.document, p.assets, p.appPreferences).groups[0]
      .groupAvatar,
    raw.groups[0].groupAvatar,
  );
  assert.equal(runtime.groups[0].score, 100);
});
test("score-only persistence keeps student identities and roster revision stable", async () => {
  const { projection, document } = await fixture();
  const runtime = projection.toRuntime(document);
  runtime.groups[0].score = 102;
  const saved = await projection.fromRuntime(document, runtime);
  assert.equal(saved.document.match.groups[0].score, 102);
  assert.equal(
    JSON.stringify(saved.document.roster),
    JSON.stringify(document.roster),
  );
  assert.equal(saved.document.saveId, document.saveId);
  assert.equal(saved.document.revision, document.revision);
});
test("legacy membership updates preserve existing students and retain removed members as unassigned", async () => {
  const { projection, document } = await fixture();
  const runtime = projection.toRuntime(document);
  runtime.groups[0].members = ["01 甲", "04 新人"];
  delete runtime.rosterSnapshot;
  const saved = await projection.fromRuntime(document, runtime);
  const roster = saved.document.roster;
  assert.equal(roster.students.length, 4);
  assert.equal(roster.assignments.length, 3);
  assert.equal(
    roster.students[0].studentUid,
    document.roster.students[0].studentUid,
  );
  assert.equal(
    roster.assignments.some(
      (a) => a.studentUid === document.roster.students[1].studentUid,
    ),
    false,
  );
});

test("pending archived season survives same-season projection and clears only on new season", async () => {
  const { projection, document, schema } = await fixture();
  document.archives = [
    { id: 17, seasonId: document.match.season.seasonId, groups: [] },
  ];
  document.match.pendingSettlement = {
    recordId: 17,
    seasonId: document.match.season.seasonId,
  };
  const runtime = projection.toRuntime(document);
  const same = await projection.fromRuntime(document, runtime);
  assert.equal(same.document.match.pendingSettlement.recordId, 17);
  runtime.seasonId = "season-new-after-archive";
  const next = await projection.fromRuntime(document, runtime);
  assert.equal(next.document.match.pendingSettlement, undefined);
  assert.equal(next.document.archives.length, 1);
});

test("ordinary runtime saves preserve identities without running legacy import hashes", async () => {
  const { projection, document, context } = await fixture();
  const runtime = projection.toRuntime(document);
  runtime.groups[0].score += 2;
  let hashes = 0;
  const original = context.crypto;
  context.crypto = {
    subtle: {
      digest(...args) {
        hashes++;
        return original.subtle.digest(...args);
      },
    },
  };
  const result = await projection.fromRuntime(document, runtime);
  assert.equal(
    hashes,
    0,
    "normal saves must not rehash an import source and every student",
  );
  assert.equal(
    result.document.roster.students[0].studentUid,
    document.roster.students[0].studentUid,
  );
  assert.equal(result.document.match.groups[0].score, 102);
});

test("direct projection matches the verified prior save contract for ordinary score, history and configuration changes", async () => {
  const c = saveCore();
  vm.runInContext(
    execFileSync(
      "git",
      ["show", "bd02970:src/application/save-projection.js"],
      { encoding: "utf8" },
    ),
    c.context,
  );
  const previous = c.context.SaveProjection;
  vm.runInContext(
    readFileSync("src/application/save-projection.js", "utf8"),
    c.context,
  );
  const current = c.context.SaveProjection;
  const document = (
    await c.migration.preview({ rawText: JSON.stringify(legacy()) })
  ).documents[0];
  for (const variant of ["score", "history", "config"]) {
    const runtime = current.toRuntime(document);
    if (variant === "score") {
      runtime.groups[0].score += 7;
      runtime.groups[0].name = "新组名";
    }
    if (variant === "history") {
      runtime.history = Array.from({ length: 4 }, (_, i) => ({
        desc: "history " + i,
        groups: structuredClone(runtime.groups),
      }));
      runtime.round = { roundActive: true, evaluated: false };
    }
    if (variant === "config") {
      runtime.customFeature = { enabled: true, values: [1, 2, 3] };
      runtime.masterVolume = 0.35;
      runtime.saveAllIn = true;
    }
    const old = await previous.fromRuntime(document, runtime),
      next = await current.fromRuntime(document, runtime);
    assert.equal(
      JSON.stringify(next),
      JSON.stringify(old),
      variant +
        " must preserve the existing document, asset and preference contract",
    );
  }
});
