
/* ===== V2.17.34：顶部道具提示与底部 Toast 统一持续时间 ===== */
const NOTICE_DURATION_V21734 = 3800;

/* Toast 生命周期已归入基础 showToast；不再覆盖同名函数。 */
/* 最终覆盖顶部道具使用提示的 animation-duration。
   仍使用现有进入/停留/淡出关键帧，只把总生命周期与 Toast 对齐。 */
(function(){
  const style=document.createElement('style');
  style.id='v21734NoticeDurationStyle';
  style.textContent=`
    .item-use-banner-v216{
      animation-duration:${NOTICE_DURATION_V21734}ms!important;
    }
  `;
  document.head.appendChild(style);
})();
