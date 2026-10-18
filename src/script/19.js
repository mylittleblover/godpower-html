
function selectGroupPresetColorV21716(id,color){
  if(state.isLocked){openPwdModal();return}
  if(!/^#[0-9a-f]{6}$/i.test(color))return;
  updateGroupColor(id,color);
  activeItemGroupId=id;
  activeItemTab='detail';
  renderItemWindow();
}
function previewItemDetailColorV21716(value){
  previewItemDetailColor(value);
  const hex=document.getElementById('groupDetailColorHexV21716');
  if(hex)hex.textContent=String(value||'').toUpperCase();
}
