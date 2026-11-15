/* First-level gameplay reference; data and copy remain in their existing owners. */
(function installGameplayPage(root) {
  "use strict";
  let tab = "items",
    bound = false;
  const E = (value) =>
    typeof escapeHtml === "function"
      ? escapeHtml(value)
      : String(value ?? "").replace(
          /[&<>"]/g,
          (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
        );

  const CATEGORY_NAMES = Object.freeze({
    learning: "学习表现",
    competition: "竞技战绩",
    collection: "道具收藏",
    tactics: "道具战术",
    honors: "封神荣誉",
    hidden: "隐藏成就",
  });

  const EVENT_CATEGORY_NAMES = Object.freeze({
    score: "得分狂欢",
    item: "道具补给",
    status: "状态与防护",
    comeback: "追赶逆转",
    special: "特殊机制",
  });

  function ic(name) {
    return typeof GodpowerTheme !== "undefined" &&
      typeof GodpowerTheme.icon === "function"
      ? GodpowerTheme.icon(name)
      : "";
  }

  function buildEventsSection() {
    const section = document.createElement("section");
    section.className = "gameplay-mechanics-panel gameplay-random-events";
    const list =
      typeof RandomEvents !== "undefined" ? RandomEvents.CATALOG : [];
    const cards = list
      .map((ev) => {
        const cat = EVENT_CATEGORY_NAMES[ev.category] || ev.category;
        const timing = ev.duration > 0 ? `持续 ${ev.duration} 轮` : "即时触发";
        const notes = [];
        if (ev.cooldown) notes.push(`冷却 ${ev.cooldown} 次事件`);
        if (ev.conflictsWith?.length)
          notes.push(`与 ${ev.conflictsWith.join("/")} 互斥`);
        return `<article class="item-reference-row gameplay-mech-card">
          <div class="gameplay-mech-badge" data-mech-cat="${E(ev.category)}">${E(ev.id)}</div>
          <div class="item-reference-copy">
            <div class="item-reference-name"><strong>${E(ev.name)}</strong><span class="item-reference-tag">${E(cat)}</span><span class="ui-chip">${E(timing)}</span><span class="ui-chip">${E(ev.scope)}</span></div>
            <p>${E(ev.description)}</p>
            ${notes.length ? `<small class="ui-muted">${E(notes.join(" · "))}</small>` : ""}
          </div>
        </article>`;
      })
      .join("");

    section.innerHTML = `
      <div class="ui-settings-group gameplay-mech-overview">
        <h3>${ic("casino")}<span>全自动随机事件机制说明（EV01–EV16）</span></h3>
        <div class="gameplay-mech-rules-grid">
          <div><b>触发节奏</b><p>每局以可序列化 PRNG 在 <code>4～8</code> 个正式判题回合间随机触发；跳过题目、单独使用道具及撤销均不推进计数。关闭机制时倒计时自动暂停。</p></div>
          <div><b>生效与公平</b><p>持续类事件（如双倍狂欢、黄金时刻、和平协定）均从<strong>触发后的下一轮</strong>正式判题生效，触发当轮不享加成（CR-03），全流程无阻塞确认弹窗。</p></div>
          <div><b>冷却、互斥与撤销</b><p>同一事件禁止连续触发；<code>EV05 道具雨</code> 与 <code>EV09 魔法风暴</code> 触发后各冷却 2 次成功事件；<code>EV10 和平协定</code> 与 <code>EV12 混乱磁场</code> 互斥；撤销答题会原子回滚事件效果与随机数序列。</p></div>
        </div>
      </div>
      <div class="gameplay-mech-cards">${cards}</div>
    `;
    return section;
  }

  function isUnlockedAnywhere(id) {
    const groups = state?.achievementLedger?.groups;
    if (!groups || typeof groups !== "object") return false;
    return Object.values(groups).some(
      (g) =>
        !!g?.permanentUnlocks?.[id] ||
        !!g?.seasonUnlocks?.[id] ||
        !!g?.archivedUnlocks?.[id],
    );
  }

  function buildAchievementsSection() {
    const section = document.createElement("section");
    section.className = "gameplay-mechanics-panel gameplay-achievements-guide";
    const list =
      typeof AchievementCatalog !== "undefined"
        ? AchievementCatalog.list()
        : [];
    const cards = list
      .map((entry) => {
        const unlocked = isUnlockedAnywhere(entry.id);
        const masked = entry.hidden && !unlocked;
        const cat = CATEGORY_NAMES[entry.category] || entry.category;
        return `<article class="item-reference-row gameplay-mech-card" data-rarity="${E(entry.rarity)}">
          <div class="gameplay-mech-badge" data-mech-cat="${E(entry.category)}">${E(entry.id.replace("ACH-", ""))}</div>
          <div class="item-reference-copy">
            <div class="item-reference-name">
              <strong>${E(masked ? "？？？ · 隐藏成就" : entry.name)}</strong>
              <span class="item-reference-tag">${E(cat)}</span>
              <span class="ui-chip">${E(entry.rarity)}</span>
              ${unlocked ? `<span class="ui-chip" style="color:#047857;border-color:#a7f3d0;">本档已解锁</span>` : ""}
            </div>
            <p>${E(masked ? "隐藏条件成就：在课堂真实对抗中触发特定时机后自动揭晓并解锁。" : entry.condition)}</p>
          </div>
        </article>`;
      })
      .join("");

    section.innerHTML = `
      <div class="ui-settings-group gameplay-mech-overview">
        <h3>${ic("trophy")}<span>成就与封神荣誉机制说明（共 60 项）</span></h3>
        <div class="gameplay-mech-rules-grid">
          <div><b>唯一真实来源</b><p>成就仅由课堂正式事件推进（正式判题、正规道具抽取与生效、防御成功及封神榜归档）；手动直接加减分与导入旧存档绝不触发或伪造成就。</p></div>
          <div><b>双层生命周期</b><p>单赛季连击与赛季进度在封神榜结算开启新赛季时重置；跨赛季累计次数与已获得的永久荣誉奖杯永久保留，并可在「档案 → 成就与荣誉」按小组查看。</p></div>
          <div><b>原子撤回与隐藏机制</b><p>每次触发均可被主界面撤销同批次原子回滚，防止误操作残留虚假荣誉。其中 8 项为隐藏成就（ACH-053～ACH-060），解锁前默认隐藏具体触发条件。</p></div>
        </div>
      </div>
      <div class="gameplay-mech-cards">${cards}</div>
    `;
    return section;
  }

  function filter() {
    const host = document.getElementById("gameplayContent");
    if (!host) return;
    const query = (document.getElementById("gameplaySearch")?.value || "")
      .trim()
      .toLocaleLowerCase();
    const items = host.querySelector(":scope > .item-reference-list");
    const statuses = host.querySelector(".competition-status-guide");
    const eventsSection = host.querySelector(".gameplay-random-events");
    const achievementsSection = host.querySelector(
      ".gameplay-achievements-guide",
    );
    const heading = host.querySelector(".gameplay-section-heading");
    const rules = host.querySelector(".gameplay-rules");
    const general = host.querySelector(".item-reference-general");

    if (heading) heading.hidden = tab !== "items";
    if (items) items.hidden = tab !== "items";
    if (statuses) statuses.hidden = tab !== "statuses";
    if (eventsSection) eventsSection.hidden = tab !== "events";
    if (achievementsSection)
      achievementsSection.hidden = tab !== "achievements";
    if (rules) rules.hidden = tab !== "rules";
    if (general) general.hidden = tab !== "rules";

    let visible = 0;
    const activeContainer =
      tab === "statuses"
        ? statuses
        : tab === "events"
          ? eventsSection
          : tab === "achievements"
            ? achievementsSection
            : items;
    if (tab !== "rules" && activeContainer) {
      for (const row of activeContainer.querySelectorAll(
        ".item-reference-row",
      )) {
        const show =
          !query || row.textContent.toLocaleLowerCase().includes(query);
        row.hidden = !show;
        if (show) visible++;
      }
    }
    const emptyEl = document.getElementById("gameplayEmpty");
    if (emptyEl) emptyEl.hidden = tab === "rules" || visible > 0;
    const searchInput = document.getElementById("gameplaySearch");
    if (searchInput) searchInput.disabled = tab === "rules";

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
    title.innerHTML = `${ic("rule")}<span>当前抽取与课堂机制说明</span>`;
    const copy = document.createElement("p");
    copy.textContent = ItemDrawPolicy.summary;
    const extra = document.createElement("p");
    extra.textContent =
      "随机事件每 4～8 轮正式判题自动触发（可在「设置 → 规则」启停或调权）；成就与荣誉仅记录课堂正式对抗事件，撤销时与本步状态原子回滚。";
    rules.append(title, copy, extra);
    host.prepend(rules);
    host.append(buildEventsSection(), buildAchievementsSection());
    const countEl = document.querySelector("[data-gameplay-items-count]");
    if (countEl && typeof ITEM_KEYS !== "undefined")
      countEl.textContent = ITEM_KEYS.length;
    if (!bound) {
      bound = true;
      host.addEventListener("click", (event) => {
        const button = event.target.closest("[data-item-details]");
        if (button) GameplayItemDialog.open(button.dataset.itemDetails);
      });
      document
        .getElementById("gameplaySearch")
        ?.addEventListener("input", filter);
      document
        .querySelector(".gameplay-tabs")
        ?.addEventListener("click", (event) => {
          const button = event.target.closest("[data-gameplay-tab]");
          if (!button) return;
          tab = button.dataset.gameplayTab;
          filter();
        });
    }
    filter();
  }

  function openTab(nextTab) {
    if (nextTab) tab = nextTab;
    filter();
  }

  function open() {
    switchView("gameplay");
  }

  function mountAbout(parent) {
    if (!parent || document.getElementById("aboutMain")) return;
    const section = document.createElement("section");
    section.className = "ui-settings-card gameplay-about-settings";
    section.innerHTML = `<nav class="gameplay-about-tabs" aria-label="关于与帮助"><button type="button" class="btn" data-about="info">${ic("info")}<span>项目与版本</span></button><button type="button" class="btn" data-about="guide">${ic("book")}<span>操作帮助</span></button></nav><div id="aboutMain" class="about-main"></div>`;
    section.addEventListener("click", (event) => {
      const button = event.target.closest("[data-about]");
      if (button) renderAbout(button.dataset.about);
    });
    parent.append(section);
    renderAboutInformation("info");
  }

  root.GameplayPage = Object.freeze({ render, open, openTab, mountAbout });
})(globalThis);
