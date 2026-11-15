import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((_, res) => res.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const results = [],
  errors = [];
const root = process.env.ITEM_STATUS_ARTIFACT_DIR || "artifacts/items-status";
await mkdir(root, { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  results.push(
    await page.evaluate(async () => {
      const assert = (ok, msg) => {
        if (!ok) throw Error(msg);
      };
      assert(ITEM_KEYS.length === 28, "catalog28");
      assert(
        ItemModules.configuration().items.kamek &&
          ItemModules.configuration().items.item_box,
        "module settings",
      );
      for (let pos = 1; pos <= 14; pos++)
        for (const key of ["kamek", "item_box"]) {
          const w = itemDropWeights(pos, 14)[key];
          if (pos === 1 || pos >= 11) {
            assert(w === 0, `${key} excluded at boundary pos ${pos}`);
          }
          if (pos >= 3 && pos <= 6) {
            assert(w > 0, `${key} eligible at midfield pos ${pos}`);
          }
        }
      assert(
        ITEM_ORDER_V218.includes("kamek") &&
          GROUP_ITEM_ORDER_V2182.includes("item_box") &&
          itemKeysV283().includes("kamek"),
        "all lists",
      );
      assert(
        BUILTIN_ITEM_ICONS_V2121.kamek.startsWith("data:image/png;base64,"),
        "icon",
      );
      assert(
        PER_ITEM_SOUND_IDS_V2174.has("item_kamek") &&
          PER_ITEM_SOUND_IDS_V2174.has("item_item_box"),
        "new sound slots",
      );
      for (const g of state.groups) {
        g.score = 20;
        g.displayScore = 20;
        g.inventory = [];
        g.itemEffect = null;
        g.competitionEffects = {};
        g.booShield = 0;
        g.booRoundsLeftV218 = 0;
        g.itemUsedThisRound = false;
      }
      state.roundActive = false;
      state.evaluated = true;
      const actor = state.groups[5];
      actor.inventory = [ItemModules.inventory("kamek")];
      const random = Math.random;
      Math.random = () => 0.99;
      try {
        assert(useItem(actor.id, 0), "kamek accepted");
        await classroomCommands.whenIdle();
      } finally {
        Math.random = random;
      }
      const affected = state.groups.filter(
        (g) => Object.keys(g.competitionEffects).length,
      );
      assert(
        affected.length === 3 && !affected.includes(actor),
        "three distinct others",
      );
      assert(
        affected.every((g) => CompetitionEffects.has(g, "dizziness")),
        "negative pool",
      );
      const saved = JSON.parse(localStorage.getItem(Reliability.stateKey));
      assert(
        saved.groups.some((g) => g.competitionEffects?.dizziness),
        "persist statuses",
      );
      return {
        name: "catalog-midfield-kamek-persistence",
        affected: affected.map((g) => g.id),
      };
    }),
  );
  await setup(page, 6);
  results.push(
    await page.evaluate(async () => {
      const assert = (ok, msg) => {
        if (!ok) throw Error(msg);
      };
      for (const g of state.groups) {
        g.score = 20;
        g.displayScore = 20;
        g.inventory = [];
        g.itemEffect = null;
        g.competitionEffects = {};
        g.booShield = 0;
        g.booRoundsLeftV218 = 0;
        g.itemUsedThisRound = false;
      }
      state.roundActive = false;
      state.evaluated = true;
      const actor = state.groups[0],
        victim = state.groups[1];
      actor.inventory = [ItemModules.inventory("fire_flower")];
      victim.itemEffect = { type: "star", hitsLeft: 3 };
      const random = Math.random;
      Math.random = () => 0;
      try {
        assert(useItem(actor.id, 0), "fire");
        await classroomCommands.whenIdle();
        assert(
          !CompetitionEffects.has(victim, "burn") &&
            victim.itemEffect.hitsLeft === 2,
          "blocked no burn",
        );
        victim.itemEffect = null;
        assert(useItem(actor.id, 0), "fire2");
        await classroomCommands.whenIdle();
        assert(
          victim.score === 15 && CompetitionEffects.has(victim, "burn"),
          "hit burn",
        );
      } finally {
        Math.random = random;
      }
      actor.inventory = [ItemModules.inventory("coin")];
      CompetitionEffects.apply(actor, "freeze");
      const score = actor.score;
      assert(useItem(actor.id, 0), "freeze cancel command");
      await classroomCommands.whenIdle();
      assert(
        actor.score === score &&
          actor.inventory[0].key === "coin" &&
          !CompetitionEffects.has(actor, "freeze"),
        "freeze no consume",
      );
      state.roundActive = true;
      state.evaluated = false;
      CompetitionEffects.apply(actor, "paralysis");
      assert(
        AnswerCommands.toggleAllIn(actor.id) === false && !actor.allIn,
        "allin denied",
      );
      state.correctAns = "A";
      actor.selectedOpt = "A";
      victim.selectedOpt = "";
      actor.score = 10;
      CompetitionEffects.apply(actor, "poison");
      Math.random = () => 0;
      try {
        const result = RoundSettlement.execute();
        assert(result && actor.score === 8, "paralysis then poison");
        assert(
          victim.competitionEffects.burn.remaining === 2,
          "unanswered no tick",
        );
      } finally {
        Math.random = random;
      }
      return { name: "defense-fire-freeze-allin-round", score: actor.score };
    }),
  );
  await setup(page, 6);
  results.push(
    await page.evaluate(async () => {
      const assert = (ok, msg) => {
        if (!ok) throw Error(msg);
      };
      for (const g of state.groups) {
        g.score = 20;
        g.displayScore = 20;
        g.inventory = [];
        g.itemEffect = null;
        g.competitionEffects = {};
        g.booShield = 0;
        g.itemUsedThisRound = false;
      }
      state.roundActive = false;
      state.evaluated = true;
      const actor = state.groups[2];
      actor.inventory = [ItemModules.inventory("item_box")];
      state.groups[0].score = -1;
      state.groups[1].inventory = ["coin", "green", "banana"].map((k) =>
        ItemModules.inventory(k),
      );
      const commits = [];
      const listener = (e) => commits.push(e.detail);
      window.addEventListener("godpower:domain-commit", listener);
      assert(useItem(actor.id, 0), "box");
      const result = await classroomCommands.whenIdle();
      window.removeEventListener("godpower:domain-commit", listener);
      assert(result.ok, "box commit");
      assert(
        state.groups[0].inventory.length === 0 &&
          state.groups[1].inventory.length === 3,
        "skip negative/full",
      );
      assert(actor.inventory.length === 1, "caster freed slot");
      assert(commits.length === 1, "single commit");
      const events = commits[0].events.filter(
        (e) => e.type === "ITEM_ACQUIRED",
      );
      assert(events.length === 4, "4 acquisition facts");
      assert(
        events.every((e) =>
          state.achievementLedger.groups[
            e.aggregate.id
          ]?.itemDiscovery.includes(e.payload.itemKey),
        ),
        "discovery",
      );
      return { name: "box-atomic-distribution", events: events.length };
    }),
  );
  await setup(page, 4);
  results.push(
    await page.evaluate(async () => {
      const assert = (ok, msg) => {
        if (!ok) throw Error(msg);
      };
      const actor = state.groups[0];
      for (const g of state.groups) {
        g.score = 20;
        g.inventory = [];
        g.itemEffect = null;
        g.competitionEffects = {};
        g.booShield = 0;
        g.itemUsedThisRound = false;
      }
      state.roundActive = false;
      state.evaluated = true;
      actor.inventory = [ItemModules.inventory("item_box")];
      saveState();
      const fingerprint = () => {
        const b = buildClassroomBackup();
        delete b.timestamp;
        return JSON.stringify(b);
      };
      const before = fingerprint(),
        historyBefore = JSON.stringify(historyStack);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === Reliability.stateKey)
          throw new DOMException("full", "QuotaExceededError");
        return set.call(this, k, v);
      };
      try {
        useItem(actor.id, 0);
        await classroomCommands.whenIdle();
      } finally {
        Storage.prototype.setItem = set;
      }
      assert(fingerprint() === before, "failure restores box groups ledger");
      assert(
        JSON.stringify(historyStack) === historyBefore,
        "failure restores history",
      );
      return { name: "box-quota-rollback" };
    }),
  );
  await setup(page, 6);
  results.push(
    await page.evaluate(async () => {
      const g = state.groups[0];
      state.roundActive = false;
      state.evaluated = true;
      g.score = 100;
      g.itemEffect = null;
      g.booShield = 0;
      g.booRoundsLeftV218 = 0;
      g.inventory = [
        ItemModules.inventory("green"),
        ItemModules.inventory("coin"),
      ];
      CompetitionEffects.apply(g, "dizziness");
      const random = Math.random;
      Math.random = () => 0;
      try {
        useItem(g.id, 0);
        await classroomCommands.whenIdle();
      } finally {
        Math.random = random;
      }
      if (
        g.score !== 75 ||
        g.inventory.length !== 1 ||
        g.inventory[0].key !== "coin" ||
        g.competitionEffects.dizziness.remaining !== 1
      )
        throw Error("dizziness self hit consumed wrong inventory");
      return { name: "dizziness-self-hit-single-consumption" };
    }),
  );
  await setup(page, 6);
  results.push(
    await page.evaluate(async () => {
      const assert = (ok, msg) => {
        if (!ok) throw Error(msg);
      };
      for (const g of state.groups) {
        g.score = 20;
        g.displayScore = 20;
        g.inventory = [];
        g.itemEffect = null;
        g.competitionEffects = {};
        g.booShield = 0;
        g.booRoundsLeftV218 = 0;
        g.itemUsedThisRound = false;
      }
      state.roundActive = false;
      state.evaluated = true;
      let actor = state.groups[2];
      actor.inventory = [ItemModules.inventory("boomerang_flower")];
      const before = JSON.parse(JSON.stringify(state.groups));
      assert(useItem(actor.id, 0), "boomerang");
      await classroomCommands.whenIdle();
      const hits = state.groups.filter((g) =>
        CompetitionEffects.has(g, "dizziness"),
      );
      assert(
        hits.length === 2 && hits.every((g) => g.score === 16),
        "boomerang one fifth once",
      );
      await undoLast();
      assert(
        state.groups.every(
          (g, i) =>
            g.score === before[i].score &&
            !CompetitionEffects.has(g, "dizziness"),
        ),
        "undo statuses",
      );
      actor = state.groups[2];
      for (const type of ["star", "mega"])
        for (const allIn of [true, false])
          for (const correct of [true, false]) {
            actor.score = 20;
            actor.itemEffect = { type, hitsLeft: 3 };
            actor.competitionEffects = {};
            actor.selectedOpt = correct ? "A" : "B";
            actor.allIn = allIn;
            state.roundActive = true;
            state.evaluated = false;
            state.correctAns = "A";
            RoundSettlement.execute();
            assert(
              actor.score === (correct ? (allIn ? 60 : 40) : 20),
              "20 ->40/60/20 " + type + allIn + correct,
            );
            assert(
              actor.itemEffect.hitsLeft === 3,
              "answers do not consume defense",
            );
          }
      actor.itemEffect = { type: "mega", hitsLeft: 1 };
      actor.inventory = [ItemModules.inventory("mega")];
      tryDefend(actor, "green");
      assert(
        !CompetitionEffects.has(actor, "mega") && !actor.inventory.length,
        "last hit expires both",
      );
      actor.inventory = [
        ItemModules.inventory("kamek"),
        ItemModules.inventory("item_box"),
      ];
      CompetitionEffects.apply(actor, "poison");
      saveState();
      return {
        name: "boomerang-undo-positive-rules-expiry",
        reloadId: actor.id,
      };
    }),
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.classroomReady);
  const reload = await page.evaluate(() => {
    const g = state.groups.find((g) =>
      g.inventory?.some((i) => i.key === "kamek"),
    );
    return {
      items: g?.inventory.map((i) => i.key),
      poison: CompetitionEffects.has(g, "poison"),
    };
  });
  assert.deepEqual(reload, { items: ["kamek", "item_box"], poison: true });
  results.push({ name: "real-reload-preserves-new-items-and-status" });
  assert.deepEqual(errors, []);
  await writeFile(
    root + "/results.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
  server.close();
}
