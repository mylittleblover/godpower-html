// One-shot, reviewable migration. Saved data keys and DOM ids are outside its scope.
import { readFile, writeFile, readdir } from "node:fs/promises";
const mapping = JSON.parse(
  await readFile("scripts/semantic-style-names.json", "utf8"),
);
const entries = { ...mapping.classes, ...mapping.animations };
const pattern = new RegExp(
  `(?<![\\w-])(?:${Object.keys(entries)
    .sort((a, b) => b.length - a.length)
    .join("|")})(?![\\w-])`,
  "g",
);
export function renameStyleNames(source) {
  return source
    .replace(pattern, (name) => entries[name])
    .replaceAll("score-roll-${kind}-v21730", "score-roll-${kind}");
}
async function visit(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${item.name}`;
    if (item.isDirectory()) await visit(path);
    else if (
      /\.(?:js|mjs|css|html)$/.test(path) &&
      !path.endsWith("/component-catalog.js")
    ) {
      const before = await readFile(path, "utf8"),
        after = renameStyleNames(before);
      if (before !== after) await writeFile(path, after);
    }
  }
}
if (process.argv.includes("--apply")) {
  await visit("src");
  await visit("tests");
  console.log(
    `${Object.keys(mapping.classes).length} classes and ${Object.keys(mapping.animations).length} animations migrated`,
  );
}
