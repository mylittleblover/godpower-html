/* Shared UI-only visibility adapter. Business cleanup stays in its original command. */
function showClassroomWindow(root) {
  if (!root) return;
  if (typeof DesktopUI !== 'undefined') DesktopUI.cancelWindowClose(root);
  root.classList.add('active');
}
function hideClassroomWindow(root, finish) {
  if (!root) return;
  const commit = finish || (() => root.classList.remove('active'));
  if (typeof DesktopUI !== 'undefined') DesktopUI.dismissWindow(root, commit);
  else commit();
}


const DEFAULT_COLORS = ['#E5484D', '#2F7DD1', '#3A9D5D', '#F08C1A', '#8E44AD', '#18A6B8', '#4F64D8', '#D84A83', '#D95D39', '#159E91', '#6FA52E', '#A05BE5', '#C58B14', '#D94F70', '#2589BD', '#6F6BB2'];

function readableTextOnColor(hex){
  const raw=String(hex||'').trim().replace('#','');
  const value=raw.length===3?raw.split('').map(x=>x+x).join(''):raw;
  if(!/^[0-9a-f]{6}$/i.test(value))return '#FFFFFF';
  const rgb=[0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
  const luminance=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
  if(1.05/(luminance+.05)>=4.5)return '#FFFFFF';
  const ink=[23,48,45].map(v=>v/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
  const inkLuminance=.2126*ink[0]+.7152*ink[1]+.0722*ink[2];
  if((luminance+.05)/(inkLuminance+.05)>=4.5)return '#17302D';
  return '#000000';
}

const FX_SOUND_SLOTS = [
  {id:'fullscreen_pick',name:'全屏点名揭晓',category:'全屏演出',desc:'全屏揭晓时播放；支持多段候选随机播放'},
  {id:'fullscreen_score_add',name:'全屏加分展示',category:'全屏演出',desc:'绿色全屏加分展示音效'},
  {id:'fullscreen_score_sub',name:'全屏扣分展示',category:'全屏演出',desc:'红色全屏扣分展示音效'},
  ...ActionSounds.slots,
  { id: 'score_add', name: '基础加分 (+1 / +2)', desc: '复古方波金币音' },
  { id: 'score_sub', name: '基础扣分 (-1 / -2)', desc: '低沉方波震动音' },
  { id: 'pk_correct', name: 'PK 普通答对 (+2)', desc: '双阶明亮钟鸣' },
  { id: 'allin_win', name: 'All in 胜出 (翻倍)', desc: '凯旋胜利琶音' },
  { id: 'allin_lose', name: 'All in 失败 (清零)', desc: '急坠爆炸杂音' },
  { id: 'big_win', name: '🏆 分数位数突破 / 大题大额加分 (>=4)', desc: '大额欢庆长琶音（支持自定义上传）' },
  { id: 'rewind', name: '撤销与历史回溯', desc: '急速反转扫频音' },
  { id: 'ui_click', name: '按钮点选', desc: '复古微击音' },
  { id: 'roll_tick', name: '点名滚动', desc: '打字机转盘刻度声（保留备用）' },
  { id: 'roll_loop', name: '点名滚动循环', desc: '长串抽签连续循环音（无自定义时合成）' },
  { id: 'roll_win', name: '点名定格', desc: '点名定格号角' }
];

const SET_TRACK_TYPES = [
  { key: 'intro_normal', name: '常规 Intro 1', desc: '开局引子或无 All in 衔接' },
  { key: 'intro_win', name: '胜利翻盘 Intro 2', desc: '上一题 All in 成功多于失败' },
  { key: 'intro_loss', name: '挫败全灭 Intro 3', desc: '上一题 All in 失败多于成功' },
  { key: 'thinking', name: '思考解谜轨 (Thinking Loop)', desc: '第 9 拍至 184 拍无尾音循环' },
  { key: 'battle', name: '战斗核心轨 (Battle Loop)', desc: '第 9 拍至 184 拍无尾音循环' },
  { key: 'victory', name: '胜利结算曲 (Victory Fanfare)', desc: '下一小节强拍单次播放并停机' },
  { key: 'trans_0', name: '过门 1 (占用 1 拍)', desc: '距下一小节不足 2 拍时发力' },
  { key: 'trans_1', name: '过门 2 (占用 2 拍)', desc: '距下一小节不足 3 拍时发力' },
  { key: 'trans_2', name: '过门 3 (占用 3 拍)', desc: '距下一小节不足 4 拍时发力' },
  { key: 'trans_3', name: '过门 4 (占用 4 拍/整小节)', desc: '距下一小节不足 1 拍时下小节起奏' }
];

// ===== v2 核心基础设施 =====
const STORAGE = {
  get(key, fallback = null) {
    try { return localStorage.getItem(key) ?? fallback; } catch (_) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, String(value)); return true; } catch (_) { return false; }
  },
  getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (_) { return fallback; }
  },
  setJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
  }
};

const clone = value => JSON.parse(JSON.stringify(value));

let state = {
  isLocked: true,
  hasStartedOnce: false,
  roundActive: false,
  lastRoundAllIn: null,
  adminPin: STORAGE.get('politics_admin_pin', '1234'),
  soundEnabled: true,
  masterVolume: parseFloat(STORAGE.get('politics_master_volume', '0.85')),
  zoomLevel: parseFloat(STORAGE.get('politics_zoom_level', '1.0')),
  resizerEnabled: STORAGE.getJSON('politics_resizer_enabled', false),
  resizerHeight: parseInt(STORAGE.get('politics_resizer_height', '120'), 10),
  columnMode: STORAGE.get('politics_column_mode', 'double'),
  saveAllIn: STORAGE.getJSON('politics_save_allin', true),
  bpm: 130,
  beatsPerBar: 4,
  correctAns: '',
  evaluated: false,
  editingScoreId: null,
  activeModalGroupId: null,
  picker: {
    mode: 'individual',
    antiRepeat: true,
    pickedStudentKeys: [],
    pickedGroupIds: [],
    preselectedGroupIds: []
  },
  groups: []
};

try {
  const saved = STORAGE.getJSON('politics_groups_data', null);
  if (saved) { state.groups = saved; }
  const parsedPicker = STORAGE.getJSON('politics_picker_state', null);
  if (parsedPicker && typeof parsedPicker === 'object') {
    state.picker = { ...state.picker, ...parsedPicker };
  }
} catch(e) {}

if (!Array.isArray(state.groups) || state.groups.length === 0) {
  state.groups = [
    { id: 1, name: '第 1 组', color: '#e53935', score: 0, displayScore: 0, selectedOpt: '', allIn: false, resultText: '', animState: '', members: ['陈思远', '林子涵', '许文博'] },
    { id: 2, name: '第 2 组', color: '#1e88e5', score: 0, displayScore: 0, selectedOpt: '', allIn: false, resultText: '', animState: '', members: ['张晨阳', '罗心怡', '魏嘉豪'] },
    { id: 3, name: '第 3 组', color: '#43a047', score: 0, displayScore: 0, selectedOpt: '', allIn: false, resultText: '', animState: '', members: ['陆天宇', '谭静雅', '孙雨泽'] },
    { id: 4, name: '第 4 组', color: '#fb8c00', score: 0, displayScore: 0, selectedOpt: '', allIn: false, resultText: '', animState: '', members: ['董奕辰', '蒋雨欣', '汪浩然'] }
  ];
}

function normalizeGroup(raw, index = 0) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const numericScore = Number(source.score);
  let id = Number.isFinite(Number(source.id)) ? Number(source.id) : Date.now() + index;
  if (!Number.isSafeInteger(id)) id = Date.now() + index;
  const color = /^#[0-9a-fA-F]{6}$/.test(String(source.color || ''))
    ? String(source.color) : DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  const members = Array.isArray(source.members)
    ? Array.from(new Set(source.members.map(v => String(v ?? '').trim()).filter(Boolean)))
    : [];
  return {
    id,
    name: String(source.name ?? `第 ${index + 1} 组`).trim() || `第 ${index + 1} 组`,
    color,
    score: Number.isFinite(numericScore) ? Math.trunc(numericScore) : 0,
    displayScore: 0,
    selectedOpt: ['A','B','C','D'].includes(source.selectedOpt) ? source.selectedOpt : '',
    allIn: !!source.allIn,
    resultText: String(source.resultText ?? ''),
    animState: '',
    members,
    /* V2.8: these fields are persistent classroom data, not session-only UI state. */
    inventory: Array.isArray(source.inventory) ? source.inventory.map(it => ({...it})) : [],
    itemStats: Reliability.normalizeStats(source.itemStats),
    itemEffect: Reliability.normalizeEffect(source.itemEffect),
    booShield: Number.isFinite(Number(source.booShield)) ? Number(source.booShield) : 0,
    groupNo: Number.isSafeInteger(Number(source.groupNo)) && Number(source.groupNo)>0 ? Number(source.groupNo) : index+1,
    booRoundsLeftV218: Math.max(0,Math.trunc(Number(source.booRoundsLeftV218)||0)),
    roundItemContinuationKeyV218: String(source.roundItemContinuationKeyV218||''),
    itemUsedThisRound: !!source.itemUsedThisRound
  };
}

function normalizeAllGroups(groups) {
  const seen = new Set();
  return (Array.isArray(groups) ? groups : []).map((raw, index) => {
    const g = normalizeGroup(raw, index);
    while (seen.has(g.id)) g.id = Date.now() + index + seen.size + 1;
    seen.add(g.id);
    g.displayScore = g.score;
    return g;
  });
}

function initSessionState() {
  state.roundActive = false;
  state.hasStartedOnce = false;
  state.evaluated = false;
  state.correctAns = '';
  state.editingScoreId = null;
  state.activeModalGroupId = null;
  state.groups = normalizeAllGroups(state.groups);
  state.picker.mode = ['individual','group','two_tier'].includes(state.picker.mode) ? state.picker.mode : 'individual';
  state.picker.antiRepeat = state.picker.antiRepeat !== false;
  state.picker.pickedStudentKeys = Array.isArray(state.picker.pickedStudentKeys) ? state.picker.pickedStudentKeys : [];
  state.picker.pickedGroupIds = Array.isArray(state.picker.pickedGroupIds) ? state.picker.pickedGroupIds : [];
  state.groups.forEach(g => {
    g.displayScore = g.score;
    g.selectedOpt = '';
    g.allIn = false;
    g.resultText = '';
    g.animState = '';
  });
}
initSessionState();
// Startup must not overwrite existing classroom data before all adapters are ready.

const MAX_HISTORY = 40;
let historyStack = [];

let audioCtx = null;
let masterGainNode = null;
let db = null;
let customFxBuffers = {};
let customFxVariants = Object.create(null);
let currentUploadingAppend = false;
let activeSetBuffers = {};
let currentUploadingSlot = null;
let activeEditingGroupId = null;

let slotEngine = {
  isSpinning: false,
  timerGroup: null,
  timerStudent: null,
  chosenResult: null
};

let bgmShufflePool = [];
let currentSetIndex = -1;
let isSwitchingRound = false;
let isStartingRound = false;

function checkAllInRatio() {
  const total = state.groups.length;
  if (total === 0) return false;
  const count = state.groups.filter(g => g.allIn).length;
  return (count / total) >= (1 / 3);
}

// ===== 最终结算与档案处核心逻辑 =====
let confettiAnimationId = null;
let confettiParticles = [];

function getSettlementHistory() {
  return STORAGE.getJSON('politics_settlement_history', []);
}

function saveSettlementRecord(record) {
  if (!record.clearedData) record.clearedData=buildSettlementClearedDataV21813();
  record.schemaVersion=Reliability.schemaVersion;
  return Reliability.appendArchive(CLASSROOM_STORAGE,record);
}

function triggerFinalSettlement() {
  if (state.isLocked) {
    themeAlert('封神榜不是随手一按的烟花按钮。先去底栏解锁上帝模式，再回来决定全班分数的命运。');
    openPwdModal();
    return;
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const defaultTitle = `${y}年${m}月${d}日 积分结算`;

  const input = document.getElementById('settlementNameInput');
  if (input) input.value = defaultTitle;
  if(typeof DesktopUI!=='undefined')DesktopUI.prepareSettlement();
  showClassroomWindow(document.getElementById('settlementNameModal'));
  setTimeout(() => { if (input) { input.focus(); input.select(); } }, 60);
}

function closeSettlementNameModal() {
  if(typeof DesktopUI!=='undefined')DesktopUI.cancelSettlement();
  hideClassroomWindow(document.getElementById('settlementNameModal'));
}

function confirmFinalSettlement() {
  Reliability.invalidateDefenseDecisions();
  if(state.isLocked){openPwdModal();return {ok:false,reason:'locked'}}
  if(itemDrawBusy || slotEngine.isSpinning || isStartingRound || isSwitchingRound){
    showToast('请等待当前抽取或回合切换完成后结算');return {ok:false,reason:'busy'};
  }
  if(!state.groups.some(g=>g.score!==0 || g.inventory.length || g.itemStats.correct || g.itemStats.wrong) && !state.hasStartedOnce){
    showToast('暂无需要结算的比赛数据');return {ok:false,reason:'empty'};
  }
  const input = document.getElementById('settlementNameInput');
  const title = (input ? input.value.trim() : '') || '积分结算';
  closeSettlementNameModal();

  const sorted = [...state.groups].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const record = {
    id: Date.now(),
    title: title,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleString(),
    champion: top1 ? top1.name : '无',
    totalGroups: state.groups.length,
    totalScore: state.groups.reduce((sum, g) => sum + (Number(g.score) || 0), 0),
    groups: clone(sorted)
  };
  const archiveResult=saveSettlementRecord(record);
  if(!archiveResult.ok){
    themeAlert('归档失败，课堂数据保持原样。请导出 JSON 备份并释放存储空间。'+archiveResult.error);
    return archiveResult;
  }
  const beforeReset=clone(state), beforeHistory=clone(historyStack);
  recordHistory(`执行最终结算: ${title} (第 1 名: ${record.champion})`);

  bgmStopAll();
  state.roundActive = false;
  state.evaluated = true;
  renderControls();
  playSound('big_win');
  setTimeout(() => playSound('roll_win'), 450);

  const grandTitle = document.getElementById('grandModalTitle');
  if (grandTitle) grandTitle.innerText = title;
  const grandPodium = document.getElementById('grandPodiumDeck');
  if (grandPodium) {
    grandPodium.innerHTML = `
      <div class="podium-col rank-2">
        <span class="podium-badge" style="color: #64748b;">第 2 名</span>
        <span class="podium-name">${top2 ? escapeHtml(top2.name) : '-'}</span>
        <span class="podium-score" style="color: ${top2 ? top2.color : '#94a3b8'};">${top2 ? top2.score : 0}分</span>
      </div>
      <div class="podium-col rank-1">
        <span class="podium-badge" style="color: #ca8a04;">第 1 名</span>
        <span class="podium-name">${top1 ? escapeHtml(top1.name) : '-'}</span>
        <span class="podium-score" style="color: ${top1 ? top1.color : '#ca8a04'}; font-size:20px;">${top1 ? top1.score : 0}分</span>
      </div>
      <div class="podium-col rank-3">
        <span class="podium-badge" style="color: #ea580c;">第 3 名</span>
        <span class="podium-name">${top3 ? escapeHtml(top3.name) : '-'}</span>
        <span class="podium-score" style="color: ${top3 ? top3.color : '#94a3b8'};">${top3 ? top3.score : 0}分</span>
      </div>
    `;
  }
  showClassroomWindow(document.getElementById('grandModalOverlay'));
  initConfetti();

  resetCompetitionDataAfterSettlementV21812();
  const resetResult=saveState();
  if(!resetResult.ok){
    state=beforeReset;historyStack=beforeHistory;
    renderAll();themeAlert('档案已保存，但新课堂数据保存失败；已恢复清零前课堂。请导出备份。');
    return resetResult;
  }
  renderAll();
  showToast(`封神榜已归档，本轮课堂数据已全部归零 · 第 1 名：${record.champion}`);
  return {ok:true};
}

function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fde047'];
  confettiParticles = [];
  for (let i = 0; i < 160; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 3,
      speedX: Math.random() * 4 - 2,
      angle: Math.random() * 360,
      spin: Math.random() * 6 - 3
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.angle += p.spin;
      if (p.y > canvas.height) p.y = -10;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    confettiAnimationId = requestAnimationFrame(loop);
  }
  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  loop();
}

function stopConfetti() {
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
}

function closeGrandSettlementModal() {
  hideClassroomWindow(document.getElementById('grandModalOverlay'));
  stopConfetti();
}

function openSettlementHistoryModal() {
  switchView('archives');
}

function closeSettlementHistoryModal() {
  switchView('battle');
}

function renderArchiveClassStats() {
  const host = document.getElementById('archiveClassStats');
  if (!host) return;
  const itemGlobal = state.itemGlobal || {};
  const answers = state.groups.reduce((total, group) => {
    const stats = group.itemStats || {};
    return total + Number(stats.correct || 0) + Number(stats.wrong || 0);
  }, 0);
  const metrics = [
    ['课堂作答', answers, '次'],
    ['答题轮次', Number(itemGlobal.pkTotal || 0), '轮'],
    ['全局道具发放', Number(itemGlobal.totalDraws || 0), '件'],
    ['手动举手', Number(itemGlobal.handRaiseTotal || 0), '次']
  ];
  host.innerHTML = `<div class="archive-stats-head"><h3>课堂累计统计</h3><span>随当前课堂数据实时更新</span></div><div class="archive-stats-grid">${metrics.map(([label,value,unit]) => `<div class="archive-stat-card"><b>${value}<small>${unit}</small></b><span>${label}</span></div>`).join('')}</div>`;
}

function renderSettlementHistoryList() {
  if(typeof DesktopUI!=='undefined')DesktopUI.renderArchives();
}

