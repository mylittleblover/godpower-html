/* ===== V2.17.20：0.75s 卡片位移动画稳定性修复 ===== */
function clearBrokenCardTranslateV21720() {
  document.querySelectorAll(".group-row-card.battle-card").forEach((card) => {
    if (card.style.translate) card.style.removeProperty("translate");
  });
}
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(clearBrokenCardTranslateV21720, 50);
});
