import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Desktop entry regressions: the dock picker button must open the floating
   window, and the in-page modal must stay a hidden engine for it. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = process.env.PICKER_ENTRY_ARTIFACT_DIR || "artifacts/picker-entry";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.addInitScript(() => {
    window.__gpOpenPicker = 0;
    window.__gpPublished = [];
    window.__gpExec = null;
    window.godpowerDesktop = {
      role: "main",
      openPicker() {
        window.__gpOpenPicker++;
      },
      publish(snapshot) {
        window.__gpPublished.push(snapshot);
      },
      reply() {},
      ready() {},
      showScore() {},
      onExecute(fn) {
        window.__gpExec = fn;
      },
      onShellState() {},
      onUnlockRequest() {},
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 4);
  await page.waitForFunction(() => window.__gpExec !== null);

  const dock = await page.evaluate(() => {
    const button = document.querySelector('button[onclick="openPickerModal()"]');
    const modal = document.getElementById("pickerModal");
    const before = modal.classList.contains("active");
    button.click();
    return {
      before,
      opensFloating: window.__gpOpenPicker,
      modalActive: modal.classList.contains("active"),
      external: modal.hasAttribute("data-external-picker"),
      hidden: getComputedStyle(modal).visibility,
    };
  });
  assert.equal(dock.before, false, "the internal modal starts closed");
  assert.equal(dock.opensFloating, 1, "the dock button opens the floating picker");
  assert.equal(dock.modalActive, false, "the dock button adds no desktop dialog");
  assert.equal(dock.external, false, "nothing marks a dialog the user cannot see");

  const engine = await page.evaluate(async () => {
    const modal = document.getElementById("pickerModal");
    const started = await GodpowerPicker.command("start");
    return {
      started: started.ok,
      active: modal.classList.contains("active"),
      external: modal.hasAttribute("data-external-picker"),
      hidden: getComputedStyle(modal).visibility,
      phase: GodpowerPicker.getSnapshot().phase,
    };
  });
  assert.equal(engine.started, true, "the floating window can start the engine");
  assert.equal(engine.active, true, "the engine keeps a live modal for drawing");
  assert.equal(engine.external, true, "the engine modal is explicitly external");
  assert.equal(engine.hidden, "hidden", "the engine modal stays invisible");
  assert.equal(engine.phase, "rolling");

  const revealed = await page.evaluate(async () => {
    await GodpowerPicker.command("stop");
    await new Promise((r) => setTimeout(r, 40));
    for (let i = 0; i < 200; i++) {
      if (GodpowerPicker.getSnapshot().phase === "revealed") break;
      await new Promise((r) => setTimeout(r, 50));
    }
    return {
      phase: GodpowerPicker.getSnapshot().phase,
      hasResult: !!GodpowerPicker.getSnapshot().result,
      publishes: window.__gpPublished.length,
      lastPhase: window.__gpPublished.at(-1)?.phase,
    };
  });
  assert.equal(revealed.phase, "revealed");
  assert.equal(revealed.hasResult, true, "the external window receives a result");
  assert.ok(revealed.publishes > 0, "the transport publishes snapshots");
  assert.ok(
    revealed.lastPhase === "revealed" || revealed.lastPhase === "settling",
    "the published snapshot tracks the engine phase",
  );

  const closed = await page.evaluate(async () => {
    closePickerModal();
    // Closing is animated; the class is committed when the motion finishes.
    for (let i = 0; i < 100; i++) {
      if (!document.getElementById("pickerModal").classList.contains("active"))
        break;
      await new Promise((r) => setTimeout(r, 50));
    }
    const modal = document.getElementById("pickerModal");
    return {
      active: modal.classList.contains("active"),
      external: modal.hasAttribute("data-external-picker"),
      floatingOpens: window.__gpOpenPicker,
    };
  });
  assert.equal(closed.active, false);
  assert.equal(
    closed.external,
    false,
    "closing the engine clears its hidden-presentation marker",
  );
  assert.equal(closed.floatingOpens, 1, "closing the engine opens no window");
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({ status: "PASS", dock, engine, revealed, closed }, null, 2),
  );
} finally {
  await browser.close();
  server.close();
}
