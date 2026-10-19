import { parse } from "acorn";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
const rows = [];
for (const file of (await readdir("src", { recursive: true })).filter((f) =>
  f.endsWith(".js"),
)) {
  const path = "src/" + file,
    source = await readFile(path, "utf8");
  const ast = parse(source, { ecmaVersion: "latest", locations: true });
  const owners = new Map();
  function visit(node, owner = "<initialization>") {
    if (!node || typeof node !== "object") return;
    if (/Function/.test(node.type) || node.type === "ArrowFunctionExpression")
      owner = node.id?.name || `${owner}:callback@${node.loc.start.line}`;
    if (!owners.has(owner))
      owners.set(owner, {
        file: path,
        owner,
        line: node.loc?.start.line || 1,
        calls: new Set(),
        saves: 0,
        commandCalls: 0,
      });
    const record = owners.get(owner);
    if (node.type === "CallExpression") {
      const callee = node.callee;
      const name =
        callee.type === "Identifier"
          ? callee.name
          : callee.type === "MemberExpression" && !callee.computed
            ? `${callee.object.name || "<object>"}.${callee.property.name}`
            : null;
      if (name) record.calls.add(name);
      if (name === "saveState") record.saves++;
      if (name === "runClassroomCommand" || name === "classroomCommands.run")
        record.commandCalls++;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const child of value) if (child?.type) visit(child, owner);
      } else if (value?.type) visit(value, owner);
    }
  }
  visit(ast);
  for (const row of owners.values())
    if (row.saves || row.commandCalls)
      rows.push({
        ...row,
        calls: [...row.calls].sort(),
        classification: row.commandCalls
          ? "COMMAND_ENTRY_CANDIDATE"
          : "CALLER_AUDIT_REQUIRED",
      });
}
if (
  !rows.some((row) => row.owner === "adjust" && row.commandCalls) ||
  !rows.some((row) => row.owner === "toggleResizerEnabled")
)
  throw new Error(
    "Command inventory did not find its known production anchors",
  );
rows.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
await mkdir("artifacts/v3-async-lifecycle", { recursive: true });
await writeFile(
  "artifacts/v3-async-lifecycle/command-map.json",
  JSON.stringify(
    {
      criteria:
        "Nearest lexical function containing saveState or runClassroomCommand; static leads only. Helper calls may already be inside a command. Dynamic calls, aliases and business validation require manual review.",
      rows,
    },
    null,
    2,
  ),
);
const md =
  `# Classroom command migration map\n\nGenerated with node scripts/command-migration-map.mjs. This is a static lead list, not proof of defects or completeness. CALLER_AUDIT_REQUIRED helpers can already run inside an outer command; do not wrap them again without tracing callers. Dynamic aliases and timer/DOM callbacks require manual verification. Existing tests do not authorize default backend cutover by themselves.\n\n## Required order before authority cutover\n\n1. Final archive/new-season reset, import, undo/restore: await durable commit, preserve season idempotency and recovery.\n2. Round start/next/correct-answer confirmations: preserve cancellation and current undo boundaries.\n3. Draw completion, inventory promotion, bullet/timed effects: serialize generation and callbacks, preserve RNG/tick semantics.\n4. Group/member management and batch controls: validate the whole plan, keep one snapshot and command.\n5. Settings writes and resource imports: separate domain ownership and await resource transaction completion.\n6. Introduce a source mutation/quiescence barrier; verify current source and target again; then switch one domain at a time.\n\nDefault legacy authority remains active. The async compatibility controller is verified against an isolated real IndexedDB repository; it has not automatically converted the rows below.\n\n## Lexical leads (${rows.length})\n\n|File|Function|Line|Save calls|Command calls|Static classification|\n|---|---|---:|---:|---:|---|\n` +
  rows
    .map(
      (r) =>
        `|${r.file}|\`${r.owner}\`|${r.line}|${r.saves}|${r.commandCalls}|${r.classification}|`,
    )
    .join("\n") +
  "\n";
await writeFile("docs/v3/COMMAND_MIGRATION_INVENTORY.md", md);
console.log(
  JSON.stringify({
    functions: rows.length,
    saveCalls: rows.reduce((s, r) => s + r.saves, 0),
    commandCalls: rows.reduce((s, r) => s + r.commandCalls, 0),
  }),
);
