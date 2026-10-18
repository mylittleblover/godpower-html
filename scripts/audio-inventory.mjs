import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { parse } from "acorn";
const files = [];
async function scan(dir) {
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${f.name}`;
    if (f.isDirectory()) await scan(p);
    else if (p.endsWith(".js")) files.push(p);
  }
}
await scan("src");
const calls = [],
  dynamic = [];
function walk(n, file) {
  if (!n || typeof n !== "object") return;
  if (n.type === "CallExpression" && n.callee?.name === "playSound") {
    const a = n.arguments[0];
    (a?.type === "Literal" && typeof a.value === "string"
      ? calls
      : dynamic
    ).push({
      file,
      line: n.loc.start.line,
      slot: a?.type === "Literal" ? a.value : null,
      expression: a?.type,
    });
  }
  for (const [k, v] of Object.entries(n)) {
    if (k === "loc") continue;
    if (Array.isArray(v)) v.forEach((x) => walk(x, file));
    else if (v && typeof v === "object") walk(v, file);
  }
}
for (const file of files)
  walk(
    parse(await readFile(file, "utf8"), {
      ecmaVersion: "latest",
      locations: true,
      allowReturnOutsideFunction: true,
    }),
    file,
  );
const active = JSON.parse(
  await readFile("artifacts/classroom-feedback/audio-slots.json", "utf8"),
);
const retired = [
  "item_use",
  "item_attack",
  "item_buff",
  "item_status",
  "item_steal",
];
const slots = new Set(active.map((x) => x.id));
const unknown = [
  ...new Set(
    calls
      .map((x) => x.slot)
      .filter((x) => !slots.has(x) && !retired.includes(x)),
  ),
];
const result = {
  activeSlotCount: active.length,
  active,
  legacySuppressed: retired,
  unknownLiteralCalls: unknown,
  literalCalls: calls,
  dynamicCalls: dynamic,
};
await mkdir("docs/audit", { recursive: true });
await writeFile(
  "docs/audit/AUDIO_INVENTORY.json",
  JSON.stringify(result, null, 2),
);
if (unknown.length) {
  console.error("Unknown sound slots", unknown);
  process.exitCode = 1;
} else
  console.log(
    `Audio inventory: ${active.length} active custom slots, ${calls.length} literal call sites, ${dynamic.length} dynamic call sites, ${retired.length} legacy aliases intentionally suppressed`,
  );
