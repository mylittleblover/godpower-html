const AIKnowledge = (() => {
  const subjects = [
    "语文",
    "数学",
    "英语",
    "物理",
    "化学",
    "生物",
    "政治",
    "历史",
    "地理",
  ];
  function validate(d) {
    const keys = [
      "id",
      "title",
      "subject",
      "text",
      "kind",
      "sourceLabel",
      "sourceUrl",
      "license",
    ];
    if (
      !d ||
      typeof d !== "object" ||
      Array.isArray(d) ||
      Object.keys(d).some((k) => !keys.includes(k))
    )
      throw Error("资料字段无效");
    for (const k of keys)
      if (typeof d[k] !== "string") throw Error("资料字段缺失");
    if (
      !/^[\w.-]{1,100}$/.test(d.id) ||
      !d.title.trim() ||
      d.title.length > 160 ||
      !subjects.includes(d.subject) ||
      !d.text.trim() ||
      d.text.length > 200000 ||
      d.sourceLabel.length > 200 ||
      !d.sourceLabel ||
      !d.license ||
      d.license.length > 200 ||
      !["study-note", "textbook-link", "user-note"].includes(d.kind)
    )
      throw Error("资料内容或大小不受支持");
    if (d.sourceUrl) {
      let u;
      try {
        u = new URL(d.sourceUrl);
      } catch {
        throw Error("资料来源URL无效");
      }
      if (
        !["https:", "http:"].includes(u.protocol) ||
        u.username ||
        u.password ||
        u.href.length > 2000
      )
        throw Error("资料来源URL无效");
    }
    return JSON.parse(JSON.stringify(d));
  }
  function search(documents, query, { subject = "", limit = 4 } = {}) {
    if (typeof query !== "string" || query.length > 4000)
      throw Error("检索文字无效");
    const normalized = query.toLowerCase(),
      tokens = new Set(
        normalized.match(/[a-z0-9]+|[\u3400-\u9fff]{2,}/g) || [],
      );
    for (const s of [...tokens])
      if (/[\u3400-\u9fff]/.test(s))
        for (let i = 0; i < s.length - 1; i++) tokens.add(s.slice(i, i + 2));
    return documents
      .map(validate)
      .filter(
        (d) =>
          d.kind !== "textbook-link" && (!subject || d.subject === subject),
      )
      .map((d) => {
        const title = d.title.toLowerCase(),
          body = d.text.toLowerCase();
        let score = 0;
        for (const t of tokens)
          score += (title.includes(t) ? 4 : 0) + (body.includes(t) ? 1 : 0);
        return { d, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.d.id.localeCompare(b.d.id))
      .slice(0, Math.min(4, Math.max(0, limit)))
      .map(({ d }) => {
        let start = 0;
        const phrase = [...tokens].find((t) =>
          d.text.toLowerCase().includes(t),
        );
        if (phrase)
          start = Math.max(0, d.text.toLowerCase().indexOf(phrase) - 160);
        return { ...d, text: d.text.slice(start, start + 2600) };
      });
  }
  return Object.freeze({ subjects, validate, search });
})();
