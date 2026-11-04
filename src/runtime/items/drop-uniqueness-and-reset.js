/* ===== V2.17.2：道具权重重构 + 数据页一键清空道具 ===== */

/* -------- 场上唯一性 --------
   鱿鱿：背包里存在，或当前墨汁效果仍在持续，都算“场上存在”。
   闪电：只要任意小组背包里已有一枚，就不再进入抽取池。
*/
function itemExistsOnFieldV2172(key) {
  ensureItemState();
  if (
    key === "blooper" &&
    Number(state.itemGlobal?.blooperUntil || 0) > Date.now()
  )
    return true;
  return state.groups.some(
    (g) =>
      Array.isArray(g.inventory) && g.inventory.some((it) => it?.key === key),
  );
}

/* -------- 排名分区 --------
   前三名：固定按实际名次 1~3。
   后30%：用 ceil(total*0.30)，至少 1 组。
   其余：中游。
*/
function itemRankBandV2172(pos, total) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safePos = Math.max(1, Math.min(safeTotal, Number(pos) || 1));
  const lastCount = Math.max(1, Math.ceil(safeTotal * 0.3));
  const lastStart = safeTotal - lastCount + 1;
  if (safePos <= Math.min(3, safeTotal)) return "front";
  if (safePos >= lastStart) return "rear";
  return "mid";
}

/* -------- 新权重 --------
   目标：
   1. 金币 / 羽毛 / ？砖块：只在前三名。
   2. 无敌星 / 炮弹刺客 / 巨大蘑菇 / 闪电：只在后30%。
   3. 火之花、冰之花、回旋镖、炸弹、锤子等常规攻击主要集中在中游。
   4. 三重道具显著降低权重。
   5. 鱿鱿和闪电同时最多各存在 1 个。
*/


/* 上帝模式追加时同样遵守“鱿鱿 / 闪电各最多一个”的规则。 */
const _v2172AddItemToGroup = addItemToGroup;
addItemToGroup = function (g, key) {
  if (
    (key === "blooper" || key === "lightning") &&
    itemExistsOnFieldV2172(key)
  ) {
    showToast(`${ITEM_DEFS[key]?.name || "该道具"}场上只能同时存在一个`);
    return false;
  }
  return _v2172AddItemToGroup.call(this, g, key);
};

/* -------- 一键清空所有道具 --------
   清空背包 + 当前道具持续状态 + 害羞幽灵护盾 + 鱿鱿全局状态。
   保留分数、成员、历史统计与 itemStats。
*/
async function clearAllItemsV2172() {
  ensureItemState();

  const held = state.groups.reduce(
    (n, g) => n + (Array.isArray(g.inventory) ? g.inventory.length : 0),
    0,
  );
  const active = state.groups.filter(
    (g) => g.itemEffect || Number(g.booShield || 0) > 0,
  ).length;
  const blooperActive =
    Number(state.itemGlobal?.blooperUntil || 0) > Date.now();

  if (!held && !active && !blooperActive) {
    showToast("当前没有需要清空的道具或道具状态");
    return;
  }

  if (
    !(await themeConfirm(
      `确定一键清空所有小组道具吗？\n\n将清除：\n• 所有主要 / 次要道具\n• 无敌星、巨大蘑菇、强力蘑菇等持续状态\n• 害羞幽灵防护\n• 当前鱿鱿遮蔽效果\n\n不会修改积分、成员和道具统计。`,
      { title: "清空所有道具", danger: true, confirmText: "确认清空" },
    ))
  )
    return;

  try {
    recordHistory("一键清空所有道具");
  } catch (e) {}

  state.groups.forEach((g) => {
    g.inventory = [];
    g.itemEffect = null;
    g.competitionEffects = {};
    g.booShield = 0;
    if ("iceLock" in g) g.iceLock = 0;
  });

  if (!state.itemGlobal || typeof state.itemGlobal !== "object")
    state.itemGlobal = {};
  state.itemGlobal.blooperUntil = 0;

  try {
    if (typeof bulletTimer !== "undefined" && bulletTimer) {
      clearInterval(bulletTimer);
      bulletTimer = null;
    }
  } catch (e) {}

  try {
    applyBlooperMask();
  } catch (e) {}
  saveState();
  renderAll();
  showToast("已清空所有小组道具与当前道具状态");
}

/* 在“数据与管理”页插入操作区。rebuildSettingsV26 会重建 DOM，因此每次打开都补一次。 */
function installClearItemsSettingV2172() {
  const pane = document.getElementById("settingsV26_data");
  if (!pane || document.getElementById("clearAllItemsV2172")) return;

  const section = document.createElement("div");
  section.id = "clearAllItemsV2172";
  section.innerHTML = `
    <div class="setting-section-title">🎁 道具数据</div>
    <div class="clear-items-row">
      <div class="clear-items-copy">
        <b>一键清空所有道具</b>
        <span>清除所有小组背包、道具持续状态、害羞幽灵防护与当前鱿鱿效果；不会修改积分、成员或道具统计。</span>
      </div>
      <button type="button" class="btn btn-danger" onclick="clearAllItemsV2172()">清空所有道具</button>
    </div>`;
  pane.appendChild(section);
}

/* 包装设置页重建和切页，避免按钮被重建流程吞掉。 */
if (typeof rebuildSettingsV26 === "function") {
  const _v2172RebuildSettingsV26 = rebuildSettingsV26;
  rebuildSettingsV26 = function (...args) {
    const r = _v2172RebuildSettingsV26.apply(this, args);
    setTimeout(installClearItemsSettingV2172, 0);
    return r;
  };
}
if (typeof showSettingsV26 === "function") {
  const _v2172ShowSettingsV26 = showSettingsV26;
  showSettingsV26 = function (which, ...args) {
    const r = _v2172ShowSettingsV26.call(this, which, ...args);
    if (which === "data") setTimeout(installClearItemsSettingV2172, 0);
    return r;
  };
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => setTimeout(installClearItemsSettingV2172, 420),
    { once: true },
  );
} else {
  setTimeout(installClearItemsSettingV2172, 0);
}
