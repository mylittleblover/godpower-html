/* First-level gameplay reference; data and copy remain in their existing owners. */
(function installGameplayPage(root) {
  "use strict";
  let tab = "items",
    bound = false;
  function filter() {
    const host = document.getElementById("gameplayContent");
    const query = document
      .getElementById("gameplaySearch")
      .value.trim()
      .toLocaleLowerCase();
    const items = host.querySelector(":scope > .item-reference-list");
    const statuses = host.querySelector(".competition-status-guide");
    host.querySelector(".gameplay-section-heading").hidden = tab !== "items";
    items.hidden = tab !== "items";
    statuses.hidden = tab !== "statuses";
    host.querySelector(".gameplay-rules").hidden = tab !== "rules";
    host.querySelector(".item-reference-general").hidden = tab !== "rules";
    let visible = 0;
    const list = tab === "statuses" ? statuses : items;
    for (const row of list.querySelectorAll(".item-reference-row")) {
      row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
      if (!row.hidden) visible++;
    }
    document.getElementById("gameplayEmpty").hidden =
      tab === "rules" || visible > 0;
    document.getElementById("gameplaySearch").disabled = tab === "rules";
    document.querySelectorAll("[data-gameplay-tab]").forEach((button) => {
      const selected = button.dataset.gameplayTab === tab;
      button.setAttribute("aria-current", String(selected));
      button.classList.toggle("btn-primary", selected);
    });
  }
  function render() {
    const host = document.getElementById("gameplayContent");
    if (!host) return;
    host.innerHTML = itemReferenceMarkup();
    const rules = document.createElement("section");
    rules.className = "ui-settings-group gameplay-rules";
    const title = document.createElement("h3");
    title.textContent = "当前抽取规则";
    const copy = document.createElement("p");
    copy.textContent = ItemDrawPolicy.summary;
    rules.append(title, copy);
    host.prepend(rules);
    document.querySelector("[data-gameplay-items-count]").textContent =
      ITEM_KEYS.length;
    if (!bound) {
      bound = true;
      host.addEventListener("click", (event) => {
        const button = event.target.closest("[data-item-details]");
        if (button) GameplayItemDialog.open(button.dataset.itemDetails);
      });
      document
        .getElementById("gameplaySearch")
        .addEventListener("input", filter);
      document
        .querySelector(".gameplay-tabs")
        .addEventListener("click", (event) => {
          const button = event.target.closest("[data-gameplay-tab]");
          if (!button) return;
          tab = button.dataset.gameplayTab;
          filter();
        });
    }
    filter();
  }
  function open() {
    switchView("gameplay");
  }
  function mountAbout(parent) {
    if (!parent || document.getElementById("aboutMain")) return;
    const section = document.createElement("section");
    section.className = "ui-settings-card gameplay-about-settings";
    section.innerHTML =
      '<nav class="gameplay-about-tabs" aria-label="关于与帮助"><button type="button" class="btn" data-about="info">项目与版本</button><button type="button" class="btn" data-about="guide">操作帮助</button></nav><div id="aboutMain" class="about-main"></div>';
    section.addEventListener("click", (event) => {
      const button = event.target.closest("[data-about]");
      if (button) renderAbout(button.dataset.about);
    });
    parent.append(section);
    renderAboutInformation("info");
  }
  root.GameplayPage = Object.freeze({ render, open, mountAbout });
})(globalThis);
