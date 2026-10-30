import { parseSourceBlocks } from "./source-manifest.mjs";
import { readFile } from "node:fs/promises";
import { parse } from "acorn";
const s = await readFile("dist/godpower.html", "utf8");
let count = 0;
const appVersions = [];
const visibleVersionAssignments = [];
function visit(node) {
  if (!node || typeof node !== "object") return;
  if (
    node.type === "AssignmentExpression" &&
    node.left.type === "MemberExpression" &&
    node.left.object?.name === "window" &&
    (node.left.property?.name === "__GOD_POWER_VERSION__" ||
      node.left.property?.value === "__GOD_POWER_VERSION__") &&
    node.right.type === "Literal"
  )
    visibleVersionAssignments.push(node.right.value);
  if (
    node.type === "Property" &&
    (node.key?.name === "appVersion" || node.key?.value === "appVersion") &&
    node.value?.type === "Literal"
  )
    appVersions.push(node.value.value);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(visit);
    else if (value?.type) visit(value);
  }
}
for (const m of s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)) {
  visit(
    parse(m[1], { ecmaVersion: "latest", allowReturnOutsideFunction: false }),
  );
  count++;
}
const baseline = await readFile("baseline/V2.18.13.html", "utf8");
const resources = (x) =>
  [
    ...x.matchAll(
      /data:[a-zA-Z0-9.+/-]+(?:;[a-zA-Z0-9=.+-]+)*;base64,[a-zA-Z0-9+/=\s]+/g,
    ),
  ].map((m) => m[0]);
if (JSON.stringify(resources(s)) !== JSON.stringify(resources(baseline)))
  throw Error("Embedded resources changed");
if (/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(s))
  throw Error("External runtime dependency");
console.log(
  `${count} script blocks parse; all ${resources(s).length} original embedded resources preserved`,
);
const template = await readFile("src/index.template.html", "utf8");
const expectedBlocks = parseSourceBlocks(template);
const manifest = JSON.parse(await readFile("src/manifest.json", "utf8"));
if (JSON.stringify(manifest.blocks) !== JSON.stringify(expectedBlocks))
  throw Error(
    "Source manifest drift; run node scripts/sync-source-manifest.mjs",
  );
console.log(
  `${expectedBlocks.length} source blocks match the manifest and template`,
);

const { version } = JSON.parse(await readFile("package.json", "utf8"));
if (
  !visibleVersionAssignments.includes("V" + version) ||
  !s.includes(`<small>V${version}</small>`) ||
  !s.includes(`<title>上帝的力量 V${version}</title>`) ||
  !appVersions.includes("V" + version)
)
  throw Error("Visible/internal/package version mismatch");
console.log(`Visible, internal and package version match: ${version}`);
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
if (lock.version !== version || lock.packages?.[""]?.version !== version)
  throw Error("Package and lockfile versions mismatch");
console.log(`Package lock version matches: ${version}`);

await import("./check-boundaries.mjs");
