import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

/* The right-hand "···" button opens the group detail page. Its very first block
   is the avatar picker, styled like the other sections. */
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [];
const root = "artifacts/group-avatar";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 6);

  // Open through the real "···" button.
  const opened = await page.evaluate(() => {
    const g = state.groups[2];
    const card = document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
    card.querySelector(".more-btn").click();
    const body = document.getElementById("itemWindowBody");
    const first = body.firstElementChild;
    const firstSection = body.querySelector(".group-detail-section");
    return {
      id: g.id,
      title: document.getElementById("itemWindowTitle").textContent,
      firstBlockIsAvatar: !!first && first.classList.contains("group-avatar-section-v2200"),
      stateFirstIsAvatar: !!firstSection &&
        firstSection.classList.contains("group-avatar-section-v2200"),
      hasPreview: !!document.getElementById("groupAvatarPreview"),
      hasUpload: !!document.querySelector(".group-avatar-upload-v2200 input[type=file]"),
      sectionStyle: getComputedStyle(firstSection).borderRadius,
      otherSectionStyle: getComputedStyle(
        body.querySelectorAll(".group-detail-section")[2],
      ).borderRadius,
    };
  });
  assert.equal(opened.firstBlockIsAvatar, true, "avatar block is rendered first");
  assert.equal(opened.hasPreview, true);
  assert.equal(opened.hasUpload, true);
  assert.equal(
    opened.sectionStyle,
    opened.otherSectionStyle,
    "the avatar block reuses the section styling",
  );

  // Upload a real PNG through the file input.
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  await page.setInputFiles(".group-avatar-upload-v2200 input[type=file]", {
    name: "avatar.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.waitForFunction(
    () => /已保存/.test(document.getElementById("groupAvatarStatusV2200")?.textContent || ""),
    null,
    { timeout: 8000 },
  );
  const saved = await page.evaluate((id) => {
    const g = state.groups.find((x) => x.id === id);
    const card = document.querySelector(`.group-row-card[data-group-id="${id}"]`);
    return {
      hasAvatar: typeof g.groupAvatar === "string" && g.groupAvatar.startsWith("data:image/png;base64,"),
      cardImage: !!card.querySelector(".v213-group-avatar-single"),
      cardSrc: card.querySelector(".v213-group-avatar-single")?.src?.slice(0, 21),
      preview: !!document.querySelector("#groupAvatarPreview img"),
      persisted: !!JSON.parse(localStorage.getItem(Reliability.stateKey) || "{}")
        .groups?.find((x) => x.id === id)?.groupAvatar,
    };
  }, opened.id);
  assert.equal(saved.hasAvatar, true, "the avatar is stored on the group");
  assert.equal(saved.cardImage, true, "the card shows the group avatar");
  assert.equal(saved.cardSrc, "data:image/png;base64", "and uses the stored data URL");
  assert.equal(saved.preview, true, "the detail page previews it");
  assert.equal(saved.persisted, true, "it survives into localStorage");

  // Reload keeps it.
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForFunction(() => window.classroomReady);
  const afterReload = await page.evaluate((id) => {
    const g = state.groups.find((x) => x.id === id);
    return { kept: !!g?.groupAvatar, valid: normalizeGroupAvatarV2200(g?.groupAvatar) !== "" };
  }, opened.id);
  assert.equal(afterReload.kept, true, "the avatar survives a reload");
  assert.equal(afterReload.valid, true);

  // Reject an oversized and a wrong-type file.
  const rejected = await page.evaluate(async (id) => {
    const g = state.groups.find((x) => x.id === id);
    openItemWindow(id, "detail");
    const big = new File([new Uint8Array(600 * 1024)], "big.png", { type: "image/png" });
    const input = document.querySelector(".group-avatar-upload-v2200 input[type=file]");
    const dt = new DataTransfer();
    dt.items.add(big);
    input.files = dt.files;
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 150));
    const bigStatus = document.getElementById("groupAvatarStatusV2200").dataset.status;
    const svg = new File(["<svg/>"], "x.svg", { type: "image/svg+xml" });
    const dt2 = new DataTransfer();
    dt2.items.add(svg);
    input.files = dt2.files;
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 150));
    return { bigStatus, svgStatus: document.getElementById("groupAvatarStatusV2200").dataset.status, unchanged: !!g.groupAvatar };
  }, opened.id);
  assert.equal(rejected.bigStatus, "ERROR", "oversized images are refused");
  assert.equal(rejected.svgStatus, "ERROR", "SVG is refused");
  assert.equal(rejected.unchanged, true, "a refused upload keeps the previous avatar");

  // A locked classroom refuses the change instead of silently ignoring it.
  const lockedRefusal = await page.evaluate(async (id) => {
    state.isLocked = true;
    const before = state.groups.find((x) => x.id === id)?.groupAvatar || "";
    openItemWindow(id, "detail");
    // Re-render under the lock so the input is disabled.
    renderItemWindow();
    clearGroupAvatarV2200(id);
    await new Promise((r) => setTimeout(r, 120));
    const after = state.groups.find((x) => x.id === id)?.groupAvatar || "";
    state.isLocked = false;
    return { unchanged: before === after && !!before };
  }, opened.id);
  assert.equal(lockedRefusal.unchanged, true, "a locked classroom keeps the avatar");

  // Clear restores the default badge.
  const cleared = await page.evaluate(async (id) => {
    openItemWindow(id, "detail");
    const pre = state.groups.find((x) => x.id === id);
    const preAvatar = !!pre?.groupAvatar && !state.isLocked;
    clearGroupAvatarV2200(id);
    await classroomCommands.whenIdle();
    await new Promise((r) => setTimeout(r, 400));
    const g = state.groups.find((x) => x.id === id);
    const card = document.querySelector(`.group-row-card[data-group-id="${id}"]`);
    return {
      preAvatar,
      empty: g.groupAvatar === "",
      cellGone: !card.querySelector(".v213-group-avatar-single"),
    };
  }, opened.id);

  assert.equal(cleared.empty, true, "clearing removes the stored avatar");
  assert.equal(cleared.cellGone, true, "the card falls back to its default badge");

  await page.screenshot({ path: `${root}/group-avatar.png` });
  assert.deepEqual(errors, []);
  const results = [{ opened, saved, afterReload, rejected, cleared }];
  await writeFile(`${root}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", opened, saved, afterReload, rejected, cleared }, null, 2));
} finally {
  await browser.close();
  server.close();
}
