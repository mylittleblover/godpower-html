
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

/* 音效包维护入口由 DesktopUI 设置页统一持有。
   exportFxBundleV2175 保留原 BGMP 格式和权限行为，不再包装渲染器追加重复工具栏。 */
