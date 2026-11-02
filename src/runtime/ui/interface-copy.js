/* ===== V2.18.7：全站文案审计 =====
   目标：同一个功能别在底栏叫“天选之人”，弹窗里又突然恢复公务员口吻。 */

function polishVisibleCopyV2187() {
  /* 🤑 快速按人加分 */
  const qp = document.querySelector(
    "#quickPersonBackdropV218 .quick-person-head b",
  );
  if (qp) qp.textContent = "🤑 精准撒币";

  /* 关于窗口侧栏 */
  const aboutInfo = document.querySelector(
    '#aboutBackdrop [data-about="info"]',
  );
  const aboutGuide = document.querySelector(
    '#aboutBackdrop [data-about="guide"]',
  );
  if (aboutInfo) aboutInfo.textContent = "这玩意儿是什么";
  if (aboutGuide) aboutGuide.textContent = "别乱按指南";

  /* 设置页文案由统一模板持有，避免定时修辞覆盖组件。 */

  /* 上帝模式管理区 */
  document
    .querySelectorAll(".god-item-tools b,.queue-admin-tools b")
    .forEach((el) => {
      if (/上帝模式/.test(el.textContent || ""))
        el.textContent = "🔓 上帝模式 · 现实编辑器";
    });
  document
    .querySelectorAll(
      ".god-item-tools .btn-danger,.queue-admin-tools .btn-danger",
    )
    .forEach((el) => {
      if (/清空/.test(el.textContent || ""))
        el.textContent = "🧹 把道具桌面掀干净";
    });

  /* 一些还可能被旧 renderer 重建的固定标题 */
  const pickerTitle = document.querySelector("#pickerModal .picker-left h3");
  if (pickerTitle) pickerTitle.textContent = "🎰 天选之人";
  const handTitle = document.querySelector(
    "#handRaiseBackdrop .classroom-head b",
  );
  if (handTitle) handTitle.textContent = "✋ 举手办案处";
  const memberTitle = document.querySelector(
    "#memberSearchBackdrop .member-search-title",
  );
  if (memberTitle) memberTitle.textContent = "😎 人肉搜索（文明版）";
}

/* About 最终版：把旧版术语 / 旧道具数量 / 公务员腔一次性赶出用户视野。 */



/* 上帝模式提示统一改成有点人味的版本。 */
const _v2187OpenPwdModal = openPwdModal;
openPwdModal = function () {
  const r = _v2187OpenPwdModal.apply(this, arguments);
  const h = document.querySelector("#pwdModal h3");
  const p = document.querySelector("#pwdModal p");
  const ok = document.querySelector("#pwdModal .btn-primary");
  if (h) h.textContent = "🔒 神迹认证处";
  if (p)
    p.textContent =
      "想改现实之前，先证明你确实有权限。密码能在后台杂物间修改；这只是防手滑，不是五角大楼门禁。";
  if (ok) ok.textContent = "批准神迹";
  return r;
};

/* submitPassword 保持原逻辑；成功提示已在原函数文案中统一，避免重复弹两次。 */

/* 部分旧函数会重建内容，渲染后补一次文案。 */
[
  "renderAll",
  "renderItemWindow",
  "renderHandRaise",
  "renderPickerInfo",
].forEach((name) => {
  const fn = window[name];
  if (typeof fn !== "function") return;
  window[name] = function (...args) {
    const r = fn.apply(this, args);
    setTimeout(polishVisibleCopyV2187, 0);
    return r;
  };
});

window.addEventListener("DOMContentLoaded", () => {
  polishVisibleCopyV2187();
  setTimeout(polishVisibleCopyV2187, 120);
});
polishVisibleCopyV2187();
