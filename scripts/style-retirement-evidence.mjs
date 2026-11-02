import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
const root = "artifacts/css-consolidation-3.0.66",
  baseline = "fc81d1f";
const evaluate = (s) =>
  JSON.parse(
    JSON.stringify(vm.runInNewContext(s + "\nGodPowerComponentCatalog")),
  );
const before = evaluate(
    execFileSync("git", ["show", baseline + ":src/ui/component-catalog.js"], {
      encoding: "utf8",
      maxBuffer: 2e6,
    }),
  ),
  after = evaluate(await readFile("src/ui/component-catalog.js", "utf8"));
const edits = [];
for (const name of [
  "selector-removals",
  "selector-removals-extended",
  "selector-removals-tail",
  "selector-removals-pseudo",
  "selector-removals-compat",
])
  edits.push(...JSON.parse(await readFile(root + "/" + name + ".json")).edits);
const rewrite = JSON.parse(await readFile(root + "/selector-rewrites.json"));
edits.push(
  ...rewrite.edits.map((row) => ({
    path: rewrite.path,
    retired: [row.original],
  })),
);
const relocations = JSON.parse(await readFile("src/source-relocations.json"));
function currentOwner(path) {
  let next = path.slice(4);
  const seen = new Set();
  while (relocations[next]) {
    if (seen.has(next)) throw Error("Cyclic source ownership");
    seen.add(next);
    next = relocations[next];
  }
  return "src/" + next;
}
const removed = before.classes
  .filter((item) => !after.classes.some((row) => row.name === item.name))
  .map((item) => ({
    ...item,
    proof: edits
      .filter((edit) =>
        edit.retired.some((selector) =>
          new RegExp("\\." + item.name + "(?![\\w-])").test(selector),
        ),
      )
      .map((edit) => ({
        path: edit.path,
        selectors: edit.retired.filter((selector) =>
          new RegExp("\\." + item.name + "(?![\\w-])").test(selector),
        ),
      })),
  }));
for (const item of removed)
  for (const path of item.sources)
    if (
      !item.proof.some((row) => currentOwner(row.path) === currentOwner(path))
    )
      throw Error(
        "Missing style retirement proof: " + item.name + " in " + path,
      );
await writeFile(
  root + "/class-removals.json",
  JSON.stringify(
    {
      baseline,
      before: before.classes.length,
      after: after.classes.length,
      removed,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    before: before.classes.length,
    after: after.classes.length,
    removed: removed.length,
  }),
);
