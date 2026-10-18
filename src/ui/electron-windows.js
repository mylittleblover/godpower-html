/* Native window presentation adapter. All state and event handlers stay in the main classroom. */
(() => {
  const desktop=window.godpowerDesktop;
  if(!desktop||desktop.role!=='main'||!desktop.publishDialogs)return;
  const ids=['welcomeModal','scoreModalBackdrop','pwdModal','memberSearchBackdrop','settlementNameModal','grandModalOverlay','itemModalBackdrop','handRaiseBackdrop','aboutBackdrop','batchImportModal','themeDialogV21727','quickPersonBackdropV218','programConfirmV28'];
  const nodes=new Map(),tokens=new WeakMap(),acks=new Map(),versions=new Map();let nextToken=0,last='',timer;
  function token(el){if(!tokens.has(el)){tokens.set(el,++nextToken);nodes.set(nextToken,el);}return tokens.get(el);}
  const visible=el=>el.open||el.classList.contains('active')||el.classList.contains('show')||el.style.display==='flex'||(el.id==='programConfirmV28'&&el.getClientRects().length>0);
  function close(root){
    const button=root.querySelector('[data-ui-window-close]');
    if(button){button.click();return;}
    const closers={welcomeModal:()=>closeWelcomeModal(),scoreModalBackdrop:()=>closeScoreModal(),pwdModal:()=>closePwdModal(),memberSearchBackdrop:()=>closeMemberSearchModal(),settlementNameModal:()=>closeSettlementNameModal(),grandModalOverlay:()=>closeGrandSettlementModal(),itemModalBackdrop:()=>closeItemWindow(),handRaiseBackdrop:()=>closeHandRaise(),aboutBackdrop:()=>closeAbout(),batchImportModal:()=>closeBatchImportModal(),themeDialogV21727:()=>closeThemeDialogV21727(false),quickPersonBackdropV218:()=>closeQuickPersonScoreV218(),programConfirmV28:()=>document.getElementById('pcCancelV28')?.click()};
    closers[root.id]?.();
  }
  function scan(){
    const css=[...document.querySelectorAll('style:not([data-native-hide])')].map(el=>el.textContent).join('\n');
    const list=[];
    for(const id of ids){
      const root=document.getElementById(id);if(!root)continue;
      if(!visible(root)){root.removeAttribute('data-native-detached');continue;}
      const copy=root.cloneNode(true),original=[root,...root.querySelectorAll('*')],cloned=[copy,...copy.querySelectorAll('*')];
      original.forEach((el,i)=>{
        const target=cloned[i];target.setAttribute('data-remote-token',token(el));
        target.removeAttribute('data-native-detached');
        if(el.matches('input,textarea,select')){
          if(el.tagName==='TEXTAREA')target.textContent=el.value;
          else if(el.tagName==='SELECT')[...target.options].forEach((o,j)=>o.toggleAttribute('selected',el.options[j].selected));
          else if(el.type==='checkbox'||el.type==='radio')target.toggleAttribute('checked',el.checked);
          else if(el.type!=='file'&&el.type!=='password')target.setAttribute('value',el.value);
          else target.removeAttribute('value');
        }
        if(el.tagName==='DETAILS')target.toggleAttribute('open',el.open);
      });
      root.setAttribute('data-native-detached','');
      const title=root.querySelector('[class*="title"],h1,h2,h3')?.textContent?.trim().slice(0,100)||'课堂工具';
      const html=copy.outerHTML,previous=versions.get(id);
      const version=previous&&previous.html===html?previous.version:(previous?.version||0)+1;
      versions.set(id,{html,version});
      list.push({id,title,html,css,version,acks:Object.fromEntries(acks)});
    }
    // The picker is already an independent authoritative client; redirect its original entry.
    const picker=document.getElementById('pickerModal');
    if(picker)picker.toggleAttribute('data-native-detached',!!visible(picker));
    const json=JSON.stringify(list);if(json!==last){last=json;desktop.publishDialogs(list);}
    for(const [key,node]of nodes)if(!node.isConnected){nodes.delete(key);acks.delete(key);}
  }
  desktop.onDialogEvent(message=>{
    const root=document.getElementById(message.id);if(!root||!visible(root))return;
    if(message.type==='close'){close(root);scan();return;}
    if(message.version!==versions.get(message.id)?.version)return;
    const el=nodes.get(message.token);if(!el||!root.contains(el)||el.disabled)return;
    if(message.type==='input'||message.type==='change'){
      el.value=message.value;acks.set(message.token,message.inputSeq||0);
      el.dispatchEvent(new Event(message.type,{bubbles:true}));
    }else if(message.type==='click')el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    else if(message.type==='keydown')el.dispatchEvent(new KeyboardEvent('keydown',{key:message.key,bubbles:true,cancelable:true}));
    else if(message.type==='submit'&&el.tagName==='FORM')el.requestSubmit();
    else if(message.type==='files'&&el.matches('input[type=file]')){
      const transfer=new DataTransfer();for(const file of message.files)transfer.items.add(new File([file.bytes],file.name,{type:file.type||''}));
      el.files=transfer.files;el.dispatchEvent(new Event('change',{bubbles:true}));
    }
    scan();
  });
  window.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');style.dataset.nativeHide='';style.textContent='[data-native-detached]{visibility:hidden!important;pointer-events:none!important}';document.head.append(style);
    timer=setInterval(scan,120);scan();
  },{once:true});
  window.addEventListener('beforeunload',()=>clearInterval(timer),{once:true});
})();
