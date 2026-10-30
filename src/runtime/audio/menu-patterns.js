const MENU_TRACK_KEYS = [
  "welcome_1",
  "welcome_2",
  "welcome_3",
  "welcome_4",
  "welcome_5",
  "welcome_6",
  "aux_history",
  "aux_archives",
  "aux_settings",
];
const MENU_SET_TRACK_TYPES = [
  { key: "welcome_1", name: "欢迎·个位张力", desc: "最高分个位数时播放" },
  { key: "welcome_2", name: "欢迎·十位张力", desc: "最高分十位数时播放" },
  { key: "welcome_3", name: "欢迎·百位张力", desc: "最高分百位数时播放" },
  { key: "welcome_4", name: "欢迎·千位张力", desc: "最高分千位数时播放" },
  { key: "welcome_5", name: "欢迎·万位张力", desc: "最高分万位数时播放" },
  {
    key: "welcome_6",
    name: "欢迎·更高位张力",
    desc: "最高分十万/百万级时播放",
  },
  { key: "aux_history", name: "历史记录·配乐", desc: "历史页专属配乐" },
  { key: "aux_archives", name: "结算档案·配乐", desc: "档案页专属配乐" },
  { key: "aux_settings", name: "系统设置·配乐", desc: "设置页专属配乐" },
];
const MENU_TRACK_META = {
  welcome_1: { name: "欢迎·个位张力", tension: 1 },
  welcome_2: { name: "欢迎·十位张力", tension: 2 },
  welcome_3: { name: "欢迎·百位张力", tension: 3 },
  welcome_4: { name: "欢迎·千位张力", tension: 4 },
  welcome_5: { name: "欢迎·万位张力", tension: 5 },
  welcome_6: { name: "欢迎·十万/百万级张力", tension: 6 },
  aux_history: {
    name: "历史记录·沉稳",
    tension: 0,
    density: 0.3,
    hat: 0.1,
    leadOct: 1,
  },
  aux_archives: {
    name: "结算档案·庄重",
    tension: 0,
    density: 0.36,
    hat: 0.22,
    leadOct: 2,
  },
  aux_settings: {
    name: "系统设置·中性",
    tension: 0,
    density: 0.26,
    hat: 0.3,
    leadOct: 1,
  },
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
  gainTrims: {},
};
MENU_TRACK_KEYS.forEach((k) => {
  MENU_AUDIO_DEFAULTS.gainTrims[k] = 1;
});
let menuCfg = {
  ...MENU_AUDIO_DEFAULTS,
  gainTrims: { ...MENU_AUDIO_DEFAULTS.gainTrims },
};
try {
  const saved = STORAGE.getJSON("politics_menu_audio_cfg", null);
  if (saved && typeof saved === "object") {
    menuCfg = {
      ...MENU_AUDIO_DEFAULTS,
      ...saved,
      gainTrims: {
        ...MENU_AUDIO_DEFAULTS.gainTrims,
        ...(saved.gainTrims || {}),
      },
    };
  }
} catch (e) {}
function saveMenuCfg() {
  STORAGE.setJSON("politics_menu_audio_cfg", menuCfg);
}

/* ---------- 合成器工具 ---------- */
function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SCALE_MAJOR = [0, 2, 4, 5, 7, 9, 11];
const CHORD_PROG = [0, 0, 9, 9, 5, 5, 7, 7];
const MENU_PATTERN_CACHE = {};

function buildMenuPattern(key, bars) {
  bars = Math.max(1, Number(bars) || 8);
  const cacheKey = key + ":" + bars;
  if (MENU_PATTERN_CACHE[cacheKey]) return MENU_PATTERN_CACHE[cacheKey];
  const meta = MENU_TRACK_META[key] || { tension: 1 };
  const rnd = mulberry32(
    key.split("").reduce((s, c) => s + c.charCodeAt(0), 7),
  );
  const stepsPerBar = 16;
  const totalSteps = bars * stepsPerBar;
  const tension = meta.tension;
  const density =
    meta.density !== undefined
      ? meta.density
      : tension >= 6
        ? 0.66
        : tension === 5
          ? 0.56
          : tension === 4
            ? 0.46
            : tension === 3
              ? 0.36
              : tension === 2
                ? 0.26
                : tension === 1
                  ? 0.18
                  : 0.28;
  const hatLevel =
    meta.hat !== undefined
      ? meta.hat
      : tension >= 6
        ? 0.85
        : tension === 5
          ? 0.7
          : tension === 4
            ? 0.55
            : tension === 3
              ? 0.4
              : tension === 2
                ? 0.25
                : tension === 1
                  ? 0.12
                  : 0.2;
  const leadOct =
    meta.leadOct !== undefined
      ? meta.leadOct
      : tension >= 5
        ? 3
        : tension >= 3
          ? 2
          : 1;
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
        lead[gs] =
          rootMidi + 12 + SCALE_MAJOR[deg] + oct * 12 + (leadOct - 1) * 12;
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
  opToken: 0,
};
