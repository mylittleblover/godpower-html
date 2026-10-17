/* Pure schema / storage primitives. No DOM, no remote dependencies. */
const Reliability = (() => {
  const schemaVersion = 1;
  const stateKey = 'godpower_state_v1';
  function validateBackup(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error('备份必须是 JSON 对象');
    if (data.schemaVersion != null && data.schemaVersion !== schemaVersion) throw Error('不支持此存档版本');
    if (!Array.isArray(data.groups) || !data.groups.length || data.groups.length > 1000) throw Error('小组数据为空或超过 1000 组');
    data.groups.forEach(g => {
      if (!g || typeof g !== 'object' || Array.isArray(g)) throw Error('小组格式无效');
      if (!Number.isSafeInteger(Number(g.score ?? 0))) throw Error('分数必须是安全整数');
      if (g.members != null && (!Array.isArray(g.members) || g.members.some(m=>typeof m!=='string'))) throw Error('成员格式无效');
      if(g.inventory!=null && (!Array.isArray(g.inventory)||g.inventory.length>3))throw Error('道具队列格式无效');
      if(g.itemEffect!=null && (typeof g.itemEffect!=='object'||Array.isArray(g.itemEffect)))throw Error('持续状态格式无效');
    });
    if(data.picker!=null && (typeof data.picker!=='object'||Array.isArray(data.picker)))throw Error('点名数据格式无效');
    if(data.itemGlobal!=null && (typeof data.itemGlobal!=='object'||Array.isArray(data.itemGlobal)))throw Error('全局道具数据格式无效');
    if(data.history!=null){
      if(!Array.isArray(data.history)||data.history.length>40)throw Error('历史格式无效');
      for(const h of data.history){
        if(!h||typeof h!=='object')throw Error('历史节点格式无效');
        validateBackup({groups:h.groups,picker:h.picker,itemGlobal:h.itemGlobal});
      }
    }
    return data;
  }
  function writeVerified(storage, key, data) {
    try {
      const text=JSON.stringify(data);
      storage.setItem(key,text);
      if(storage.getItem(key)!==text)throw Error('保存后校验不一致');
      return {ok:true};
    } catch(error) { return {ok:false,error:String(error.message||error)}; }
  }
  function appendArchive(storage,record) {
    try {
      const raw=storage.getItem('politics_settlement_history');
      const list=raw==null?[]:JSON.parse(raw);
      if(!Array.isArray(list))throw Error('原有归档格式损坏，请先导出恢复');
      // Never silently drop old archives to make a new archive fit.
      return writeVerified(storage,'politics_settlement_history',[record,...list.filter(x=>x.id!==record.id)]);
    }catch(error){return {ok:false,error:String(error.message||error)}}
  }
  function phase(s) {
    if(!s.hasStartedOnce)return 'NOT_STARTED';
    if(!s.roundActive)return 'FINISHED';
    if(s.evaluated)return 'SETTLED';
    return s.correctAns?'ANSWER_SELECTED':'ANSWERING';
  }
  function validateItem(s,g,index,enabled) {
    if(!enabled)return '共产主义模式已关闭';
    if(!g || !g.inventory?.[index])return '没有可用道具';
    if(index!==0)return '次要道具需要等待主要道具';
    if(Number(g.score)<0)return '负分保护：该组不能使用道具';
    const key=g.inventory[index].key;
    const continuation=['triple_green','triple_red','triple_banana','triple_mushroom'].includes(key)&&g.roundItemContinuationKeyV218===key;
    if(s.roundActive&&!s.evaluated&&g.itemUsedThisRound&&!continuation)return '本题已经使用过道具';
    if(['star','mega','power'].includes(g.itemEffect?.type)&&g.itemEffect.type===key)return '主要道具持续状态尚未结束';
    return null;
  }
  // Stale asynchronous defense dialogs must never modify a different round or item.
  let defenseDecisionEpoch=0;
  function invalidateDefenseDecisions(){return ++defenseDecisionEpoch}
  function captureDefenseDecision(s,target,key){
    const item=target?.inventory?.[0];
    if(!s||!Array.isArray(s.groups)||!s.groups.includes(target)||!item||item.key!==key)return null;
    return {epoch:defenseDecisionEpoch,state:s,groups:s.groups,target,targetId:target.id,item,key,
      phase:phase(s),round:s.round,roundActive:s.roundActive,evaluated:s.evaluated,
      hasStartedOnce:s.hasStartedOnce,correctAns:s.correctAns,settlements:s.itemGlobal?.pkTotal};
  }
  function isDefenseDecisionCurrent(s,d){
    if(!s||!d||d.epoch!==defenseDecisionEpoch||s!==d.state||s.groups!==d.groups||
       !Array.isArray(s.groups)||s.groups.find(g=>g.id===d.targetId)!==d.target||
       d.target.inventory?.[0]!==d.item||d.item.key!==d.key||phase(s)!==d.phase)return false;
    return Object.is(s.round,d.round)&&s.roundActive===d.roundActive&&
      s.evaluated===d.evaluated&&s.hasStartedOnce===d.hasStartedOnce&&
      s.correctAns===d.correctAns&&s.itemGlobal?.pkTotal===d.settlements;
  }
  function safeImage(value) {
    return typeof value==='string' && /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-zA-Z0-9+/=\s]+$/.test(value) ? value : '';
  }
  function count(value){const n=Number(value);return Number.isSafeInteger(n)&&n>=0?n:0}
  function normalizeStats(raw){return Object.fromEntries(['correct','wrong','draws','used'].map(k=>[k,count(raw?.[k])]))}
  function normalizeEffect(raw){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
    const out={};
    if(['star','mega','power','bullet'].includes(raw.type))out.type=raw.type;
    for(const k of ['hitsLeft','roundsLeft','startedAt','targetId','featherDodge','iceLock','iceRoundsLeftV218'])
      if(Object.hasOwn(raw,k))out[k]=count(raw[k]);
    return Object.keys(out).length?out:null;
  }
  function calculateRoundScores(s){
    return s.groups.map(g=>{
      let score=Number(g.score);
      if(!Number.isSafeInteger(score))throw Error('分数超出安全整数范围');
      if(g.selectedOpt){
        const correct=g.selectedOpt===s.correctAns;
        score=g.allIn?(correct?score*2:0):(correct?score+2:score);
      }
      if(!Number.isSafeInteger(score))throw Error('本次计分将超出安全整数范围，请先导出备份并调整积分');
      return score;
    });
  }
  function csvText(text){text=String(text);return /^[\s]*[=+@-]/.test(text)?"'"+text:text}
  return {schemaVersion,stateKey,validateBackup,writeVerified,appendArchive,phase,validateItem,safeImage,csvText,count,normalizeStats,normalizeEffect,calculateRoundScores,invalidateDefenseDecisions,captureDefenseDecision,isDefenseDecisionCurrent};
})();

// Resolve the browser storage getter inside operations so access denial is
// reported by the same verified-write failure path as quota errors.
const CLASSROOM_STORAGE={
  getItem(key){return localStorage.getItem(key)},
  setItem(key,value){localStorage.setItem(key,value)}
};
