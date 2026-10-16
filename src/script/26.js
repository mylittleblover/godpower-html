
/* ===== V2.17.23：恢复非答题阶段的 0.75s 排名位移 =====
   答题中：卡片固定编号，不因道具产生布局位移。
   非答题阶段：卡片按排名排列，名次改变时使用完整 0.75s FLIP。 */

const _v21723RenderGrid = renderGrid;
renderGrid = function(...args){
  if(!(state.roundActive&&!state.evaluated)){
    v213SuppressReorderAnimation=false;
  }
  return _v21723RenderGrid.apply(this,args);
};
