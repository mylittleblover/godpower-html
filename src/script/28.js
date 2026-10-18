
/* ===== V2.17.25：答题状态切换专用 0.75s FLIP =====
   解决普通 renderGrid 包装层在 state.evaluated / roundActive 改变后的第一次刷新
   抢先重建 DOM，导致“排名 <-> 编号”的切换动画消失。 */

function captureCardRectsV21725(){
  const map=new Map();
  document.querySelectorAll('#groupList .group-row-card[data-group-id]').forEach(card=>{
    const r=card.getBoundingClientRect();
    if(r.width>1 && r.height>1){
      map.set(String(card.dataset.groupId),r);
    }
  });
  return map;
}

let roundStateFlipBusyV21726=false;
let roundStateFlipTimerV21726=null;

function animateCardsFromSnapshotV21725(oldRects){
  if(!(oldRects instanceof Map) || oldRects.size===0)return;

  const moved=[];
  document.querySelectorAll('#groupList .group-row-card[data-group-id]').forEach(card=>{
    const old=oldRects.get(String(card.dataset.groupId));
    if(!old)return;

    const now=card.getBoundingClientRect();
    const dx=old.left-now.left;
    const dy=old.top-now.top;
    if(Math.abs(dx)<1 && Math.abs(dy)<1)return;

    card.style.setProperty('transition','none','important');
    card.style.transform=`translate(${dx}px,${dy}px)`;
    moved.push(card);
  });

  if(!moved.length)return;

  roundStateFlipBusyV21726=true;
  if(roundStateFlipTimerV21726)clearTimeout(roundStateFlipTimerV21726);

  moved.forEach(card=>void card.offsetWidth);

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    moved.forEach(card=>{
      card.style.setProperty(
        'transition',
        `transform 750ms cubic-bezier(.2,.8,.2,1),box-shadow .3s ease,border-color .35s ease`,
        'important'
      );
      card.style.transform='translate(0px,0px)';
    });

    roundStateFlipTimerV21726=setTimeout(()=>{
      moved.forEach(card=>{
        card.style.setProperty('transition','none','important');
        card.style.removeProperty('transform');
        void card.offsetWidth;
        requestAnimationFrame(()=>card.style.removeProperty('transition'));
      });
      roundStateFlipBusyV21726=false;
      roundStateFlipTimerV21726=null;
    },790);
  }));
}
