function renderBgmEngineConsole() {
  const box = document.getElementById("bgmEngineConsole");
  if (!box) return;
  const trimRows = MENU_TRACK_KEYS.map(
    (k) =>
      '<div class="trim-row">' +
      '<span class="trim-name">' +
      MENU_TRACK_META[k].name +
      "</span>" +
      '<input type="range" min="0" max="2" step="0.05" value="' +
      menuCfg.gainTrims[k] +
      '" oninput="menuTrimChange(\'' +
      k +
      "', this.value)\">" +
      '<span class="trim-val" id="trim-val-' +
      k +
      '">' +
      Number(menuCfg.gainTrims[k]).toFixed(2) +
      "</span>" +
      "</div>",
  ).join("");
  box.innerHTML =
    '<div class="engine-row">' +
    "<label>菜单池启用</label>" +
    '<label style="display:flex; align-items:center; gap:6px; font-weight:600;"><input type="checkbox" id="cfgMenuEnabled" ' +
    (menuCfg.enabled ? "checked" : "") +
    ' onchange="menuEnabledChange(this.checked)"> 播放菜单同拍 BGM</label>' +
    "</div>" +
    '<div class="engine-row">' +
    "<label>菜单池 BPM（9 套严格同拍）</label>" +
    '<span style="display:flex; align-items:center; gap:8px;"><input type="range" min="80" max="180" step="1" value="' +
    menuCfg.bpm +
    '" oninput="menuBpmChange(this.value)"><span class="engine-val" id="cfgMenuBpmVal">' +
    menuCfg.bpm +
    "</span></span>" +
    "</div>" +
    '<div class="engine-row">' +
    "<label>拍号设置</label>" +
    '<select onchange="menuMeterChange(this.value)" style="padding:4px 8px; font-weight:700; background:#f8fafc; color:#1e293b; border:1px solid #cbd5e1;">' +
    '<option value="3"' +
    (menuCfg.beatsPerBar === 3 ? " selected" : "") +
    ">3/4 拍</option>" +
    '<option value="4"' +
    (menuCfg.beatsPerBar === 4 ? " selected" : "") +
    ">4/4 拍</option>" +
    "</select>" +
    "</div>" +
    '<div class="engine-row">' +
    "<label>循环起点拍数</label>" +
    '<input type="number" min="1" max="16" value="' +
    menuCfg.loopStartBeat +
    '" onchange="menuLoopChange(\'loopStartBeat\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    "</div>" +
    '<div class="engine-row">' +
    "<label>循环终点拍数</label>" +
    '<input type="number" min="16" max="128" value="' +
    menuCfg.loopEndBeat +
    '" onchange="menuLoopChange(\'loopEndBeat\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    "</div>" +
    '<div class="engine-row">' +
    "<label>过门衔接提前量（拍）</label>" +
    '<input type="number" min="0" max="4" step="0.5" value="' +
    menuCfg.transitionLeadBeats +
    '" onchange="menuLoopChange(\'transitionLeadBeats\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    "</div>" +
    '<div class="engine-row">' +
    "<label>战斗池基础 BPM（前 7 套）</label>" +
    '<span style="display:flex; align-items:center; gap:8px;"><input type="range" min="80" max="180" step="1" value="' +
    menuCfg.battleBaseBpm +
    '" oninput="battleBpmChange(\'base\', this.value)"><span class="engine-val" id="cfgBattleBaseBpmVal">' +
    menuCfg.battleBaseBpm +
    "</span></span>" +
    "</div>" +
    '<div class="engine-row">' +
    "<label>战斗池第 8 套 BPM</label>" +
    '<span style="display:flex; align-items:center; gap:8px;"><input type="range" min="80" max="180" step="1" value="' +
    menuCfg.battleSet8Bpm +
    '" oninput="battleBpmChange(\'set8\', this.value)"><span class="engine-val" id="cfgBattleSet8BpmVal">' +
    menuCfg.battleSet8Bpm +
    "</span></span>" +
    "</div>" +
    '<div class="engine-row">' +
    "<label>战斗池过门衔接提前量（拍）</label>" +
    '<input type="number" min="0" max="4" step="0.5" value="' +
    menuCfg.battleTransitionLeadBeats +
    '" onchange="menuLoopChange(\'battleTransitionLeadBeats\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    "</div>" +
    '<div style="margin-top:12px; font-weight:800; font-size:13px; color:#475569;">逐轨独立增益补偿（Gain Trim）</div>' +
    '<div class="trim-grid">' +
    trimRows +
    "</div>" +
    '<div style="margin-top:10px; font-size:12px; color:#94a3b8;">提示：请在「选择要维护的音乐套数」中选择「菜单配乐套」上传 9 首配乐（欢迎 6 轨 + 历史/档案/设置 3 轨，须严格同 BPM、同拍号）；页面切换与最高分位数跃迁时做 0.5s 同拍交叉淡化，所有轨共享同一音乐时间原点；进入比赛页时记录断点，返回后从断点续播。建议上传 OGG 或 WAV：MP3 编码会在首尾补静音，循环接缝处会出现小空拍。未上传的轨由内置合成器自动兜底，全静音状态下教学功能照常运行。</div>';
}

function menuEnabledChange(v) {
  menuCfg.enabled = v;
  saveMenuCfg();
  if (!v) menuStop();
  else if (bgmEngine.state === "IDLE")
    menuStartOrSwitch(getMenuTrackKeyForView(currentView));
}
function menuBpmChange(v) {
  menuCfg.bpm = Number(v);
  saveMenuCfg();
  const el = document.getElementById("cfgMenuBpmVal");
  if (el) el.innerText = v;
  if (menuBgm.active) menuScheduleReload();
}
function menuMeterChange(v) {
  menuCfg.beatsPerBar = Number(v);
  saveMenuCfg();
  if (menuBgm.active) menuResyncGrid();
}
function menuLoopChange(field, v) {
  menuCfg[field] = Number(v);
  saveMenuCfg();
  if (menuBgm.active) menuResyncGrid();
}
function menuTrimChange(k, v) {
  menuCfg.gainTrims[k] = Number(v);
  saveMenuCfg();
  if (menuBgm.active && audioCtx) {
    menuBgm.voices.forEach((vo) => {
      if (vo.key === k && !vo.stopping) menuVoiceRamp(vo, menuTrimFor(k), 0.08);
    });
  }
  const el = document.getElementById("trim-val-" + k);
  if (el) el.innerText = Number(v).toFixed(2);
}
function battleBpmChange(which, v) {
  if (which === "base") {
    menuCfg.battleBaseBpm = Number(v);
    const el = document.getElementById("cfgBattleBaseBpmVal");
    if (el) el.innerText = v;
  } else {
    menuCfg.battleSet8Bpm = Number(v);
    const el = document.getElementById("cfgBattleSet8BpmVal");
    if (el) el.innerText = v;
  }
  saveMenuCfg();
}

/* ---------- 抽签长串长音效（roll_loop） ---------- */