function exportSingleSettlementCSV(index) {
  const list = getSettlementHistory();
  const record = list[index];
  if (!record) return;

  let csvContent = "\uFEFF排名,小组名称,最终得分,组员名单\n";
  record.groups.forEach((g, r) => {
    const members = (g.members || []).join(' / ');
    csvContent += `${r + 1},"${g.name.replace(/"/g, '""')}",${g.score},"${members.replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(record.title || '课堂最终结算').replace(/[\/\s:]/g, '_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('表格导出成功');
}

function exportLatestSettlementCSV() {
  const list = getSettlementHistory();
  if (list.length === 0) {
    themeAlert('暂无结算归档可导出');
    return;
  }
  exportSingleSettlementCSV(0);
}

async function deleteSettlementRecord(index) {
  if (state.isLocked) {
    themeAlert('想删档案先解锁上帝模式。历史已经够脆弱了，系统至少要求你先输个密码。');
    openPwdModal();
    return;
  }
  if (!await themeConfirm('确定要删除这条最终结算档案记录吗？此操作不可逆！', {title:'删除结算档案', danger:true, confirmText:'删除'})) return;
  const list = getSettlementHistory();
  list.splice(index, 1);
  STORAGE.setJSON('politics_settlement_history', list);
  renderSettlementHistoryList();
  showToast('该结算档案已删除');
}

// ===== 启动性能优化：音频元数据缓存 + 延迟音频初始化 =====
let soundIdCache = new Set();
let fxSoundsLoaded = false;
let fxSoundsLoading = null;
let backgroundAudioInitTimer = null;
let dbInitPromise = null;

function scheduleIdleTask(fn, timeout = 1500) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(fn, { timeout });
  }
  return window.setTimeout(fn, Math.min(timeout, 800));
}

function refreshSoundIdCache() {
  return new Promise(resolve => {
    if (!db) { resolve(soundIdCache); return; }
    try {
      const tx = db.transaction('sounds', 'readonly');
      const store = tx.objectStore('sounds');
      const req = store.getAllKeys();
      req.onsuccess = () => {
        soundIdCache = new Set(req.result || []);
        resolve(soundIdCache);
      };
      req.onerror = () => resolve(soundIdCache);
    } catch (_) {
      resolve(soundIdCache);
    }
  });
}

function hasSound(slotId) {
  return soundIdCache.has(slotId);
}

const bgmEngine = {
  state: 'IDLE',
  syncStartTime: 0,
  battleGain: null,
  thinkingGain: null,
  activeNodes: [],
  victoryNode: null,
  preloadedSet: null,
  isPreloading: false,
  victoryTimer: null,
  victoryFadeTimer: null,
  transitionTimer: null
};

function getSecPerBeat() { 
  const effectiveBpm = (currentSetIndex === 7)
    ? (Number(menuCfg.battleSet8Bpm) || 135)
    : (Number(menuCfg.battleBaseBpm) || Number(state.bpm) || 130);
  return 60 / Math.max(1, effectiveBpm); 
}
function getSecPerBar() { return getSecPerBeat() * Math.max(1, Number(state.beatsPerBar) || 4); }

function getTrackCurrentBeat() {
  if (!audioCtx || bgmEngine.syncStartTime === 0) return 0;
  const now = audioCtx.currentTime;
  const elapsed = Math.max(0, now - bgmEngine.syncStartTime);
  const secPerBeat = getSecPerBeat();
  const loopStartSec = 8 * secPerBeat;
  const loopEndSec = 184 * secPerBeat;
  const loopDurationSec = loopEndSec - loopStartSec;

  let currentSecInTrack;
  if (elapsed < loopEndSec) {
    currentSecInTrack = elapsed;
  } else {
    currentSecInTrack = loopStartSec + ((elapsed - loopEndSec) % loopDurationSec);
  }
  return currentSecInTrack / secPerBeat;
}







function openHistoryModal() {
  switchView('history');
}

function closeHistoryModal() {
  switchView('battle');
}

function renderHistoryList() {
  if(typeof DesktopUI!=='undefined')DesktopUI.renderHistory();
}

function toggleHistExpand(index) {
  const nodes = document.querySelectorAll('#historyListView .hist-node');
  const node = nodes[nodes.length - 1 - index];
  if (node) node.classList.toggle('expanded');
}

async function clearHistoryStack() {
  if (state.isLocked) { openPwdModal(); return; }
  if (!await themeConfirm('确定清空全部历史操作记录吗？此操作不可逆。', {title:'清空历史记录', danger:true, confirmText:'清空'})) return;
  historyStack = [];
  renderHistoryList();
  showToast('历史记录已清空');
}

function revertToHistory(index) {
  if (state.isLocked) {
    themeAlert('时间旅行需要许可证。先解锁上帝模式，再回来改写历史。');
    openPwdModal();
    return;
  }
  const target = historyStack[index];
  if (!target) return;
  historyStack = historyStack.slice(0, index);
  restoreStateFromSnapshot(target);
  playSound('rewind');
  renderHistoryList();
  showToast(`已回溯至：[${target.time}] ${target.desc}`);
}

function initDB() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open('PoliticsScoreSoundDB_Unified', 1);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains('sounds')) {
          database.createObjectStore('sounds', { keyPath: 'id' });
        }
      };

      request.onsuccess = async (e) => {
        db = e.target.result;
        await refreshSoundIdCache();
        resolve();
        scheduleBackgroundAudioInit();
      };

      request.onerror = () => resolve();
    } catch (_) {
      resolve();
    }
  });

  return dbInitPromise;
}

function scheduleBackgroundAudioInit() {
  if (backgroundAudioInitTimer !== null) return;

  backgroundAudioInitTimer = scheduleIdleTask(async () => {
    backgroundAudioInitTimer = null;
    const migrationDone = STORAGE.get('politics_audio_migration_v1', '0') === '1';
    if (!migrationDone) {
      try {
        await migrateOldDatabases();
      } catch (_) {}
      STORAGE.set('politics_audio_migration_v1', '1');
      await refreshSoundIdCache();
    }

    try {
      await loadFxSounds();
    } catch (_) {}
  }, 1800);
}

async function migrateOldDatabases() {
  const legacyNames = ['PoliticsScoreSoundDB_v3', 'PoliticsScoreSoundDB'];
  for (const oldName of legacyNames) {
    try {
      await new Promise(res => {
        const req = indexedDB.open(oldName);
        req.onsuccess = (ev) => {
          const oldDb = ev.target.result;
          if (!oldDb.objectStoreNames.contains('sounds')) { oldDb.close(); res(); return; }
          const txOld = oldDb.transaction('sounds', 'readonly');
          const storeOld = txOld.objectStore('sounds');
          const getAllReq = storeOld.getAll();
          getAllReq.onsuccess = () => {
            const records = getAllReq.result || [];
            if (records.length > 0) {
              const txNew = db.transaction('sounds', 'readwrite');
              const storeNew = txNew.objectStore('sounds');
              records.forEach(rec => {
                let newId = rec.id;
                if (newId === 'bgm_intro_0') newId = 'bgm_set_0_intro_normal';
                else if (newId === 'bgm_thinking') newId = 'bgm_set_0_thinking';
                else if (newId === 'bgm_battle') newId = 'bgm_set_0_battle';
                else if (newId === 'bgm_victory') newId = 'bgm_set_0_victory';
                else if (newId.startsWith('bgm_trans_')) newId = `bgm_set_0_trans_${newId.replace('bgm_trans_', '')}`;
                storeNew.put({ id: newId, arrayBuffer: rec.arrayBuffer });
              });
            }
            oldDb.close();
            res();
          };
          getAllReq.onerror = () => { oldDb.close(); res(); };
        };
        req.onerror = () => res();
      });
    } catch(e) {}
  }
}

async function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(state.masterVolume, audioCtx.currentTime);
    masterGainNode.connect(audioCtx.destination);

    bgmEngine.battleGain = audioCtx.createGain();
    bgmEngine.thinkingGain = audioCtx.createGain();
    bgmEngine.battleGain.connect(masterGainNode);
    bgmEngine.thinkingGain.connect(masterGainNode);
  }
  if (audioCtx.state === 'suspended') {
    try {
      await Promise.race([
        audioCtx.resume(),
        new Promise(res => setTimeout(() => res(), 1500))
      ]);
    } catch(e) {}
  }
  return audioCtx;
}

async function loadFxSounds() {
  if (!db || fxSoundsLoaded) return;
  if (fxSoundsLoading) return fxSoundsLoading;

  fxSoundsLoading = (async () => {
    try {
      const records = await new Promise(resolve => {
        const tx = db.transaction('sounds', 'readonly');
        const store = tx.objectStore('sounds');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });

      const ctx = await getAudioContext();
      const fxRecords = records.filter(item =>
        item && typeof item.id === 'string' &&
        item.id.startsWith('fx_') &&
        item.arrayBuffer && item.arrayBuffer.byteLength > 0
      );

      const variants = Object.create(null);
      await Promise.all(fxRecords.map(async item => {
        try {
          const decoded = await ctx.decodeAudioData(item.arrayBuffer.slice(0));
          const key=item.id.slice(3),split=key.indexOf('::variant::');
          if(split>=0){const slot=key.slice(0,split);(variants[slot]||=[]).push({id:item.id,name:item.name||'候选音效',buffer:decoded});}
          else customFxBuffers[key] = decoded;
        } catch (_) {}
      }));

      Object.values(variants).forEach(list=>list.sort((a,b)=>a.id.localeCompare(b.id)));
      customFxVariants=variants;
      fxSoundsLoaded = true;
    } catch (_) {
    } finally {
      fxSoundsLoading = null;
    }
  })();

  return fxSoundsLoading;
}

/* One selected sample per operation; separate entropy avoids consuming game randomness. */
function selectFxBuffer(slotId,random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296){
  const candidates=[customFxBuffers[slotId],...(customFxVariants[slotId]||[]).map(x=>x.buffer)].filter(Boolean);
  if(!candidates.length)return null;
  if(candidates.length===1)return candidates[0];
  return candidates[Math.min(candidates.length-1,Math.max(0,Math.floor(random()*candidates.length)))];
}
function renderFxChoices(slotId){
  const choices=customFxVariants[slotId]||[],count=choices.length+(customFxBuffers[slotId]?1:0);
  return `<div class="cf-audio-choices"><button class="btn btn-sm" onclick="triggerUploadAudio('fx_${slotId}',true)">追加音效</button><span class="setting-note">${count?count+' 个候选 · 每次随机播放':'未上传 · 使用默认音效'}</span>${choices.length?`<details><summary>管理候选音效</summary>${choices.map((x,i)=>`<div class="cf-audio-choice"><span>${escapeHtml(x.name||'候选 '+(i+1))}</span><button class="btn btn-sm" data-fx-remove="${escapeHtml(x.id)}" onclick="deleteFxCandidate(this.dataset.fxRemove)">移除</button></div>`).join('')}</details>`:''}</div>`;
}
async function deleteFxCandidate(id){
  if(!db||typeof id!=='string'||!id.includes('::variant::'))return;
  try{
    await new Promise((resolve,reject)=>{const tx=db.transaction('sounds','readwrite');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);tx.objectStore('sounds').delete(id)});
    const slot=id.slice(3,id.indexOf('::variant::'));customFxVariants[slot]=(customFxVariants[slot]||[]).filter(x=>x.id!==id);soundIdCache.delete(id);
    renderFxSlotList();renderItemFxSoundListV26();showToast('候选音效已移除');
  }catch(error){showToast('移除失败，原音效保留')}
}

function checkSetCompleteness(setIdx) {
  if (!db) return Promise.resolve({ isComplete: false, count: 0, hasCore: false });

  const doCheck = () => {
    const isMenuSet = setIdx === 8;
    const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;
    const prefix = isMenuSet ? 'bgm_menu_' : `bgm_set_${setIdx}_`;

    let count = 0;
    let hasThinking = false;
    let hasBattle = false;

    for (const t of trackTypes) {
      const id = prefix + t.key;
      if (hasSound(id)) {
        count++;
        if (t.key === 'thinking') hasThinking = true;
        if (t.key === 'battle') hasBattle = true;
      }
    }

    return {
      isComplete: count === trackTypes.length,
      count,
      hasCore: hasThinking && hasBattle
    };
  };

  if (soundIdCache.size === 0) {
    return refreshSoundIdCache().then(doCheck);
  }
  return Promise.resolve(doCheck());
}

async function getAllCompleteSetIndices() {
  const completeIndices = [];
  for (let i = 0; i < 8; i++) {
    const res = await checkSetCompleteness(i);
    if (res.isComplete) completeIndices.push(i);
  }
  return completeIndices;
}

async function getFallbackSetIndex() {
  for (let i = 0; i < 8; i++) {
    const res = await checkSetCompleteness(i);
    if (res.hasCore) return i;
  }
  return -1;
}

async function pickNextPlayableSetIndex() {
  const completeSets = await getAllCompleteSetIndices();
  if (completeSets.length > 0) {
    bgmShufflePool = bgmShufflePool.filter(idx => completeSets.includes(idx));
    if (bgmShufflePool.length === 0) {
      bgmShufflePool = [...completeSets];
      for (let i = bgmShufflePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bgmShufflePool[i], bgmShufflePool[j]] = [bgmShufflePool[j], bgmShufflePool[i]];
      }
    }
    return { setIndex: bgmShufflePool.shift(), isFallback: false };
  }

  const fallbackIdx = await getFallbackSetIndex();
  if (fallbackIdx !== -1) {
    return { setIndex: fallbackIdx, isFallback: true };
  }

  return { setIndex: -1, isFallback: false };
}

async function fetchAndDecodeSetBuffers(setIdx, onProgress) {
  if (setIdx < 0 || !db) return {};

  try {
    const rawDict = await new Promise(resolve => {
      const tx = db.transaction('sounds', 'readonly');
      const store = tx.objectStore('sounds');
      const dict = {};
      let pending = SET_TRACK_TYPES.length;

      if (pending === 0) {
        resolve(dict);
        return;
      }

      SET_TRACK_TYPES.forEach(t => {
        const id = `bgm_set_${setIdx}_${t.key}`;
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.arrayBuffer) dict[t.key] = req.result.arrayBuffer;
          pending--;
          if (pending === 0) resolve(dict);
        };
        req.onerror = () => {
          pending--;
          if (pending === 0) resolve(dict);
        };
      });
    });

    const ctx = await getAudioContext();
    const entries = Object.entries(rawDict);
    const total = entries.length;

    if (total === 0) {
      if (onProgress) onProgress(80);
      return {};
    }

    let loadedCount = 0;
    const buffers = {};

    await Promise.all(entries.map(async ([key, ab]) => {
      try {
        buffers[key] = await ctx.decodeAudioData(ab.slice(0));
      } catch (_) {
      } finally {
        loadedCount++;
        if (onProgress) onProgress(Math.round(30 + (loadedCount / total) * 50));
      }
    }));

    return buffers;
  } catch (_) {
    return {};
  }
}

async function bgmPreloadNextSet() {
  if (bgmEngine.isPreloading) return;
  bgmEngine.isPreloading = true;

  try {
    const { setIndex, isFallback } = await pickNextPlayableSetIndex();
    if (setIndex !== -1) {
      const buffers = await fetchAndDecodeSetBuffers(setIndex);
      bgmEngine.preloadedSet = { setIndex, isFallback, buffers };
    }
  } catch(e) {
  } finally {
    bgmEngine.isPreloading = false;
  }
}

function playChiptuneSynth(slotId) {
  const buttonTone=ActionSounds.slots.find(x=>x.id===slotId);
  if(buttonTone)slotId='ui_click';
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    switch (slotId) {
      case 'score_add': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain); gain.connect(getFxOutputV2176());
        osc.start(now); osc.stop(now + 0.35);
        break;
      }
      case 'score_sub': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain); gain.connect(getFxOutputV2176());
        osc.start(now); osc.stop(now + 0.25);
        break;
      }
      case 'big_win': {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
          osc.connect(gain); gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.07); osc.stop(now + idx * 0.07 + 0.35);
        });
        break;
      }
      case 'rewind': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(getFxOutputV2176());
        osc.start(now); osc.stop(now + 0.3);
        break;
      }
      case 'pk_correct': {
        [523.25, 783.99].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.2, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
          osc.connect(gain); gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.09); osc.stop(now + idx * 0.09 + 0.25);
        });
        break;
      }
      case 'allin_win': {
        const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.22, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain); gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.35);
        });
        break;
      }
      case 'allin_lose': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain); gain.connect(getFxOutputV2176());
        osc.start(now); osc.stop(now + 0.5);
        break;
      }
      case 'ui_click': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(buttonTone?.pitch||1200, now);
        gain.gain.setValueAtTime(0.1 * (typeof ClassroomFeedback!=='undefined'?ClassroomFeedback.getOptions().clickVolume:1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain); gain.connect(getFxOutputV2176());
        osc.start(now); osc.stop(now + 0.03);
        break;
      }
      case 'roll_tick': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.connect(gain); gain.connect(getFxOutputV2176());
        osc.start(now); osc.stop(now + 0.025);
        break;
      }
      case 'roll_win': {
        [1046.50, 1567.98].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
          osc.connect(gain); gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.1); osc.stop(now + idx * 0.1 + 0.35);
        });
        break;
      }
    }
  } catch(e) {}
}

async function playSound(slotId) {
  try {
    await getAudioContext();
    if(!fxSoundsLoaded)await loadFxSounds();
    const selectedFx=selectFxBuffer(slotId)||(ActionSounds.isClick(slotId)&&slotId!=='ui_click'?selectFxBuffer('ui_click'):null);
    if (selectedFx) {
      const source = audioCtx.createBufferSource();
      source.buffer = selectedFx;
      if(ActionSounds.isClick(slotId) && typeof ClassroomFeedback!=='undefined'){
        const gain=audioCtx.createGain();gain.gain.value=ClassroomFeedback.getOptions().clickVolume;source.connect(gain);gain.connect(getFxOutputV2176());ClassroomFeedback.ownClickVoice(source,gain);
      }else source.connect(getFxOutputV2176());
      source.start(0);
    } else {
      playChiptuneSynth(({fullscreen_pick:'roll_win',fullscreen_score_add:'score_add',fullscreen_score_sub:'score_sub'})[slotId] || (slotId==='roll_loop'?'roll_tick':slotId));
    }
  } catch (_) {}
}

let activeLoopTimeouts = [];
function clearAllLoopTimeouts() {
  activeLoopTimeouts.forEach(id => clearTimeout(id));
  activeLoopTimeouts = [];
}

function scheduleDualLoopChunk(startTime, offsetSec) {
  if (bgmEngine.state === 'IDLE' || bgmEngine.state === 'VICTORY' || bgmEngine.state === 'NO_TRACKS') return;

  const battleBuf = activeSetBuffers['battle'];
  const thinkBuf = activeSetBuffers['thinking'];
  if (!battleBuf && !thinkBuf) return;

  const secPerBeat = getSecPerBeat();
  const loopStartSec = 8 * secPerBeat;
  const loopEndSec = 184 * secPerBeat;
  const chunkDuration = loopEndSec - offsetSec;

  const now = audioCtx.currentTime;
  const actualStart = Math.max(now, startTime);

  if (battleBuf) {
    const bSrc = audioCtx.createBufferSource();
    bSrc.buffer = battleBuf;
    bSrc.connect(bgmEngine.battleGain);
    bSrc.start(actualStart, offsetSec);
    bSrc.stop(actualStart + chunkDuration);
    bgmEngine.activeNodes.push(bSrc);
  }

  if (thinkBuf) {
    const tSrc = audioCtx.createBufferSource();
    tSrc.buffer = thinkBuf;
    tSrc.connect(bgmEngine.thinkingGain);
    tSrc.start(actualStart, offsetSec);
    tSrc.stop(actualStart + chunkDuration);
    bgmEngine.activeNodes.push(tSrc);
  }

  const nextStartTime = actualStart + chunkDuration;
  const delayMs = Math.max(0, (nextStartTime - audioCtx.currentTime - 0.25) * 1000);

  const timerId = setTimeout(() => {
    scheduleDualLoopChunk(nextStartTime, loopStartSec);
  }, delayMs);

  activeLoopTimeouts.push(timerId);
}

async function bgmStartNewRoundMusicWithProgress(onProgress) {
  try {
    onProgress(10);
    await getAudioContext();
    onProgress(20);
    bgmStopAll();

    if (bgmEngine.preloadedSet && bgmEngine.preloadedSet.setIndex !== -1) {
      currentSetIndex = bgmEngine.preloadedSet.setIndex;
      activeSetBuffers = bgmEngine.preloadedSet.buffers;
      bgmEngine.preloadedSet = null;
      onProgress(80);
    } else {
      const { setIndex } = await pickNextPlayableSetIndex();
      currentSetIndex = setIndex;
      onProgress(40);
      if (currentSetIndex === -1) {
        bgmEngine.state = 'NO_TRACKS';
        onProgress(100);
        return;
      }
      activeSetBuffers = await fetchAndDecodeSetBuffers(currentSetIndex, onProgress);
    }

    onProgress(90);
    const now = audioCtx.currentTime + 0.05;

    let chosenIntroKey = 'intro_normal';
    if (state.lastRoundAllIn) {
      const { wins, losses } = state.lastRoundAllIn;
      if (losses > 0) {
        chosenIntroKey = 'intro_loss';
      } else if (wins > 0 && losses === 0) {
        chosenIntroKey = 'intro_win';
      } else {
        chosenIntroKey = 'intro_normal';
      }
    }

    const introBuf = activeSetBuffers[chosenIntroKey] || activeSetBuffers['intro_normal'];
    const thinkBuf = activeSetBuffers['thinking'];
    const battleBuf = activeSetBuffers['battle'];

    if (introBuf) {
      const introSrc = audioCtx.createBufferSource();
      introSrc.buffer = introBuf;
      introSrc.connect(masterGainNode);
      introSrc.start(now);
      bgmEngine.activeNodes.push(introSrc);
    }

    if (thinkBuf || battleBuf) {
      bgmEngine.syncStartTime = now;
      const ratioMet = checkAllInRatio();
      bgmEngine.state = ratioMet ? 'BATTLE' : 'THINKING';
      if (bgmEngine.thinkingGain) bgmEngine.thinkingGain.gain.setValueAtTime(ratioMet ? 0 : 1, now);
      if (bgmEngine.battleGain) bgmEngine.battleGain.gain.setValueAtTime(ratioMet ? 1 : 0, now);

      scheduleDualLoopChunk(now, 0);
    }

    onProgress(100);

    setTimeout(() => {
      bgmPreloadNextSet();
    }, 1000);
  } catch(e) {
    onProgress(100);
  }
}

function bgmTransitionThinkingToBattle() {
  if (bgmEngine.state !== 'THINKING' || currentSetIndex === -1) return;
  try {
    getAudioContext();

    const now = audioCtx.currentTime;
    const secPerBeat = getSecPerBeat();
    const currentBeat = getTrackCurrentBeat();
    const beatInBar = currentBeat % 4;
    const beatsToNextBar = 4 - beatInBar;
    const effBeats = beatsToNextBar + (Number(menuCfg.battleTransitionLeadBeats) || 0);

    let triggerTime, transitionBeats, transKey;

    if (effBeats > 3.999) {
      triggerTime = now;
      transitionBeats = 4;
      transKey = 'trans_3';
    } else if (effBeats < 1.0) {
      triggerTime = now + (beatsToNextBar * secPerBeat);
      transitionBeats = 4;
      transKey = 'trans_3';
    } else if (effBeats < 2.0) {
      const timeToNextBeat = (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
      triggerTime = now + (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
      transitionBeats = 1;
      transKey = 'trans_0';
    } else if (effBeats < 3.0) {
      const timeToNextBeat = (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
      triggerTime = now + (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
      transitionBeats = 2;
      transKey = 'trans_1';
    } else {
      const timeToNextBeat = (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
      triggerTime = now + (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
      transitionBeats = 3;
      transKey = 'trans_2';
    }

    const transBuf = activeSetBuffers[transKey];
    const exactTransDuration = transitionBeats * secPerBeat;

    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    bgmEngine.thinkingGain.gain.cancelScheduledValues(now);
    bgmEngine.battleGain.gain.cancelScheduledValues(now);

    const curThink = bgmEngine.thinkingGain.gain.value;
    bgmEngine.thinkingGain.gain.setValueAtTime(curThink, now);
    if (triggerTime > now) {
      bgmEngine.thinkingGain.gain.setValueAtTime(1, triggerTime);
    }
    bgmEngine.thinkingGain.gain.linearRampToValueAtTime(0, triggerTime + 0.050);

    if (transBuf) {
      const transSrc = audioCtx.createBufferSource();
      transSrc.buffer = transBuf;
      transSrc.connect(masterGainNode);
      transSrc.start(triggerTime);
      bgmEngine.activeNodes.push(transSrc);
    }

    bgmEngine.state = 'TRANSITION';

    const battleResumeTime = triggerTime + exactTransDuration;
    const battleFadeInStart = Math.max(triggerTime, battleResumeTime - 0.050);

    const curBattle = bgmEngine.battleGain.gain.value;
    bgmEngine.battleGain.gain.setValueAtTime(curBattle, now);
    if (battleFadeInStart > now) {
      bgmEngine.battleGain.gain.setValueAtTime(0, battleFadeInStart);
    }
    bgmEngine.battleGain.gain.linearRampToValueAtTime(1, battleResumeTime);

    bgmEngine.transitionTimer = setTimeout(() => {
      bgmEngine.transitionTimer = null;
      if (bgmEngine.state === 'TRANSITION') {
        const stillAllIn = checkAllInRatio();
        if (stillAllIn) {
          bgmEngine.state = 'BATTLE';
        } else {
          bgmTransitionBattleToThinking();
        }
      }
    }, Math.max(0, (battleResumeTime - audioCtx.currentTime) * 1000));
  } catch(e) {}
}

function bgmTransitionBattleToThinking() {
  if (currentSetIndex === -1) return;
  try {
    getAudioContext();

    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    const now = audioCtx.currentTime;
    const secPerBeat = getSecPerBeat();
    const currentBeat = getTrackCurrentBeat();
    const timeToNextBeat = (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
    const triggerTime = now + (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
    const fadeDuration = getSecPerBar() * 0.5;

    bgmEngine.battleGain.gain.cancelScheduledValues(now);
    bgmEngine.thinkingGain.gain.cancelScheduledValues(now);

    const curBattle = bgmEngine.battleGain.gain.value;
    const curThink = bgmEngine.thinkingGain.gain.value;

    bgmEngine.battleGain.gain.setValueAtTime(curBattle, now);
    if (triggerTime > now) {
      bgmEngine.battleGain.gain.setValueAtTime(curBattle, triggerTime);
    }
    bgmEngine.battleGain.gain.linearRampToValueAtTime(0, triggerTime + fadeDuration);

    bgmEngine.thinkingGain.gain.setValueAtTime(curThink, now);
    if (triggerTime > now) {
      bgmEngine.thinkingGain.gain.setValueAtTime(curThink, triggerTime);
    }
    bgmEngine.thinkingGain.gain.linearRampToValueAtTime(1, triggerTime + fadeDuration);

    bgmEngine.state = 'THINKING';
  } catch(e) {}
}

function bgmTriggerVictory(callback) {
  if (bgmEngine.state === 'IDLE' || currentSetIndex === -1) {
    if (callback) callback();
    return;
  }
  try {
    getAudioContext();

    const victoryBuf = activeSetBuffers['victory'];
    const now = audioCtx.currentTime;
    const secPerBeat = getSecPerBeat();
    const currentBeat = getTrackCurrentBeat();
    const beatInBar = currentBeat % 4;
    const beatsToNextBar = 4 - beatInBar;
    const triggerTime = now + (beatsToNextBar * secPerBeat);

    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    clearAllLoopTimeouts();

    bgmEngine.battleGain.gain.cancelScheduledValues(now);
    bgmEngine.thinkingGain.gain.cancelScheduledValues(now);

    const currentBattleVol = bgmEngine.battleGain.gain.value;
    const currentThinkingVol = bgmEngine.thinkingGain.gain.value;

    bgmEngine.battleGain.gain.setValueAtTime(currentBattleVol, now);
    if (triggerTime > now) {
      bgmEngine.battleGain.gain.setValueAtTime(currentBattleVol, triggerTime);
    }
    bgmEngine.battleGain.gain.linearRampToValueAtTime(0, triggerTime + 0.050);

    bgmEngine.thinkingGain.gain.setValueAtTime(currentThinkingVol, now);
    if (triggerTime > now) {
      bgmEngine.thinkingGain.gain.setValueAtTime(currentThinkingVol, triggerTime);
    }
    bgmEngine.thinkingGain.gain.linearRampToValueAtTime(0, triggerTime + 0.050);

    bgmEngine.victoryFadeTimer = setTimeout(() => {
      bgmEngine.victoryFadeTimer = null;
      if (bgmEngine.battleSource) { try { bgmEngine.battleSource.stop(); } catch(e) {} bgmEngine.battleSource = null; }
      if (bgmEngine.thinkingSource) { try { bgmEngine.thinkingSource.stop(); } catch(e) {} bgmEngine.thinkingSource = null; }
      bgmEngine.activeNodes.forEach(item => {
        if (item !== bgmEngine.victoryNode) {
          try { item.stop(); } catch(e) {}
        }
      });
    }, Math.max(0, (triggerTime + 0.055 - now) * 1000));

    if (victoryBuf) {
      const victorySrc = audioCtx.createBufferSource();
      victorySrc.buffer = victoryBuf;
      victorySrc.loop = false;
      victorySrc.connect(masterGainNode);
      victorySrc.start(triggerTime);
      bgmEngine.victoryNode = victorySrc;
      bgmEngine.state = 'VICTORY';

      victorySrc.onended = () => {
        if (bgmEngine.state === 'VICTORY') {
          bgmStopAll();
          if (callback) callback();
        }
      };
    } else {
      bgmEngine.victoryTimer = setTimeout(() => {
        bgmEngine.victoryTimer = null;
        if (bgmEngine.state === 'VICTORY') {
          bgmStopAll();
          if (callback) callback();
        }
      }, Math.max(0, (triggerTime - now + 3.0) * 1000));
    }
  } catch(e) {
    if (callback) callback();
  }
}

function bgmStopAll() {
  try {
    clearAllLoopTimeouts();
    if (bgmEngine.victoryTimer) {
      clearTimeout(bgmEngine.victoryTimer);
      bgmEngine.victoryTimer = null;
    }
    if (bgmEngine.victoryFadeTimer) {
      clearTimeout(bgmEngine.victoryFadeTimer);
      bgmEngine.victoryFadeTimer = null;
    }
    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    if (bgmEngine.victoryNode) {
      bgmEngine.victoryNode.onended = null;
      try { bgmEngine.victoryNode.stop(); } catch(e) {}
      bgmEngine.victoryNode = null;
    }

    bgmEngine.activeNodes.forEach(item => {
      if (item) {
        item.onended = null;
        try { item.stop(); } catch(e) {}
      }
    });
    bgmEngine.activeNodes = [];

    if (audioCtx && bgmEngine.battleGain && bgmEngine.thinkingGain) {
      const now = audioCtx.currentTime;
      bgmEngine.battleGain.gain.cancelScheduledValues(now);
      bgmEngine.thinkingGain.gain.cancelScheduledValues(now);
      bgmEngine.battleGain.gain.setValueAtTime(0, now);
      bgmEngine.thinkingGain.gain.setValueAtTime(0, now);
    }
  } catch(e) {}

  bgmEngine.state = 'IDLE';
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  t.innerText = String(msg);
  if(typeof t.showPopover==='function'){try{t.showPopover()}catch(e){console.warn('Toast top-layer unavailable',e.name)}}
  t.classList.add('show');
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
    if(t.matches(':popover-open'))t.hidePopover();
    toastTimer = null;
  }, 3800);
}

function getPersistableGroups() {
  return state.groups.map(g => ({
    ...g,
    score: Number.isFinite(Number(g.score)) ? Math.trunc(Number(g.score)) : 0,
    displayScore: Number.isFinite(Number(g.score)) ? Math.trunc(Number(g.score)) : 0
  }));
}

function saveState() {
  if(window.classroomRecoveryRequired){showClassroomSaveWarning("需要先恢复主存档");return {ok:false,error:"需要先恢复主存档"}}
  if (!window.classroomReady || window.itemCommandActive || classroomCommands.isPending()) return {ok:true,deferred:true};
  ensureV2State();
  const payload=buildClassroomBackup();
  const result=Reliability.writeVerified(CLASSROOM_STORAGE,Reliability.stateKey,payload);
  if(!result.ok){
    showClassroomSaveWarning(result.error);
    return result;
  }
  window.classroomUnsavedChanges=false;
  const saveWarning=document.getElementById('classroomSaveWarning');
  if(saveWarning)saveWarning.hidden=true;
  // Legacy keys remain readable by V2.18.13. The single envelope is authoritative.
  const mirrors=[
    ['politics_groups_data',payload.groups],['politics_picker_state',state.picker],
    ['politics_item_global',state.itemGlobal],['politics_history_stack_v26',historyStack]
  ];
  const failed=mirrors.filter(([k,v])=>!STORAGE.setJSON(k,v)).map(([k])=>k);
  for(const [k,v] of Object.entries({politics_admin_pin:state.adminPin,politics_master_volume:state.masterVolume,
    politics_sfx_volume:state.sfxVolume,politics_resizer_height:state.resizerHeight,politics_column_mode:state.columnMode,
    politics_zoom_level:state.zoomLevel,politics_save_allin:state.saveAllIn,politics_resizer_enabled:state.resizerEnabled})){
    if(!STORAGE.set(k,v))failed.push(k);
  }
  if(failed.length)showToast('主存档已保存，旧版兼容副本写入失败。请导出 JSON 备份。');
  return {...result,legacyMirrorFailures:failed};
}

function applyZoom(level) {
  state.zoomLevel = Math.max(0.4, Math.min(2.0, level));
  document.body.style.zoom = state.zoomLevel;
  if(typeof DesktopUI!=='undefined')DesktopUI.syncViewport();
  STORAGE.set('politics_zoom_level', state.zoomLevel);
  showToast(`视图缩放比例: ${Math.round(state.zoomLevel * 100)}%`);
}

function zoomIn() {
  applyZoom(Math.round((state.zoomLevel + 0.1) * 10) / 10);
}

function zoomOut() {
  applyZoom(Math.round((state.zoomLevel - 0.1) * 10) / 10);
}

function zoomReset() {
  applyZoom(1.0);
}

function toggleResizerEnabled(enabled) {
  state.resizerEnabled = enabled;
  saveState();
  updateResizerUI();
}

function toggleSaveAllIn(enabled) {
  state.saveAllIn = enabled;
  saveState();
}

function updateColumnMode(mode) {
  state.columnMode = mode;
  saveState();
  renderGrid();
}

function updateResizerUI() {
  const dock = document.getElementById('heightResizerDock');
  if (!dock) return;
  dock.style.display = state.resizerEnabled ? 'flex' : 'none';
  dock.style.height = `${state.resizerHeight}px`;
}

function initResizerDrag() {
  const handle = document.getElementById('resizerHandle');
  const dock = document.getElementById('heightResizerDock');
  if (!handle || !dock) return;

  let startY = 0;
  let startH = 0;

  handle.onpointerdown = (e) => {
    startY = e.clientY;
    startH = dock.offsetHeight;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  handle.onpointermove = (e) => {
    if (!handle.hasPointerCapture(e.pointerId)) return;
    const deltaY = e.clientY - startY;
    const newH = Math.max(28, Math.min(600, startH + deltaY));
    dock.style.height = `${newH}px`;
    state.resizerHeight = newH;
  };

  handle.onpointerup = (e) => {
    if (handle.hasPointerCapture(e.pointerId)) {
      handle.releasePointerCapture(e.pointerId);
      saveState();
      showToast(`垫片高度已锁定: ${state.resizerHeight}px`);
    }
  };
}

function toggleLock() {
  if (state.isLocked) openPwdModal();
  else {
    state.isLocked = true;
    showToast('上帝模式已下班，现实重新进入只读状态');
    renderAll();
  }
}

function openPwdModal() {
  document.getElementById('pwdInput').value = '';
  showClassroomWindow(document.getElementById('pwdModal'));
  setTimeout(() => document.getElementById('pwdInput').focus(), 80);
}

function closePwdModal() {
  hideClassroomWindow(document.getElementById('pwdModal'));
}

function handlePwdKey(event) {
  if (event.key === 'Enter') { event.preventDefault(); submitPassword(); }
  else if (event.key === 'Escape') closePwdModal();
}

function submitPassword() {
  const val = document.getElementById('pwdInput').value.trim();
  if (val === state.adminPin) {
    state.isLocked = false;
    closePwdModal();
    showToast('认证通过，上帝模式已上线，请谨慎修改现实');
    renderAll();
  } else {
    themeAlert('密码错误，请重新输入');
    const input = document.getElementById('pwdInput');
    input.value = '';
    input.focus();
  }
}

function updateAdminPin() {
  const newPin = document.getElementById('newPwdInput').value.trim();
  if (newPin.length < 3) {
    themeAlert('新密码长度不能少于 3 位');
    return;
  }
  state.adminPin = newPin;
  saveState();
  document.getElementById('newPwdInput').value = '';
  showToast('管理密码修改成功');
}

function handleMainAction() {
  if (!state.roundActive && !state.evaluated) {
    startRound();
  } else if (state.roundActive && !state.evaluated) {
    judgeRound();
  }
}

async function preloadInitialAudio() {
  try {
    await getAudioContext();
    if (!bgmEngine.preloadedSet) {
      await bgmPreloadNextSet();
    }
  } catch(e) {}
}

async function startRound() {
  Reliability.invalidateDefenseDecisions();
  if (isStartingRound || isSwitchingRound) return;
  isStartingRound = true;
  const overlay = document.getElementById('initProgressOverlay');
  const fill = document.getElementById('initProgressFill');
  const txt = document.getElementById('initProgressText');

  // 零资源容错：无任何可播放的战斗音频时，0.05s 内跳过加载动画，静音启动全部教学功能
  try {
    await getAudioContext();
    const playable = await Promise.race([
      hasAnyPlayableBgm(),
      new Promise(res => setTimeout(() => res(false), 2500))
    ]);
    if (!playable) {
      if (overlay) overlay.style.display = 'none';
      finishStartRound();
      showToast('未检测到战斗音频：已静音启动（0.05s 跳过加载）');
      isStartingRound = false;
      return;
    }
  } catch(e) {
    if (overlay) overlay.style.display = 'none';
    finishStartRound();
    showToast('音频初始化异常：已强制启动');
    isStartingRound = false;
    return;
  }

  if (overlay && fill) {
    overlay.style.display = 'flex';
    fill.style.width = '0%';
    if (txt) txt.innerText = '正在初始化...';
  }

  bgmStartNewRoundMusicWithProgress((percent) => {
    if (fill) fill.style.width = `${percent}%`;
  }).then(() => {
    if (overlay) overlay.style.display = 'none';
    finishStartRound();
    playSound('score_add');
    showToast('初始化完毕');
    isStartingRound = false;
  }).catch(() => {
    if (overlay) overlay.style.display = 'none';
    showToast('初始化异常，已强制启动');
    finishStartRound();
    isStartingRound = false;
  });
}

function finishStartRound() {
  Reliability.invalidateDefenseDecisions();
  const flipSnapshotV21725 = captureCardRectsV21725();

  state.hasStartedOnce = true;
  state.roundActive = true;
  state.evaluated = false;
  state.correctAns = '';
  state.groups.forEach(g => {
    g.selectedOpt = '';
    g.allIn = false;
    g.resultText = '';
    g.animState = '';
  });

  /* 状态切换由专用 FLIP 接管，避免旧包装层把第一次 renderGrid 吃掉。 */
  v213SuppressReorderAnimation = true;
  renderAll();
  v213SuppressReorderAnimation = false;
  animateCardsFromSnapshotV21725(flipSnapshotV21725);
  saveState();
}

async function hasAnyPlayableBgm() {
  try {
    if (!dbInitPromise) initDB();
    await dbInitPromise;
  } catch(e) {}
  if (!db) return false;
  try {
    await refreshSoundIdCache();
    const complete = await getAllCompleteSetIndices();
    if (complete.length > 0) return true;
    const fb = await getFallbackSetIndex();
    return fb !== -1;
  } catch(e) { return false; }
}

async function nextRound() {
  if (isSwitchingRound) return;
  if (!state.evaluated) {
    themeAlert('请先公布正解并点击「判定结算」后，才可进入下一题 (或点击强制结束)');
    return;
  }
  Reliability.invalidateDefenseDecisions();
  isSwitchingRound = true;

  const overlay = document.getElementById('initProgressOverlay');
  const fill = document.getElementById('initProgressFill');
  const txt = document.getElementById('initProgressText');

  if (overlay && fill) {
    overlay.style.display = 'flex';
    fill.style.width = '0%';
    if (txt) txt.innerText = '正在初始化下一题...';
  }

  try {
    bgmStopAll();
    await bgmStartNewRoundMusicWithProgress((percent) => {
      if (fill) fill.style.width = `${percent}%`;
    });

    if (overlay) overlay.style.display = 'none';
    playSound('ui_click');

    const flipSnapshotV21725 = captureCardRectsV21725();

    resetRoundItemUseLocksV2177();
    state.correctAns = '';
    state.evaluated = false;
    state.roundActive = true;
    state.groups.forEach(g => {
      g.selectedOpt = '';
      if (!state.saveAllIn) {
        g.allIn = false;
      }
      g.resultText = '';
      g.animState = '';
    });
    // 根据本题初始化后的 All In 状态重新决定思考轨 / 战斗轨。
    const nextRoundAllIn = checkAllInRatio();
    if (nextRoundAllIn) {
      if (bgmEngine.state === 'THINKING') bgmTransitionThinkingToBattle();
    } else if (bgmEngine.state === 'BATTLE' || bgmEngine.state === 'TRANSITION') {
      bgmTransitionBattleToThinking();
    }

    saveState();
    v213SuppressReorderAnimation = true;
    renderAll();
    v213SuppressReorderAnimation = false;
    animateCardsFromSnapshotV21725(flipSnapshotV21725);
    showToast('初始化完毕');
  } finally {
    isSwitchingRound = false;
    if (overlay) overlay.style.display = 'none';
  }
}

async function forceEndRound() {
  if (!state.roundActive || state.evaluated) return;
  if (await themeConfirm('确认强制结束当前题目吗？（当前作答将作废，不进行加分结算）', {title:'强制结束题目', danger:true, confirmText:'强制结束'})) {
    Reliability.invalidateDefenseDecisions();
    const flipSnapshotV21725 = captureCardRectsV21725();

    bgmStopAll();
    recordHistory('教师强制结束本题');
    state.roundActive = true;
    state.evaluated = true;
    saveState();

    v213SuppressReorderAnimation = true;
    renderAll();
    v213SuppressReorderAnimation = false;
    animateCardsFromSnapshotV21725(flipSnapshotV21725);

    showToast('当前题目已强制结束');
  }
}

function applySettingsBatchMembers() {
  if (state.isLocked) { openPwdModal(); return; }
  const text = document.getElementById('settingsBatchMemberText').value.trim();
  if (!text) { themeAlert('请输入要导入的成员文本'); return; }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  let newGroups = [];
  lines.forEach((line, index) => {
    if (line.includes(':') || line.includes('：')) {
      const delimiter = line.includes(':') ? ':' : '：';
      const parts = line.split(delimiter);
      const grpName = parts[0].trim();
      const membersStr = parts.slice(1).join(delimiter).trim();
      const members = membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter(Boolean);

      const existing = state.groups.find(g => g.name.trim() === grpName);
      newGroups.push({
        id: existing ? existing.id : Date.now() + index,
        name: grpName || `第 ${index + 1} 组`,
        color: existing ? existing.color : DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        score: existing ? existing.score : 0,
        displayScore: existing ? existing.score : 0,
        selectedOpt: existing ? existing.selectedOpt : '',
        allIn: existing ? existing.allIn : false,
        resultText: existing ? existing.resultText : '',
        animState: '',
        members: Array.from(new Set(members))
      });
    }
  });

  if (newGroups.length > 0) {
    state.groups = newGroups;
    saveState();
    renderAll();
    updatePickerPoolUI();
    showToast(`成功导入 ${newGroups.length} 个小组`);
    closeSoundModal();
  } else {
    themeAlert('解析失败，请检查格式是否正确');
  }
}

function batchSelectOption(opt) {
  if (!state.roundActive || state.evaluated) {
    showToast('请先开始答题');
    return;
  }
  playSound('ui_click');
  state.groups.forEach(g => {
    g.selectedOpt = opt;
  });
  saveState();
  renderGrid();
  renderDashboard();
  showToast(`已选 ${opt}`);
}

function batchToggleAllIn() {
  if (!state.roundActive || state.evaluated) {
    showToast('请先开始答题');
    return;
  }
  playSound('ui_click');
  const allCurrentlyAllIn = state.groups.every(g => g.allIn);
  const targetState = !allCurrentlyAllIn;

  state.groups.forEach(g => {
    g.allIn = targetState;
  });
  saveState();
  renderGrid();
  renderDashboard();

  const ratioMet = checkAllInRatio();
  if (ratioMet) {
    if (bgmEngine.state === 'THINKING') {
      bgmTransitionThinkingToBattle();
    }
  } else {
    if (bgmEngine.state === 'BATTLE' || bgmEngine.state === 'TRANSITION') {
      bgmTransitionBattleToThinking();
    }
  }

  showToast(targetState ? '已全All' : '已取消');
}

function openScoreModal(groupId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  state.activeModalGroupId = groupId;
  const g = state.groups.find(x => x.id === groupId);
  if (g) {
    document.getElementById('scoreModalTitle').innerText = `${g.name} - 调整积分`;
  }
  const inputEl = document.getElementById('modalCustomInput');
  inputEl.value = '';
  inputEl.classList.remove('invalid');
  const errEl = document.getElementById('scoreModalError');
  if (errEl) errEl.innerText = '';
  showClassroomWindow(document.getElementById('scoreModalBackdrop'));
  setTimeout(() => document.getElementById('modalCustomInput').focus(), 50);
}

function closeScoreModal() {
  hideClassroomWindow(document.getElementById('scoreModalBackdrop'));
  state.activeModalGroupId = null;
}

function submitModalScore(delta) {
  const groupId = state.activeModalGroupId;
  closeScoreModal();
  if (groupId === null) return;
  applyScoreDelta(groupId, delta);
}

function handleModalKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitModalCustomScore();
  } else if (event.key === 'Escape') {
    closeScoreModal();
  }
}

function submitModalCustomScore() {
  const groupId = state.activeModalGroupId;
  const input = document.getElementById('modalCustomInput');
  const errEl = document.getElementById('scoreModalError');
  if (!input || groupId === null) return;
  // 兼容全角负号与全角数字；只接受带符号整数，拒绝小数、科学计数法与单独的负号
  const raw = input.value.trim()
    .replace(/[－—–−]/g, '-')
    .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  const fail = (msg) => {
    input.classList.add('invalid');
    if (errEl) errEl.innerText = msg;
    input.focus();
    input.select();
  };
  if (!/^[+-]?\d+$/.test(raw)) { fail('请输入整数，例如 5 或 -10'); return; }
  const val = parseInt(raw, 10);
  if (!Number.isSafeInteger(val)) { fail('数值过大'); return; }
  if (val === 0) { fail('分值为 0，无需调整'); return; }
  closeScoreModal();
  applyScoreDelta(groupId, val);
}

function showMilestoneBanner(groupId) {
  const card = document.querySelector(`.group-row-card[data-group-id="${groupId}"]`);
  if (!card) return;
  const banner = card.querySelector('.milestone-banner-overlay');
  if (!banner) return;

  card.classList.add('milestone-glow');
  banner.classList.add('show');

  setTimeout(() => {
    banner.classList.remove('show');
    card.classList.remove('milestone-glow');
  }, 2200);
}

let activeScoreAnimId = null;
function cancelScoreAnimationAndSync() {
  if(window.classroomReady)cancelItemScoreAnimations();
  if (activeScoreAnimId) {
    cancelAnimationFrame(activeScoreAnimId);
    activeScoreAnimId = null;
  }
  state.groups.forEach(g => { g.displayScore = g.score; });
}

function animateScores(scoreUpdates, onComplete) {
  if (activeScoreAnimId) {
    cancelAnimationFrame(activeScoreAnimId);
    activeScoreAnimId = null;
  }
  const startTime = performance.now();
  const duration = 950;

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    scoreUpdates.forEach(item => {
      const cur = Math.round(item.start + (item.target - item.start) * ease);
      const g = state.groups.find(x => x.id === item.groupId);
      if (g) {
        g.displayScore = cur;
        const el = document.getElementById(`score-val-${g.id}`);
        if (el) el.textContent = `${cur}分`;
      }
    });

    renderChart();
    renderDashboard();

    if (progress < 1) {
      activeScoreAnimId = requestAnimationFrame(tick);
    } else {
      activeScoreAnimId = null;
      scoreUpdates.forEach(item => {
        const g = state.groups.find(x => x.id === item.groupId);
        if (g) g.displayScore = item.target;
      });
      renderChart();
      renderDashboard();
      updateHeaderStats();
      if (onComplete) onComplete();
    }
  }
  activeScoreAnimId = requestAnimationFrame(tick);
}

function applyScoreDelta(groupId, delta) {
  Reliability.invalidateDefenseDecisions();
  cancelScoreAnimationAndSync();
  if (state.isLocked) { openPwdModal(); return; }
  const g = state.groups.find(x => x.id === groupId);
  if (!g) return;

  const oldScore = g.score;
  const targetScore = oldScore + delta;
  if(!Number.isSafeInteger(delta)||!Number.isSafeInteger(targetScore)){showToast('积分必须保持在安全整数范围内');return false}
  const actualDelta = targetScore - oldScore;
  const clipped = actualDelta !== delta;
  if (actualDelta === 0) { showToast(`${g.name} 已是 0 分，无法继续扣分`); return; }
  // 历史记录写入实际变动值（发生截断时注明），撤销与回滚按快照恢复，不会多出分数
  recordHistory(`${g.name} 积分调整 (${actualDelta > 0 ? '+' : ''}${actualDelta}${clipped ? `，原输入 ${delta}，已截断至 0 分` : ''})`);
  g.score = targetScore;

  const oldDigits = Math.floor(Math.abs(oldScore)).toString().length;
  const newDigits = Math.floor(Math.abs(targetScore)).toString().length;
  const isMilestone = (newDigits > oldDigits && targetScore > oldScore);

  if (isMilestone) {
    playSound('big_win');
    showMilestoneBanner(groupId);
  } else {
    if (delta >= 4) playSound('big_win');
    else if (delta > 0) playSound('score_add');
    else playSound('score_sub');
  }

  saveState();
  animateScores([{ groupId, start: oldScore, target: targetScore }]);
  ClassroomFeedback.score(g.name,actualDelta);
  showToast(clipped
    ? `${g.name} 扣 ${-actualDelta} 分（输入 ${delta}，已截断至 0 分）`
    : `${g.name} 积分更新：${delta > 0 ? '+' : ''}${delta}`);
}

function startDirectScoreEdit(groupId) {
  if (state.isLocked) { openPwdModal(); return; }
  state.editingScoreId = groupId;
  renderGrid();
}

function handleScoreInputKey(event, groupId) {
  if (event.key === 'Enter') finishDirectScoreEdit(groupId);
  else if (event.key === 'Escape') {
    state.editingScoreId = null;
    renderGrid();
  }
}

function finishDirectScoreEdit(groupId) {
  cancelScoreAnimationAndSync();
  if (state.editingScoreId !== groupId) return;
  const input = document.getElementById(`input-score-${groupId}`);
  const g = state.groups.find(x => x.id === groupId);
  if (input && g) {
    const newVal = Number(input.value);
    if(!Number.isSafeInteger(newVal)){showToast('请输入安全整数');return false}
    const oldVal = g.score;
    recordHistory(`${g.name} 手动设定分数为 ${newVal}`);
    g.score = newVal;
    state.editingScoreId = null;
    playSound('score_add');
    saveState();
    renderGrid();
    animateScores([{ groupId, start: oldVal, target: newVal }]);
  } else {
    state.editingScoreId = null;
    renderGrid();
  }
}

function selectGroupOpt(groupId, opt) {
  if (!state.roundActive || state.evaluated) return;
  const g = state.groups.find(x => x.id === groupId);
  if (!g) return;
  playSound('ui_click');
  g.selectedOpt = g.selectedOpt === opt ? '' : opt;
  saveState();
  renderGrid();
  renderDashboard();
}

function toggleAllInCard(groupId) {
  if (!state.roundActive || state.evaluated) return;
  const g = state.groups.find(x => x.id === groupId);
  if (!g) return;
  playSound('ui_click');
  g.allIn = !g.allIn;
  saveState();
  renderGrid();
  renderDashboard();

  const ratioMet = checkAllInRatio();
  if (ratioMet) {
    if (bgmEngine.state === 'THINKING') {
      bgmTransitionThinkingToBattle();
    }
  } else {
    if (bgmEngine.state === 'BATTLE' || bgmEngine.state === 'TRANSITION') {
      bgmTransitionBattleToThinking();
    }
  }
}

async function setCorrectAns(opt) {
  if (state.evaluated) return;

  if (state.correctAns === opt) {
    playSound('ui_click');
    state.correctAns = '';
    renderControls();
    return;
  }

  const allAnswered = state.groups.every(g => g.selectedOpt !== '');
  if (!allAnswered) {
    const confirmEarly = await themeConfirm('当前仍有小组尚未完成作答！\n是否确认提前选定正确答案？', {title:'提前公布正解', confirmText:'继续选定'});
    if (!confirmEarly) {
      return;
    }
  }

  playSound('ui_click');
  state.correctAns = opt;
  saveState();
  renderControls();
}

function legacyJudgeRound() {
  if (!state.roundActive || state.evaluated) return;
  if (!state.correctAns) {
    themeAlert('请先设定正确选项 (A/B/C/D)');
    return;
  }

  const flipSnapshotV21725 = captureCardRectsV21725();

  recordHistory(`自动判定结算 (正解: ${state.correctAns})`);

  let allInWins = 0;
  let allInLosses = 0;
  let hasNormalWin = false;
  let hasMilestone = false;
  const milestoneGroups = [];
  const scoreUpdates = [];

  state.groups.forEach(g => {
    g.animState = '';
    if (!g.selectedOpt) {
      g.resultText = '未作答';
      return;
    }
    const isCorrect = g.selectedOpt === state.correctAns;
    const oldScore = g.score;

    if (g.allIn) {
      if (isCorrect) {
        g.score = g.score * 2;
        g.resultText = '答对(×2)';
        allInWins++;
      } else {
        g.score = 0;
        g.resultText = '清零';
        allInLosses++;
      }
    } else {
      if (isCorrect) {
        g.score += 2;
        g.resultText = '正确(+2)';
        hasNormalWin = true;
      } else {
        g.resultText = '错误(+0)';
      }
    }

    if (oldScore !== g.score) {
      scoreUpdates.push({ groupId: g.id, start: oldScore, target: g.score });
      const oldDigits = Math.floor(Math.abs(oldScore)).toString().length;
      const newDigits = Math.floor(Math.abs(g.score)).toString().length;
      if (newDigits > oldDigits && g.score > oldScore) {
        hasMilestone = true;
        milestoneGroups.push(g.id);
      }
    }
  });

  state.lastRoundAllIn = { wins: allInWins, losses: allInLosses };
  state.evaluated = true;
  saveState();

  renderControls();

  /* 判定完成时：编号顺序 -> 排名顺序，完整播放 0.75s。 */
  v213SuppressReorderAnimation = true;
  renderGrid();
  v213SuppressReorderAnimation = false;
  animateCardsFromSnapshotV21725(flipSnapshotV21725);

  state.groups.forEach(g => {
    if (g.selectedOpt && g.allIn) {
      const card = document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
      if (card) {
        const isCorrect = g.selectedOpt === state.correctAns;
        const animCls = isCorrect ? 'anim-win' : 'anim-loss';
        card.classList.add(animCls);
        setTimeout(() => card.classList.remove(animCls), 1100);
      }
    }
  });

  if (scoreUpdates.length > 0) {
    animateScores(scoreUpdates);
  }

  if (hasMilestone) {
    playSound('big_win');
    milestoneGroups.forEach(id => showMilestoneBanner(id));
  }

  bgmTriggerVictory(() => {
    if (allInWins > 0) playSound('allin_win');
    else if (allInLosses > 0) playSound('allin_lose');
    else if (hasNormalWin) playSound('pk_correct');
  });
}

function openMemberSearchModal() {
  const backdrop = document.getElementById('memberSearchBackdrop');
  const input = document.getElementById('memberSearchInput');
  if (!backdrop || !input) return;
  backdrop.classList.add('active');
  input.value = '';
  document.getElementById('memberSearchResults').innerHTML =
    '<div class="member-search-empty">输点姓名或学号吧，读心术模块还没获批。</div>';
  setTimeout(() => input.focus(), 50);
}

function closeMemberSearchModal() {
  const backdrop = document.getElementById('memberSearchBackdrop');
  if (backdrop) hideClassroomWindow(backdrop);
}

function handleMemberSearchKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchMemberGroups();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeMemberSearchModal();
  }
}

function searchMemberGroups() {
  const input = document.getElementById('memberSearchInput');
  const results = document.getElementById('memberSearchResults');
  if (!input || !results) return;

  const keyword = input.value.trim().toLowerCase();
  if (!keyword) {
    results.innerHTML = '<div class="member-search-empty">输点姓名或学号吧，读心术模块还没获批。</div>';
    return;
  }

  const matches = [];
  state.groups.forEach(g => {
    const members = Array.isArray(g.members) ? g.members : [];
    members.forEach(member => {
      const name = String(member).trim();
      if (name && name.toLowerCase().includes(keyword)) {
        matches.push({ name, group: g });
      }
    });
  });

  if (!matches.length) {
    results.innerHTML =
      `<div class="member-search-empty">没有找到“${escapeHtml(input.value.trim())}”</div>`;
    return;
  }

  results.innerHTML = matches.map(item => {
    const g = item.group;
    const memberList = (Array.isArray(g.members) ? g.members : [])
      .map(escapeHtml).join('、');
    return `
      <div class="member-search-result">
        <div class="member-search-result-name">${escapeHtml(item.name)}</div>
        <div class="member-search-result-group">${escapeHtml(g.name)}</div>
        <div class="member-search-result-members">成员：${memberList || '暂无成员'}</div>
      </div>`;
  }).join('');
}



function updateQuickBatchBar() {
  const bar = document.getElementById('quickBatchBar');
  if (!bar) return;
  if (state.roundActive && !state.evaluated) {
    bar.classList.add('active');
  } else {
    bar.classList.remove('active');
  }
}

function updateHeaderStats() {
  const banner = document.getElementById('topHeaderStats');
  if (!banner) return;
  const summary = GodpowerUIModel.standings(ranking());
  const mask = Number(state.itemGlobal?.blooperUntil || 0) > Date.now();
  const html = `小组总数: <b>${summary.count}</b> 组 | 总积分: <b>${mask?'???':summary.total}</b> | 当前领先: <b style="color:#0284c7;">${mask?'已遮蔽':summary.count?escapeHtml(summary.leader):'暂无'}</b>`;
  if(banner.innerHTML!==html)banner.innerHTML=html;
  banner.title=banner.textContent;

}

/* 核心改进：条形图保持 DOM 元素稳定，支持宽度平滑递增与排位平滑滑动互换 */
function renderChart() {
  const wrapper = document.getElementById('chartWrapper');
  if (!wrapper) return;

  const sorted = [...state.groups].sort((a, b) => {
    const scA = a.displayScore !== undefined ? a.displayScore : a.score;
    const scB = b.displayScore !== undefined ? b.displayScore : b.score;
    return scB - scA;
  });

  const rowHeight = 30;
  wrapper.style.height = (sorted.length * rowHeight) + 'px';

  const maxScore = Math.max(...sorted.map(g => (g.displayScore !== undefined ? g.displayScore : g.score)), 10);

  const existingRows = Array.from(wrapper.querySelectorAll('.chart-row'));
  const currentIds = new Set(sorted.map(g => g.id.toString()));

  existingRows.forEach(r => {
    if (!currentIds.has(r.getAttribute('data-id'))) {
      r.remove();
    }
  });

  sorted.forEach((g, rankIndex) => {
    let row = wrapper.querySelector(`.chart-row[data-id="${g.id}"]`);
    if (!row) {
      row = document.createElement('div');
      row.className = 'chart-row';
      row.setAttribute('data-id', g.id);
      row.innerHTML = `
        <div class="chart-rank">${rankIndex + 1}</div>
        <div class="chart-name">${escapeHtml(g.name)}</div>
        <div class="chart-track">
          <div class="chart-bar" style="background-color: ${g.color};"></div>
        </div>
        <div class="chart-score">0分</div>
      `;
      wrapper.appendChild(row);
    }

    row.style.transform = `translateY(${rankIndex * rowHeight}px)`;

    const rankEl = row.querySelector('.chart-rank');
    if (rankEl) rankEl.textContent = rankIndex + 1;

    const nameEl = row.querySelector('.chart-name');
    if (nameEl) {
      nameEl.textContent = g.name;
      nameEl.title = g.name;
    }

    const curScore = g.displayScore !== undefined ? g.displayScore : g.score;
    const scoreEl = row.querySelector('.chart-score');
    if (scoreEl) {
      scoreEl.textContent = `${formatChartScoreV294(curScore)}分`;
      scoreEl.title = `${curScore}分`;
    }

    const barEl = row.querySelector('.chart-bar');
    if (barEl) {
      const percent = Math.max(2, (curScore / maxScore) * 100);
      barEl.style.width = `${percent}%`;
      barEl.style.backgroundColor = g.color;
    }
  });
}

function renderDashboard() {
  const podiumDeck = document.getElementById('podiumDeck');
  if (!podiumDeck) return;

  const sorted = [...state.groups].sort((a, b) => {
    const scA = a.displayScore !== undefined ? a.displayScore : a.score;
    const scB = b.displayScore !== undefined ? b.displayScore : b.score;
    return scB - scA;
  });
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const getScoreText = (g) => g ? (g.displayScore !== undefined ? g.displayScore : g.score) : 0;

  podiumDeck.innerHTML = `
    <div class="podium-col rank-2">
      <span class="podium-badge" style="color: #64748b;">第 2 名</span>
      <span class="podium-name">${top2 ? escapeHtml(top2.name) : '-'}</span>
      <span class="podium-score" style="color: ${top2 ? top2.color : '#94a3b8'};">${getScoreText(top2)}分</span>
    </div>
    <div class="podium-col rank-1">
      <span class="podium-badge" style="color: #ca8a04;">第 1 名</span>
      <span class="podium-name">${top1 ? escapeHtml(top1.name) : '-'}</span>
      <span class="podium-score" style="color: ${top1 ? top1.color : '#ca8a04'};">${getScoreText(top1)}分</span>
    </div>
    <div class="podium-col rank-3">
      <span class="podium-badge" style="color: #ea580c;">第 3 名</span>
      <span class="podium-name">${top3 ? escapeHtml(top3.name) : '-'}</span>
      <span class="podium-score" style="color: ${top3 ? top3.color : '#94a3b8'};">${getScoreText(top3)}分</span>
    </div>
  `;

  const totalGroups = state.groups.length;
  const answeredGroups = state.groups.filter(g => g.selectedOpt).length;
  const allInGroups = state.groups.filter(g => g.allIn).length;
  const totalScore = state.groups.reduce((acc, g) => acc + (g.displayScore !== undefined ? g.displayScore : g.score), 0);
  const avgScore = totalGroups > 0 ? (totalScore / totalGroups).toFixed(1) : 0;

  document.getElementById('metricAnswered').innerText = `${answeredGroups} / ${totalGroups} 组`;
  document.getElementById('metricAllIn').innerText = `${allInGroups} 组`;
  document.getElementById('metricAvg').innerText = `${avgScore} 分`;
}

function renderLockStatus() {
  const btn = document.getElementById('lockBtn');
  const addBtn = document.getElementById('btnAddGroup');
  const importBtn = document.getElementById('btnImport');
  const resetBtn = document.getElementById('btnResetScores');
  const undoBtn = document.getElementById('btnUndo');
  if (!btn) return;

  if (state.isLocked) {
    btn.className = 'icon-btn locked';
    btn.innerText = '🔒';
    if(addBtn) addBtn.classList.add('locked-disabled');
    if(importBtn) importBtn.classList.add('locked-disabled');
    if(resetBtn) resetBtn.classList.add('locked-disabled');
    if(undoBtn) undoBtn.classList.add('locked-disabled');
  } else {
    btn.className = 'icon-btn unlocked';
    btn.innerText = '🔓';
    if(addBtn) addBtn.classList.remove('locked-disabled');
    if(importBtn) importBtn.classList.remove('locked-disabled');
    if(resetBtn) resetBtn.classList.remove('locked-disabled');
    if(undoBtn) undoBtn.classList.remove('locked-disabled');
  }
  if(typeof DesktopUI!=='undefined')DesktopUI.refreshLockControl(btn);
}

function renderControls() {
  const statusBadge = document.getElementById('roundStatusBadge');
  const mainActionBtn = document.getElementById('btnMainAction');
  const nextBtn = document.getElementById('btnNextRound');
  const forceBtn = document.getElementById('btnForceEnd');

  if (!state.roundActive && !state.evaluated) {
    statusBadge.innerText = '答题未开始';
    statusBadge.className = 'status-badge';

    mainActionBtn.innerText = '开始答题';
    mainActionBtn.className = 'btn btn-primary';
    mainActionBtn.classList.remove('locked-disabled');

    nextBtn.classList.add('locked-disabled');
    forceBtn.classList.add('locked-disabled');
  } else if (state.roundActive && !state.evaluated) {
    statusBadge.innerText = '答题进行中...';
    statusBadge.className = 'status-badge active';

    mainActionBtn.innerText = '判定结算';
    mainActionBtn.className = 'btn btn-primary';
    mainActionBtn.classList.remove('locked-disabled');

    nextBtn.classList.add('locked-disabled');
    forceBtn.classList.remove('locked-disabled');
  } else {
    statusBadge.innerText = '答题已结束';
    statusBadge.className = 'status-badge done';

    mainActionBtn.innerText = '判定结算';
    mainActionBtn.className = 'btn btn-primary';
    mainActionBtn.classList.add('locked-disabled');

    nextBtn.classList.remove('locked-disabled');
    forceBtn.classList.add('locked-disabled');
  }

  const btns = document.querySelectorAll('.ans-btn');
  btns.forEach(btn => {
    if (btn.innerText === state.correctAns) btn.classList.add('selected');
    else btn.classList.remove('selected');
  });
  updateQuickBatchBar();
}



function openPickerModal({internal=false}={}) {
  if(!internal && window.godpowerDesktop?.role==='main') {window.godpowerDesktop.openPicker();return;}
  if(document.getElementById('pickerModal').classList.contains('active') && !document.getElementById('pickerModal').dataset.uiClosing)return;
  if(typeof DesktopUI!=='undefined')DesktopUI.cancelPickerPreparation();
  showClassroomWindow(document.getElementById('pickerModal'));
  updatePickerView();
  updatePickerPoolUI();
  resetSlotDisplay();
}

function closePickerModal() {
  if (slotEngine.isSpinning) stopSlotSpin();
  if(typeof DesktopUI!=='undefined')DesktopUI.cancelPickerPreparation();
  window.GodpowerPicker?.notify('idle');
  hideClassroomWindow(document.getElementById('pickerModal'));
  document.getElementById('slotResultPanel').classList.remove('show');
}

function setPickerMode(mode) {
  if (slotEngine.isSpinning || window.GodpowerPicker?.isSettling()) return;
  if(typeof DesktopUI!=='undefined')DesktopUI.cancelPickerPreparation();
  state.picker.mode = mode;
  ['btnModeInd', 'btnModeGrp', 'btnModeTwo'].forEach(id => document.getElementById(id).classList.remove('active'));
  if (mode === 'individual') document.getElementById('btnModeInd').classList.add('active');
  if (mode === 'group') document.getElementById('btnModeGrp').classList.add('active');
  if (mode === 'two_tier') document.getElementById('btnModeTwo').classList.add('active');
  updatePickerView();
  updatePickerPoolUI();
  resetSlotDisplay();
}

function updatePickerView() {
  const reelGrp = document.getElementById('reelFrameGroup');
  const reelStu = document.getElementById('reelFrameStudent');
  const selBox = document.getElementById('twoTierGroupSelect');
  if (state.picker.mode === 'group') {
    reelGrp.style.display = 'block'; reelStu.style.display = 'none';
  } else if (state.picker.mode === 'two_tier') {
    reelGrp.style.display = 'block'; reelStu.style.display = 'block';
  } else {
    reelGrp.style.display = 'none'; reelStu.style.display = 'block';
  }
  if (selBox) {
    if (state.picker.mode === 'two_tier') { selBox.style.display = 'block'; renderTwoTierChips(); }
    else selBox.style.display = 'none';
  }
}

function renderTwoTierChips() {
  const wrap = document.getElementById('twoTierGroupChips');
  if (!wrap) return;
  const pre = Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : [];
  const groups = state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0);
  wrap.innerHTML = groups.map(g => {
    const on = pre.includes(g.id);
    const style = on ? ('border-color:' + g.color + '; color:#fff; background:' + g.color + ';') : '';
    return '<button type="button" class="two-tier-chip ' + (on ? 'active' : '') + '" style="' + style + '" onclick="toggleGroupPreselect(' + g.id + ')">' + escapeHtml(g.name) + '<span style="opacity:.75; font-size:11px; margin-left:4px;">' + g.members.length + '人</span></button>';
  }).join('') || '<div style="color:#94a3b8; font-size:12px;">暂无含成员的小组，请先在小组卡片中导入名单</div>';
}

function toggleGroupPreselect(gid) {
  if (slotEngine.isSpinning) return;
  let pre = Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds.slice() : [];
  const idx = pre.indexOf(gid);
  if (idx >= 0) pre.splice(idx, 1);
  else pre.push(gid);
  state.picker.preselectedGroupIds = pre;
  saveState();
  renderTwoTierChips();
  updatePickerPoolUI();
  resetSlotDisplay();
}

function resetSlotDisplay() {
  window.GodpowerPicker?.notify('idle');
  slotEngine.chosenResult=null;
  document.getElementById('reelTextGroup').innerText = '待开奖';
  document.getElementById('reelTextStudent').innerText = '待开奖';
  document.getElementById('slotSubBadge').innerText = '就绪';
  document.getElementById('slotResultPanel').classList.remove('show');
  const btn = document.getElementById('btnSlotTrigger');
  btn.className = 'btn-slot-action start';
  btn.innerText = '开始抽签';
}

function toggleAntiRepeat(checked) {
  state.picker.antiRepeat = checked;
  saveState();
  updatePickerPoolUI();
}

function resetPickerPool() {
  state.picker.pickedStudentKeys = [];
  state.picker.pickedGroupIds = [];
  saveState();
  updatePickerPoolUI();
  showToast('点名奖池已重置');
}

function getAvailablePool() {
  if (state.picker.mode === 'group') {
    let grps = state.groups;
    if (state.picker.antiRepeat) {
      grps = grps.filter(g => !state.picker.pickedGroupIds.includes(g.id));
      if (grps.length === 0 && state.groups.length > 0) {
        state.picker.pickedGroupIds = [];
        grps = state.groups;
      }
    }
    return { type: 'groups', list: grps };
  }

  if (state.picker.mode === 'two_tier') {
    let grps = state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0);
    const pre = Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : [];
    if (pre.length > 0) {
      const selected = grps.filter(g => pre.includes(g.id));
      if (selected.length > 0) grps = selected;
    }
    let students = [];
    grps.forEach(g => {
      (g.members || []).forEach(m => students.push({ group: g, memberName: m, key: g.id + '__' + m }));
    });
    if (state.picker.antiRepeat) {
      const filtered = students.filter(s => !state.picker.pickedStudentKeys.includes(s.key));
      if (filtered.length === 0 && students.length > 0) {
        state.picker.pickedStudentKeys = [];
        return { type: 'students', list: students, total: students.length };
      }
      return { type: 'students', list: filtered, total: students.length };
    }
    return { type: 'students', list: students, total: students.length };
  }

  let students = [];
  state.groups.forEach(g => {
    (g.members || []).forEach(m => {
      students.push({ group: g, memberName: m, key: `${g.id}__${m}` });
    });
  });
  if (state.picker.antiRepeat) {
    let filtered = students.filter(s => !state.picker.pickedStudentKeys.includes(s.key));
    if (filtered.length === 0 && students.length > 0) {
      state.picker.pickedStudentKeys = [];
      filtered = students;
    }
    return { type: 'students', list: filtered, total: students.length };
  }
  return { type: 'students', list: students, total: students.length };
}

function updatePickerPoolUI() {
  const pool = getAvailablePool();
  const label = document.getElementById('poolStatusText');
  if (!label) return;
  if (pool.type === 'groups') {
    label.innerText = `剩余: ${pool.list.length}组`;
  } else {
    label.innerText = `剩余: ${pool.list.length}人`;
  }
}

function toggleSlotSpin() {
  if (!slotEngine.isSpinning) return startSlotSpin();
  return stopSlotSpin();
}

async function startSlotSpin() {
  const uiGeneration=typeof DesktopUI!=='undefined'?DesktopUI.getPickerGeneration():null;
  const pool = getAvailablePool();
  if (pool.list.length === 0) {
    themeAlert('奖池空了');
    return;
  }
  await getAudioContext();
  if(slotEngine.isSpinning||(uiGeneration!==null&&!DesktopUI.isPickerCurrent(uiGeneration)))return false;
  startRollLoop();
  slotEngine.isSpinning = true;
  document.getElementById('slotResultPanel').classList.remove('show');
  const btn = document.getElementById('btnSlotTrigger');
  btn.className = 'btn-slot-action stop';
  btn.innerText = '停止';

  const winnerIndex = Math.floor(Math.random() * pool.list.length);

  if (state.picker.mode === 'two_tier') {
    slotEngine.chosenResult = pool.list[winnerIndex];
  } else {
    slotEngine.chosenResult = pool.list[winnerIndex];
  }

  const allGroups = state.groups;
  let allStudents = [];
  state.groups.forEach(g => {
    (g.members || []).forEach(m => allStudents.push({ group: g, name: m }));
  });
  if (allGroups.length === 0) allGroups.push({ name: '默认组' });
  if (allStudents.length === 0) allStudents = [{ group: { name: '默认组' }, name: '学生' }];

  // 双层联动：转轮在预选组及其组内学生中滚动（未预选则全部有成员组）
  let reelGrps = allGroups;
  let reelStus = allStudents;
  if (state.picker.mode === 'two_tier') {
    const pre = Array.isArray(state.picker.preselectedGroupIds) ? state.picker.preselectedGroupIds : [];
    const grpWithMembers = state.groups.filter(g => Array.isArray(g.members) && g.members.length > 0);
    if (pre.length > 0) {
      const chosen = allGroups.filter(g => pre.includes(g.id));
      if (chosen.length > 0) reelGrps = chosen;
      const chosenStus = allStudents.filter(s => pre.includes(s.group.id));
      if (chosenStus.length > 0) reelStus = chosenStus;
    } else if (grpWithMembers.length > 0) {
      reelGrps = grpWithMembers;
      reelStus = allStudents.filter(s => grpWithMembers.some(g => g.id === s.group.id));
    }
  }

  const reelGrpText = document.getElementById('reelTextGroup');
  if (reelGrpText) {
    slotEngine.timerGroup = setInterval(() => {
      const randomGrp = reelGrps[Math.floor(Math.random() * reelGrps.length)];
      reelGrpText.innerText = randomGrp.name;
    }, 70);
  }

  const reelStuText = document.getElementById('reelTextStudent');
  if (reelStuText) {
    slotEngine.timerStudent = setInterval(() => {
      const randomStu = reelStus[Math.floor(Math.random() * reelStus.length)];
      reelStuText.innerHTML = studentLabelHTMLV218(randomStu.name, randomStu.group);
    }, 50);
  }
  ClassroomFeedback.startLive();
  window.GodpowerPicker?.notify('rolling');
}

function stopSlotSpin() {
  if (!slotEngine.isSpinning) return false;
  slotEngine.isSpinning = false;
  clearInterval(slotEngine.timerGroup);
  clearInterval(slotEngine.timerStudent);

  const btn = document.getElementById('btnSlotTrigger');
  btn.className = 'btn-slot-action start';
  btn.innerText = '开始抽签';

  const win = slotEngine.chosenResult;
  stopRollLoop(() => playSound('roll_win'));

  const reelGrpText = document.getElementById('reelTextGroup');
  const reelStuText = document.getElementById('reelTextStudent');
  const badge = document.getElementById('slotSubBadge');
  const resultHeadline = document.getElementById('resultHeadline');

  if (state.picker.mode === 'group') {
    reelGrpText.innerText = win.name;
    badge.innerText = `小组抽签`;
    resultHeadline.innerText = `抽中：${win.name}`;
    if (state.picker.antiRepeat) state.picker.pickedGroupIds.push(win.id);
  } else if (state.picker.mode === 'two_tier') {
    reelGrpText.innerText = win.group.name;
    reelStuText.innerHTML = studentLabelHTMLV218(win.memberName,win.group);
    badge.innerText = `双层联动：${win.group.name}`;
    resultHeadline.innerHTML = `抽中：${studentLabelHTMLV218(win.memberName,win.group)} <span style="color:#64748b">(${escapeHtml(win.group.name)})</span>`;
    if (state.picker.antiRepeat) {
      state.picker.pickedStudentKeys.push(win.key);
    }
  } else {
    reelStuText.innerHTML = studentLabelHTMLV218(win.memberName,win.group);
    badge.innerText = `所属：${win.group.name}`;
    resultHeadline.innerHTML = `抽中：${studentLabelHTMLV218(win.memberName,win.group)} <span style="color:#64748b">(${escapeHtml(win.group.name)})</span>`;
    if (state.picker.antiRepeat) state.picker.pickedStudentKeys.push(win.key);
  }
  ensureV2State();
  const target = state.picker.mode === 'group' ? win : win.group;
  const text = state.picker.mode === 'group' ? `抽中 ${target.name}` : `抽中 ${win.memberName}（${target.name}）`;
  state.itemGlobal.pickerHistory.push({time:Date.now(),text});
  if(state.itemGlobal.pickerHistory.length>100)state.itemGlobal.pickerHistory.shift();
  saveState();
  syncPickerScoreTarget(); renderPickerInfo();
  updatePickerPoolUI();
  window.GodpowerPicker?.notify('settling');
  document.getElementById('slotResultPanel').classList.add('show');
  if(typeof DesktopUI!=='undefined')DesktopUI.pickerStopped();
}

function rewardPickedStudent(points) {
  cancelScoreAnimationAndSync();
  const win = slotEngine.chosenResult;
  if (!win) return;
  const targetGroup = state.picker.mode === 'group' ? win : win.group;
  const g = state.groups.find(x => x.id === targetGroup.id);
  if (!g) return;

  recordHistory(`${g.name} 点名回答加分 (+${points})`);
  const oldScore = g.score;
  g.score = oldScore + points;
  saveState();
  animateScores([{ groupId: g.id, start: oldScore, target: g.score }]);
  playSound('score_add');

  showToast(`${g.name} 表现分 +${points}`);
  document.getElementById('slotResultPanel').classList.remove('show');
}

function openBatchImportModal() {
  if (state.isLocked) { openPwdModal(); return; }
  const sample = state.groups.map(g => `${g.name}: ${g.members.join(', ')}`).join('\n');
  document.getElementById('batchTextarea').value = sample;
  showClassroomWindow(document.getElementById('batchImportModal'));
}

function closeBatchImportModal() {
  hideClassroomWindow(document.getElementById('batchImportModal'));
}

function applyBatchImport() {
  const text = document.getElementById('batchTextarea').value.trim();
  if (!text) { closeBatchImportModal(); return; }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let parsedCount = 0;

  lines.forEach(line => {
    if (line.includes(':') || line.includes('：')) {
      const delimiter = line.includes(':') ? ':' : '：';
      const [grpName, membersStr] = line.split(delimiter);
      const targetGroup = state.groups.find(g => g.name.trim() === grpName.trim() || g.name.replace(/\s+/g, '') === grpName.replace(/\s+/g, ''));
      if (targetGroup && membersStr) {
        const members = membersStr.split(/[,，、\s]+/).map(m => m.trim()).filter(Boolean);
        targetGroup.members = Array.from(new Set(members));
        parsedCount += targetGroup.members.length;
      }
    }
  });

  saveState();
  renderGrid();
  updatePickerPoolUI();
  closeBatchImportModal();
  showToast(`成功导入 ${parsedCount} 名学生`);
}


function exportData() {
  const blob=new Blob([JSON.stringify(buildClassroomBackup(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='上帝的力量_完整课堂备份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function triggerImport() {
  if (state.isLocked) { openPwdModal(); return; }
  document.getElementById('importFileInput').click();
}

function handleFileImport(event) {
  const file=event.target.files?.[0];if(!file)return;
  if(file.size>50*1024*1024){themeAlert('备份超过 50 MB，请检查文件');event.target.value='';return}
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const result=importClassroomData(JSON.parse(reader.result));
      if(result.ok)showToast('数据恢复成功');else themeAlert('导入失败，原数据已保留：'+result.error);
    }catch(error){themeAlert('JSON 无效，原数据已保留：'+error.message)}
    event.target.value='';
  };
  reader.onerror=()=>{themeAlert('文件读取失败，原数据已保留');event.target.value=''};
  reader.readAsText(file);
}

function addGroup() {
  if (state.isLocked) { openPwdModal(); return; }
  const newId = Date.now();
  const index = state.groups.length + 1;
  const color = DEFAULT_COLORS[(index - 1) % DEFAULT_COLORS.length];
  recordHistory(`添加新小组 (第 ${index} 组)`);
  state.groups.push({
    id: newId,
    name: `第 ${index} 组`,
    color: color,
    score: 0,
    displayScore: 0,
    selectedOpt: '',
    allIn: false,
    resultText: '',
    animState: '',
    members: []
  });
  playSound('score_add');
  saveState();
  renderAll();
}

async function deleteGroup(groupId) {
  if (state.isLocked) { openPwdModal(); return; }
  const target = state.groups.find(x => x.id === groupId);
  if (await themeConfirm(`确认删除 ${target ? target.name : '该小组'} 吗？`, {title:'删除小组', danger:true, confirmText:'删除'})) {
    recordHistory(`删除小组 (${target ? target.name : ''})`);
    state.groups = state.groups.filter(x => x.id !== groupId);
    saveState();
    renderAll();
  }
}

function updateGroupName(groupId, newName) {
  if (state.isLocked) return;
  const g = state.groups.find(x => x.id === groupId);
  if (!g) return;
  g.name = newName;
  saveState();
  updateHeaderStats();
  renderChart();
  renderDashboard();
}

function updateGroupColor(groupId, newColor) {
  if (state.isLocked) return;
  const g = state.groups.find(x => x.id === groupId);
  if (!g) return;
  g.color = newColor;
  saveState();
  renderAll();
}

async function resetAllScores() {
  cancelScoreAnimationAndSync();
  if (state.isLocked) { openPwdModal(); return; }
  if (await themeConfirm('确认重置所有小组积分为 0 吗？', {title:'积分清零', danger:true, confirmText:'全部清零'})) {
    recordHistory('全局重置所有小组积分');
    const updates = [];
    state.groups.forEach(g => {
      updates.push({ groupId: g.id, start: g.score, target: 0 });
      g.score = 0;
      g.displayScore = 0;
      g.resultText = '';
      g.animState = '';
    });
    animateScores(updates);
    playSound('allin_lose');
    saveState();
  }
}

function openSoundSettings() {
  if (state.isLocked) {
    themeAlert('这按钮不是普通人类权限。先解锁上帝模式。');
    openPwdModal();
    return;
  }
  syncSettingsControls();
  renderBgmSlotList();
  renderFxSlotList();
  renderBgmEngineConsole();
  switchView('settings');
}

function closeSoundModal() {
  switchView('battle');
}

function syncSettingsControls() {
  document.getElementById('cfgResizerEnabled').checked = state.resizerEnabled;
  document.getElementById('cfgSaveAllIn').checked = state.saveAllIn;
  document.getElementById('cfgColumnMode').value = state.columnMode;
  document.getElementById('cfgMasterVolume').value = state.masterVolume;
  document.getElementById('volLabel').innerText = `${Math.round(state.masterVolume * 100)}%`;
  const summaryText = state.groups.map(g => `${g.name}: ${(g.members || []).join(', ')}`).join('\n');
  document.getElementById('settingsBatchMemberText').value = summaryText;
}

function updateMasterVolume(vol) {
  state.masterVolume = parseFloat(vol);
  document.getElementById('volLabel').innerText = `${Math.round(state.masterVolume * 100)}%`;
  if (masterGainNode && audioCtx) {
    masterGainNode.gain.setValueAtTime(state.masterVolume, audioCtx.currentTime);
  }
  saveState();
}

let bgmSlotRenderGeneration = 0;
async function renderBgmSlotList() {
  const container = document.getElementById('bgmListContainer');
  if (!container) return;
  const generation = ++bgmSlotRenderGeneration;
  const setIdx = parseInt(document.getElementById('cfgSetSelector').value, 10);
  const isMenuSet = setIdx === 8;
  const trackTypes = isMenuSet ? MENU_SET_TRACK_TYPES : SET_TRACK_TYPES;
  container.innerHTML = '';

  const bpmDesc = document.getElementById('cfgSetBpmDesc');
  if (bpmDesc) {
    if (isMenuSet) {
      bpmDesc.innerText = `菜单配乐套：BPM ${Number(menuCfg.bpm) || 130} · ${menuCfg.beatsPerBar}/4 拍 · 循环: 第 ${menuCfg.loopStartBeat} 拍 至 第 ${menuCfg.loopEndBeat} 拍`;
    } else {
      const effBpm = setIdx === 7 ? (Number(menuCfg.battleSet8Bpm) || 135) : (Number(menuCfg.battleBaseBpm) || 130);
      bpmDesc.innerText = `BPM ${effBpm} · 4/4 拍 · 循环: 第 9 拍 至 第 184 拍 (无尾音)`;
    }
  }

  await refreshSoundIdCache();
  const { isComplete, count } = await checkSetCompleteness(setIdx);

  const currentIdxAfter = parseInt(document.getElementById('cfgSetSelector').value, 10);
  if (generation !== bgmSlotRenderGeneration || currentIdxAfter !== setIdx) return;

  const compLabel = document.getElementById('cfgSetCompleteness');
  if (compLabel) {
    const total = trackTypes.length;
    compLabel.innerText = `${count} / ${total} 就绪 ${isComplete ? '(完整)' : '(未完整)'}`;
    compLabel.style.color = isComplete ? '#059669' : '#d97706';
  }

  try {
    for (const track of trackTypes) {
      const slotId = isMenuSet ? `bgm_menu_${track.key}` : `bgm_set_${setIdx}_${track.key}`;
      const isLoaded = hasSound(slotId);

      const row = document.createElement('div');
      row.className = 'sound-row';
      row.innerHTML = `
        <div class="sound-desc">
          <div class="sound-name">${track.name}</div>
          <div class="sound-tag">${isLoaded ? '已载入音频' : track.desc}</div>
        </div>
        <div class="sound-controls">
          ${isLoaded ? `<button class="btn btn-sm" style="background:#e2e8f0; color:#1e293b;" data-sound-preview onclick="previewBgmTrack('${slotId}')">试听</button>` : ''}
          <button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('${slotId}')">上传</button>
          ${isLoaded ? `<button class="btn btn-sm btn-danger" onclick="deleteBgmTrack('${slotId}')">清除</button>` : ''}
        </div>
      `;
      container.appendChild(row);
    }
  } catch (_) {}
}

function renderFxSlotList() {
  const fxContainer = document.getElementById('soundListContainer');
  if (!fxContainer) return;
  fxContainer.innerHTML = '';
  const categories=new Map();
  FX_SOUND_SLOTS.forEach(slot=>{const category=slot.category||(['roll_tick','roll_loop','roll_win'].includes(slot.id)?'点名过程与结果':slot.id==='ui_click'?'通用按钮默认音效':'计分与比赛结果');if(!categories.has(category))categories.set(category,[]);categories.get(category).push(slot)});
  for(const [category,slots] of categories){
    const section=document.createElement('details');section.className='cf-sound-category';section.open=false;
    const summary=document.createElement('summary');summary.textContent=category+' · '+slots.length+' 个音效槽';section.append(summary);
    for(const slot of slots){
      const isCustom=!!customFxBuffers[slot.id]||!!customFxVariants[slot.id]?.length;
      const row=document.createElement('div');row.className='sound-row';row.dataset.soundId=slot.id;
      row.innerHTML=`<div class="sound-desc"><div class="sound-name">${escapeHtml(slot.name)}</div><div class="sound-tag">${isCustom?'已加载外部音频':escapeHtml(slot.desc)}</div></div><div class="sound-controls"><button class="btn btn-sm" data-sound-preview onclick="playSound('${slot.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${slot.id}')">上传</button>${isCustom?`<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${slot.id}','${slot.id}')">还原</button>`:''}</div>${renderFxChoices(slot.id)}`;
      section.append(row);
    }fxContainer.append(section);
  }
}

async function previewBgmTrack(slotId) {
  if (!db) return;
  try {
    const tx = db.transaction('sounds', 'readonly');
    const store = tx.objectStore('sounds');
    const req = store.get(slotId);
    req.onsuccess = async () => {
      if (req.result && req.result.arrayBuffer) {
        const ctx = await getAudioContext();
        try {
          const decoded = await ctx.decodeAudioData(req.result.arrayBuffer.slice(0));
          const src = ctx.createBufferSource();
          src.buffer = decoded;
          src.connect(masterGainNode);
          src.start(0);
        } catch(e) {}
      }
    };
  } catch(e) {}
}

function triggerUploadAudio(slotId,append=false) {
  currentUploadingSlot=slotId;currentUploadingAppend=append&&slotId.startsWith('fx_');
  const input=document.getElementById('soundFileInput');input.multiple=slotId.startsWith('fx_');input.click();
}
function handleSoundFileUpload(event) {
  const files=Array.from(event.target.files||[]),slotId=currentUploadingSlot,append=currentUploadingAppend;
  if(!files.length||!slotId)return;
  const fxKey=slotId.startsWith('fx_')?slotId.slice(3):null;
  // First file replaces the primary unless explicitly appending; additional files are candidates.
  return Promise.all(files.map((file,index)=>new Promise(resolve=>{
    const candidate=!!fxKey&&(append||index>0),key=candidate?slotId+'::variant::'+crypto.randomUUID():slotId;
    const reader=new FileReader();
    reader.onerror=()=>{showToast('音频文件读取失败，原音频保留');resolve(false)};
    reader.onload=async function(e){
      let decoded;
      try{const ctx=await getAudioContext();decoded=await ctx.decodeAudioData(e.target.result.slice(0));}
      catch(error){themeAlert('解析失败，请确保格式为 MP3/WAV');resolve(false);return;}
      if(fxKey){
        if(candidate)(customFxVariants[fxKey]||=[]).push({id:key,name:file.name||'候选音效',buffer:decoded});
        else customFxBuffers[fxKey]=decoded;
      }
      let saved=false;
      try{
        if(!db)throw Error('浏览器音频存储不可用');
        await new Promise((done,reject)=>{
          const tx=db.transaction('sounds','readwrite');tx.oncomplete=done;tx.onerror=()=>reject(tx.error||Error('音频保存失败'));tx.onabort=()=>reject(tx.error||Error('音频保存中止'));
          tx.objectStore('sounds').put({id:key,name:file.name||'',arrayBuffer:e.target.result});
        });soundIdCache.add(key);saved=true;
      }catch(error){showToast(fxKey?'音效仅在本页生效，未保存：'+error.message:'音频未保存，原已保存文件保留：'+error.message);}
      bgmEngine.preloadedSet=null;bgmShufflePool=[];
      if(saved)showToast(candidate?'候选音效已追加，播放时随机选择':'音频已保存');
      renderBgmSlotList();renderFxSlotList();renderItemFxSoundListV26();resolve(saved);
    };reader.readAsArrayBuffer(file);
  }))).finally(()=>{event.target.value='';currentUploadingAppend=false;});
}

function deleteBgmTrack(slotId) {
  if (!db) return;
  try {
    const tx = db.transaction('sounds', 'readwrite');
    const store = tx.objectStore('sounds');
    store.delete(slotId);
    soundIdCache.delete(slotId);
    bgmEngine.preloadedSet = null;
    bgmShufflePool = [];
    showToast('已清除');
    renderBgmSlotList();
  } catch(e) {}
}

async function deleteFxTrack(idbKey, fxKey) {
  if(!db)return;
  try{
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('sounds','readwrite'),store=tx.objectStore('sounds');
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
      const req=store.getAllKeys();req.onsuccess=()=>req.result.filter(key=>key===idbKey||String(key).startsWith(idbKey+'::variant::')).forEach(key=>store.delete(key));
    });
    for(const key of [...soundIdCache])if(key===idbKey||key.startsWith(idbKey+'::variant::'))soundIdCache.delete(key);
    delete customFxBuffers[fxKey];delete customFxVariants[fxKey];
    showToast('已还原全部候选音效');renderFxSlotList();renderItemFxSoundListV26();
  }catch(error){showToast('还原失败，原音效保留')}
}

async function exportAudioBundle() {
  if (!db) return;
  showToast('正在打包音频...');

  try {
    const tx = db.transaction('sounds', 'readonly');
    const store = tx.objectStore('sounds');
    const allRecords = await new Promise(resolve => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (allRecords.length === 0) {
      themeAlert('没有音频可导出');
      return;
    }

    let currentOffset = 0;
    const fileIndex = [];
    const audioBuffersToPack = [];

    for (const record of allRecords) {
      const ab = record.arrayBuffer;
      fileIndex.push({ id: record.id, name:record.name||'', offset: currentOffset, length: ab.byteLength });
      audioBuffersToPack.push(ab);
      currentOffset += ab.byteLength;
    }

    const indexBytes = new TextEncoder().encode(JSON.stringify(fileIndex));
    const headerBuffer = new ArrayBuffer(8);
    const headerView = new DataView(headerBuffer);
    headerView.setUint8(0, 0x42); headerView.setUint8(1, 0x47);
    headerView.setUint8(2, 0x4D); headerView.setUint8(3, 0x50);
    headerView.setUint32(4, indexBytes.byteLength, true);

    const bundleBlob = new Blob([headerBuffer, indexBytes, ...audioBuffersToPack], { type: 'application/octet-stream' });
    const downloadUrl = URL.createObjectURL(bundleBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `政治课堂音频包_${allRecords.length}轨.bin`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    showToast('打包导出成功');
  } catch(e) {
    themeAlert('导出失败');
  }
}

function triggerImportAudioBundle() {
  if (state.isLocked) { openPwdModal(); return; }
  document.getElementById('bundleFileInput').click();
}

function handleBundleFilePicked(event) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('正在导入音频包...');

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const fullBuffer = e.target.result;
      const dataView = new DataView(fullBuffer);
      if (dataView.getUint8(0) !== 0x42 || dataView.getUint8(1) !== 0x47) {
        themeAlert('非法音频包文件');
        return;
      }

      const indexLength = dataView.getUint32(4, true);
      const fileIndex = JSON.parse(new TextDecoder().decode(new Uint8Array(fullBuffer, 8, indexLength)));
      const binaryStart = 8 + indexLength;

      const tx = db.transaction('sounds', 'readwrite');
      const store = tx.objectStore('sounds');

      fileIndex.forEach(item => {
        store.put({ id: item.id, name:item.name||'', arrayBuffer: fullBuffer.slice(binaryStart + item.offset, binaryStart + item.offset + item.length) });
      });

      tx.oncomplete = async () => {
        await refreshSoundIdCache();
        fxSoundsLoaded = false;
        bgmEngine.preloadedSet = null;
        bgmShufflePool = [];
        await loadFxSounds();
        renderBgmSlotList();
        renderFxSlotList();
        renderItemFxSoundListV26();
        showToast('音频包导入成功');
      };
    } catch(err) {
      themeAlert('导入失败');
    }
    event.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}


/* ================================================================
 * v3：五页面 SPA 视图导航 + 欢迎界面 + 菜单同拍音频池（9 套）+ 工程台
 * ================================================================ */

/* ---------- 视图导航 ---------- */
const VIEW_NAMES = ['welcome', 'battle', 'history', 'archives', 'settings'];
let currentView = 'welcome';
let audioUnlocked = false;

function ensureAudioUnlocked() {
  if (audioUnlocked) return Promise.resolve();
  return getAudioContext().then(() => { audioUnlocked = true; }).catch(() => { audioUnlocked = false; });
}

function switchView(name) {
  if (!VIEW_NAMES.includes(name)) name = 'welcome';
  ensureAudioUnlocked();
  currentView = name;
  if(typeof DesktopUI!=='undefined')DesktopUI.viewChanged(name);

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + name);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));

  if (name === 'welcome') { renderWelcomePage(); updateWelcomeTrackIfNeeded(); }
  if (name === 'history') renderHistoryList();
  if (name === 'archives') renderSettlementHistoryList();
  if (name === 'settings') { syncSettingsControls(); renderBgmSlotList(); renderFxSlotList(); renderBgmEngineConsole(); }
  if (name === 'battle') {
    menuFadeOut();
    renderAll();
  } else {
    // 切出比赛页：停止战斗 BGM，菜单配乐从进入比赛前的断点续播（0.5s 淡入）
    if (bgmEngine.state !== 'IDLE') bgmStopAll();
    ensureAudioUnlocked().then(() => {
      const menuKey = getMenuTrackKeyForView(name);
      if (menuKey) menuStartOrSwitch(menuKey);
    });
  }
}

function enterBattleFromWelcome() {
  switchView('battle');
}

function getMenuTrackKeyForView(name) {
  if (name === 'welcome') return getWelcomeTrackKey();
  if (name === 'history') return 'aux_history';
  if (name === 'archives') return 'aux_archives';
  if (name === 'settings') return 'aux_settings';
  return null;
}

function getWelcomeTrackKey() {
  const max = state.groups.reduce((m, g) => Math.max(m, Number(g.score) || 0), 0);
  const digits = Math.max(1, Math.min(6, String(Math.floor(Math.abs(max))).length));
  return 'welcome_' + digits;
}

/* ---------- 欢迎界面 ---------- */
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
let welcomeClockTimer = null;

function startWelcomeClock() {
  if (welcomeClockTimer) return;
  updateWelcomeClock();
  welcomeClockTimer = setInterval(updateWelcomeClock, 1000);
}

function updateWelcomeClock() {
  updateHeaderStats();
  if(typeof DesktopUI!=='undefined')DesktopUI.renderWelcome();
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const clock = document.getElementById('welcomeClock');
  if (clock) clock.innerText = hh + ':' + mm + ':' + ss;
  const date = document.getElementById('welcomeDate');
  if (date) date.innerText = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 星期' + WEEKDAYS[now.getDay()];
  const greeting = document.getElementById('welcomeGreeting');
  if (greeting) {
    const h = now.getHours();
    const part = h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
    greeting.innerText = part + '，欢迎使用上帝的力量';
  }
}

function renderWelcomePage() {
  if(typeof DesktopUI!=='undefined')DesktopUI.renderWelcome();
  const wrap = document.getElementById('welcomePodiumDeck');
  if (!wrap) return;
  const sorted = [...state.groups].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  const top1 = sorted[0], top2 = sorted[1], top3 = sorted[2];
  const getScore = (g) => g ? (Number(g.score) || 0) : 0;
  wrap.innerHTML = `
    <div class="podium-col rank-2" style="background:rgba(246,250,253,.85); border-color:rgba(190,215,235,.9);">
      <span class="podium-badge" style="color:#4a5b73;">第 2 名</span>
      <span class="podium-name" style="color:#172033;">${top2 ? escapeHtml(top2.name) : '-'}</span>
      <span class="podium-score" style="color:${top2 ? top2.color : '#94a3b8'};">${getScore(top2)}分</span>
    </div>
    <div class="podium-col rank-1" style="background:rgba(254,243,199,.85); border-color:#fbbf24;">
      <span class="podium-badge" style="color:#b45309;">第 1 名</span>
      <span class="podium-name" style="color:#172033;">${top1 ? escapeHtml(top1.name) : '-'}</span>
      <span class="podium-score" style="color:#b45309; font-size:20px;">${getScore(top1)}分</span>
    </div>
    <div class="podium-col rank-3" style="background:rgba(246,250,253,.85); border-color:rgba(190,215,235,.9);">
      <span class="podium-badge" style="color:#4a5b73;">第 3 名</span>
      <span class="podium-name" style="color:#172033;">${top3 ? escapeHtml(top3.name) : '-'}</span>
      <span class="podium-score" style="color:${top3 ? top3.color : '#94a3b8'};">${getScore(top3)}分</span>
    </div>`;
  // Visible welcome statistics are owned by WelcomeV2.render().

}

/* ---------- 菜单同拍音频池配置 ---------- */
const MENU_TRACK_KEYS = ['welcome_1', 'welcome_2', 'welcome_3', 'welcome_4', 'welcome_5', 'welcome_6', 'aux_history', 'aux_archives', 'aux_settings'];
const MENU_SET_TRACK_TYPES = [
  { key: 'welcome_1', name: '欢迎·个位张力', desc: '最高分个位数时播放' },
  { key: 'welcome_2', name: '欢迎·十位张力', desc: '最高分十位数时播放' },
  { key: 'welcome_3', name: '欢迎·百位张力', desc: '最高分百位数时播放' },
  { key: 'welcome_4', name: '欢迎·千位张力', desc: '最高分千位数时播放' },
  { key: 'welcome_5', name: '欢迎·万位张力', desc: '最高分万位数时播放' },
  { key: 'welcome_6', name: '欢迎·更高位张力', desc: '最高分十万/百万级时播放' },
  { key: 'aux_history', name: '历史记录·配乐', desc: '历史页专属配乐' },
  { key: 'aux_archives', name: '结算档案·配乐', desc: '档案页专属配乐' },
  { key: 'aux_settings', name: '系统设置·配乐', desc: '设置页专属配乐' }
];
const MENU_TRACK_META = {
  welcome_1: { name: '欢迎·个位张力', tension: 1 },
  welcome_2: { name: '欢迎·十位张力', tension: 2 },
  welcome_3: { name: '欢迎·百位张力', tension: 3 },
  welcome_4: { name: '欢迎·千位张力', tension: 4 },
  welcome_5: { name: '欢迎·万位张力', tension: 5 },
  welcome_6: { name: '欢迎·十万/百万级张力', tension: 6 },
  aux_history: { name: '历史记录·沉稳', tension: 0, density: 0.3, hat: 0.1, leadOct: 1 },
  aux_archives: { name: '结算档案·庄重', tension: 0, density: 0.36, hat: 0.22, leadOct: 2 },
  aux_settings: { name: '系统设置·中性', tension: 0, density: 0.26, hat: 0.3, leadOct: 1 }
};
const MENU_AUDIO_DEFAULTS = {
  enabled: true,
  bpm: 130,
  beatsPerBar: 4,
  loopStartBeat: 1,
  loopEndBeat: 33,
  transitionLeadBeats: 1,
  battleBaseBpm: 130,
  battleSet8Bpm: 135,
  battleTransitionLeadBeats: 0,
  gainTrims: {}
};
MENU_TRACK_KEYS.forEach(k => { MENU_AUDIO_DEFAULTS.gainTrims[k] = 1; });
let menuCfg = { ...MENU_AUDIO_DEFAULTS, gainTrims: { ...MENU_AUDIO_DEFAULTS.gainTrims } };
try {
  const saved = STORAGE.getJSON('politics_menu_audio_cfg', null);
  if (saved && typeof saved === 'object') {
    menuCfg = { ...MENU_AUDIO_DEFAULTS, ...saved, gainTrims: { ...MENU_AUDIO_DEFAULTS.gainTrims, ...(saved.gainTrims || {}) } };
  }
} catch(e) {}
function saveMenuCfg() { STORAGE.setJSON('politics_menu_audio_cfg', menuCfg); }

/* ---------- 合成器工具 ---------- */
function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const SCALE_MAJOR = [0, 2, 4, 5, 7, 9, 11];
const CHORD_PROG = [0, 0, 9, 9, 5, 5, 7, 7];
const MENU_PATTERN_CACHE = {};

function buildMenuPattern(key, bars) {
  bars = Math.max(1, Number(bars) || 8);
  const cacheKey = key + ':' + bars;
  if (MENU_PATTERN_CACHE[cacheKey]) return MENU_PATTERN_CACHE[cacheKey];
  const meta = MENU_TRACK_META[key] || { tension: 1 };
  const rnd = mulberry32(key.split('').reduce((s, c) => s + c.charCodeAt(0), 7));
  const stepsPerBar = 16;
  const totalSteps = bars * stepsPerBar;
  const tension = meta.tension;
  const density = meta.density !== undefined ? meta.density
    : (tension >= 6 ? 0.66 : tension === 5 ? 0.56 : tension === 4 ? 0.46 : tension === 3 ? 0.36 : tension === 2 ? 0.26 : tension === 1 ? 0.18 : 0.28);
  const hatLevel = meta.hat !== undefined ? meta.hat
    : (tension >= 6 ? 0.85 : tension === 5 ? 0.7 : tension === 4 ? 0.55 : tension === 3 ? 0.4 : tension === 2 ? 0.25 : tension === 1 ? 0.12 : 0.2);
  const leadOct = meta.leadOct !== undefined ? meta.leadOct
    : (tension >= 5 ? 3 : tension >= 3 ? 2 : 1);
  const bass = new Array(totalSteps).fill(0);
  const lead = new Array(totalSteps).fill(null);
  const hat = new Array(totalSteps).fill(false);
  for (let bar = 0; bar < bars; bar++) {
    const chordRoot = CHORD_PROG[bar % CHORD_PROG.length];
    const rootMidi = 48 + chordRoot;
    for (let step = 0; step < stepsPerBar; step++) {
      const gs = bar * stepsPerBar + step;
      if (step % 4 === 0) bass[gs] = rootMidi;
      else if (step % 4 === 2 && tension >= 4) bass[gs] = rootMidi + 7;
      if (rnd() < density) {
        const deg = Math.floor(rnd() * SCALE_MAJOR.length);
        const oct = Math.floor(rnd() * 2);
        lead[gs] = rootMidi + 12 + SCALE_MAJOR[deg] + oct * 12 + (leadOct - 1) * 12;
      }
      if (rnd() < hatLevel) hat[gs] = true;
    }
  }
  MENU_PATTERN_CACHE[cacheKey] = { bass, lead, hat, totalSteps };
  return MENU_PATTERN_CACHE[cacheKey];
}

let noiseBuffer = null;
function getNoiseBuffer() {
  if (!audioCtx) return null;
  if (noiseBuffer) return noiseBuffer;
  const len = Math.floor(audioCtx.sampleRate * 0.05);
  noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

/* ---------- 菜单同拍音频池引擎（上传音频优先，合成兜底） ----------
   设计要点：
   1) 唯一音乐时间原点 origin：任意时刻的音乐位置 = ctx.currentTime - origin（再按循环区间回绕），
      所有菜单轨（欢迎 6 张力轨 + 历史/档案/设置）都从这一位置起播，因此切页始终同拍。
   2) 进入比赛页：0.5s 淡出，记录淡出结束瞬间的音乐位置 pausedPos；返回时令 origin = now - pausedPos，
      从断点续播。若淡出尚未结束就切回，时间线未中断，直接沿用 origin。
   3) 每次起播都新建独立 voice（source + 专属 gain）。淡出时用音频时钟 src.stop(t) 预约停止，
      onended 回调断开并回收节点，不依赖 JS 定时器，快速切页也不会遗留节点。
   4) 打断时不读取 gain.value（渐变中途在部分浏览器不可靠），而是按记录的渐变起止点插值计算当前音量。 */
const MENU_FADE_SEC = 0.5;
const menuBgm = {
  active: false,
  currentKey: null,
  pendingKey: null,
  buffers: {},
  uploadedKeys: new Set(),
  outGain: null,
  voices: [],
  origin: 0,
  pausedPos: null,
  pausedAt: 0,
  opToken: 0
};

function menuSecPerBeat() { return 60 / Math.max(40, Number(menuCfg.bpm) || 130); }

function menuLoopSpan() {
  const startBeat = Math.max(1, Number(menuCfg.loopStartBeat) || 1);
  const endBeat = Math.max(startBeat + 4, Number(menuCfg.loopEndBeat) || 33);
  return {
    startBeat,
    endBeat,
    startSec: (startBeat - 1) * menuSecPerBeat(),
    endSec: (endBeat - 1) * menuSecPerBeat()
  };
}

/* 欢迎页的 6 条音轨是同一首音乐的分阶段 stem，必须共享完全一致的循环终点。
   浏览器解码 MP3/AAC 时，个别文件可能比工程设定短几十毫秒；旧逻辑会把那一轨的
   loopEnd 单独提前到文件末尾，经过一次循环后再切换阶段便会出现轻微抢拍。
   这里只补齐“接近标准长度”的欢迎音轨，不影响历史、档案、设置或比赛 BGM。 */
function normalizeWelcomeLoopBuffer(key, buf) {
  if (!buf || !/^welcome_[1-6]$/.test(key) || !audioCtx) return buf;
  const targetEnd = menuLoopSpan().endSec;
  const missing = targetEnd - buf.duration;
  const maxRepair = Math.min(0.35, menuSecPerBeat() * 0.75);
  if (!(missing > 0.0005 && missing <= maxRepair)) return buf;

  try {
    const sampleRate = buf.sampleRate || audioCtx.sampleRate;
    const targetLength = Math.ceil(targetEnd * sampleRate) + 1;
    const fixed = audioCtx.createBuffer(buf.numberOfChannels, targetLength, sampleRate);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      fixed.getChannelData(ch).set(buf.getChannelData(ch));
    }
    return fixed;
  } catch (_) {
    return buf;
  }
}

function menuEnsureGraph() {
  if (!audioCtx) return false;
  if (!menuBgm.outGain) {
    menuBgm.outGain = audioCtx.createGain();
    menuBgm.outGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
    menuBgm.outGain.connect(masterGainNode);
  }
  return true;
}

/* 合成兜底：按工程台 BPM/拍号/循环拍数离线渲染一轨同拍循环 buffer（未上传该轨音频时使用） */
function makeSynthMenuBuffer(key) {
  const sr = audioCtx.sampleRate;
  const bpm = Math.max(40, Number(menuCfg.bpm) || 130);
  const beats = Math.max(4, (Number(menuCfg.loopEndBeat) || 33) - (Number(menuCfg.loopStartBeat) || 1));
  const bars = Math.max(8, Math.ceil(beats / 4));
  const totalSteps = bars * 16;
  const stepSec = 60 / bpm / 16;
  const dur = totalSteps * stepSec;
  const len = Math.max(1, Math.floor(sr * dur));
  const offline = new OfflineAudioContext(1, len, sr);
  const pat = buildMenuPattern(key, bars);
  const trim = Math.max(0, Math.min(3, Number(menuCfg.gainTrims[key]) || 1));
  for (let step = 0; step < totalSteps; step++) {
    const time = step * stepSec;
    const bassMidi = pat.bass[step];
    const leadMidi = pat.lead[step];
    const hatOn = pat.hat[step];
    if (bassMidi) {
      const osc = offline.createOscillator();
      const g = offline.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(midiToFreq(bassMidi), time);
      g.gain.setValueAtTime(0.001, time);
      g.gain.exponentialRampToValueAtTime(0.24 * trim, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, time + stepSec * 3.4);
      osc.connect(g); g.connect(offline.destination);
      osc.start(time); osc.stop(time + stepSec * 3.6);
    }
    if (leadMidi) {
      const osc = offline.createOscillator();
      const g = offline.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(midiToFreq(leadMidi), time);
      g.gain.setValueAtTime(0.001, time);
      g.gain.exponentialRampToValueAtTime(0.12 * trim, time + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, time + stepSec * 0.9);
      osc.connect(g); g.connect(offline.destination);
      osc.start(time); osc.stop(time + stepSec);
    }
    if (hatOn) {
      const buf = offline.createBuffer(1, Math.floor(sr * 0.05), sr);
      const dd = buf.getChannelData(0);
      for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
      const src = offline.createBufferSource();
      src.buffer = buf;
      const g = offline.createGain();
      g.gain.setValueAtTime(0.07 * trim, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
      const hp = offline.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 6000;
      src.connect(g); g.connect(hp); hp.connect(offline.destination);
      src.start(time);
    }
  }
  return offline.startRendering();
}

/* 加载一轨：优先 IndexedDB 用户上传音频（bgm_menu_<key>），无则合成兜底；并发加载去重 */
const menuLoading = {};
async function menuLoadBuffer(key) {
  if (menuBgm.buffers[key]) return menuBgm.buffers[key];
  if (menuLoading[key]) return menuLoading[key];
  const p = (async () => {
    let buf = null;
    if (db) {
      try {
        const ab = await new Promise(res => {
          const tx = db.transaction('sounds', 'readonly');
          const req = tx.objectStore('sounds').get('bgm_menu_' + key);
          req.onsuccess = () => res((req.result && req.result.arrayBuffer) || null);
          req.onerror = () => res(null);
        });
        if (ab && ab.byteLength > 0) {
          buf = await audioCtx.decodeAudioData(ab.slice(0));
          buf = normalizeWelcomeLoopBuffer(key, buf);
          menuBgm.uploadedKeys.add(key);
        }
      } catch(e) {}
    }
    if (!buf) {
      try { buf = await makeSynthMenuBuffer(key); } catch(e2) { buf = null; }
      if (buf) menuBgm.uploadedKeys.delete(key);
    }
    if (buf) menuBgm.buffers[key] = buf;
    return buf;
  })();
  menuLoading[key] = p;
  try { return await p; } finally { delete menuLoading[key]; }
}

function menuLoopParams(buf, key) {
  const span = menuLoopSpan();
  if (menuBgm.uploadedKeys.has(key)) {
    const startSec = Math.min(span.startSec, Math.max(0, buf.duration - 0.05));
    const endSec = Math.min(span.endSec, buf.duration);
    return { startSec, endSec };
  }
  return { startSec: 0, endSec: buf.duration };
}

function menuTrimFor(key) {
  const t = Number(menuCfg.gainTrims[key]);
  return Math.max(0, Math.min(3, Number.isFinite(t) ? t : 1));
}

/* 音乐位置 → 某轨 buffer 内的起播秒数：未到循环终点前线性推进（含前奏区），越过后在循环区间内回绕 */
function menuPosForKey(key, buf, t) {
  const lp = menuLoopParams(buf, key);
  const elapsed = Math.max(0, t - menuBgm.origin);
  if (elapsed < lp.endSec) return elapsed;
  const dur = lp.endSec - lp.startSec;
  if (dur <= 0.001) return Math.min(elapsed, Math.max(0, buf.duration - 0.02));
  return lp.startSec + ((elapsed - lp.startSec) % dur);
}

function menuVoiceGainAt(v, t) {
  const r = v.ramp;
  if (t <= r.t0) return r.v0;
  if (t >= r.t1) return r.v1;
  return r.v0 + (r.v1 - r.v0) * ((t - r.t0) / (r.t1 - r.t0));
}

/* 从「当前真实音量」开始线性渐变到 target，可随时被新的渐变打断 */
function menuVoiceRamp(v, target, dur) {
  const now = audioCtx.currentTime;
  const cur = menuVoiceGainAt(v, now);
  const g = v.gain.gain;
  g.cancelScheduledValues(now);
  g.setValueAtTime(cur, now);
  g.linearRampToValueAtTime(target, now + dur);
  v.ramp = { v0: cur, v1: target, t0: now, t1: now + dur };
}

function menuSpawnVoice(key, buf, startAt) {
  const lp = menuLoopParams(buf, key);
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  src.loopStart = Math.min(lp.startSec, Math.max(0, buf.duration - 0.02));
  src.loopEnd = Math.min(lp.endSec, buf.duration);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  src.connect(gain);
  gain.connect(menuBgm.outGain);
  const offset = Math.min(menuPosForKey(key, buf, startAt), Math.max(0, buf.duration - 0.02));
  const v = { key, src, gain, ramp: { v0: 0, v1: 0, t0: 0, t1: 0 }, stopping: false, loopStart: src.loopStart, loopEnd: src.loopEnd };
  src.onended = () => {
    try { src.disconnect(); } catch(e) {}
    try { gain.disconnect(); } catch(e) {}
    const i = menuBgm.voices.indexOf(v);
    if (i >= 0) menuBgm.voices.splice(i, 1);
  };
  src.start(startAt, offset);
  menuBgm.voices.push(v);
  return v;
}

/* 淡出并由音频时钟预约销毁；已在退场的 voice 不重复处理 */
function menuRetireVoice(v, fadeSec) {
  if (v.stopping) return;
  const dur = fadeSec == null ? MENU_FADE_SEC : fadeSec;
  v.stopping = true;
  try {
    menuVoiceRamp(v, 0, dur);
    v.src.stop(audioCtx.currentTime + dur + 0.02);
  } catch(e) {
    try { v.src.stop(); } catch(e2) {}
  }
}

function menuSwitchNow(key, buf) {
  const now = audioCtx.currentTime;
  const startAt = now + 0.03;
  if (!menuBgm.active) {
    if (menuBgm.pausedPos === null) {
      menuBgm.origin = startAt;                          // 首次启动：从整曲起点
    } else if (now >= menuBgm.pausedAt) {
      menuBgm.origin = startAt - menuBgm.pausedPos;      // 断点续播
    }                                                     // 否则：淡出未结束即切回，时间线连续，沿用 origin
    menuBgm.pausedPos = null;
    menuBgm.active = true;
  }
  const live = menuBgm.voices.find(v => v.key === key && !v.stopping);
  menuBgm.voices.slice().forEach(v => { if (v !== live) menuRetireVoice(v); });
  const target = menuTrimFor(key);
  if (live) {
    if (Math.abs(menuVoiceGainAt(live, now) - target) > 0.001 || live.ramp.v1 !== target) menuVoiceRamp(live, target, MENU_FADE_SEC);
  } else {
    menuVoiceRamp(menuSpawnVoice(key, buf, startAt), target, MENU_FADE_SEC);
  }
  menuBgm.currentKey = key;
}

function menuStartOrSwitch(key) {
  if (!menuCfg.enabled || !key) return;
  menuBgm.pendingKey = key;
  const token = ++menuBgm.opToken;
  ensureAudioUnlocked().then(async () => {
    try {
      if (token !== menuBgm.opToken) return;
      if (bgmEngine.state !== 'IDLE' || currentView === 'battle') return;
      if (!menuEnsureGraph()) return;
      const buf = await menuLoadBuffer(key);
      if (!buf || token !== menuBgm.opToken) return;
      if (bgmEngine.state !== 'IDLE' || currentView === 'battle') return;
      menuSwitchNow(key, buf);
    } catch(e) {}
  });
}

/* 进入比赛页：0.5s 淡出，记录淡出完成瞬间的音乐位置作为断点 */
function menuFadeOut() {
  menuBgm.opToken++;
  menuBgm.pendingKey = null;
  if (!menuBgm.active || !audioCtx) return;
  const endT = audioCtx.currentTime + MENU_FADE_SEC;
  const cur = menuBgm.currentKey;
  const buf = cur ? menuBgm.buffers[cur] : null;
  menuBgm.pausedPos = buf ? menuPosForKey(cur, buf, endT) : Math.max(0, endT - menuBgm.origin);
  menuBgm.pausedAt = endT;
  menuBgm.voices.slice().forEach(v => menuRetireVoice(v));
  menuBgm.active = false;
  menuBgm.currentKey = null;
}

function menuStop() {
  menuBgm.opToken++;
  menuBgm.pendingKey = null;
  menuBgm.voices.slice().forEach(v => {
    v.stopping = true;
    try { v.src.stop(); } catch(e) {}
  });
  menuBgm.active = false;
  menuBgm.currentKey = null;
  menuBgm.pausedPos = null;
}

/* 拍号/循环区间变化：按新区间在同一音乐位置重建当前轨（0.5s 自身交叉淡化） */
function menuResyncGrid() {
  if (!menuBgm.active || !audioCtx) return;
  const cur = menuBgm.currentKey;
  const buf = cur ? menuBgm.buffers[cur] : null;
  if (!buf) return;
  const lp = menuLoopParams(buf, cur);
  const ls = Math.min(lp.startSec, Math.max(0, buf.duration - 0.02));
  const le = Math.min(lp.endSec, buf.duration);
  const live = menuBgm.voices.find(v => v.key === cur && !v.stopping);
  if (live && Math.abs(live.loopStart - ls) < 0.001 && Math.abs(live.loopEnd - le) < 0.001) return;
  if (live) menuRetireVoice(live);
  menuVoiceRamp(menuSpawnVoice(cur, buf, audioCtx.currentTime + 0.03), menuTrimFor(cur), MENU_FADE_SEC);
}

let menuReloadTimer = null;
function menuScheduleReload() {
  if (menuReloadTimer) clearTimeout(menuReloadTimer);
  menuReloadTimer = setTimeout(async () => {
    menuReloadTimer = null;
    const key = menuBgm.currentKey;
    if (!key || !menuBgm.active) return;
    delete menuBgm.buffers[key];
    menuBgm.uploadedKeys.delete(key);
    const buf = await menuLoadBuffer(key);
    if (!buf || key !== menuBgm.currentKey || !menuBgm.active) return;
    // BPM 变化后旧的时间原点失去意义：从整曲起点重新开始
    menuBgm.voices.slice().forEach(v => menuRetireVoice(v));
    const startAt = audioCtx.currentTime + 0.03;
    menuBgm.origin = startAt;
    menuVoiceRamp(menuSpawnVoice(key, buf, startAt), menuTrimFor(key), MENU_FADE_SEC);
  }, 250);
}

function updateWelcomeTrackIfNeeded() {
  if (!menuBgm.active || currentView !== 'welcome') return;
  const key = getWelcomeTrackKey();
  if (key !== menuBgm.currentKey) menuStartOrSwitch(key);
}

/* ---------- 音乐设置（现已停用） ---------- */
function renderBgmEngineConsole() {
  const box = document.getElementById('bgmEngineConsole');
  if (!box) return;
  const trimRows = MENU_TRACK_KEYS.map(k =>
    '<div class="trim-row">' +
      '<span class="trim-name">' + MENU_TRACK_META[k].name + '</span>' +
      '<input type="range" min="0" max="2" step="0.05" value="' + menuCfg.gainTrims[k] + '" oninput="menuTrimChange(\'' + k + '\', this.value)">' +
      '<span class="trim-val" id="trim-val-' + k + '">' + Number(menuCfg.gainTrims[k]).toFixed(2) + '</span>' +
    '</div>').join('');
  box.innerHTML =
    '<div class="engine-row">' +
      '<label>菜单池启用</label>' +
      '<label style="display:flex; align-items:center; gap:6px; font-weight:600;"><input type="checkbox" id="cfgMenuEnabled" ' + (menuCfg.enabled ? 'checked' : '') + ' onchange="menuEnabledChange(this.checked)"> 播放菜单同拍 BGM</label>' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>菜单池 BPM（9 套严格同拍）</label>' +
      '<span style="display:flex; align-items:center; gap:8px;"><input type="range" min="80" max="180" step="1" value="' + menuCfg.bpm + '" oninput="menuBpmChange(this.value)"><span class="engine-val" id="cfgMenuBpmVal">' + menuCfg.bpm + '</span></span>' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>拍号设置</label>' +
      '<select onchange="menuMeterChange(this.value)" style="padding:4px 8px; font-weight:700; background:#f8fafc; color:#1e293b; border:1px solid #cbd5e1;">' +
        '<option value="3"' + (menuCfg.beatsPerBar === 3 ? ' selected' : '') + '>3/4 拍</option>' +
        '<option value="4"' + (menuCfg.beatsPerBar === 4 ? ' selected' : '') + '>4/4 拍</option>' +
      '</select>' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>循环起点拍数</label>' +
      '<input type="number" min="1" max="16" value="' + menuCfg.loopStartBeat + '" onchange="menuLoopChange(\'loopStartBeat\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>循环终点拍数</label>' +
      '<input type="number" min="16" max="128" value="' + menuCfg.loopEndBeat + '" onchange="menuLoopChange(\'loopEndBeat\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>过门衔接提前量（拍）</label>' +
      '<input type="number" min="0" max="4" step="0.5" value="' + menuCfg.transitionLeadBeats + '" onchange="menuLoopChange(\'transitionLeadBeats\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>战斗池基础 BPM（前 7 套）</label>' +
      '<span style="display:flex; align-items:center; gap:8px;"><input type="range" min="80" max="180" step="1" value="' + menuCfg.battleBaseBpm + '" oninput="battleBpmChange(\'base\', this.value)"><span class="engine-val" id="cfgBattleBaseBpmVal">' + menuCfg.battleBaseBpm + '</span></span>' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>战斗池第 8 套 BPM</label>' +
      '<span style="display:flex; align-items:center; gap:8px;"><input type="range" min="80" max="180" step="1" value="' + menuCfg.battleSet8Bpm + '" oninput="battleBpmChange(\'set8\', this.value)"><span class="engine-val" id="cfgBattleSet8BpmVal">' + menuCfg.battleSet8Bpm + '</span></span>' +
    '</div>' +
    '<div class="engine-row">' +
      '<label>战斗池过门衔接提前量（拍）</label>' +
      '<input type="number" min="0" max="4" step="0.5" value="' + menuCfg.battleTransitionLeadBeats + '" onchange="menuLoopChange(\'battleTransitionLeadBeats\', this.value)" style="width:70px; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px;">' +
    '</div>' +
    '<div style="margin-top:12px; font-weight:800; font-size:13px; color:#475569;">逐轨独立增益补偿（Gain Trim）</div>' +
    '<div class="trim-grid">' + trimRows + '</div>' +
    '<div style="margin-top:10px; font-size:12px; color:#94a3b8;">提示：请在「选择要维护的音乐套数」中选择「菜单配乐套」上传 9 首配乐（欢迎 6 轨 + 历史/档案/设置 3 轨，须严格同 BPM、同拍号）；页面切换与最高分位数跃迁时做 0.5s 同拍交叉淡化，所有轨共享同一音乐时间原点；进入比赛页时记录断点，返回后从断点续播。建议上传 OGG 或 WAV：MP3 编码会在首尾补静音，循环接缝处会出现小空拍。未上传的轨由内置合成器自动兜底，全静音状态下教学功能照常运行。</div>';
}

function menuEnabledChange(v) {
  menuCfg.enabled = v; saveMenuCfg();
  if (!v) menuStop();
  else if (bgmEngine.state === 'IDLE') menuStartOrSwitch(getMenuTrackKeyForView(currentView));
}
function menuBpmChange(v) {
  menuCfg.bpm = Number(v); saveMenuCfg();
  const el = document.getElementById('cfgMenuBpmVal'); if (el) el.innerText = v;
  if (menuBgm.active) menuScheduleReload();
}
function menuMeterChange(v) {
  menuCfg.beatsPerBar = Number(v); saveMenuCfg();
  if (menuBgm.active) menuResyncGrid();
}
function menuLoopChange(field, v) {
  menuCfg[field] = Number(v); saveMenuCfg();
  if (menuBgm.active) menuResyncGrid();
}
function menuTrimChange(k, v) {
  menuCfg.gainTrims[k] = Number(v); saveMenuCfg();
  if (menuBgm.active && audioCtx) {
    menuBgm.voices.forEach(vo => { if (vo.key === k && !vo.stopping) menuVoiceRamp(vo, menuTrimFor(k), 0.08); });
  }
  const el = document.getElementById('trim-val-' + k); if (el) el.innerText = Number(v).toFixed(2);
}
function battleBpmChange(which, v) {
  if (which === 'base') { menuCfg.battleBaseBpm = Number(v); const el = document.getElementById('cfgBattleBaseBpmVal'); if (el) el.innerText = v; }
  else { menuCfg.battleSet8Bpm = Number(v); const el = document.getElementById('cfgBattleSet8BpmVal'); if (el) el.innerText = v; }
  saveMenuCfg();
}

/* ---------- 抽签长串长音效（roll_loop） ---------- */
let rollLoopNode = null;
let rollLoopGain = null;

function makeRollLoopBuffer() {
  if (!audioCtx) return null;
  const sr = audioCtx.sampleRate;
  const dur = 0.5;
  const buf = audioCtx.createBuffer(1, Math.floor(sr * dur), sr);
  const d = buf.getChannelData(0);
  const steps = 8;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const step = Math.floor(t / (dur / steps));
    const inStep = t - step * (dur / steps);
    if (inStep < 0.03) {
      d[i] = (Math.random() * 2 - 1) * (1 - inStep / 0.03) * 0.6;
    } else {
      d[i] = (Math.random() * 2 - 1) * 0.08;
    }
  }
  return buf;
}

function startRollLoop() {
  if (!audioCtx) return;
  try {
    const buffer = selectFxBuffer('roll_loop') || makeRollLoopBuffer();
    if (!buffer) return;
    rollLoopGain = audioCtx.createGain();
    rollLoopGain.connect(getFxOutputV2176());
    const now = audioCtx.currentTime;
    rollLoopGain.gain.setValueAtTime(0, now);
    rollLoopGain.gain.linearRampToValueAtTime(0.5, now + 0.05);
    rollLoopNode = audioCtx.createBufferSource();
    rollLoopNode.buffer = buffer;
    rollLoopNode.loop = true;
    rollLoopNode.connect(rollLoopGain);
    rollLoopNode.start(now);
  } catch(e) {}
}

function stopRollLoop(cb) {
  if (!rollLoopNode || !audioCtx) { if (cb) cb(); return; }
  try {
    const now = audioCtx.currentTime;
    rollLoopGain.gain.cancelScheduledValues(now);
    rollLoopGain.gain.setValueAtTime(Math.max(0.0001, rollLoopGain.gain.value || 0.5), now);
    rollLoopGain.gain.linearRampToValueAtTime(0.0001, now + 0.1);
  } catch(e) {}
  setTimeout(() => {
    try { rollLoopNode.stop(); } catch(e) {}
    rollLoopNode = null;
    rollLoopGain = null;
    if (cb) cb();
  }, 160);
}


/* ---------- 界面壁纸（独立 IndexedDB，避免混入音频包导出） ---------- */
const UI_DB_NAME = 'PoliticsUiDB';
let uiDbPromise = null;
function uiDbOpen() {
  if (uiDbPromise) return uiDbPromise;
  uiDbPromise = new Promise(res => {
    try {
      const r = indexedDB.open(UI_DB_NAME, 1);
      r.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv');
      };
      r.onsuccess = e => res(e.target.result);
      r.onerror = () => res(null);
    } catch (_) { res(null); }
  });
  return uiDbPromise;
}
async function uiDbReq(mode, fn) {
  const d = await uiDbOpen();
  if (!d) return null;
  return new Promise(res => {
    try {
      const tx = d.transaction('kv', mode);
      const req = fn(tx.objectStore('kv'));
      req.onsuccess = () => res(req.result === undefined ? null : req.result);
      req.onerror = () => res(null);
    } catch (_) { res(null); }
  });
}

let wallpaperUrl = null;
function getWallVeil() {
  const v = Number(STORAGE.get('politics_wall_veil', 0.35));
  return Number.isFinite(v) ? Math.max(0, Math.min(0.8, v)) : 0.35;
}
function applyWallpaperVeil() {
  const root = document.documentElement;
  const a = wallpaperUrl ? getWallVeil() : 0;
  root.style.setProperty('--ui-wall-veil', `linear-gradient(rgba(243,247,246,${a}), rgba(243,247,246,${a}))`);
  const label = document.getElementById('wallVeilLabel');
  if (label) label.innerText = Math.round(getWallVeil() * 100) + '%';
  const range = document.getElementById('cfgWallVeil');
  if (range) { range.value = getWallVeil(); range.disabled = !wallpaperUrl; }
}
function applyWallpaper(blob) {
  const root = document.documentElement;
  if (wallpaperUrl) { URL.revokeObjectURL(wallpaperUrl); wallpaperUrl = null; }
  if (blob) {
    wallpaperUrl = URL.createObjectURL(blob);
    root.style.setProperty('--ui-wall', `url("${wallpaperUrl}")`);
  } else {
    root.style.removeProperty('--ui-wall');
  }
  const st = document.getElementById('wallpaperStatus');
  if (st) st.innerText = blob ? '当前：自定义壁纸' : '当前：内置极光';
  applyWallpaperVeil();
}
async function compressWallpaper(file) {
  const MAX_EDGE = 2560;
  let img;
  if (window.createImageBitmap) {
    img = await createImageBitmap(file);
  } else {
    img = await new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const im = new Image();
      im.onload = () => { URL.revokeObjectURL(url); res(im); };
      im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('decode')); };
      im.src = url;
    });
  }
  const w0 = img.width, h0 = img.height;
  const scale = Math.min(1, MAX_EDGE / Math.max(w0, h0));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w0 * scale));
  canvas.height = Math.max(1, Math.round(h0 * scale));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if (img.close) img.close();
  return new Promise(res => canvas.toBlob(b => res(b), 'image/jpeg', 0.85));
}
async function onWallpaperFile(input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;
  if (!/^image\//.test(file.type)) { showToast('请选择图片文件'); return; }
  try {
    showToast('正在处理壁纸…');
    const blob = await compressWallpaper(file);
    if (!blob) throw new Error('encode');
    const saved = await uiDbReq('readwrite', st => st.put(blob, 'wallpaper'));
    applyWallpaper(blob);
    showToast(saved === null ? '壁纸已应用，但本机存储失败，刷新后会恢复极光' : `壁纸已保存（${Math.round(blob.size / 1024)} KB）`);
  } catch (e) {
    showToast('这张图片无法读取，换一张试试');
  }
}
async function resetWallpaper() {
  await uiDbReq('readwrite', st => st.delete('wallpaper'));
  applyWallpaper(null);
  showToast('已恢复内置极光壁纸');
}
function changeWallpaperVeil(v) {
  STORAGE.set('politics_wall_veil', Number(v));
  applyWallpaperVeil();
}
async function initWallpaper() {
  const b = await uiDbReq('readonly', st => st.get('wallpaper'));
  applyWallpaper(b instanceof Blob ? b : null);
}
window.addEventListener('DOMContentLoaded', initWallpaper);

window.addEventListener('DOMContentLoaded', () => {
  if (state.zoomLevel !== 1.0) {
    document.body.style.zoom = state.zoomLevel;
  }
  initResizerDrag();
  renderAll();
  renderWelcomePage();
  startWelcomeClock();

  // ===== 滑动解锁入场与音频启动 =====
  // 欢迎弹窗已被独立的 SVG 入场动画替代；首次解锁手势由 WelcomeV2 处理。

  window.hideAudioHint = () => {
    const bar = document.getElementById('audioHintBar');
    if (bar) bar.style.display = 'none';
  };
  window.tryAutoResumeAndPlay = () => {
    getAudioContext().then(() => {
      if (audioCtx && audioCtx.state === 'running' && menuCfg.enabled && bgmEngine.state === 'IDLE' && !menuBgm.active && currentView !== 'battle') {
        menuStartOrSwitch(getMenuTrackKeyForView(currentView));
        hideAudioHint();
      }
    }).catch(() => {});
  };
  // 关闭弹窗后启动重试兜底：每秒尝试恢复，连续 3 次失败（约 3 秒）显示提示条
  let autoPlayRetries = 0;
  let resumeRetryTimer = null;
  window.startResumeRetry = () => {
    if (resumeRetryTimer) return;
    resumeRetryTimer = setInterval(() => {
      if (audioCtx && audioCtx.state === 'running') {
        clearInterval(resumeRetryTimer); resumeRetryTimer = null;
        hideAudioHint();
        return;
      }
      autoPlayRetries++;
      if (autoPlayRetries === 3) {
        const bar = document.getElementById('audioHintBar');
        if (bar && currentView !== 'battle') bar.style.display = 'block';
      }
      if (autoPlayRetries > 30) { clearInterval(resumeRetryTimer); resumeRetryTimer = null; return; }
      tryAutoResumeAndPlay();
    }, 1000);
  };
  window.closeWelcomeModal = () => {
    const m = document.getElementById('welcomeModal');
    if (m) hideClassroomWindow(m);
    hideAudioHint();
    startResumeRetry();
    tryAutoResumeAndPlay();
  };

  // 首次手势兜底：任意点击/按键/触摸即恢复音频并启动当前页面菜单配乐（欢迎弹窗未关闭时不启动）
  const unlockByGesture = () => {
    getAudioContext().then(() => {
      hideAudioHint();
      const wm = document.getElementById('welcomeModal');
      if (wm && wm.classList.contains('active')) return;
      startResumeRetry();
      if (menuCfg.enabled && bgmEngine.state === 'IDLE' && currentView !== 'battle') {
        if (!menuBgm.active) menuStartOrSwitch(getMenuTrackKeyForView(currentView));
      }
    }).catch(() => {});
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, unlockByGesture, { once: true, passive: true })
  );

  initDB().then(() => {
    scheduleIdleTask(() => preloadInitialAudio(), 800);
    // 后台预加载全部菜单配乐：消除首次切页的加载延迟，保证任意页面切换即时无缝过渡
    scheduleIdleTask(() => {
      if (menuCfg.enabled && typeof MENU_TRACK_KEYS !== 'undefined') {
        MENU_TRACK_KEYS.forEach(k => { menuLoadBuffer(k).catch(() => {}); });
      }
    }, 1000);
  });
});

/* ================= 道具系统 V1 ================= */
const ITEM_DEFS = {
  green:{name:'绿龟壳',icon:'🟢',kind:'attack',def:'green',charges:1,desc:'随机攻击其他小组 -1/4；可抵挡常规攻击与刺龟壳。'},
  triple_green:{name:'三重绿龟壳',icon:'🟢³',kind:'attack',def:'green',charges:3,desc:'可分 3 次攻击/防御，每次 -1/4。'},
  red:{name:'红龟壳',icon:'🔴',kind:'attack',def:'red',charges:1,desc:'攻击排名正上方一组 -1/3；可抵挡常规攻击。'},
  triple_red:{name:'三重红龟壳',icon:'🔴³',kind:'attack',def:'red',charges:3,desc:'3 次红龟壳攻击/常规防御。'},
  spiny:{name:'刺龟壳',icon:'🔵',kind:'attack',charges:1,desc:'攻击当前榜首 -1/2；仅特殊防御可化解。'},
  banana:{name:'香蕉皮',icon:'🍌',kind:'attack',def:'yellow',charges:1,desc:'攻击排名正下方一组 -1/4；可抵挡常规攻击。'},
  triple_banana:{name:'三重香蕉皮',icon:'🍌³',kind:'attack',def:'yellow',charges:3,desc:'3 次向后攻击/常规防御。'},
  horn:{name:'超级喇叭',icon:'📣',kind:'attack',def:'orange',charges:1,desc:'上下相邻组各 -1/4；可抵挡任意攻击。'},
  bomb:{name:'炸弹兵',icon:'💣',kind:'attack',charges:1,desc:'随机目标及实际存在的相邻组各 -1/4。'},
  hammer:{name:'锤子',icon:'🔨',kind:'attack',charges:1,desc:'随机攻击 3 个不同小组，各 -1/4。'},
  coin:{name:'金币',icon:'🪙',kind:'boost',charges:1,desc:'自身 +2 分。'},
  coin_shell:{name:'金币龟壳',icon:'🟡',kind:'boost',charges:1,desc:'自身及所有领先组各 +1/4。'},
  question:{name:'？砖块',icon:'❓',kind:'boost',charges:1,desc:'自身及所有落后组各 +1/4。'},
  mushroom:{name:'蘑菇',icon:'🍄',kind:'boost',charges:1,desc:'自身 +1/4；刺龟壳来袭时可主动闪避。'},
  triple_mushroom:{name:'三重蘑菇',icon:'🍄³',kind:'boost',charges:3,desc:'3 次 +1/4，也可分次主动闪避刺龟壳。'},
  boo:{name:'害羞幽灵',icon:'👻',kind:'tactic',charges:1,desc:'偷取正上方对手最新获得的道具；若无可偷目标则获得一个蘑菇，并获得持续 3 次答题的攻击防护。'},
  blooper:{name:'鱿鱿',icon:'🦑',kind:'tactic',charges:1,desc:'全场比分遮蔽 2 分钟，显示为 ???。'},
  lightning:{name:'闪电',icon:'⚡',kind:'tactic',charges:1,desc:'劈中所有排名高于自己的小组：各降低当前分数 1/2，并清空全部道具与强力蘑菇效果；无敌星、巨大蘑菇和害羞幽灵保护可阻挡。'},
  star:{name:'无敌星',icon:'⭐',kind:'status',charges:1,desc:'占据主要道具栏直到状态结束，抵挡接下来 3 次攻击；超车时压制被超组 -1/4。'},
  mega:{name:'巨大蘑菇',icon:'🍄‍🟫',kind:'status',charges:1,desc:'占槽持续，抵挡 3 次攻击；超车时压制被超组 -1/4。'},
  bullet:{name:'炮弹刺客',icon:'🚀',kind:'instant',charges:1,desc:'瞬间超越前方 3 名：分数直接变为目标名次的分数 +1；若前方不足 3 名，则直接超过当前第一名。'},
  power:{name:'强力蘑菇',icon:'🌟🍄',kind:'status',charges:1,desc:'持续 3 次答题；答对后在常规结算后提升一名，答错也会消耗 1 次。'},

  /* V2.17.19：扩展道具必须在第一次 ensureItemState() 之前注册。
     否则重进页面时会被当成未知库存项清理；旧版还会错误兜底成金币。 */
  feather:{name:'羽毛',icon:'🪶',kind:'tactic',charges:1,slots:1,desc:'高高跃起闪避攻击。主动使用后获得 1 次任意外部攻击闪避，触发后消失。'},
  fire_flower:{name:'火之花',icon:'🌼',kind:'attack',charges:3,slots:1,desc:'3 发火球。每次随机命中一个其他小组，使其当前积分减少 1/4；3 发耗尽后释放槽位。'},
  ice_flower:{name:'冰之花',icon:'❄️',kind:'attack',charges:3,slots:1,desc:'3 发冰球。每次随机命中一个其他小组，扣除当前积分 1/5，并冻结其主动道具；使用道具时立即解除，若不使用则 3 次答题后自动解除。'},
  boomerang_flower:{name:'回旋镖花',icon:'🪃',kind:'attack',charges:3,slots:1,desc:'3 次回旋镖。每次命中当前排名紧邻自己的上一组和下一组，各扣当前积分 1/5。'}
};
let ITEM_KEYS = Object.keys(ITEM_DEFS);
const ITEM_DEFENSE_KEYS = new Set(['green','triple_green','red','triple_red','banana','triple_banana','horn']);
let activeItemGroupId = null, activeItemTab = 'detail', itemDrawBusy = false, bulletTimer = null;

/* V2.17.18：统一库存规范化。
   无效/旧版未知道具直接丢弃，不再错误替换成金币；
   同一小组同种道具只保留最早的一件。 */
function normalizeInventoryV21718(inventory){
  const seen=new Set();
  return (Array.isArray(inventory)?inventory:[])
    .slice(0,3)
    .filter(it=>{
      const key=it&&it.key;
      if(!ITEM_DEFS[key] || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((it,i)=>{
      const maxCharges=Math.max(1,Number(ITEM_DEFS[it.key]?.charges)||1);
      const storedCharges=Number(it.charges);
      const charges=Number.isFinite(storedCharges)
        ? Math.max(1,Math.min(maxCharges,Math.trunc(storedCharges))) : maxCharges;
      const acquiredAt=Number(it.acquiredAt)||Date.now()+i;
      if(Object.keys(it).length===3 && it.charges===charges && it.acquiredAt===acquiredAt)return it;
      return {key:it.key,charges,acquiredAt};
    });
}

function ensureItemState(){
  state.groups.forEach(g=>{
    if(!Array.isArray(g.inventory)) g.inventory=[];
    g.inventory=normalizeInventoryV21718(g.inventory);
    if(!g.itemStats||typeof g.itemStats!=='object') g.itemStats={correct:0,wrong:0,draws:0,used:0};
    if(!g.itemEffect||typeof g.itemEffect!=='object') g.itemEffect=null;
    if(!Number.isFinite(g.booShield)) g.booShield=0;
  });
  if(!state.itemGlobal||typeof state.itemGlobal!=='object') state.itemGlobal={blooperUntil:0,totalDraws:0};
}
ensureItemState();

function ranking(){return state.groups.slice().sort((a,b)=>(Number(b.score)||0)-(Number(a.score)||0)||state.groups.indexOf(a)-state.groups.indexOf(b));}
function rankIndex(id){return ranking().findIndex(g=>g.id===id);}
function roundQuarter(v){return Math.round((Number(v)||0)/4)}
function roundThird(v){return Math.round((Number(v)||0)/3)}
function roundHalf(v){return Math.round((Number(v)||0)/2)}
function eligibleForItems(g){return g && Number(g.score)>=0}
function consumeInventoryItem(g,index,amount=1){const it=g.inventory[index];if(!it)return;it.charges-=amount;if(it.charges<=0)g.inventory.splice(index,1)}
function addItemToGroup(g,key){if(!g||!ITEM_DEFS[key]||g.inventory.length>=3||!eligibleForItems(g))return false;g.inventory.push({key,charges:ITEM_DEFS[key].charges,acquiredAt:Date.now()+Math.random()});g.itemStats.draws++;state.itemGlobal.totalDraws++;return true}
function tinyDefenseToast(msg){const d=document.createElement('div');d.className='item-defense-toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),1900)}

function defenseCandidates(g,attackType){
  const out=[];
  if(g.itemEffect&&['star','mega','bullet'].includes(g.itemEffect.type)) out.push({type:'effect',idx:-1,key:g.itemEffect.type});
  if(g.booShield>0) out.push({type:'boo',idx:-1,key:'boo'});
  {
    const it=g.inventory[0],idx=0;
    if(it&&ITEM_DEFENSE_KEYS.has(it.key)){
      if(!(attackType==='spiny'&&!['green','triple_green','horn'].includes(it.key))){
        out.push({type:'inventory',idx,key:it.key,at:it.acquiredAt||0});
      }
    }
  }
  out.sort((a,b)=>{if(a.type==='effect')return -1;if(b.type==='effect')return 1;if(a.type==='boo')return -1;if(b.type==='boo')return 1;return (a.at||0)-(b.at||0)});
  return out;
}


function damageFraction(target,denom,sourceId,type='normal'){const loss=denom===2?roundHalf(target.score):denom===3?roundThird(target.score):roundQuarter(target.score);return applyItemScore(target,-loss,sourceId,type)}
function boostFraction(target,denom=4){if(!eligibleForItems(target))return false;const add=denom===4?roundQuarter(target.score):Math.round(target.score/denom);target.score+=add;target.displayScore=target.score;return true}

function itemDropWeights(pos,total){
  // V2.11.9：26 种道具全部正式接入排名权重池。
  // 依据 24人 / 12人道具分布图做百分位映射：
  // 1 位偏防守与基础道具，中游最丰富，后排逐渐增加追赶型与高影响道具。
  const p=total<=1?1:(pos-1)/(total-1), virtual=1+p*23;
  const W={}; const put=(k,w)=>{W[k]=w};

  if(virtual<=5){
    // 领先区：基础、防守、轻攻击为主。
    put('coin',18);
    put('green',18);
    put('banana',18);
    put('question',10);
    put('red',virtual>=2?12:0);
    put('horn',virtual>=3?7:0);
    put('bomb',virtual>=3?7:0);
    put('hammer',virtual>=3?5:0);
    put('mushroom',virtual>=3?7:0);
    put('triple_green',virtual>=4?4:0);
    put('triple_red',virtual>=4?3:0);
    put('triple_banana',virtual>=4?4:0);

    // 新四道具：前排可少量出现羽毛 / 火之花。
    put('feather',virtual>=2?5:2);
    put('fire_flower',virtual>=4?4:0);
    put('ice_flower',0);
    put('boomerang_flower',virtual>=4?3:0);
  }
  else if(virtual<=16){
    // 中游区：道具种类最丰富，攻击、防守、控场均有。
    put('green',8);
    put('banana',8);
    put('red',14);
    put('triple_red',8);
    put('triple_green',7);
    put('triple_banana',7);
    put('horn',10);
    put('bomb',10);
    put('hammer',8);
    put('mushroom',14);
    put('triple_mushroom',8);
    put('boo',7);
    put('blooper',7);
    put('coin_shell',7);
    put('question',7);
    put('mega',virtual>=11?4:1);
    put('power',virtual>=11?5:2);

    // 新四道具在中游成为主要常规奖池成员。
    put('feather',8);
    put('fire_flower',11);
    put('ice_flower',virtual>=10?9:6);
    put('boomerang_flower',10);
  }
  else{
    // 落后区：追赶型、控场型、高影响道具权重增加。
    put('mushroom',12);
    put('triple_mushroom',15);
    put('boo',10);
    put('blooper',10);
    put('spiny',virtual<=21?9:5);
    put('lightning',virtual>=19?12:7);
    put('star',13);
    put('mega',12);
    put('bullet',virtual>=19?17:10);
    put('power',14);
    put('horn',6);
    put('bomb',5);
    put('hammer',4);
    put('red',5);
    put('question',7);

    // 新四道具：后排减少羽毛，增加冰花；火花/回旋镖保留中等追赶能力。
    put('feather',5);
    put('fire_flower',8);
    put('ice_flower',11);
    put('boomerang_flower',8);
  }

  // 前 20% 继续严格屏蔽最强追赶道具。
  if(p<.20){
    W.spiny=0;
    W.lightning=0;
    W.star=0;
    W.bullet=0;
    W.power=0;
  }

  return W;
}
function weightedPick(weights){const arr=Object.entries(weights).filter(([,w])=>w>0);let sum=arr.reduce((a,[,w])=>a+w,0),r=Math.random()*sum;for(const [k,w] of arr){r-=w;if(r<=0)return k}return arr[0]?.[0]||'coin'}
function drawItemForGroup(g){if(!eligibleForItems(g)||g.inventory.length>=3)return null;const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;return weightedPick(itemDropWeights(pos,r.length))}

function detectOvertakePunish(actorId,beforeOrder){
  const actor=state.groups.find(g=>g.id===actorId);if(!actor||!actor.itemEffect||!['star','mega'].includes(actor.itemEffect.type))return;
  const after=ranking().map(g=>g.id),beforeIdx=beforeOrder.indexOf(actorId),afterIdx=after.indexOf(actorId);if(afterIdx<0||beforeIdx<0||afterIdx>=beforeIdx)return;
  const passed=beforeOrder.slice(afterIdx,beforeIdx).filter(id=>id!==actorId);
  passed.forEach(id=>{const t=state.groups.find(g=>g.id===id);if(t&&eligibleForItems(t)&&!tryDefend(t,'normal')){t.score-=roundQuarter(t.score);t.displayScore=t.score}});
}
function legacyUseItem(groupId,index){
  ensureItemState();const g=state.groups.find(x=>x.id===groupId);
  // V2.11.1：点击“使用”后立即关闭道具窗口；后续即使条件不满足也不会停留在窗口。
  closeItemWindowForFx();if(!g)return;if(!eligibleForItems(g)){showToast('负分保护：该组不能使用道具');return}const it=g.inventory[index];if(!it)return;const key=it.key,d=ITEM_DEFS[key],r=ranking(),ri=r.findIndex(x=>x.id===g.id),before=r.map(x=>x.id);
  if(d.kind==='status'&&g.itemEffect){showToast('已有持续型状态，当前不能激活新的持续道具');return}
  recordHistory(`${g.name} 使用道具：${d.name}`);let used=true;
  const other=()=>state.groups.filter(x=>x.id!==g.id&&eligibleForItems(x));
  if(key==='green'||key==='triple_green'){const pool=other();if(!pool.length)used=false;else damageFraction(pool[Math.floor(Math.random()*pool.length)],4,g.id,key)}
  else if(key==='red'||key==='triple_red'){const t=r[ri-1];if(!t||!eligibleForItems(t))used=false;else damageFraction(t,3,g.id,key)}
  else if(key==='spiny'){const t=r[0];if(!t||t.id===g.id||!eligibleForItems(t))used=false;else damageFraction(t,2,g.id,'spiny')}
  else if(key==='banana'||key==='triple_banana'){const t=r[ri+1];if(!t||!eligibleForItems(t))used=false;else damageFraction(t,4,g.id,key)}
  else if(key==='horn'){[r[ri-1],r[ri+1]].filter(Boolean).forEach(t=>damageFraction(t,4,g.id,key))}
  else if(key==='bomb'){const pool=other();if(!pool.length)used=false;else{const center=pool[Math.floor(Math.random()*pool.length)],ci=r.findIndex(x=>x.id===center.id);[r[ci-1],r[ci],r[ci+1]].filter(Boolean).forEach(t=>{if(t.id!==g.id){damageFraction(t,4,g.id,key);flashBomb(t.id)}})}}
  else if(key==='hammer'){const pool=other().sort(()=>Math.random()-.5).slice(0,3);if(!pool.length)used=false;else pool.forEach(t=>damageFraction(t,4,g.id,key))}
  else if(key==='coin'){g.score+=2;g.displayScore=g.score}
  else if(key==='coin_shell'){r.slice(0,ri+1).forEach(t=>boostFraction(t,4))}
  else if(key==='question'){r.slice(ri).forEach(t=>boostFraction(t,4))}
  else if(key==='mushroom'||key==='triple_mushroom'){boostFraction(g,4)}
  else if(key==='boo'){
    const t=r[ri-1];
    if(!t||!eligibleForItems(t)||!t.inventory.length){
      used=false;
    }else{
      // 害羞幽灵仍偷“最新获得”的道具，但不能把正在生效的卡手主要道具硬拔走。
      let stealIndex=t.inventory.length-1;
      if(stealIndex===0 && t.itemEffect?.type && t.inventory[0]?.key===t.itemEffect.type && ['star','mega','power'].includes(t.itemEffect.type)){
        stealIndex=-1;
      }
      if(stealIndex<0){
        used=false;
      }else{
        const stolen=t.inventory.splice(stealIndex,1)[0];
        consumeInventoryItem(g,index,1);
        g.inventory.push(stolen);
        g.booShield=1;
        g.itemStats.used++;
        saveState();renderAll();
        showToast(`${g.name} 偷走了 ${ITEM_DEFS[stolen.key].name}`);
        return
      }
    }
  }
  else if(key==='blooper'){state.itemGlobal.blooperUntil=Date.now()+120000;startBlooperClock()}
  else if(key==='lightning'){
    // V2.11.6：闪电攻击所有排名高于使用者的小组。
    // 仅无敌星 / 巨大蘑菇的持续状态可以阻挡。
    r.slice(0,ri).forEach(t=>applyLightningHitV2116(g,t));
  }
  else if(key==='star'){
    // V2.17.0：无敌星使用后立即离开主要道具栏，但 3 次防御状态继续存在。
    g.itemEffect={type:'star',hitsLeft:3,startedAt:Date.now()};
    consumeInventoryItem(g,index,1);
    g.itemStats.used++;
    detectOvertakePunish(g.id,before);
    saveState();renderAll();
    showToast(`${g.name} 使用了 ${d.name}，无敌状态持续生效，主要道具栏已释放`);
    return
  }
  else if(key==='mega'){g.itemEffect={type:'mega',hitsLeft:3,startedAt:Date.now()}}
  else if(key==='bullet'){
    // 瞬间超越前方 3 名；若前方不足 3 名，则直接冲到第一名之上。
    // 统一目标索引：正常为 ri-3，不足 3 名时钳制到第 1 名（索引 0）。
    const target=r[Math.max(0,ri-3)];
    if(!target){
      used=false;
    }else{
      g.score=Number(target.score)+1;
      g.displayScore=g.score;
      g.itemEffect=null;
    }
  }
  else if(key==='power'){g.itemEffect={type:'power',roundsLeft:5,startedAt:Date.now()}}
  if(!used){showToast('当前排名条件下无法使用这个道具');return}
  if(!['mega','power'].includes(key))consumeInventoryItem(g,index,1);
  g.itemStats.used++;detectOvertakePunish(g.id,before);saveState();renderAll();showToast(`${g.name} 使用了 ${d.name}`)
}
function flashBomb(id){setTimeout(()=>{const c=document.querySelector(`.group-row-card[data-group-id="${id}"]`);if(c){c.classList.add('effect-bomb');setTimeout(()=>c.classList.remove('effect-bomb'),900)}},30)}

function startBulletTimer(){if(bulletTimer)clearInterval(bulletTimer);bulletTimer=setInterval(()=>{let any=false;ensureItemState();state.groups.forEach(g=>{if(!g.itemEffect||g.itemEffect.type!=='bullet')return;any=true;const t=state.groups.find(x=>x.id===g.itemEffect.targetId);if(!t||rankIndex(g.id)<rankIndex(t.id)){const ix=g.inventory.findIndex(x=>x.key==='bullet');if(ix>=0)g.inventory.splice(ix,1);g.itemEffect=null;showToast(`${g.name} 的炮弹刺客追击完成`);return}if(eligibleForItems(g)){g.score+=1;g.displayScore=g.score}});if(!any){clearInterval(bulletTimer);bulletTimer=null}saveState();renderGrid();renderChart();renderDashboard()},350)}
function startBlooperClock(){applyBlooperMask();if(state.itemGlobal.blooperUntil>Date.now())setTimeout(startBlooperClock,500)}
function applyBlooperMask(){const on=(state.itemGlobal?.blooperUntil||0)>Date.now(),v=document.getElementById('squidVeil');if(v)v.classList.toggle('active',on);document.querySelectorAll('.row-score,.chart-score,.podium-score,.w-stat-num').forEach(el=>el.classList.toggle('squid-hidden-score',on))}

function globalItemDraw(){
  ensureItemState();if(itemDrawBusy)return;const eligible=state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3);if(!eligible.length){showToast('没有可参与抽取的小组（满背包或负分组会自动跳过）');return}recordHistory('全局道具抽取');itemDrawBusy=true;const ov=document.getElementById('itemDrawOverlay'),grid=document.getElementById('itemDrawGrid');ov.classList.add('active');grid.innerHTML=state.groups.map(g=>`<div class="item-draw-card ${eligible.includes(g)?'':'full'}" data-draw-id="${g.id}"><div class="roulette">${eligible.includes(g)?'❔':'🔒'}</div><div class="draw-name">${escapeHtml(g.name)}</div><div class="draw-result">${eligible.includes(g)?'抽取中…':'跳过'}</div></div>`).join('');
  const timer=setInterval(()=>{eligible.forEach(g=>{const k=ITEM_KEYS[Math.floor(Math.random()*ITEM_KEYS.length)],c=grid.querySelector(`[data-draw-id="${g.id}"] .roulette`);if(c)c.innerHTML=itemVisual(k)})},90);
  setTimeout(()=>{clearInterval(timer);eligible.forEach(g=>{const key=drawItemForGroup(g);if(key)addItemToGroup(g,key);const card=grid.querySelector(`[data-draw-id="${g.id}"]`);if(card&&key){card.classList.add('reveal');card.querySelector('.roulette').innerHTML=itemVisual(key);card.querySelector('.draw-result').textContent=ITEM_DEFS[key].name}});saveState();renderAll();setTimeout(()=>{ov.classList.remove('active');itemDrawBusy=false},3000)},3000)
}

function openItemWindow(groupId,tab='detail'){ensureItemState();activeItemGroupId=groupId;activeItemTab=tab;showClassroomWindow(document.getElementById('itemModalBackdrop'));renderItemWindow()}
function closeItemWindow(){hideClassroomWindow(document.getElementById('itemModalBackdrop'));activeItemGroupId=null}
function switchItemTab(tab){activeItemTab=tab;renderItemWindow()}
function renderItemWindow(){
  const g=state.groups.find(x=>x.id===activeItemGroupId);if(!g)return closeItemWindow();
  ensureGroupNumbersV213(false);
  document.getElementById('itemWindowTitle').textContent=g.name;
  document.querySelectorAll('[data-item-tab]').forEach(b=>b.classList.toggle('active',b.dataset.itemTab===activeItemTab));
  const body=document.getElementById('itemWindowBody'),locked=!!state.isLocked,disabled=locked?'disabled':'';
  if(activeItemTab==='detail'){
    const st=g.itemStats||{},total=(st.correct||0)+(st.wrong||0),rate=total?Math.round((st.correct||0)/total*100):0;
    const statusParts=[];
    if(g.itemEffect&&typeof g.itemEffect==='object'){
      const type=g.itemEffect.type;
      if(type){
        const def=ITEM_DEFS[type];
        if(def?.name) statusParts.push(def.name);
        else statusParts.push(String(type));
      }
      if(Number(g.itemEffect.featherDodge||0)>0){
        statusParts.push(`羽毛闪避 ×${Number(g.itemEffect.featherDodge||0)}`);
      }
      if(Number(g.itemEffect.iceLock||0)>0){
        statusParts.push('冰冻：下一次主动道具使用将被取消');
      }
      if(type==='star'&&Number(g.itemEffect.hitsLeft||0)>0){
        statusParts.push(`剩余防御 ${Number(g.itemEffect.hitsLeft||0)} 次`);
      }else if(type==='mega'&&Number(g.itemEffect.hitsLeft||0)>0){
        statusParts.push(`剩余防御 ${Number(g.itemEffect.hitsLeft||0)} 次`);
      }else if(type==='power'&&Number(g.itemEffect.roundsLeft||0)>0){
        statusParts.push(`剩余 ${Number(g.itemEffect.roundsLeft||0)} 轮`);
      }
    }
    if(Number(g.booShield||0)>0){
      statusParts.push(`害羞幽灵防护 ×${Number(g.booShield||0)}`);
    }
    const status=statusParts.length?statusParts.join(' · '):'无';
    body.innerHTML=`
      ${locked?'<div class="group-detail-lock">🔒 当前处于锁定状态，可查看信息，但不能编辑、赋分、使用道具或删除小组。</div>':''}
      <div class="item-stat-grid">
        <div class="item-stat"><b>${g.score}</b><span>当前积分</span></div>
        <div class="item-stat"><b>${rate}%</b><span>答题正确率</span></div>
        <div class="item-stat"><b>${st.wrong||0}</b><span>答错次数</span></div>
        <div class="item-stat"><b>${st.draws||0}</b><span>道具抽取</span></div>
      </div>
      <div class="group-detail-form">
        <section class="group-detail-section">
          <h4>基本信息</h4>
          <div class="group-detail-fields">
            <div class="group-detail-field"><label for="groupDetailNumber">小组编号</label><input id="groupDetailNumber" type="number" min="1" step="1" value="${g.groupNo}" ${disabled}></div>
            <div class="group-detail-field"><label for="groupDetailName">小组名称</label><input id="groupDetailName" type="text" value="${escapeHtml(g.name)}" ${disabled}></div>
          </div>
          <div class="group-detail-field group-color-field-v21716" style="margin-top:10px">
            <label>小组配色</label>
            <div class="group-color-preset-grid-v21716" role="group" aria-label="16种预设配色">
              ${DEFAULT_COLORS.map((color,idx)=>`<button type="button" class="group-color-swatch-v21716 ${String(g.color).toUpperCase()===color.toUpperCase()?'selected':''}" style="--swatch:${color}" title="预设 ${idx+1} · ${color}" ${disabled} onclick="selectGroupPresetColorV21716(${g.id},'${color}')"><span>${String(g.color).toUpperCase()===color.toUpperCase()?'✓':''}</span></button>`).join('')}
            </div>
            <div class="group-color-free-v21716">
              <div class="group-color-free-copy-v21716"><b>自由颜色</b><span>16 种预设之外，可自行选择任意颜色</span></div>
              <div class="group-color-control group-color-control-v21716">
                <input id="groupDetailColor" type="color" value="${g.color}" ${disabled} oninput="previewItemDetailColorV21716(this.value)" onchange="saveItemDetailColor(${g.id},this.value)">
                <span id="groupDetailColorPreview" class="group-color-preview" style="background:${g.color}"></span>
                <span id="groupDetailColorHexV21716">${escapeHtml(g.color.toUpperCase())}</span>
              </div>
            </div>
          </div>
        </section>
        <section class="group-detail-section">
          <h4>成员管理（每行一人，也支持逗号或顿号分隔）</h4>
          <div class="group-detail-field"><textarea id="groupDetailMembers" ${disabled}>${escapeHtml((g.members||[]).join('\n'))}</textarea></div>
        </section>
        <section class="group-detail-section"><h4>当前状态</h4><div>${escapeHtml(status)}</div></section>
        <div class="group-detail-actions"><button type="button" class="btn" onclick="renderItemWindow()" ${disabled}>放弃未保存修改</button><button type="button" class="btn btn-primary" onclick="saveItemGroupDetail(${g.id})" ${disabled}>保存更改</button></div>
        <section class="group-detail-section group-detail-danger"><h4>🧨 红色按钮区</h4><p>点下去以后，这组的积分、成员和道具会一起退场。系统不会替你假装刚才没看见。</p><button type="button" class="btn btn-danger" onclick="deleteItemDetailGroup(${g.id})" ${disabled}>删除小组</button></section>
      </div>`;
  }else if(activeItemTab==='items'){
    const canUse=!locked&&eligibleForItems(g);
    body.innerHTML=`${locked?'<div class="group-detail-lock">🔒 解锁后才能使用道具。</div>':''}<div class="item-inventory-grid">${[0,1,2].map(i=>{const it=g.inventory[i];if(!it)return '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div></div>';const d=ITEM_DEFS[it.key];return `<div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-name">${escapeHtml(d.name)}${it.charges>1?' ×'+it.charges:''}</div><div class="item-big-desc">${escapeHtml(d.desc)}</div><button class="btn btn-primary item-use" onclick="useItem(${g.id},${i})" ${canUse?'':'disabled'}>立即使用</button></div>`}).join('')}</div>${g.score<0?'<div style="margin-top:12px;color:#dc2626;font-weight:800;">负分保护生效：禁止使用或受到任何道具影响。</div>':''}`;
  }else{
    body.innerHTML=`${locked?'<div class="group-detail-lock">🔒 解锁后才能调整积分。</div>':''}<div class="item-score-panel">${ClassroomFeedback.slotMarkup('group',g.id,locked)}<input id="itemCustomScore" type="number" placeholder="自由增减" ${disabled}><button class="btn btn-primary" onclick="itemCustomScore(${g.id})" ${disabled}>应用</button></div>`;
  }
}
function previewItemDetailColor(value){const el=document.getElementById('groupDetailColorPreview');if(el)el.style.background=value}
function saveItemDetailColor(id,value){
  if(state.isLocked){renderItemWindow();return}
  if(!/^#[0-9a-f]{6}$/i.test(value))return;
  updateGroupColor(id,value);
  activeItemGroupId=id;activeItemTab='detail';renderItemWindow();
}
function saveItemGroupDetail(id){
  if(state.isLocked){openPwdModal();return}
  const g=state.groups.find(x=>x.id===id);if(!g)return;
  const name=document.getElementById('groupDetailName')?.value.trim()||'';
  const rawNo=document.getElementById('groupDetailNumber')?.value.trim()||'';
  if(!name){showToast('小组名称不能为空');return}
  if(!/^\d+$/.test(rawNo)||Number(rawNo)<=0){showToast('编号必须是正整数');return}
  const groupNo=Number(rawNo);
  if(state.groups.some(x=>x.id!==id&&Number(x.groupNo)===groupNo)){showToast('该编号已被其他小组使用');return}
  const rawMembers=document.getElementById('groupDetailMembers')?.value||'';
  const members=Array.from(new Set(rawMembers.split(/[\n,，、]+/).map(s=>s.trim()).filter(Boolean)));
  const changed=g.name!==name||Number(g.groupNo)!==groupNo||JSON.stringify(g.members||[])!==JSON.stringify(members);
  if(changed)recordHistory(`${g.name} 更新小组详情`);
  g.name=name;g.groupNo=groupNo;g.members=members;
  saveState();renderAll();updatePickerPoolUI();
  activeItemGroupId=id;activeItemTab='detail';renderItemWindow();showToast('小组详情已保存');
}
async function deleteItemDetailGroup(id){
  if(state.isLocked){openPwdModal();return}
  await deleteGroup(id);
  if(!state.groups.some(g=>g.id===id)){
    closeItemWindow();
  }else if(document.getElementById('itemWindow')?.classList.contains('active')){
    renderItemWindow();
  }
}
function itemQuickScore(id,d){if(state.isLocked){openPwdModal();return}applyScoreDelta(id,d);renderItemWindow()}
function itemCustomScore(id){const n=Number(document.getElementById('itemCustomScore').value);if(!Number.isFinite(n)||n===0)return;itemQuickScore(id,Math.round(n))}

function enhanceItemCards(){ensureItemState();state.groups.forEach(g=>{const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(!c)return;c.classList.remove('item-def-green','item-def-red','item-def-yellow','item-def-orange','effect-star','effect-mega','effect-power','effect-bullet','effect-boo','effect-ice');const firstDef=g.inventory.find(it=>ITEM_DEFS[it.key]?.def);if(firstDef)c.classList.add('item-def-'+ITEM_DEFS[firstDef.key].def);if(g.itemEffect?.type)c.classList.add('effect-'+g.itemEffect.type);if(g.itemEffect?.iceLock)c.classList.add('effect-ice');if(g.booShield>0)c.classList.add('effect-boo');const head=c.querySelector('.card-header-row');if(head&&!c.querySelector('.item-slots')){const slots=document.createElement('div');slots.className='item-slots';slots.innerHTML=[0,1,2].map(i=>{const it=g.inventory[i];return it?`<div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it.charges>1?`<span class="charges">${it.charges}</span>`:''}</div>`:'<div class="item-slot empty">＋</div>'}).join('');head.parentNode.insertBefore(slots,head.nextSibling)}const mb=c.querySelector('.more-btn');if(mb){mb.classList.remove('locked-disabled');mb.title='小组详情 / 道具 / 基础赋分';mb.onclick=(ev)=>{ev.preventDefault();ev.stopPropagation();openItemWindow(g.id)}}});applyBlooperMask()}


const _itemBaseJudgeRound=legacyJudgeRound;legacyJudgeRound=function(){if(!state.roundActive||state.evaluated||!state.correctAns)return false;const before=ranking().map(g=>g.id),answered=state.groups.map(g=>({id:g.id,answered:!!g.selectedOpt,correct:g.selectedOpt===state.correctAns}));_itemBaseJudgeRound();answered.forEach(x=>{const g=state.groups.find(q=>q.id===x.id);if(!g||!x.answered)return;if(x.correct)g.itemStats.correct++;else g.itemStats.wrong++;if(g.itemEffect&&g.itemEffect.type==='power'){g.itemEffect.roundsLeft--;if(x.correct&&eligibleForItems(g)){const r=ranking(),i=r.findIndex(q=>q.id===g.id);if(i>0){g.score=r[i-1].score+1;g.displayScore=g.score}}if(g.itemEffect&&g.itemEffect.roundsLeft<=0){const ix=g.inventory.findIndex(it=>it.key==='power');if(ix>=0)g.inventory.splice(ix,1);g.itemEffect=null}}detectOvertakePunish(g.id,before)});saveState();renderAll()};


const savedItemGlobal=STORAGE.getJSON('politics_item_global',null);if(savedItemGlobal)state.itemGlobal={...state.itemGlobal,...savedItemGlobal};




window.addEventListener('DOMContentLoaded',()=>{ensureItemState();renderAll();startBulletTimer();startBlooperClock()});


/* ===== 完整课堂版 V2 ===== */
let pickerInfoTab='history', handRaiseGroupId=null, pendingItemIconKey=null;
function ensureV2State(){
  ensureItemState();
  if(!state.itemGlobal.pickerHistory)state.itemGlobal.pickerHistory=[];
  if(!state.itemGlobal.handRaiseHistory)state.itemGlobal.handRaiseHistory=[];
  if(!state.itemGlobal.handRaiseTotal)state.itemGlobal.handRaiseTotal=0;
  if(!state.itemGlobal.pkTotal)state.itemGlobal.pkTotal=0;
  if(!state.itemGlobal.customIcons)state.itemGlobal.customIcons=STORAGE.getJSON('politics_item_icons',{});
}
const BUILTIN_ITEM_ICONS_V2121={"green":"@@RESOURCE:asset-000.txt@@","triple_green":"@@RESOURCE:asset-001.txt@@","red":"@@RESOURCE:asset-002.txt@@","triple_red":"@@RESOURCE:asset-003.txt@@","spiny":"@@RESOURCE:asset-004.txt@@","banana":"@@RESOURCE:asset-005.txt@@","triple_banana":"@@RESOURCE:asset-006.txt@@","horn":"@@RESOURCE:asset-007.txt@@","bomb":"@@RESOURCE:asset-008.txt@@","hammer":"@@RESOURCE:asset-009.txt@@","coin":"@@RESOURCE:asset-010.txt@@","coin_shell":"@@RESOURCE:asset-011.txt@@","question":"@@RESOURCE:asset-012.txt@@","mushroom":"@@RESOURCE:asset-013.txt@@","triple_mushroom":"@@RESOURCE:asset-014.txt@@","boo":"@@RESOURCE:asset-015.txt@@","blooper":"@@RESOURCE:asset-016.txt@@","lightning":"@@RESOURCE:asset-017.txt@@","star":"@@RESOURCE:asset-018.txt@@","mega":"@@RESOURCE:asset-019.txt@@","bullet":"@@RESOURCE:asset-020.txt@@","power":"@@RESOURCE:asset-021.txt@@","feather":"@@RESOURCE:asset-022.txt@@","fire_flower":"@@RESOURCE:asset-023.txt@@","ice_flower":"@@RESOURCE:asset-024.txt@@","boomerang_flower":"@@RESOURCE:asset-025.txt@@"};
const BUILTIN_ITEM_BOX_V2121="@@RESOURCE:asset-026.txt@@";
function itemVisual(key, cls=''){
  ensureV2State();
  const d=ITEM_DEFS[key], custom=state.itemGlobal.customIcons[key], builtin=BUILTIN_ITEM_ICONS_V2121[key];
  const src=Reliability.safeImage(custom)||builtin;
  return src?`<img class="${cls}" src="${escapeHtml(src)}" alt="${escapeHtml(d.name)}">`:d.icon;
}
function itemBoxVisualV2121(cls=''){
  return BUILTIN_ITEM_BOX_V2121?`<img class="${cls}" src="${BUILTIN_ITEM_BOX_V2121}" alt="道具箱">`:'❔';
}
function setPickerInfoTab(tab){pickerInfoTab=tab;document.getElementById('pickerStatsBtn')?.classList.toggle('active',tab==='stats');document.getElementById('pickerHistoryBtn')?.classList.toggle('active',tab==='history');renderPickerInfo()}
function renderPickerInfo(){
  ensureV2State();const box=document.getElementById('pickerInfoBox');if(!box)return;
  if(pickerInfoTab==='stats'){
    const a=state.groups.reduce((n,g)=>n+(g.itemStats?.correct||0)+(g.itemStats?.wrong||0),0);
    box.innerHTML=`<div class="guide-block"><b>课堂作答</b><br>${a} 次</div><div class="guide-block"><b>答题轮次</b><br>${state.itemGlobal.pkTotal||0} 轮</div><div class="guide-block"><b>全局道具发放</b><br>${state.itemGlobal.totalDraws||0} 件</div><div class="guide-block"><b>手动举手</b><br>${state.itemGlobal.handRaiseTotal||0} 次</div>`;
  }else{
    const arr=state.itemGlobal.pickerHistory||[];box.innerHTML=arr.length?arr.slice(-30).reverse().map(x=>`<div class="picker-log">${escapeHtml(x.text)}<br><small>${new Date(x.time).toLocaleTimeString()}</small></div>`).join(''):'暂无抽签记录';
  }
}
const _v2OpenPicker=openPickerModal;openPickerModal=function(){ensureV2State();pickerInfoTab='history';_v2OpenPicker();setPickerInfoTab('history');syncPickerScoreTarget()}
function syncPickerScoreTarget(){const el=document.getElementById('pickerScoreTarget'),w=slotEngine.chosenResult;if(!el)return;if(!w){el.textContent='抽中学生或小组后，可直接给所属小组赋分。';return}const g=state.picker.mode==='group'?w:w.group;el.innerHTML=`<b>${escapeHtml(g.name)}</b>${state.picker.mode==='group'?'':`<br>${escapeHtml(w.memberName)}`}<br>当前 ${g.score} 分`}
function pickerTargetGroup(){const w=slotEngine.chosenResult;if(!w)return null;return state.picker.mode==='group'?w:w.group}
function scorePickerTarget(n){const g=pickerTargetGroup();if(!g){showToast('请先完成一次抽签');return}applyScoreDelta(g.id,n);syncPickerScoreTarget()}
function scorePickerCustom(){const n=Math.round(Number(document.getElementById('pickerCustomScore')?.value));if(!Number.isFinite(n)||n===0)return;scorePickerTarget(n)}

/* 手动举手 */
function openHandRaise(){ensureV2State();handRaiseGroupId=null;showClassroomWindow(document.getElementById('handRaiseBackdrop'));renderHandRaise()}
function closeHandRaise(){hideClassroomWindow(document.getElementById('handRaiseBackdrop'))}
function renderHandRaise(){const box=document.getElementById('handGroupGrid');if(!box)return;box.innerHTML=state.groups.map(g=>`<button class="hand-group ${g.id===handRaiseGroupId?'selected':''}" onclick="selectHandGroup(${g.id})">${escapeHtml(g.name)}<br><small>${g.score} 分</small></button>`).join('');document.getElementById('handRewardBox').innerHTML=''}
function selectHandGroup(id){handRaiseGroupId=id;renderHandRaise();document.querySelectorAll('.hand-group').forEach(b=>b.classList.remove('selected'));const arr=[...document.querySelectorAll('.hand-group')],idx=state.groups.findIndex(g=>g.id===id);if(arr[idx])arr[idx].classList.add('selected')}
function judgeHandRaise(correct){
  ensureV2State();const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!g){showToast('先选择举手小组');return}
  recordHistory(`${g.name} 手动举手：${correct?'正确':'错误'}`);g.itemStats.correct+=(correct?1:0);g.itemStats.wrong+=(correct?0:1);state.itemGlobal.handRaiseTotal++;state.itemGlobal.handRaiseHistory.push({time:Date.now(),groupId:g.id,correct});
  saveState();renderAll();
  const box=document.getElementById('handRewardBox');if(!correct){box.innerHTML='<div class="hand-rewards"><b>已记录错误，本次不发放奖励。</b></div>';return}
  box.innerHTML=`<div class="hand-rewards"><b style="width:100%">回答正确 · 选择奖励</b>${ClassroomFeedback.slotMarkup('hand')}<div class="cf-hand-custom"><input id="handCustomScore" type="number" step="1" placeholder="自由增减" aria-label="举手自由分值"><button class="btn btn-primary" onclick="ClassroomFeedback.customHand()">应用</button></div><button class="btn btn-primary" onclick="handDrawItem()">🎁 抽取道具</button><button class="btn btn-warning" onclick="handUseItem()">🎒 查看道具</button></div>`;
}
function handQuickScore(n){if(handRaiseGroupId!=null)applyScoreDelta(handRaiseGroupId,n)}
function handDrawItem(){const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!g)return;if(!eligibleForItems(g)||g.inventory.length>=3){showToast('该组当前不能抽取道具');return}recordHistory(`${g.name} 举手奖励抽取道具`);const k=drawItemForGroup(g);if(k&&addItemToGroup(g,k)){saveState();renderAll();showToast(`${g.name} 获得 ${ITEM_DEFS[k].name}`)}}
function handUseItem(){const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!g||!g.inventory.length){showToast('该组没有可用道具');return}closeHandRaise();openItemWindow(g.id,'items')}

/* 全局抽取：直接在比赛卡片内部滚动，不再弹窗 */
globalItemDraw=function(){
  ensureV2State();if(itemDrawBusy)return;const eligible=state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3);
  if(!eligible.length){showToast('没有可参与抽取的小组（满背包或负分组会自动跳过）');return}
  if(!document.getElementById('view-battle')?.classList.contains('active'))switchView('battle');
  recordHistory('全局道具抽取');itemDrawBusy=true;renderGrid();
  const overlays=new Map();
  eligible.forEach(g=>{const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(!c)return;c.classList.add('item-draw-spinning');const o=document.createElement('div');o.className='card-item-roulette';o.innerHTML='<div class="r-icon">❔</div><div class="r-name">道具抽取中…</div>';c.appendChild(o);overlays.set(g.id,o)});
  const timer=setInterval(()=>eligible.forEach(g=>{const o=overlays.get(g.id);if(!o)return;const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;const k=weightedPick(itemDropWeights(pos,r.length));o.querySelector('.r-icon').innerHTML=itemVisual(k);o.querySelector('.r-name').textContent=ITEM_DEFS[k].name}),85);
  setTimeout(()=>{clearInterval(timer);eligible.forEach(g=>{const k=drawItemForGroup(g),o=overlays.get(g.id);if(k)addItemToGroup(g,k);if(o&&k){o.classList.add('reveal');o.querySelector('.r-icon').innerHTML=itemVisual(k);o.querySelector('.r-name').textContent=ITEM_DEFS[k].name}});saveState();
    setTimeout(()=>{eligible.forEach(g=>{const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(c){c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()}});itemDrawBusy=false;renderAll()},3000)
  },3000)
}

/* 道具图鉴与自定义图标 */
function openItemEncyclopedia(){switchView('settings');setTimeout(()=>{installSettingsTabs();showSettingsV2('items')},0)}
function renderItemEncyclopedia(){
  ensureV2State();const box=document.getElementById('v2ItemEncyclopedia');if(!box)return;
  box.innerHTML=`<div style="display:flex;gap:7px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="exportItemIconPack()">导出图标包</button><button class="btn btn-primary btn-sm" onclick="document.getElementById('itemPackInput').click()">导入图标包</button><button class="btn btn-sm" onclick="resetAllItemIcons()">恢复全部默认图标</button></div><div class="item-ency-grid">${ITEM_KEYS.map(k=>{const d=ITEM_DEFS[k];return `<div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d.name}</div><div class="ency-desc">${d.desc}</div></div><div class="ency-actions"><button class="btn btn-sm btn-primary" onclick="chooseItemIcon('${k}')">上传图片</button><button class="btn btn-sm" onclick="resetItemIcon('${k}')">恢复默认</button></div></div>`}).join('')}</div>`;
}
function chooseItemIcon(k){pendingItemIconKey=k;document.getElementById('itemIconInput').value='';document.getElementById('itemIconInput').click()}
function handleItemIconUpload(e){const f=e.target.files?.[0];if(!f||!pendingItemIconKey)return;const rd=new FileReader();rd.onload=()=>{ensureV2State();state.itemGlobal.customIcons[pendingItemIconKey]=rd.result;STORAGE.setJSON('politics_item_icons',state.itemGlobal.customIcons);saveState();renderItemEncyclopedia();renderAll();showToast('道具图标已更新')};rd.readAsDataURL(f)}
function resetItemIcon(k){ensureV2State();delete state.itemGlobal.customIcons[k];STORAGE.setJSON('politics_item_icons',state.itemGlobal.customIcons);saveState();renderItemEncyclopedia();renderAll()}
function resetAllItemIcons(){ensureV2State();state.itemGlobal.customIcons={};STORAGE.setJSON('politics_item_icons',{});saveState();renderItemEncyclopedia();renderAll()}
function exportItemIconPack(){ensureV2State();const blob=new Blob([JSON.stringify({version:1,icons:state.itemGlobal.customIcons},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='道具图标包.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importItemIconPack(e){const f=e.target.files?.[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const x=JSON.parse(rd.result);ensureV2State();state.itemGlobal.customIcons={...state.itemGlobal.customIcons,...(x.icons||{})};STORAGE.setJSON('politics_item_icons',state.itemGlobal.customIcons);saveState();renderItemEncyclopedia();renderAll();showToast('道具图标包已导入')}catch{themeAlert('图标包格式无效')}};rd.readAsText(f)}

/* 设置页三分区：保留原工程台，只重新组织入口 */
function installSettingsTabs(){
  const sc=document.querySelector('#view-settings .settings-scroll');if(!sc||document.getElementById('settingsV2Tabs'))return;
  const tabs=document.createElement('div');tabs.id='settingsV2Tabs';tabs.className='settings-v2-tabs';tabs.innerHTML=`<button class="active" data-sp="function" onclick="showSettingsV2('function')">功能设置</button><button data-sp="sound" onclick="showSettingsV2('sound')">声音设置</button><button data-sp="data" onclick="showSettingsV2('data')">数据备份 / 导出</button><button data-sp="items" onclick="showSettingsV2('items')">道具百科</button>`;sc.prepend(tabs);
  const item=document.createElement('div');item.id='v2ItemPane';item.className='v2-settings-pane';item.innerHTML='<div class="setting-section-title">🎁 26 种道具百科与图标管理</div><div id="v2ItemEncyclopedia"></div>';sc.appendChild(item);
  renderItemEncyclopedia();
}
function showSettingsV2(which){
  installSettingsTabs();document.querySelectorAll('#settingsV2Tabs button').forEach(b=>b.classList.toggle('active',b.dataset.sp===which));
  const sc=document.querySelector('#view-settings .settings-scroll'),item=document.getElementById('v2ItemPane');
  [...sc.children].forEach(el=>{if(el.id!=='settingsV2Tabs'&&el.id!=='v2ItemPane')el.style.display=which==='items'?'none':''});
  item.classList.toggle('active',which==='items');if(which==='items')renderItemEncyclopedia();
  if(which!=='items'){const titles=[...sc.querySelectorAll('.setting-section-title')]; if(which==='sound'&&titles.length){titles[0]?.scrollIntoView({block:'start'})} if(which==='data'){sc.scrollTop=sc.scrollHeight}}
}

/* About */
function openAbout(){showClassroomWindow(document.getElementById('aboutBackdrop'));renderAbout('info')}
function closeAbout(){hideClassroomWindow(document.getElementById('aboutBackdrop'))}
function renderAbout(tab){
  document.querySelectorAll('[data-about]').forEach(b=>b.classList.toggle('active',b.dataset.about===tab));const m=document.getElementById('aboutMain');
  if(tab==='info')m.innerHTML=`<h2>上帝（马克思）的力量</h2><div class="guide-block"><b>课堂积分与道具系统 V2</b><br>包含课堂积分、随机点名、手动举手、26 种排名权重道具、历史回滚、档案与音效与音乐管理。</div><div class="guide-block">普通教学模式限制高风险编辑；解锁后可进行管理操作。道具的负分保护、三重耐久和持续状态仍遵循比赛规则。</div><button class="btn" onclick="closeAbout()">关闭</button>`;
  else if(tab==='items')m.innerHTML=`<h2>26 种道具百科</h2>${ITEM_KEYS.map(k=>`<div class="guide-block"><b>${itemVisual(k)} ${ITEM_DEFS[k].name}</b><br>${ITEM_DEFS[k].desc}</div>`).join('')}`;
  else m.innerHTML=`<h2>核心功能指南</h2><div class="guide-block"><b>PK：</b>各组作答后统一判定，每次 PK 都计入课堂统计。</div><div class="guide-block"><b>全局道具抽取：</b>点击底部 🎁 后，各个符合条件的小组卡片直接原地滚动 3 秒，再显示结果 3 秒。满背包与负分组不参与。</div><div class="guide-block"><b>手动举手：</b>底部 ✋ 选择小组并判定正误，正确后可赋分、抽道具或直接使用道具。</div><div class="guide-block"><b>随机点名：</b>🎰 提供个人、小组、双层联动三种模式，右侧可即时赋分。</div><div class="guide-block"><b>管理：</b>解锁后可自由赋分，并在小组道具页强制增删道具。</div>`;
}

/* God mode 道具管理 */
const _v2RenderItemWindow=renderItemWindow;renderItemWindow=function(){_v2RenderItemWindow();const g=state.groups.find(x=>x.id===activeItemGroupId),body=document.getElementById('itemWindowBody');if(!g||!body||state.isLocked||activeItemTab!=='items')return;const d=document.createElement('div');d.className='god-item-tools';d.innerHTML=`<b>🔓 上帝模式 · 现实编辑器</b><div class="god-item-grid" style="margin-top:8px">${ITEM_KEYS.map(k=>`<button class="btn btn-sm" onclick="godAddItem(${g.id},'${k}')">${itemVisual(k)} ${ITEM_DEFS[k].name}</button>`).join('')}</div><button class="btn btn-sm btn-danger" style="margin-top:8px" onclick="godClearItems(${g.id})">🧹 把道具桌面掀干净</button>`;body.appendChild(d)}
function godAddItem(id,k){const g=state.groups.find(x=>x.id===id);if(!g)return;if(g.inventory.length>=3){showToast('三个槽位都坐满了，先请走一个再塞新的。');return}recordHistory(`${g.name} 上帝模式追加 ${ITEM_DEFS[k].name}`);g.inventory.push({key:k,charges:ITEM_DEFS[k].charges,acquiredAt:Date.now()+Math.random()});saveState();renderAll();renderItemWindow()}
function godClearItems(id){const g=state.groups.find(x=>x.id===id);if(!g)return;recordHistory(`${g.name} 上帝模式清空道具`);g.inventory=[];g.itemEffect=null;g.booShield=0;saveState();renderAll();renderItemWindow()}

/* 自定义图标也进入卡片和战术窗口 */
const _v2Enhance=enhanceItemCards;enhanceItemCards=function(){_v2Enhance();ensureV2State();state.groups.forEach(g=>{const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(!c)return;c.querySelectorAll('.item-slot').forEach((s,i)=>{const it=g.inventory[i];if(it&&state.itemGlobal.customIcons[it.key]){const charge=s.querySelector('.charges')?.outerHTML||'';s.innerHTML=itemVisual(it.key)+charge}})})}
const _v2RenderItemWindowIcons=renderItemWindow;renderItemWindow=function(){_v2RenderItemWindowIcons();const g=state.groups.find(x=>x.id===activeItemGroupId);if(!g||activeItemTab!=='items')return;document.querySelectorAll('#itemWindowBody .item-big-icon').forEach((el,i)=>{const it=g.inventory[i];if(it)el.innerHTML=itemVisual(it.key)})}

/* 答题轮次统计 */
const _v2Judge=legacyJudgeRound;legacyJudgeRound=function(){const was=state.roundActive&&!state.evaluated;_v2Judge();if(was){ensureV2State();state.itemGlobal.pkTotal=(state.itemGlobal.pkTotal||0)+1;saveState()}}

/* 设置/关于关闭与初始化 */
document.getElementById('aboutBackdrop')?.addEventListener('click',e=>{if(e.target.id==='aboutBackdrop')closeAbout()});
document.getElementById('handRaiseBackdrop')?.addEventListener('click',e=>{if(e.target.id==='handRaiseBackdrop')closeHandRaise()});
const _v2SwitchView=switchView;switchView=function(name){_v2SwitchView(name);if(name==='settings')setTimeout(installSettingsTabs,0)}
window.addEventListener('DOMContentLoaded',()=>{ensureV2State();installSettingsTabs();renderPickerInfo()});


/* ===== V2.1：举手奖励的道具抽取在举手窗口内完成 ===== */
let handItemDrawTimer=null, handItemDrawFinishTimer=null, handItemDrawGroupId=null, handItemPendingKey=null, handItemDrawStartedAt=0;

function cancelHandItemDraw(silent=false){
  if(handItemDrawTimer){clearInterval(handItemDrawTimer);handItemDrawTimer=null}
  if(handItemDrawFinishTimer){clearTimeout(handItemDrawFinishTimer);handItemDrawFinishTimer=null}
  const wasPending=handItemDrawGroupId!=null && handItemPendingKey==null;
  handItemDrawGroupId=null; handItemPendingKey=null; handItemDrawStartedAt=0;
  if(wasPending && !silent) showToast('本次道具抽取已取消');
}

const _v21CloseHandRaise=closeHandRaise;
closeHandRaise=function(){cancelHandItemDraw(true);_v21CloseHandRaise()}

const _v21SelectHandGroup=selectHandGroup;
selectHandGroup=function(id){
  if(handItemDrawTimer){showToast('道具正在抽取，请等待结果');return}
  _v21SelectHandGroup(id)
}

const _v21JudgeHandRaise=judgeHandRaise;
judgeHandRaise=function(correct){
  cancelHandItemDraw(true);
  _v21JudgeHandRaise(correct);
  if(correct){
    const g=state.groups.find(x=>x.id===handRaiseGroupId);
    const btn=[...document.querySelectorAll('#handRewardBox button')].find(b=>b.textContent.includes('抽取道具'));
    if(btn && g && (!eligibleForItems(g)||g.inventory.length>=3)){
      btn.disabled=true;btn.style.opacity='.45';
      btn.title=g.score<0?'负分状态禁止获得任何道具':'三个道具槽均已占用';
    }
  }
}

handDrawItem=function(){
  ensureV2State();
  const g=state.groups.find(x=>x.id===handRaiseGroupId);
  if(!g)return;
  if(!eligibleForItems(g)){showToast('负分状态禁止获得任何道具');return}
  if(g.inventory.length>=3){showToast('该组的三个道具槽都已占用');return}
  if(handItemDrawTimer)return;

  handItemDrawGroupId=g.id; handItemPendingKey=null; handItemDrawStartedAt=Date.now();
  const box=document.getElementById('handRewardBox');
  box.innerHTML=`<div class="hand-item-draw-stage">
    <div style="font-weight:900;color:#0369a1;margin-bottom:8px">${escapeHtml(g.name)} · 道具抽取</div>
    <div id="handItemCapsule" class="hand-item-capsule spinning">❔</div>
    <div id="handItemDrawName" class="hand-item-draw-name">道具滚动中…</div>
    <div id="handItemDrawSub" class="hand-item-draw-sub">按当前排行榜位置计算道具权重</div>
    <div class="hand-item-progress"><div id="handItemProgressBar"></div></div>
  </div>`;

  const tick=()=>{
    const live=state.groups.find(x=>x.id===handItemDrawGroupId); if(!live)return;
    const r=ranking(),pos=r.findIndex(x=>x.id===live.id)+1;
    const k=weightedPick(itemDropWeights(pos,r.length));
    const cap=document.getElementById('handItemCapsule'),name=document.getElementById('handItemDrawName'),bar=document.getElementById('handItemProgressBar');
    if(cap)cap.innerHTML=itemVisual(k);
    if(name)name.textContent=ITEM_DEFS[k].name;
    if(bar)bar.style.width=Math.min(100,(Date.now()-handItemDrawStartedAt)/3000*100)+'%';
  };
  tick(); handItemDrawTimer=setInterval(tick,82);

  handItemDrawFinishTimer=setTimeout(()=>{
    clearInterval(handItemDrawTimer);handItemDrawTimer=null;handItemDrawFinishTimer=null;
    const live=state.groups.find(x=>x.id===handItemDrawGroupId);
    if(!live||!eligibleForItems(live)||live.inventory.length>=3){cancelHandItemDraw(true);showToast('抽取结束前该组已不满足获得条件');renderHandRaise();return}
    const r=ranking(),pos=r.findIndex(x=>x.id===live.id)+1;
    const k=weightedPick(itemDropWeights(pos,r.length)); handItemPendingKey=k;

    recordHistory(`${live.name} 举手奖励抽取 ${ITEM_DEFS[k].name}`);
    if(!addItemToGroup(live,k)){cancelHandItemDraw(true);showToast('道具加入失败');renderHandRaise();return}
    state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;
    saveState();renderAll();

    const slot=live.inventory.findIndex(x=>x.key===k && x.acquiredAt===Math.max(...live.inventory.filter(y=>y.key===k).map(y=>y.acquiredAt)));
    const box=document.getElementById('handRewardBox');
    box.innerHTML=`<div class="hand-item-draw-stage">
      <div style="font-weight:900;color:#16a34a;margin-bottom:8px">🎁 获得道具</div>
      <div class="hand-item-capsule reveal">${itemVisual(k)}</div>
      <div class="hand-item-draw-name">${ITEM_DEFS[k].name}</div>
      <div class="hand-item-draw-sub">已放入 ${live.name} 的第 ${Math.max(1,slot+1)} 个道具槽</div>
      <div class="hand-item-result-actions">
        <button class="btn btn-primary" onclick="finishHandItemReward()">关闭</button>
      </div>
    </div>`;
  },3000);
}

function finishHandItemReward(){
  handItemDrawGroupId=null;handItemPendingKey=null;handItemDrawStartedAt=0;
  const box=document.getElementById('handRewardBox');
  if(box)box.innerHTML='<div class="hand-rewards"><b>奖励已发放并存入道具槽。</b></div>';
}

function handUseNewItem(){
  const gid=handItemDrawGroupId,k=handItemPendingKey;
  const g=state.groups.find(x=>x.id===gid);
  if(!g||!k){showToast('新道具已不存在');return}
  const idx=g.inventory.map(x=>x.key).lastIndexOf(k);
  if(idx<0){showToast('新道具已不存在');return}
  handItemDrawGroupId=null;handItemPendingKey=null;handItemDrawStartedAt=0;
  closeHandRaise();
  openItemWindow(g.id,'items');
  setTimeout(()=>{
    const cards=[...document.querySelectorAll('#itemWindowBody .item-card')];
    if(cards[idx]){cards[idx].style.outline='3px solid #38bdf8';cards[idx].scrollIntoView({block:'nearest'})}
  },80);
}


/* 道具视觉事件入口：这里只负责识别一次成功使用，具体演出由最终实现统一处理。 */
function showItemUseFx(){}
function itemFxTargetText(key,gid){
  const r=ranking(),i=r.findIndex(g=>g.id===gid),names=[];
  const add=x=>{if(x&&x.id!==gid&&!names.includes(x.name))names.push(x.name)};
  if(['red','triple_red'].includes(key))add(r[i-1]);
  else if(['banana','triple_banana'].includes(key))add(r[i+1]);
  else if(key==='horn'){add(r[i-1]);add(r[i+1])}
  else if(key==='spiny')add(r[0]);
  else if(key==='boo')add(r[i-1]);
  else if(key==='lightning'||key==='coin_shell')r.slice(0,Math.max(0,i)).forEach(add);
  else if(key==='question')r.slice(i+1).forEach(add);
  if(!names.length)return ['coin','mushroom','triple_mushroom','star','mega','bullet','power'].includes(key)?'作用于本组':'';
  return '目标：'+names.join('、');
}
function closeItemWindowForFx(){
  try{if(typeof closeItemWindow==='function')closeItemWindow()}catch(e){}
}
if(typeof legacyUseItem==='function'){
  const useItemBeforeVisualDispatch=legacyUseItem;
  legacyUseItem=function(groupId,index,...rest){
    const g=state.groups.find(x=>x.id===groupId),before=g?.inventory?.[index],key=before?.key;
    const beforeSnapshot=JSON.stringify({inventory:g?.inventory||[],effect:g?.itemEffect||null,score:g?.score});
    const result=useItemBeforeVisualDispatch.call(this,groupId,index,...rest);
    const g2=state.groups.find(x=>x.id===groupId);
    const afterSnapshot=JSON.stringify({inventory:g2?.inventory||[],effect:g2?.itemEffect||null,score:g2?.score});
    if(key&&g2&&beforeSnapshot!==afterSnapshot){
      closeItemWindowForFx();
      setTimeout(()=>showItemUseFx(key,groupId,itemFxTargetText(key,groupId)),40);
    }
    return result;
  };
}

/* ===== V2.4：图片规范化 + 更平滑的排名道具轮盘 ===== */

/* 上传时将图片归一化到透明正方形画布。
   无论用户导入的是横图、竖图还是带巨大留白的图片，都不会再撑满小组卡片。 */
function normalizeItemIconFile(file, done){
  const reader=new FileReader();
  reader.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const size=384, canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
      const ctx=canvas.getContext('2d');ctx.clearRect(0,0,size,size);
      const pad=34, max=size-pad*2;
      const scale=Math.min(max/img.naturalWidth,max/img.naturalHeight,1.8);
      const w=Math.max(1,img.naturalWidth*scale),h=Math.max(1,img.naturalHeight*scale);
      ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
      ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);
      done(canvas.toDataURL('image/png',.94));
    };
    img.onerror=()=>done(reader.result);
    img.src=reader.result;
  };
  reader.readAsDataURL(file);
}
handleItemIconUpload=function(e){
  const f=e.target.files?.[0];if(!f||!pendingItemIconKey)return;
  normalizeItemIconFile(f,data=>{
    ensureV2State();state.itemGlobal.customIcons[pendingItemIconKey]=data;
    STORAGE.setJSON('politics_item_icons',state.itemGlobal.customIcons);saveState();
    renderItemEncyclopedia();renderAll();showToast('道具图片已自动适配为统一图标尺寸');
  });
}

/* 平滑更新一个卡片轮盘。 */
function updateCardRouletteVisual(o,key){
  if(!o||!key)return;
  const icon=o.querySelector('.r-icon'),name=o.querySelector('.r-name');
  if(icon){
    icon.classList.remove('roulette-swap');void icon.offsetWidth;
    icon.innerHTML=itemVisual(key);icon.classList.add('roulette-swap');
  }
  if(name)name.textContent=ITEM_DEFS[key].name;
}

/* 全局道具抽取：卡片原位动画，先快后慢，最后自然定格。
   每组独立按自己的实时排名奖池刷新。 */
globalItemDraw=function(){
  ensureV2State();if(itemDrawBusy)return;
  const eligible=state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3);
  if(!eligible.length){showToast('没有可参与抽取的小组（满背包或负分组会自动跳过）');return}
  if(!document.getElementById('view-battle')?.classList.contains('active'))switchView('battle');
  recordHistory('全局道具抽取');itemDrawBusy=true;renderGrid();

  const overlays=new Map(), start=performance.now(), total=3600;
  eligible.forEach(g=>{
    const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(!c)return;
    c.classList.add('item-draw-spinning');
    const o=document.createElement('div');o.className='card-item-roulette';
    o.innerHTML='<div class="r-icon">❔</div><div class="r-name">道具抽取中</div><div class="r-hint">ITEM ROULETTE</div>';
    c.appendChild(o);overlays.set(g.id,o);
  });

  const lastUpdate=new Map(), currentKey=new Map();
  function frame(now){
    const t=Math.min(1,(now-start)/total);
    /* 80ms -> 360ms，末段明显减速，比 setInterval 硬停自然得多。 */
    const interval=80 + 280*Math.pow(t,2.25);
    eligible.forEach(g=>{
      const prev=lastUpdate.get(g.id)||0;
      if(now-prev>=interval){
        lastUpdate.set(g.id,now);
        const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;
        const k=weightedPick(itemDropWeights(pos,r.length));
        currentKey.set(g.id,k);updateCardRouletteVisual(overlays.get(g.id),k);
      }
    });
    if(t<1){requestAnimationFrame(frame);return}

    eligible.forEach(g=>{
      const r=ranking(),pos=r.findIndex(x=>x.id===g.id)+1;
      const k=weightedPick(itemDropWeights(pos,r.length));
      const o=overlays.get(g.id);
      if(addItemToGroup(g,k)){
        state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;
        if(o){updateCardRouletteVisual(o,k);o.classList.add('reveal');const hint=o.querySelector('.r-hint');if(hint)hint.textContent='获得道具'}
      }
    });
    saveState();
    setTimeout(()=>{
      eligible.forEach(g=>{
        const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
        if(c){const o=c.querySelector('.card-item-roulette');if(o){o.style.transition='opacity .42s ease,transform .42s ease';o.style.opacity='0';o.style.transform='scale(.97)'}setTimeout(()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()},430)}
      });
      setTimeout(()=>{itemDrawBusy=false;renderAll()},470);
    },3000);
  }
  requestAnimationFrame(frame);
}

