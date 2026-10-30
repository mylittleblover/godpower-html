const DOCK_HUMOR_V2185 = {
  roundStatusBadge: {
    name: "战况播报",
    copy: "负责告诉你现在到底是在答题、结算，还是全班集体等待某个人终于按下按钮。",
  },
  correctAnswer: {
    name: "标准答案投票站",
    copy: "A、B、C、D 四选一。请谨慎决定，毕竟按错以后最先怀疑人生的通常不是学生，是老师。",
  },
  btnMainAction: {
    name: "主线推进器",
    copy: "开始、判定之类的大事都归它管。一个按钮承担了比很多项目经理还多的职责。",
  },
  btnNextRound: {
    name: "翻篇",
    copy: "这一题的恩怨到此为止。下一题会带来新的知识，也可能带来新的红龟壳。",
  },
  btnForceEnd: {
    name: "到此为止",
    copy: "当场面已经不值得继续等下去时使用。教育工作偶尔也需要一个“别磨蹭了”的按钮。",
  },
  btnFinalSettlement: {
    name: "🏆 封神榜",
    copy: "把整场比赛正式结算。有人登顶，有人陪跑，还有人终于发现刚才那个 All In 真的不该按。",
  },
  globalItemDraw: {
    name: "🎁 命运批发部",
    copy: "给所有符合条件的小组统一抽道具。公平地把随机性分发给每一个人，听起来甚至有点庄严。",
  },
  handRaise: {
    name: "✋ 举手办案处",
    copy: "谁举手、谁答对、谁拿奖励，都在这里处理。课堂参与度从此拥有了可点击界面。",
  },
  picker: {
    name: "🎰 天选之人",
    copy: "随机点名。算法没有私人恩怨，所以被抽到时请不要盯着屏幕看，它也不会心虚。",
  },
  about: {
    name: "ⓘ 规则与冷知识",
    copy: "功能说明、道具百科以及一些本来没人会主动阅读，但出了问题大家都会回来找的东西。",
  },
  memberSearch: {
    name: "😎 人肉搜索（文明版）",
    copy: "按姓名或学号找人。放心，只查课堂名单，不会顺着网线去翻对方十年前的空间动态。",
  },
  undo: {
    name: "↩️ 时间倒流",
    copy: "撤销上一步。人类文明最伟大的发明之一，仅次于“保存”和“我刚才没看见”。",
  },
  godMode: {
    name: "🔒 上帝模式",
    copy: "解锁后可以修改那些正常比赛不该随便碰的东西。既然叫上帝模式，自然要先输入密码证明神迹合法。",
  },
  addGroup: {
    name: "➕ 扩编",
    copy: "再增加一个小组。班级规模不够大没关系，软件可以先替现实膨胀。",
  },
  zoomIn: {
    name: "🔍⁺ 看仔细点",
    copy: "放大界面。适合后排看不清，或者单纯想确认某组到底是不是只剩 1 分。",
  },
  zoomOut: {
    name: "🔍⁻ 看全一点",
    copy: "缩小界面。组太多的时候，人类终于承认屏幕面积是一种有限资源。",
  },
  zoomReset: {
    name: "🔍↺ 当我没缩放过",
    copy: "恢复默认比例。把刚才所有放大缩小的艺术探索一键送回现实。",
  },
  quickPerson: {
    name: "🤑 精准撒币",
    copy: "按学号、姓名首字母或小组筛人，然后批量加分。撒分可以，至少至少这次账目清清楚楚。",
  },
};

