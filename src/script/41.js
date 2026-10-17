
/* ===== V2.18.7：全站文案审计 =====
   目标：同一个功能别在底栏叫“天选之人”，弹窗里又突然恢复公务员口吻。 */

function polishVisibleCopyV2187(){
  /* 🤑 快速按人加分 */
  const qp=document.querySelector('#quickPersonBackdropV218 .quick-person-head-v218 b');
  if(qp)qp.textContent='🤑 精准撒币';

  /* 关于窗口侧栏 */
  const aboutInfo=document.querySelector('#aboutBackdrop [data-about="info"]');
  const aboutGuide=document.querySelector('#aboutBackdrop [data-about="guide"]');
  if(aboutInfo)aboutInfo.textContent='这玩意儿是什么';
  if(aboutGuide)aboutGuide.textContent='别乱按指南';

  /* 设置页文案由统一模板持有，避免定时修辞覆盖组件。 */

  /* 上帝模式管理区 */
  document.querySelectorAll('.god-item-tools b,.queue-god-tools-v2120 b').forEach(el=>{
    if(/上帝模式/.test(el.textContent||''))el.textContent='🔓 上帝模式 · 现实编辑器';
  });
  document.querySelectorAll('.god-item-tools .btn-danger,.queue-god-tools-v2120 .btn-danger').forEach(el=>{
    if(/清空/.test(el.textContent||''))el.textContent='🧹 把道具桌面掀干净';
  });

  /* 一些还可能被旧 renderer 重建的固定标题 */
  const pickerTitle=document.querySelector('#pickerModal .picker-left-v2 h3');
  if(pickerTitle)pickerTitle.textContent='🎰 天选之人';
  const handTitle=document.querySelector('#handRaiseBackdrop .classroom-head b');
  if(handTitle)handTitle.textContent='✋ 举手办案处';
  const memberTitle=document.querySelector('#memberSearchBackdrop .member-search-title');
  if(memberTitle)memberTitle.textContent='😎 人肉搜索（文明版）';
}

/* About 最终版：把旧版术语 / 旧道具数量 / 公务员腔一次性赶出用户视野。 */
const _v2187RenderAbout=renderAbout;
renderAbout=function(tab){
  if(tab==='items')return _v2187RenderAbout.call(this,tab);
  document.querySelectorAll('[data-about]').forEach(b=>b.classList.toggle('active',b.dataset.about===tab));
  const m=document.getElementById('aboutMain');if(!m)return;

  if(tab==='info'){
    m.innerHTML=`<div class="v214-about-head">
      <h2>这玩意儿到底是什么</h2>
      <button class="btn btn-sm" onclick="closeAbout()">看懂了，撤</button>
    </div>
    <div class="guide-block">
      <b>“上帝（马克思）的力量”课堂积分与道具系统</b><br>
      负责记分、PK、随机点名、举手奖励、26 种道具、历史回滚、结算档案、音效音乐和名单管理。
      该复杂的地方交给后台，该按一下解决的事情就别逼老师开三层菜单。
    </div>
    <div class="guide-block">
      平时尽量一键操作，复杂东西藏到后台。功能确实不少，毕竟课堂一旦开始认真做需求，按钮就会像蘑菇一样自己长出来。
    </div>`;
    return;
  }

  m.innerHTML=`<div class="v214-about-head">
    <h2>别乱按指南</h2>
    <button class="btn btn-sm" onclick="closeAbout()">我大概会了</button>
  </div>
  <div class="guide-block"><b>🧠 PK：</b>各组答完统一判定。知识负责决定对错，系统负责把对错变成分数和排名。</div>
  <div class="guide-block"><b>🎁 命运批发部：</b>给符合条件的小组统一抽道具。满背包和负分保护组会自动退出这场命运分配。</div>
  <div class="guide-block"><b>✋ 举手办案处：</b>选举手小组、判正误、加分、抽道具、用道具，一条龙处理，省得老师在五个窗口之间练手速。</div>
  <div class="guide-block"><b>🎰 天选之人：</b>个人、小组、先组后人都能抽。算法没有私人恩怨，被点到纯属数学。</div>
  <div class="guide-block"><b>🤑 精准撒币：</b>按学号、姓名首字母或小组筛人，批量给所属小组加分。多人同组会累计，钱终于有账可查。</div>
  <div class="guide-block"><b>🔒 上帝模式：</b>需要密码后才能改那些正常比赛不该随便碰的东西。不是因为系统怀疑你，只是因为“手滑”在人类历史上战绩辉煌。</div>
  <div class="guide-block"><b>↩️ 时间倒流：</b>历史记录能回滚。犯错不可怕，可怕的是犯错以后还没有撤销按钮。</div>`;
};

/* 上帝模式提示统一改成有点人味的版本。 */
const _v2187OpenPwdModal=openPwdModal;
openPwdModal=function(){
  const r=_v2187OpenPwdModal.apply(this,arguments);
  const h=document.querySelector('#pwdModal h3');
  const p=document.querySelector('#pwdModal p');
  const ok=document.querySelector('#pwdModal .btn-primary');
  if(h)h.textContent='🔒 神迹认证处';
  if(p)p.textContent='想改现实之前，先证明你确实有权限。密码能在后台杂物间修改；这只是防手滑，不是五角大楼门禁。';
  if(ok)ok.textContent='批准神迹';
  return r;
};

/* submitPassword 保持原逻辑；成功提示已在原函数文案中统一，避免重复弹两次。 */

/* 部分旧函数会重建内容，渲染后补一次文案。 */
['renderAll','renderItemWindow','renderHandRaise','renderPickerInfo'].forEach(name=>{
  const fn=window[name];
  if(typeof fn!=='function')return;
  window[name]=function(...args){
    const r=fn.apply(this,args);
    setTimeout(polishVisibleCopyV2187,0);
    return r;
  };
});

window.addEventListener('DOMContentLoaded',()=>{
  polishVisibleCopyV2187();
  setTimeout(polishVisibleCopyV2187,120);
});
polishVisibleCopyV2187();