/* 举手抽取也改成先快后慢，不再固定 82ms 疯狂闪烁。 */
handDrawItem=function(){
  ensureV2State();const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!g)return;
  if(!eligibleForItems(g)){showToast('负分状态禁止获得任何道具');return}
  if(g.inventory.length>=3){showToast('该组的三个道具槽都已占用');return}
  if(handItemDrawTimer)return;

  handItemDrawGroupId=g.id;handItemPendingKey=null;handItemDrawStartedAt=performance.now();
  const box=document.getElementById('handRewardBox');
  box.innerHTML=`<div class="hand-item-draw-stage">
    <div style="font-weight:950;color:#0369a1;margin-bottom:10px">${escapeHtml(g.name)} · 道具抽取</div>
    <div id="handItemCapsule" class="hand-item-capsule spinning">❔</div>
    <div id="handItemDrawName" class="hand-item-draw-name">道具滚动中…</div>
    <div id="handItemDrawSub" class="hand-item-draw-sub">按当前排行榜位置计算道具权重</div>
    <div class="hand-item-progress"><div id="handItemProgressBar"></div></div>
  </div>`;

  let last=0,raf=0;const total=3600;
  handItemDrawTimer={raf:true};
  function frame(now){
    if(!handItemDrawTimer)return;
    const t=Math.min(1,(now-handItemDrawStartedAt)/total),interval=80+280*Math.pow(t,2.25);
    const bar=document.getElementById('handItemProgressBar');if(bar)bar.style.width=(t*100)+'%';
    if(now-last>=interval){
      last=now;const live=state.groups.find(x=>x.id===handItemDrawGroupId);if(!live)return;
      const r=ranking(),pos=r.findIndex(x=>x.id===live.id)+1,k=weightedPick(itemDropWeights(pos,r.length));
      const cap=document.getElementById('handItemCapsule'),name=document.getElementById('handItemDrawName');
      if(cap){cap.innerHTML=itemVisual(k);cap.animate([{opacity:.35,transform:'scale(.78)'},{opacity:1,transform:'scale(1)'}],{duration:150,easing:'cubic-bezier(.2,.8,.3,1)'})}
      if(name)name.textContent=ITEM_DEFS[k].name;
    }
    if(t<1){raf=requestAnimationFrame(frame);return}
    handItemDrawTimer=null;
    const live=state.groups.find(x=>x.id===handItemDrawGroupId);
    if(!live||!eligibleForItems(live)||live.inventory.length>=3){cancelHandItemDraw(true);showToast('抽取结束前该组已不满足获得条件');renderHandRaise();return}
    const r=ranking(),pos=r.findIndex(x=>x.id===live.id)+1,k=weightedPick(itemDropWeights(pos,r.length));handItemPendingKey=k;
    recordHistory(`${live.name} 举手奖励抽取 ${ITEM_DEFS[k].name}`);
    if(!addItemToGroup(live,k)){cancelHandItemDraw(true);showToast('道具加入失败');renderHandRaise();return}
    state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;saveState();renderAll();
    const slot=live.inventory.findIndex(x=>x===live.inventory[live.inventory.length-1]);
    box.innerHTML=`<div class="hand-item-draw-stage">
      <div style="font-weight:950;color:#16a34a;margin-bottom:10px">🎁 获得道具</div>
      <div class="hand-item-capsule reveal">${itemVisual(k)}</div>
      <div class="hand-item-draw-name">${ITEM_DEFS[k].name}</div>
      <div class="hand-item-draw-sub">已放入 ${escapeHtml(live.name)} 的第 ${Math.max(1,slot+1)} 个道具槽</div>
      <div class="hand-item-result-actions"><button class="btn btn-primary" onclick="handUseNewItem()">🎒 查看道具</button><button class="btn btn-success" onclick="finishHandItemReward()">✓ 完成</button></div>
    </div>`;
  }
  requestAnimationFrame(frame);
}

