// The product and preview body both carry modern-flat. Under that explicit
// invariant, a stronger body.modern-flat variant can make a base declaration dead.
import { readFile, writeFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
  mandatorySelectorClasses,
} from "./css-source.mjs";
import { launch } from "../tests/fixtures/browser.mjs";
const root = "artifacts/css-consolidation-3.0.66";
const template = await readFile("src/index.template.html", "utf8");
if (!/<body\b[^>]*class="[^"]*\bmodern-flat\b/.test(template))
  throw Error("Required root theme invariant absent");
if (/<(?:html|body)\b[^>]*\bid=/.test(template))
  throw Error("Root ID invariant changed; re-audit descendant proofs");
const manifest = JSON.parse(await readFile("src/manifest.json")),
  sources = [],
  rows = [];
function splitSelectors(s) {
  let start = 0,
    depth = 0,
    quote = null;
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && !depth) {
      out.push(s.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(s.slice(start).trim());
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
  function visit(text, offset = 0, conditions = []) {
    for (const r of scanCssBlocks(text)) {
      if (/^@(media|supports|container)\b/.test(r.prelude)) {
        visit(r.body, offset + r.open + 1, [...conditions, r.prelude]);
        continue;
      }
      if (r.prelude.startsWith("@")) continue;
      for (const d of scanDeclarations(r.body))
        rows.push({
          path,
          selector: r.prelude,
          conditions,
          property: d.property,
          value: d.value,
          start: offset + r.open + 1 + d.start,
          end: offset + r.open + 1 + d.end,
        });
    }
  }
  visit(source);
}
const browser = await launch();
try {
  const page = await browser.newPage();
  const validations = await page.evaluate(
    (rows) =>
      rows.map((r) => {
        let selector = "";
        try {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(r.selector + "{}");
          selector = sheet.cssRules[0]?.selectorText || "";
        } catch {}
        const value = r.value.replace(/\s*!important\s*$/, "");
        return {
          selector,
          supported:
            CSS.supports(r.property, value) &&
            !/^\s*revert(?:-layer)?\s*$/.test(value),
        };
      }),
    rows,
  );
  const modern = new Map(),
    priority = (v) => (/!important\s*$/.test(v) ? 1 : 0),
    bodyFlags = new Set([
      "modern-flat",
      "theme-marx",
      "items-disabled",
      "ui-modal-open",
      "ui-window-open",
      "gp-intro-active",
      "gp-intro-reveal",
      "home-layout-editing",
    ]);
  for (let i = 0; i < rows.length; i++) {
    if (!validations[i].supported) continue;
    const row = rows[i];
    for (const branch of splitSelectors(validations[i].selector)) {
      if (!/^body\.modern-flat(?=$|[\s:.#\[])/.test(branch)) continue;
      const equivalents = [branch.replace(/^body\.modern-flat/, "body")];
      const plain = branch.match(/^body\.modern-flat\s+(?![>+~])(.+)$/)?.[1];
      if (plain && !/\b(?:body|html)\b|:root|:host/.test(plain)) {
        // A positive first compound cannot match the html/body roots, whose class
        // modifiers are reserved. Pseudo-only ancestors need a separate proof.
        let depth = 0,
          quote = null,
          end = plain.length;
        for (let n = 0; n < plain.length; n++) {
          const ch = plain[n];
          if (quote) {
            if (ch === "\\") n++;
            else if (ch === quote) quote = null;
            continue;
          }
          if (ch === '"' || ch === "'") quote = ch;
          else if (ch === "(" || ch === "[") depth++;
          else if (ch === ")" || ch === "]") depth--;
          else if (!depth && /[\s>+~]/.test(ch)) {
            end = n;
            break;
          }
        }
        const first = plain.slice(0, end),
          anchors = mandatorySelectorClasses(first);
        if (
          (anchors.length ||
            /^#[a-zA-Z_][\w-]*(?=$|[.:\[])/.test(first) ||
            /^(?:button|input|select|textarea|option|label|div|span|section|main|nav|header|footer|article|aside|p|ul|li|table|tr|td|th|img|canvas|svg)(?=$|[.#:\[])/.test(
              first,
            )) &&
          !anchors.some((name) => bodyFlags.has(name))
        )
          equivalents.push(plain);
      }
      for (const base of equivalents) {
        const key = JSON.stringify([base, row.property]);
        if (!modern.has(key)) modern.set(key, []);
        modern.get(key).push({ ...row, branch, base });
      }
    }
  }
  const removed = [];
  for (let i = 0; i < rows.length; i++) {
    if (!validations[i].supported) continue;
    const row = rows[i];
    if (row.path === "src/styles/components/tooltips.css") continue;
    const branches = splitSelectors(validations[i].selector);
    if (!branches.length || branches.some((b) => /body\.modern-flat/.test(b)))
      continue;
    const witnesses = branches.map((branch) =>
      (modern.get(JSON.stringify([branch, row.property])) || []).find(
        (w) =>
          priority(w.value) >= priority(row.value) &&
          (w.conditions.length === 0 ||
            JSON.stringify(w.conditions) === JSON.stringify(row.conditions)),
      ),
    );
    if (witnesses.every(Boolean))
      removed.push({ ...row, canonicalBranches: branches, witnesses });
  }
  console.log(
    JSON.stringify({
      removed: removed.length,
      bytes: removed.reduce((n, r) => n + r.end - r.start, 0),
      files: new Set(removed.map((r) => r.path)).size,
    }),
  );
  const report = {
    browser: browser.version(),
    invariant: "body.modern-flat in product template and preview clone",
    sourceHashes: Object.fromEntries(sources.map((r) => [r.path, r.sha256])),
    removed,
  };
  if (process.argv.includes("--apply")) {
    const file =
      root +
      "/" +
      (process.env.CSS_FLAT_PROOF || "flat-dominance-removals.json");
    let exists = false;
    try {
      await access(file);
      exists = true;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    if (exists) throw Error("Refusing to overwrite proof");
    for (const s of sources) {
      let out = s.source;
      for (const r of removed
        .filter((r) => r.path === s.path)
        .sort((a, b) => b.start - a.start))
        out = out.slice(0, r.start) + out.slice(r.end);
      out = removeEmptyStyleRules(out);
      if (out !== s.source) await writeFile(s.path, out);
    }
    await writeFile(file, JSON.stringify(report, null, 2) + "\n");
  } else
    await writeFile(
      root +
        "/" +
        (process.env.CSS_FLAT_CANDIDATES || "flat-dominance-candidates.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
} finally {
  await browser.close();
}
