/* Only engine calls marked external hide their DOM. Dock controls stay internal. */
(() => {
  if (window.godpowerDesktop?.role !== 'main') return;
  const style = document.createElement('style');
  style.textContent = '#pickerModal[data-external-picker]{visibility:hidden!important;pointer-events:none!important}';
  document.head.append(style);
})();
