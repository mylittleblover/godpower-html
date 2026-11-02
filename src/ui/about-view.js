/* About owns presentation; item data tables remain in their existing modules. */
function cleanAboutVisibleCopy() {
  const about = document.getElementById("aboutMain");
  if (about) {
    const walker = document.createTreeWalker(about, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      n.nodeValue = n.nodeValue
        .replace(/原来的\s*音乐设置已经退休[^。]*。?/g, "")
        .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g, "")
        .replace(/旧版音乐参数面板/g, "音乐设置")
        .replace(/说明已同步当前道具规则/g, "直接说明实际效果");
    });
  }
}

function renderAboutItems(tab) {
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));
  const m = document.getElementById("aboutMain");
  if (!m) return;
  m.innerHTML = `<div class="item-reference-head">
    <div><h2>28 种道具百科</h2><div class="item-reference-sub">规则很严肃，介绍决定不配合。</div></div>
    <button class="btn btn-sm" onclick="closeAbout()">关闭</button>
  </div>
  <div class="item-reference-general">
    <b>📖 百科阅读须知：</b>
    这里的吐槽负责让你愿意把 28 种道具看完，下面的“实际效果”才负责在比赛时救你的命。
    第一次手动举手抽取仍使用特殊等概率池；答题期间主动使用道具后不能 All In；三重道具则可以继续消耗同一件道具的剩余次数。
    总之，规则不会因为文案开始讲冷笑话就放你一马。
  </div>
  <div class="item-reference-list">
    ${ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k])
      .map((k) => {
        const d = ITEM_DEFS[k];
        const exact =
          (typeof GROUP_ITEM_DESC_V2182 !== "undefined" &&
            GROUP_ITEM_DESC_V2182[k]) ||
          (typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715 !== "undefined" &&
            ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k]) ||
          d.desc ||
          "";
        const funny =
          ITEM_FUNNY_COPY_V2184[k] ||
          "它有自己的工作，而且暂时没有向策划提交辞职申请。";
        const tag = ITEM_FUNNY_TAG_V2184[k] || "道具";
        const tip =
          ITEM_TIPS_OVERRIDE_V2199[k] ||
          (typeof ITEM_TIPS_V218 !== "undefined" && ITEM_TIPS_V218[k]) ||
          "根据排名和当前局势使用，别只因为图标好看就按。";
        return `<div class="item-reference-row">
        <div class="item-reference-icon">${itemVisual(k, "item-reference-img")}</div>
        <div class="item-reference-copy">
          <div class="item-reference-name">${escapeHtml(d.name)} <span style="font-size:11px;font-weight:800;color:#0f766e;background:#eaf7f4;border-radius:999px;padding:3px 7px;margin-left:5px">${escapeHtml(tag)}</span></div>
          <div class="item-reference-desc" style="margin-top:7px;color:#334e49;line-height:1.65">${escapeHtml(funny)}</div>
          <div class="item-reference-tip"><b>实际效果：</b>${escapeHtml(exact)}</div>
          <div class="item-reference-tip" style="background:#fff8eb;color:#6f5830"><b style="color:#b66a00">使用技巧：</b>${escapeHtml(tip)}</div>
        </div>
      </div>`;
      })
      .join("")}
  </div>
  ${competitionStatusGuideMarkup()}`;
}
function renderAboutInformation(tab) {
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));
  const m = document.getElementById("aboutMain");
  if (!m) return;

  if (tab === "info") {
    m.innerHTML = `<div class="about-heading">
      <h2>这玩意儿到底是什么</h2>
      <button class="btn btn-sm" onclick="closeAbout()">看懂了，撤</button>
    </div>
    <div class="guide-block">
      <b>“上帝（马克思）的力量”课堂积分与道具系统</b><br>
      负责记分、PK、随机点名、举手奖励、28 种道具、历史回滚、结算档案、音效音乐和名单管理。
      该复杂的地方交给后台，该按一下解决的事情就别逼老师开三层菜单。
    </div>
    <div class="guide-block">
      平时尽量一键操作，复杂东西藏到后台。功能确实不少，毕竟课堂一旦开始认真做需求，按钮就会像蘑菇一样自己长出来。
    </div>`;
    return;
  }

  m.innerHTML = `<div class="about-heading">
    <h2>别乱按指南</h2>
    <button class="btn btn-sm" onclick="closeAbout()">我大概会了</button>
  </div>
  <div class="guide-block"><b>🧠 PK：</b>各组答完统一判定。知识负责决定对错，系统负责把对错变成分数和排名。</div>
  <div class="guide-block"><b>🎁 命运批发部：</b>给符合条件的小组统一抽道具。满背包和负分保护组会自动退出这场命运分配。</div>
  <div class="guide-block"><b>✋ 举手办案处：</b>选举手小组、判正误、加分、抽道具、用道具，一条龙处理，省得老师在五个窗口之间练手速。</div>
  <div class="guide-block"><b>🎰 天选之人：</b>个人、小组、先组后人都能抽。算法没有私人恩怨，被点到纯属数学。</div>
  <div class="guide-block"><b>🤑 精准撒币：</b>按学号、姓名首字母或小组筛人，批量给所属小组加分。多人同组会累计，钱终于有账可查。</div>
  <div class="guide-block"><b>🔒 上帝模式：</b>需要密码后才能改那些正常比赛不该随便碰的东西。不是因为系统怀疑你，只是因为“手滑”在人类历史上战绩辉煌。</div>
  <div class="guide-block"><b>↩️ 时间倒流：</b>历史记录能回滚。犯错不可怕，可怕的是犯错以后还没有撤销按钮。</div>`;
}
