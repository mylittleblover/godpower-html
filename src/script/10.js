
/* ===== V2.17.5：音效可独立打包为 BIN =====
   保留原“全部音频打包”，另外增加“仅音效”导出。
   使用与现有 BGMP 音频包相同的容器，因此原来的导入音频包功能可以直接导回。 */

async function exportFxBundleV2175(){
  if(state.isLocked){
    openPwdModal();
    return;
  }

  try{
    if(!db){
      await initDB();
    }
    if(!db){
      themeAlert('音频数据库尚未初始化');
      return;
    }

    showToast('正在打包音效...');

    const allRecords = await new Promise(resolve=>{
      try{
        const tx=db.transaction('sounds','readonly');
        const req=tx.objectStore('sounds').getAll();
        req.onsuccess=()=>resolve(req.result||[]);
        req.onerror=()=>resolve([]);
      }catch(e){
        resolve([]);
      }
    });

    /* 所有用户上传的音效都以 fx_ 开头。
       这同时包含：
       - 系统交互音效
       - 道具抽取/防御音效
       - 26 个独立道具音效 fx_item_xxx
    */
    const fxRecords=allRecords
      .filter(r=>r && typeof r.id==='string' && r.id.startsWith('fx_') && r.arrayBuffer instanceof ArrayBuffer)
      .sort((a,b)=>a.id.localeCompare(b.id));

    if(!fxRecords.length){
      themeAlert('当前没有已上传的音效可导出。\n默认合成音不会写入 BIN，只有你上传或从音频包导入的真实音频文件会被打包。');
      return;
    }

    let currentOffset=0;
    const fileIndex=[];
    const buffers=[];

    for(const record of fxRecords){
      const ab=record.arrayBuffer;
      fileIndex.push({
        id:record.id,
        offset:currentOffset,
        length:ab.byteLength,
        type:'fx'
      });
      buffers.push(ab);
      currentOffset+=ab.byteLength;
    }

    const indexBytes=new TextEncoder().encode(JSON.stringify(fileIndex));
    const headerBuffer=new ArrayBuffer(8);
    const view=new DataView(headerBuffer);

    /* 保持 BGMP 魔数，与原导入器完全兼容。 */
    view.setUint8(0,0x42); // B
    view.setUint8(1,0x47); // G
    view.setUint8(2,0x4D); // M
    view.setUint8(3,0x50); // P
    view.setUint32(4,indexBytes.byteLength,true);

    const blob=new Blob(
      [headerBuffer,indexBytes,...buffers],
      {type:'application/octet-stream'}
    );

    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;

    const itemFxCount=fxRecords.filter(r=>r.id.startsWith('fx_item_')).length;
    a.download=`政治课堂音效包_${fxRecords.length}轨_道具${itemFxCount}轨.bin`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=>URL.revokeObjectURL(url),1000);
    showToast(`音效包导出成功：${fxRecords.length} 轨`);
  }catch(e){
    console.error('exportFxBundleV2175',e);
    themeAlert('音效包导出失败');
  }
}

/* 在 26 道具独立音效区域顶部增加独立 BIN 导出按钮。 */
const _v2175RenderItemFxSoundListV26=renderItemFxSoundListV26;
renderItemFxSoundListV26=function(){
  _v2175RenderItemFxSoundListV26();

  const box=document.getElementById('itemFxSoundListV26');
  if(!box || document.getElementById('v2175FxBundleToolbar'))return;

  const bar=document.createElement('div');
  bar.id='v2175FxBundleToolbar';
  bar.className='v2175-fx-bundle-toolbar';
  bar.innerHTML=`
    <div class="v2175-fx-bundle-copy">
      <b>音效 BIN 包</b>
      <span>仅打包已上传的音效，包括 26 种独立道具音效；可用现有“导入音频包”直接恢复。</span>
    </div>
    <button type="button" class="btn btn-sm btn-warning" onclick="exportFxBundleV2175()">
      导出音效包 (.bin)
    </button>
  `;

  box.prepend(bar);
};

/* 设置页打开时补上工具栏。 */
if(typeof showSettingsV26==='function'){
  const _v2175ShowSettingsV26=showSettingsV26;
  showSettingsV26=function(which,...args){
    const r=_v2175ShowSettingsV26.call(this,which,...args);
    if(which==='audio'){
      setTimeout(()=>{try{renderItemFxSoundListV26()}catch(e){}},0);
    }
    return r;
  };
}
