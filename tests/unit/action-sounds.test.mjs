import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const api = runInNewContext(
  readFileSync("src/core/action-sounds.js", "utf8") + ";ActionSounds",
);
function button(code = "", text = "", extra = {}) {
  return {
    id: "",
    dataset: {},
    tagName: "BUTTON",
    textContent: text,
    getAttribute: () => code,
    matches: () => false,
    closest: () => null,
    ...extra,
  };
}
test("22 stable unique button slots are categorized and separate from business outcome sounds", () => {
  assert.equal(api.slots.length, 22);
  assert.equal(new Set(api.slots.map((x) => x.id)).size, 22);
  assert.equal(new Set(api.slots.map((x) => x.category)).size, 4);
  assert.equal(api.isClick("score_add"), false);
  assert.equal(api.isClick("ui_click"), true);
});
test("actual shared main button and picker lever resolve their current action", () => {
  for (const [id, text, key] of [
    ["btnMainAction", "开始答题", "start"],
    ["btnMainAction", "判定结算", "judge"],
    ["btnSlotTrigger", "开始抽签", "pick_start"],
    ["btnSlotTrigger", "停止抽签", "pick_stop"],
  ])
    assert.equal(api.classify(button("", text, { id })), "ui_button_" + key);
});
test("button intent preserves independent answer, item, score, upload and destructive slots", () => {
  for (const [code, text, key] of [
    ["setCorrectAns('A')", "A", "answer"],
    ["toggleAllInCard(1)", "All In", "allin"],
    ["globalItemDraw()", "抽取", "draw"],
    ["useItem(1,0)", "使用", "use"],
    ["triggerUploadAudio()", "上传", "upload"],
    ["exportData()", "导出", "export"],
    ["deleteFxTrack()", "还原", "danger"],
    ["closeItemWindow()", "关闭", "close"],
  ])
    assert.equal(api.classify(button(code, text)), "ui_button_" + key);
  assert.equal(
    api.classify(button("", "−5", { dataset: { scoreSlot: "0" } })),
    "ui_button_negative",
  );
  assert.equal(
    api.classify(button("", "+5", { dataset: { scoreSlot: "0" } })),
    "ui_button_positive",
  );
});
