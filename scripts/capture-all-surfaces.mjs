import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const m = arg.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? "true"] : [arg, "true"];
  }),
);

const phase = args.phase === "after" ? "after" : "baseline";
const repoRoot = resolve(".");
const outRoot = join(repoRoot, "artifacts", "ui-hierarchy-audit", phase);
const shotDir = join(outRoot, "screenshots");
await mkdir(shotDir, { recursive: true });

const htmlPath = join(repoRoot, "dist", "godpower.html");
const electronRendererDir = resolve(
  repoRoot,
  "..",
  "godpower-electron",
  "renderer",
);
const html = await readFile(htmlPath);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

const server = createServer(async (req, res) => {
  const urlPath = (req.url || "/").split("?")[0];
  if (urlPath === "/" || urlPath === "/godpower.html") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(html);
    return;
  }
  if (urlPath.startsWith("/electron/")) {
    const rel = urlPath.slice("/electron/".length);
    const target = resolve(electronRendererDir, rel);
    if (target.startsWith(electronRendererDir) && existsSync(target)) {
      res.setHeader(
        "Content-Type",
        MIME[extname(target)] || "application/octet-stream",
      );
      res.setHeader("Cache-Control", "no-store");
      res.end(await readFile(target));
      return;
    }
  }
  res.statusCode = 404;
  res.end("Not Found");
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const browserPath =
  process.env.CHROMIUM_PATH ||
  (existsSync(
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  )
    ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    : undefined);

const browser = await chromium.launch({
  headless: true,
  ...(browserPath ? { executablePath: browserPath } : {}),
});

const surfaceMetrics = [];
const pageErrors = [];
const capturedFiles = [];

async function collectDomMetrics(page, label, rootSelector = "body") {
  const m = await page.evaluate((sel) => {
    const root = document.querySelector(sel) || document.body;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const visible = [...root.querySelectorAll("*")].filter((el) => {
      const st = getComputedStyle(el);
      if (
        st.display === "none" ||
        st.visibility === "hidden" ||
        Number(st.opacity) === 0
      )
        return false;
      const r = el.getBoundingClientRect();
      return (
        r.width > 1 &&
        r.height > 1 &&
        r.bottom > 0 &&
        r.top < vh &&
        r.right > 0 &&
        r.left < vw
      );
    });

    const radii = new Set();
    const shadows = new Set();
    const fontSizes = new Set();
    const paddings = new Set();
    const bgColors = new Set();

    let maxCardDepth = 0;
    const isCardLike = (el) => {
      const st = getComputedStyle(el);
      const hasBorder =
        parseFloat(st.borderTopWidth) > 0 &&
        st.borderTopColor !== "rgba(0, 0, 0, 0)" &&
        st.borderTopColor !== "transparent";
      const hasShadow = st.boxShadow && st.boxShadow !== "none";
      const hasRadius = parseFloat(st.borderTopLeftRadius) >= 6;
      const hasBg =
        st.backgroundColor && st.backgroundColor !== "rgba(0, 0, 0, 0)";
      return (
        hasRadius &&
        (hasShadow || (hasBorder && hasBg)) &&
        el.getBoundingClientRect().height >= 36
      );
    };

    for (const el of visible) {
      const st = getComputedStyle(el);
      if (st.borderRadius && st.borderRadius !== "0px")
        radii.add(st.borderRadius);
      if (st.boxShadow && st.boxShadow !== "none") shadows.add(st.boxShadow);
      if (st.fontSize) fontSizes.add(st.fontSize);
      if (st.padding && st.padding !== "0px") paddings.add(st.padding);
      if (st.backgroundColor && st.backgroundColor !== "rgba(0, 0, 0, 0)")
        bgColors.add(st.backgroundColor);

      if (isCardLike(el)) {
        let depth = 1;
        let p = el.parentElement;
        while (p && p !== document.body) {
          if (isCardLike(p)) depth++;
          p = p.parentElement;
        }
        if (depth > maxCardDepth) maxCardDepth = depth;
      }
    }

    const horizontalOverflow =
      document.documentElement.scrollWidth > window.innerWidth + 2;
    return {
      visibleElements: visible.length,
      maxCardDepth,
      distinctRadiiCount: radii.size,
      distinctRadiiSample: [...radii].slice(0, 14),
      distinctShadowsCount: shadows.size,
      distinctShadowsSample: [...shadows].slice(0, 8),
      distinctFontSizesCount: fontSizes.size,
      distinctFontSizes: [...fontSizes].sort(
        (a, b) => parseFloat(a) - parseFloat(b),
      ),
      distinctPaddingsCount: paddings.size,
      horizontalOverflow,
    };
  }, rootSelector);
  surfaceMetrics.push({ label, ...m });
}

async function snap(page, name, rootSelector = "body", fullPage = false) {
  await page.waitForTimeout(180);
  await page.evaluate(async () => {
    for (const a of document.getAnimations()) {
      if (a.effect?.getTiming().iterations !== Infinity) {
        try {
          a.finish();
        } catch {}
      }
    }
  });
  await page.waitForTimeout(80);
  const fileName = `${name}.png`;
  const filePath = join(shotDir, fileName);
  await page.screenshot({ path: filePath, fullPage, animations: "disabled" });
  capturedFiles.push(fileName);
  await collectDomMetrics(page, name, rootSelector);
}

async function seedClassroom14(page) {
  await page.evaluate(async () => {
    if (window.WelcomeV2 && !window.WelcomeV2.getStatus().introFinished) {
      document.getElementById("gpIntroSkip")?.click();
    }
    if (typeof closeWelcomeModal === "function") closeWelcomeModal();
    if (typeof ClassroomFeedback !== "undefined") {
      ClassroomFeedback.cancel();
      ClassroomFeedback.setOptions(
        { pickEffects: false, scoreEffects: false },
        { persist: false },
      );
    }
    if (typeof DesktopUI !== "undefined") {
      DesktopUI.setPreferences?.({ motion: "full", groupCruise: false });
    }
    state.isLocked = false;
    state.soundEnabled = false;
    state.columnMode = "double";
    state.resizerEnabled = true;
    state.resizerHeight = 120;
    state.zoomLevel = 1;
    document.body.style.zoom = 1;

    const palette = [
      "#0f766e",
      "#e76f51",
      "#3d6eaa",
      "#8370b4",
      "#2e8658",
      "#b76e24",
      "#0284c7",
      "#be123c",
    ];
    const itemsCycle = [
      [
        { key: "mega", charges: 1 },
        { key: "green", charges: 1 },
        { key: "banana", charges: 1 },
      ],
      [
        { key: "triple_green", charges: 2 },
        { key: "star", charges: 1 },
      ],
      [
        { key: "horn", charges: 1 },
        { key: "kamek", charges: 1 },
      ],
      [
        { key: "red", charges: 1 },
        { key: "coin", charges: 1 },
        { key: "mushroom", charges: 1 },
      ],
      [
        { key: "spiny", charges: 1 },
        { key: "boo", charges: 1 },
      ],
      [{ key: "bullet", charges: 1 }],
      [
        { key: "lightning", charges: 1 },
        { key: "item_box", charges: 1 },
      ],
    ];
    const scores = [
      420, 385, 360, 340, 315, 295, 270, 255, 240, 220, 195, 160, 1280, -25,
    ];
    const opts = [
      "A",
      "B",
      "C",
      "A",
      "D",
      "A",
      "B",
      "C",
      "A",
      "B",
      "D",
      "A",
      "C",
      "B",
    ];
    const firstNames = [
      "林致远",
      "陈思琪",
      "王梓轩",
      "张雨晴",
      "李浩然",
      "周诗涵",
      "吴宇航",
      "郑心怡",
      "孙嘉诚",
      "黄子墨",
      "刘一诺",
      "赵晨曦",
      "徐子涵",
      "杨明宇",
    ];

    state.groups = normalizeAllGroups(
      Array.from({ length: 14 }, (_, i) => ({
        id: i + 1,
        groupNo: i + 1,
        name:
          i === 2
            ? "第三小组 · 思辨先锋突击队（长名称测试）"
            : `第 ${i + 1} 小组`,
        color: palette[i % palette.length],
        score: scores[i],
        displayScore: scores[i],
        members: [
          `${String(i * 4 + 1).padStart(2, "0")} ${firstNames[i]}`,
          `${String(i * 4 + 2).padStart(2, "0")} 成员乙`,
          `${String(i * 4 + 3).padStart(2, "0")} 成员丙`,
          `${String(i * 4 + 4).padStart(2, "0")} 成员丁`,
        ],
        inventory: itemsCycle[i % itemsCycle.length].map((x) => ({ ...x })),
        selectedOpt: opts[i],
        allIn: i === 1 || i === 12,
        resultText: i === 0 ? "+20" : i === 13 ? "-15" : "",
        itemEffect:
          i === 3
            ? { type: "mega", roundsLeft: 2 }
            : i === 5
              ? { type: "star", roundsLeft: 3 }
              : null,
        competitionEffects:
          i === 4
            ? { burn: { remaining: 2 } }
            : i === 6
              ? { freeze: { remaining: 2 } }
              : i === 7
                ? { poison: { remaining: 3 } }
                : {},
      })),
    );

    if (
      typeof AvatarPresetCatalog !== "undefined" &&
      Array.isArray(AvatarPresetCatalog.items)
    ) {
      const presets = AvatarPresetCatalog.items;
      state.groups.forEach((g, idx) => {
        if (presets[idx % presets.length]?.dataUrl) {
          g.avatarDataUrl = presets[idx % presets.length].dataUrl;
        }
      });
    }

    state.roundActive = true;
    state.evaluated = false;
    state.hasStartedOnce = true;
    state.correctAns = "A";
    state.roundNumber = 7;

    state.itemGlobal = {
      ...(state.itemGlobal || {}),
      totalDraws: 18,
      handRaiseTotal: 9,
      pkTotal: 2,
      pickerHistory: [
        { time: Date.now() - 180000, text: "第 1 小组 · 01 林致远 (+5分)" },
        { time: Date.now() - 90000, text: "第 4 小组 · 14 成员乙 (+3分)" },
        { time: Date.now() - 30000, text: "第 3 小组 · 09 王梓轩" },
      ],
      handRaiseHistory: [
        {
          time: Date.now() - 120000,
          groupName: "第 2 小组",
          correct: true,
          reward: "score",
          delta: 5,
        },
      ],
    };

    const snapGroups = (deltaOffset, dropItem = false) =>
      state.groups.map((g, idx) => ({
        id: g.id,
        groupNo: g.groupNo,
        name: g.name,
        score: g.score - deltaOffset * (idx % 3 === 0 ? 1 : -1),
        inventory:
          dropItem && idx === 0
            ? []
            : (g.inventory || []).map((it) => ({ ...it })),
        itemEffect: g.itemEffect ? { ...g.itemEffect } : null,
      }));

    historyStack = [
      {
        time: "09:42:10",
        desc: "第 5 轮答题结算 · 正解 C",
        roundActive: false,
        evaluated: true,
        groups: snapGroups(35, true),
      },
      {
        time: "09:48:22",
        desc: "使用道具 · 超级蘑菇 (第 4 小组)",
        roundActive: true,
        evaluated: false,
        groups: snapGroups(25, false),
      },
      {
        time: "09:53:05",
        desc: "快速按人加分 · 01 林致远 (+5分)",
        roundActive: true,
        evaluated: false,
        groups: snapGroups(15, false),
      },
      {
        time: "10:01:40",
        desc: "使用道具 · 火球花 (第 5 小组)",
        roundActive: true,
        evaluated: false,
        groups: snapGroups(10, false),
      },
      {
        time: "10:08:12",
        desc: "第 6 轮答题结算 · 正解 B",
        roundActive: false,
        evaluated: true,
        groups: snapGroups(5, false),
      },
    ];

    const mockArchives = [
      {
        id: "season-2026-01",
        title: "2026 秋季期中辩论赛",
        time: "2026-10-18 15:40",
        champion: "第 1 小组",
        groups: [
          {
            groupNo: 1,
            name: "第 1 小组",
            score: 680,
            members: ["01 林致远", "02 成员乙", "03 成员丙", "04 成员丁"],
            itemStats: { used: 6, hits: 4 },
          },
          {
            groupNo: 13,
            name: "第 13 小组",
            score: 610,
            members: ["49 徐子涵", "50 成员乙"],
            itemStats: { used: 4, hits: 2 },
          },
          {
            groupNo: 3,
            name: "第三小组 · 思辨先锋突击队",
            score: 540,
            members: ["09 王梓轩", "10 成员乙"],
            itemStats: { used: 5, hits: 3 },
          },
          { groupNo: 2, name: "第 2 小组", score: 480, members: ["05 陈思琪"] },
        ],
      },
      {
        id: "season-2026-02",
        title: "第三单元知识竞答周赛",
        time: "2026-11-02 10:25",
        champion: "第 2 小组",
        groups: [
          {
            groupNo: 2,
            name: "第 2 小组",
            score: 590,
            members: ["05 陈思琪", "06 成员乙"],
            itemStats: { used: 5, hits: 3 },
          },
          {
            groupNo: 1,
            name: "第 1 小组",
            score: 550,
            members: ["01 林致远", "02 成员乙"],
            itemStats: { used: 3, hits: 2 },
          },
          { groupNo: 5, name: "第 5 小组", score: 495, members: ["17 李浩然"] },
        ],
      },
    ];
    window.getSettlementHistory = () => mockArchives;

    if (typeof AchievementLedger !== "undefined") {
      const g1Uid = state.groups[0].groupUid;
      const g2Uid = state.groups[1].groupUid;
      state.achievementLedger = AchievementLedger.normalize({
        schemaVersion: 1,
        groups: {
          [g1Uid]: {
            permanentUnlocks: {
              "ACH-001": { unlockedAt: "2026-10-18" },
              "ACH-005": { unlockedAt: "2026-11-02" },
              "ACH-053": { unlockedAt: "2026-11-02" },
            },
            seasonUnlocks: {
              "ACH-002": {
                unlockedAt: "2026-11-22",
                status: "pending-archive",
              },
              "ACH-013": {
                unlockedAt: "2026-11-22",
                status: "pending-archive",
              },
            },
            archivedUnlocks: {
              "ACH-041": { firstUnlockedAt: "2026-10-18", count: 2 },
            },
            historicalCounters: { correctAnswers: 42, answeredRounds: 55 },
            seasonCounters: {},
            seasonProgress: {
              correctStreak: 4,
              answeredStreak: 7,
              answered: 12,
              recoveryReady: false,
            },
            processedEvents: [],
          },
          [g2Uid]: {
            permanentUnlocks: {
              "ACH-001": { unlockedAt: "2026-10-18" },
            },
            seasonUnlocks: {
              "ACH-020": {
                unlockedAt: "2026-11-22",
                status: "pending-archive",
              },
            },
            historicalCounters: {},
            seasonCounters: {},
            processedEvents: [],
          },
        },
      });
    }

    state.randomEventConfig = { enabled: true, minInterval: 4, maxInterval: 8 };
    state.randomEvents = {
      roundsUntilNext: 2,
      active: [
        {
          id: "EV01",
          name: "双倍狂欢",
          category: "score",
          scope: "全班",
          remaining: 2,
          description: "本轮答对得分翻倍",
        },
        {
          id: "EV07",
          name: "铁壁防御",
          category: "status",
          scope: "后5名",
          remaining: 1,
          description: "免疫一次常规道具攻击",
        },
      ],
      history: [
        {
          roundNumber: 5,
          id: "EV01",
          name: "双倍狂欢",
          category: "score",
          summary: "全班答对积分翻倍，持续 2 轮",
        },
        {
          roundNumber: 3,
          id: "EV05",
          name: "道具雨",
          category: "item",
          summary: "随机 3 个落后小组各获得 1 件道具",
        },
      ],
    };

    ensureV2State();
    renderAll();
    if (typeof RandomEventUI !== "undefined")
      RandomEventUI.renderBattleStrip?.();
  });
}

// =========================================================================
// PART 1: Main Web App Surfaces (Classic + Marx + Modals)
// =========================================================================
{
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on("pageerror", (e) =>
    pageErrors.push({ context: "main", message: e.message }),
  );

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => SaveManager.ready());
  await page.waitForTimeout(300);

  // 1. Intro Screen (#gpIntro)
  if (await page.locator("#gpIntro").isVisible()) {
    await snap(page, "01-intro", "#gpIntro");
  }

  // Seed realistic 14-group data
  await seedClassroom14(page);

  // 2. Welcome Dashboard (Normal + Edit Mode)
  await page.evaluate(() => {
    switchView("welcome");
    renderAll();
  });
  await snap(page, "02-welcome-normal", "#view-welcome");
  await page.locator('[data-home-action="edit"]').click();
  await snap(page, "03-welcome-edit", "#view-welcome");
  await page.locator('[data-home-action="cancel"]').click();

  // 3. Battle View (14 groups double active, double evaluated + resizer, single + quickBatchBar)
  await page.evaluate(() => {
    switchView("battle");
    state.columnMode = "double";
    state.roundActive = true;
    state.evaluated = false;
    document.getElementById("heightResizerDock").style.display = "none";
    renderAll();
  });
  await snap(page, "04-battle-14-double-active", "#view-battle");

  await page.evaluate(() => {
    state.evaluated = true;
    state.correctAns = "A";
    state.resizerEnabled = true;
    state.resizerHeight = 140;
    const dock = document.getElementById("heightResizerDock");
    dock.style.display = "block";
    dock.style.height = "140px";
    renderAll();
    if (typeof renderBattleRankPreviewV21721 === "function")
      renderBattleRankPreviewV21721();
  });
  await snap(page, "05-battle-14-double-resizer-evaluated", "#view-battle");

  await page.evaluate(() => {
    state.columnMode = "single";
    document.getElementById("heightResizerDock").style.display = "none";
    renderAll();
    document
      .getElementById("quickBatchBar")
      ?.scrollIntoView({ block: "center" });
  });
  await snap(page, "06-battle-14-single-batch", "#view-battle");
  await page.evaluate(() => {
    state.columnMode = "double";
    state.roundActive = true;
    state.evaluated = false;
    renderAll();
  });

  // 4. Gameplay Page (all 5 tabs + item dialog)
  await page.evaluate(() => switchView("gameplay"));
  for (const gpTab of [
    "items",
    "statuses",
    "events",
    "achievements",
    "rules",
  ]) {
    await page.locator(`[data-gameplay-tab="${gpTab}"]`).click();
    await snap(page, `07-gameplay-${gpTab}`, "#view-gameplay");
  }
  await page.evaluate(() => GameplayItemDialog.open("mega"));
  await snap(page, "08-gameplay-item-dialog", "#gameplayItemDialog");
  await page.evaluate(() => GameplayItemDialog.close());

  // 5. History View
  await page.evaluate(() => {
    switchView("history");
    renderAll();
    const firstDetails = document.querySelector("#historyListView details");
    if (firstDetails) firstDetails.open = true;
  });
  await snap(page, "09-history", "#view-history");

  // 6. Archives View (records + 60 achievements)
  await page.evaluate(() => {
    switchView("archives");
    renderAll();
  });
  await page.locator('[data-archives-tab="records"]').click();
  await page.evaluate(() => {
    const firstDetails = document.querySelector(
      "#settlementHistoryContainer details",
    );
    if (firstDetails) firstDetails.open = true;
  });
  await snap(page, "10-archives-records", "#view-archives");
  await page.locator('[data-archives-tab="achievements"]').click();
  await snap(page, "11-archives-achievements", "#view-archives");
  await page.locator('[data-archives-tab="records"]').click();

  // 7. AI View + Knowledge Library Dialog
  await page.evaluate(async () => {
    switchView("ai");
    await new Promise((r) => setTimeout(r, 250));
    const list = document.getElementById("aiMessages");
    if (list) {
      list.innerHTML = "";
      const addMsg = (role, text) => {
        const div = document.createElement("article");
        div.className = "ai-message";
        div.dataset.role = role;
        const h = document.createElement("small");
        h.textContent = role === "user" ? "你" : "课堂助手";
        const p = document.createElement("p");
        p.textContent = text;
        div.append(h, p);
        list.append(div);
      };
      addMsg("user", "查看小组积分，重点关注前三名和落后小组。");
      addMsg(
        "assistant",
        "当前第 13 小组（1280 分）与第 1 小组（420 分）领跑；第 14 小组（-25 分）处于落后区间。建议关注课堂参与度。",
      );
      addMsg("user", "给第 3 小组加 5 分。");
      addMsg(
        "assistant",
        "已生成待确认改分提案：第 3 小组 +5 分（360 → 365）。请点击下方按钮确认后执行。",
      );
    }
  });
  await snap(page, "12-ai-chat", "#view-ai");
  await page.locator("#aiOpenKnowledge").click();
  await page.locator("#aiKnowledgeDialog").waitFor({ state: "visible" });
  await snap(page, "13-ai-knowledge-dialog", "#aiKnowledgeDialog");
  await page.locator("#aiKnowledgeClose").click();
  await page.locator("#aiKnowledgeDialog").waitFor({ state: "detached" });

  // 8. Settings View (ALL 10 categories: collapsed disclosures + expanded disclosures + MKWorld simulator)
  await page.evaluate(() => switchView("settings"));
  const settingsCategories = [
    "rules",
    "appearance",
    "motion",
    "sound",
    "items",
    "students",
    "welcome",
    "data",
    "ai",
    "about",
  ];
  for (const cat of settingsCategories) {
    await page.locator(`#uiSettingsShell [data-category="${cat}"]`).click();
    await page.evaluate(() => {
      document
        .querySelectorAll("#view-settings details.ui-settings-disclosure")
        .forEach((d) => {
          d.open = false;
        });
      document.querySelector("#view-settings .settings-scroll")?.scrollTo(0, 0);
    });
    if (cat === "items") {
      await page.evaluate(() => {
        document
          .querySelector(
            '#view-settings [data-category-panel="items"] .idraw-preview',
          )
          ?.closest("details") &&
          (document
            .querySelector(
              '#view-settings [data-category-panel="items"] .idraw-preview',
            )
            .closest("details").open = false);
      });
    }
    await snap(
      page,
      `14-settings-${cat}-collapsed`,
      `[data-category-panel="${cat}"]`,
    );

    const disclosureCount = await page
      .locator(
        `#view-settings [data-category-panel="${cat}"] details.ui-settings-disclosure`,
      )
      .count();
    if (disclosureCount > 0 || cat === "items") {
      await page.evaluate((c) => {
        document
          .querySelectorAll(
            `#view-settings [data-category-panel="${c}"] details.ui-settings-disclosure`,
          )
          .forEach((d) => {
            d.open = true;
          });
      }, cat);
      await snap(
        page,
        `14-settings-${cat}-expanded`,
        `[data-category-panel="${cat}"]`,
      );
    }
  }

  // 9. Modals & Windows (Component Library sections, Picker, Hand-raise, Group Item Window, Quick Person, Member Search, Score, Confirmations, Recovery, Settlement, Password)
  await page.evaluate(() => switchView("battle"));

  // Component Library
  await page.evaluate(() => UIComponentLibrary.open());
  for (const mode of [
    "components",
    "tokens",
    "styles",
    "animations",
    "conflicts",
  ]) {
    await page.locator("#componentLibraryMode").selectOption(mode);
    await snap(
      page,
      `15-modal-component-library-${mode}`,
      "#componentLibraryModal",
    );
  }
  await page.evaluate(() => UIComponentLibrary.close());

  // Picker Modal (individual, group, two_tier)
  await page.evaluate(() => openPickerModal());
  for (const mode of ["individual", "group", "two_tier"]) {
    await page.evaluate((m) => setPickerMode(m), mode);
    await snap(page, `16-modal-picker-${mode}`, "#pickerModal");
  }
  await page.evaluate(() => closePickerModal());

  // Hand-raise flow (select -> judge -> reward)
  await page.evaluate(() => openHandRaise());
  await snap(page, "17-modal-hand-select", "body");
  await page.locator('.group-row-card[data-group-id="1"]').click();
  await page
    .locator('[data-hand-judge="correct"]')
    .waitFor({ state: "visible" });
  await snap(page, "17-modal-hand-judge", "#handRaiseBackdrop");
  await page.locator('[data-hand-judge="correct"]').click();
  await page
    .locator('[data-hand-reward="score"]')
    .waitFor({ state: "visible" });
  await snap(page, "17-modal-hand-reward", "#handRaiseBackdrop");
  await page.evaluate(() => closeHandRaise());

  // Group Item Window (detail, items, score)
  await page.evaluate(() => openItemWindow(1, "detail"));
  await snap(page, "18-modal-group-detail", "#itemModalBackdrop");
  await page.evaluate(() => switchItemTab("items"));
  await snap(page, "18-modal-group-items", "#itemModalBackdrop");
  await page.evaluate(() => switchItemTab("score"));
  await snap(page, "18-modal-group-score", "#itemModalBackdrop");
  await page.evaluate(() => closeItemWindow());

  // Score modal
  await page.evaluate(() => openScoreModal(1));
  await snap(page, "19-modal-score", "#scoreModalBackdrop");
  await page.evaluate(() => closeScoreModal());

  // Quick Person Score modal
  await page.evaluate(() => openQuickPersonScoreV218());
  await snap(page, "20-modal-quick-person", "#quickPersonBackdropV218");
  await page.evaluate(() => closeQuickPersonScoreV218());

  // Member Search modal
  await page.evaluate(() => openMemberSearchModal());
  await page.locator("#memberSearchInput").fill("林");
  await page.evaluate(() => searchMemberGroups());
  await snap(page, "21-modal-member-search", "#memberSearchBackdrop");
  await page.evaluate(() => closeMemberSearchModal());

  // Random Event banner + battle strip drawer
  await page.evaluate(() => {
    document.querySelector("[data-re-toggle-history]")?.click();
    RandomEventUI?.presentOutcome?.({
      triggered: true,
      id: "EV01",
      category: "score",
      name: "双倍狂欢",
      summary: "全班下轮正式判题答对得分翻倍（仅生效一次）。",
    });
  });
  await snap(page, "22-modal-random-event-banner", "body");
  await page.evaluate(() => {
    const b = document.getElementById("randomEventBanner");
    if (b) b.hidden = true;
    document.querySelector("[data-re-toggle-history]")?.click();
  });

  // Theme Confirmation dialog
  await page.evaluate(() => {
    void themeConfirm(
      "确认清空第 1 小组本轮积分并记录到历史？此操作支持一键撤销。",
      {
        title: "危险操作确认",
        confirmText: "确认执行",
        cancelText: "取消",
      },
    );
  });
  await snap(page, "23-modal-theme-confirm", "#themeDialogV21727");
  await page.evaluate(() => closeThemeDialogV21727(false));

  // Program Confirmation dialog
  await page.evaluate(() => {
    void programConfirmV28(
      "检测到本地存在未提交的旧版课堂配置，是否继续执行兼容确认？",
    );
  });
  await snap(page, "24-modal-program-confirm", "#programConfirmV28");
  await page.evaluate(() => {
    const d = document.getElementById("programConfirmV28");
    d?.querySelector("button")?.click();
  });

  // Settlement Name Modal & Password Modal
  await page.evaluate(() => triggerFinalSettlement());
  await snap(page, "25-modal-settlement-name", "#settlementNameModal");
  await page.evaluate(() => closeSettlementNameModal());

  await page.evaluate(() => openPwdModal());
  await snap(page, "26-modal-pwd", "#pwdModal");
  await page.evaluate(() => closePwdModal());

  // Classroom Recovery panel
  await page.evaluate(() => {
    switchView("welcome");
    const warn = document.getElementById("classroomSaveWarning");
    const tools = document.getElementById("classroomRecoveryTools");
    const cand = document.getElementById("classroomRecoveryCandidates");
    const status = document.getElementById("classroomRecoveryStatus");
    if (warn) warn.hidden = false;
    if (tools) tools.hidden = false;
    if (status)
      status.textContent = "发现 2 个有效副本。扫描没有修改任何数据。";
    if (cand) {
      cand.innerHTML =
        '<article data-recovery-candidate="0"><p>godpower_state_v2 · 14 个小组 · 合计 4395 分</p><button type="button" class="btn btn-secondary">查看摘要</button></article>';
    }
  });
  await snap(page, "27-classroom-recovery-panel", "#classroomRecoveryTools");
  await page.evaluate(() => {
    document.getElementById("classroomSaveWarning").hidden = true;
    document.getElementById("classroomRecoveryTools").hidden = true;
  });

  // 10. Marx Theme Key Surfaces
  await page.evaluate(() => GodpowerTheme.set("marx"));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    switchView("welcome");
    renderAll();
  });
  await snap(page, "28-marx-welcome", "#view-welcome");
  await page.evaluate(() => {
    switchView("battle");
    renderAll();
  });
  await snap(page, "29-marx-battle-14", "#view-battle");
  await page.evaluate(() => switchView("gameplay"));
  await snap(page, "30-marx-gameplay-items", "#view-gameplay");
  await page.evaluate(() => switchView("ai"));
  await snap(page, "31-marx-ai-chat", "#view-ai");
  await page.evaluate(() => switchView("settings"));
  await page.locator('#uiSettingsShell [data-category="appearance"]').click();
  await snap(
    page,
    "32-marx-settings-appearance",
    '[data-category-panel="appearance"]',
  );

  await context.close();
}