/* V2.4 的 handItemDrawTimer 不再总是数字 interval，兼容取消函数。 */
cancelHandItemDraw=function(silent=false){
  if(handItemDrawFinishTimer){clearTimeout(handItemDrawFinishTimer);handItemDrawFinishTimer=null}
  const wasPending=handItemDrawGroupId!=null&&handItemPendingKey==null;
  handItemDrawTimer=null;handItemDrawGroupId=null;handItemPendingKey=null;handItemDrawStartedAt=0;
  if(wasPending&&!silent)showToast('本次道具抽取已取消');
}


/* ===== V2.5：道具发动时，比赛页对应小组卡片同步演出 ===== */
const CARD_ITEM_FX_CLASS={
 green_shell:'cfx-green',triple_green:'cfx-green',
 red_shell:'cfx-red',triple_red:'cfx-red',
 spiny_shell:'cfx-spiny',
 banana:'cfx-banana',triple_banana:'cfx-banana',
 super_horn:'cfx-horn',bob_omb:'cfx-bomb',hammer:'cfx-hammer',
 coin:'cfx-coin',coin_shell:'cfx-rise',question_block:'cfx-rise',
 mushroom:'cfx-mushroom',triple_mushroom:'cfx-mushroom',
 boo:'cfx-boo',blooper:'cfx-blooper',lightning:'cfx-lightning',
 star:'cfx-star',giant_mushroom:'cfx-giant',bullet_bill:'cfx-bullet',
 power_mushroom:'cfx-power'
};
const CARD_HIT_COLOR={
 green_shell:'#22c55e',triple_green:'#22c55e',red_shell:'#ef4444',triple_red:'#ef4444',
 spiny_shell:'#3b82f6',banana:'#eab308',triple_banana:'#eab308',super_horn:'#f97316',
 bob_omb:'#f97316',hammer:'#64748b',boo:'#8b5cf6',blooper:'#111827',lightning:'#facc15'
};
function battleCard(id){return document.querySelector(`#view-battle .group-row-card[data-group-id="${id}"]`)||document.querySelector(`.group-row-card[data-group-id="${id}"]`)}
function clearCardFx(card){
 if(!card)return;
 [...card.classList].filter(x=>x.startsWith('cfx-')||['card-use-fx','card-hit-fx','card-defend-fx','card-heal-fx'].includes(x)).forEach(x=>card.classList.remove(x));
 card.querySelectorAll('.card-fx-badge').forEach(x=>x.remove());
 card.style.removeProperty('--hitc');
}
function playCasterCardFx(key,gid){
 if(typeof DesktopUI!=='undefined'&&(!DesktopUI.getPreferences().itemFx||DesktopUI.getPreferences().motion==='off'))return;
 const card=battleCard(gid),d=ITEM_DEFS[key];if(!card||!d)return;
 clearCardFx(card);void card.offsetWidth;
 card.classList.add('card-use-fx',CARD_ITEM_FX_CLASS[key]||'cfx-rise');
 const b=document.createElement('div');b.className='card-fx-badge';
 b.innerHTML=`<span class="cfi">${itemVisual(key)}</span><span>${escapeHtml(d.name)}</span>`;
 card.appendChild(b);
 setTimeout(()=>{card.classList.remove('card-use-fx',CARD_ITEM_FX_CLASS[key]||'cfx-rise');b.remove()},1850);
}
function playTargetCardFx(id,key,type='hit'){
 if(typeof DesktopUI!=='undefined'){DesktopUI.visualEvent(type==='defend'?'ITEM_DEFENDED':'ITEM_HIT',{groupId:id,key});if(!DesktopUI.getPreferences().itemFx||DesktopUI.getPreferences().motion==='off')return;}
 const card=battleCard(id);if(!card)return;
 /* 不抹掉持续状态 class，只清一次性命中特效 */
 card.classList.remove('card-hit-fx','card-defend-fx','card-heal-fx');void card.offsetWidth;
 card.style.setProperty('--hitc',type==='defend'?'#38bdf8':type==='heal'?'#22c55e':(CARD_HIT_COLOR[key]||'#ef4444'));
 card.classList.add(type==='defend'?'card-defend-fx':type==='heal'?'card-heal-fx':'card-hit-fx');
 setTimeout(()=>{card.classList.remove('card-hit-fx','card-defend-fx','card-heal-fx');card.style.removeProperty('--hitc')},1600);
}
function cardFxTargets(key,gid){
 const r=ranking(),i=r.findIndex(g=>g.id===gid),ids=[],add=g=>{if(g&&g.id!==gid&&!ids.includes(g.id))ids.push(g.id)};
 if(['red_shell','triple_red','boo'].includes(key))add(r[i-1]);
 else if(['banana','triple_banana'].includes(key))add(r[i+1]);
 else if(key==='super_horn'){add(r[i-1]);add(r[i+1])}
 else if(key==='spiny_shell')add(r[0]);
 else if(key==='lightning')r.slice(0,Math.max(0,i)).forEach(add);
 else if(key==='coin_shell')r.slice(0,Math.max(0,i)).forEach(add);
 else if(key==='question_block')r.slice(i+1).forEach(add);
 return ids;
}
/* 接到 V2.3/V2.2 已确认“实际成功发动”的 showItemUseFx 上。
   此时小组窗口已经关闭、renderAll 已刷新，因此动画直接落在最新分数的比赛卡片上。 */
