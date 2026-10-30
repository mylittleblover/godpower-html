/* Pure presentation models. No classroom state mutations or network access. */
(function (root) {
  const examples = {
    knowledge: [
      {
        id: "politics-rule-law",
        subject: "politics",
        title: "权利与义务",
        module: "政治 · 法治观念",
        summary: "公民依法享有权利，也应依法履行义务。行使权利有边界。",
        mistake: "把“享有权利”理解成可以损害他人的合法权利。",
        detail:
          "结合课堂案例，区分个人权利与公共利益。这里是教学示例，不是教材原文。",
        source: "示例数据；依据《中华人民共和国宪法》第三十三条、第五十一条。",
      },
      {
        id: "politics-constitution",
        subject: "politics",
        title: "宪法的地位",
        module: "政治 · 宪法与法治",
        summary: "宪法是国家的根本法，具有最高的法律效力。",
        mistake: "把宪法与普通法律的法律效力混为一谈。",
        detail:
          "普通法律不得同宪法相抵触。可以用法律体系中的层级关系帮助理解。",
        source: "示例数据；依据《中华人民共和国宪法》序言。",
      },
    ],
    challenges: [
      {
        id: "politics-q1",
        subject: "politics",
        title: "下列哪项表述正确？",
        options: [
          "行使权利不受任何限制",
          "宪法是国家的根本法",
          "义务可以任意放弃",
          "普通法律可以与宪法相抵触",
        ],
        answer: 1,
        explanation: "宪法是国家的根本法，具有最高的法律效力。",
        source: "示例数据；依据《中华人民共和国宪法》序言。",
      },
      {
        id: "politics-q2",
        subject: "politics",
        title: "公民行使自由和权利时，应当怎样做？",
        options: [
          "同时尊重他人的合法权利",
          "只考虑个人意愿",
          "不必考虑公共利益",
          "可以违反法律",
        ],
        answer: 0,
        explanation:
          "行使自由和权利不得损害国家、社会、集体的利益和其他公民的合法自由和权利。",
        source: "示例数据；依据《中华人民共和国宪法》第五十一条。",
      },
    ],
  };
  function dayIndex(d = new Date()) {
    return Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000,
    );
  }
  function daily(list, date = new Date(), offset = 0) {
    return list.length
      ? list[
          (((dayIndex(date) + offset) % list.length) + list.length) %
            list.length
        ]
      : null;
  }
  function differences(before, after) {
    const a = new Map((before.groups || []).map((g) => [g.id, g])),
      b = new Map((after.groups || []).map((g) => [g.id, g]));
    const rank = (groups) =>
      new Map(
        [...groups]
          .sort((x, y) => Number(y.score) - Number(x.score))
          .map((g, i) => [g.id, i + 1]),
      );
    const ra = rank(before.groups || []),
      rb = rank(after.groups || []);
    return [...new Set([...a.keys(), ...b.keys()])].map((id) => {
      const x = a.get(id),
        y = b.get(id);
      return {
        id,
        name: y?.name || x?.name,
        before: x?.score ?? null,
        after: y?.score ?? null,
        delta: x && y ? Number(y.score) - Number(x.score) : null,
        rankBefore: ra.get(id),
        rankAfter: rb.get(id),
        inventoryBefore: x?.inventory || [],
        inventoryAfter: y?.inventory || [],
        effectsBefore: {
          ...(x?.itemEffect || {}),
          booShield: x?.booShield || 0,
          booRoundsLeftV218: x?.booRoundsLeftV218 || 0,
        },
        effectsAfter: {
          ...(y?.itemEffect || {}),
          booShield: y?.booShield || 0,
          booRoundsLeftV218: y?.booRoundsLeftV218 || 0,
        },
        added: !x,
        removed: !y,
      };
    });
  }
  function validateBank(value) {
    if (
      !value ||
      !Array.isArray(value.knowledge) ||
      !Array.isArray(value.challenges) ||
      value.knowledge.length + value.challenges.length > 500
    )
      throw Error("题库须包含 knowledge、challenges 数组，合计最多 500 条");
    const ids = new Set();
    for (const row of [...value.knowledge, ...value.challenges]) {
      if (
        !row ||
        typeof row.id !== "string" ||
        !row.id.trim() ||
        typeof row.title !== "string" ||
        !row.title.trim() ||
        typeof row.subject !== "string" ||
        !row.subject.trim() ||
        typeof row.source !== "string" ||
        !row.source.trim()
      )
        throw Error("每项须含 id、title、subject 和 source 来源");
      if (ids.has(row.id.trim())) throw Error("题库 id 不可重复：" + row.id);
      ids.add(row.id.trim());
      for (const field of ["module", "summary", "mistake", "detail"])
        if (field in row && typeof row[field] !== "string")
          throw Error(field + " 必须是文本");
      if (
        Object.values(row).some(
          (v) => typeof v === "string" && v.length > 10000,
        )
      )
        throw Error("单字段不能超过 10000 字符");
    }
    for (const q of value.challenges) {
      if (
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        q.options.some(
          (x) => typeof x !== "string" || !x.trim() || x.length > 10000,
        ) ||
        !Number.isInteger(q.answer) ||
        q.answer < 0 ||
        q.answer > 3 ||
        typeof q.explanation !== "string"
      )
        throw Error("题目须有四个文本选项、0–3 正确答案及 explanation 解析");
    }
    return value;
  }
  // Input order comes from the canonical ranking(); this model never sorts or mutates it.
  function standings(ordered) {
    const scores = ordered.map((g) => Number(g.score) || 0);
    const total = scores.every(Number.isSafeInteger)
      ? scores.reduce((sum, value) => sum + BigInt(value), 0n).toString()
      : String(scores.reduce((sum, value) => sum + value, 0));
    return {
      count: ordered.length,
      total,
      highest: scores[0] ?? 0,
      leader: ordered[0]?.name ?? "—",
    };
  }
  // Preserve the selected paint; only the foreground changes for pale fills.
  function badgeColors(color) {
    let raw = String(color || "").replace(/^#/, "");
    if (raw.length === 3)
      raw = raw
        .split("")
        .map((v) => v + v)
        .join("");
    if (!/^[a-f0-9]{6}$/i.test(raw))
      return { background: "#607773", foreground: "#FFFFFF" };
    const linear = raw
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    const luminance = linear.reduce(
      (sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i],
      0,
    );
    return {
      background: "#" + raw,
      foreground: luminance > 0.45 ? "#000000" : "#FFFFFF",
    };
  }
  root.GodpowerUIModel = {
    examples,
    badgeColors,
    standings,
    dayIndex,
    daily,
    differences,
    validateBank,
  };
})(globalThis);
