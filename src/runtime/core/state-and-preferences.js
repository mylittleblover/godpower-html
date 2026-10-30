const DEFAULT_COLORS = [
  "#E5484D",
  "#2F7DD1",
  "#3A9D5D",
  "#F08C1A",
  "#8E44AD",
  "#18A6B8",
  "#4F64D8",
  "#D84A83",
  "#D95D39",
  "#159E91",
  "#6FA52E",
  "#A05BE5",
  "#C58B14",
  "#D94F70",
  "#2589BD",
  "#6F6BB2",
];

function readableTextOnColor(hex) {
  const raw = String(hex || "")
    .trim()
    .replace("#", "");
  const value =
    raw.length === 3
      ? raw
          .split("")
          .map((x) => x + x)
          .join("")
      : raw;
  if (!/^[0-9a-f]{6}$/i.test(value)) return "#FFFFFF";
  const rgb = [0, 2, 4]
    .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
    .map((v) =>
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
  const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  if (1.05 / (luminance + 0.05) >= 4.5) return "#FFFFFF";
  const ink = [23, 48, 45]
    .map((v) => v / 255)
    .map((v) =>
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
  const inkLuminance = 0.2126 * ink[0] + 0.7152 * ink[1] + 0.0722 * ink[2];
  if ((luminance + 0.05) / (inkLuminance + 0.05) >= 4.5) return "#17302D";
  return "#000000";
}

const FX_SOUND_SLOTS = [
  {
    id: "fullscreen_pick",
    name: "全屏点名揭晓",
    category: "全屏演出",
    desc: "全屏揭晓时播放；支持多段候选随机播放",
  },
  {
    id: "fullscreen_score_add",
    name: "全屏加分展示",
    category: "全屏演出",
    desc: "绿色全屏加分展示音效",
  },
  {
    id: "fullscreen_score_sub",
    name: "全屏扣分展示",
    category: "全屏演出",
    desc: "红色全屏扣分展示音效",
  },
  ...ActionSounds.slots,
  { id: "score_add", name: "基础加分 (+1 / +2)", desc: "复古方波金币音" },
  { id: "score_sub", name: "基础扣分 (-1 / -2)", desc: "低沉方波震动音" },
  { id: "pk_correct", name: "PK 普通答对 (+2)", desc: "双阶明亮钟鸣" },
  { id: "allin_win", name: "All in 胜出 (翻倍)", desc: "凯旋胜利琶音" },
  { id: "allin_lose", name: "All in 失败 (清零)", desc: "急坠爆炸杂音" },
  {
    id: "big_win",
    name: "🏆 分数位数突破 / 大题大额加分 (>=4)",
    desc: "大额欢庆长琶音（支持自定义上传）",
  },
  { id: "rewind", name: "撤销与历史回溯", desc: "急速反转扫频音" },
  { id: "ui_click", name: "按钮点选", desc: "复古微击音" },
  { id: "roll_tick", name: "点名滚动", desc: "打字机转盘刻度声（保留备用）" },
  {
    id: "roll_loop",
    name: "点名滚动循环",
    desc: "长串抽签连续循环音（无自定义时合成）",
  },
  { id: "roll_win", name: "点名定格", desc: "点名定格号角" },
];

const SET_TRACK_TYPES = [
  {
    key: "intro_normal",
    name: "常规 Intro 1",
    desc: "开局引子或无 All in 衔接",
  },
  {
    key: "intro_win",
    name: "胜利翻盘 Intro 2",
    desc: "上一题 All in 成功多于失败",
  },
  {
    key: "intro_loss",
    name: "挫败全灭 Intro 3",
    desc: "上一题 All in 失败多于成功",
  },
  {
    key: "thinking",
    name: "思考解谜轨 (Thinking Loop)",
    desc: "第 9 拍至 184 拍无尾音循环",
  },
  {
    key: "battle",
    name: "战斗核心轨 (Battle Loop)",
    desc: "第 9 拍至 184 拍无尾音循环",
  },
  {
    key: "victory",
    name: "胜利结算曲 (Victory Fanfare)",
    desc: "下一小节强拍单次播放并停机",
  },
  {
    key: "trans_0",
    name: "过门 1 (占用 1 拍)",
    desc: "距下一小节不足 2 拍时发力",
  },
  {
    key: "trans_1",
    name: "过门 2 (占用 2 拍)",
    desc: "距下一小节不足 3 拍时发力",
  },
  {
    key: "trans_2",
    name: "过门 3 (占用 3 拍)",
    desc: "距下一小节不足 4 拍时发力",
  },
  {
    key: "trans_3",
    name: "过门 4 (占用 4 拍/整小节)",
    desc: "距下一小节不足 1 拍时下小节起奏",
  },
];

// ===== v2 核心基础设施 =====
const STORAGE = {
  get(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (_) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch (_) {
      return false;
    }
  },
  getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  },
  setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));

