
/* ===== V2.17.24：恢复两种状态的排序契约 =====
   1. 答题进行中：严格按小组编号排列。
   2. 非答题状态：严格按实时排名排列。
   3. 两种状态互相切换时保留 0.75s FLIP。
   4. 答题中使用道具只更新分数/顶部排名，不改变卡片编号顺序。
*/

function desiredGroupsV21724(){
  const groups=state.groups.slice();

  if(state.roundActive && !state.evaluated){
    return groups.sort((a,b)=>{
      const na=(typeof groupNoValueV213==='function') ? groupNoValueV213(a) : Number(a.groupNo ?? a.id ?? 0);
      const nb=(typeof groupNoValueV213==='function') ? groupNoValueV213(b) : Number(b.groupNo ?? b.id ?? 0);
      return na-nb;
    });
  }

  /* 非答题状态使用现有 ranking()，保证与系统其余排名规则一致。 */
  try{
    if(typeof ranking==='function') return ranking().slice();
  }catch(e){}

  return groups.sort((a,b)=>{
    const d=Number(b.score||0)-Number(a.score||0);
    if(d!==0)return d;
    const na=(typeof groupNoValueV213==='function') ? groupNoValueV213(a) : Number(a.groupNo ?? a.id ?? 0);
    const nb=(typeof groupNoValueV213==='function') ? groupNoValueV213(b) : Number(b.groupNo ?? b.id ?? 0);
    return na-nb;
  });
}

/* 覆盖旧版排序入口。旧代码所有 renderGrid 都继续调用这个名字，
   所以不需要再堆一层“猜现在该怎么排”的包装。 */
desiredGroupsV213 = desiredGroupsV21724;

/* 状态切换必须允许真正的排序动画。
   仅“答题中使用道具”继续由 useItem 包装临时抑制。 */



/* V2.17.26：
   不再给 startRound / judgeRound / nextRound / forceEndRound 额外补第二次 renderGrid。
   这些状态切换已经由 V2.17.25 的“旧坐标快照 → 新排序 → FLIP”专门处理。
   再刷新一次会直接销毁正在做 0.75s 动画的 DOM。 */
function refreshSortingV21724(){
  try{
    if(typeof renderBattleRankPreviewV21721==='function') renderBattleRankPreviewV21721();
  }catch(e){}
}
