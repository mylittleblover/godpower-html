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

function renderAboutItems() {
  return GameplayPage.open();
}
function itemReferenceEntry(k) {
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
  return { definition: d, exact, funny, tag, tip };
}
const ITEM_UI_CATEGORY = {
  green: "attack",
  triple_green: "attack",
  red: "attack",
  triple_red: "attack",
  banana: "attack",
  triple_banana: "attack",
  fire_flower: "attack",
  ice_flower: "attack",
  boomerang_flower: "attack",
  bomb: "attack",
  hammer: "attack",
  spiny: "attack",
  feather: "defense",
  horn: "defense",
  star: "defense",
  mega: "defense",
  coin: "boost",
  coin_shell: "boost",
  mushroom: "boost",
  triple_mushroom: "boost",
  bullet: "boost",
  power: "boost",
  boo: "special",
  blooper: "special",
  lightning: "special",
  question: "team",
  kamek: "special",
  item_box: "team",
};
function itemReferenceMarkup() {
  const itemCount = ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k]).length;
  return `<div class="gameplay-section-heading"><p class="ui-muted">${itemCount} 种正式道具 · 实际效果以当前课堂规则为准，点击卡片查看说明与动画示例。</p></div>
  <div class="item-reference-general">
    <b>使用前请留意</b>
    随机范围道具只从当前前三名与最后两名的合法目标中抽取。首次手动举手抽取使用特殊等概率池；答题期间使用道具后不能 All In。同一枚多次使用道具可以继续使用剩余次数。
  </div>
  <div class="item-reference-list">
    ${ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k])
      .map((k) => {
        const { definition: d, exact, tag } = itemReferenceEntry(k);
        const category = ITEM_UI_CATEGORY[k] || "special";
        return `<article class="item-reference-row" data-item-key="${escapeHtml(k)}" data-item-category="${category}">
        <div class="item-reference-icon">${itemVisual(k, "item-reference-img")}</div>
        <div class="item-reference-copy">
          <div class="item-reference-name">${escapeHtml(d.name)} <span class="item-reference-tag" data-item-category="${category}">${escapeHtml(tag)}</span></div>
          <div class="item-reference-tip"><p>${escapeHtml(exact)}</p></div>
          <button type="button" class="btn btn-sm item-reference-open" data-item-details="${escapeHtml(k)}">查看详情与演示</button>
        </div>
      </article>`;
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

  const ic = (k) =>
    typeof GodpowerTheme !== "undefined" &&
    typeof GodpowerTheme.icon === "function"
      ? GodpowerTheme.icon(k)
      : "";
  m.innerHTML = `<div class="about-heading">
    <h2>${ic("info")}<span>别乱按指南</span></h2>
    <button class="btn btn-sm" onclick="closeAbout()">我大概会了</button>
  </div>
  <div class="guide-block"><b>${ic("battle")}<span>PK：</span></b>各组答完统一判定。知识负责决定对错，系统负责把对错变成分数和排名。</div>
  <div class="guide-block"><b>${ic("gift")}<span>命运批发部：</span></b>给符合条件的小组统一抽道具。满背包和负分保护组会自动退出这场命运分配。</div>
  <div class="guide-block"><b>${ic("hand")}<span>举手办案处：</span></b>选举手小组、判正误、加分、抽道具、用道具，一条龙处理，省得老师在五个窗口之间练手速。</div>
  <div class="guide-block"><b>${ic("casino")}<span>天选之人：</span></b>个人、小组、先组后人都能抽。算法没有私人恩怨，被点到纯属数学。</div>
  <div class="guide-block"><b>${ic("bolt")}<span>精准撒币：</span></b>按学号、姓名首字母或小组筛人，批量给所属小组加分。多人同组会累计，钱终于有账可查。</div>
  <div class="guide-block"><b>${ic("lock")}<span>上帝模式：</span></b>需要密码后才能改那些正常比赛不该随便碰的东西。不是因为系统怀疑你，只是因为“手滑”在人类历史上战绩辉煌。</div>
  <div class="guide-block"><b>${ic("undo")}<span>时间倒流：</span></b>历史记录能回滚。犯错不可怕，可怕的是犯错以后还没有撤销按钮。</div>`;
}
