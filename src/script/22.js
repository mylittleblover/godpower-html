
/* ===== V2.17.19：多次使用花类道具持久化保护 ===== */
function repairFlowerChargesV21719(){
  const keys=new Set(['fire_flower','ice_flower','boomerang_flower']);
  let changed=false;

  state.groups.forEach(g=>{
    if(!Array.isArray(g.inventory)) return;
    g.inventory.forEach(it=>{
      if(!keys.has(it?.key)) return;
      const n=Number(it.charges);
      const fixed=Number.isFinite(n)
        ? Math.max(1,Math.min(3,Math.trunc(n)))
        : 3;
      if(it.charges!==fixed){
        it.charges=fixed;
        changed=true;
      }
    });
  });

  if(changed){
    try{saveState()}catch(e){}
    try{renderAll()}catch(e){}
  }
}

/* 所有脚本加载完成后再做一次最终校验。
   此时 ITEM_DEFS 与三种花的行为扩展都已经完整存在。 */
window.addEventListener('DOMContentLoaded',()=>{
  setTimeout(repairFlowerChargesV21719,40);
});
