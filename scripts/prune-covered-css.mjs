// Conservative cascade cleanup: exact later unconditional selector/property/value only.
import { readFile, writeFile, access } from "node:fs/promises";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
} from "./css-source.mjs";
const manifest = JSON.parse(await readFile("src/manifest.json", "utf8"));
const sources = [];
const declarations = [];
for (const { path, type } of manifest.blocks) {
  if (type !== "style") continue;
  const file = "src/" + path,
    source = await readFile(file, "utf8");
  sources.push({ file, source });
  function visit(text, offset = 0, conditions = []) {
    for (const rule of scanCssBlocks(text)) {
      if (/^@(media|supports|container)\b/.test(rule.prelude)) {
        visit(rule.body, offset + rule.open + 1, [...conditions, rule.prelude]);
        continue;
      }
      if (rule.prelude.startsWith("@")) continue;
      for (const d of scanDeclarations(rule.body))
        declarations.push({
          path: file,
          line: source.slice(0, offset + rule.start).split("\n").length,
          conditions,
          selector: rule.prelude,
          property: d.property,
          value: d.value,
          start: offset + rule.open + 1 + d.start,
          end: offset + rule.open + 1 + d.end,
        });
    }
  }
  visit(source);
}
const later = new Map(),
  removed = [];
const simpleProperties = new Set(
  "width height min-width max-width min-height max-height padding margin padding-top padding-right padding-bottom padding-left margin-top margin-right margin-bottom margin-left gap row-gap column-gap font-size font-weight line-height border-radius display position z-index opacity overflow overflow-x overflow-y align-items justify-content flex-direction flex-wrap text-align white-space visibility cursor object-fit box-sizing top right bottom left color background-color border-color border-width border-style".split(
    " ",
  ),
);
function priority(value) {
  return /!important\s*$/.test(value) ? 1 : 0;
}
function guaranteedValue(d) {
  const value = d.value.replace(/\s*!important\s*$/, "").trim();
  // Restrict changed-value proofs to longstanding CSS grammar, never computed vars,
  // vendor fallbacks, shorthand resources, animations, custom properties or CSS-wide rollback.
  return (
    simpleProperties.has(d.property) &&
    !/var\(|env\(|revert|inherit|unset|initial|!|\\/.test(value) &&
    /^(?:#[a-fA-F0-9]{3,8}|rgba?\([0-9.,% /]+\)|[a-zA-Z0-9 .%+-]+)$/.test(value)
  );
}
for (const d of declarations.toReversed()) {
  const key = JSON.stringify([d.conditions, d.selector, d.property]);
  const candidates = later.get(key) || [];
  const witness = candidates.find(
    (next) =>
      priority(next.value) >= priority(d.value) &&
      (next.value === d.value ||
        (guaranteedValue(next) &&
          !/(?:^|[ -])(?:subgrid|masonry|anchor|stretch|fit-content|revert)(?:$|[ -])/.test(
            next.value,
          ))),
  );
  if (witness)
    removed.push({
      ...d,
      proof: witness.value === d.value ? "identical" : "later-valid-literal",
      coveredBy: {
        path: witness.path,
        line: witness.line,
        start: witness.start,
        value: witness.value,
        conditions: witness.conditions,
      },
    });
  else later.set(key, [...candidates, d]);
}
console.log(
  JSON.stringify({
    declarations: declarations.length,
    removable: removed.length,
    bytes: removed.reduce((n, d) => n + d.end - d.start, 0),
  }),
);
if (process.argv.includes("--apply")) {
  const evidence = "artifacts/semantic-governance-3.0.65/css-removals.json";
  let exists = false;
  try {
    await access(evidence);
    exists = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (exists)
    throw Error(
      "Historical deletion evidence already exists; use a new versioned audit before applying another pass",
    );
  for (const { file, source } of sources) {
    let out = source;
    for (const d of removed
      .filter((d) => d.path === file)
      .sort((a, b) => b.start - a.start))
      out = out.slice(0, d.start) + out.slice(d.end);
    out = removeEmptyStyleRules(out);
    if (out !== source) await writeFile(file, out);
  }
  await writeFile(
    "artifacts/semantic-governance-3.0.65/css-removals.json",
    JSON.stringify({ baseline: "645ea0f", removed }, null, 2) + "\n",
  );
}
