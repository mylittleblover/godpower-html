import { readFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
} from "./css-source.mjs";
import { launch } from "../tests/fixtures/browser.mjs";
const resets = {
  inset: ["top", "right", "bottom", "left"],
  margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
  padding: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  overflow: ["overflow-x", "overflow-y"],
  gap: ["row-gap", "column-gap"],
  "border-color": [
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
  ],
  "border-width": [
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
  ],
  "border-style": [
    "border-top-style",
    "border-right-style",
    "border-bottom-style",
    "border-left-style",
  ],
  background: [
    "background-image",
    "background-color",
    "background-size",
    "background-position",
    "background-repeat",
    "background-attachment",
    "background-origin",
    "background-clip",
  ],
};
const m = JSON.parse(await readFile("src/manifest.json")),
  sources = [],
  candidates = [];
const important = (v) => (/!important\s*$/.test(v) ? 1 : 0);
for (const b of m.blocks) {
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
      const ds = scanDeclarations(r.body);
      ds.forEach((d, i) => {
        const later = ds
          .slice(i + 1)
          .find(
            (next) =>
              resets[next.property]?.includes(d.property) &&
              important(next.value) >= important(d.value) &&
              !/^revert(?:-layer)?/.test(next.value),
          );
        if (!later) return;
        const base = offset + r.open + 1;
        candidates.push({
          path,
          selector: r.prelude,
          property: d.property,
          value: d.value,
          start: base + d.start,
          end: base + d.end,
          coveredBy: {
            property: later.property,
            value: later.value,
            start: base + later.start,
            end: base + later.end,
          },
        });
      });
    }
  }
  visit(source);
}
const browser = await launch();
try {
  const page = await browser.newPage();
  const valid = await page.evaluate(
    (rows) =>
      rows.map((r) =>
        CSS.supports(
          r.coveredBy.property,
          r.coveredBy.value.replace(/\s*!important\s*$/, ""),
        ),
      ),
    candidates,
  );
  const removed = candidates.filter((_, i) => valid[i]);
  console.log(
    JSON.stringify({
      removed: removed.length,
      bytes: removed.reduce((n, r) => n + r.end - r.start, 0),
    }),
  );
  const root = "artifacts/css-consolidation-3.0.66";
  if (process.argv.includes("--apply")) {
    const evidence = root + "/longhand-removals.json";
    let exists = false;
    try {
      await access(evidence);
      exists = true;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    if (exists)
      throw Error("Refusing to overwrite historical cleanup evidence");
    for (const row of sources) {
      let out = row.source;
      for (const r of removed
        .filter((r) => r.path === row.path)
        .sort((a, b) => b.start - a.start))
        out = out.slice(0, r.start) + out.slice(r.end);
      out = removeEmptyStyleRules(out);
      if (out !== row.source) await writeFile(row.path, out);
    }
    await writeFile(
      root + "/longhand-removals.json",
      JSON.stringify(
        {
          sourceHashes: Object.fromEntries(
            sources.map((s) => [s.path, s.sha256]),
          ),
          removed,
        },
        null,
        2,
      ) + "\n",
    );
  } else
    await writeFile(
      root + "/longhand-candidates.json",
      JSON.stringify({ removed }, null, 2) + "\n",
    );
} finally {
  await browser.close();
}
