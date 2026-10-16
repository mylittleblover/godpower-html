
/* ===== V2.17.26：防止状态切换 FLIP 被二次 renderGrid 销毁 ===== */
const _v21726RenderGrid=renderGrid;
let pendingRenderGridV21726=false;

renderGrid=function(...args){
  if(roundStateFlipBusyV21726){
    if(!pendingRenderGridV21726){
      pendingRenderGridV21726=true;
      setTimeout(()=>{
        pendingRenderGridV21726=false;
        _v21726RenderGrid.apply(this,args);
      },810);
    }
    return;
  }
  return _v21726RenderGrid.apply(this,args);
};
