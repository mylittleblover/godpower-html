export function battle14(zoom) {
  state.columnMode = "double";
  state.resizerEnabled = true;
  state.resizerHeight = 120;
  state.zoomLevel = zoom;
  document.body.style.zoom = zoom;
  const colors = [
    "#0f766e",
    "#e76f51",
    "#3d6eaa",
    "#8370b4",
    "#2e8658",
    "#b76e24",
  ];
  state.groups.forEach((g, i) => {
    g.name =
      i === 2
        ? "第三小组 · 这是一个用于测试完整显示的较长名称"
        : `第 ${i + 1} 小组`;
    g.color = colors[i % colors.length];
    g.score = i === 0 ? 12345678 : i === 13 ? -120 : 100 + i * 20;
    g.displayScore = g.score;
    g.inventory = [
      { key: i === 3 ? "mega" : "green", charges: 1 },
      { key: "banana", charges: 1 },
    ];
    g.selectedOpt = i % 2 ? "B" : "A";
    g.allIn = i === 1;
    g.itemEffect =
      i === 3
        ? { type: "mega", hitsLeft: 3 }
        : i === 4
          ? { iceLock: 1, iceRoundsLeftV218: 3 }
          : null;
  });
  document.querySelector("#heightResizerDock").style.display = "block";
  document.querySelector("#heightResizerDock").style.height = "120px";
  renderAll();
}
export function measure14() {
  const rect = (e) => {
    const r = e.getBoundingClientRect();
    return {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      bottom: r.bottom,
      top: r.top,
    };
  };
  const grid = document.querySelector("#groupList");
  return {
    cards: [...grid.querySelectorAll(":scope>.group-row-card")].map((card) => ({
      ...rect(card),
      buttons: [...card.querySelectorAll("button")].map(rect),
    })),
    dock: rect(document.querySelector(".bottom-dock")),
    spacer: rect(document.querySelector("#heightResizerDock")),
    header: rect(document.querySelector(".app-topnav")),
    grid: rect(grid),
    gap: getComputedStyle(grid).gap,
    columns: getComputedStyle(grid).gridTemplateColumns,
    scrollHeight: document.documentElement.scrollHeight,
    bodyHeight: document.body.scrollHeight,
  };
}
