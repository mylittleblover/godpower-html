/* V2.18.4 道具百科：规则负责讲清楚，吐槽负责让人愿意看完。 */
const ITEM_FUNNY_COPY_V2184 = {
  mushroom:
    "朴实无华的加分工具。没有复杂的阴谋，没有精密的计算，吃下去就是涨分。甚至还能拿来躲刺龟壳，蘑菇本人对此可能也很困惑。",
  triple_mushroom:
    "一个蘑菇不够，那就三个。适合信奉“解决问题的方法是把同一个方法重复三遍”的小组。",
  green:
    "它不认识排名，也不认识恩怨，只会随机挑一个倒霉蛋扣分。真正贯彻了众生平等，只是被平等的那个人通常不太高兴。",
  triple_green:
    "当随机伤害一次还不够随机时，人类发明了随机伤害三次。每一发都可能创造新的友谊裂痕。",
  red: "它的人生目标非常明确：找你前面那一组。至于你已经第一名？那它就表演一个原地消失，主打一个钱花了但什么也没发生。",
  triple_red:
    "三次追着前一名跑，而且每发都会重新看排名。第一发把人打下去，第二发可能立刻改追另一个人。忠诚？不存在的。",
  banana:
    "专门照顾你后面那一组。领先不忘回头关怀，只是关怀方式是扣掉对方四分之一的分数。",
  triple_banana:
    "一根香蕉皮叫意外，三根香蕉皮叫基础设施建设。还能留在主要栏挡攻击，水果的职业发展令人敬佩。",
  horn: "既能轰上下邻居，又能防攻击，刺龟壳来了甚至还能现场问你“救不救”。一个喇叭承担了攻击、防御和人生选择题三份工作。",
  feather:
    "下一次攻击？不接。羽毛用最轻的体重完成了最干脆的拒绝，然后功成身退，连离职手续都不办。",
  fire_flower:
    "没有冻结，没有偷窃，没有哲学思考。随机找一组扣掉五分之一。火之花坚信，只要伤害够直接，机制介绍就可以早点下班。",
  ice_flower:
    "先扣五分之一，再把对方的道具按钮冻住。对方可以尝试使用道具来解冻，只不过那次使用会当场作废。所谓解冻费，概不退款。",
  boomerang_flower:
    "上一名打一遍，下一名也打一遍，然后回来准备再打一遍。它不是针对谁，它只是对“离你最近”这件事有很大意见。",
  bomb: "平时能炸人，放主要栏还能挡龟壳，真被摧毁了甚至还要顺便爆一下。属于那种“你最好别碰我，我自己也不知道会发生什么”的道具。",
  hammer:
    "只打排名比自己高的组，而且最多随机挑三个。终于有一件道具理解了追赶机制，而不是第十二名转头暴打第十四名。",
  spiny:
    "它不关心第二名是谁，也不接受调解。它只知道排行榜最上面住着一个需要被重点关照的对象。第一名的快乐通常到听见它出场为止。",
  coin: "没有随机，没有防御，没有状态栏。+2，然后结束。26 种道具里难得有一个愿意尊重大家的阅读时间。",
  coin_shell:
    "自己涨分还不忘带着前面所有人一起涨。看起来非常慷慨，直到你发现自己可能亲手把第一名送得更远。",
  question:
    "自己加四分之一，后面所有组也跟着加。它叫“？砖块”不是没有原因，因为用完以后你可能也会问一句：我刚才到底帮了谁？",
  boo: "有东西就偷上家的，没东西就自己领一个蘑菇，还顺带获得三次答题的防护。别的道具努力遵守课堂秩序，害羞幽灵选择直接研究规则漏洞。",
  blooper:
    "把分数、领奖台、图表和顶部排名统统变成“???”。它没有改变任何人的成绩，只是让所有人暂时失去知道成绩的权利。信息管理，非常先进。",
  lightning:
    "专门收拾排在你前面的所有组，还会把成功命中的目标分数砍半并清理资源。后排看见它叫翻盘，前排看见它叫系统维护。",
  star: "三次攻击防御，还会立即把主要道具槽腾出来。别的防御道具占位置，它甚至知道使用完以后把桌面收拾干净。",
  mega: "三次防御，但自己老老实实占着主要道具位。安全感很足，空间感没有。属于把整张沙发搬进教室来防身的思路。",
  bullet:
    "落后越多，它越认真工作。前面至少三组就直接追到前三名附近，实在没几个人可追就奔着第一名去。排名追赶部门的年度优秀员工。",
  power:
    "只有三次答题机会，答对就强制前进一名，答错也照样扣次数。它提供的是力量，不是知识。题不会做的话，蘑菇也只能沉默。",
  feather:
    "下一次外部攻击直接闪开。没有护盾耐久，没有复杂判定，只有一句礼貌而坚定的“不好意思，没打着”。",
};

