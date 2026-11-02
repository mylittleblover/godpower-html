/* Drop only declarations with a later supported declaration of the same property,
   matching selector and conditional scope. Never rewrite CSS through CSSOM. */
import { readFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
} from "./css-source.mjs";
import { launch } from "../tests/fixtures/browser.mjs";
const root = process.env.CSS_AUDIT_DIR || "artifacts/css-consolidation-3.0.66";
const manifest = JSON.parse(await readFile("src/manifest.json", "utf8")),
  sources = [],
  declarations = [];
for (const b of manifest.blocks) {
  if (b.type !== "style") continue;
  const path = "src/" + b.path,
    source = await readFile(path, "utf8");
  sources.push({
    path,
    source,
    sha256: createHash("sha256").update(source).digest("hex"),
  });
  function visit(text, offset = 0, conditions = []) {
    for (const r of scanCssBlocks(text)) {
      if (/^@(media|supports|container)\b/.test(r.prelude)) {
        visit(r.body, offset + r.open + 1, [...conditions, r.prelude]);
        continue;
      }
      if (r.prelude.startsWith("@")) continue;
      for (const d of scanDeclarations(r.body))
        declarations.push({
          path,
          selector: r.prelude,
          conditions,
          property: d.property,
          value: d.value,
          start: offset + r.open + 1 + d.start,
          end: offset + r.open + 1 + d.end,
          line: source.slice(0, offset + r.start).split("\n").length,
        });
    }
  }
  visit(source);
}
const browser = await launch();
let normalized;
try {
  const page = await browser.newPage();
  normalized = await page.evaluate(
    (rows) =>
      rows.map((r) => {
        const sheet = new CSSStyleSheet();
        let selector = null;
        try {
          sheet.replaceSync(r.selector + "{}");
          selector = sheet.cssRules[0]?.selectorText || null;
        } catch {}
        const value = r.value.replace(/\s*!important\s*$/, "").trim();
        return {
          selector,
          supported:
            CSS.supports(r.property, value) &&
            !/^revert(?:-layer)?$/.test(value),
        };
      }),
    declarations,
  );
  const later = new Map(),
    removed = [];
  const important = (v) => (/!important\s*$/.test(v) ? 1 : 0);
  for (let i = declarations.length - 1; i >= 0; i--) {
    const row = declarations[i],
      validation = normalized[i];
    if (!validation.selector || !validation.supported) continue;
    const key = JSON.stringify([
      row.conditions,
      validation.selector,
      row.property,
    ]);
    const candidates = later.get(key) || [];
    const witness = candidates.find(
      (next) => important(next.value) >= important(row.value),
    );
    if (witness)
      removed.push({
        ...row,
        normalizedSelector: validation.selector,
        coveredBy: witness,
      });
    else
      later.set(key, [
        ...candidates,
        { ...row, normalizedSelector: validation.selector },
      ]);
  }
  const report = {
    baseline: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    browser: browser.version(),
    sourceHashes: Object.fromEntries(sources.map((r) => [r.path, r.sha256])),
    declarations: declarations.length,
    removed,
  };
  console.log(
    JSON.stringify({
      declarations: declarations.length,
      removed: removed.length,
      bytes: removed.reduce((n, r) => n + r.end - r.start, 0),
    }),
  );
  if (process.argv.includes("--apply")) {
    const evidence = root + "/supported-removals.json";
    let exists = false;
    try {
      await access(evidence);
      exists = true;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    if (exists)
      throw Error("Refusing to overwrite existing migration evidence");
    for (const row of sources) {
      let out = row.source;
      for (const d of removed
        .filter((d) => d.path === row.path)
        .sort((a, b) => b.start - a.start))
        out = out.slice(0, d.start) + out.slice(d.end);
      out = removeEmptyStyleRules(out);
      if (out !== row.source) await writeFile(row.path, out);
    }
    await writeFile(evidence, JSON.stringify(report, null, 2) + "\n");
  } else
    await writeFile(
      root + "/supported-candidates.json",
      JSON.stringify(report, null, 2) + "\n",
    );
} finally {
  await browser.close();
}