const _v25ShowItemUseFx=showItemUseFx;
showItemUseFx=function(key,casterId=null,targetText=''){
 try{
   if(casterId!=null){
     playCasterCardFx(key,casterId);
     const targets=cardFxTargets(key,casterId);
     const beneficial=['coin_shell','question_block'].includes(key);
     targets.forEach((id,n)=>setTimeout(()=>playTargetCardFx(id,key,beneficial?'heal':'hit'),120+n*70));
   }
 }catch(e){console.warn('card item fx',e)}
 return _v25ShowItemUseFx(key,casterId,targetText);
}


/* ===== V2.6：持久化、设置页、窗口、菜单音乐、UI 图标、道具音效 ===== */

/* 1. 道具与历史跨关闭保存 */
const V26_HISTORY_KEY='politics_history_stack_v26';

try{
  const hs=STORAGE.getJSON(V26_HISTORY_KEY,[]);
  if(Array.isArray(hs)&&hs.length) historyStack=hs.slice(-MAX_HISTORY);
}catch(e){}


window.addEventListener('pagehide',()=>{try{saveState();persistHistoryV26()}catch(e){}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{saveState();persistHistoryV26()}catch(e){}}});



/* 2. 菜单音乐参数按样本固定，移除工程台 */
Object.assign(menuCfg,{
  bpm:103,beatsPerBar:4,loopStartBeat:24,loopEndBeat:192,
  transitionLeadBeats:0,battleBaseBpm:130,battleSet8Bpm:135,battleTransitionLeadBeats:0
});
saveMenuCfg();
function removeBgmEngineeringConsoleV26(){
  document.getElementById('bgmEngineConsole')?.remove();
  document.querySelectorAll('#view-settings .setting-section-title').forEach(x=>{
    if(x.textContent.includes('音乐设置'))x.remove();
  });
}

