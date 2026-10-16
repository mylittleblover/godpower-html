
/* ===== V2.17.34：顶部道具提示与底部 Toast 统一持续时间 ===== */
const NOTICE_DURATION_V21734 = 3800;

/* 最终覆盖 Toast，保持现有视觉样式，仅统一生命周期。 */
showToast = function(msg){
  const t=document.getElementById('toast');
  if(!t)return;
  if(toastTimer){
    clearTimeout(toastTimer);
    toastTimer=null;
  }
  t.innerText=msg;
  t.classList.add('show');
  toastTimer=setTimeout(()=>{
    t.classList.remove('show');
    toastTimer=null;
  },NOTICE_DURATION_V21734);
};

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