// =========================================================================
// PART 2: Electron Floating Surfaces (picker.html & effect.html hand-cards)
// =========================================================================
if (existsSync(electronRendererDir)) {
  const ctxE = await browser.newContext({
    viewport: { width: 620, height: 760 },
    deviceScaleFactor: 1,
  });
  const pPicker = await ctxE.newPage();
  pPicker.on("pageerror", (e) =>
    pageErrors.push({ context: "electron-picker", message: e.message }),
  );

  await pPicker.addInitScript(() => {
    const mockState = {
      revision: 1,
      ready: true,
      shell: {
        collapsed: false,
        view: "picker",
        alwaysOnTop: true,
        effectsEnabled: true,
        effectActive: false,
        displayId: 1,
        displays: [
          { id: 1, label: "主显示器", bounds: { width: 1920, height: 1080 } },
        ],
      },
      snapshot: {
        theme: "classic",
        mode: "two_tier",
        phase: "revealed",
        antiRepeat: true,
        remaining: "剩余: 48",
        locked: false,
        unsaved: false,
        slots: [1, 2, 5, -1, -2, -5],
        preview: { student: "01 林致远", group: "第 1 小组" },
        result: {
          id: "r1",
          name: "01 林致远",
          groupId: 1,
          groupName: "第 1 小组",
          number: "01",
          score: 420,
        },
        preselectedGroupIds: [1, 3],
        groups: [
          {
            id: 1,
            name: "第 1 小组",
            members: 4,
            score: 420,
            inventory: [{ key: "mega", name: "超级蘑菇" }],
          },
          { id: 2, name: "第 2 小组", members: 4, score: 385, inventory: [] },
          {
            id: 3,
            name: "第 3 小组",
            members: 4,
            score: 360,
            inventory: [{ key: "green", name: "绿龟壳" }],
          },
        ],
        history: [
          { time: Date.now() - 60000, text: "第 2 小组 · 05 陈思琪 (+2)" },
          { time: Date.now() - 15000, text: "第 1 小组 · 01 林致远" },
        ],
        hand: {
          groupId: 1,
          selectionId: "h1",
          groupName: "第 1 小组",
          judged: true,
          correct: true,
          rewardComplete: false,
          canScore: true,
          canDraw: true,
          canUse: true,
          mainItemName: "超级蘑菇",
          inventoryCount: 2,
        },
      },
    };
    const listeners = [];
    window.__setMockPickerState = (patch) => {
      mockState.revision++;
      if (patch.shell) Object.assign(mockState.shell, patch.shell);
      if (patch.snapshot) Object.assign(mockState.snapshot, patch.snapshot);
      listeners.forEach((fn) => fn(structuredClone(mockState)));
    };
    window.godpowerDesktop = {
      getState: async () => structuredClone(mockState),
      onState: (fn) => listeners.push(fn),
      command: async () => ({ ok: true }),
      windowAction: async () => ({ ok: true }),
    };
  });

  await pPicker.goto(`${baseUrl}/electron/picker.html`, {
    waitUntil: "domcontentloaded",
  });
  await snap(pPicker, "33-electron-picker-panel");

  await pPicker.evaluate(() =>
    window.__setMockPickerState({ shell: { view: "hand" } }),
  );
  await snap(pPicker, "34-electron-picker-hand");

  await pPicker.evaluate(() =>
    window.__setMockPickerState({
      shell: { view: "launcher", collapsed: true },
    }),
  );
  await snap(pPicker, "35-electron-picker-launcher");
  await ctxE.close();

  // Hand Cards overlay inside effect.html (1920x1080)
  const ctxHand = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const pHand = await ctxHand.newPage();
  pHand.on("pageerror", (e) =>
    pageErrors.push({ context: "electron-hand-cards", message: e.message }),
  );
  await pHand.addInitScript(() => {
    let revealCb = null;
    window.__triggerMockHandReveal = (payload) => revealCb && revealCb(payload);
    window.godpowerDesktop = {
      onReveal: (cb) => {
        revealCb = cb;
      },
      ready: () => {},
      interactive: () => {},
      finish: () => {},
      handAction: async () => ({ ok: true }),
    };
  });
  await pHand.goto(`${baseUrl}/electron/effect.html`, {
    waitUntil: "domcontentloaded",
  });
  for (const hPhase of ["JUDGE", "REWARD_CHOICE", "SCORE"]) {
    await pHand.evaluate((phaseName) => {
      window.__triggerMockHandReveal({
        id: "hand-" + phaseName,
        kind: "hand",
        theme: "classic",
        slots: [1, 2, 5, -1, -2, -5],
        group: { id: 1, name: "第 1 小组 · 思辨先锋" },
        hand: {
          phase: phaseName,
          groupId: 1,
          selectionId: "sel-1",
          canScore: true,
          canDraw: true,
          canUse: true,
          mainItemName: "超级蘑菇",
          inventoryCount: 2,
          motionEnabled: true,
        },
      });
    }, hPhase);
    await snap(
      pHand,
      `36-electron-hand-cards-${hPhase.toLowerCase()}`,
      "#handCards",
    );
  }
  await ctxHand.close();
}