/* 3. 道具功能音效 */
const ITEM_FX_SOUND_SLOTS=[
 {id:'item_draw_start',name:'道具抽取·启动',desc:'开始轮盘时'},
 {id:'item_draw_tick',name:'道具抽取·滚动刻度',desc:'轮盘滚动过程中'},
 {id:'item_draw_reveal',name:'道具抽取·定格',desc:'最终道具揭晓'},
 {id:'item_use',name:'道具·发动通用',desc:'任一道具成功使用'},
 {id:'item_attack',name:'道具·攻击',desc:'龟壳、香蕉、炸弹、锤子、闪电等'},
 {id:'item_defend',name:'道具·防御成功',desc:'防御道具抵消攻击'},
 {id:'item_buff',name:'道具·加分/强化',desc:'金币、蘑菇、？砖块等'},
 {id:'item_status',name:'道具·持续状态',desc:'星星、巨大蘑菇、炮弹、强力蘑菇、鱿鱿'},
 {id:'item_steal',name:'害羞幽灵·偷取',desc:'成功偷取道具'}
];
function renderItemFxSoundListV26(){
 const box=document.getElementById('itemFxSoundListV26');if(!box)return;
 box.innerHTML=ITEM_FX_SOUND_SLOTS.filter(s=>!GENERIC_ITEM_USE_SOUNDS_V2174.has(s.id)).map(s=>{
   const custom=!!customFxBuffers[s.id]||hasSound('fx_'+s.id);
   return `<div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="sound-tag">${custom?'已载入自定义音频':s.desc}</div></div><div class="sound-controls"><button class="btn btn-sm" onclick="playSound('${s.id}')">试听</button><button class="btn btn-sm btn-primary" onclick="triggerUploadAudio('fx_${s.id}')">上传</button>${custom?`<button class="btn btn-sm btn-danger" onclick="deleteFxTrack('fx_${s.id}','${s.id}');setTimeout(renderItemFxSoundListV26,100)">还原</button>`:''}</div></div>`
 }).join('');
}
function itemSoundCategoryV26(k){
 if(['green','triple_green','red','triple_red','spiny','banana','triple_banana','horn','bomb','hammer','lightning'].includes(k))return'item_attack';
 if(['coin','coin_shell','question','mushroom','triple_mushroom'].includes(k))return'item_buff';
 if(k==='boo')return'item_steal';
 return'item_status';
}
const _v26ShowItemUseFx=showItemUseFx;
showItemUseFx=function(k,g,t){playSound('item_use');setTimeout(()=>playSound(itemSoundCategoryV26(k)),55);return _v26ShowItemUseFx(k,g,t)}
const _v26TinyDefense=tinyDefenseToast;
tinyDefenseToast=function(m){playSound('item_defend');return _v26TinyDefense(m)}
function startDrawSoundBedV26(ms=3600){
 playSound('item_draw_start');let n=0;
 const timer=setInterval(()=>{if(n++<13)playSound('item_draw_tick');else clearInterval(timer)},Math.max(150,ms/15));
 setTimeout(()=>{clearInterval(timer);playSound('item_draw_reveal')},ms);
}
const _v26GlobalDraw=globalItemDraw;globalItemDraw=function(){if(!itemDrawBusy)startDrawSoundBedV26(3600);return _v26GlobalDraw()}
const _v26HandDraw=handDrawItem;handDrawItem=function(){if(!handItemDrawTimer)startDrawSoundBedV26(3600);return _v26HandDraw()}

