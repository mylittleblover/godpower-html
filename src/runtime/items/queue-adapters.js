function isQueuePersistentActiveV2120(g, it = null) {
  const main = it || g?.inventory?.[0];
  if (!g?.itemEffect?.type || !main) return false;
  return (
    ["star", "mega", "power"].includes(g.itemEffect.type) &&
    main.key === g.itemEffect.type
  );
}

function queueRoleTextV2120(index) {
  return index === 0 ? "主要道具" : `次要道具 ${index}`;
}

function queueUseStateV2120(g, index) {
  const it = g?.inventory?.[index];
  if (!it) return { usable: false, label: "空道具槽" };
  if (index !== 0) return { usable: false, label: "🔒 等待主要道具" };
  if (isQueuePersistentActiveV2120(g, it))
    return { usable: false, label: "⏳ 生效中 · 等待结束" };
  if (!eligibleForItems(g)) return { usable: false, label: "负分保护" };
  if (state.isLocked) return { usable: false, label: "请先解锁管理口令" };
  const reason = Reliability.validateItem(state, g, index, isCommunismMode());
  if (reason) return { usable: false, label: reason };
  if (g.itemEffect?.iceLock || CompetitionEffects.has(g, "freeze"))
    return { usable: true, label: "解除冻结（本次不发动）" };
  return { usable: true, label: "使用主要道具" };
}

/* 最终主动使用守门：即使旧 DOM、历史页面或脚本直接传入 index 1/2，也不能越过主要道具。 */

/* 管理员添加也只会排到队尾，不允许插队。 */
function godAddQueueItemV2120(gid, key) {
  const g = state.groups.find((x) => x.id === gid);
  if (!g || !ITEM_DEFS[key]) return;
  if (g.inventory.length >= 3) {
    showToast("主要 + 次要三个道具栏均已占用");
    return;
  }
  if (!eligibleForItems(g)) {
    showToast("负分状态禁止获得道具");
    return;
  }
  recordHistory(`上帝模式：${g.name} 获得 ${ITEM_DEFS[key].name}`);
  if (addItemToGroup(g, key)) {
    saveState();
    renderAll();
    renderItemWindow();
    const role = g.inventory.length === 1 ? "主要道具" : "次要道具";
    showToast(`${ITEM_DEFS[key].name} 已加入${role}栏`);
  }
}
function godClearQueueItemsV2120(gid) {
  const g = state.groups.find((x) => x.id === gid);
  if (!g) return;
  recordHistory(`${g.name} 上帝模式清空道具队列`);
  g.inventory = [];
  g.itemEffect = null;
  g.competitionEffects = {};
  g.booShield = 0;
  saveState();
  renderAll();
  renderItemWindow();
}

/* 兼容旧管理员入口。 */
if (typeof godAddItem === "function")
  godAddItem = (id, k) => godAddQueueItemV2120(id, k);
if (typeof godAddItemV283 === "function")
  godAddItemV283 = (id, k) => godAddQueueItemV2120(id, k);
if (typeof godClearItems === "function")
  godClearItems = (id) => godClearQueueItemsV2120(id);

/* 道具窗口重做为“主栏 + 次栏”层级，不再给三个道具都放可点击使用按钮。 */
const _v2120RenderItemWindow = renderItemWindow;
renderItemWindow = function () {
  _v2120RenderItemWindow();
  const g = state.groups.find((x) => x.id === activeItemGroupId);
  const body = document.getElementById("itemWindowBody");
  if (!g || !body || activeItemTab !== "items") return;

  const cards = [0, 1, 2]
    .map((i) => {
      const it = g.inventory[i];
      const role = queueRoleTextV2120(i);
      if (!it) {
        return `<div class="item-big queue-item-card ${i === 0 ? "queue-main-card" : "queue-secondary-card"} empty">
        <div class="queue-role-badge">${role}</div>
        <div class="item-big-icon">＋</div>
        <div class="item-big-name">空道具栏</div>
        <div class="item-big-desc">${i === 0 ? "新获得的第一个道具会进入这里" : "主要道具释放后，次要道具会按顺序自动晋升"}</div>
      </div>`;
      }
      const d = ITEM_DEFS[it.key];
      const st = queueUseStateV2120(g, i);
      const active = isQueuePersistentActiveV2120(g, it);
      return `<div class="item-big queue-item-card ${i === 0 ? "queue-main-card" : "queue-secondary-card"} ${active ? "queue-persistent-active" : ""}">
      <div class="queue-role-badge">${role}${active ? " · 卡手中" : ""}</div>
      <div class="item-big-icon">${itemVisual(it.key)}</div>
      <div class="item-big-name">${escapeHtml(d.name)}${it.charges > 1 ? " ×" + it.charges : ""}</div>
      <div class="item-big-desc">${escapeHtml(d.desc)}</div>
      ${
        i === 0
          ? `<button class="btn btn-primary item-use queue-main-use" onclick="useItem(${g.id},0)" ${st.usable ? "" : "disabled"}>${st.label}</button>`
          : `<button class="btn item-use queue-secondary-lock" disabled>${st.label}</button>`
      }
    </div>`;
    })
    .join("");

  body.innerHTML = `<div class="queue-help">
      <b>道具队列</b>
      <span>最先获得的道具为主要道具。必须彻底用完主要道具后，次要道具才会按获得顺序自动晋升。</span>
    </div>
    <div class="item-inventory-grid queue-inventory-grid">${cards}</div>
    ${g.score < 0 ? '<div class="queue-negative-note">负分保护生效：禁止使用或受到任何道具影响。</div>' : ""}`;

  if (!state.isLocked) {
    const admin = document.createElement("div");
    admin.className = "god-item-tools queue-admin-tools";
    admin.innerHTML = `<b>🔓 上帝模式 · 现实编辑器</b>
      <div class="god-item-grid" style="margin-top:8px">
        ${Object.keys(ITEM_DEFS)
          .map(
            (k) =>
              `<button class="btn btn-sm" onclick="godAddQueueItemV2120(${g.id},'${k}')">${itemVisual(k)} ${escapeHtml(ITEM_DEFS[k].name)}</button>`,
          )
          .join("")}
      </div>
      <button class="btn btn-sm btn-danger" style="margin-top:8px" onclick="godClearQueueItemsV2120(${g.id})">🧹 把道具桌面掀干净</button>`;
    body.appendChild(admin);
  }
};

