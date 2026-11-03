import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
function setup() {
  const context = vm.createContext({});
  vm.runInContext(
    fs.readFileSync("src/application/hand-flow.js", "utf8"),
    context,
  );
  vm.runInContext(
    fs.readFileSync("src/application/hand-raise-port.js", "utf8"),
    context,
  );
  let data = {
      seasonId: "s1",
      isLocked: false,
      groups: [
        {
          id: 1,
          groupUid: "g1",
          name: "一组",
          score: 20,
          inventory: [],
          itemStats: { correct: 0, wrong: 0 },
        },
      ],
      itemGlobal: { handRaiseTotal: 0, handRaiseHistory: [] },
    },
    completion = { ok: true, persisted: true },
    fail = false;
  const events = [];
  let serial = 0;
  let saveContext = { saveId: "save-A", generation: 1, revision: 1 };
  const host = {
    context: () => ({ ...saveContext }),
    getState: () => data,
    busy: () => false,
    id: () => `hand-${++serial}`,
    enabled: () => true,
    eligible: (g) => g.score >= 0,
    run: (_label, fn) => {
      const before = structuredClone(data);
      if (fn({ emit: (...v) => events.push(v) }) === false) {
        data = before;
        return false;
      }
      if (fail) {
        data = before;
        completion = { ok: false, persisted: false };
      } else completion = { ok: true, persisted: true };
      return true;
    },
    whenIdle: async () => completion,
    planScore: (g, delta) => ({ after: g.score + delta }),
    draw: (g, c) => {
      g.inventory.push({ key: "coin" });
      c.emit("ITEM_ACQUIRED");
      return { name: "金币" };
    },
    captureRuntime: () => null,
    restoreRuntime() {},
    feedback() {},
  };
  const port = context.HandRaisePort.create(host);
  return {
    port,
    events,
    host,
    get data() {
      return data;
    },
    setContext: (v) => (saveContext = v),
    setFail: (v) => (fail = v),
  };
}
test("selection token gates judgment, rewards and group/season changes", async () => {
  const h = setup();
  await h.port.command("handSelect", { groupId: 1 });
  const token = h.port.getSnapshot().selectionId;
  assert.equal(
    (
      await h.port.command("handScore", {
        groupId: 1,
        selectionId: token,
        delta: 2,
      })
    ).ok,
    false,
  );
  assert.equal(
    (
      await h.port.command("handJudge", {
        groupId: 1,
        selectionId: token,
        correct: true,
      })
    ).ok,
    true,
  );
  await h.port.command("handScore", {
    groupId: 1,
    selectionId: token,
    delta: 2,
  });
  assert.equal(h.data.groups[0].score, 22);
  const refused = await h.port.command("handDraw", {
    groupId: 1,
    selectionId: token,
  });
  assert.equal(refused.error, "REWARD_ALREADY_GIVEN");
  await h.port.command("handSelect", { groupId: 1 });
  const nextToken = h.port.getSnapshot().selectionId;
  await h.port.command("handJudge", {
    groupId: 1,
    selectionId: nextToken,
    correct: true,
  });
  await h.port.command("handDraw", { groupId: 1, selectionId: nextToken });
  assert.equal(h.data.groups[0].inventory.length, 1);
  assert.equal(
    (await h.port.command("handDraw", { groupId: 1, selectionId: token })).ok,
    false,
  );
  h.data.seasonId = "s2";
  assert.equal(
    (
      await h.port.command("handScore", {
        groupId: 1,
        selectionId: token,
        delta: 2,
      })
    ).ok,
    false,
  );
});
test("failed save keeps judgment/reward retryable, locked mutation denied", async () => {
  const h = setup();
  await h.port.command("handSelect", { groupId: 1 });
  const token = h.port.getSnapshot().selectionId;
  h.setFail(true);
  assert.equal(
    (
      await h.port.command("handJudge", {
        groupId: 1,
        selectionId: token,
        correct: true,
      })
    ).ok,
    false,
  );
  assert.equal(h.port.getSnapshot().correct, null);
  assert.equal(h.data.groups[0].itemStats.correct, 0);
  h.setFail(false);
  await h.port.command("handJudge", {
    groupId: 1,
    selectionId: token,
    correct: true,
  });
  h.data.isLocked = true;
  assert.equal(
    (
      await h.port.command("handScore", {
        groupId: 1,
        selectionId: token,
        delta: 2,
      })
    ).ok,
    false,
  );
});
test("rejected draw restores runtime and stays retryable", async () => {
  const h = setup();
  await h.port.command("handSelect", { groupId: 1 });
  const token = h.port.getSnapshot().selectionId;
  await h.port.command("handJudge", {
    groupId: 1,
    selectionId: token,
    correct: true,
  });
  h.data.groups[0].inventory.push({ key: "a" }, { key: "b" }, { key: "c" });
  assert.equal(h.port.getSnapshot().canDraw, false);
  assert.equal(
    (await h.port.command("handDraw", { groupId: 1, selectionId: token })).ok,
    false,
  );
  assert.equal(h.data.groups[0].inventory.length, 3);
});
test("duplicate judge is refused and tokens are renewed per selection", async () => {
  const h = setup();
  await h.port.command("handSelect", { groupId: 1 });
  const first = h.port.getSnapshot().selectionId;
  await h.port.command("handJudge", {
    groupId: 1,
    selectionId: first,
    correct: false,
  });
  assert.equal(
    (
      await h.port.command("handJudge", {
        groupId: 1,
        selectionId: first,
        correct: true,
      })
    ).ok,
    false,
  );
  await h.port.command("handSelect", { groupId: 1 });
  const second = h.port.getSnapshot().selectionId;
  assert.notEqual(first, second);
  assert.equal(h.port.getSnapshot().correct, null);
});

