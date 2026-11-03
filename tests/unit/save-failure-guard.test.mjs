import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
test("failed new-library initialization cannot report a successful legacy save", () => {
  let writes = 0;
  const context = vm.createContext({
    window: { classroomReady: true },
    SaveManager: {
      isStarting: () => false,
      enabled: () => false,
      blocked: () => true,
    },
    classroomCommands: { isPending: () => false },
    state: { groups: [], picker: {}, itemGlobal: {} },
    historyStack: [],
    document: { getElementById: () => null },
    showClassroomSaveWarning: () => {},
    showToast: () => {},
    ensureV2State: () => {},
    buildClassroomBackup: () => ({ groups: [] }),
    Reliability: {
      stateKey: "save",
      writeVerified: () => {
        writes++;
        return { ok: true };
      },
    },
    CLASSROOM_STORAGE: {},
    STORAGE: {
      set: () => {
        writes++;
        return true;
      },
      setJSON: () => {
        writes++;
        return true;
      },
    },
    ClassroomSaveFile: { isHydrating: () => false, write: () => writes++ },
  });
  vm.runInContext(
    readFileSync("src/runtime/storage/classroom-save.js", "utf8"),
    context,
  );
  const result = vm.runInContext("saveState()", context);
  assert.equal(result.ok, false);
  assert.equal(writes, 0);
});

test("archive deletion confirmation cannot target another save or bypass a newly locked classroom", async () => {
  for (const change of ["switch", "lock"]) {
    let active = "save-A",
      deleted = 0;
    const state = { isLocked: false };
    const data = {
      "save-A": [{ id: "A", groups: [] }],
      "save-B": [{ id: "B", groups: [] }],
    };
    const context = vm.createContext({
      state,
      SaveManager: {
        enabled: () => true,
        context: () => ({
          saveId: active,
          generation: active === "save-A" ? 1 : 2,
        }),
        snapshot: () => ({ archives: data[active] }),
        removeArchive: async () => {
          deleted++;
          return { ok: true };
        },
      },
      ClassroomWriteBarrier: { allow: () => true },
      themeConfirm: async () => {
        if (change === "switch") active = "save-B";
        else state.isLocked = true;
        return true;
      },
      themeAlert: () => {},
      showToast: () => {},
      openPwdModal: () => {},
      renderSettlementHistoryList: () => {},
      STORAGE: {
        getJSON: () => data[active],
        setJSON: () => {
          deleted++;
        },
      },
    });
    vm.runInContext(
      readFileSync("src/runtime/archives/settlement-actions.js", "utf8"),
      context,
    );
    await vm.runInContext("deleteSettlementRecord(0)", context);
    assert.equal(deleted, 0, change + " must invalidate confirmation");
  }
});
