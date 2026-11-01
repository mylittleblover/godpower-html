import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { parse } from "acorn";

const source = readFileSync("src/runtime/items/draw-flow.js", "utf8");
const declaration = parse(source, { ecmaVersion: "latest" }).body.find(
  (node) =>
    node.type === "FunctionDeclaration" && node.id.name === "globalItemDraw",
);
const drawSource = source.slice(declaration.start, declaration.end);
const copy = (value) => JSON.parse(JSON.stringify(value));
const flush = () => new Promise((resolve) => setImmediate(resolve));
function fixture({
  failSave = false,
  asyncSave = false,
  failGroup = null,
} = {}) {
  let now = 0,
    active = false,
    attempts = 0,
    writes = 0,
    commandId = 0,
    itemId = 0;
  let resolveSave;
  const frames = [],
    timers = [],
    published = [],
    errors = [];
  const classes = () => {
    const values = new Set();
    return {
      add: (...items) => items.forEach((item) => values.add(item)),
      remove: (...items) => items.forEach((item) => values.delete(item)),
      contains: (item) => item === "active" || values.has(item),
    };
  };
  const cards = new Map();
  for (const id of [1, 2])
    cards.set(id, {
      classList: classes(),
      children: [],
      appendChild(node) {
        node.parentElement = this;
        this.children.push(node);
      },
      querySelector() {
        return this.children[0] ?? null;
      },
    });
  const scope = vm.createContext({
    console,
    Date,
    performance: { now: () => now },
    state: {
      seasonId: "season-test",
      groups: [1, 2].map((id) => ({
        id,
        groupUid: `group-${id}`,
        name: `Group ${id}`,
        score: 100,
        inventory: [],
        itemStats: { draws: 0 },
      })),
      itemGlobal: {
        totalDraws: 0,
        drawSessionThrottleV21710: {
          sessionNo: 0,
          nextEligibleSession: { lightning: 0, blooper: 0 },
        },
      },
    },
    historyStack: [],
    itemDrawBusy: false,
    activeGlobalItemDraw: null,
    activeDrawSessionV21710: null,
    v213SuppressReorderAnimation: false,
    v213SkipNextReorderAnimation: false,
    ITEM_DRAW_DURATION_V21712: 1500,
    ITEM_DRAW_RESULT_HOLD_V21712: 900,
    ITEM_DRAW_FADE_V21712: 620,
    document: {
      getElementById: () => ({ classList: classes() }),
      querySelector: (selector) =>
        cards.get(Number(selector.match(/"(\d+)"/)?.[1])) ?? null,
      createElement: () => ({
        classList: classes(),
        querySelector: () => ({ textContent: "" }),
        remove() {
          const parent = this.parentElement;
          if (parent)
            parent.children = parent.children.filter((node) => node !== this);
          this.parentElement = null;
        },
      }),
    },
    requestAnimationFrame: (callback) => {
      frames.push(callback);
      return frames.length;
    },
    setTimeout: (callback, delay) => {
      timers.push({ callback, at: now + delay });
      return timers.length;
    },
    ensureV2State() {},
    eligibleForItems: (group) => group.score >= 0,
    switchView() {},
    renderGrid() {},
    renderAll() {},
    showToast() {},
    startDrawSoundBedV2164() {},
    stopActiveDrawAudioV2171() {},
    DesktopUI: { visualEvent() {} },
    BattleMotion: { trackDraw() {}, releaseDraw() {}, fadeDraw() {} },
    roulettePreviewPickV282: () => "coin",
    updateCardRouletteVisual() {},
    pickItemForGroupV281: (group) => {
      scope.state.itemGlobal.drawSessionThrottleV21710.nextEligibleSession.lightning = 6;
      return "coin";
    },
    addItemToGroup(group, key) {
      if (group.id === failGroup) throw new Error("injected award failure");
      group.inventory.push({ key, itemInstanceId: `item-${++itemId}` });
      group.itemStats.draws++;
      scope.state.itemGlobal.totalDraws++;
      return true;
    },
  });
  for (const file of [
    "src/domain/values.js",
    "src/domain/identity.js",
    "src/domain/events.js",
    "src/domain/achievements/learning-rules.js",
    "src/domain/achievements/ledger.js",
    "src/application/command-lifecycle.js",
  ])
    vm.runInContext(readFileSync(file, "utf8"), scope);
  scope.state.achievementLedger = vm.runInContext(
    "AchievementLedger.empty()",
    scope,
  );
  const ledger = vm.runInContext("AchievementLedger", scope);
  const events = vm.runInContext("DomainEvents", scope);
  const controller = vm.runInContext("CommandLifecycle", scope).create({
    active: () => active,
    setActive: (value) => {
      active = value;
    },
    commandId: () => `draw-${++commandId}`,
    createEventScope: (options) => events.createScope(options),
    invalidate: () => controller.cancel("superseded"),
    snapshot: () => ({
      state: copy(scope.state),
      history: copy(scope.historyStack),
    }),
    restore(before) {
      for (const key of Object.keys(scope.state)) delete scope.state[key];
      Object.assign(scope.state, copy(before.state));
      scope.historyStack = copy(before.history);
    },
    record: (description) => scope.recordHistory(description),
    validate() {},
    persist: (transaction) => scope.saveState(transaction),
    render() {},
    committed: (transaction) => published.push(copy(transaction)),
    result() {},
    warning() {},
    error: (error) => errors.push(error.message),
  });
  scope.classroomCommands = controller;
  scope.runClassroomCommand = (...args) => controller.run(...args);
  scope.recordHistory = (description) =>
    scope.historyStack.push({ description, snapshot: copy(scope.state) });
  scope.saveState = (transaction) => {
    if (active || controller.isPending()) return { ok: true, deferred: true };
    attempts++;
    if (transaction?.events?.length)
      scope.state.achievementLedger = ledger.apply(
        scope.state.achievementLedger,
        transaction.events,
        { seasonId: scope.state.seasonId },
      ).ledger;
    const complete = () => {
      if (failSave) return { ok: false, error: "quota" };
      writes++;
      return { ok: true, eventsPersisted: true };
    };
    if (!asyncSave) return complete();
    return new Promise((resolve) => {
      resolveSave = () => resolve(complete());
    });
  };
  scope.beginDrawSessionV21710 = () => {
    const no = ++scope.state.itemGlobal.drawSessionThrottleV21710.sessionNo;
    scope.activeDrawSessionV21710 = {
      no,
      kind: "global",
      selectedGlobalUnique: new Set(),
    };
    scope.saveState();
  };
  vm.runInContext(drawSource, scope);
  return {
    scope,
    controller,
    ledger,
    published,
    errors,
    before: copy(scope.state),
    get attempts() {
      return attempts;
    },
    get writes() {
      return writes;
    },
    draw: () => scope.globalItemDraw(),
    async frame(at = 1500) {
      now = at;
      const callbacks = frames.splice(0);
      assert.ok(callbacks.length, "draw must schedule a frame");
      for (const callback of callbacks) callback(at);
      await flush();
      return callbacks[0];
    },
    async timers(at = 4000) {
      now = at;
      for (let count = 0; count < 10; count++) {
        const index = timers.findIndex((timer) => timer.at <= now);
        if (index < 0) break;
        timers.splice(index, 1)[0].callback();
      }
      await flush();
    },
    async acknowledge() {
      assert.ok(resolveSave);
      resolveSave();
      await flush();
    },
    overlays: () =>
      [...cards.values()].reduce((sum, card) => sum + card.children.length, 0),
  };
}

