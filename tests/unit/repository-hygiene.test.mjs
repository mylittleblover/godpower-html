import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyTrackedFiles,
  findCommentOnlyScripts,
  manifestIssues,
} from "../../scripts/repo-hygiene.mjs";

test("classifies evidence separately from shipped code without discarding it", () => {
  const result = classifyTrackedFiles([
    { path: "src/ui/panel.js", bytes: 120 },
    { path: "artifacts/test.png", bytes: 4000 },
    { path: "dist/index.html", bytes: 300 },
    { path: "baseline/old.html", bytes: 500 },
    { path: "tests/unit/x.test.mjs", bytes: 200 },
  ]);
  assert.deepEqual(result.artifacts, { files: 1, bytes: 4000 });
  assert.deepEqual(result.src, { files: 1, bytes: 120 });
  assert.deepEqual(result.dist, { files: 1, bytes: 300 });
  assert.equal(result.baseline.files, 1);
});

test("finds comment-only legacy blocks, not executable code", () => {
  const result = findCommentOnlyScripts([
    { path: "src/script/25.js", content: "\n/* old release note */\n" },
    { path: "src/script/33.js", content: "  // former patch\n" },
    { path: "src/script/40.js", content: 'window.APP_VERSION = "2";' },
    { path: "src/ui/real.js", content: "/* not legacy */" },
  ]);
  assert.deepEqual(result, ["src/script/25.js", "src/script/33.js"]);
});

test("checks source and resource references without a fixed legacy block count", () => {
  const template =
    "<style>@@SOURCE:style/01.css@@</style><script>@@SOURCE:script/01.js@@</script>@@RESOURCE:asset-000.txt@@";
  const manifest = {
    blocks: [
      { type: "style", path: "style/01.css", attributes: "" },
      { type: "script", path: "script/01.js", attributes: "" },
    ],
    resources: ["asset-000.txt"],
  };
  const paths = new Set([
    "src/style/01.css",
    "src/script/01.js",
    "src/resources/asset-000.txt",
  ]);
  assert.deepEqual(manifestIssues(template, manifest, paths), []);
  // Original assets can be referenced by an embedded source block, not the template.
  assert.deepEqual(
    manifestIssues(template.replace("@@RESOURCE:asset-000.txt@@", ""), manifest, paths),
    [],
  );
  paths.delete("src/script/01.js");
  assert.match(
    manifestIssues(template, manifest, paths).join("\n"),
    /Missing source: script\/01\.js/,
  );
  assert.match(
    manifestIssues(template, { ...manifest, resources: [] }, paths).join("\n"),
    /Resource manifest drift/,
  );
});