test("a successful reward spends the judged selection and cannot score twice", async () => {
  const h = setup();
  await h.port.command("handSelect", { groupId: 1 });
  const selectionId = h.port.getSnapshot().selectionId;
  await h.port.command("handJudge", { groupId: 1, selectionId, correct: true });
  const first = await h.port.command("handScore", {
    groupId: 1,
    selectionId,
    delta: 2,
  });
  assert.equal(first.ok, true);
  const second = await h.port.command("handScore", {
    groupId: 1,
    selectionId,
    delta: 2,
  });
  assert.equal(second.ok, false);
  assert.equal(h.data.groups[0].score, 22);
  assert.equal(h.port.getSnapshot().canScore, false);
  assert.equal(h.port.getSnapshot().canDraw, false);
});
test("same state object cannot keep a stale hand token across save generation or undo group replacement", async () => {
  for (const change of ["generation", "undo"]) {
    const h = setup();
    await h.port.command("handSelect", { groupId: 1 });
    const selectionId = h.port.getSnapshot().selectionId;
    if (change === "generation")
      h.setContext({ saveId: "save-A", generation: 2, revision: 1 });
    else h.data.groups = structuredClone(h.data.groups);
    assert.equal(
      (
        await h.port.command("handJudge", {
          groupId: 1,
          selectionId,
          correct: true,
        })
      ).ok,
      false,
    );
    assert.equal(h.data.groups[0].itemStats.correct, 0);
  }
});

test("cancelled item use preserves reward, accepted unsaved consumption cannot be repeated", async () => {
  const h = setup();
  await h.port.command("handSelect", { groupId: 1 });
  const selectionId = h.port.getSnapshot().selectionId;
  await h.port.command("handJudge", { groupId: 1, selectionId, correct: true });
  h.data.groups[0].inventory = [{ key: "triple_green", charges: 3 }];
  h.host.use = (g) => {
    g.itemEffect = null;
    return { key: "triple_green", name: "三绿" };
  };
  const cancelled = await h.port.command("handUse", {
    groupId: 1,
    selectionId,
  });
  assert.equal(cancelled.error, "ITEM_NOT_USED");
  assert.equal(h.port.getSnapshot().canScore, true);
  h.host.use = (g) => {
    g.inventory[0].charges--;
    return { key: "triple_green", name: "三绿" };
  };
  h.host.whenIdle = async () => ({ ok: true, persisted: false });
  const retained = await h.port.command("handUse", { groupId: 1, selectionId });
  assert.equal(retained.effectCommitted, true);
  assert.equal(h.port.getSnapshot().canScore, false);
  assert.equal(h.data.groups[0].inventory[0].charges, 2);
  assert.equal(
    (await h.port.command("handUse", { groupId: 1, selectionId })).ok,
    false,
  );
});
