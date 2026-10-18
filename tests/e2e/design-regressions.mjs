import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  root = "artifacts/design-review";
await mkdir(root, { recursive: true });
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const b = await launch(),
  p = await b.newPage({ viewport: { width: 1920, height: 1080 } }),
  results = [],
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: "PASS" });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.stack });
    console.log("FAIL", name, e.message);
  }
}
try {
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await setup(p, 14);
  await test("Large welcome ranking has a bounded keyboard-scrollable viewport", async () => {
    await p.evaluate(() => switchView("welcome"));
    await p.waitForTimeout(500);
    const r = await p.locator("#gpRankList").evaluate((e) => ({
      h: e.clientHeight,
      total: e.scrollHeight,
      tab: e.tabIndex,
      overflow: getComputedStyle(e).overflowY,
    }));
    assert.ok(r.h <= 360 && r.total > r.h, JSON.stringify(r));
    assert.equal(r.tab, 0);
    assert.equal(r.overflow, "auto");
    await p.locator("#gpRankList").focus();
    await p.keyboard.press("End");
    await p.waitForTimeout(180);
    assert.ok(await p.locator("#gpRankList").evaluate((e) => e.scrollTop > 0));
  });
  await test("Welcome ranking headings align with all five data columns", async () => {
    const r = await p.evaluate(() => ({
      head: [...document.querySelector(".gp-rank-head").children].map(
        (x) => x.getBoundingClientRect().left,
      ),
      row: [...document.querySelector(".gp-rank-row").children].map(
        (x) => x.getBoundingClientRect().left,
      ),
    }));
    assert.equal(r.head.length, 5);
    assert.ok(
      r.head.every((x, i) => Math.abs(x - r.row[i]) < 1),
      JSON.stringify(r),
    );
  });
  await test("Flat-surface secondary labels and semantic buttons meet AA text contrast", async () => {
    const rows = await p.evaluate(() => {
      const lum = (c) => {
        let a = c
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number)
          .map((x) => {
            x /= 255;
            return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      };
      const selectors = [
        ".gp-panel-title small",
        ".gp-rank-head",
        ".gp-panel-footer>span",
        ".gp-footnote",
        ".gp-kpi small",
        ".gp-daily-grid .ui-source",
        ".gp-rank-state",
      ];
      return selectors.flatMap((s) =>
        [...document.querySelectorAll("#view-welcome " + s)].map((e) => {
          const c = getComputedStyle(e).color;
          let n = e,
            bg = "rgb(255,255,255)";
          while (n) {
            const t = getComputedStyle(n);
            if (t.backgroundColor !== "rgba(0, 0, 0, 0)") {
              bg = t.backgroundColor;
              break;
            }
            n = n.parentElement;
          }
          const x = lum(c),
            y = lum(bg);
          return {
            selector: s,
            ratio: (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05),
          };
        }),
      );
    });
    assert.ok(rows.length >= 10);
    for (const r of rows) assert.ok(r.ratio >= 4.5, JSON.stringify(r));
  });
  await test("Student filter controls align in one content column even with 14 groups", async () => {
    await p.evaluate(() => {
      switchView("battle");
      openQuickPersonScoreV218();
    });
    await p.waitForTimeout(500);
    const x = await p
      .locator("#quickPersonFiltersV218 .qp-row-v218")
      .evaluateAll((rows) =>
        rows.map((e) => e.children[1]?.getBoundingClientRect().left),
      );
    // The actual container ID may change; use the component class as the contract.
    const lefts = x.length
      ? x
      : await p
          .locator(".quick-person-filters-v218 .qp-row-v218")
          .evaluateAll((rows) =>
            rows.map((e) => e.children[1]?.getBoundingClientRect().left),
          );
    assert.equal(lefts.length, 4);
    assert.ok(
      lefts.every((x) => Math.abs(x - lefts[0]) < 1),
      JSON.stringify(lefts),
    );
    await p.keyboard.press("Escape");
    await p.locator("#quickPersonBackdropV218").waitFor({ state: "hidden" });
  });
  await test("Student search helper stays beside its input instead of becoming a label row", async () => {
    await p.evaluate(() => openQuickPersonScoreV218());
    await p.waitForTimeout(450);
    const r = await p
      .locator(".quick-person-filters-v218 .qp-row-v218")
      .first()
      .evaluate((e) =>
        [...e.children].map((x) => x.getBoundingClientRect().toJSON()),
      );
    assert.equal(r.length, 3);
    assert.ok(Math.abs(r[1].y - r[2].y) < 12, JSON.stringify(r));
    await p.keyboard.press("Escape");
    await p.locator("#quickPersonBackdropV218").waitFor({ state: "hidden" });
  });
  await test("Closing a partially entered window starts from its visible state and fades the backdrop", async () => {
    await p.evaluate(() => openPwdModal());
    await p.waitForFunction(
      () =>
        document.querySelector("#pwdModal .ui-function-surface").getAnimations()
          .length > 0,
    );
    const r = await p.evaluate(() => {
      const root = document.getElementById("pwdModal"),
        el = root.querySelector(".ui-function-surface");
      const entering = el
        .getAnimations()
        .find((a) => a.effect.getKeyframes()[0].opacity == 0);
      entering.pause();
      entering.currentTime = 30;
      const before = getComputedStyle(el);
      const snapshot = {
        opacity: Number(before.opacity),
        translate: before.translate,
        scale: before.scale,
      };
      closePwdModal();
      const exit = el
        .getAnimations()
        .find((a) => a.effect.getKeyframes().at(-1).opacity == 0);
      exit.pause();
      const frames = exit.effect.getKeyframes(),
        back = root
          .getAnimations()
          .find((a) => a.effect.getKeyframes().at(-1).opacity == 0);
      back?.pause();
      return {
        snapshot,
        first: frames[0],
        easing: exit.effect.getTiming().easing,
        backdrop: !!back,
      };
    });
    assert.ok(
      Math.abs(Number(r.first.opacity) - r.snapshot.opacity) < 0.01,
      JSON.stringify(r),
    );
    assert.equal(r.first.translate, r.snapshot.translate);
    assert.equal(r.backdrop, true);
    assert.equal(r.easing, "cubic-bezier(0.23, 1, 0.32, 1)");
    await p.evaluate(() =>
      DesktopUI.finishWindowClose(document.getElementById("pwdModal")),
    );
  });
  await test("Window empty labels, long group metadata and score presets remain readable", async () => {
    await p.evaluate(() => {
      state.groups[0].name = "非常长的小组名称 · 银河探索一起向未来";
      openMemberSearchModal();
    });
    await p.waitForTimeout(450);
    async function contrast(selector) {
      return p
        .locator(selector)
        .first()
        .evaluate((e) => {
          const lum = (c) => {
            const a = c
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
              .map((x) => {
                x /= 255;
                return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
              });
            return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
          };
          const style = getComputedStyle(e);
          let bg = "rgb(255,255,255)",
            node = e;
          while (node) {
            const c = getComputedStyle(node).backgroundColor;
            if (c !== "rgba(0, 0, 0, 0)") {
              bg = c;
              break;
            }
            node = node.parentElement;
          }
          const a = lum(style.color),
            b = lum(bg);
          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        });
    }
    assert.ok((await contrast(".member-search-empty")) >= 4.5);
    await p.keyboard.press("Escape");
    await p.locator("#memberSearchBackdrop").waitFor({ state: "hidden" });
    await p.evaluate(() => openQuickPersonScoreV218());
    await p.waitForTimeout(450);
    assert.ok((await contrast(".qp-group-v218")) >= 4.5);
    const label = await p
      .locator(".qp-group-v218")
      .first()
      .evaluate((e) => ({
        title: e.title,
        width: e.getBoundingClientRect().width,
        parent: e.parentElement.getBoundingClientRect().width,
      }));
    assert.match(label.title, /银河探索/);
    assert.ok(label.width < label.parent * 0.5);
    await p.keyboard.press("Escape");
    await p.locator("#quickPersonBackdropV218").waitFor({ state: "hidden" });
    await p.evaluate(() => openScoreModal(1));
    await p.waitForTimeout(450);
    assert.ok(
      (await contrast("#scoreModalBackdrop .cf-score-slots .btn-success")) >=
        4.5,
    );
    assert.ok(
      (await contrast("#scoreModalBackdrop .cf-score-slots .btn-danger")) >=
        4.5,
    );
    await p.keyboard.press("Escape");
    await p.locator("#scoreModalBackdrop").waitFor({ state: "hidden" });
  });
  await test("Native showcase backdrop fades and cleans up without leaving the page inert", async () => {
    await p.evaluate(() => {
      ClassroomFeedback.setOptions(
        { scoreEffects: true, duration: 3600 },
        { persist: false },
      );
      ClassroomFeedback.score("测试同学", 5);
    });
    await p.locator("#classroomShowcase").waitFor({ state: "visible" });
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const root = document.getElementById("classroomShowcase");
      ClassroomFeedback.dismiss();
      const back = root
        .getAnimations()
        .find((a) => a.effect.pseudoElement === "::backdrop");
      if (!back) return { present: false };
      back.pause();
      back.currentTime = 140;
      const opacity = Number(getComputedStyle(root, "::backdrop").opacity);
      DesktopUI.finishWindowClose(root);
      return {
        present: true,
        opacity,
        open: root.open,
        inert: root.inert,
        closing: root.dataset.uiClosing,
      };
    });
    assert.equal(r.present, true);
    assert.ok(r.opacity > 0 && r.opacity < 1, JSON.stringify(r));
    assert.equal(r.open, false);
    assert.equal(r.inert, false);
    assert.equal(r.closing, undefined);
  });
} finally {
  await writeFile(
    `${root}/${process.env.DESIGN_TEST_PHASE || "regressions"}.json`,
    JSON.stringify(
      {
        sha256: createHash("sha256").update(html).digest("hex"),
        results,
        errors,
      },
      null,
      2,
    ),
  );
  await b.close();
  server.close();
}
if (results.some((r) => r.status === "FAIL") || errors.length)
  process.exitCode = 1;