/* 4. 顶部导航 + 底部主要功能按钮图标自定义 */
const UI_ICON_TARGETS=[
 ['nav_welcome','欢迎','[data-view="welcome"]','🏠'],['nav_battle','比赛','[data-view="battle"]','⚔️'],
 ['nav_history','历史','[data-view="history"]','📜'],['nav_archives','档案','[data-view="archives"]','🗄️'],['nav_settings','设置','[data-view="settings"]','⚙️'],
 ['dock_item','全局道具抽取','button[onclick="globalItemDraw()"]','🎁'],['dock_hand','举手办案处','button[onclick="openHandRaise()"]','✋'],
 ['dock_picker','点名抽签','button[onclick="openPickerModal()"]','🎰'],['dock_about','关于','button[onclick="openAbout()"]','ⓘ'],
 ['dock_search','人肉搜索（文明版）','button[onclick="openMemberSearchModal()"]','😎'],['dock_undo','撤销','button[onclick="undoLast()"]','↩️'],
 ['dock_lock','上帝模式','button[onclick="toggleLock()"]','🔒'],['dock_add','增加小组','button[onclick="addGroup()"]','➕'],
 ['dock_zoomin','放大','button[onclick="zoomIn()"]','🔍⁺'],['dock_zoomout','缩小','button[onclick="zoomOut()"]','🔍⁻'],['dock_zoomreset','复位缩放','button[onclick="zoomReset()"]','🔍↺']
];
let pendingUiIconV26=null;
function uiIconsV26(){return STORAGE.getJSON('politics_ui_icons_v26',{})||{}}
function applyUiIconsV26(){
 const map=uiIconsV26();
 UI_ICON_TARGETS.forEach(([id,label,sel])=>{
  const el=document.querySelector(sel);if(!el)return;
  if(!el.dataset.v26Original)el.dataset.v26Original=el.innerHTML;
  const data=Reliability.safeImage(map[id]);
  if(data){
    const template=document.createElement('template');template.innerHTML=el.dataset.v26Original;
    template.content.querySelector('svg,.custom-ui-icon')?.remove();
    const text=template.innerHTML.trim()||escapeHtml(label);
    el.innerHTML=`<img class="custom-ui-icon" src="${data}" alt=""> ${text}`;
  }else el.innerHTML=el.dataset.v26Original;
  el.setAttribute('aria-label',label);
 });
}

function chooseUiIconV26(id){pendingUiIconV26=id;const f=document.getElementById('uiIconInputV26');f.value='';f.click()}
function handleUiIconV26(e){
 const f=e.target.files?.[0];if(!f||!pendingUiIconV26)return;
 normalizeItemIconFile(f,data=>{const m=uiIconsV26();m[pendingUiIconV26]=data;STORAGE.setJSON('politics_ui_icons_v26',m);applyUiIconsV26();renderUiIconManagerV26()})
}
function resetUiIconV26(id){const m=uiIconsV26();delete m[id];STORAGE.setJSON('politics_ui_icons_v26',m);applyUiIconsV26();renderUiIconManagerV26()}
function renderUiIconManagerV26(){
 const box=document.getElementById('uiIconManagerV26');if(!box)return;const m=uiIconsV26();
 box.innerHTML=`<div class="icon-custom-grid">${UI_ICON_TARGETS.map(([id,label,,fallback])=>`<div class="icon-custom-card"><div class="icon-preview">${m[id]?`<img src="${m[id]}">`:fallback}</div><div style="flex:1"><b>${label}</b><div style="font-size:11px;color:#64748b">支持 PNG / JPG / WebP</div></div><button class="btn btn-sm btn-primary" onclick="chooseUiIconV26('${id}')">上传</button>${m[id]?`<button class="btn btn-sm" onclick="resetUiIconV26('${id}')">还原</button>`:''}</div>`).join('')}</div>`;
}

/* 5. 重建设置页标签，真正做到互斥显示 */
function rebuildSettingsV26(){
 const sc=document.querySelector('#view-settings .settings-scroll');if(!sc||document.getElementById('settingsV26Tabs')||document.getElementById('uiSettingsShell'))return;
 removeBgmEngineeringConsoleV26();
 document.getElementById('settingsV2Tabs')?.remove();
 document.getElementById('v2ItemPane')?.remove();

 const original=[...sc.children];
 const panes={function:document.createElement('div'),sound:document.createElement('div'),data:document.createElement('div'),items:document.createElement('div')};
 Object.entries(panes).forEach(([k,p])=>{p.id='settingsV26_'+k;p.className='settings-v26-pane'});
 let mode='function';
 original.forEach(el=>{
   const txt=(el.textContent||'');
   if(el.id==='bgmListContainer'||el.id==='soundListContainer'||el.id==='cfgSetSelector'||txt.includes('主音量')||txt.includes('曲目工程规范')||txt.includes('选择要维护的音乐套数')||txt.includes('当前套数音频槽位')||txt.includes('基础操作与欢庆音效'))mode='sound';
   if(txt.includes('安全与管理')||txt.includes('数据备份与恢复'))mode='data';
   panes[mode].appendChild(el);
 });
 const tabs=document.createElement('div');tabs.id='settingsV26Tabs';tabs.className='settings-v26-tabs';
 tabs.innerHTML=`<button data-v26="function" onclick="showSettingsV26('function')">⚙️ 功能设置</button><button data-v26="sound" onclick="showSettingsV26('sound')">🔊 音效与音乐</button><button data-v26="items" onclick="showSettingsV26('items')">🎁 道具与图标</button><button data-v26="data" onclick="showSettingsV26('data')">💾 数据与管理</button>`;
 sc.append(tabs,panes.function,panes.sound,panes.items,panes.data);

 const ui=document.createElement('div');ui.innerHTML='<div class="setting-section-title">🖼️ 按钮图标自定义</div><div id="uiIconManagerV26"></div>';panes.function.appendChild(ui);
 const item=document.createElement('div');item.innerHTML='<div class="setting-section-title">🎁 26 种道具百科与图标管理</div><div id="v2ItemEncyclopedia"></div>';panes.items.appendChild(item);
 const fx=document.createElement('div');fx.innerHTML='<div class="setting-section-title">🎮 道具系统音效</div><div id="itemFxSoundListV26"></div>';panes.sound.appendChild(fx);
 const hidden=document.createElement('input');hidden.type='file';hidden.accept='image/*';hidden.id='uiIconInputV26';hidden.style.display='none';hidden.onchange=handleUiIconV26;document.body.appendChild(hidden);
 installCommunismModeSetting();renderUiIconManagerV26();renderItemEncyclopedia();renderItemFxSoundListV26();showSettingsV26('function');
}
function showSettingsV26(which){
 if(document.getElementById('uiSettingsShell')){DesktopUI.selectSettings(which);return;}
 document.querySelectorAll('.settings-v26-pane').forEach(p=>p.classList.toggle('active',p.id==='settingsV26_'+which));
 document.querySelectorAll('#settingsV26Tabs button').forEach(b=>b.classList.toggle('active',b.dataset.v26===which));
 const sc=document.querySelector('#view-settings .settings-scroll');if(sc)sc.scrollTop=0;
 if(which==='sound'){renderBgmSlotList();renderFxSlotList();renderItemFxSoundListV26()}
 if(which==='items')renderItemEncyclopedia();
 if(which==='function'){installCommunismModeSetting();renderUiIconManagerV26();}
}
/* 禁止旧版 installSettingsTabs 再把内容全部放出来 */
installSettingsTabs=function(){rebuildSettingsV26()}
showSettingsV2=function(which){showSettingsV26(which==='sound'?'sound':which==='data'?'data':which==='items'?'items':'function')}

/* 设置页标题也同步去掉“工程台” */
window.addEventListener('DOMContentLoaded',()=>{
 const sub=document.querySelector('#view-settings .fullview-sub');if(sub)sub.textContent='功能、音效与音乐、道具图标、学生名单及数据管理。';
 rebuildSettingsV26();applyUiIconsV26();
 setTimeout(()=>{renderItemFxSoundListV26();persistHistoryV26();saveState()},400);
});


/* ===== V2.7 iOS / 手机浏览器 visualViewport 自适应 ===== */
function syncVisualViewportV27(){
  const h=(window.visualViewport&&window.visualViewport.height)||window.innerHeight;
  document.documentElement.style.setProperty('--vvh',h+'px');
}
syncVisualViewportV27();
window.addEventListener('resize',syncVisualViewportV27,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(syncVisualViewportV27,80),{passive:true});
if(window.visualViewport){
  window.visualViewport.addEventListener('resize',syncVisualViewportV27,{passive:true});
  window.visualViewport.addEventListener('scroll',syncVisualViewportV27,{passive:true});
}


/* ===== V2.8 持久化修复与非浏览器原生警告窗 ===== */

/* normalizeGroup 在旧版启动时会把 inventory/itemEffect/itemStats/booShield 丢掉。
   V2.8 已在 normalizeGroup 本体中保留它们；这里再做一次启动后的规范化并立即回写。 */
function repairPersistentItemsV28(){
  ensureItemState();
  state.groups.forEach(g=>{
    g.inventory=normalizeInventoryV21718(g.inventory);
  });
  try{saveState()}catch(e){}
}

/* Vista 风格程序确认窗，替代“尚有小组未作答”时的系统 confirm。 */
let programConfirmResolveV28=null;
function programConfirmV28(message,opts={}){
  return new Promise(resolve=>{
    const previous = document.getElementById('programConfirmV28');
    previous?.querySelector('#pcCancelV28')?.click();
    if(previous && typeof DesktopUI !== 'undefined') DesktopUI.finishWindowClose(previous);
    programConfirmResolveV28=resolve;
    const o=document.createElement('div');o.id='programConfirmV28';o.className='program-confirm-overlay';
    o.innerHTML=`<div class="program-confirm-window ui-function-surface" role="dialog" aria-modal="true" aria-labelledby="pcTitleV28">
      <div class="program-confirm-titlebar" id="pcTitleV28">${escapeHtml(opts.title||'课堂程序提示')}</div>
      <div class="program-confirm-body">
        <div class="program-confirm-icon">!</div>
        <div class="program-confirm-text">${escapeHtml(message).replace(/\n/g,'<br>')}</div>
      </div>
      <div class="program-confirm-actions">
        <button class="btn" id="pcCancelV28">${escapeHtml(opts.cancelText||'返回检查')}</button>
        <button class="btn btn-primary" id="pcOkV28">${escapeHtml(opts.okText||'仍然继续')}</button>
      </div>
    </div>`;
    document.body.appendChild(o);
    let settled=false;
    const finish=v=>{if(settled||!o.isConnected)return;settled=true;document.removeEventListener('keydown',key);hideClassroomWindow(o,()=>o.remove());programConfirmResolveV28=null;resolve(v)};
    o.querySelector('#pcCancelV28').onclick=()=>finish(false);
    o.querySelector('#pcOkV28').onclick=()=>finish(true);
    o.addEventListener('click',e=>{if(e.target===o)finish(false)});
    const key=e=>{if(!o.isConnected){document.removeEventListener('keydown',key);return}if(e.key==='Escape'){document.removeEventListener('keydown',key);finish(false)}else if(e.key==='Enter'){document.removeEventListener('keydown',key);finish(true)}};
    document.addEventListener('keydown',key);
  });
}

/* 重写正确答案选择入口，仅把“未全部选择”的原生 confirm 换成程序窗。 */
setCorrectAns=async function(opt){
  if(state.evaluated)return;
  if(state.correctAns===opt){
    playSound('ui_click');state.correctAns='';renderControls();return;
  }
  const unanswered=state.groups.filter(g=>g.selectedOpt==='');
  if(unanswered.length){
    const names=unanswered.map(g=>g.name).join('、');
    const ok=await programConfirmV28(
      `仍有 ${unanswered.length} 个小组尚未完成作答：${names}\n现在选定正确答案后，未作答小组将保持“未作答”状态。`,
      {title:'作答尚未完成',cancelText:'返回检查',okText:`继续选择 ${opt}`}
    );
    if(!ok)return;
  }
  playSound('ui_click');state.correctAns=opt;renderControls();
}

/* 页面离开时做同步回写。 */
window.addEventListener('beforeunload',()=>{try{saveState();persistHistoryV26()}catch(e){}});
window.addEventListener('DOMContentLoaded',()=>setTimeout(repairPersistentItemsV28,0));


/* ===== V2.8.1 防重复抽取 =====
   规则：
   1. 同一轮“全局道具发放”中，最终结果尽量不重复。
   2. 同一小组不会抽到自己背包里已经持有的同种道具。
   3. 仍严格使用当前名次的原权重；只把已禁止的候选权重临时置零。
   4. 若受名次禁用规则 + 防重复规则影响后没有候选，则先允许“跨组重复”，
      但仍优先避免与自己背包重复，避免把抽取系统卡死。
*/
function heldItemKeysV281(g){
  return new Set((g?.inventory||[]).map(it=>it?.key).filter(Boolean));
}
function weightedPickNoRepeatV281(weights, blocked=new Set()){
  const filtered={};
  Object.entries(weights||{}).forEach(([k,w])=>{
    const n=Number(w)||0;
    if(n>0 && !blocked.has(k)) filtered[k]=n;
  });
  if(Object.keys(filtered).length) return weightedPick(filtered);
  return null;
}
function pickItemForGroupV281(g, batchUsed=new Set()){
  const r=ranking(), pos=Math.max(1,r.findIndex(x=>x.id===g.id)+1);
  const weights=itemDropWeights(pos,r.length);
  const held=heldItemKeysV281(g);

  // 首选：既不与本轮其他组重复，也不与自己背包重复。
  let k=weightedPickNoRepeatV281(weights,new Set([...batchUsed,...held]));
  // 候选耗尽：允许跨组重复，但仍避免自己背包重复。
  if(!k) k=weightedPickNoRepeatV281(weights,held);
  // 极端情况：该名次所有可抽道具都已在自己背包，回退原权重。
  if(!k) k=weightedPick(weights);
  return k;
}

/* 重写全局抽取：保留 V2.4 的平滑轮盘，只修改布局与最终防重复逻辑。 */
globalItemDraw=function(){
  ensureV2State();if(itemDrawBusy)return;
  const eligible=state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3);
  if(!eligible.length){showToast('没有可参与抽取的小组（满背包或负分组会自动跳过）');return}
  if(!document.getElementById('view-battle')?.classList.contains('active'))switchView('battle');
  recordHistory('全局道具抽取');itemDrawBusy=true;renderGrid();

  const overlays=new Map(),start=performance.now(),total=3600;
  eligible.forEach(g=>{
    const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(!c)return;
    c.classList.add('item-draw-spinning');
    const o=document.createElement('div');o.className='card-item-roulette';
    o.innerHTML='<div class="r-icon">❔</div><div class="r-name">道具抽取中</div><div class="r-hint">ITEM ROULETTE</div>';
    c.appendChild(o);overlays.set(g.id,o);
  });

  const lastUpdate=new Map();
  function frame(now){
    const t=Math.min(1,(now-start)/total),interval=80+280*Math.pow(t,2.25);
    eligible.forEach(g=>{
      const prev=lastUpdate.get(g.id)||0;
      if(now-prev>=interval){
        lastUpdate.set(g.id,now);
        const k=pickItemForGroupV281(g,new Set());
        updateCardRouletteVisual(overlays.get(g.id),k);
      }
    });
    if(t<1){requestAnimationFrame(frame);return}

    const batchUsed=new Set();
    eligible.forEach(g=>{
      const k=pickItemForGroupV281(g,batchUsed);
      if(k&&addItemToGroup(g,k)){
        batchUsed.add(k);
        state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;
        const o=overlays.get(g.id);
        if(o){
          updateCardRouletteVisual(o,k);o.classList.add('reveal');
          const hint=o.querySelector('.r-hint');if(hint)hint.textContent='获得道具';
        }
      }
    });
    saveState();
    setTimeout(()=>{
      eligible.forEach(g=>{
        const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
        if(c){
          const o=c.querySelector('.card-item-roulette');
          if(o){o.style.transition='opacity .42s ease,transform .42s ease';o.style.opacity='0';o.style.transform='scale(.97)'}
          setTimeout(()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()},430);
        }
      });
      setTimeout(()=>{itemDrawBusy=false;renderAll()},470);
    },3000);
  }
  requestAnimationFrame(frame);
}

/* 举手抽取：同样避免抽到该组已持有的同种道具。 */
handDrawItem=function(){
  ensureV2State();const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!g)return;
  if(!eligibleForItems(g)){showToast('负分状态禁止获得任何道具');return}
  if(g.inventory.length>=3){showToast('该组的三个道具槽都已占用');return}
  if(handItemDrawTimer)return;

  handItemDrawGroupId=g.id;handItemPendingKey=null;handItemDrawStartedAt=performance.now();
  const box=document.getElementById('handRewardBox');
  box.innerHTML=`<div class="hand-item-draw-stage v281-horizontal">
    <div class="hand-draw-head" style="font-weight:950;color:#0369a1">${escapeHtml(g.name)} · 道具抽取</div>
    <div id="handItemCapsule" class="hand-item-capsule spinning">❔</div>
    <div class="hand-draw-copy"><div id="handItemDrawName" class="hand-item-draw-name">道具滚动中…</div><div id="handItemDrawSub" class="hand-item-draw-sub">按当前排行榜位置计算道具权重</div></div>
    <div class="hand-item-progress"><div id="handItemProgressBar"></div></div>
  </div>`;

  let last=0;const total=3600;handItemDrawTimer={raf:true};
  function frame(now){
    if(!handItemDrawTimer)return;
    const t=Math.min(1,(now-handItemDrawStartedAt)/total),interval=80+280*Math.pow(t,2.25);
    const bar=document.getElementById('handItemProgressBar');if(bar)bar.style.width=(t*100)+'%';
    if(now-last>=interval){
      last=now;const live=state.groups.find(x=>x.id===handItemDrawGroupId);if(!live)return;
      const k=pickItemForGroupV281(live,new Set());
      const cap=document.getElementById('handItemCapsule'),name=document.getElementById('handItemDrawName');
      if(cap){cap.innerHTML=itemVisual(k);cap.animate([{opacity:.35,transform:'scale(.76)'},{opacity:1,transform:'scale(1)'}],{duration:150,easing:'cubic-bezier(.2,.8,.3,1)'})}
      if(name)name.textContent=ITEM_DEFS[k].name;
    }
    if(t<1){requestAnimationFrame(frame);return}

    handItemDrawTimer=null;
    const live=state.groups.find(x=>x.id===handItemDrawGroupId);
    if(!live||!eligibleForItems(live)||live.inventory.length>=3){cancelHandItemDraw(true);showToast('抽取结束前该组已不满足获得条件');renderHandRaise();return}
    const k=pickItemForGroupV281(live,new Set());handItemPendingKey=k;
    recordHistory(`${live.name} 举手奖励抽取 ${ITEM_DEFS[k].name}`);
    if(!addItemToGroup(live,k)){cancelHandItemDraw(true);showToast('道具加入失败');renderHandRaise();return}
    state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;saveState();renderAll();
    const slot=live.inventory.length-1;
    box.innerHTML=`<div class="hand-item-draw-stage v281-horizontal">
      <div class="hand-draw-head" style="font-weight:950;color:#16a34a">🎁 获得道具</div>
      <div class="hand-item-capsule reveal">${itemVisual(k)}</div>
      <div class="hand-draw-copy"><div class="hand-item-draw-name">${ITEM_DEFS[k].name}</div><div class="hand-item-draw-sub">已放入 ${escapeHtml(live.name)} 的${slot===0?'主要道具栏':'次要道具栏 '+slot}</div></div>
      <div class="hand-item-result-actions"><button class="btn btn-primary" onclick="handUseNewItem()">🎒 查看道具</button><button class="btn btn-success" onclick="finishHandItemReward()">✓ 完成</button></div>
    </div>`;
  }
  requestAnimationFrame(frame);
}


/* ===== V2.8.2：羽毛 / 火之花 / 冰之花 / 回旋镖花 =====
   V2.17.19 注意：这四种道具已在基础 ITEM_DEFS 阶段提前注册，
   此处只负责补充/覆盖同一套详细定义与后续行为，避免重进页面时库存先于定义被规范化。
   设计映射：
   羽毛：马车世界中用于跳跃、躲避攻击 -> 课堂版主动获得 1 次“任意攻击闪避”，使用后离开槽位。
   火之花：原作可连续投射多发火球 -> 课堂版 3 发火球，逐发攻击随机其他组，每发扣当前分 1/8。
   冰之花：原作命中使对手短暂失控 -> 课堂版 3 发冰球，每发随机攻击其他组，扣 1/10，并冻结其下一次主动道具使用。
   回旋镖花：原作可反复投掷并返回 -> 课堂版 3 次使用，每次攻击当前排名相邻的上/下组，各扣 1/8；使用次数耗尽才释放槽位。
*/
Object.assign(ITEM_DEFS,{
 feather:{name:'羽毛',icon:'🪶',charges:1,slots:1,desc:'高高跃起闪避攻击。主动使用后获得 1 次任意外部攻击闪避，触发后消失。'},
 fire_flower:{name:'火之花',icon:'🌼',charges:3,slots:1,desc:'3 发火球。每次随机命中一个其他小组，使其当前积分减少 1/4；3 发耗尽后释放槽位。'},
 ice_flower:{name:'冰之花',icon:'❄️',charges:3,slots:1,desc:'3 发冰球。每次随机命中一个其他小组，扣除当前积分 1/5，并冻结其主动道具；主动尝试使用会解除，若不用则 3 次答题后自动解除。'},
 boomerang_flower:{name:'回旋镖花',icon:'🪃',charges:3,slots:1,desc:'3 次回旋镖。每次命中当前排名紧邻自己的上一组和下一组，各扣当前积分 1/5。'}
});
ITEM_KEYS = Object.keys(ITEM_DEFS); // V2.8.4: 新增道具后刷新全局枚举，所有旧管理器自动获得 26 项


/* 默认图标兼容：若用户没上传图片，就用 emoji；百科/上传系统会自动读取 ITEM_DEFS。 */
function v282RandomOther(caster){
 const arr=state.groups.filter(g=>g.id!==caster.id && Number(g.score)>=0);
 return arr.length?arr[Math.floor(Math.random()*arr.length)]:null;
}
function v282TakeFraction(target,frac,key,caster){
 if(!target||Number(target.score)<0)return false;
 const amount=Math.round(Math.max(0,Number(target.score)||0)*frac);
 if(amount<=0)return true;
 try{
   if(typeof applyItemAttack==='function') return applyItemAttack(caster,target,amount,key);
 }catch(e){}
 target.score=Math.round((Number(target.score)||0)-amount);
 return true;
}
function v282Consume(g,index){
 const it=g.inventory[index];if(!it)return;
 it.charges=Math.max(0,(Number(it.charges)||1)-1);
 if(it.charges<=0)g.inventory.splice(index,1);
}

/* 扩展 useItem。旧 26 种完全交回 V2.8 原逻辑。 */
const _v282UseItem=legacyUseItem;
legacyUseItem=function(groupId,index,...rest){
 const g=state.groups.find(x=>x.id===groupId),it=g?.inventory?.[index],key=it?.key;
 if(!['feather','fire_flower','ice_flower','boomerang_flower'].includes(key))
   return _v282UseItem.call(this,groupId,index,...rest);
 if(!g||Number(g.score)<0){showToast('负分状态严格禁止使用道具');return false}
 recordHistory(`${g.name} 使用 ${ITEM_DEFS[key].name}`);

 if(key==='feather'){
   g.itemEffect={...(g.itemEffect||{}),featherDodge:1};
   g.inventory.splice(index,1);
   saveState();renderAll();showItemUseFx(key,g.id,'下一次攻击可闪避');return true;
 }
 if(key==='fire_flower'){
   const t=v282RandomOther(g);if(!t){showToast('没有可攻击的小组');return false}
   v282TakeFraction(t,1/8,key,g);v282Consume(g,index);
   saveState();renderAll();showItemUseFx(key,g.id,`${t.name} -1/8`);return true;
 }
 if(key==='ice_flower'){
   const t=v282RandomOther(g);if(!t){showToast('没有可攻击的小组');return false}
   v282TakeFraction(t,1/10,key,g);
   t.itemEffect={...(t.itemEffect||{}),iceLock:1};
   v282Consume(g,index);
   saveState();renderAll();showItemUseFx(key,g.id,`${t.name} 冻结`);return true;
 }
 if(key==='boomerang_flower'){
   const r=ranking(),p=r.findIndex(x=>x.id===g.id),targets=[r[p-1],r[p+1]].filter(x=>x&&Number(x.score)>=0);
   if(!targets.length){showToast('当前没有可命中的相邻小组');return false}
   targets.forEach(t=>v282TakeFraction(t,1/8,key,g));v282Consume(g,index);
   saveState();renderAll();showItemUseFx(key,g.id,targets.map(x=>x.name).join('、'));return true;
 }
};

/* 新增道具视觉语言 */
Object.assign(CARD_ITEM_FX_CLASS,{
 feather:'cfx-feather',fire_flower:'cfx-fireflower',ice_flower:'cfx-iceflower',boomerang_flower:'cfx-boomerang'
});
Object.assign(CARD_HIT_COLOR,{
 fire_flower:'#f97316',ice_flower:'#38bdf8',boomerang_flower:'#3b82f6'
});

/* 轮盘预览必须制造期待感：预览阶段从“全部道具”均匀随机，
   只有最终定格时才调用排名权重 + 防重复。 */
function roulettePreviewPickV282(){
 const keys=Object.keys(ITEM_DEFS);
 return keys[Math.floor(Math.random()*keys.length)];
}
function updateAllRoulettePreviewLogicV282(){
 /* 标记函数供重写后的 draw 使用 */
 return roulettePreviewPickV282();
}

/* 基于 V2.8.1 重写全局抽取：预览无权重，最终结果仍严格按权重与防重复。 */
globalItemDraw=function(){
 ensureV2State();if(itemDrawBusy)return;
 const eligible=state.groups.filter(g=>eligibleForItems(g)&&g.inventory.length<3);
 if(!eligible.length){showToast('没有可参与抽取的小组（满背包或负分组会自动跳过）');return}
 if(!document.getElementById('view-battle')?.classList.contains('active'))switchView('battle');
 recordHistory('全局道具抽取');itemDrawBusy=true;renderGrid();

 const overlays=new Map(),start=performance.now(),total=3600;
 eligible.forEach(g=>{
   const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);if(!c)return;
   c.classList.add('item-draw-spinning');
   const o=document.createElement('div');o.className='card-item-roulette';
   o.innerHTML='<div class="r-icon">❔</div><div class="r-name">道具抽取中</div><div class="r-hint">ITEM ROULETTE</div>';
   c.appendChild(o);overlays.set(g.id,o);
 });
 const lastUpdate=new Map();
 function frame(now){
   const t=Math.min(1,(now-start)/total),interval=72+300*Math.pow(t,2.35);
   eligible.forEach(g=>{
     const prev=lastUpdate.get(g.id)||0;
     if(now-prev>=interval){
       lastUpdate.set(g.id,now);
       updateCardRouletteVisual(overlays.get(g.id),roulettePreviewPickV282());
     }
   });
   if(t<1){requestAnimationFrame(frame);return}

   const batchUsed=new Set();
   eligible.forEach(g=>{
     const k=pickItemForGroupV281(g,batchUsed);
     if(k&&addItemToGroup(g,k)){
       batchUsed.add(k);state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;
       const o=overlays.get(g.id);
       if(o){updateCardRouletteVisual(o,k);o.classList.add('reveal');const h=o.querySelector('.r-hint');if(h)h.textContent='获得道具'}
     }
   });
   saveState();
   setTimeout(()=>{
     eligible.forEach(g=>{
       const c=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
       if(c){const o=c.querySelector('.card-item-roulette');if(o){o.style.transition='opacity .42s ease,transform .42s ease';o.style.opacity='0';o.style.transform='scale(.97)'}setTimeout(()=>{c.classList.remove('item-draw-spinning');c.querySelector('.card-item-roulette')?.remove()},430)}
     });
     setTimeout(()=>{itemDrawBusy=false;renderAll()},470);
   },3000);
 }
 requestAnimationFrame(frame);
}

/* 举手抽取同理：动画展示全道具，最终才使用权重。 */
handDrawItem=function(){
 ensureV2State();const g=state.groups.find(x=>x.id===handRaiseGroupId);if(!g)return;
 if(!eligibleForItems(g)){showToast('负分状态禁止获得任何道具');return}
 if(g.inventory.length>=3){showToast('该组的三个道具槽都已占用');return}
 if(handItemDrawTimer)return;
 handItemDrawGroupId=g.id;handItemPendingKey=null;handItemDrawStartedAt=performance.now();
 const box=document.getElementById('handRewardBox');
 box.innerHTML=`<div class="hand-item-draw-stage v281-horizontal">
   <div class="hand-draw-head" style="font-weight:950;color:#0369a1">${escapeHtml(g.name)} · 道具抽取</div>
   <div id="handItemCapsule" class="hand-item-capsule spinning">❔</div>
   <div class="hand-draw-copy"><div id="handItemDrawName" class="hand-item-draw-name">道具滚动中…</div><div class="hand-item-draw-sub">预览全部道具 · 最终结果按当前排名权重计算</div></div>
   <div class="hand-item-progress"><div id="handItemProgressBar"></div></div>
 </div>`;
 let last=0;const total=3600;handItemDrawTimer={raf:true};
 function frame(now){
   if(!handItemDrawTimer)return;
   const t=Math.min(1,(now-handItemDrawStartedAt)/total),interval=72+300*Math.pow(t,2.35);
   const bar=document.getElementById('handItemProgressBar');if(bar)bar.style.width=(t*100)+'%';
   if(now-last>=interval){
     last=now;const k=roulettePreviewPickV282();
     const cap=document.getElementById('handItemCapsule'),name=document.getElementById('handItemDrawName');
     if(cap){cap.innerHTML=itemVisual(k);cap.animate([{opacity:.3,transform:'scale(.74)'},{opacity:1,transform:'scale(1)'}],{duration:145,easing:'cubic-bezier(.2,.8,.3,1)'})}
     if(name)name.textContent=ITEM_DEFS[k].name;
   }
   if(t<1){requestAnimationFrame(frame);return}
   handItemDrawTimer=null;
   const live=state.groups.find(x=>x.id===handItemDrawGroupId);
   if(!live||!eligibleForItems(live)||live.inventory.length>=3){cancelHandItemDraw(true);showToast('抽取结束前该组已不满足获得条件');renderHandRaise();return}
   const k=pickItemForGroupV281(live,new Set());handItemPendingKey=k;
   recordHistory(`${live.name} 举手奖励抽取 ${ITEM_DEFS[k].name}`);
   if(!addItemToGroup(live,k)){cancelHandItemDraw(true);showToast('道具加入失败');renderHandRaise();return}
   state.itemGlobal.totalDraws=(state.itemGlobal.totalDraws||0)+1;saveState();renderAll();
   const slot=live.inventory.length-1;
   box.innerHTML=`<div class="hand-item-draw-stage v281-horizontal">
     <div class="hand-draw-head" style="font-weight:950;color:#16a34a">🎁 获得道具</div>
     <div class="hand-item-capsule reveal">${itemVisual(k)}</div>
     <div class="hand-draw-copy"><div class="hand-item-draw-name">${ITEM_DEFS[k].name}</div><div class="hand-item-draw-sub">已放入 ${escapeHtml(live.name)} 的${slot===0?'主要道具栏':'次要道具栏 '+slot}</div></div>
     <div class="hand-item-result-actions"><button class="btn btn-primary" onclick="handUseNewItem()">🎒 查看道具</button><button class="btn btn-success" onclick="finishHandItemReward()">✓ 完成</button></div>
   </div>`;
 }
 requestAnimationFrame(frame);
}

