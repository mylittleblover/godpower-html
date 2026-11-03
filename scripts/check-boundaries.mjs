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
function walk(node, inspect, parent = null) {
  if (!node || typeof node !== "object") return;
  if (node.type) inspect(node, parent);
  for (const value of Object.values(node)) {
    if (Array.isArray(value))
      value.forEach((child) => walk(child, inspect, node));
    else if (value && typeof value === "object") walk(value, inspect, node);
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
    walk(tree, (node, parent) => {
      // An object field named "document" is a DTO key, not a DOM dependency.
      if (
        parent?.type === "Property" &&
        parent.key === node &&
        !parent.computed &&
        !parent.shorthand
      )
        return;
      if (node.type === "Identifier" && banned.has(node.name))
        violations.push(
          `${path}:${node.loc.start.line}: forbidden layer dependency ${node.name}`,
        );
    });
  }
}
if (violations.length) throw Error(violations.join("\n"));
console.log("Domain and infrastructure boundaries pass");
