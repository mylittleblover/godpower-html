/* Transport only. Standalone HTML has no desktop bridge and keeps all existing behavior. */
(() => {
  const desktop = window.godpowerDesktop;
  if (!desktop || desktop.role !== 'main') return;
  const completed = new Map();
  let last = '', timer;
  const publish = () => {
    const snapshot = GodpowerPicker.getSnapshot(), json = JSON.stringify(snapshot);
    if (json !== last) { last = json; desktop.publish(snapshot); }
  };
  desktop.onExecute(async ({ id, action, payload }) => {
    if (!completed.has(id)) {
      const promise = GodpowerPicker.command(action, payload).catch(error => ({ ok: false, error: error.message }));
      completed.set(id, promise);
      if (completed.size > 256) completed.delete(completed.keys().next().value);
    }
    const result = await completed.get(id);
    publish(); desktop.reply({ id, result });
  });
  desktop.onShellState(shell => GodpowerPicker.setExternalPresentation(shell.effectsEnabled));
  window.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'btn btn-primary'; button.textContent = '独立点名悬浮窗';
    button.addEventListener('click', () => desktop.openPicker());
    document.querySelector('#pickerModal .picker-left-v2')?.append(button);
    GodpowerPicker.subscribe(publish);
    timer = setInterval(publish, 120); publish(); desktop.ready();
  }, { once: true });
  window.addEventListener('beforeunload', () => clearInterval(timer), { once: true });
})();