let dockHumorTipV2185 = null;
function ensureDockHumorTipV2185() {
  if (dockHumorTipV2185) return dockHumorTipV2185;
  const el = document.createElement("div");
  el.className = "dock-humor-tip-v2185";
  document.body.appendChild(el);
  dockHumorTipV2185 = el;
  return el;
}
function bindDockHumorV2185(el, key) {
  const d = DOCK_HUMOR_V2185[key];
  if (!el || !d || el.dataset.humorBoundV2185) return;
  el.dataset.humorBoundV2185 = "1";
  el.removeAttribute("title");
  el.addEventListener("mouseenter", () => {
    const tip = ensureDockHumorTipV2185();
    tip.innerHTML = `<b>${escapeHtml(d.name)}</b><span>${escapeHtml(d.copy)}</span>`;
    const r = el.getBoundingClientRect();
    tip.style.left = "0px";
    tip.style.top = "0px";
    tip.classList.add("show");
    const tr = tip.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    left = Math.max(8, Math.min(innerWidth - tr.width - 8, left));
    let top = r.top - tr.height - 9;
    if (top < 8) top = r.bottom + 9;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  });
  el.addEventListener("mouseleave", () =>
    ensureDockHumorTipV2185().classList.remove("show"),
  );
}

function applyDockHumorV2185() {
  const dock = document.querySelector(".bottom-dock");
  if (!dock) return;

  bindDockHumorV2185(
    document.getElementById("roundStatusBadge"),
    "roundStatusBadge",
  );

  const ansWrap = [...dock.querySelectorAll(".dock-left>div")].find((x) =>
    x.querySelector(".ans-btn"),
  );
  if (ansWrap) {
    bindDockHumorV2185(ansWrap, "correctAnswer");
    const label = ansWrap.querySelector("span");
    if (label) label.textContent = "标准答案:";
    ansWrap
      .querySelectorAll(".ans-btn")
      .forEach((btn) => btn.removeAttribute("title"));
  }

  bindDockHumorV2185(document.getElementById("btnMainAction"), "btnMainAction");

  const next = document.getElementById("btnNextRound");
  if (next) {
    if (next.textContent !== "翻篇") next.textContent = "翻篇";
    bindDockHumorV2185(next, "btnNextRound");
  }

  const force = document.getElementById("btnForceEnd");
  if (force) {
    if (force.textContent !== "到此为止") force.textContent = "到此为止";
    bindDockHumorV2185(force, "btnForceEnd");
  }

  const finalBtn = document.getElementById("btnFinalSettlement");
  if (finalBtn) {
    if (finalBtn.textContent !== "🏆 封神榜")
      finalBtn.textContent = "🏆 封神榜";
    bindDockHumorV2185(finalBtn, "btnFinalSettlement");
  }

  const byOnclick = (needle) =>
    [...dock.querySelectorAll("button")].find((b) =>
      (b.getAttribute("onclick") || "").includes(needle),
    );
  bindDockHumorV2185(byOnclick("globalItemDraw"), "globalItemDraw");
  bindDockHumorV2185(byOnclick("openHandRaise"), "handRaise");
  bindDockHumorV2185(byOnclick("openPickerModal"), "picker");
  bindDockHumorV2185(byOnclick("openAbout"), "about");
  bindDockHumorV2185(byOnclick("openMemberSearchModal"), "memberSearch");
  bindDockHumorV2185(document.getElementById("btnUndo"), "undo");
  bindDockHumorV2185(document.getElementById("lockBtn"), "godMode");
  bindDockHumorV2185(byOnclick("addGroup"), "addGroup");
  bindDockHumorV2185(byOnclick("zoomIn"), "zoomIn");
  bindDockHumorV2185(byOnclick("zoomOut"), "zoomOut");
  bindDockHumorV2185(byOnclick("zoomReset"), "zoomReset");

  const qp = document.getElementById("quickPersonBtnV218");
  if (qp) bindDockHumorV2185(qp, "quickPerson");
}

applyDockHumorV2185();
setTimeout(applyDockHumorV2185, 0);
setTimeout(applyDockHumorV2185, 250);

/* V2.18.6：移除会自触发的底栏 MutationObserver。
   底栏按钮本身是固定结构，初始化 + 延时补绑已经足够。 */
if (typeof renderLockState === "function") {
  const _v2185RenderLockState = renderLockState;
  renderLockState = function () {
    const r = _v2185RenderLockState.apply(this, arguments);
    const btn = document.getElementById("lockBtn");
    if (btn) {
      btn.dataset.humorBoundV2185 = "";
      bindDockHumorV2185(btn, "godMode");
    }
    return r;
  };
}
