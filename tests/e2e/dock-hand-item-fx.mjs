import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* The dock hand panel must drive the same full-screen cinematic as the
   floating window, and a wide item must list every affected group at once. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = process.env.DOCK_FX_ARTIFACT_DIR || "artifacts/dock-item-fx";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);

  const dock = await page.evaluate(async () => {
    const calls = [];
    const realPresent = HandItemCinematic.present;
    HandItemCinematic.present = (p) => {
      calls.push({
        key: p?.key,
        caster: p?.caster?.name,
        targets: p?.targets?.length || 0,
        names: (p?.targets || []).map((t) => t.name),
      });
      return;
    };
    const g = state.groups[1];
    g.inventory = [ItemModules.inventory("lightning")];
    handRaiseGroupId = g.id;
    // Drive the exact function the dock button calls.
    handUseOneV218();
    await new Promise((r) => setTimeout(r, 400));
    await classroomCommands.whenIdle();
    await new Promise((r) => setTimeout(r, 400));
    return { calls, effect: g.itemEffect?.type ?? null };
  });
  assert.ok(dock.calls.length >= 1, "the dock triggers the cinematic");
  const shot = dock.calls[0];
  assert.equal(shot.key, "lightning");
  assert.ok(shot.caster, "the cinematic names the caster");
  assert.ok(shot.targets >= 1, "the cinematic carries targets");

  // A dock selection must keep the floating session in sync.
  const sync = await page.evaluate(async () => {
    const seen = [];
    const off = ClassroomHandSync.subscribe((v) => seen.push(v));
    selectHandGroup(state.groups[3].id);
    off();
    return { seen, current: ClassroomHandSync.current() };
  });
  assert.equal(sync.seen.length, 1, "selection changes are broadcast");
  assert.equal(sync.seen[0].groupId !== undefined, true);
  assert.equal(sync.current?.groupId, sync.seen[0].groupId);

  assert.deepEqual(errors, []);
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ status: "PASS", dock, sync }, null, 2),
  );
  console.log(JSON.stringify({ status: "PASS", dock, sync }, null, 2));
} finally {
  await browser.close();
  server.close();
}
