import { readFile, readdir } from "node:fs/promises";
import { parse } from "acorn";
const violations = [];
const rules = [
  {
    root: "src/domain",
    banned: new Set([
      "window",
      "document",
      "localStorage",
      "indexedDB",
      "fetch",
      "XMLHttpRequest",
      "AudioContext",
      "require",
      "process",
    ]),
  },
  {
    root: "src/infrastructure",
    banned: new Set([
      "window",
      "document",
      "renderAll",
      "renderGrid",
      "showToast",
      "playSound",
    ]),
  },
];
function walk(node, inspect) {
  if (!node || typeof node !== "object") return;
  if (node.type) inspect(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((child) => walk(child, inspect));
    else if (value && typeof value === "object") walk(value, inspect);
  }
}
for (const { root, banned } of rules) {
  for (const file of (await readdir(root, { recursive: true })).filter((file) =>
    file.endsWith(".js"),
  )) {
    const path = `${root}/${file}`;
    const tree = parse(await readFile(path, "utf8"), {
      ecmaVersion: "latest",
      locations: true,
    });
    walk(tree, (node) => {
      if (node.type === "Identifier" && banned.has(node.name))
        violations.push(
          `${path}:${node.loc.start.line}: forbidden layer dependency ${node.name}`,
        );
    });
  }
}
if (violations.length) throw Error(violations.join("\n"));
console.log("Domain and infrastructure boundaries pass");
