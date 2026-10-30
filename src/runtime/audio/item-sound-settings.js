const ITEM_FX_SOUND_SLOTS = [
  { id: "item_draw_start", name: "道具抽取·启动", desc: "开始轮盘时" },
  { id: "item_draw_tick", name: "道具抽取·滚动刻度", desc: "轮盘滚动过程中" },
  { id: "item_draw_reveal", name: "道具抽取·定格", desc: "最终道具揭晓" },
  { id: "item_use", name: "道具·发动通用", desc: "任一道具成功使用" },
  {
    id: "item_attack",
    name: "道具·攻击",
    desc: "龟壳、香蕉、炸弹、锤子、闪电等",
  },
  { id: "item_defend", name: "道具·防御成功", desc: "防御道具抵消攻击" },
  { id: "item_buff", name: "道具·加分/强化", desc: "金币、蘑菇、？砖块等" },
  {
    id: "item_status",
    name: "道具·持续状态",
    desc: "星星、巨大蘑菇、炮弹、强力蘑菇、鱿鱿",
  },
  { id: "item_steal", name: "害羞幽灵·偷取", desc: "成功偷取道具" },
];
function renderItemFxSoundListV26() {
  const box = document.getElementById("itemFxSoundListV26");
  if (!box) return;
  box.innerHTML = ITEM_FX_SOUND_SLOTS.filter(
    (s) => !GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id),
  )
    .map((s) => {
      const custom = !!customFxBuffers[s.id] || hasSound("fx_" + s.id);
      return `<div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="sound-tag">${custom ? "已载入自定义音频" : s.desc}</div></div><div class="sound-controls"><button class="btn btn-sm" onclick="playSound('${s.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${s.id}')">上传</button>${custom ? `<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${s.id}','${s.id}');setTimeout(renderItemFxSoundListV26,100)">还原</button>` : ""}</div></div>`;
    })
    .join("");
}
function itemSoundCategoryV26(k) {
  if (
    [
      "green",
      "triple_green",
      "red",
      "triple_red",
      "spiny",
      "banana",
      "triple_banana",
      "horn",
      "bomb",
      "hammer",
      "lightning",
    ].includes(k)
  )
    return "item_attack";
  if (
    ["coin", "coin_shell", "question", "mushroom", "triple_mushroom"].includes(
      k,
    )
  )
    return "item_buff";
  if (k === "boo") return "item_steal";
  return "item_status";
}
const _v26ShowItemUseFx = showItemUseFx;
showItemUseFx = function (k, g, t) {
  playSound("item_use");
  setTimeout(() => playSound(itemSoundCategoryV26(k)), 55);
  return _v26ShowItemUseFx(k, g, t);
};
const _v26TinyDefense = tinyDefenseToast;
tinyDefenseToast = function (m) {
  playSound("item_defend");
  return _v26TinyDefense(m);
};

/* 4. 顶部导航 + 底部主要功能按钮图标自定义 */
