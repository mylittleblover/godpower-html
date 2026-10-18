
/* ===== V2.17.27：统一主题弹窗 API ===== */
let themeDialogResolveV21727=null;

function closeThemeDialogV21727(result=false){
  const root=document.getElementById('themeDialogV21727');
  if(!root)return;
  root.classList.remove('active');
  root.setAttribute('aria-hidden','true');
  const resolve=themeDialogResolveV21727;
  themeDialogResolveV21727=null;
  if(resolve)resolve(result);
}

function openThemeDialogV21727(message,opts={}){
  const root=document.getElementById('themeDialogV21727');
  const title=document.getElementById('themeDialogTitleV21727');
  const body=document.getElementById('themeDialogBodyV21727');
  const icon=document.getElementById('themeDialogIconV21727');
  const actions=document.getElementById('themeDialogActionsV21727');
  if(!root||!title||!body||!actions){
    return Promise.resolve(false);
  }

  /* 如果极少数情况下两个弹窗同时触发，先结束前一个，避免 Promise 悬空。 */
  if(themeDialogResolveV21727){
    const prev=themeDialogResolveV21727;
    themeDialogResolveV21727=null;
    prev(false);
  }

  root.dataset.uiNotice=opts.danger?'danger':(opts.confirm?'confirm':'info');
  title.textContent=opts.title||'提示';
  body.textContent=String(message??'');
  icon.textContent=opts.danger?'⚠️':(opts.icon||'ℹ️');
  actions.innerHTML='';

  return new Promise(resolve=>{
    themeDialogResolveV21727=resolve;

    if(opts.confirm){
      const cancel=document.createElement('button');
      cancel.type='button';
      cancel.className='theme-dialog-btn-v21727 secondary';
      cancel.textContent=opts.cancelText||'取消';
      cancel.onclick=()=>closeThemeDialogV21727(false);
      actions.appendChild(cancel);

      const ok=document.createElement('button');
      ok.type='button';
      ok.className=`theme-dialog-btn-v21727 ${opts.danger?'danger':'primary'}`;
      ok.textContent=opts.confirmText||'确认';
      ok.onclick=()=>closeThemeDialogV21727(true);
      actions.appendChild(ok);
      setTimeout(()=>ok.focus(),30);
    }else{
      const ok=document.createElement('button');
      ok.type='button';
      ok.className='theme-dialog-btn-v21727 primary';
      ok.textContent=opts.confirmText||'知道了';
      ok.onclick=()=>closeThemeDialogV21727(true);
      actions.appendChild(ok);
      setTimeout(()=>ok.focus(),30);
    }

    root.classList.add('active');
    root.setAttribute('aria-hidden','false');
  });
}

function themeAlert(message,opts={}){
  return openThemeDialogV21727(message,{...opts,confirm:false});
}

function themeConfirm(message,opts={}){
  return openThemeDialogV21727(message,{...opts,confirm:true});
}

document.addEventListener('keydown',e=>{
  const root=document.getElementById('themeDialogV21727');
  if(!root?.classList.contains('active'))return;
  if(e.key==='Escape'){
    e.preventDefault();
    closeThemeDialogV21727(false);
  }
});