// =========================================================================
// PART 3: Static CSS & Motion Audit across src/styles/ & electron/renderer/
// =========================================================================
async function walkCss(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walkCss(full)));
    else if (ent.name.endsWith(".css")) out.push(full);
  }
  return out.sort();
}

const cssFiles = [
  ...(await walkCss(join(repoRoot, "src", "styles"))),
  ...(existsSync(electronRendererDir)
    ? await walkCss(electronRendererDir)
    : []),
];

const cssFindings = {
  transitionAll: [],
  easeIn: [],
  scaleZero: [],
  layoutAnimations: [],
  importantByFile: {},
  totalImportant: 0,
  unscopedHoverCount: 0,
};

for (const file of cssFiles) {
  const rel = file.startsWith(repoRoot)
    ? file.slice(repoRoot.length + 1).replaceAll("\\", "/")
    : "electron/" +
      file.slice(electronRendererDir.length + 1).replaceAll("\\", "/");
  const text = await readFile(file, "utf8");
  const lines = text.split("\n");
  const impCount = (text.match(/!important\b/g) || []).length;
  if (impCount) {
    cssFindings.importantByFile[rel] = impCount;
    cssFindings.totalImportant += impCount;
  }
  lines.forEach((line, idx) => {
    const ln = idx + 1;
    const trimmed = line.trim();
    if (/transition\s*:[^;]*\ball\b/i.test(trimmed))
      cssFindings.transitionAll.push({ file: rel, line: ln, text: trimmed });
    if (/\bease-in\b(?!-out)/i.test(trimmed))
      cssFindings.easeIn.push({ file: rel, line: ln, text: trimmed });
    if (/scale\(\s*0\s*\)|scale3d\(\s*0/i.test(trimmed))
      cssFindings.scaleZero.push({ file: rel, line: ln, text: trimmed });
    if (
      /(?:transition|animation)[^;]*\b(?:width|height|padding|margin|top|left|right|bottom|border-width|max-height|min-height)\b/i.test(
        trimmed,
      )
    )
      cssFindings.layoutAnimations.push({ file: rel, line: ln, text: trimmed });
    if (/:hover\b/.test(trimmed)) cssFindings.unscopedHoverCount++;
  });
}

await writeFile(
  join(outRoot, "metrics.json"),
  JSON.stringify(
    {
      phase,
      capturedAt: new Date().toISOString(),
      screenshotCount: capturedFiles.length,
      screenshots: capturedFiles,
      pageErrors,
      surfaceMetrics,
      cssFindings,
    },
    null,
    2,
  ),
);

await browser.close();
server.close();
console.log(
  JSON.stringify({
    phase,
    screenshotCount: capturedFiles.length,
    pageErrors: pageErrors.length,
    outRoot,
    cssAuditSummary: {
      transitionAll: cssFindings.transitionAll.length,
      easeIn: cssFindings.easeIn.length,
      scaleZero: cssFindings.scaleZero.length,
      layoutAnimations: cssFindings.layoutAnimations.length,
      totalImportant: cssFindings.totalImportant,
    },
  }),
);
