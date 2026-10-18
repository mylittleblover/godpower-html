/* One runtime owns all item policies; existing executors remain rule adapters. */
globalThis.ItemModules = ItemModuleModel.create(
  ITEM_DEFS,
  {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  },
  () => {
    queueMicrotask(() => {
      if (window.classroomReady) renderAll();
    });
  },
);
if (ItemModules.loadError)
  console.warn(
    "道具积木配置无法读取，当前会话使用默认配置；原数据未覆盖：",
    ItemModules.loadError,
  );
