import { readFile, writeFile } from "node:fs/promises";
import { scanCssBlocks, scanDeclarations } from "./css-source.mjs";
import { parseSourceBlocks } from "./source-manifest.mjs";
import { parse } from "acorn";
export async function createComponentInventory() {
  const template = await readFile("src/index.template.html", "utf8");
  const files = parseSourceBlocks(template).filter((b) => b.type === "style");
  const classes = new Map(),
    tokens = new Map(),
    animations = new Map();
  function add(map, name, file) {
    if (!map.has(name)) map.set(name, new Set());
    map.get(name).add(file);
  }
  function inspect(source, file) {
    for (const rule of scanCssBlocks(source)) {
      if (
        /^@(media|supports|container|layer|scope|starting-style)\b/i.test(
          rule.prelude,
        )
      ) {
        inspect(rule.body, file);
        continue;
      }
      if (/^@(?:-webkit-)?keyframes\s+/i.test(rule.prelude)) {
        add(
          animations,
          rule.prelude.replace(/^@(?:-webkit-)?keyframes\s+/i, ""),
          file,
        );
        continue;
      }
      if (rule.prelude.startsWith("@")) continue;
      const selector = rule.prelude.replace(
        /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
        "",
      );
      for (const match of selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g))
        add(classes, match[1], file);
      for (const d of scanDeclarations(rule.body))
        if (d.property.startsWith("--")) add(tokens, d.property, file);
    }
  }
  for (const { path } of files)
    inspect(await readFile("src/" + path, "utf8"), "src/" + path);
  return {
    schemaVersion: 1,
    animations: [...animations]
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([name, sources]) => ({ name, sources: [...sources] })),
    classes: [...classes]
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([name, sources]) => ({ name, sources: [...sources] })),
    tokens: [...tokens]
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([name, sources]) => ({ name, sources: [...sources] })),
  };
}
export async function verifyComponentInventory() {
  const data = await createComponentInventory();
  const tree = parse(await readFile("src/ui/component-catalog.js", "utf8"), {
    ecmaVersion: "latest",
  });
  const declaration = tree.body.find(
    (n) =>
      n.type === "VariableDeclaration" &&
      n.declarations[0]?.id.name === "GodPowerComponentCatalog",
  );
  function literal(node) {
    if (node?.type === "Literal") return node.value;
    if (node?.type === "ArrayExpression") return node.elements.map(literal);
    if (node?.type === "ObjectExpression")
      return Object.fromEntries(
        node.properties.map((p) => {
          if (
            p.type !== "Property" ||
            p.computed ||
            p.method ||
            p.kind !== "init"
          )
            throw Error("Invalid component catalog property");
          return [p.key.name ?? p.key.value, literal(p.value)];
        }),
      );
    throw Error("Component catalog must contain only literal data");
  }
  const current = literal(declaration?.declarations[0].init);
  if (JSON.stringify(current) !== JSON.stringify(data))
    throw Error(
      "Component catalog drift; run node scripts/component-inventory.mjs",
    );
  return data;
}
if (process.argv[1]?.endsWith("component-inventory.mjs")) {
  const data = process.argv.includes("--check")
    ? await verifyComponentInventory()
    : await createComponentInventory();
  if (!process.argv.includes("--check"))
    await writeFile(
      "src/ui/component-catalog.js",
      "/* Generated from all shipped CSS. Refresh with scripts/component-inventory.mjs. */\nconst GodPowerComponentCatalog = " +
        JSON.stringify(data, null, 2) +
        ";\n",
    );
  console.log(
    JSON.stringify({
      classes: data.classes.length,
      tokens: data.tokens.length,
      animations: data.animations.length,
    }),
  );
}
