
function cleanVisibleCopyV21811(){
  const about=document.getElementById('aboutMain');
  if(about){
    const walker=document.createTreeWalker(about,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{
      n.nodeValue=n.nodeValue
        .replace(/原来的\s*音乐设置已经退休[^。]*。?/g,'')
        .replace(/原来的\s*旧版音乐参数面板已经退休[^。]*。?/g,'')
        .replace(/旧版音乐参数面板/g,'音乐设置')
        .replace(/说明已同步当前道具规则/g,'直接说明实际效果');
    });
  }
}
const _v21811RenderAbout=renderAbout;
renderAbout=function(tab){
  const r=_v21811RenderAbout.apply(this,arguments);
  cleanVisibleCopyV21811();
  return r;
};
