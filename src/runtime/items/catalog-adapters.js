const ITEM_ORDER_V283 = [
  "green",
  "triple_green",
  "red",
  "triple_red",
  "spiny",
  "banana",
  "triple_banana",
  "horn",
  "bobomb",
  "hammer",
  "coin",
  "coin_shell",
  "question",
  "mushroom",
  "triple_mushroom",
  "boo",
  "blooper",
  "lightning",
  "star",
  "mega",
  "bullet",
  "power_mushroom",
  "feather",
  "fire_flower",
  "ice_flower",
  "boomerang_flower",
  "kamek",
  "item_box",
];

/* 统一枚举器。旧页面有若干处把 26 种道具写死在 HTML 中，
   所以单纯 Object.assign(ITEM_DEFS) 并不会让它们自己长出来。 */
function itemKeysV283() {
  return ITEM_ORDER_V283.filter((k) => ITEM_DEFS[k]);
}

function itemAdminButtonV283(k, gid) {
  const d = ITEM_DEFS[k];
  return `<button class="btn item-admin-add" onclick="godAddItemV283(${gid},'${k}')">${itemVisual(k)} <span>${escapeHtml(d.name)}</span></button>`;
}
function godAddItemV283(gid, key) {
  const g = state.groups.find((x) => x.id === gid);
  if (!g || !ITEM_DEFS[key]) return;
  if (g.inventory.length >= 3) {
    showToast("该组的三个道具槽都已占用");
    return;
  }
  if (Number(g.score) < 0) {
    showToast("负分状态禁止获得道具");
    return;
  }
  recordHistory(`上帝模式：${g.name} 获得 ${ITEM_DEFS[key].name}`);
  if (addItemToGroup(g, key)) {
    saveState();
    renderAll();
    renderGroupModalV283(gid);
  }
}

/* 找到“上帝模式·强制道具管理”标题后的按钮容器，兼容旧 DOM。 */
function patchVisibleGodManagerV283(gid) {
  const all = [...document.querySelectorAll("body *")];
  const title = all.find(
    (el) =>
      el.children.length === 0 &&
      /上帝模式.*强制道具管理/.test(el.textContent || ""),
  );
  if (!title) return;
  let box = title.nextElementSibling;
  if (!box || box.children.length < 3) {
    box = document.createElement("div");
    box.className = "god-item-grid";
    title.insertAdjacentElement("afterend", box);
  }
  box.innerHTML = itemKeysV283()
    .map((k) => itemAdminButtonV283(k, gid))
    .join("");
}

/* 更可靠的百科补丁：仅在旧版关于弹窗存在时检查并追加缺失 4 项。 */
function appendMissingEncyclopediaV283() {
  const about = document.querySelector(
    "#aboutModal,.about-modal,#aboutWindow,.about-window",
  );
  if (!about) return;
  about.querySelectorAll("h1,h2,h3").forEach((h) => {
    if (/22\s*种道具百科/.test(h.textContent || ""))
      h.textContent = "26 种道具百科";
  });
  const title = [...about.querySelectorAll("h1,h2,h3")].find((x) =>
    /26\s*种道具百科/.test(x.textContent || ""),
  );
  if (!title) return;
  const parent = title.parentElement;
  const text = parent.textContent || "";
  ["feather", "fire_flower", "ice_flower", "boomerang_flower"].forEach((k) => {
    const d = ITEM_DEFS[k];
    if (text.includes(d.name)) return;
    const card = document.createElement("div");
    card.className = "guide-block encyclopedia-item";
    card.innerHTML = `<b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc)}`;
    parent.appendChild(card);
  });
}

/* 道具图标设置/百科等通过原 renderer 后追加缺失项。 */
function patchItemIconSettingsV283() {
  const setting = document.querySelector("#view-settings") || document;
  if (setting.querySelector('[onchange*="feather"]')) return;
  const labels = [
    ...setting.querySelectorAll("h1,h2,h3,h4,b,strong,label,summary"),
  ].filter(
    (x) =>
      x.children.length === 0 &&
      /道具.*图标|自定义道具/.test(x.textContent || ""),
  );
  const anchor = labels[0];
  if (!anchor) return;
  const region = anchor.parentElement?.parentElement || anchor.parentElement;
  if (!region) return;
  const txt = region.textContent || "";
  ["feather", "fire_flower", "ice_flower", "boomerang_flower"].forEach((k) => {
    const d = ITEM_DEFS[k];
    if (txt.includes(d.name)) return;
    const row = document.createElement("div");
    row.className = "setting-row item-icon-row custom-item-icon-row";
    row.innerHTML = `<div><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><div class="setting-note">可使用自定义图片覆盖默认图标</div></div>
   <label class="btn">选择图片<input type="file" accept="image/*" hidden onchange="handleItemIconUpload('${k}',this)"></label>`;
    region.appendChild(row);
  });
}

/* 包装组窗口渲染函数。 */
function renderGroupModalV283(gid) {
  setTimeout(() => patchVisibleGodManagerV283(gid), 0);
}
if (typeof openGroupModal === "function") {
  const _v283OpenGroupModal = openGroupModal;
  openGroupModal = function (gid, ...a) {
    const r = _v283OpenGroupModal.call(this, gid, ...a);
    renderGroupModalV283(gid);
    return r;
  };
}
if (typeof renderGroupModal === "function") {
  const _v283RenderGroupModal = renderGroupModal;
  renderGroupModal = function (...a) {
    const r = _v283RenderGroupModal.apply(this, a);
    const gid = state.activeModalGroupId || activeEditingGroupId;
    if (gid != null) renderGroupModalV283(gid);
    return r;
  };
}

/* About/设置打开后再补一次，因为它们原来是静态 22 项。 */
const _v283OpenAbout =
  typeof openAboutModal === "function" ? openAboutModal : null;
if (_v283OpenAbout)
  openAboutModal = function (...a) {
    const r = _v283OpenAbout.apply(this, a);
    setTimeout(() => {
      appendMissingEncyclopediaV283();
    }, 0);
    return r;
  };
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    appendMissingEncyclopediaV283();
    patchItemIconSettingsV283();
  }, 80),
);

/* ===== V2.8.4：撤销 V2.8.3 临时追加式 UI，统一走原生 26 项 renderer ===== */
