function showItemUseFx() {}
function itemFxTargetText(key, gid) {
  const r = ranking(),
    i = r.findIndex((g) => g.id === gid),
    names = [];
  const add = (x) => {
    if (x && x.id !== gid && !names.includes(x.name)) names.push(x.name);
  };
  if (["red", "triple_red"].includes(key)) add(r[i - 1]);
  else if (["banana", "triple_banana"].includes(key)) add(r[i + 1]);
  else if (key === "horn") {
    add(r[i - 1]);
    add(r[i + 1]);
  } else if (key === "spiny") add(r[0]);
  else if (key === "boo") add(r[i - 1]);
  else if (key === "lightning" || key === "coin_shell")
    r.slice(0, Math.max(0, i)).forEach(add);
  else if (key === "question") r.slice(i + 1).forEach(add);
  if (!names.length)
    return [
      "coin",
      "mushroom",
      "triple_mushroom",
      "star",
      "mega",
      "bullet",
      "power",
    ].includes(key)
      ? "作用于本组"
      : "";
  return "目标：" + names.join("、");
}
function closeItemWindowForFx() {
  try {
    if (typeof closeItemWindow === "function") closeItemWindow();
  } catch (e) {}
}

/* ===== V2.4：图片规范化 + 更平滑的排名道具轮盘 ===== */

/* 上传时将图片归一化到透明正方形画布。
   无论用户导入的是横图、竖图还是带巨大留白的图片，都不会再撑满小组卡片。 */
function normalizeItemIconFile(file, done) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 384,
        canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      const pad = 34,
        max = size - pad * 2;
      const scale = Math.min(
        max / img.naturalWidth,
        max / img.naturalHeight,
        1.8,
      );
      const w = Math.max(1, img.naturalWidth * scale),
        h = Math.max(1, img.naturalHeight * scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      done(canvas.toDataURL("image/png", 0.94));
    };
    img.onerror = () => done(reader.result);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
handleItemIconUpload = function (e) {
  const f = e.target.files?.[0];
  if (!f || !pendingItemIconKey) return;
  normalizeItemIconFile(f, (data) => {
    ensureV2State();
    state.itemGlobal.customIcons[pendingItemIconKey] = data;
    STORAGE.setJSON("politics_item_icons", state.itemGlobal.customIcons);
    saveState();
    renderItemEncyclopedia();
    renderAll();
    showToast("道具图片已自动适配为统一图标尺寸");
  });
};

/* 平滑更新一个卡片轮盘。 */
function updateCardRouletteVisual(o, key) {
  if (!o || !key) return;
  const icon = o.querySelector(".r-icon"),
    name = o.querySelector(".r-name");
  if (icon) {
    icon.classList.remove("roulette-swap");
    void icon.offsetWidth;
    icon.innerHTML = itemVisual(key);
    icon.classList.add("roulette-swap");
  }
  if (name) name.textContent = ITEM_DEFS[key].name;
}

/* 全局道具抽取：卡片原位动画，先快后慢，最后自然定格。
   每组独立按自己的实时排名奖池刷新。 */

/* 举手抽取也改成先快后慢，不再固定 82ms 疯狂闪烁。 */

/* V2.4 的 handItemDrawTimer 不再总是数字 interval，兼容取消函数。 */
cancelHandItemDraw = function (silent = false) {
  if (handItemDrawFinishTimer) {
    clearTimeout(handItemDrawFinishTimer);
    handItemDrawFinishTimer = null;
  }
  const wasPending = handItemDrawGroupId != null && handItemPendingKey == null;
  handItemDrawTimer = null;
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  if (wasPending && !silent) showToast("本次道具抽取已取消");
};

/* ===== V2.5：道具发动时，比赛页对应小组卡片同步演出 ===== */
