import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* "从当前比赛创建副本" must work even when a roster already exists. It appends a
   new classroom instead of replacing the document, and repetition keeps adding
   distinguishable copies without losing earlier data. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/roster-live-copy";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);

  const open = await page.evaluate(async () => {
    Object.keys(localStorage)
      .filter((k) => k === ClassroomRosterRepository.key)
      .forEach((k) => localStorage.removeItem(k));
    const nav = [...document.querySelectorAll("[data-view], .nav-btn, .tab-btn")].find(
      (n) => /设置/.test(n.textContent || ""),
    );
    nav?.click();
    await new Promise((r) => setTimeout(r, 400));
    return {
      hasButton: !!document.getElementById("rosterCreateFromLive"),
      status: document.getElementById("rosterStatus")?.textContent?.trim() || "",
    };
  });
  assert.equal(open.hasButton, true);

  const click = async () =>
    page.evaluate(async () => {
      const btn = document.getElementById("rosterCreateFromLive");
      btn.click();
      await new Promise((r) => setTimeout(r, 500));
      return {
        status: document.getElementById("rosterStatus")?.textContent?.trim() || "",
        isError: document.getElementById("rosterStatus")?.dataset?.status === "error" ||
          /失败/.test(document.getElementById("rosterStatus")?.textContent || ""),
      };
    });

  const first = await click();
  assert.equal(first.isError, false, `first copy failed: ${first.status}`);
  assert.match(first.status, /已从当前比赛创建本地副本/);

  const second = await click();
  assert.equal(
    second.isError,
    false,
    `second copy reported an error: ${second.status}`,
  );
  assert.doesNotMatch(
    second.status,
    /已有本地名单/,
    "an existing roster no longer blocks the button",
  );
  assert.match(second.status, /添加为新课堂「当前课堂副本 2」/);

  const third = await click();
  assert.match(third.status, /当前课堂副本 3/);

  // Nothing was lost: one classroom per click, and every group still present.
  const state = await page.evaluate(() => {
    const key = ClassroomRosterRepository.key;
    const raw = localStorage.getItem(key);
    const envelope = raw ? JSON.parse(raw) : null;
    // The repository stores { schemaVersion, revision, rosterData }.
    const doc = envelope?.rosterData || null;
    const topKeys = envelope ? Object.keys(envelope) : [];
    const section = document.getElementById("classroomRosterWorkspace");
    return {
      key,
      topKeys,
      hasDocument: !!doc,
      classrooms: doc?.classrooms?.length ?? null,
      names: doc?.classrooms?.map((c) => c.name) ?? [],
      students: doc?.students?.length ?? null,
      assignments: doc?.assignments?.length ?? null,
      profiles: doc?.profiles?.length ?? null,
      rows: section.querySelectorAll("#rosterStudentRows tr").length,
      classroomOptions: [...section.querySelectorAll("#rosterClassroomSelect option")]
        .map((o) => o.textContent.trim()),
    };
  });

  assert.equal(state.classrooms, 3, "each click appends one classroom");
  assert.deepEqual(state.names, [
    "当前课堂副本",
    "当前课堂副本 2",
    "当前课堂副本 3",
  ]);
  assert.equal(state.profiles, 3, "each copy carries its own profile");
  assert.equal(state.assignments, 3);
  assert.equal(
    state.students,
    3 * 14 * 2,
    "every copy keeps all 14 groups and their members",
  );
  assert.equal(state.rows > 0, true, "the table still renders rows");
  assert.equal(state.classroomOptions.length, 3, "all copies are selectable");

  // Applying a copy to the match still works afterwards.
  const applied = await page.evaluate(async () => {
    const section = document.getElementById("classroomRosterWorkspace");
    const select = section.querySelector("#rosterClassroomSelect");
    select.value = select.options[select.options.length - 1].value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 300));
    const preview = section.querySelector("#rosterPreviewApply");
    preview.click();
    await new Promise((r) => setTimeout(r, 500));
    return {
      status: document.getElementById("rosterStatus")?.textContent?.trim() || "",
    };
  });
  // Switching to a copy must not report a copy-creation failure. The workspace
  // may still ask the teacher to save pending edits first; that guard is fine.
  assert.doesNotMatch(applied.status, /创建副本失败|无法选择课堂/);

  await page.screenshot({ path: `${root}/after-copies.png` });
  assert.deepEqual(errors, []);
  const results = [{ open, first, second, third, state, applied }];
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", first, second, third, state, applied }, null, 2));
} finally {
  await browser.close();
  server.close();
}