/* 比赛卡片三个小格也明确显示“主 / 次 / 次”，并突出当前主要道具。 */
const _v2120EnhanceItemCards = enhanceItemCards;
const queueMainVisualCacheV2120 = new Map();
enhanceItemCards = function () {
  _v2120EnhanceItemCards();
  state.groups.forEach((g) => {
    const card = document.querySelector(
      `.group-row-card[data-group-id="${g.id}"]`,
    );
    if (!card) return;

    // 防御颜色只看主要道具，次要道具不再提前提供被动防御。
    card.classList.remove(
      "item-def-green",
      "item-def-red",
      "item-def-yellow",
      "item-def-orange",
    );
    const main = g.inventory?.[0];
    if (main && ITEM_DEFS[main.key]?.def)
      card.classList.add("item-def-" + ITEM_DEFS[main.key].def);

    const slots = [...card.querySelectorAll(".item-slot")];
    [0, 1, 2].forEach((i) => {
      const slot = slots[i];
      if (!slot) return;
      const it = g.inventory[i];
      slot.className = `item-slot ${i === 0 ? "queue-main-slot" : "queue-secondary-slot"} ${it ? "" : "empty"}`;
      if (it) {
        const active = isQueuePersistentActiveV2120(g, it);
        if (active) slot.classList.add("queue-persistent-active");
        slot.title = `${queueRoleTextV2120(i)}：${ITEM_DEFS[it.key].name}${i > 0 ? "（锁定，等待晋升）" : ""}`;
        slot.innerHTML = `<span class="queue-slot-role">${i === 0 ? "主" : "次"}</span>${itemVisual(it.key)}${it.charges > 1 ? `<span class="charges">${it.charges}</span>` : ""}`;
      } else {
        slot.title = queueRoleTextV2120(i) + "：空";
        slot.innerHTML = `<span class="queue-slot-role">${i === 0 ? "主" : "次"}</span><span class="queue-empty-plus">＋</span>`;
      }
    });

    const currentMain = main ? `${main.key}:${main.acquiredAt || 0}` : "";
    const prev = queueMainVisualCacheV2120.get(g.id);
    if (prev !== undefined && prev !== currentMain && currentMain && slots[0]) {
      slots[0].classList.add("queue-promoted");
      setTimeout(() => slots[0]?.classList.remove("queue-promoted"), 1150);
    }
    queueMainVisualCacheV2120.set(g.id, currentMain);
  });
};

/* 举手抽奖完成后的文案改为队列语义。 */
const _v2120HandUseNewItem = handUseNewItem;
handUseNewItem = function () {
  const gid = handItemDrawGroupId;
  const g = state.groups.find((x) => x.id === gid);
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  if (!g) {
    showToast("新道具已不存在");
    return;
  }
  closeHandRaise();
  openItemWindow(g.id, "items");
  globalThis.HandItemCinematic?.mark(g.id);
  if (g.inventory.length > 1)
    showToast("新道具已进入次要道具栏，需要等待主要道具用完");
};

/* 页面加载时旧数据直接按 inventory 原顺序解释：最早获得/数组最前 = 主要道具。 */
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    try {
      renderAll();
    } catch (e) {}
  }, 220),
);