/* 冰冻限制：下一次主动使用道具时拦截并解除。 */
const _v282UseItemWithIce=legacyUseItem;
legacyUseItem=function(groupId,index,...rest){
 const g=state.groups.find(x=>x.id===groupId);
 if(g?.itemEffect?.iceLock){
    // V2.11.5：冰冻阻止主动使用时，先立即关闭战术道具窗口。
    closeItemWindowForFx();
   g.itemEffect.iceLock=0;
   if(!Object.values(g.itemEffect).some(Boolean))g.itemEffect=null;
   saveState();renderAll();showToast(`${g.name} 处于冰冻状态，本次道具使用被取消`);
   return false;
 }
 return _v282UseItemWithIce.call(this,groupId,index,...rest);
}


/* ===== V2.8.3：26 种道具真正接入所有静态/动态页面 ===== */
const ITEM_ORDER_V283=[
 'green','triple_green','red','triple_red','spiny',
 'banana','triple_banana','horn','bobomb','hammer',
 'coin','coin_shell','question','mushroom','triple_mushroom',
 'boo','blooper','lightning','star','mega','bullet','power_mushroom',
 'feather','fire_flower','ice_flower','boomerang_flower'
];

/* 统一枚举器。旧页面有若干处把 26 种道具写死在 HTML 中，
   所以单纯 Object.assign(ITEM_DEFS) 并不会让它们自己长出来。 */
function itemKeysV283(){return ITEM_ORDER_V283.filter(k=>ITEM_DEFS[k])}

function itemAdminButtonV283(k,gid){
 const d=ITEM_DEFS[k];
 return `<button class="btn item-admin-add-v283" onclick="godAddItemV283(${gid},'${k}')">${itemVisual(k)} <span>${escapeHtml(d.name)}</span></button>`;
}
function godAddItemV283(gid,key){
 const g=state.groups.find(x=>x.id===gid);if(!g||!ITEM_DEFS[key])return;
 if(g.inventory.length>=3){showToast('该组的三个道具槽都已占用');return}
 if(Number(g.score)<0){showToast('负分状态禁止获得道具');return}
 recordHistory(`上帝模式：${g.name} 获得 ${ITEM_DEFS[key].name}`);
 if(addItemToGroup(g,key)){saveState();renderAll();renderGroupModalV283(gid)}
}

/* 道具页：每次打开/刷新组窗口时，强制用 26 种清单重建管理区。 */
function renderGodItemManagerV283(gid){
 const g=state.groups.find(x=>x.id===gid);if(!g)return;
 const roots=[...document.querySelectorAll('.god-item-manager,.item-god-manager,.god-item-grid')];
 let root=roots.find(x=>x.closest('.modal,.group-modal,.vista-window'))||roots[0];
 if(!root){
   const tactical=document.querySelector('.group-modal .tactical-tab-content,.group-modal [data-tab-content="items"],#groupModal .tactical-items');
   if(!tactical)return;
   root=document.createElement('div');root.className='god-item-manager god-item-grid';tactical.appendChild(root);
 }
 root.innerHTML=itemKeysV283().map(k=>itemAdminButtonV283(k,gid)).join('');
}

/* 找到“上帝模式·强制道具管理”标题后的按钮容器，兼容旧 DOM。 */
function patchVisibleGodManagerV283(gid){
 const all=[...document.querySelectorAll('body *')];
 const title=all.find(el=>el.children.length===0 && /上帝模式.*强制道具管理/.test(el.textContent||''));
 if(!title)return;
 let box=title.nextElementSibling;
 if(!box||box.children.length<3){
   box=document.createElement('div');box.className='god-item-grid';title.insertAdjacentElement('afterend',box);
 }
 box.innerHTML=itemKeysV283().map(k=>itemAdminButtonV283(k,gid)).join('');
}

/* 百科：直接重建内容，不再依赖旧版写死的 22 个卡片。 */
function renderEncyclopediaV283(){
 const headings=[...document.querySelectorAll('h1,h2,h3,.about-title,.section-title')];
 const h=headings.find(x=>/22\s*种道具百科|26\s*种道具百科/.test(x.textContent||''));
 if(!h)return;
 h.textContent='26 种道具百科';
 let host=h.nextElementSibling;
 if(!host)return;
 // 若 next sibling 是旧卡片，则定位包含连续百科卡片的父容器。
 const parent=h.parentElement;
 const candidates=[...parent.children];
 const start=candidates.indexOf(h)+1;
 const cards=candidates.slice(start).filter(x=>x.matches?.('.guide-block,.item-guide-card,.about-item-card,.encyclopedia-item') || x.querySelector?.('b,strong'));
 if(cards.length>=10){
   cards.forEach(x=>x.remove());
   itemKeysV283().forEach(k=>{
     const d=ITEM_DEFS[k],card=document.createElement('div');
     card.className='guide-block encyclopedia-item';
     card.innerHTML=`<b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc||'')}`;
     parent.appendChild(card);
   });
 }else{
   host.innerHTML=itemKeysV283().map(k=>{
     const d=ITEM_DEFS[k];
     return `<div class="guide-block encyclopedia-item"><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc||'')}</div>`;
   }).join('');
 }
}

/* 更可靠的百科补丁：从旧 22 个 ITEM_DEFS 名称定位连续卡片容器并追加缺失 4 项。 */
function appendMissingEncyclopediaV283(){
 document.querySelectorAll('h1,h2,h3').forEach(h=>{if(/22\s*种道具百科/.test(h.textContent||''))h.textContent='26 种道具百科'});
 const existingText=document.body.innerText||'';
 const about=document.querySelector('#aboutModal,.about-modal,#aboutWindow,.about-window')||document.body;
 const title=[...about.querySelectorAll('h1,h2,h3')].find(x=>/26\s*种道具百科/.test(x.textContent||''));
 if(!title)return;
 const parent=title.parentElement;
 ['feather','fire_flower','ice_flower','boomerang_flower'].forEach(k=>{
   const d=ITEM_DEFS[k];
   if((parent.innerText||'').includes(d.name))return;
   const card=document.createElement('div');card.className='guide-block encyclopedia-item';
   card.innerHTML=`<b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc)}`;
   parent.appendChild(card);
 });
}

/* 道具图标设置/百科等通过原 renderer 后追加缺失项。 */
function patchItemIconSettingsV283(){
 const setting=document.querySelector('#view-settings')||document;
 const labels=[...setting.querySelectorAll('*')].filter(x=>x.children.length===0 && /道具.*图标|自定义道具/.test(x.textContent||''));
 const anchor=labels[0];
 if(!anchor)return;
 const region=anchor.parentElement?.parentElement||anchor.parentElement;
 if(!region)return;
 const txt=region.innerText||'';
 ['feather','fire_flower','ice_flower','boomerang_flower'].forEach(k=>{
   const d=ITEM_DEFS[k];if(txt.includes(d.name))return;
   const row=document.createElement('div');row.className='setting-row item-icon-row v283-added';
   row.innerHTML=`<div><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><div class="setting-note">可使用自定义图片覆盖默认图标</div></div>
   <label class="btn">选择图片<input type="file" accept="image/*" hidden onchange="handleItemIconUpload('${k}',this)"></label>`;
   region.appendChild(row);
 });
}

/* 包装组窗口渲染函数。 */
function renderGroupModalV283(gid){
 setTimeout(()=>patchVisibleGodManagerV283(gid),0);
}
if(typeof openGroupModal==='function'){
 const _v283OpenGroupModal=openGroupModal;
 openGroupModal=function(gid,...a){const r=_v283OpenGroupModal.call(this,gid,...a);renderGroupModalV283(gid);return r}
}
if(typeof renderGroupModal==='function'){
 const _v283RenderGroupModal=renderGroupModal;
 renderGroupModal=function(...a){const r=_v283RenderGroupModal.apply(this,a);const gid=state.activeModalGroupId||activeEditingGroupId; if(gid!=null)renderGroupModalV283(gid);return r}
}

/* About/设置打开后再补一次，因为它们原来是静态 22 项。 */
const _v283OpenAbout=(typeof openAboutModal==='function'?openAboutModal:null);
if(_v283OpenAbout)openAboutModal=function(...a){const r=_v283OpenAbout.apply(this,a);setTimeout(()=>{appendMissingEncyclopediaV283()},0);return r}
window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
 appendMissingEncyclopediaV283();
 patchItemIconSettingsV283();
},80));


/* ===== V2.8.4：撤销 V2.8.3 临时追加式 UI，统一走原生 26 项 renderer ===== */
function refresh26ItemInterfacesV284(){
  ITEM_KEYS=Object.keys(ITEM_DEFS);
  document.querySelectorAll('.v283-added').forEach(x=>x.remove());

  // 设置页标题
  document.querySelectorAll('.setting-section-title,h1,h2,h3').forEach(x=>{
    if(/22\s*种道具百科/.test(x.textContent||''))x.textContent=(x.textContent||'').replace(/22\s*种道具百科/,'26 种道具百科');
    if(/22\s*种道具百科与图标管理/.test(x.textContent||''))x.textContent=(x.textContent||'').replace(/22\s*种/,'26 种');
  });

  // 使用原本设计好的 encyclopedia renderer，它现在读取的是刷新后的 ITEM_KEYS。
  try{renderItemEncyclopedia()}catch(e){}

  // 如果小组战术窗口正开着，原 renderer 也会自然生成 26 个管理按钮。
  try{if(typeof renderItemWindow==='function' && document.getElementById('itemWindow')?.classList.contains('active'))renderItemWindow()}catch(e){}
}

/* V2.8.3 的 append patch 会制造重复/突兀 UI，改为空操作。 */
appendMissingEncyclopediaV283=function(){};
patchItemIconSettingsV283=function(){};

/* 强制管理员按钮走原 godAddItem，不再维护第二套 DOM。 */
patchVisibleGodManagerV283=function(){};
renderGroupModalV283=function(){};

window.addEventListener('DOMContentLoaded',()=>setTimeout(refresh26ItemInterfacesV284,120));

/* About 每次切到百科时，修正标题；原静态百科后追加四项，但保持完全相同 guide-block 样式。 */
const _v284RenderAbout=renderAbout;
renderAbout=function(tab){
 const r=_v284RenderAbout(tab);
 if(tab==='items'){
   const m=document.getElementById('aboutMain');
   if(m){
     m.querySelectorAll('h1,h2,h3').forEach(h=>h.textContent=h.textContent.replace('26 种道具百科','26 种道具百科'));
     const txt=m.innerText||'';
     ['feather','fire_flower','ice_flower','boomerang_flower'].forEach(k=>{
       const d=ITEM_DEFS[k];
       if(txt.includes(d.name))return;
       const el=document.createElement('div');el.className='guide-block';
       el.innerHTML=`<b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escapeHtml(d.desc)}`;
       m.appendChild(el);
     });
   }
 }
 return r;
}



/* ===== V2.9.1 共产主义模式：道具功能总开关 =====
   名称按产品设定保留；实际行为只是控制整个道具系统是否启用/显示。
*/
const COMMUNISM_MODE_KEY='politics_communism_mode';
function isCommunismMode(){
  return STORAGE.getJSON(COMMUNISM_MODE_KEY,true)!==false;
}
function setCommunismMode(enabled){
  STORAGE.setJSON(COMMUNISM_MODE_KEY,!!enabled);
  applyCommunismMode();
  showToast(enabled?'共产主义模式已开启':'共产主义模式已关闭');
}
function applyCommunismMode(){
  const on=isCommunismMode();
  document.body.classList.toggle('items-disabled',!on);

  // Hide/show item-only dock controls and tabs whose legacy markup has no stable class.
  document.querySelectorAll('button,[role="button"],.dock-btn,.nav-btn').forEach(el=>{
    const t=(el.textContent||'').trim();
    const oc=el.getAttribute('onclick')||'';
    const itemOnly=/道具抽取|抽取道具|道具百科|道具与图标/.test(t) ||
      /globalItemDraw|openItemEncyclopedia/.test(oc);
    if(itemOnly){
      el.dataset.itemFeature='1';
      el.style.display=on?'':'none';
    }
  });

  // Group cards: inventory/slots are handled by CSS; close item window if feature gets disabled.
  if(!on){
    try{document.getElementById('itemWindow')?.classList.remove('active')}catch(e){}
    try{document.getElementById('itemBackdrop')?.classList.remove('active')}catch(e){}
  }
}

/* Hard guard: even stale buttons/hotkeys cannot invoke item functions while disabled. */
const _v291GlobalItemDraw=globalItemDraw;
globalItemDraw=function(...a){
  if(!isCommunismMode()){showToast('共产主义模式已关闭');return}
  return _v291GlobalItemDraw.apply(this,a);
};
const _v291UseItem=legacyUseItem;
legacyUseItem=function(...a){
  if(!isCommunismMode()){showToast('共产主义模式已关闭');return false}
  return _v291UseItem.apply(this,a);
};
if(typeof openItemWindow==='function'){
  const _v291OpenItemWindow=openItemWindow;
  openItemWindow=function(...a){
    if(!isCommunismMode()){showToast('共产主义模式已关闭');return}
    return _v291OpenItemWindow.apply(this,a);
  };
}

/* Add the switch to Function Settings using the same setting-card language. */
function installCommunismModeSetting(){
  let card=document.getElementById('communismModeSetting');
  const pane=document.getElementById('settingsV26_function');
  if(!pane)return;
  if(!card){
    card=document.createElement('div');
    card.id='communismModeSetting';
    card.className='setting-card setting-row ui-rule-card';
    card.innerHTML=`<div class="ui-rule-copy">
        <label class="ui-rule-title" for="communismModeToggle">☭ 共产主义模式</label>
        <div class="setting-note">道具功能总开关。关闭后，道具槽、道具抽取、道具管理、道具百科和相关入口都会隐藏；已有道具不会被删除。</div>
      </div>
      <label class="v292-switch" title="共产主义模式">
        <input id="communismModeToggle" type="checkbox" onchange="setCommunismMode(this.checked)">
        <span class="v292-switch-track"><span class="v292-switch-knob"></span></span>
      </label>`;
  }
  /* 必须属于“功能设置”pane，而不是 tabs 与 pane 之间的公共区域。 */
  if(card.parentElement!==pane) pane.prepend(card);
  const cb=card.querySelector('#communismModeToggle');
  if(cb)cb.checked=isCommunismMode();
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  installCommunismModeSetting();
  applyCommunismMode();
},160));


/* ===== V2.9.4 大数显示辅助 ===== */
function formatChartScoreV294(value){
  const n=Number(value)||0;
  const abs=Math.abs(n);
  // 条形图右侧最多显示 7 位整数；更大的数使用中文数量级，避免挤坏条形图。
  if(abs < 10000000) return String(Math.trunc(n));
  const sign=n<0?'-':'';
  const a=Math.abs(n);
  if(a>=100000000){
    const v=a/100000000;
    return sign+(v>=100 ? Math.round(v) : v.toFixed(v>=10?1:2).replace(/\.?0+$/,''))+'亿';
  }
  const v=a/10000;
  return sign+(v>=100 ? Math.round(v) : v.toFixed(v>=10?1:2).replace(/\.?0+$/,''))+'万';
}



/* ===== V2.9.9：持续状态道具重复使用 / 互斥 Toast =====
   持续型道具遵循“同一小组同一时间只能存在一种持续状态”。
   特别处理巨大蘑菇、炮弹刺客、强力蘑菇这类激活后仍留在道具槽中的道具：
   再次点击不会消耗、不会覆盖状态，只弹出阻止 Toast。
*/
(function installPersistentItemUseGuardV299(){
  if (typeof legacyUseItem !== 'function') return;

  const previousUseItemV299 = legacyUseItem;

  function activePersistentEffect(g){
    const type = g?.itemEffect?.type;
    if (!type) return null;
    const def = ITEM_DEFS[type];
    // 只把真正的持续型道具状态算作互斥状态。
    // featherDodge / iceLock 等附加标记不参与这一规则。
    if (def?.kind === 'status') return { key:type, def };
    return null;
  }

  legacyUseItem = function(groupId, index, ...rest){
    ensureItemState?.();

    const g = state.groups.find(x => x.id === groupId);
    const it = g?.inventory?.[index];
    const nextKey = it?.key;
    const nextDef = nextKey ? ITEM_DEFS[nextKey] : null;

    // 非持续型道具完全沿用原逻辑。
    if (!g || !nextDef || nextDef.kind !== 'status') {
      return previousUseItemV299.call(this, groupId, index, ...rest);
    }

    const active = activePersistentEffect(g);
    if (active) {
      // 即使本次使用被阻止，也要立刻退出小组/道具窗口，
      // 让用户回到比赛页看到当前持续状态；随后再给出 Toast。
      // 不调用原 useItem，因此不会消耗道具、播放使用动画或写入成功使用记录。
      closeItemWindowForFx();

      if (active.key === nextKey) {
        showToast(`「${active.def.name}」的持续状态仍在生效，不能重复使用`);
      } else {
        showToast(`当前已有「${active.def.name}」持续状态，结束前不能使用「${nextDef.name}」`);
      }
      return false;
    }

    return previousUseItemV299.call(this, groupId, index, ...rest);
  };
})();


/* ===== V2.11.3：羽毛 / 火之花 / 冰之花 / 回旋镖花统一最终处理器 =====
   旧版本这些道具由后追加 wrapper 接入，但随后又经历了多层 useItem 包装，
   导致功能与视觉演出存在断链。这里在最终 useItem 外再做一次权威分流。 */
(function installV2113ExtendedItemHandler(){
  if(typeof legacyUseItem!=='function') return;
  const previousUseItemV2113 = legacyUseItem;
  const EXT = new Set(['feather','fire_flower','ice_flower','boomerang_flower']);

  function cleanEmptyEffectV2113(g){
    if(!g?.itemEffect) return;
    for(const k of Object.keys(g.itemEffect)){
      if(g.itemEffect[k]===0 || g.itemEffect[k]===false || g.itemEffect[k]==null) delete g.itemEffect[k];
    }
    if(Object.keys(g.itemEffect).length===0) g.itemEffect=null;
  }

  function consumeChargeV2113(g,index){
    const it=g?.inventory?.[index];
    if(!it) return;
    it.charges=Math.max(0,(Number(it.charges)||1)-1);
    if(it.charges<=0) g.inventory.splice(index,1);
  }

  function randomTargetV2113(g){
    const pool=state.groups.filter(x=>x.id!==g.id && eligibleForItems(x));
    return pool.length ? pool[Math.floor(Math.random()*pool.length)] : null;
  }

  function attackFractionV2113(caster,target,denom,key){
    if(!target || !eligibleForItems(target)) return {changed:false,blocked:'invalid'};
    const amount=Math.round(Math.max(0,Number(target.score)||0)/denom);
    if(amount<=0) return {changed:false,blocked:null};
    return applyItemScore(target,-amount,caster.id,key);
  }

  legacyUseItem=function(groupId,index,...rest){
    const g=state.groups.find(x=>x.id===groupId);
    const it=g?.inventory?.[index];
    const key=it?.key;

    if(!EXT.has(key)) return previousUseItemV2113.call(this,groupId,index,...rest);

    // 延续 V2.11.1 规则：只要点“使用”，窗口立刻消失。
    closeItemWindowForFx();

    if(typeof isCommunismMode==='function' && !isCommunismMode()){
      showToast('共产主义模式已关闭');
      return false;
    }
    if(!g || !eligibleForItems(g)){
      showToast('负分状态严格禁止使用道具');
      return false;
    }

    // 冰冻锁会取消下一次主动道具使用，且本次不消耗所点击的道具。
    if(g.itemEffect?.iceLock){
      delete g.itemEffect.iceLock;
      cleanEmptyEffectV2113(g);
      saveState(); renderAll();
      showToast(`${g.name} 处于冰冻状态，本次道具使用被取消`);
      return false;
    }

    let used=false, targetText='';

    if(key==='feather'){
      g.itemEffect={...(g.itemEffect||{}),featherDodge:1};
      g.inventory.splice(index,1);
      used=true;
      targetText='下一次外部攻击可闪避';
    }

    else if(key==='fire_flower'){
      const t=randomTargetV2113(g);
      if(!t){ showToast('没有可攻击的小组'); return false; }
      attackFractionV2113(g,t,8,key);
      consumeChargeV2113(g,index);
      used=true;
      targetText=`目标：${t.name} · -1/8`;
    }

    else if(key==='ice_flower'){
      const t=randomTargetV2113(g);
      if(!t){ showToast('没有可攻击的小组'); return false; }
      const result=attackFractionV2113(g,t,10,key);
      // 只有攻击真正穿透防御时才附加冰冻，避免“明明挡住了却还是被冻结”。
      if(!result?.blocked){
        t.itemEffect={...(t.itemEffect||{}),iceLock:1};
      }
      consumeChargeV2113(g,index);
      used=true;
      targetText=result?.blocked ? `目标：${t.name} · 攻击被防御` : `目标：${t.name} · -1/10 并冻结`;
    }

    else if(key==='boomerang_flower'){
      const r=ranking(), p=r.findIndex(x=>x.id===g.id);
      const targets=[r[p-1],r[p+1]].filter(x=>x && eligibleForItems(x));
      if(!targets.length){ showToast('当前没有可命中的相邻小组'); return false; }
      targets.forEach(t=>attackFractionV2113(g,t,8,key));
      consumeChargeV2113(g,index);
      used=true;
      targetText='目标：'+targets.map(x=>x.name).join('、')+' · 各 -1/8';
    }

    if(!used) return false;

    recordHistory(`${g.name} 使用道具：${ITEM_DEFS[key].name}`);
    g.itemStats=g.itemStats||{};
    g.itemStats.used=(Number(g.itemStats.used)||0)+1;
    saveState();
    renderAll();
    showItemUseFx(key,g.id,targetText);
    showToast(`${g.name} 使用了 ${ITEM_DEFS[key].name}`);
    return true;
  };
})();


/* ===== V2.11.6：攻击发动 / 受击视觉系统 + 闪电重制 ===== */

/* 旧 V2.5 的键名有一部分仍沿用早期别名，这里统一补上当前真实 ITEM_DEFS 键名。 */
Object.assign(CARD_ITEM_FX_CLASS,{
  green:'cfx-green',
  triple_green:'cfx-green',
  red:'cfx-red',
  triple_red:'cfx-red',
  spiny:'cfx-spiny',
  horn:'cfx-horn',
  bomb:'cfx-bomb',
  question:'cfx-rise',
  mega:'cfx-giant',
  bullet:'cfx-bullet',
  power:'cfx-power',
  feather:'cfx-feather',
  fire_flower:'cfx-fireflower',
  ice_flower:'cfx-iceflower',
  boomerang_flower:'cfx-boomerang'
});
Object.assign(CARD_HIT_COLOR,{
  green:'#22c55e',
  triple_green:'#22c55e',
  red:'#ef4444',
  triple_red:'#ef4444',
  spiny:'#2563eb',
  banana:'#eab308',
  triple_banana:'#eab308',
  horn:'#f97316',
  bomb:'#ea580c',
  hammer:'#64748b',
  lightning:'#facc15',
  fire_flower:'#f97316',
  ice_flower:'#38bdf8',
  boomerang_flower:'#3b82f6'
});

/* 每种攻击族拥有不同的“被命中”语言，不再全部只是换边框颜色。 */
function attackHitClassV2116(key){
  if(['green','triple_green'].includes(key)) return 'hit-green-shell';
  if(['red','triple_red'].includes(key)) return 'hit-red-shell';
  if(key==='spiny') return 'hit-spiny';
  if(['banana','triple_banana'].includes(key)) return 'hit-banana';
  if(key==='horn') return 'hit-horn';
  if(key==='bomb') return 'hit-bomb-v2116';
  if(key==='hammer') return 'hit-hammer';
  if(key==='lightning') return 'hit-lightning';
  if(key==='fire_flower') return 'hit-fire';
  if(key==='ice_flower') return 'hit-ice';
  if(key==='boomerang_flower') return 'hit-boomerang';
  return 'hit-generic-v2116';
}

function clearAttackHitFxV2116(card){
  if(!card)return;
  [...card.classList].filter(x=>x.startsWith('hit-')).forEach(x=>card.classList.remove(x));
  card.classList.remove('card-defend-fx');
  card.style.removeProperty('--hitc');
}

/* 受击者动画。defended=true 时保留蓝色盾牌反馈，同时附加对应攻击的短促冲击。 */
function playAttackTargetFxV2116(groupId,key,defended=false){
 if(typeof DesktopUI!=='undefined'){DesktopUI.visualEvent(defended?'ITEM_DEFENDED':'ITEM_HIT',{groupId,key});if(!DesktopUI.getPreferences().itemFx||DesktopUI.getPreferences().motion==='off')return;}
  const card=battleCard(groupId);
  if(!card)return;
  clearAttackHitFxV2116(card);
  void card.offsetWidth;

  const cls=attackHitClassV2116(key);
  card.classList.add(cls);
  card.style.setProperty('--hitc',CARD_HIT_COLOR[key]||'#ef4444');

  if(defended) card.classList.add('card-defend-fx');

  const badge=document.createElement('div');
  badge.className='attack-hit-badge-v2116';
  const d=ITEM_DEFS[key];
  badge.innerHTML=`<span>${itemVisual(key)}</span><b>${defended?'已防御':'受到 '+(d?.name||'攻击')}</b>`;
  card.appendChild(badge);

  setTimeout(()=>{
    card.classList.remove(cls,'card-defend-fx');
    badge.remove();
    card.style.removeProperty('--hitc');
  },1750);
}

/* 用统一积分攻击入口捕获“真正命中 / 被普通防御挡下”的结果。
   setTimeout 放到 renderAll 之后执行，避免卡片刚加动画就被重绘掉。 */



/* 闪电专用防御：绝不经过普通龟壳、香蕉、喇叭或羽毛。
   只有害羞幽灵保护，以及正在生效的无敌星 / 巨大蘑菇可以挡住。 */
function tryDefendLightningV2116(target){
  // 害羞幽灵的一次性保护也可以挡闪电，并且优先于持续状态消耗。
  if(Number(target?.booShield||0)>0){
    target.booShield=Math.max(0,Number(target.booShield||0)-1);
    tinyDefenseToast(`${target.name} 的害羞幽灵保护阻挡了闪电`);
    setTimeout(()=>playAttackTargetFxV2116(target.id,'lightning',true),120);
    return true;
  }

  const type=target?.itemEffect?.type;
  if(!['star','mega'].includes(type)) return false;

  const name=ITEM_DEFS[type]?.name||'持续状态';
  target.itemEffect.hitsLeft=Math.max(0,Number(target.itemEffect.hitsLeft||0)-1);

  if(target.itemEffect.hitsLeft<=0){
    if(['mega','star'].includes(type)){
      const ix=target.inventory.findIndex(x=>x.key===type);
      if(ix>=0) target.inventory.splice(ix,1);
    }
    target.itemEffect=null;
  }

  tinyDefenseToast(`${target.name} 的${name}阻挡了闪电`);
  setTimeout(()=>playAttackTargetFxV2116(target.id,'lightning',true),120);
  return true;
}

function applyLightningHitV2116(caster,target){
  if(!target || !eligibleForItems(target)) return false;

  if(tryDefendLightningV2116(target)) return false;

  const before=Number(target.score)||0;
  target.score=before-roundHalf(before);
  target.displayScore=target.score;

  // 被劈中后所有背包道具直接消失。
  target.inventory=[];

  // 强力蘑菇的持续效果强制解除。
  if(target.itemEffect?.type==='power'){
    target.itemEffect=null;
  }

  setTimeout(()=>playAttackTargetFxV2116(target.id,'lightning',false),120);
  return true;
}

/* 攻击者也必须有视觉反馈。
   showItemUseFx 本身在成功使用后触发，这里补一层当前真实 key 的卡片发动效果。 */
const _v2116ShowItemUseFx=showItemUseFx;
showItemUseFx=function(key,casterId=null,targetText=''){
  if(casterId!=null && ITEM_DEFS[key]){
    setTimeout(()=>playCasterCardFx(key,casterId),30);
  }
  return _v2116ShowItemUseFx.call(this,key,casterId,targetText);
};


/* V2.11.9：开发期奖池完整性检查，避免以后再新增道具却忘了接概率表。 */
(function validateItemPoolCoverageV2119(){
  try{
    const sample=itemDropWeights(12,24);
    const missing=Object.keys(ITEM_DEFS).filter(k=>!(k in sample));
    if(missing.length) console.warn('道具权重池缺失：',missing);
  }catch(e){}
})();


/* ===== V2.12.0：主要道具 / 次要道具队列系统 =====
   规则：
   1. inventory[0] 永远是主要道具，只允许主要道具被主动使用；
   2. inventory[1]/[2] 为次要道具，严格按获得顺序晋升；
   3. 三重道具必须 charges 全部耗尽后才释放主栏；
   4. 无敌星 / 巨大蘑菇 / 强力蘑菇激活后都属于“卡手”主要道具，
      持续状态彻底结束前，后续道具不得晋升或使用；
   5. 被动防御同样只允许主要道具参与，避免次要道具绕过队列。
*/

function isQueuePersistentActiveV2120(g,it=null){
  const main=it||g?.inventory?.[0];
  if(!g?.itemEffect?.type||!main)return false;
  return ['star','mega','power'].includes(g.itemEffect.type) && main.key===g.itemEffect.type;
}

function queueRoleTextV2120(index){
  return index===0?'主要道具':`次要道具 ${index}`;
}

function queueUseStateV2120(g,index){
  const it=g?.inventory?.[index];
  if(!it)return {usable:false,label:'空道具槽'};
  if(index!==0)return {usable:false,label:'🔒 等待主要道具'};
  if(isQueuePersistentActiveV2120(g,it))return {usable:false,label:'⏳ 生效中 · 等待结束'};
  if(!eligibleForItems(g))return {usable:false,label:'负分保护'};
  if(state.isLocked)return {usable:false,label:'请先解锁管理口令'};
  const reason=Reliability.validateItem(state,g,index,isCommunismMode());
  if(reason)return {usable:false,label:reason};
  if(g.itemEffect?.iceLock)return {usable:true,label:'解除冻结（本次不发动）'};
  return {usable:true,label:'使用主要道具'};
}

/* 最终主动使用守门：即使旧 DOM、历史页面或脚本直接传入 index 1/2，也不能越过主要道具。 */
const _v2120UseItem=legacyUseItem;
legacyUseItem=function(groupId,index,...rest){
  const g=state.groups.find(x=>x.id===groupId);
  if(!g)return false;

  if(index!==0){
    closeItemWindowForFx();
    const main=g.inventory?.[0];
    showToast(main
      ? `「${ITEM_DEFS[main.key]?.name||'主要道具'}」尚未使用完，次要道具暂不可使用`
      : '当前没有可用的主要道具');
    return false;
  }

  const main=g.inventory?.[0];
  if(!main){
    closeItemWindowForFx();
    showToast('当前没有主要道具');
    return false;
  }

  if(isQueuePersistentActiveV2120(g,main)){
    closeItemWindowForFx();
    showToast(`「${ITEM_DEFS[main.key]?.name||'主要道具'}」的持续状态尚未结束，主要道具栏仍被占用`);
    return false;
  }

  return _v2120UseItem.call(this,groupId,0,...rest);
};

/* 管理员添加也只会排到队尾，不允许插队。 */
function godAddQueueItemV2120(gid,key){
  const g=state.groups.find(x=>x.id===gid);
  if(!g||!ITEM_DEFS[key])return;
  if(g.inventory.length>=3){showToast('主要 + 次要三个道具栏均已占用');return}
  if(!eligibleForItems(g)){showToast('负分状态禁止获得道具');return}
  recordHistory(`上帝模式：${g.name} 获得 ${ITEM_DEFS[key].name}`);
  if(addItemToGroup(g,key)){
    saveState();renderAll();renderItemWindow();
    const role=g.inventory.length===1?'主要道具':'次要道具';
    showToast(`${ITEM_DEFS[key].name} 已加入${role}栏`);
  }
}
function godClearQueueItemsV2120(gid){
  const g=state.groups.find(x=>x.id===gid);if(!g)return;
  recordHistory(`${g.name} 上帝模式清空道具队列`);
  g.inventory=[];g.itemEffect=null;g.booShield=0;
  saveState();renderAll();renderItemWindow();
}

/* 兼容旧管理员入口。 */
if(typeof godAddItem==='function')godAddItem=(id,k)=>godAddQueueItemV2120(id,k);
if(typeof godAddItemV283==='function')godAddItemV283=(id,k)=>godAddQueueItemV2120(id,k);
if(typeof godClearItems==='function')godClearItems=(id)=>godClearQueueItemsV2120(id);

/* 道具窗口重做为“主栏 + 次栏”层级，不再给三个道具都放可点击使用按钮。 */
const _v2120RenderItemWindow=renderItemWindow;
renderItemWindow=function(){
  _v2120RenderItemWindow();
  const g=state.groups.find(x=>x.id===activeItemGroupId);
  const body=document.getElementById('itemWindowBody');
  if(!g||!body||activeItemTab!=='items')return;

  const cards=[0,1,2].map(i=>{
    const it=g.inventory[i];
    const role=queueRoleTextV2120(i);
    if(!it){
      return `<div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} empty">
        <div class="queue-role-badge">${role}</div>
        <div class="item-big-icon">＋</div>
        <div class="item-big-name">空道具栏</div>
        <div class="item-big-desc">${i===0?'新获得的第一个道具会进入这里':'主要道具释放后，次要道具会按顺序自动晋升'}</div>
      </div>`;
    }
    const d=ITEM_DEFS[it.key];
    const st=queueUseStateV2120(g,i);
    const active=isQueuePersistentActiveV2120(g,it);
    return `<div class="item-big queue-item-card ${i===0?'queue-main-card':'queue-secondary-card'} ${active?'queue-persistent-active':''}">
      <div class="queue-role-badge">${role}${active?' · 卡手中':''}</div>
      <div class="item-big-icon">${itemVisual(it.key)}</div>
      <div class="item-big-name">${escapeHtml(d.name)}${it.charges>1?' ×'+it.charges:''}</div>
      <div class="item-big-desc">${escapeHtml(d.desc)}</div>
      ${i===0
        ? `<button class="btn btn-primary item-use queue-main-use" onclick="useItem(${g.id},0)" ${st.usable?'':'disabled'}>${st.label}</button>`
        : `<button class="btn item-use queue-secondary-lock" disabled>${st.label}</button>`}
    </div>`;
  }).join('');

  body.innerHTML=`<div class="queue-help-v2120">
      <b>道具队列</b>
      <span>最先获得的道具为主要道具。必须彻底用完主要道具后，次要道具才会按获得顺序自动晋升。</span>
    </div>
    <div class="item-inventory-grid queue-inventory-grid-v2120">${cards}</div>
    ${g.score<0?'<div class="queue-negative-note-v2120">负分保护生效：禁止使用或受到任何道具影响。</div>':''}`;

  if(!state.isLocked){
    const admin=document.createElement('div');
    admin.className='god-item-tools queue-god-tools-v2120';
    admin.innerHTML=`<b>🔓 上帝模式 · 现实编辑器</b>
      <div class="god-item-grid" style="margin-top:8px">
        ${Object.keys(ITEM_DEFS).map(k=>`<button class="btn btn-sm" onclick="godAddQueueItemV2120(${g.id},'${k}')">${itemVisual(k)} ${escapeHtml(ITEM_DEFS[k].name)}</button>`).join('')}
      </div>
      <button class="btn btn-sm btn-danger" style="margin-top:8px" onclick="godClearQueueItemsV2120(${g.id})">🧹 把道具桌面掀干净</button>`;
    body.appendChild(admin);
  }
};

/* 比赛卡片三个小格也明确显示“主 / 次 / 次”，并突出当前主要道具。 */
const _v2120EnhanceItemCards=enhanceItemCards;
const queueMainVisualCacheV2120=new Map();
enhanceItemCards=function(){
  _v2120EnhanceItemCards();
  state.groups.forEach(g=>{
    const card=document.querySelector(`.group-row-card[data-group-id="${g.id}"]`);
    if(!card)return;

    // 防御颜色只看主要道具，次要道具不再提前提供被动防御。
    card.classList.remove('item-def-green','item-def-red','item-def-yellow','item-def-orange');
    const main=g.inventory?.[0];
    if(main&&ITEM_DEFS[main.key]?.def)card.classList.add('item-def-'+ITEM_DEFS[main.key].def);

    const slots=[...card.querySelectorAll('.item-slot')];
    [0,1,2].forEach(i=>{
      const slot=slots[i];if(!slot)return;
      const it=g.inventory[i];
      slot.className=`item-slot ${i===0?'queue-main-slot':'queue-secondary-slot'} ${it?'':'empty'}`;
      if(it){
        const active=isQueuePersistentActiveV2120(g,it);
        if(active)slot.classList.add('queue-persistent-active');
        slot.title=`${queueRoleTextV2120(i)}：${ITEM_DEFS[it.key].name}${i>0?'（锁定，等待晋升）':''}`;
        slot.innerHTML=`<span class="queue-slot-role">${i===0?'主':'次'}</span>${itemVisual(it.key)}${it.charges>1?`<span class="charges">${it.charges}</span>`:''}`;
      }else{
        slot.title=queueRoleTextV2120(i)+'：空';
        slot.innerHTML=`<span class="queue-slot-role">${i===0?'主':'次'}</span><span class="queue-empty-plus">＋</span>`;
      }
    });

    const currentMain=main?`${main.key}:${main.acquiredAt||0}`:'';
    const prev=queueMainVisualCacheV2120.get(g.id);
    if(prev!==undefined && prev!==currentMain && currentMain && slots[0]){
      slots[0].classList.add('queue-promoted');
      setTimeout(()=>slots[0]?.classList.remove('queue-promoted'),1150);
    }
    queueMainVisualCacheV2120.set(g.id,currentMain);
  });
};

/* 举手抽奖完成后的文案改为队列语义。 */
const _v2120HandUseNewItem=handUseNewItem;
handUseNewItem=function(){
  const gid=handItemDrawGroupId;
  const g=state.groups.find(x=>x.id===gid);
  handItemDrawGroupId=null;handItemPendingKey=null;handItemDrawStartedAt=0;
  if(!g){showToast('新道具已不存在');return}
  closeHandRaise();
  openItemWindow(g.id,'items');
  if(g.inventory.length>1)showToast('新道具已进入次要道具栏，需要等待主要道具用完');
};

/* 页面加载时旧数据直接按 inventory 原顺序解释：最早获得/数组最前 = 主要道具。 */
window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  try{renderAll()}catch(e){}
},220));

