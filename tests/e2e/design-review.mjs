import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html"),
  phase = process.env.DESIGN_PHASE || "current";
const root = `artifacts/design-review/${phase}`;
await mkdir(root, { recursive: true });
const server = createServer((q, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const settingsOnly = process.env.DESIGN_ONLY === "settings";
const browser = await launch(),
  rows = [],
  errors = [];
const cases = [
  ["score", "scoreModalBackdrop", () => openScoreModal(1)],
  ["member-search", "memberSearchBackdrop", () => openMemberSearchModal()],
  ["password", "pwdModal", () => openPwdModal()],
  ["settlement-name", "settlementNameModal", () => triggerFinalSettlement()],
  [
    "picker-individual",
    "pickerModal",
    () => {
      openPickerModal();
      setPickerMode("individual");
    },
  ],
  [
    "picker-group",
    "pickerModal",
    () => {
      openPickerModal();
      setPickerMode("group");
    },
  ],
  [
    "picker-two-tier",
    "pickerModal",
    () => {
      openPickerModal();
      setPickerMode("two_tier");
    },
  ],
  ["group-details", "itemModalBackdrop", () => openItemWindow(1, "detail")],
  ["group-items", "itemModalBackdrop", () => openItemWindow(1, "items")],
  ["group-score", "itemModalBackdrop", () => openItemWindow(1, "score")],
  [
    "hand-raise",
    "handRaiseBackdrop",
    () => {
      openHandRaise();
      selectHandGroup(1);
      judgeHandRaise(true);
    },
  ],
  ["about", "aboutBackdrop", () => openAbout()],
  [
    "encyclopedia",
    "aboutBackdrop",
    () => {
      openAbout();
      renderAbout("items");
    },
  ],
  [
    "guide",
    "aboutBackdrop",
    () => {
      openAbout();
      renderAbout("guide");
    },
  ],
  ["batch-import", "batchImportModal", () => openBatchImportModal()],
  [
    "student-score",
    "quickPersonBackdropV218",
    () => openQuickPersonScoreV218(),
  ],
  [
    "warning",
    "programConfirmV28",
    () => {
      void programConfirmV28("还有 14 个小组尚未完成作答。是否仍要公布答案？");
    },
  ],
  [
    "danger",
    "themeDialogV21727",
    () => {
      void themeConfirm("此操作将影响所有小组，请确认已经完成备份。", {
        title: "确认清零积分",
        danger: true,
      });
    },
  ],
  [
    "winner-showcase",
    "classroomShowcase",
    () => {
      ClassroomFeedback.setOptions(
        { pickEffects: true, duration: 3600 },
        { persist: false },
      );
      ClassroomFeedback.picked(
        { memberName: "01 张同学", group: state.groups[0] },
        "individual",
      );
    },
  ],
  [
    "settlement",
    "grandModalOverlay",
    () => {
      confirmFinalSettlement();
    },
  ],
];
async function shot(p, name, scope = "body") {
  await p.waitForTimeout(500);
  const metrics = await p.locator(scope).evaluate((e) => {
    const r = e.getBoundingClientRect();
    const visible = (x) =>
      x.getClientRects().length && getComputedStyle(x).visibility !== "hidden";
    return {
      bounds: r.toJSON(),
      scrollWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
      text: [
        ...e.querySelectorAll(
          "h1,h2,h3,p,small,label,summary,button,input,select,.ui-muted,[class*=hint],[class*=title]",
        ),
      ]
        .filter(visible)
        .slice(0, 350)
        .map((x) => {
          const s = getComputedStyle(x);
          return {
            tag: x.tagName,
            text: (x.innerText || x.getAttribute("placeholder") || "")
              .trim()
              .slice(0, 100),
            color: s.color,
            background: s.backgroundColor,
            font: s.fontSize,
            weight: s.fontWeight,
            rect: x.getBoundingClientRect().toJSON(),
          };
        }),
    };
  });
  if (scope !== "body" && scope !== "#gpIntro") {
    const bounds = await p
      .locator(scope + " .ui-function-surface")
      .first()
      .evaluate((e) => e.getBoundingClientRect().toJSON());
    const viewport = p.viewportSize();
    assert.ok(
      bounds.x >= -1 &&
        bounds.y >= -1 &&
        bounds.right <= viewport.width + 1 &&
        bounds.bottom <= viewport.height + 1,
      JSON.stringify({ name, bounds, viewport }),
    );
    metrics.surfaceBounds = bounds;
  }
  assert.ok(
    metrics.scrollWidth <= metrics.viewport + 1,
    `Horizontal overflow: ${name}`,
  );
  const file = `${root}/${name}.png`;
  await p.screenshot({ path: file, fullPage: scope === "body" });
  rows.push({ name, screenshot: file, ...metrics });
}
try {
  for (const width of (process.env.DESIGN_WIDTHS || "1920")
    .split(",")
    .map(Number)) {
    const height = width === 1366 ? 768 : width === 2560 ? 1440 : 1080;
    const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
      }),
      p = await context.newPage();
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`http://127.0.0.1:${server.address().port}`, {
      waitUntil: "domcontentloaded",
    });
    await setup(p, 14);
    await p.evaluate(() => applyZoom(1));
    await p.evaluate(() => {
      state.groups[0].name = "银河探索小组 · 一起向未来";
      state.groups[0].score = 12345678;
      state.groups[1].score = -120;
      state.groups[0].inventory = [
        { key: "fire_flower", charges: 3 },
        { key: "banana", charges: 1 },
      ];
      for (let i = 0; i < 4; i++) {
        recordHistory("课堂加分 · 第" + (i + 1) + "次");
        state.groups[i].score += 5;
      }
      STORAGE.setJSON("politics_settlement_history", [
        {
          title: "2026 秋季课堂竞技 · 第 1 届",
          time: "2026-10-18 09:00",
          champion: state.groups[0].name,
          groups: JSON.parse(JSON.stringify(ranking())),
        },
      ]);
      saveState();
      renderAll();
    });
    for (const view of [
      "welcome",
      "battle",
      "history",
      "archives",
      "settings",
    ].filter((v) => !settingsOnly || v === "settings")) {
      await p.evaluate((v) => switchView(v), view);
      await shot(p, `${view}-${width}`);
      if (view === "history" || view === "archives") {
        await p
          .locator(
            view === "history" ? ".ui-history summary" : ".ui-archive-summary",
          )
          .first()
          .click();
        await shot(p, `${view}-expanded-${width}`);
      }
    }
    const cats = await p
      .locator(".ui-settings-nav [data-category]")
      .evaluateAll((a) => a.map((e) => e.dataset.category));
    for (const cat of cats) {
      await p.locator(`.ui-settings-nav [data-category="${cat}"]`).click();
      await shot(p, `settings-${cat}-${width}`);
      if (["sound", "items", "welcome", "data"].includes(cat)) {
        const summaries = p.locator(
          `.ui-settings-category[data-category-panel="${cat}"] details.ui-settings-disclosure:not([open]) > summary`,
        );
        while (await summaries.count()) {
          await summaries.first().click();
          await p.waitForTimeout(330);
        }
        await p.locator(".ui-settings-body").evaluate((e) => (e.scrollTop = 0));
        await shot(p, `settings-${cat}-expanded-${width}`);
        await p
          .locator(".ui-settings-body")
          .evaluate((e) => (e.scrollTop = e.scrollHeight));
        await shot(p, `settings-${cat}-bottom-${width}`);
      }
    }
    await p.evaluate(() => switchView("battle"));
    for (const [name, id, open] of settingsOnly ? [] : cases) {
      try {
        await p.evaluate(open);
        await p.locator("#" + id).waitFor({ state: "visible" });
        await shot(p, `${name}-${width}`, "#" + id);
      } catch (e) {
        rows.push({ name: `${name}-${width}`, error: e.message });
      }
      await p.keyboard.press("Escape");
      await p
        .locator("#" + id)
        .waitFor({ state: "hidden", timeout: 6000 })
        .catch(() => {});
    }
    if (!settingsOnly) {
      // Empty collection states are independently rendered without touching a real profile.
      await p.evaluate(() => {
        historyStack = [];
        STORAGE.setJSON("politics_settlement_history", []);
        state.groups = [];
        renderAll();
      });
      for (const view of ["welcome", "history", "archives"]) {
        await p.evaluate((v) => switchView(v), view);
        await shot(p, `${view}-empty-${width}`);
      }
      await p.evaluate(() => WelcomeV2.replay());
      await shot(p, `startup-${width}`, "#gpIntro");
      await p.locator("#gpIntroSkip").click();
      await p.waitForFunction(() => WelcomeV2.getStatus().introFinished);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
  await writeFile(
    `${root}/inventory.json`,
    JSON.stringify(
      { sha256: createHash("sha256").update(html).digest("hex"), rows, errors },
      null,
      2,
    ),
  );
}
console.log({
  screenshots: rows.filter((r) => r.screenshot).length,
  failures: rows.filter((r) => r.error),
  errors,
});
if (rows.some((r) => r.error) || errors.length) process.exitCode = 1;
