import { parse } from "acorn";
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const copy = (v) => JSON.parse(JSON.stringify(v));
function load(source) {
  const state = {
    groups: [
      {
        id: 1,
        score: 12.7,
        displayScore: 11,
        inventory: [{ key: "coin", charges: 1 }],
      },
    ],
    picker: { mode: "individual" },
    itemGlobal: { totalDraws: 3 },
    lastRoundAllIn: { groups: [1] },
    achievementLedger: { schemaVersion: 1, groups: {} },
    rosterSnapshot: { revision: 2, students: [] },
    seasonId: "season-test",
    masterVolume: 0.5,
  };
  const ctx = vm.createContext({
    state,
    historyStack: [{ groups: copy(state.groups) }],
    clone: copy,
    window: { classroomReady: false },
    Reliability: { schemaVersion: 2 },
    AchievementLedger: { normalize: copy },
    firstHandDrawPendingV218: false,
    Date: class {
      toISOString() {
        return "2026-11-04T00:00:00Z";
      }
    },
  });
  vm.runInContext(
    readFileSync("src/runtime/storage/classroom-save.js", "utf8").split(
      "function saveState",
    )[0],
    ctx,
  );
  vm.runInContext(source.split("function applyClassroomBackup")[0], ctx);
  return ctx;
}
test("command snapshot shares only owned baseline data, preserving legacy backup bytes", () => {
  const source = readFileSync(
      "src/application/legacy-classroom-adapter.js",
      "utf8",
    ),
    current = load(source),
    previous = load(
      execFileSync(
        "git",
        ["show", "6d45f66:src/application/legacy-classroom-adapter.js"],
        { encoding: "utf8" },
      ),
    );
  assert.equal(typeof current.captureClassroomCommandSnapshot, "function");
  const baseline = current.captureClassroomCommandSnapshot();
  assert.equal(
    JSON.stringify(baseline.backup),
    JSON.stringify(previous.buildClassroomBackup()),
  );
  assert.equal(baseline.backup.history, baseline.history);
  assert.equal(
    baseline.backup.groups[0].inventory,
    baseline.state.groups[0].inventory,
  );
  current.state.groups[0].inventory[0].charges = 99;
  current.historyStack.push({ groups: [] });
  current.state.lastRoundAllIn.groups.push(2);
  assert.equal(baseline.backup.groups[0].inventory[0].charges, 1);
  assert.equal(baseline.backup.history.length, 1);
  assert.deepEqual(
    JSON.parse(JSON.stringify(baseline.backup.round.lastRoundAllIn.groups)),
    [1],
  );
  assert.equal(baseline.identity, current.state);
});

test("private command capture serializes fewer bytes without reducing history", () => {
  const oldSource = execFileSync(
    "git",
    ["show", "6d45f66:src/application/legacy-classroom-adapter.js"],
    { encoding: "utf8" },
  );
  const tree = parse(oldSource, { ecmaVersion: "latest" });
  const declaration = tree.body
    .find(
      (n) =>
        n.type === "VariableDeclaration" &&
        n.declarations.some((d) => d.id.name === "classroomCommands"),
    )
    .declarations.find((d) => d.id.name === "classroomCommands");
  const snapshot = declaration.init.arguments[0].properties.find(
    (p) => p.key.name === "snapshot",
  ).value;
  const current = load(
      readFileSync("src/application/legacy-classroom-adapter.js", "utf8"),
    ),
    previous = load(oldSource);
  function measure(ctx, expression) {
    ctx.state.groups = Array.from({ length: 14 }, (_, i) => ({
      ...copy(ctx.state.groups[0]),
      id: i + 1,
      members: Array.from({ length: 4 }, (_, j) => "测试学生" + (i * 4 + j)),
    }));
    ctx.historyStack = Array.from({ length: 40 }, () => ({
      groups: copy(ctx.state.groups),
    }));
    let bytes = 0;
    ctx.clone = (v) => {
      const s = JSON.stringify(v);
      bytes += Buffer.byteLength(s);
      return JSON.parse(s);
    };
    const result = vm.runInContext(expression, ctx);
    return { bytes, history: result.backup.history.length };
  }
  const before = measure(
      previous,
      "(" + oldSource.slice(snapshot.start, snapshot.end) + ")()",
    ),
    after = measure(current, "captureClassroomCommandSnapshot()");
  assert.equal(before.history, 40);
  assert.equal(after.history, 40);
  assert.ok(
    after.bytes < before.bytes * 0.7,
    JSON.stringify({ before, after }),
  );
});
