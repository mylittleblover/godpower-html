import { readFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  scanCssBlocks,
  removeEmptyStyleRules,
  mandatorySelectorClasses,
} from "./css-source.mjs";
const manifest = JSON.parse(await readFile("src/manifest.json"));
const contract = JSON.parse(
  await readFile("scripts/retired-style-contract.json"),
);
const classes = Object.values(contract).flatMap((x) => x.classes);
let logic = await readFile("src/index.template.html", "utf8");
for (const b of manifest.blocks)
  if (b.type === "script" && b.path !== "ui/component-catalog.js")
    logic += "\n" + (await readFile("src/" + b.path, "utf8"));
for (const name of classes)
  if (new RegExp("(?<![\\w-])" + name + "(?![\\w-])").test(logic))
    throw Error(
      "Retired class regained a literal business/preview reference: " + name,
    );
const edits = [],
  sources = [];
function branches(selector) {
  const out = [];
  let start = 0,
    depth = 0,
    quote = null;
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "," && !depth) {
      out.push(selector.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(selector.slice(start).trim());
  return out;
}
for (const b of manifest.blocks) {
  if (b.type !== "style") continue;
  const path = "src/" + b.path,
    source = await readFile(path, "utf8");
  sources.push({
    path,
    source,
    sha256: createHash("sha256").update(source).digest("hex"),
  });
  function visit(text, offset = 0) {
    for (const r of scanCssBlocks(text)) {
      if (/^@(media|supports|container)\b/.test(r.prelude)) {
        visit(r.body, offset + r.open + 1);
        continue;
      }
      if (r.prelude.startsWith("@")) continue;
      const list = branches(r.prelude),
        retired = list.filter((selector) =>
          mandatorySelectorClasses(selector).some((name) =>
            classes.includes(name),
          ),
        );
      if (!retired.length) continue;
      const kept = list.filter((s) => !retired.includes(s));
      edits.push({
        path,
        start: offset + r.start,
        end: kept.length ? offset + r.open : offset + r.end,
        original: text.slice(r.start, kept.length ? r.open : r.end),
        replacement: kept.length ? kept.join(",\n") + " " : "",
        retired,
      });
    }
  }
  visit(source);
}
const root = "artifacts/css-consolidation-3.0.66";
console.log(
  JSON.stringify({
    retiredClasses: classes.length,
    affectedRules: edits.length,
    removedSelectorBranches: edits.reduce((n, r) => n + r.retired.length, 0),
    bytes: edits.reduce(
      (n, r) => n + r.original.length - r.replacement.length,
      0,
    ),
  }),
);
if (process.argv.includes("--apply")) {
  const evidence =
    root +
    "/" +
    (process.env.CSS_RETIREMENT_REPORT || "selector-removals.json");
  let exists = false;
  try {
    await access(evidence);
    exists = true;
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  if (exists) throw Error("Refusing to overwrite historical cleanup evidence");
  for (const row of sources) {
    let out = row.source;
    for (const edit of edits
      .filter((e) => e.path === row.path)
      .sort((a, b) => b.start - a.start))
      out = out.slice(0, edit.start) + edit.replacement + out.slice(edit.end);
    out = removeEmptyStyleRules(out);
    if (out !== row.source) await writeFile(row.path, out);
  }
  await writeFile(
    root +
      "/" +
      (process.env.CSS_RETIREMENT_REPORT || "selector-removals.json"),
    JSON.stringify(
      {
        contract,
        sourceHashes: Object.fromEntries(
          sources.map((s) => [s.path, s.sha256]),
        ),
        edits,
      },
      null,
      2,
    ) + "\n",
  );
} else
  await writeFile(
    root + "/selector-candidates.json",
    JSON.stringify({ contract, edits }, null, 2) + "\n",
  );
