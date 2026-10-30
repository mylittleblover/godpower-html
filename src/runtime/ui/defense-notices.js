/* ===== V2.17.35：防御提示统一顶部样式，并避免被上一条提示遮挡 ===== */

function getTopNoticeStackV21735() {
  let stack = document.getElementById("topNoticeStackV21735");
  if (stack) return stack;

  stack = document.createElement("div");
  stack.id = "topNoticeStackV21735";
  stack.className = "top-notice-stack-v21735";
  document.body.appendChild(stack);
  return stack;
}

function appendTopNoticeV21735(node, duration = 3800) {
  const stack = getTopNoticeStackV21735();
  stack.appendChild(node);

  const remove = () => {
    if (node.isConnected) node.remove();
    if (stack.isConnected && !stack.children.length) stack.remove();
  };

  node.addEventListener("animationend", remove, { once: true });
  setTimeout(remove, duration);
  return node;
}

/* 最终统一道具使用提示：不再删除上一条，而是在顶部堆栈中向下排列。 */
const _v21735ShowItemUseFx = showItemUseFx;
showItemUseFx = function (key, casterId = null, targetText = "") {
  /* 保留 V2.17.7 等外层逻辑，但绕过旧版 banner 的 DOM 输出。
     这里重新实现最终视觉，同时保留音效和卡片特效。 */
  if (typeof DesktopUI !== "undefined") {
    if (!globalThis.ItemModules || ItemModules.feedback(key))
      DesktopUI.visualEvent("ITEM_USE_START", { groupId: casterId, key });
    if (
      (globalThis.ItemModules && !ItemModules.feedback(key)) ||
      !DesktopUI.getPreferences().itemFx ||
      DesktopUI.getPreferences().motion === "off"
    ) {
      playSound("item_use");
      if (typeof itemSoundCategoryV26 === "function")
        setTimeout(() => playSound(itemSoundCategoryV26(key)), 55);
      return;
    }
  }
  const d = ITEM_DEFS?.[key];
  if (!d) return;

  try {
    if (typeof playSound === "function") {
      playSound("item_use");
      if (typeof itemSoundCategoryV26 === "function") {
        setTimeout(() => playSound(itemSoundCategoryV26(key)), 55);
      }
    }
  } catch (e) {}

  try {
    if (casterId != null && typeof playCasterCardFx === "function") {
      playCasterCardFx(key, casterId);
    }
    if (casterId != null && typeof cardFxTargets === "function") {
      const special = ["coin_shell", "question", "question_block", "boo"];
      if (special.includes(key)) {
        const heal = ["coin_shell", "question", "question_block"].includes(key);
        cardFxTargets(key, casterId).forEach((id, n) =>
          setTimeout(
            () => {
              try {
                playTargetCardFx(id, key, heal ? "heal" : "hit");
              } catch (e) {}
            },
            100 + n * 60,
          ),
        );
      }
    }
  } catch (e) {}

  const caster = state.groups?.find((g) => g.id === casterId);
  const banner = document.createElement("div");
  banner.className = "item-use-banner-v216";
  banner.innerHTML =
    `<span class="iub-icon">${itemVisual(key)}</span>` +
    `<span style="min-width:0">` +
    `<div class="iub-main">${caster ? escapeHtml(caster.name) + " 使用了 " : ""}${escapeHtml(d.name)}</div>` +
    `${targetText ? `<div class="iub-sub">${escapeHtml(targetText)}</div>` : ""}` +
    `</span>`;

  appendTopNoticeV21735(
    banner,
    typeof NOTICE_DURATION_V21734 === "number" ? NOTICE_DURATION_V21734 : 3800,
  );
};

/* 防御提示：同样使用顶部道具提示样式。
   不覆盖已有提示，而是排在其下方，因此不会被上一条挡住。 */
tinyDefenseToast = function (msg) {
  try {
    if (typeof playSound === "function") playSound("item_defend");
  } catch (e) {}

  const banner = document.createElement("div");
  banner.className = "item-use-banner-v216 item-defense-banner-v21735";
  banner.innerHTML =
    `<span class="iub-icon">🛡️</span>` +
    `<span style="min-width:0">` +
    `<div class="iub-main">${escapeHtml(String(msg || "防御成功"))}</div>` +
    `<div class="iub-sub">防御触发</div>` +
    `</span>`;

  appendTopNoticeV21735(
    banner,
    typeof NOTICE_DURATION_V21734 === "number" ? NOTICE_DURATION_V21734 : 3800,
  );
};
