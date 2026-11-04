import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const read = (name) => readFileSync(`src/ui/${name}`, "utf8");
function load(name, binding, extra = {}) {
  const context = vm.createContext({ console, ...extra });
  return vm.runInContext(`${read(name)}\n${binding}`, context);
}
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");

test("battle presenter preserves answer, score, queue and All In markup without mutation", () => {
  const view = load("battle-card-view.js", "GodPowerBattleCardView");
  const group = Object.freeze({
    id: 7,
    name: '<组&"名>',
    color: "#eeeeee",
    score: -1234567,
    displayScore: 120,
    selectedOpt: "B",
    allIn: true,
    inventory: Object.freeze([Object.freeze({ key: "coin", charges: 3 })]),
  });
  const ports = {
    badge: { foreground: "#000000" },
    escapeHtml,
    itemVisual: () => '<img alt="金币">',
    itemName: () => "金币",
    groupNumber: () => "07",
  };
  const context = Object.freeze({
    roundActive: true,
    evaluated: false,
    correctAns: "B",
    isLocked: false,
    editingScoreId: null,
    sortLabel: "编号",
  });
  const result = view.render(group, context, ports);
  assert.match(result, /score-capsule/);
  assert.match(result, /style="color:#000000;--score-capsule-bg:#eeeeee"/);
  assert.match(result, />120分<\/span>/);
  assert.match(result, /opt-btn active/);
  assert.match(result, /queue-main-slot/);
  assert.match(result, /charges">3/);
  assert.match(result, /allin-toggle-btn active/);
  assert.match(result, /&lt;组&amp;&quot;名>/);
  assert.equal((result.match(/queue-secondary-slot empty/g) || []).length, 2);
  const settled = view.render(group, { ...context, evaluated: true }, ports);
  assert.match(settled, /active flip-reveal correct/);
  assert.equal((settled.match(/ disabled/g) || []).length, 5);
  const editing = view.render(group, { ...context, editingScoreId: 7 }, ports);
  assert.match(editing, /id="input-score-7" value="-1234567"/);
  assert.doesNotMatch(editing, /id="score-val-7"/);
  const locked = view.render(
    { ...group, displayScore: undefined },
    { ...context, isLocked: true },
    ports,
  );
  assert.doesNotMatch(locked, /row-score editable/);
  assert.match(locked, />-1234567分/);
});

test("window motion finishes exactly once, cancellation never invokes close command", async () => {
  const animations = [];
  const factory = load("window-motion.js", "GodPowerWindowMotion", {
    getComputedStyle: () => ({ opacity: "1", translate: "none", scale: "1" }),
  });
  const controller = factory.create({
    canAnimate: () => true,
    motionEase: () => "linear",
    getPreferences: () => ({ pageMotion: true, motion: "full", speed: 1 }),
    animate: () => {
      let resolve;
      const animation = {
        finished: new Promise((r) => (resolve = r)),
        cancel() {},
        resolve: () => resolve(),
      };
      animations.push(animation);
      return animation;
    },
  });
  const root = {
    inert: false,
    dataset: {},
    tagName: "DIV",
    getClientRects: () => [1],
    querySelector: () => ({ getAnimations: () => [] }),
  };
  let closes = 0;
  controller.dismissWindow(root, () => closes++);
  controller.dismissWindow(root, () => closes++);
  assert.equal(controller.count(), 1);
  assert.equal(animations.length, 2);
  controller.cancelWindowClose(root);
  animations[0].resolve();
  await new Promise((r) => setImmediate(r));
  assert.equal(closes, 0);
  assert.equal(root.inert, false);
  controller.dismissWindow(root, () => closes++);
  animations[2].resolve();
  await new Promise((r) => setImmediate(r));
  controller.finishWindowClose(root);
  assert.equal(closes, 1);
  assert.equal(controller.count(), 0);
  controller.dismissWindow(root, () => closes++);
  controller.dispose();
  assert.equal(root.inert, false);
  assert.equal(controller.count(), 0);
  assert.equal(closes, 1);
});

test("settings categories preserve current entries, About and retirement backup route with immutable metadata", () => {
  const layout = load("settings-layout.js", "GodPowerSettingsLayout");
  assert.equal(
    Array.from(layout.categories, (row) => row[0]).join(","),
    "rules,appearance,motion,sound,items,students,welcome,data,about",
  );
  assert.equal(Object.isFrozen(layout.categories), true);
  assert.equal(Object.isFrozen(layout.categories[0]), true);
  assert.doesNotMatch(
    read("settings-layout.js"),
    /localStorage|state\.|themeConfirm|addEventListener/,
  );
});

test("CSS component split retains original cascade content and source order", () => {
  const merged = [
    "desktop.css",
    "roster-workspace.css",
    "teaching-workspace.css",
  ]
    .map((name) =>
      execFileSync("git", ["show", "d18ce58:src/ui/" + name], {
        encoding: "utf8",
      }),
    )
    .join("\n")
    .replace(/\s+/g, " ")
    .trim();
  const actual = createHash("sha256").update(merged).digest("hex");
  assert.equal(
    actual,
    "21f7c47af52ca601e92c423480ecfd008e9b6381e6bab16df7ec57911c0b06e6",
  );
  const template = readFileSync("src/index.template.html", "utf8");
  const positions = [
    "styles/components/desktop-shell.css",
    "styles/classroom/roster-workspace.css",
  ].map((x) => template.indexOf(`@@SOURCE:${x}@@`));
  assert.ok(positions.every((x) => x > 0));
  assert.ok(positions[0] < positions[1]);
  // Historical split hash above is immutable. The approved timetable UI retirement
  // retains its receipt and shared model/repository, rather than phantom CSS.
  assert.ok(!template.includes("@@SOURCE:styles/teaching/workspace.css@@"));
  const retirements = JSON.parse(
    readFileSync("src/source-retirements.json", "utf8"),
  );
  assert.ok(retirements["styles/teaching/workspace.css"]);
});

test("disclosure setup is idempotent and disposal releases listener and active animation", () => {
  const callbacks = new Set();
  const document = {
    addEventListener(type, callback) {
      callbacks.add(callback);
    },
    removeEventListener(type, callback) {
      callbacks.delete(callback);
    },
  };
  const context = vm.createContext({ document, AbortController, console });
  vm.runInContext(read("disposable-scope.js"), context);
  const factory = vm.runInContext(
    `${read("disclosure-motion.js")}\nGodPowerDisclosureMotion`,
    context,
  );
  let canceled = 0;
  const controller = factory.create({
    canAnimate: () => true,
    getPreferences: () => ({ motion: "full", speed: 1 }),
    animate: () => ({
      cancel() {
        canceled++;
      },
      finished: new Promise(() => {}),
    }),
  });
  controller.setupDisclosures();
  controller.setupDisclosures();
  assert.equal(callbacks.size, 1);
  const details = {
    tagName: "DETAILS",
    open: false,
    style: { overflow: "visible" },
    classList: { contains: () => false },
    getBoundingClientRect() {
      return { height: this.open ? 200 : 40 };
    },
  };
  const summary = { parentElement: details };
  let prevented = false;
  [...callbacks][0]({
    target: {
      closest: (selector) => (selector === "summary" ? summary : null),
    },
    preventDefault() {
      prevented = true;
    },
  });
  assert.equal(prevented, true);
  assert.equal(controller.count(), 1);
  controller.dispose();
  assert.equal(callbacks.size, 0);
  assert.equal(canceled, 1);
  assert.equal(details.open, true);
  assert.equal(details.style.overflow, "visible");
  assert.equal(controller.count(), 0);
  controller.setupDisclosures();
  assert.equal(callbacks.size, 1);
  controller.dispose();
});
