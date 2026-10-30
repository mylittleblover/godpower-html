import { parseSourceBlocks } from "./source-manifest.mjs";
import { readFile, writeFile } from "node:fs/promises";
const template = await readFile("src/index.template.html", "utf8");
const original = JSON.parse(await readFile("src/manifest.json", "utf8"));
original.blocks = parseSourceBlocks(template);
if (!original.blocks.length) throw Error("No source blocks found");
await writeFile("src/manifest.json", JSON.stringify(original, null, 2) + "\n");
console.log(`Indexed ${original.blocks.length} inline source blocks`);
