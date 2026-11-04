import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { format } from "prettier";
import {
  scanCssBlocks,
  scanDeclarations,
  removeEmptyStyleRules,
} from "../../scripts/css-source.mjs";
const root = "artifacts/css-consolidation-3.0.66";
const read = (p) => JSON.parse(readFileSync(root + "/" + p + ".json", "utf8"));
const supported = read("supported-removals"),
  keys = read("keyframe-removals"),
  longhands = read("longhand-removals"),
  retired = read("selector-removals"),
  merge = read("owner-merge");
const baseline = (path) =>
  execFileSync("git", ["show", supported.baseline + ":" + path], {
    encoding: "utf8",
    maxBuffer: 2e6,
  });
const hash = (s) => createHash("sha256").update(s).digest("hex");
const stages = new Map(
  Object.keys(supported.sourceHashes).map((path) => [path, baseline(path)]),
);
function apply(rows, edit) {
  for (const path of new Set(rows.map((r) => r.path))) {
    let s = stages.get(path);
    for (const row of rows
      .filter((r) => r.path === path)
      .sort((a, b) => b.start - a.start)) {
      s = edit(s, row);
    }
    stages.set(path, removeEmptyStyleRules(s));
  }
}
function rules(text, offset = 0, conditions = []) {
  const result = [];
  for (const r of scanCssBlocks(text)) {
    if (/^@(media|supports|container)\b/.test(r.prelude)) {
      result.push(
        ...rules(r.body, offset + r.open + 1, [...conditions, r.prelude]),
      );
      continue;
    }
    if (r.prelude.startsWith("@")) continue;
    for (const d of scanDeclarations(r.body))
      result.push({
        ...d,
        start: offset + r.open + 1 + d.start,
        end: offset + r.open + 1 + d.end,
        selector: r.prelude,
        conditions,
      });
  }
  return result;
}

