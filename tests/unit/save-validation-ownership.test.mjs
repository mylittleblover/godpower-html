import test from "node:test";
import assert from "node:assert/strict";
import { saveCore, legacy } from "../fixtures/save-v2.mjs";
test("validation can assert an already-owned document without cloning, while public normalization keeps isolation", async () => {
  const { schema, migration } = saveCore(),
    doc = (await migration.preview({ rawText: JSON.stringify(legacy()) }))
      .documents[0];
  assert.equal(
    typeof schema.assertV2,
    "function",
    "owned pipeline needs validation without redundant full copies",
  );
  assert.equal(schema.assertV2(doc), doc);
  const copy = schema.validateV2(doc);
  assert.notEqual(copy, doc);
  copy.match.groups[0].score = 999;
  assert.notEqual(doc.match.groups[0].score, 999);
});
test("owned validation rejects the same malformed data as copying validation", async () => {
  const { schema, migration } = saveCore(),
    doc = (await migration.preview({ rawText: JSON.stringify(legacy()) }))
      .documents[0];
  assert.equal(typeof schema.assertV2, "function");
  for (const mutate of [
    (d) => (d.match.groups[0].score = NaN),
    (d) => d.roster.students.push({ ...d.roster.students[0] }),
    (d) => (d.match.extensions.constructor = "bad"),
  ]) {
    const copy = structuredClone(doc);
    mutate(copy);
    assert.throws(() => schema.assertV2(copy));
    assert.throws(() => schema.validateV2(copy));
  }
});
