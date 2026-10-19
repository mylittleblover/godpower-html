import { execFileSync } from "node:child_process";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { parse } from "acorn";
const base = process.argv[2] || "2ba6bed";
const tracked = execFileSync(
  "git",
  ["ls-tree", "-r", "--name-only", base, "src"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter((path) => path.endsWith(".js"));
const current = (await readdir("src", { recursive: true }))
  .filter((path) => path.endsWith(".js"))
  .map((path) => "src/" + path);
function walk(node, fn) {
  if (!node || typeof node !== "object") return;
  if (node.type) fn(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((child) => walk(child, fn));
    else if (value && typeof value === "object") walk(value, fn);
  }
}
async function measure(paths, read) {
  let sourceBytes = 0,
    sourceLines = 0;
  const entryWrites = Object.fromEntries(
    [
      "legacyUseItem",
      "legacyJudgeRound",
      "useItem",
      "renderAll",
      "renderGrid",
      "saveState",
    ].map((key) => [key, 0]),
  );
  for (const path of paths) {
    const source = await read(path);
    sourceBytes += Buffer.byteLength(source);
    sourceLines += source.split("\n").length;
    walk(parse(source, { ecmaVersion: "latest" }), (node) => {
      const name =
        node.type === "FunctionDeclaration"
          ? node.id?.name
          : node.type === "AssignmentExpression"
            ? node.left?.name
            : null;
      if (Object.hasOwn(entryWrites, name)) entryWrites[name]++;
    });
  }
  return { jsFiles: paths.length, sourceBytes, sourceLines, entryWrites };
}
const report = {
  base,
  criteria:
    "FunctionDeclaration plus direct identifier AssignmentExpression; source metrics exclude CSS/resources; size is observational, not a deletion target.",
  before: {
    ...(await measure(tracked, (path) =>
      execFileSync("git", ["show", `${base}:${path}`], {
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      }),
    )),
    bundleBytes: execFileSync("git", ["show", `${base}:dist/godpower.html`], {
      maxBuffer: 16 * 1024 * 1024,
    }).byteLength,
  },
  after: {
    ...(await measure(current, (path) => readFile(path, "utf8"))),
    bundleBytes: (await readFile("dist/godpower.html")).byteLength,
  },
};
await mkdir("artifacts/v3-migration", { recursive: true });
await writeFile(
  "artifacts/v3-migration/architecture-metrics.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report));
