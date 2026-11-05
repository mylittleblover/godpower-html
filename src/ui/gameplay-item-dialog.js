/* Read-only item reference and isolated demo; never invokes classroom commands. */
const GameplayItemDialog = (() => {
  let dialog,
    key = null,
    releasePreview = () => {},
    releasePage = null;
  function stopPreview() {
    releasePreview();
    releasePreview = () => {};
  }
  function close() {
    if (!dialog?.open) return;
    stopPreview();
    DesktopUI.dismissWindow(dialog, () => {
      const release = releasePage;
      releasePage = null;
      if (release) release();
      else {
        dialog.close();
        key = null;
      }
    });
  }
  function demoCard(itemKey) {
    const card = document.createElement("div");
    card.className = "group-row-card battle-card gameplay-demo-card";
    card.style.setProperty("--group-color", "#0f766e");
    card.style.setProperty("--group-contrast", "#fff");
    card.style.setProperty("--group-badge-color", "#0f766e");
    const group = {
      id: -1,
      name: "演示小组",
      color: "#0f766e",
      score: 100,
      displayScore: 100,
      members: [],
      inventory: [{ key: itemKey, charges: ITEM_DEFS[itemKey].charges || 1 }],
      selectedOpt: "",
      allIn: false,
      resultText: "效果示例",
      competitionEffects: {},
    };
    card.innerHTML = GodPowerBattleCardView.render(
      group,
      {
        roundActive: false,
        evaluated: true,
        isLocked: true,
        sortLabel: "编号",
      },
      {
        badge: { foreground: "#fff", background: "#0f766e" },
        escapeHtml,
        itemVisual,
        itemName: (k) => ITEM_DEFS[k]?.name || "",
        groupNumber: () => "01",
      },
    );
    for (const node of [card, ...card.querySelectorAll("*")]) {
      for (const attribute of [...node.attributes])
        if (/^on/i.test(attribute.name) || attribute.name === "id")
          node.removeAttribute(attribute.name);
      if (node.matches("button,input,select")) node.disabled = true;
    }
    card.inert = true;
    return card;
  }
  function replay() {
    stopPreview();
    if (key && dialog?.open)
      releasePreview = BattleMotion.preview(
        dialog.querySelector(".gameplay-demo-card"),
        key,
      );
  }
  function mount() {
    if (dialog) return;
    dialog = document.createElement("dialog");
    dialog.id = "gameplayItemDialog";
    dialog.className = "gameplay-item-dialog";
    dialog.setAttribute("aria-labelledby", "gameplayItemTitle");
    dialog.innerHTML =
      '<section class="ui-function-surface gameplay-item-surface"><header><div class="item-reference-icon" data-item-dialog-icon></div><div><span class="ui-muted">道具说明</span><h3 id="gameplayItemTitle"></h3></div><button type="button" class="btn btn-sm" data-item-dialog-close aria-label="关闭道具说明">❌</button></header><section class="gameplay-item-section"><h4>实际效果</h4><p data-item-dialog-effect></p></section><section class="gameplay-item-section"><h4>使用技巧</h4><p data-item-dialog-tip></p><p class="ui-muted" data-item-dialog-funny></p></section><section class="gameplay-item-section"><div class="gameplay-demo-heading"><div><h4>卡片动画示例</h4><p class="ui-muted">示例不影响课堂积分、库存和历史。</p></div><button type="button" class="btn" data-item-preview-play>重播卡片效果</button></div><div data-item-demo-host></div></section></section>';
    dialog.querySelector("[data-item-dialog-close]").onclick = close;
    dialog.querySelector("[data-item-preview-play]").onclick = replay;
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close();
    });
    window.addEventListener("pagehide", () => {
      stopPreview();
      dialog.close();
    });
    document.body.append(dialog);
  }
  function open(itemKey) {
    if (!ITEM_DEFS[itemKey]) return;
    mount();
    DesktopUI.cancelWindowClose(dialog);
    stopPreview();
    key = itemKey;
    const entry = itemReferenceEntry(itemKey);
    dialog.querySelector("#gameplayItemTitle").textContent =
      entry.definition.name;
    dialog.querySelector("[data-item-dialog-icon]").innerHTML =
      itemVisual(itemKey);
    dialog.querySelector("[data-item-dialog-effect]").textContent = entry.exact;
    dialog.querySelector("[data-item-dialog-tip]").textContent = entry.tip;
    dialog.querySelector("[data-item-dialog-funny]").textContent = entry.funny;
    dialog
      .querySelector("[data-item-demo-host]")
      .replaceChildren(demoCard(itemKey));
    if (!releasePage)
      releasePage =
        window.GodPowerPageLifecycle?.current()?.add(() => {
          releasePage = null;
          stopPreview();
          DesktopUI.cancelWindowClose(dialog);
          dialog.close();
          key = null;
        }) || null;
    if (!dialog.open) dialog.showModal();
    const p = DesktopUI.getPreferences();
    const motion =
      p.motion !== "off" &&
      !(
        p.systemMotion && matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    const play = dialog.querySelector("[data-item-preview-play]");
    play.disabled = !motion || !p.itemFx;
    play.textContent = play.disabled ? "动效已在设置中关闭" : "重播卡片效果";
    if (motion && p.pageMotion) {
      const style = getComputedStyle(document.documentElement);
      dialog.querySelector(".gameplay-item-surface").animate(
        [
          { opacity: 0, translate: "0 24px" },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: 240 / p.speed,
          easing: style.getPropertyValue("--motion-ease").trim(),
          fill: "backwards",
        },
      );
    }
    replay();
  }
  return Object.freeze({ open, close, replay });
})();
