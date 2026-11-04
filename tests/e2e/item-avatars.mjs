import assert from "node:assert/strict";
import { legacy } from "../fixtures/save-v2.mjs";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, dismissStartup } from "../fixtures/browser.mjs";
await mkdir("artifacts/item-avatars", { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((_, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await page.evaluate(() => typeof SaveManager),
    "object",
    "save manager must be installed",
  );
  await page.evaluate(() => SaveManager.ready());
  await dismissStartup(page);
  await page.evaluate(() => {
    state.isLocked = false;
    switchView("settings");
    DesktopUI.selectSettings("students");
  });
  await page.locator("#saveWorkspace").waitFor({ state: "visible" });
  assert.equal(
    await page.locator("#saveWorkspaceStudentRows tr").count(),
    await page.evaluate(() => SaveManager.snapshot().roster.students.length),
  );
  await page.locator('[data-avatar-type="student"]').first().click();
  await page.locator("[data-avatar-file]").setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.waitForFunction(
    () => !!SaveManager.snapshot().roster.students[0].avatarResourceId,
  );
  await page.evaluate(() => classroomCommands.whenIdle());
  await page.evaluate(async () => {
    const snapshot = SaveManager.snapshot();
    return SaveManager.edit("第二位同学头像", (doc) =>
      SaveRoster.setAvatar(
        doc,
        "student",
        doc.roster.students[1].studentUid,
        snapshot.roster.students[0].avatarResourceId,
      ),
    );
  });
  await page.locator('[data-avatar-type="group"]').first().click();
  await page.locator("[data-avatar-file]").setInputFiles({
    name: "group.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.waitForFunction(
    () => !!SaveManager.snapshot().roster.groups[0].avatarResourceId,
  );
  await page.evaluate(() => classroomCommands.whenIdle());
  await page.evaluate(() => ClassroomAvatarDisplay.prepare(state.groups));
  await page.evaluate(() => openItemWindow(state.groups[0].id, "detail"));
  assert.equal(
    await page.locator("#groupAvatarPreview img").count(),
    1,
    "group information uses the same saved group avatar as settings",
  );
  const initialGroupAsset = await page.evaluate(
    () => SaveManager.snapshot().roster.groups[0].avatarResourceId,
  );
  const redPng = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    const g = c.getContext("2d");
    g.fillStyle = "#e65252";
    g.fillRect(0, 0, 4, 4);
    return c.toDataURL("image/png").split(",")[1];
  });
  await page.locator(".group-avatar-upload input").setInputFiles({
    name: "changed.png",
    mimeType: "image/png",
    buffer: Buffer.from(redPng, "base64"),
  });
  await page.waitForFunction(
    (old) => SaveManager.snapshot().roster.groups[0].avatarResourceId !== old,
    initialGroupAsset,
  );
  await page.waitForFunction(() =>
    document.querySelector("#groupAvatarPreview img")?.src.startsWith("blob:"),
  );
  await page.locator('[onclick^="clearGroupAvatarV2200"]').click();
  await page.waitForFunction(
    () => SaveManager.snapshot().roster.groups[0].avatarResourceId === null,
  );
  await page.waitForFunction(
    () => !document.querySelector("#groupAvatarPreview img"),
  );
  assert.equal(
    await page.locator("#groupAvatarPreview img").count(),
    0,
    "clear in group information clears the same saved avatar",
  );
  await page.locator(".group-avatar-upload input").setInputFiles({
    name: "restored.png",
    mimeType: "image/png",
    buffer: Buffer.from(redPng, "base64"),
  });
  await page.waitForFunction(
    () => !!SaveManager.snapshot().roster.groups[0].avatarResourceId,
  );
  await page.waitForFunction(
    () => !!document.querySelector("#groupAvatarPreview img"),
  );
  await page.evaluate(() => closeItemWindow());
  const wholeCopies = await page.evaluate(async () => {
    const original = JSON.stringify;
    let copies = 0;
    JSON.stringify = function (value, ...args) {
      if (value?.kind === "godpower.save" && value.match) copies++;
      return original.call(this, value, ...args);
    };
    try {
      for (let i = 0; i < 5; i++)
        await ClassroomAvatarDisplay.prepare(state.groups);
    } finally {
      JSON.stringify = original;
    }
    return copies;
  });
  assert.equal(
    wholeCopies,
    0,
    "cached avatar presentation must not clone complete match/history documents",
  );

  const result = await page.evaluate(() => {
    const g = state.groups[0];
    const presentation = {
      key: "coin",
      caster: { id: g.id, groupUid: g.groupUid, name: g.name },
      targets: [{ id: g.id, groupUid: g.groupUid, name: g.name, delta: 2 }],
    };
    const payload = HandItemCinematic.payload(presentation);
    const stale = HandItemCinematic.payload({
      ...presentation,
      caster: { ...presentation.caster, groupUid: "old-save-group" },
      targets: [{ ...presentation.targets[0], groupUid: "old-save-group" }],
    });
    return {
      caster: payload.casterAvatarDataUrl?.startsWith("data:image/webp"),
      target: payload.targets[0].avatarDataUrl?.startsWith("data:image/webp"),
      staleCaster: stale.casterAvatarDataUrl,
      staleTarget: stale.targets[0].avatarDataUrl,
    };
  });
  assert.deepEqual(result, {
    caster: true,
    target: true,
    staleCaster: "",
    staleTarget: "",
  });
  await page.evaluate(() => {
    const g = state.groups[0];
    HandItemCinematic.present({
      key: "coin",
      caster: { id: g.id, groupUid: g.groupUid, name: g.name },
      targets: [{ id: g.id, groupUid: g.groupUid, name: g.name, delta: 2 }],
    });
  });
  assert.equal(await page.locator(".hic-group-avatar").count(), 2);
  await page.screenshot({
    path: "artifacts/item-avatars/fullscreen.png",
    animations: "disabled",
  });
  await page.evaluate(() => HandItemCinematic.dismiss());
  assert.equal(await page.locator(".hic-group-avatar").count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS committed group avatars in caster/target full-screen DTO and Web reveal; stale identity omitted",
  );
} finally {
  await browser.close();
  server.close();
}
