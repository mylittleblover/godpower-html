function repairPersistentItemsV28() {
  ensureItemState();
  state.groups.forEach((g) => {
    g.inventory = normalizeInventoryV21718(g.inventory);
  });
  try {
    saveState();
  } catch (e) {}
}

/* Vista 风格程序确认窗，替代“尚有小组未作答”时的系统 confirm。 */