test("global draw holds one pending command and does not persist the animation session early", () => {
  const f = fixture();
  f.draw();
  assert.equal(f.controller.isPending(), true);
  assert.equal(f.attempts, 0);
  assert.equal(f.scope.historyStack.length, 1);
  f.draw();
  assert.equal(f.scope.historyStack.length, 1);
});
test("one commit awards each item once and publishes idempotent acquisition events", async () => {
  const f = fixture();
  f.draw();
  const frame = await f.frame();
  assert.equal(f.attempts, 1);
  assert.equal(f.writes, 1);
  assert.equal(f.published.length, 1);
  assert.equal(f.scope.state.itemGlobal.totalDraws, 2);
  const emitted = f.published[0].events;
  assert.equal(emitted.length, 2);
  assert.ok(
    emitted.every(
      (event) =>
        event.type === "ITEM_ACQUIRED" &&
        event.payload.source === "global-draw",
    ),
  );
  assert.equal(new Set(emitted.map((event) => event.eventId)).size, 2);
  const savedLedger = copy(f.scope.state.achievementLedger);
  assert.deepEqual(
    copy(
      f.ledger.apply(savedLedger, emitted, { seasonId: f.scope.state.seasonId })
        .ledger,
    ),
    savedLedger,
  );
  frame(1500);
  await flush();
  assert.equal(f.attempts, 1);
  assert.equal(f.scope.state.itemGlobal.totalDraws, 2);
});
test("storage rejection restores inventory, cooldowns, counters, ledger and history together", async () => {
  const f = fixture({ failSave: true });
  f.draw();
  await f.frame();
  assert.deepEqual(copy(f.scope.state), f.before);
  assert.equal(f.scope.historyStack.length, 0);
  assert.equal(f.published.length, 0);
  assert.equal(f.scope.itemDrawBusy, false);
  assert.equal(f.overlays(), 0);
  assert.equal(f.scope.activeDrawSessionV21710, null);
});
test("mid-batch award failure rolls back the first award without a partial save", async () => {
  const f = fixture({ failGroup: 2 });
  f.draw();
  await f.frame();
  assert.deepEqual(copy(f.scope.state), f.before);
  assert.equal(f.attempts, 0);
  assert.equal(f.scope.itemDrawBusy, false);
  assert.equal(f.overlays(), 0);
});
test("cancelled old frames cannot award or release the replacement owner", async () => {
  const f = fixture();
  f.draw();
  const old = await f.frame(100);
  f.controller.cancel("undo");
  await flush();
  assert.deepEqual(copy(f.scope.state), f.before);
  f.draw();
  old(1500);
  await flush();
  assert.equal(f.scope.itemDrawBusy, true);
  assert.equal(f.scope.state.itemGlobal.totalDraws, 0);
  await f.frame(1600);
  assert.equal(f.scope.state.itemGlobal.totalDraws, 2);
  assert.equal(f.published.length, 1);
});
test("asynchronous save remains busy until its durable acknowledgment", async () => {
  const f = fixture({ asyncSave: true });
  f.draw();
  await f.frame();
  assert.equal(f.controller.isCommitting(), true);
  assert.equal(f.scope.itemDrawBusy, true);
  assert.equal(f.published.length, 0);
  f.draw();
  assert.equal(f.attempts, 1);
  await f.acknowledge();
  assert.equal(f.published.length, 1);
});
test("asynchronous save rejection rolls back and releases this draw", async () => {
  const f = fixture({ asyncSave: true, failSave: true });
  f.draw();
  await f.frame();
  await f.acknowledge();
  assert.deepEqual(copy(f.scope.state), f.before);
  assert.equal(f.scope.itemDrawBusy, false);
  assert.equal(f.overlays(), 0);
});

test("global draw cannot replace an in-progress hand reward draw session", () => {
  const f = fixture();
  f.scope.handItemDrawTimer = { raf: true };
  assert.equal(f.draw(), false);
  assert.deepEqual(copy(f.scope.state), f.before);
  assert.equal(f.attempts, 0);
});

test("presentation failure after commit preserves awards and releases the draw owner", async () => {
  const f = fixture();
  f.scope.renderGrid = () => {
    if (f.writes) throw Error("injected presentation failure");
  };
  f.draw();
  await f.frame();
  assert.equal(f.writes, 1);
  assert.equal(f.published.length, 1);
  assert.equal(f.scope.state.itemGlobal.totalDraws, 2);
  assert.equal(f.scope.itemDrawBusy, false);
  assert.equal(f.overlays(), 0);
});
