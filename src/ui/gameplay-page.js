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

  function buildRulesSection() {
    const rules = document.createElement("section");
    rules.className = "ui-settings-group gameplay-rules";

    const currentCfg =
      typeof getMkwDrawConfig === "function"
        ? getMkwDrawConfig()
        : ItemDrawPolicy.defaultConfig();
    const modes = ItemDrawPolicy.modes();
    const presets = ItemDrawPolicy.switchPresets();

    const header = document.createElement("div");
    header.className = "gameplay-mkw-head";
    header.innerHTML = `
      <div>
        <h3>${ic("rule")}<span>Mario Kart World (Product.180) 道具抽取与课堂机制说明</span></h3>
        <p>${E(ItemDrawPolicy.summary)}</p>
      </div>
      <button type="button" class="btn btn-sm" data-mkw-goto-settings>${ic("tune")}<span>前往设置调整抽取模式与预设</span></button>
    `;
    header
      .querySelector("[data-mkw-goto-settings]")
      ?.addEventListener("click", () => {
        if (typeof switchView === "function") switchView("settings");
        if (typeof showSettingsV26 === "function") showSettingsV26("items");
      });

    const stepsEl = document.createElement("div");
    stepsEl.className = "gameplay-mkw-section";
    stepsEl.innerHTML = `
      <h4>Product.180 六步抽取与参数管线</h4>
      <div class="gameplay-mkw-steps">
        <div class="gameplay-mkw-step"><b>1. 模式表与预设门控</b><p>从 <code>ItemGParam</code> 选定当前模式对应的 9+3 张官方权重表（标准赛/动态/COM/生存/气球/金币/纯蘑菇等），再叠加 <code>SwitchPreset P00–P14</code> 开关筛选。</p></div>
        <div class="gameplay-mkw-step"><b>2. 顺位映射与 ItemRankTable</b><p>小组名次映射至第 <code>1～24</code> 列，并查 <code>24×24</code> 阶梯表按开局经过时间限幅，避免开局即抽高顺位逆转大招。</p></div>
        <div class="gameplay-mkw-step"><b>3. 开局禁用延迟 (startFrame)</b><p><b>刺刺龟壳</b>（35s / 2100f）、<b>闪电</b>（45s / 2700f）、<b>鱿鱿</b>（25s / 1500f）、<b>炮弹刺客</b> 等强力道具在开局禁用期内锁权重；后顺位自带兜底回落，绝不空抽。</p></div>
        <div class="gameplay-mkw-step"><b>4. 间隔冷却与场上总上限</b><p>受 <code>IntervalLimit</code> 与 <code>NumLimit</code> 双控：<b>刺刺龟壳</b> 全局 90s 冷却且全场最多 1 个；<b>闪电</b> 冷却 45～90s 且全场最多 1 个；<b>鱿鱿</b> 冷却 12～45s 且全场最多 1 个。</p></div>
        <div class="gameplay-mkw-step"><b>5. 加权归一化与防重</b><p>按有效 <code>Ratio / sum</code> 概率抽选；<code>EnableSame</code> 关闭时自动避开本组当前手牌，保留官方 28 道具译名（如 <b>冲刺蘑菇</b>、<b>刺刺龟壳</b>、<b>黄金龟壳</b>、<b>？砖块</b>）。</p></div>
        <div class="gameplay-mkw-step"><b>6. 使用期 Rank 动态参数</b><p><b>鱿鱿</b>按 Rank 调整 <code>InkLevel (3/2/1)</code> 时长系数（1.0× / 0.75× / 0.5×）；<b>炮弹刺客</b>记录 <code>KillerTargetRank</code>；<b>闪电</b>记录各目标 <code>ThunderFrame</code> 缩小帧。</p></div>
      </div>
    `;

    const modeGridEl = document.createElement("div");
    modeGridEl.className = "gameplay-mkw-section";
    modeGridEl.innerHTML = `
      <h4>11+1 种官方模式一览（当前：${E(currentCfg.mode)} · 预设 ${E(currentCfg.switchPreset)}）</h4>
      <div class="gameplay-mkw-modes">
        ${modes
          .map(
            (m) =>
              `<div class="gameplay-mkw-mode-card"><code>${E(m.id)}</code> · <strong>${E(m.name)}</strong><div>表：${E(m.table)}${m.comTable ? ` / COM: ${E(m.comTable)}` : ""}</div></div>`,
          )
          .join("")}
      </div>
    `;

    const sampleRanks = [0, 3, 7, 11, 15, 19, 23];
    const paramRows = sampleRanks
      .map((r) => {
        const p = ItemDrawPolicy.paramByRank(r);
        const inkMult =
          p.inkLevel === 1 ? "0.50×" : p.inkLevel === 2 ? "0.75×" : "1.00×";
        return `<tr><td>Rank ${r + 1}</td><td>Level ${E(p.inkLevel)}（${inkMult}）</td><td>+${E(p.killerTargetRank)}</td><td>${E(p.thunderFrame)}f</td></tr>`;
      })
      .join("");

    const paramTableEl = document.createElement("div");
    paramTableEl.className = "gameplay-mkw-section";
    paramTableEl.innerHTML = `
      <h4>ItemParamByRankGParam 代表 Rank 参数表（第 1～24 Rank 实时映射）</h4>
      <div class="gameplay-mkw-table-wrap">
        <table class="gameplay-mkw-table">
          <thead>
            <tr><th>Rank</th><th>鱿鱿 InkLevel（时长倍率）</th><th>炮弹刺客 KillerTargetRank</th><th>闪电 ThunderFrame（缩小帧）</th></tr>
          </thead>
          <tbody>${paramRows}</tbody>
        </table>
      </div>
    `;

    const lookupEl = document.createElement("div");
    lookupEl.className = "gameplay-mkw-section";
    let simMode = currentCfg.mode;
    let simPreset = currentCfg.switchPreset;
    let simRank = 1;
    let simTotal = 12;

    const lookupHeader = document.createElement("h4");
    lookupHeader.textContent = "快速概率试算与热点道具预览";
    const lookupBar = document.createElement("div");
    lookupBar.className = "gameplay-mkw-lookup";
    lookupBar.innerHTML = `
      <label>模式 <select data-mkw-lookup="mode">${modes.map((m) => `<option value="${E(m.id)}" ${m.id === simMode ? "selected" : ""}>${E(m.id)} (${E(m.name)})</option>`).join("")}</select></label>
      <label>预设 <select data-mkw-lookup="preset"><option value="ALL">ALL (全开)</option>${presets.map((p) => `<option value="${E(p.id)}" ${p.id === simPreset ? "selected" : ""}>${E(p.id)}</option>`).join("")}</select></label>
      <label>顺位 <input type="number" min="1" max="24" value="${simRank}" data-mkw-lookup="rank"></label>
      <label>总组数 <input type="number" min="1" max="24" value="${simTotal}" data-mkw-lookup="total"></label>
    `;
    const lookupOut = document.createElement("div");
    lookupOut.className = "gameplay-mkw-pills";

    const updateLookup = () => {
      const clampedTotal = Math.max(1, Math.min(24, Number(simTotal) || 12));
      const clampedRank = Math.max(
        1,
        Math.min(clampedTotal, Number(simRank) || 1),
      );
      const evalRes = ItemDrawPolicy.evaluate({
        config: { ...currentCfg, mode: simMode, switchPreset: simPreset },
        position: clampedRank,
        total: clampedTotal,
        elapsedFrames: Infinity,
      });
      const sum = Object.values(evalRes.weights).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0,
      );
      const top = Object.entries(evalRes.weights)
        .filter(([, w]) => w > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
      lookupOut.innerHTML = top.length
        ? top
            .map(([k, w]) => {
              const name = ITEM_DEFS?.[k]?.name || k;
              const pct = sum > 0 ? ((w / sum) * 100).toFixed(1) : "0.0";
              return `<span class="gameplay-mkw-pill"><strong>${E(name)}</strong><span>权重 ${w} · ${pct}%</span></span>`;
            })
            .join("")
        : `<span class="gameplay-mkw-pill">当前配置无正权重候选</span>`;
    };

    lookupBar.querySelectorAll("[data-mkw-lookup]").forEach((el) => {
      el.addEventListener("change", () => {
        const k = el.dataset.mkwLookup;
        if (k === "mode") simMode = el.value;
        else if (k === "preset") simPreset = el.value;
        else if (k === "rank") simRank = Number(el.value) || 1;
        else if (k === "total") simTotal = Number(el.value) || 12;
        updateLookup();
      });
    });
    updateLookup();
    lookupEl.append(lookupHeader, lookupBar, lookupOut);

    const extra = document.createElement("p");
    extra.className = "gameplay-mkw-section";
    extra.textContent =
      "随机事件每 4～8 轮正式判题自动触发（可在「设置 → 规则」启停或调权）；成就与荣誉仅记录课堂正式对抗事件，撤销时与本步状态原子回滚。";

    rules.append(header, stepsEl, modeGridEl, paramTableEl, lookupEl, extra);
    return rules;
  }

  function render() {
    const host = document.getElementById("gameplayContent");
    if (!host) return;
    host.innerHTML = itemReferenceMarkup();
    host.prepend(buildRulesSection());
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
