import { sourceAt } from "../fixtures/source-at.mjs";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = sourceAt("674e12f");
const server = createServer((_, r) => {
  r.setHeader("Content-Type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch(),
  p = await browser.newPage(),
  findings = [];
try {
  await p.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  findings.push({
    case: "startup-focus",
    actual: await p.evaluate(
      () => document.activeElement.id || document.activeElement.tagName,
    ),
  });
  await setup(p, 2);
  findings.push(
    await p.evaluate(() => {
      state.groups[0].id = 9;
      state.groups[0].name = "先加入";
      state.groups[1].id = 2;
      state.groups[1].name = "后加入";
      state.groups.forEach((g) => (g.score = -10));
      state.evaluated = true;
      switchView("welcome");
      renderAll();
      return {
        case: "stable-ranking-negative-score-settled-phase",
        canonical: ranking().map((g) => g.name),
        display: [...document.querySelectorAll(".gp-rank-name")].map(
          (g) => g.textContent,
        ),
        max: document.getElementById("wMaxScore").textContent,
        phase: document.getElementById("gpRoundTitle").textContent,
        header: document.getElementById("topHeaderStats").textContent,
      };
    }),
  );
  findings.push(
    await p.evaluate(() => {
      state.groups[1].score = 999;
      state.itemGlobal.blooperUntil = Date.now() + 20000;
      renderAll();
      return {
        case: "masking",
        header: document.getElementById("topHeaderStats").textContent,
        rows: document.getElementById("gpRankList").innerText,
        kpiMasked: document
          .getElementById("wTotalScore")
          .classList.contains("squid-hidden-score"),
      };
    }),
  );
  await p.evaluate(() => {
    switchView("settings");
    document.getElementById("uiPref-motion").value = "off";
    document.getElementById("uiPref-motion").dispatchEvent(new Event("change"));
    switchView("welcome");
    WelcomeV2.replay();
    document
      .getElementById("gpSlideTrack")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true }),
      );
    document
      .getElementById("gpSlideTrack")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
  });
  findings.push({
    case: "motion-off-exit",
    actual: await p.evaluate(() => ({
      status: WelcomeV2.getStatus(),
      animations: document.getElementById("gpIntroLogo").getAnimations().length,
    })),
  });
} finally {
  await writeFile(
    "artifacts/welcome-completion/baseline-findings.json",
    JSON.stringify(findings, null, 2),
  );
  console.log(JSON.stringify(findings));
  await browser.close();
  await new Promise((r) => server.close(r));
}
