/* ===== V2.17.15：道具百科只保留功能 / 效果介绍 =====
   百科不再展示排名区间、权重、冷却轮次、唯一性、抽取频率等“怎么抽到”的信息。
   这些抽取规则仍然保留在实际游戏逻辑中，只是不再出现在百科正文。 */

const ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715 = {
  green:
    "随机攻击其他小组，扣除其当前积分的 1/4；作为主要道具时可抵挡一次常规攻击。",
  triple_green:
    "拥有 3 次绿龟壳使用次数；每次可随机攻击其他小组并扣除其当前积分的 1/4，也可作为主要道具逐次防御。",
  red: "攻击当前排名正上方的小组，扣除其当前积分的 1/3；作为主要道具时可抵挡一次常规攻击。",
  triple_red:
    "拥有 3 次红龟壳使用次数；每次攻击当前排名正上方的小组，也可作为主要道具逐次防御。",
  spiny:
    "锁定当前第一名，命中时扣除其当前积分的 1/2；命中前会摧毁其主要栏中的基础防御道具。若摧毁炸弹兵，会触发爆炸。",
  banana:
    "攻击当前排名正下方的小组，扣除其当前积分的 1/4；作为主要道具时可抵挡一次常规攻击。",
  triple_banana:
    "拥有 3 次香蕉皮使用次数；每次攻击当前排名正下方的小组，也可作为主要道具逐次防御。",
  horn: "同时攻击当前排名相邻的上方和下方小组，各扣除其当前积分的 1/4；作为主要道具时可抵挡包括刺龟壳在内的一次攻击。",
  bomb: "随机攻击一个目标及其实际排名相邻小组，各扣除当前积分的 1/4。作为主要道具时可抵挡红 / 绿龟壳；无论用于防御还是被特殊效果摧毁，都会爆炸并波及自身排名相邻组，自身不受爆炸影响。",
  hammer: "随机攻击 3 个不同的其他小组，每个目标扣除当前积分的 1/4。",
  coin: "立即获得 2 分。",
  coin_shell:
    "自己增加当前积分的 1/4，同时所有排名高于自己的小组也增加当前积分的 1/4。",
  question:
    "自己增加当前积分的 1/4，同时所有排名低于自己的小组也增加当前积分的 1/4。",
  mushroom: "自己增加当前积分的 1/4；作为主要道具时可主动消耗以闪避刺龟壳。",
  triple_mushroom:
    "拥有 3 次蘑菇使用次数；每次可增加自身当前积分的 1/4，并可逐次用于刺龟壳闪避。",
  boo: "偷取当前排名正上方小组最新获得的一件道具，并获得一次攻击防护。",
  blooper: "暂时遮蔽全场积分、领奖台和图表信息，使其显示为未知状态。",
  lightning:
    "攻击所有排名高于自己的小组；未被防御的目标积分减半，并清除其道具与部分持续效果。",
  star: "使用后立即释放主要道具栏，并获得可抵挡 3 次攻击的无敌状态。无敌状态下超越上方小组时，会压制对方并摧毁其主要栏中的基础防御道具。",
  mega: "进入巨大状态并抵挡接下来 3 次攻击。巨大状态下超越上方小组时，会压制对方并摧毁其主要栏中的基础防御道具。",
  bullet:
    "强力追赶。若前方至少有 3 组，积分直接提升到前方第 3 组的积分 +1；不足 3 组时提升到第一名积分 +1；已经第一名时则 +1 分。",
  power:
    "效果持续 3 次答题；每次答题都会消耗 1 次，答对时强制向前提升 1 个排名，答错不发动。",
  feather: "获得一次外部攻击闪避机会，可在受到攻击时自动规避本次效果。",
  fire_flower:
    "拥有 3 次火之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/4。",
  ice_flower:
    "拥有 3 次冰之花攻击次数；每次随机攻击一个其他小组，扣除其当前积分的 1/5，并冻结其主动道具；主动尝试使用会解除，若不用则 3 次答题后自动解除。",
  boomerang_flower:
    "拥有 3 次回旋镖攻击次数；每次攻击当前排名紧邻自己的上方和下方小组，各扣除其当前积分的 1/5。命中前会摧毁目标主要栏中的基础防御道具；炸弹兵被摧毁时会爆炸。",
};

/* 重新接管百科渲染，其他“程序信息 / 核心功能指南”页保持原样。 */
const _v21715RenderAbout = renderAbout;
renderAbout = function (tab) {
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));

  const m = document.getElementById("aboutMain");
  if (!m) return;

  if (tab !== "items") {
    return _v21715RenderAbout.call(this, tab);
  }

  m.innerHTML = `<div class="v2170-ency-head">
      <div>
        <h2>28 种道具百科</h2>
        <div class="v2170-ency-sub">仅介绍道具功能与实际效果。</div>
      </div>
      <button class="btn btn-sm" onclick="closeAbout()">关闭</button>
    </div>
    <div class="v2170-ency-list">
      ${ITEM_KEYS.map((k) => {
        const d = ITEM_DEFS[k];
        const desc = ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k] || d.desc || "";
        return `<div class="v2170-ency-row">
          <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img")}</div>
          <div class="v2170-ency-copy">
            <div class="v2170-ency-name">${escapeHtml(d.name)}</div>
            <div class="v2170-ency-desc">${escapeHtml(desc)}</div>
          </div>
        </div>`;
      }).join("")}
    </div>`;
};
