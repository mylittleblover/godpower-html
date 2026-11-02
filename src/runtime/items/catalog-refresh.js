function refresh26ItemInterfacesV284() {
  ITEM_KEYS = Object.keys(ITEM_DEFS);
  document.querySelectorAll(".custom-item-icon-row").forEach((x) => x.remove());

  // 设置页标题
  document.querySelectorAll(".setting-section-title,h1,h2,h3").forEach((x) => {
    if (/22\s*种道具百科/.test(x.textContent || ""))
      x.textContent = (x.textContent || "").replace(
        /22\s*种道具百科/,
        "26 种道具百科",
      );
    if (/22\s*种道具百科与图标管理/.test(x.textContent || ""))
      x.textContent = (x.textContent || "").replace(/22\s*种/, "26 种");
  });

  // 使用原本设计好的 encyclopedia renderer，它现在读取的是刷新后的 ITEM_KEYS。
  try {
    renderItemEncyclopedia();
  } catch (e) {}

  // 如果小组战术窗口正开着，原 renderer 也会自然生成 26 个管理按钮。
  try {
    if (
      typeof renderItemWindow === "function" &&
      document.getElementById("itemWindow")?.classList.contains("active")
    )
      renderItemWindow();
  } catch (e) {}
}

/* V2.8.3 的 append patch 会制造重复/突兀 UI，改为空操作。 */
appendMissingEncyclopediaV283 = function () {};
patchItemIconSettingsV283 = function () {};

/* 强制管理员按钮走原 godAddItem，不再维护第二套 DOM。 */
patchVisibleGodManagerV283 = function () {};
renderGroupModalV283 = function () {};

window.addEventListener("DOMContentLoaded", () =>
  setTimeout(refresh26ItemInterfacesV284, 120),
);

/* About 每次切到百科时，修正标题；原静态百科后追加四项，但保持完全相同 guide-block 样式。 */
const _v284RenderAbout = renderAbout;
renderAbout = function (tab) {
  const r = _v284RenderAbout(tab);
  if (tab === "items") {
    const m = document.getElementById("aboutMain");
    if (m) {
      m.querySelectorAll("h1,h2,h3").forEach(
        (h) =>
          (h.textContent = h.textContent.replace(
            "26 种道具百科",
            "26 种道具百科",
          )),
      );
      const txt = m.innerText || "";
      ["feather", "fire_flower", "ice_flower", "boomerang_flower"].forEach(
        (k) => {
          const d = ITEM_DEFS[k];
          if (txt.includes(d.name)) return;
          const el = document.createElement("div");
          el.className = "guide-block";
          el.innerHTML = `<b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc)}`;
          m.appendChild(el);
        },
      );
    }
  }
  return r;
};

/* ===== V2.9.1 共产主义模式：道具功能总开关 =====
   名称按产品设定保留；实际行为只是控制整个道具系统是否启用/显示。
*/