const ITEM_FUNNY_TAG_V2184 = {
  mushroom: "稳健派的快乐",
  triple_mushroom: "数量解决一切",
  green: "随机受害者生成器",
  triple_green: "随机受害者生成器 ×3",
  red: "只认前一名",
  triple_red: "目标随排名漂移",
  banana: "回头关怀后排",
  triple_banana: "香蕉基础设施",
  horn: "攻防一体还要做选择题",
  feather: "这次攻击我不签收",
  fire_flower: "简单，直接，烫",
  ice_flower: "道具按钮冷静三题",
  boomerang_flower: "左右邻居共同富裕",
  bomb: "碰我之前请三思",
  hammer: "专锤领先者",
  spiny: "第一名专属快递",
  coin: "珍贵的正常道具",
  coin_shell: "慷慨得令人害怕",
  question: "用完大家一起问号",
  boo: "偷不到就自己领",
  blooper: "信息透明度：0%",
  lightning: "前排集体系统维护",
  star: "防完还记得腾位置",
  mega: "安全感占一个槽",
  bullet: "后排特快专线",
  power: "蘑菇不能替你答题",
};

/* 只改百科的展示文案，不污染小组详情里的精确规则说明。 */
const _v2184RenderAbout = renderAbout;
renderAbout = function (tab) {
  if (tab !== "items") return _v2184RenderAbout.call(this, tab);
  document
    .querySelectorAll("[data-about]")
    .forEach((b) => b.classList.toggle("active", b.dataset.about === tab));
  const m = document.getElementById("aboutMain");
  if (!m) return;
  m.innerHTML = `<div class="v2170-ency-head">
    <div><h2>26 种道具百科</h2><div class="v2170-ency-sub">规则很严肃，介绍决定不配合。</div></div>
    <button class="btn btn-sm" onclick="closeAbout()">关闭</button>
  </div>
  <div class="v218-ency-general">
    <b>📖 百科阅读须知：</b>
    这里的吐槽负责让你愿意把 26 种道具看完，下面的“实际效果”才负责在比赛时救你的命。
    第一次手动举手抽取仍使用特殊等概率池；答题期间主动使用道具后不能 All In；三重道具则可以继续消耗同一件道具的剩余次数。
    总之，规则不会因为文案开始讲冷笑话就放你一马。
  </div>
  <div class="v2170-ency-list">
    ${ITEM_ORDER_V218.filter((k) => ITEM_DEFS[k])
      .map((k) => {
        const d = ITEM_DEFS[k];
        const exact =
          (typeof GROUP_ITEM_DESC_V2182 !== "undefined" &&
            GROUP_ITEM_DESC_V2182[k]) ||
          (typeof ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715 !== "undefined" &&
            ITEM_ENCYCLOPEDIA_EFFECT_ONLY_V21715[k]) ||
          d.desc ||
          "";
        const funny =
          ITEM_FUNNY_COPY_V2184[k] ||
          "它有自己的工作，而且暂时没有向策划提交辞职申请。";
        const tag = ITEM_FUNNY_TAG_V2184[k] || "道具";
        const tip =
          (typeof ITEM_TIPS_V218 !== "undefined" && ITEM_TIPS_V218[k]) ||
          "根据排名和当前局势使用，别只因为图标好看就按。";
        return `<div class="v2170-ency-row">
        <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img")}</div>
        <div class="v2170-ency-copy">
          <div class="v2170-ency-name">${escapeHtml(d.name)} <span style="font-size:11px;font-weight:800;color:#0f766e;background:#eaf7f4;border-radius:999px;padding:3px 7px;margin-left:5px">${escapeHtml(tag)}</span></div>
          <div class="v2170-ency-desc" style="margin-top:7px;color:#334e49;line-height:1.65">${escapeHtml(funny)}</div>
          <div class="v218-ency-tip"><b>实际效果：</b>${escapeHtml(exact)}</div>
          <div class="v218-ency-tip" style="background:#fff8eb;color:#6f5830"><b style="color:#b66a00">使用技巧：</b>${escapeHtml(tip)}</div>
        </div>
      </div>`;
      })
      .join("")}
  </div>`;
};
