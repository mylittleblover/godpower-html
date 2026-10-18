import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { launch, setup, dismissStartup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  s = createServer((q, r) => r.end(html));
await new Promise((r) => s.listen(0, "127.0.0.1", r));
const b = await launch(),
  p = await b.newPage(),
  results = [],
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
try {
  await p.goto(`http://127.0.0.1:${s.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(p);
  const expected = await p.evaluate(() => {
    ClassroomFeedback.setOptions({
      slots: [2, 4, 6, -2, -4, -6],
      style: "burst",
      duration: 2600,
      pickEffects: true,
      scoreEffects: true,
      clickEnabled: false,
      clickVolume: 0.2,
    });
    saveState();
    return ClassroomFeedback.getOptions();
  });
  await p.reload({ waitUntil: "domcontentloaded" });
  await dismissStartup(p);
  assert.deepEqual(
    await p.evaluate(() => ClassroomFeedback.getOptions()),
    expected,
  );
  results.push({
    name: "Real reload restores all six slots and independent effect/audio options",
    status: "PASS",
  });
  console.log("PASS reload preferences");
  const before = await p.evaluate(() => {
    localStorage.setItem("godpower_score_feedback_v1", "{broken");
    return state.groups.map((g) => ({
      id: g.id,
      name: g.name,
      score: g.score,
    }));
  });
  await p.reload({ waitUntil: "domcontentloaded" });
  await dismissStartup(p);
  assert.deepEqual(
    await p.evaluate(() => ClassroomFeedback.getOptions().slots),
    [1, 2, 5, -1, -2, -5],
  );
  assert.deepEqual(
    await p.evaluate(() =>
      state.groups.map((g) => ({ id: g.id, name: g.name, score: g.score })),
    ),
    before,
  );
  assert.deepEqual(errors, []);
  results.push({
    name: "Corrupt UI preferences fall back without changing classroom groups/scores",
    status: "PASS",
  });
  console.log("PASS corrupt preference isolation");
} finally {
  await b.close();
  s.close();
  await writeFile(
    "artifacts/classroom-feedback/restore-results.json",
    JSON.stringify(
      {
        sha256: createHash("sha256").update(html).digest("hex"),
        results,
        errors,
      },
      null,
      2,
    ),
  );
}
