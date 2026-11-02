// Read-only review candidates. Absence of a full literal is never deletion proof.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const baselineRef = process.env.STYLE_AUDIT_BASELINE;
const readSource = async (path) =>
  baselineRef
    ? execFileSync("git", ["show", baselineRef + ":" + path], {
        encoding: "utf8",
        maxBuffer: 2e6,
      })
    : readFile(path, "utf8");
import { scanCssBlocks, scanDeclarations } from "./css-source.mjs";
const manifest = JSON.parse(await readSource("src/manifest.json")),
  classes = new Map(),
  keyframes = [],
  rules = [],
  files = [];
let logic = await readSource("src/index.template.html"),
  outside = "",
  cssBytes = 0,
  important = 0;
for (const b of manifest.blocks) {
  const s = await readSource("src/" + b.path);
  if (b.type === "script" && b.path !== "ui/component-catalog.js") {
    logic += "\n" + s;
    outside += "\n" + s;
  }
  if (b.type !== "style") continue;
  const path = "src/" + b.path;
  files.push(path);
  cssBytes += Buffer.byteLength(s);
  important += (s.match(/!important\b/g) || []).length;
  function withoutKeyframes(text) {
    let result = text;
    for (const rule of scanCssBlocks(text).toReversed()) {
      const key = rule.prelude.match(/^@keyframes\s+([\w-]+)/);
      if (key) {
        keyframes.push({ name: key[1], path });
        result = result.slice(0, rule.start) + result.slice(rule.end);
      } else if (/^@(media|supports|container)\b/.test(rule.prelude)) {
        const body = withoutKeyframes(rule.body);
        result =
          result.slice(0, rule.open + 1) + body + result.slice(rule.end - 1);
      }
    }
    return result;
  }
  const without = withoutKeyframes(s);
  outside += "\n" + without;
  function visit(text, conditions = []) {
    for (const r of scanCssBlocks(text)) {
      if (/^@(media|supports|container)\b/.test(r.prelude)) {
        visit(r.body, [...conditions, r.prelude]);
        continue;
      }
      if (r.prelude.startsWith("@")) continue;
      for (const name of r.prelude.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
        if (!classes.has(name[1])) classes.set(name[1], new Set());
        classes.get(name[1]).add(path);
      }
      for (const d of scanDeclarations(r.body))
        rules.push({
          path,
          conditions,
          selector: r.prelude,
          property: d.property,
          value: d.value,
        });
    }
  }
  visit(s);
}
const grouped = new Map();
for (const row of rules) {
  const key = JSON.stringify([
    row.conditions,
    row.selector.replace(/\s+/g, " "),
    row.property,
  ]);
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(row);
}
const unresolvedLiteralReferences = [...classes]
  .filter(
    ([name]) => !new RegExp("(?<![\\w-])" + name + "(?![\\w-])").test(logic),
  )
  .map(([name, paths]) => ({
    name,
    paths: [...paths],
    status: "REVIEW_REQUIRED",
    note: /^(aura-|score-roll-|count-)/.test(name)
      ? "Known dynamically assembled class family; retain"
      : "No full literal reference is not a reachability proof; trace renderer and compatibility context first",
  }));
const report = {
  cssFiles: files.length,
  cssBytes,
  important,
  classNames: classes.size,
  keyframes: keyframes.length,
  declarations: rules.length,
  repeatedSelectorProperties: [...grouped.values()].filter(
    (rows) => rows.length > 1,
  ),
  unreferencedKeyframes: keyframes.filter(
    (k) => !new RegExp("(?<![\\w-])" + k.name + "(?![\\w-])").test(outside),
  ),
  unresolvedLiteralReferences,
};
const output =
  process.env.STYLE_AUDIT_OUTPUT ||
  "artifacts/css-consolidation-3.0.66/style-audit.json";
await mkdir(output.slice(0, output.lastIndexOf("/")), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify({
    cssFiles: report.cssFiles,
    cssBytes,
    important,
    classNames: classes.size,
    keyframes: keyframes.length,
    repeatedSelectorProperties: report.repeatedSelectorProperties.length,
    unreferencedKeyframes: report.unreferencedKeyframes.length,
    reviewCandidates: unresolvedLiteralReferences.length,
  }),
);
