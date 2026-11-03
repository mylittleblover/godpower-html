import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const template = readFileSync("src/index.template.html", "utf8");
const host = readFileSync("src/ui/electron-host.js", "utf8");
const shared = (await import("node:fs")).existsSync(
  "src/runtime/classroom/hand-session.js",
)
  ? readFileSync("src/runtime/classroom/hand-session.js", "utf8")
  : "";
const port = readFileSync("src/application/hand-raise-port.js", "utf8");
const reward = readFileSync(
  "src/runtime/items/hand-reward-lifecycle.js",
  "utf8",
);

test("hand port loads before the desktop transport that uses it", () => {
  const portAt = template.indexOf("@@SOURCE:application/hand-raise-port.js@@");
  const hostAt = template.indexOf("@@SOURCE:ui/electron-host.js@@");
  assert.ok(portAt > 0, "hand port must be inlined");
  assert.ok(hostAt > portAt, "desktop transport must run after the hand port");
});

test("the main renderer keeps classroom ownership; transport only forwards", () => {
  assert.match(host, /const hand = globalThis.ClassroomHandSession/);
  assert.match(shared, /HandRaisePort.create\(/);
  assert.match(shared, /runClassroomCommand\(label, operation, options\)/);
  assert.match(shared, /classroomCommands\.whenIdle\(\)/);
  assert.match(shared, /drawHandRewardForPort/);
  assert.doesNotMatch(host, /group\.score\s*[-+*/]?=/);
  assert.doesNotMatch(host, /localStorage|indexedDB/);
});

test("reward draws stay inside one classroom transaction", () => {
  assert.doesNotMatch(port, /saveState\(|renderAll\(|localStorage/);
  assert.match(port, /retainOnPersistenceFailure: false/);
  assert.match(reward, /function drawHandRewardForPort/);
  assert.match(reward, /beginDrawSessionV21710\("hand"\)/);
  assert.match(reward, /ITEM_ACQUIRED/);
  assert.match(reward, /source: "hand-raise-reward"/);
});

test("desktop hand commands are forwarded instead of dropped", () => {
  for (const action of ["handSelect", "handJudge", "handScore", "handDraw"])
    assert.match(host, new RegExp(`"${action}"`));
  assert.match(host, /desktop\.reply\(\{ id, result \}\)/);
});
