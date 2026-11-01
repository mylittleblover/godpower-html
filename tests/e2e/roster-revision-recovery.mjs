import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* Clearing or replacing the stored roster outside the page must not wedge the
   workspace: the next write re-reads the revision instead of failing forever. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message.slice(0, 300)));
// Clear the roster before any app script runs, so the workspace boots on a
// clean revision regardless of what an earlier test left behind.
await page.addInitScript(() => {
  try {
    localStorage.removeItem("godpower_classroom_roster_v1");
  } catch {}
});
await page.goto(`http://127.0.0.1:${server.address().port}`);
await setup(page, 14);

const out = await page.evaluate(async () => {
  localStorage.removeItem(ClassroomRosterRepository.key);
  // The workspace memoises its own revision, so reload after the wipe to prove
  // the write path recovers from an externally cleared document.
  const nav = [...document.querySelectorAll("[data-view], .nav-btn, .tab-btn")].find(
    (n) => /设置/.test(n.textContent || ""),
  );
  nav?.click();
  await new Promise((r) => setTimeout(r, 400));

  const btn = document.getElementById("rosterCreateFromLive");
  const statuses = [];
  const click = async () => {
    btn.click();
    await new Promise((r) => setTimeout(r, 450));
    statuses.push(document.getElementById("rosterStatus").textContent.trim());
  };

  await click();
  // Wipe the document behind the workspace's back, then click again.
  localStorage.removeItem(ClassroomRosterRepository.key);
  await click();
  await click();

  const env = JSON.parse(localStorage.getItem(ClassroomRosterRepository.key) || "null");
  return {
    statuses,
    conflicts: statuses.filter((s) => /REVISION_CONFLICT/.test(s)).length,
    classrooms: env?.rosterData?.classrooms?.map((c) => c.name) ?? [],
    students: env?.rosterData?.students?.length ?? null,
  };
});
console.log(JSON.stringify(out, null, 2));
assert.equal(out.conflicts, 0, "no revision conflict surfaces to the user");
assert.equal(out.classrooms.length, 3, "all three clicks land despite the wipe");
assert.equal(out.students, 3 * 14 * 2, "each copy keeps every member");
await browser.close();
server.close();