let state = {
  isLocked: true,
  seasonId: StableIdentity.createSeasonId(),
  achievementLedger: AchievementLedger.empty(),
  hasStartedOnce: false,
  roundActive: false,
  lastRoundAllIn: null,
  adminPin: STORAGE.get("politics_admin_pin", "1234"),
  soundEnabled: true,
  masterVolume: parseFloat(STORAGE.get("politics_master_volume", "0.85")),
  zoomLevel: parseFloat(STORAGE.get("politics_zoom_level", "1.0")),
  resizerEnabled: STORAGE.getJSON("politics_resizer_enabled", false),
  resizerHeight: parseInt(STORAGE.get("politics_resizer_height", "120"), 10),
  columnMode: STORAGE.get("politics_column_mode", "double"),
  saveAllIn: STORAGE.getJSON("politics_save_allin", true),
  bpm: 130,
  beatsPerBar: 4,
  correctAns: "",
  evaluated: false,
  editingScoreId: null,
  activeModalGroupId: null,
  picker: {
    mode: "individual",
    antiRepeat: true,
    pickedStudentKeys: [],
    pickedGroupIds: [],
    preselectedGroupIds: [],
  },
  groups: [],
};

try {
  const saved = STORAGE.getJSON("politics_groups_data", null);
  if (saved) {
    state.groups = saved;
  }
  const parsedPicker = STORAGE.getJSON("politics_picker_state", null);
  if (parsedPicker && typeof parsedPicker === "object") {
    state.picker = { ...state.picker, ...parsedPicker };
  }
} catch (e) {}

if (!Array.isArray(state.groups) || state.groups.length === 0) {
  state.groups = [
    {
      id: 1,
      name: "第 1 组",
      color: "#e53935",
      score: 0,
      displayScore: 0,
      selectedOpt: "",
      allIn: false,
      resultText: "",
      animState: "",
      members: ["陈思远", "林子涵", "许文博"],
    },
    {
      id: 2,
      name: "第 2 组",
      color: "#1e88e5",
      score: 0,
      displayScore: 0,
      selectedOpt: "",
      allIn: false,
      resultText: "",
      animState: "",
      members: ["张晨阳", "罗心怡", "魏嘉豪"],
    },
    {
      id: 3,
      name: "第 3 组",
      color: "#43a047",
      score: 0,
      displayScore: 0,
      selectedOpt: "",
      allIn: false,
      resultText: "",
      animState: "",
      members: ["陆天宇", "谭静雅", "孙雨泽"],
    },
    {
      id: 4,
      name: "第 4 组",
      color: "#fb8c00",
      score: 0,
      displayScore: 0,
      selectedOpt: "",
      allIn: false,
      resultText: "",
      animState: "",
      members: ["董奕辰", "蒋雨欣", "汪浩然"],
    },
  ];
}

