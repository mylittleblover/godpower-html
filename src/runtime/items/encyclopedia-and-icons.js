function openItemEncyclopedia() {
  openAbout();
  renderAbout("items");
}
function renderItemEncyclopedia() {
  ensureV2State();
  const box = document.getElementById("v2ItemEncyclopedia");
  if (!box) return;
  box.innerHTML = `<div style="display:flex;gap:7px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="exportItemIconPack()">导出图标包</button><button class="btn btn-primary btn-sm" onclick="document.getElementById('itemPackInput').click()">导入图标包</button><button class="btn btn-sm" onclick="resetAllItemIcons()">恢复全部默认图标</button></div><div class="item-ency-grid">${ITEM_KEYS.map(
    (k) => {
      const d = ITEM_DEFS[k];
      return `<div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d.name}</div><div class="ency-desc">${d.desc}</div></div><div class="ency-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div></div>`;
    },
  ).join("")}</div>`;
}
function chooseItemIcon(k) {
  pendingItemIconKey = k;
  document.getElementById("itemIconInput").value = "";
  document.getElementById("itemIconInput").click();
}
function handleItemIconUpload(e) {
  const f = e.target.files?.[0];
  if (!f || !pendingItemIconKey) return;
  const rd = new FileReader();
  rd.onload = () => {
    ensureV2State();
    state.itemGlobal.customIcons[pendingItemIconKey] = rd.result;
    STORAGE.setJSON("politics_item_icons", state.itemGlobal.customIcons);
    saveState();
    renderItemEncyclopedia();
    renderAll();
    showToast("道具图标已更新");
  };
  rd.readAsDataURL(f);
}
function resetItemIcon(k) {
  ensureV2State();
  delete state.itemGlobal.customIcons[k];
  STORAGE.setJSON("politics_item_icons", state.itemGlobal.customIcons);
  saveState();
  renderItemEncyclopedia();
  renderAll();
}
function resetAllItemIcons() {
  ensureV2State();
  state.itemGlobal.customIcons = {};
  STORAGE.setJSON("politics_item_icons", {});
  saveState();
  renderItemEncyclopedia();
  renderAll();
}
function exportItemIconPack() {
  ensureV2State();
  const blob = new Blob(
    [
      JSON.stringify(
        { version: 1, icons: state.itemGlobal.customIcons },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "道具图标包.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importItemIconPack(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const x = JSON.parse(rd.result);
      ensureV2State();
      state.itemGlobal.customIcons = {
        ...state.itemGlobal.customIcons,
        ...(x.icons || {}),
      };
      STORAGE.setJSON("politics_item_icons", state.itemGlobal.customIcons);
      saveState();
      renderItemEncyclopedia();
      renderAll();
      showToast("道具图标包已导入");
    } catch {
      themeAlert("图标包格式无效");
    }
  };
  rd.readAsText(f);
}

/* 设置页三分区：保留原工程台，只重新组织入口 */
