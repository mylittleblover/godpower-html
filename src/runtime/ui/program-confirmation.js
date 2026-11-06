let programConfirmResolveV28 = null;
function programConfirmV28(message, opts = {}) {
  return new Promise((resolve) => {
    const previous = document.getElementById("programConfirmV28");
    previous?.querySelector("#pcCancelV28")?.click();
    if (previous && typeof DesktopUI !== "undefined")
      DesktopUI.finishWindowClose(previous);
    programConfirmResolveV28 = resolve;
    const o = document.createElement("div");
    o.id = "programConfirmV28";
    o.className = "program-confirm-overlay";
    o.innerHTML = `<div class="program-confirm-window ui-function-surface" role="dialog" aria-modal="true" aria-labelledby="pcTitleV28">
      <div class="program-confirm-titlebar" id="pcTitleV28">${escapeHtml(opts.title || "课堂程序提示")}</div>
      <div class="program-confirm-body">
        <div class="program-confirm-icon">!</div>
        <div class="program-confirm-text">${escapeHtml(message).replace(/\n/g, "<br>")}</div>
      </div>
      <div class="program-confirm-actions">
        <button class="btn" id="pcCancelV28">${escapeHtml(opts.cancelText || "返回检查")}</button>
        <button class="btn btn-primary" id="pcOkV28">${escapeHtml(opts.okText || "仍然继续")}</button>
      </div>
    </div>`;
    document.body.appendChild(o);
    let settled = false;
    const finish = (v) => {
      if (settled || !o.isConnected) return;
      settled = true;
      document.removeEventListener("keydown", key);
      hideClassroomWindow(o, () => o.remove());
      programConfirmResolveV28 = null;
      resolve(v);
    };
    o.querySelector("#pcCancelV28").onclick = () => finish(false);
    o.querySelector("#pcOkV28").onclick = () => finish(true);
    o.addEventListener("click", (e) => {
      if (e.target === o) finish(false);
    });
    const key = (e) => {
      if (!o.isConnected) {
        document.removeEventListener("keydown", key);
        return;
      }
      if (e.key === "Escape") {
        document.removeEventListener("keydown", key);
        finish(false);
      } else if (e.key === "Enter") {
        document.removeEventListener("keydown", key);
        finish(true);
      }
    };
    document.addEventListener("keydown", key);
  });
}

/* 页面离开时做同步回写。 */
window.addEventListener("beforeunload", () => {
  if (globalThis.SaveManager?.enabled()) return;
  try {
    saveState();
    persistHistoryV26();
  } catch (e) {}
});
window.addEventListener("DOMContentLoaded", () =>
  setTimeout(repairPersistentItemsV28, 0),
);

/* ===== V2.8.1 防重复抽取 =====
   规则：
   1. 同一轮“全局道具发放”中，最终结果尽量不重复。
   2. 同一小组不会抽到自己背包里已经持有的同种道具。
   3. 仍严格使用当前名次的原权重；只把已禁止的候选权重临时置零。
   4. 若受名次禁用规则 + 防重复规则影响后没有候选，则先允许“跨组重复”，
      但仍优先避免与自己背包重复，避免把抽取系统卡死。
*/
