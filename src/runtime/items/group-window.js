function openItemWindow(groupId, tab = "detail") {
  globalThis.HandItemCinematic?.take(null);
  ensureItemState();
  activeItemGroupId = groupId;
  activeItemTab = tab;
  showClassroomWindow(document.getElementById("itemModalBackdrop"));
  renderItemWindow();
}
function closeItemWindow() {
  globalThis.HandItemCinematic?.take(null);
  hideClassroomWindow(document.getElementById("itemModalBackdrop"));
  activeItemGroupId = null;
}
function switchItemTab(tab) {
  activeItemTab = tab;
  renderItemWindow();
}
function renderItemWindow() {
  const g = state.groups.find((x) => x.id === activeItemGroupId);
  if (!g) return closeItemWindow();
  ensureGroupNumbersV213(false);
  document.getElementById("itemWindowTitle").textContent = g.name;
  document
    .querySelectorAll("[data-item-tab]")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.itemTab === activeItemTab),
    );
  const body = document.getElementById("itemWindowBody"),
    locked = !!state.isLocked,
    disabled = locked ? "disabled" : "";
  if (activeItemTab === "detail") {
    const st = g.itemStats || {},
      total = (st.correct || 0) + (st.wrong || 0),
      rate = total ? Math.round(((st.correct || 0) / total) * 100) : 0;
    const statusParts = CompetitionEffects.labels(g);
    if (g.itemEffect && typeof g.itemEffect === "object") {
      const type = g.itemEffect.type;
      if (type) {
        const def = ITEM_DEFS[type];
        if (def?.name) statusParts.push(def.name);
        else statusParts.push(String(type));
      }
      if (Number(g.itemEffect.featherDodge || 0) > 0) {
        statusParts.push(`羽毛闪避 ×${Number(g.itemEffect.featherDodge || 0)}`);
      }
      if (Number(g.itemEffect.iceLock || 0) > 0) {
        statusParts.push("冰冻：下一次主动道具使用将被取消");
      }
      if (type === "star" && Number(g.itemEffect.hitsLeft || 0) > 0) {
        statusParts.push(`剩余防御 ${Number(g.itemEffect.hitsLeft || 0)} 次`);
      } else if (type === "mega" && Number(g.itemEffect.hitsLeft || 0) > 0) {
        statusParts.push(`剩余防御 ${Number(g.itemEffect.hitsLeft || 0)} 次`);
      } else if (type === "power" && Number(g.itemEffect.roundsLeft || 0) > 0) {
        statusParts.push(`剩余 ${Number(g.itemEffect.roundsLeft || 0)} 轮`);
      }
    }
    if (Number(g.booShield || 0) > 0) {
      statusParts.push(`害羞幽灵防护 ×${Number(g.booShield || 0)}`);
    }
    const status = statusParts.length ? statusParts.join(" · ") : "无";
    body.innerHTML = `
      ${locked ? '<div class="group-detail-lock">🔒 当前处于锁定状态，可查看信息，但不能编辑、赋分、使用道具或删除小组。</div>' : ""}
      <div class="item-stat-grid">
        <div class="item-stat"><b>${g.score}</b><span>当前积分</span></div>
        <div class="item-stat"><b>${rate}%</b><span>答题正确率</span></div>
        <div class="item-stat"><b>${st.wrong || 0}</b><span>答错次数</span></div>
        <div class="item-stat"><b>${st.draws || 0}</b><span>道具抽取</span></div>
      </div>
      <div class="group-detail-form">
        <section class="group-detail-section">
          <h4>基本信息</h4>
          <div class="group-detail-fields">
            <div class="group-detail-field"><label for="groupDetailNumber">小组编号</label><input id="groupDetailNumber" type="number" min="1" step="1" value="${g.groupNo}" ${disabled}></div>
            <div class="group-detail-field"><label for="groupDetailName">小组名称</label><input id="groupDetailName" type="text" value="${escapeHtml(g.name)}" ${disabled}></div>
          </div>
          <div class="group-detail-field group-color-field-v21716" style="margin-top:10px">
            <label>小组配色</label>
            <div class="group-color-preset-grid-v21716" role="group" aria-label="16种预设配色">
              ${DEFAULT_COLORS.map((color, idx) => `<button type="button" class="group-color-swatch-v21716 ${String(g.color).toUpperCase() === color.toUpperCase() ? "selected" : ""}" style="--swatch:${color}" title="预设 ${idx + 1} · ${color}" ${disabled} onclick="selectGroupPresetColorV21716(${g.id},'${color}')"><span>${String(g.color).toUpperCase() === color.toUpperCase() ? "✓" : ""}</span></button>`).join("")}
            </div>
            <div class="group-color-free-v21716">
              <div class="group-color-free-copy-v21716"><b>自由颜色</b><span>16 种预设之外，可自行选择任意颜色</span></div>
              <div class="group-color-control group-color-control-v21716">
                <input id="groupDetailColor" type="color" value="${g.color}" ${disabled} oninput="previewItemDetailColorV21716(this.value)" onchange="saveItemDetailColor(${g.id},this.value)">
                <span id="groupDetailColorPreview" class="group-color-preview" style="background:${g.color}"></span>
                <span id="groupDetailColorHexV21716">${escapeHtml(g.color.toUpperCase())}</span>
              </div>
            </div>
          </div>
        </section>
        <section class="group-detail-section">
          <h4>成员管理（每行一人，也支持逗号或顿号分隔）</h4>
          <div class="group-detail-field"><textarea id="groupDetailMembers" ${disabled}>${escapeHtml((g.members || []).join("\n"))}</textarea></div>
        </section>
        <section class="group-detail-section"><h4>当前状态</h4><div>${escapeHtml(status)}</div></section>
        <div class="group-detail-actions"><button type="button" class="btn" onclick="renderItemWindow()" ${disabled}>放弃未保存修改</button><button type="button" class="btn btn-primary" onclick="saveItemGroupDetail(${g.id})" ${disabled}>保存更改</button></div>
        <section class="group-detail-section group-detail-danger"><h4>🧨 红色按钮区</h4><p>点下去以后，这组的积分、成员和道具会一起退场。系统不会替你假装刚才没看见。</p><button type="button" class="btn btn-danger" onclick="deleteItemDetailGroup(${g.id})" ${disabled}>删除小组</button></section>
      </div>`;
  } else if (activeItemTab === "items") {
    const canUse = !locked && eligibleForItems(g);
    body.innerHTML = `${locked ? '<div class="group-detail-lock">🔒 解锁后才能使用道具。</div>' : ""}<div class="item-inventory-grid">${[
      0, 1, 2,
    ]
      .map((i) => {
        const it = g.inventory[i];
        if (!it)
          return '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div></div>';
        const d = ITEM_DEFS[it.key];
        return `<div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-name">${escapeHtml(d.name)}${it.charges > 1 ? " ×" + it.charges : ""}</div><div class="item-big-desc">${escapeHtml(d.desc)}</div><button class="btn btn-primary item-use" onclick="useItem(${g.id},${i})" ${canUse ? "" : "disabled"}>立即使用</button></div>`;
      })
      .join(
        "",
      )}</div>${g.score < 0 ? '<div style="margin-top:12px;color:#dc2626;font-weight:800;">负分保护生效：禁止使用或受到任何道具影响。</div>' : ""}`;
  } else {
    body.innerHTML = `${locked ? '<div class="group-detail-lock">🔒 解锁后才能调整积分。</div>' : ""}<div class="item-score-panel">${ClassroomFeedback.slotMarkup("group", g.id, locked)}<input id="itemCustomScore" type="number" placeholder="自由增减" ${disabled}><button class="btn btn-primary" onclick="itemCustomScore(${g.id})" ${disabled}>应用</button></div>`;
  }
}
function previewItemDetailColor(value) {
  const el = document.getElementById("groupDetailColorPreview");
  if (el) el.style.background = value;
}
function saveItemDetailColor(id, value) {
  if (state.isLocked) {
    renderItemWindow();
    return;
  }
  if (!/^#[0-9a-f]{6}$/i.test(value)) return;
  updateGroupColor(id, value);
  activeItemGroupId = id;
  activeItemTab = "detail";
  renderItemWindow();
}
function saveItemGroupDetail(id) {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  const g = state.groups.find((x) => x.id === id);
  if (!g) return;
  const name = document.getElementById("groupDetailName")?.value.trim() || "";
  const rawNo =
    document.getElementById("groupDetailNumber")?.value.trim() || "";
  if (!name) {
    showToast("小组名称不能为空");
    return;
  }
  if (!/^\d+$/.test(rawNo) || Number(rawNo) <= 0) {
    showToast("编号必须是正整数");
    return;
  }
  const groupNo = Number(rawNo);
  if (state.groups.some((x) => x.id !== id && Number(x.groupNo) === groupNo)) {
    showToast("该编号已被其他小组使用");
    return;
  }
  const rawMembers = document.getElementById("groupDetailMembers")?.value || "";
  const members = Array.from(
    new Set(
      rawMembers
        .split(/[\n,，、]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
  const changed =
    g.name !== name ||
    Number(g.groupNo) !== groupNo ||
    JSON.stringify(g.members || []) !== JSON.stringify(members);
  if (changed) recordHistory(`${g.name} 更新小组详情`);
  g.name = name;
  g.groupNo = groupNo;
  g.members = members;
  saveState();
  renderAll();
  updatePickerPoolUI();
  activeItemGroupId = id;
  activeItemTab = "detail";
  renderItemWindow();
  showToast("小组详情已保存");
}
async function deleteItemDetailGroup(id) {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  await deleteGroup(id);
  if (!state.groups.some((g) => g.id === id)) {
    closeItemWindow();
  } else if (
    document.getElementById("itemWindow")?.classList.contains("active")
  ) {
    renderItemWindow();
  }
}
function itemQuickScore(id, d) {
  if (state.isLocked) {
    openPwdModal();
    return;
  }
  applyScoreDelta(id, d);
  renderItemWindow();
}
function itemCustomScore(id) {
  const n = Number(document.getElementById("itemCustomScore").value);
  if (!Number.isFinite(n) || n === 0) return;
  itemQuickScore(id, Math.round(n));
}

function enhanceItemCards() {
  ensureItemState();
  state.groups.forEach((g) => {
    const c = document.querySelector(
      `.group-row-card[data-group-id="${g.id}"]`,
    );
    if (!c) return;
    c.classList.remove(
      "item-def-green",
      "item-def-red",
      "item-def-yellow",
      "item-def-orange",
      "effect-star",
      "effect-mega",
      "effect-power",
      "effect-bullet",
      "effect-boo",
      "effect-ice",
    );
    const firstDef = g.inventory.find((it) => ITEM_DEFS[it.key]?.def);
    if (firstDef) c.classList.add("item-def-" + ITEM_DEFS[firstDef.key].def);
    if (g.itemEffect?.type) c.classList.add("effect-" + g.itemEffect.type);
    if (g.itemEffect?.iceLock || CompetitionEffects.has(g, "freeze"))
      c.classList.add("effect-ice");
    if (g.booShield > 0) c.classList.add("effect-boo");
    const head = c.querySelector(".card-header-row");
    if (head && !c.querySelector(".item-slots")) {
      const slots = document.createElement("div");
      slots.className = "item-slots";
      slots.innerHTML = [0, 1, 2]
        .map((i) => {
          const it = g.inventory[i];
          return it
            ? `<div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it.charges > 1 ? `<span class="charges">${it.charges}</span>` : ""}</div>`
            : '<div class="item-slot empty">＋</div>';
        })
        .join("");
      head.parentNode.insertBefore(slots, head.nextSibling);
    }
    const mb = c.querySelector(".more-btn");
    if (mb) {
      mb.classList.remove("locked-disabled");
      mb.title = "小组详情 / 道具 / 基础赋分";
      mb.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openItemWindow(g.id);
      };
    }
  });
  applyBlooperMask();
}

const savedItemGlobal = STORAGE.getJSON("politics_item_global", null);
if (savedItemGlobal)
  state.itemGlobal = { ...state.itemGlobal, ...savedItemGlobal };

window.addEventListener("DOMContentLoaded", () => {
  ensureItemState();
  renderAll();
  startBulletTimer();
  startBlooperClock();
});

/* ===== 完整课堂版 V2 ===== */
