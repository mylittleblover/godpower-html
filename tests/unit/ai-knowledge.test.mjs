import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const c = vm.createContext({ URL });
vm.runInContext(
  readFileSync("src/domain/ai-knowledge.js", "utf8") +
    readFileSync("src/resources/subject-library.js", "utf8"),
  c,
);
const M = vm.runInContext("AIKnowledge", c),
  docs = vm.runInContext("SubjectLibrary", c);
test("all nine subjects have honestly classified offline study notes and textbook links", () => {
  const all = docs.map((d) => M.validate(d));
  assert.equal(new Set(all.map((d) => d.subject)).size, 9);
  assert.equal(all.filter((d) => d.kind === "study-note").length, 27);
  assert.equal(all.filter((d) => d.kind === "textbook-link").length, 9);
  assert.ok(all.every((d) => d.license && d.sourceLabel));
  assert.ok(!all.some((d) => d.kind === "textbook-full"));
});
test("biology question retrieves relevant notes and respects selected subject", () => {
  const r = M.search(docs, "光合作用叶绿体能量转化", { subject: "生物" });
  assert.ok(r.length > 0 && r.length <= 4);
  assert.ok(r.every((d) => d.subject === "生物"));
  assert.ok(r[0].text.includes("光合作用"));
  assert.ok(M.search(docs, "zzzznomatch").length === 0);
});
test("bad imported data cannot smuggle executable fields or excessively large text", () => {
  const d = docs[0];
  assert.throws(() => M.validate({ ...d, script: "evil" }));
  assert.throws(() => M.validate({ ...d, sourceUrl: "javascript:alert(1)" }));
  assert.throws(() => M.validate({ ...d, text: "x".repeat(200001) }));
});
