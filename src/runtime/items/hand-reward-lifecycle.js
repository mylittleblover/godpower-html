let handItemDrawTimer = null,
  handItemDrawFinishTimer = null,
  handItemDrawGroupId = null,
  handItemPendingKey = null,
  handItemDrawStartedAt = 0;

function cancelHandItemDraw(silent = false) {
  if (handItemDrawTimer) {
    clearInterval(handItemDrawTimer);
    handItemDrawTimer = null;
  }
  if (handItemDrawFinishTimer) {
    clearTimeout(handItemDrawFinishTimer);
    handItemDrawFinishTimer = null;
  }
  const wasPending = handItemDrawGroupId != null && handItemPendingKey == null;
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  if (wasPending && !silent) showToast("本次道具抽取已取消");
}

const _v21CloseHandRaise = closeHandRaise;
closeHandRaise = function () {
  cancelHandItemDraw(true);
  _v21CloseHandRaise();
};

const _v21SelectHandGroup = selectHandGroup;
selectHandGroup = function (id) {
  if (handItemDrawTimer) {
    showToast("道具正在抽取，请等待结果");
    return;
  }
  _v21SelectHandGroup(id);
};

const _v21JudgeHandRaise = judgeHandRaise;
judgeHandRaise = function (correct) {
  cancelHandItemDraw(true);
  _v21JudgeHandRaise(correct);
  if (correct) {
    const g = state.groups.find((x) => x.id === handRaiseGroupId);
    const btn = [...document.querySelectorAll("#handRewardBox button")].find(
      (b) => b.textContent.includes("抽取道具"),
    );
    if (btn && g && (!eligibleForItems(g) || g.inventory.length >= 3)) {
      btn.disabled = true;
      btn.style.opacity = ".45";
      btn.title =
        g.score < 0 ? "负分状态禁止获得任何道具" : "三个道具槽均已占用";
    }
  }
};

function finishHandItemReward() {
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  const box = document.getElementById("handRewardBox");
  if (box)
    box.innerHTML =
      '<div class="hand-rewards"><b>奖励已发放并存入道具槽。</b></div>';
}

function handUseNewItem() {
  const gid = handItemDrawGroupId,
    k = handItemPendingKey;
  const g = state.groups.find((x) => x.id === gid);
  if (!g || !k) {
    showToast("新道具已不存在");
    return;
  }
  const idx = g.inventory.map((x) => x.key).lastIndexOf(k);
  if (idx < 0) {
    showToast("新道具已不存在");
    return;
  }
  handItemDrawGroupId = null;
  handItemPendingKey = null;
  handItemDrawStartedAt = 0;
  closeHandRaise();
  openItemWindow(g.id, "items");
  globalThis.HandItemCinematic?.mark(g.id);
  setTimeout(() => {
    const cards = [...document.querySelectorAll("#itemWindowBody .item-card")];
    if (cards[idx]) {
      cards[idx].style.outline = "3px solid #38bdf8";
      cards[idx].scrollIntoView({ block: "nearest" });
    }
  }, 80);
}

/* 道具视觉事件入口：这里只负责识别一次成功使用，具体演出由最终实现统一处理。 */