test("3.0.66 CSS edits preserve every non-retired declaration and original cascade order", async () => {
  assert.equal(supported.removed.length, 39);
  assert.equal(keys.removed.length, 10);
  assert.equal(longhands.removed.length, 8);
  assert.equal(
    retired.edits.reduce((n, r) => n + r.retired.length, 0),
    48,
  );
  const indexed = new Map([...stages].map(([p, s]) => [p, rules(s)]));
  for (const [p, s] of stages) assert.equal(hash(s), supported.sourceHashes[p]);
  for (const row of supported.removed) {
    const actual = indexed.get(row.path).find((r) => r.start === row.start),
      witness = indexed
        .get(row.coveredBy.path)
        .find((r) => r.start === row.coveredBy.start);
    assert.ok(actual && witness);
    assert.equal(actual.property, witness.property);
    assert.equal(actual.value, row.value);
    assert.equal(witness.value, row.coveredBy.value);
    assert.deepEqual(actual.conditions, witness.conditions);
    assert.equal(row.normalizedSelector, row.coveredBy.normalizedSelector);
    assert.ok(
      Number(/!important\s*$/.test(witness.value)) >=
        Number(/!important\s*$/.test(actual.value)),
    );
  }
  apply(supported.removed, (s, r) => s.slice(0, r.start) + s.slice(r.end));
  for (const row of keys.removed)
    assert.equal(stages.get(row.path).slice(row.start, row.end), row.text);
  apply(keys.removed, (s, r) => s.slice(0, r.start) + s.slice(r.end));
  for (const [p, s] of stages) assert.equal(hash(s), longhands.sourceHashes[p]);
  for (const row of longhands.removed) {
    assert.equal(row.coveredBy.property, "inset");
    assert.ok(["top", "right", "bottom", "left"].includes(row.property));
    assert.ok(row.start < row.coveredBy.start);
    assert.ok(
      stages
        .get(row.path)
        .slice(row.coveredBy.start, row.coveredBy.end)
        .includes("inset: auto !important"),
    );
  }
  apply(longhands.removed, (s, r) => s.slice(0, r.start) + s.slice(r.end));
  const combined =
    merge.prefix +
    stages
      .get(merge.sources[0])
      .slice(stages.get(merge.sources[0]).indexOf(merge.stripBefore[0])) +
    merge.separator +
    stages
      .get(merge.sources[1])
      .slice(stages.get(merge.sources[1]).indexOf(merge.stripBefore[1]));
  for (const p of merge.sources) stages.delete(p);
  stages.set(merge.target, combined);
  for (const [p, s] of stages) assert.equal(hash(s), retired.sourceHashes[p]);
  for (const row of retired.edits) {
    assert.equal(stages.get(row.path).slice(row.start, row.end), row.original);
    assert.ok(row.retired.every((s) => !s.includes("(")));
  }
  apply(
    retired.edits,
    (s, r) => s.slice(0, r.start) + r.replacement + s.slice(r.end),
  );
  const finalKeys = read("final-keyframe-removals");
  assert.equal(finalKeys.removed.length, 1);
  // Source formatting is permitted; keyframe spans are checked against the exact
  // intermediate file, then the same rule is removed from the reconstructed CSS.
  const text = stages.get(finalKeys.path);
  const normalized = text.replace(/[ \t]+$/gm, "");
  assert.equal(hash(normalized), finalKeys.sourceHash);
  let stripped = normalized;
  for (const row of finalKeys.removed.toSorted((a, b) => b.start - a.start)) {
    assert.equal(stripped.slice(row.start, row.end), row.text);
    stripped = stripped.slice(0, row.start) + stripped.slice(row.end);
  }
  stages.set(finalKeys.path, stripped);
  const extended = read("selector-removals-extended");
  assert.equal(
    extended.edits.reduce((n, r) => n + r.retired.length, 0),
    69,
  );
  for (const [p, s] of stages) {
    stages.set(p, await format(s, { parser: "css" }));
    assert.equal(hash(stages.get(p)), extended.sourceHashes[p], p);
  }
  for (const row of extended.edits)
    assert.equal(stages.get(row.path).slice(row.start, row.end), row.original);
  apply(
    extended.edits,
    (s, r) => s.slice(0, r.start) + r.replacement + s.slice(r.end),
  );
  const empty = read("empty-scopes");
  for (const [p, s] of stages) {
    assert.equal(hash(s), empty.sourceHashes[p], p);
    stages.set(p, removeEmptyStyleRules(s, { dropEmptyConditions: true }));
  }
  const tail = read("selector-removals-tail");
  for (const [p, s] of stages) {
    stages.set(p, await format(s, { parser: "css" }));
    assert.equal(hash(stages.get(p)), tail.sourceHashes[p], p);
  }
  for (const row of tail.edits)
    assert.equal(stages.get(row.path).slice(row.start, row.end), row.original);
  apply(
    tail.edits,
    (s, r) => s.slice(0, r.start) + r.replacement + s.slice(r.end),
  );
  const pseudo = read("selector-removals-pseudo");
  assert.equal(
    pseudo.edits.reduce((n, r) => n + r.retired.length, 0),
    4,
  );
  for (const [p, s] of stages) assert.equal(hash(s), pseudo.sourceHashes[p], p);
  for (const row of pseudo.edits)
    assert.equal(stages.get(row.path).slice(row.start, row.end), row.original);
  apply(
    pseudo.edits,
    (s, r) => s.slice(0, r.start) + r.replacement + s.slice(r.end),
  );
  const compat = read("selector-removals-compat");
  assert.equal(
    compat.edits.reduce((n, r) => n + r.retired.length, 0),
    71,
  );
  for (const [p, s] of stages) assert.equal(hash(s), compat.sourceHashes[p], p);
  for (const row of compat.edits)
    assert.equal(stages.get(row.path).slice(row.start, row.end), row.original);
  apply(
    compat.edits,
    (s, r) => s.slice(0, r.start) + r.replacement + s.slice(r.end),
  );
  const files = read("file-retirements");
  assert.equal(files.retired.length, 3);
  for (const row of files.retired) {
    const text = stages.get(row.path);
    assert.equal(hash(text), row.sourceHash);
    const clean = removeEmptyStyleRules(text, { dropEmptyConditions: true });
    assert.equal(scanCssBlocks(clean).length, 0);
    assert.equal(clean.replace(/\/\*[\s\S]*?\*\//g, "").trim(), "");
    assert.equal(existsSync(row.path), false);
    stages.delete(row.path);
  }
  const rewrite = read("selector-rewrites");
  assert.equal(hash(stages.get(rewrite.path)), rewrite.sourceHash);
  let rewritten = stages.get(rewrite.path);
  for (const row of rewrite.edits) {
    assert.equal(
      row.original,
      ".ui-function-surface :is(.item-side-title, .about-side-title)",
    );
    assert.equal(row.replacement, ".ui-function-surface .item-side-title");
    assert.deepEqual(row.specificity, [0, 2, 0]);
    assert.equal(rewritten.slice(row.start, row.end), row.original);
    rewritten =
      rewritten.slice(0, row.start) +
      row.replacement +
      rewritten.slice(row.end);
  }
  stages.set(rewrite.path, rewritten);
  const directoryMoves = read("style-directory-moves");
  assert.equal(Object.keys(directoryMoves.moves).length, 18);
  for (const [from, to] of Object.entries(directoryMoves.moves)) {
    const oldPath = "src/" + from,
      newPath = "src/" + to;
    const normalized = await format(stages.get(oldPath), { parser: "css" });
    assert.equal(hash(normalized), directoryMoves.sourceHashes[from], from);
    assert.equal(existsSync(oldPath), false);
    stages.delete(oldPath);
    stages.set(newPath, normalized);
  }
  const ids = read("id-selector-removals");
  let idSource = await format(stages.get(ids.path), { parser: "css" });
  assert.equal(hash(idSource), ids.sourceHash);
  for (const row of ids.edits) {
    assert.equal(idSource.slice(row.start, row.end), row.original);
    idSource =
      idSource.slice(0, row.start) + row.replacement + idSource.slice(row.end);
  }
  stages.set(ids.path, idSource);
  const dominance = read("flat-dominance-removals");
  assert.equal(dominance.removed.length, 291);
  assert.match(
    readFileSync("src/index.template.html", "utf8"),
    /<body\b[^>]*class="[^"]*\bmodern-flat\b/,
  );
  for (const [p, s] of stages) {
    if (p !== ids.path) stages.set(p, await format(s, { parser: "css" }));
    assert.equal(hash(stages.get(p)), dominance.sourceHashes[p], p);
  }
  const dominanceIndex = new Map([...stages].map(([p, s]) => [p, rules(s)]));
  for (const row of dominance.removed) {
    const sourceRow = dominanceIndex
      .get(row.path)
      .find((d) => d.start === row.start);
    assert.ok(sourceRow);
    assert.equal(sourceRow.property, row.property);
    assert.equal(sourceRow.value, row.value);
    assert.equal(row.canonicalBranches.length, row.witnesses.length);
    row.witnesses.forEach((w, i) => {
      const declaration = dominanceIndex
        .get(w.path)
        .find((d) => d.start === w.start);
      assert.ok(declaration);
      assert.equal(declaration.value, w.value);
      assert.equal(declaration.property, row.property);
      assert.ok(
        Number(/!important\s*$/.test(w.value)) >=
          Number(/!important\s*$/.test(row.value)),
      );
      assert.ok(
        w.conditions.length === 0 ||
          JSON.stringify(w.conditions) === JSON.stringify(row.conditions),
      );
      assert.ok(w.branch.startsWith("body.modern-flat"));
      assert.equal(w.base, row.canonicalBranches[i]);
      assert.ok(
        w.branch.replace(/^body\.modern-flat/, "body") === w.base ||
          w.branch === "body.modern-flat " + w.base,
      );
    });
  }
  apply(dominance.removed, (s, r) => s.slice(0, r.start) + s.slice(r.end));
  for (const [name, count] of [
    ["flat-id-dominance-removals", 8],
    ["flat-type-dominance-removals", 2],
  ]) {
    const extra = read(name);
    assert.equal(extra.removed.length, count);
    for (const [p, s] of stages)
      assert.equal(hash(s), extra.sourceHashes[p], p);
    assert.ok(
      !/<(?:html|body)\b[^>]*\bid=/.test(
        readFileSync("src/index.template.html", "utf8"),
      ),
    );
    for (const row of extra.removed) {
      assert.equal(row.witnesses.length, row.canonicalBranches.length);
      for (const w of row.witnesses) {
        const actual = rules(stages.get(w.path)).find(
          (d) => d.start === w.start,
        );
        assert.ok(actual);
        assert.equal(actual.property, row.property);
        assert.equal(actual.value, w.value);
        assert.ok(w.branch.startsWith("body.modern-flat"));
        assert.ok(
          w.branch.replace(/^body\.modern-flat/, "body") === w.base ||
            w.branch === "body.modern-flat " + w.base,
        );
        assert.ok(
          Number(/!important\s*$/.test(w.value)) >=
            Number(/!important\s*$/.test(row.value)),
        );
        assert.ok(
          !w.conditions.length ||
            JSON.stringify(w.conditions) === JSON.stringify(row.conditions),
        );
      }
    }
    apply(extra.removed, (s, r) => s.slice(0, r.start) + s.slice(r.end));
  }
  const postScopes = read("post-dominance-empty-scopes");
  assert.deepEqual(postScopes.empty, []);
  for (const [p, s] of stages) {
    assert.equal(hash(s), postScopes.sourceHashes[p], p);
    stages.set(p, removeEmptyStyleRules(s, { dropEmptyConditions: true }));
  }
  const ownerEdits = [
    ...JSON.parse(
      readFileSync("artifacts/m4-governance/style-owner-edits.json", "utf8"),
    ),
    ...JSON.parse(
      readFileSync(
        "artifacts/performance-governance/style-owner-edits.json",
        "utf8",
      ),
    ),
  ];
  const retirements = JSON.parse(
    readFileSync("src/source-retirements.json", "utf8"),
  );
  for (const [p, s] of stages) {
    let expected = s;
    const receipt = ownerEdits.find((row) => row.path === p);
    if (receipt) {
      const old = execFileSync("git", ["show", receipt.baseline + ":" + p], {
        encoding: "utf8",
        maxBuffer: 2e6,
      });
      assert.equal(hash(old), receipt.sha256, p);
      assert.equal(
        await format(old, { parser: "css" }),
        await format(expected, { parser: "css" }),
        p + " historical checkpoint",
      );
      if (receipt.retired) {
        assert.ok(
          retirements[p.slice(4)] &&
            existsSync(retirements[p.slice(4)].evidence),
        );
        assert.equal(existsSync(p), false);
        continue;
      }
      expected = old;
      for (const edit of receipt.edits.toSorted((a, b) => b.start - a.start)) {
        assert.equal(expected.slice(edit.start, edit.end), edit.original);
        expected =
          expected.slice(0, edit.start) +
          edit.replacement +
          expected.slice(edit.end);
      }
    }
    assert.equal(
      await format(readFileSync(p, "utf8"), { parser: "css" }),
      await format(expected, { parser: "css" }),
      p,
    );
  }
});

test("retired screen classes have no current references; CSS checkpoint scripts retain statements except presentation metadata", async () => {
  const manifest = JSON.parse(readFileSync("src/manifest.json"));
  let logic = readFileSync("src/index.template.html", "utf8");
  // Current code participates in retired-selector checks. Historical statement
  // equality uses the historical manifest so future modules are not looked up
  // in a commit where they did not yet exist.
  for (const b of manifest.blocks.filter((b) => b.type === "script"))
    logic += "\n" + readFileSync("src/" + b.path, "utf8");
  const checkpointManifest = JSON.parse(baseline("src/manifest.json"));
  for (const b of checkpointManifest.blocks.filter(
    (b) => b.type === "script" && b.path !== "ui/component-catalog.js",
  )) {
    const path = "src/" + b.path;
    if (existsSync(path)) logic += "\n" + readFileSync(path, "utf8");
    else {
      const receipt = JSON.parse(
        readFileSync("src/source-retirements.json", "utf8"),
      )[b.path];
      assert.ok(receipt && existsSync(receipt.evidence), path);
      assert.ok(receipt.owners.every((owner) => existsSync("src/" + owner)));
    }
    let expected = baseline(path);
    for (const [from, to] of Object.entries(
      read("style-directory-moves").moves,
    ))
      expected = expected.replaceAll(from, to);
    for (const edit of read("ui-copy-adjustments").edits)
      if (edit.path === path)
        expected = expected.replace(edit.original, edit.replacement);
    assert.equal(
      await format(
        execFileSync("git", ["show", "a1c9b2e:" + path], {
          encoding: "utf8",
          maxBuffer: 2e6,
        }),
        { parser: "babel" },
      ),
      await format(expected, { parser: "babel" }),
      path,
    );
  }
  const classes = Object.values(
    read("selector-removals-compat").contract,
  ).flatMap((r) => r.classes);
  assert.equal(classes.length, 110);
  for (const name of classes)
    assert.ok(
      !new RegExp("(?<![\\w-])" + name + "(?![\\w-])").test(logic),
      name,
    );
});