function normalizeGroup(raw, index = 0) {
  const source = raw && typeof raw === "object" ? raw : {};
  const numericScore = Number(source.score);
  let id = Number.isFinite(Number(source.id))
    ? Number(source.id)
    : Date.now() + index;
  if (!Number.isSafeInteger(id)) id = Date.now() + index;
  const color = /^#[0-9a-fA-F]{6}$/.test(String(source.color || ""))
    ? String(source.color)
    : DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  const members = Array.isArray(source.members)
    ? source.members.map((v) => String(v ?? "").trim()).filter(Boolean)
    : [];
  return {
    id,
    groupUid: StableIdentity.isValidGroupUid(source.groupUid)
      ? source.groupUid
      : StableIdentity.createGroupUid(),
    name:
      String(source.name ?? `第 ${index + 1} 组`).trim() ||
      `第 ${index + 1} 组`,
    color,
    score: Number.isFinite(numericScore) ? Math.trunc(numericScore) : 0,
    displayScore: 0,
    selectedOpt: ["A", "B", "C", "D"].includes(source.selectedOpt)
      ? source.selectedOpt
      : "",
    allIn: !!source.allIn,
    resultText: String(source.resultText ?? ""),
    animState: "",
    members,
    /* V2.8: these fields are persistent classroom data, not session-only UI state. */
    inventory: Array.isArray(source.inventory)
      ? source.inventory.map((it) => ({ ...it }))
      : [],
    itemStats: Reliability.normalizeStats(source.itemStats),
    itemEffect: Reliability.normalizeEffect(source.itemEffect),
    booShield: Number.isFinite(Number(source.booShield))
      ? Number(source.booShield)
      : 0,
    groupNo:
      Number.isSafeInteger(Number(source.groupNo)) && Number(source.groupNo) > 0
        ? Number(source.groupNo)
        : index + 1,
    booRoundsLeftV218: Math.max(
      0,
      Math.trunc(Number(source.booRoundsLeftV218) || 0),
    ),
    roundItemContinuationKeyV218: String(
      source.roundItemContinuationKeyV218 || "",
    ),
    itemUsedThisRound: !!source.itemUsedThisRound,
  };
}

function normalizeAllGroups(groups) {
  const seen = new Set();
  return StableIdentity.assignGroupUids(
    Array.isArray(groups) ? groups : [],
  ).map((raw, index) => {
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
  state.correctAns = "";
  state.editingScoreId = null;
  state.activeModalGroupId = null;
  state.groups = normalizeAllGroups(state.groups);
  state.picker.mode = ["individual", "group", "two_tier"].includes(
    state.picker.mode,
  )
    ? state.picker.mode
    : "individual";
  state.picker.antiRepeat = state.picker.antiRepeat !== false;
  state.picker.pickedStudentKeys = Array.isArray(state.picker.pickedStudentKeys)
    ? state.picker.pickedStudentKeys
    : [];
  state.picker.pickedGroupIds = Array.isArray(state.picker.pickedGroupIds)
    ? state.picker.pickedGroupIds
    : [];
  state.groups.forEach((g) => {
    g.displayScore = g.score;
    g.selectedOpt = "";
    g.allIn = false;
    g.resultText = "";
    g.animState = "";
  });
}
initSessionState();
// Startup must not overwrite existing classroom data before all adapters are ready.

const MAX_HISTORY = 40;
let historyStack = [];

let audioCtx = null;
let masterGainNode = null;
let musicGainNode = null;
let bgmVolume = Number(STORAGE.get("politics_bgm_volume", "1"));
if (!Number.isFinite(bgmVolume)) bgmVolume = 1;
bgmVolume = Math.max(0, Math.min(1, bgmVolume));
let db = null;
let customFxBuffers = {};
let customFxVariants = Object.create(null);
let currentUploadingAppend = false;
let currentUploadingGeneration = 0;
let activeSetBuffers = {};
let currentUploadingSlot = null;
let activeEditingGroupId = null;

let slotEngine = {
  isSpinning: false,
  timerGroup: null,
  timerStudent: null,
  chosenResult: null,
};

let bgmShufflePool = [];
let currentSetIndex = -1;
let isSwitchingRound = false;
let isStartingRound = false;

function checkAllInRatio() {
  const total = state.groups.length;
  if (total === 0) return false;
  const count = state.groups.filter((g) => g.allIn).length;
  return count / total >= 1 / 3;
}

// ===== 最终结算与档案处核心逻辑 =====
