/* Declarative card contribution for the existing offline subject content. */
(function installOfficialMarxPoliticsPlugin(root) {
  "use strict";
  const manifest = {
    manifestVersion: 1,
    id: "official.marx-politics",
    name: { "zh-CN": "马克思的力量 · 思政课堂", en: "Marx Politics" },
    description: {
      "zh-CN": "管理首页的政治知识点与课堂挑战卡片。",
      en: "Owns the politics knowledge and classroom challenge cards on Home.",
    },
    author: { name: "GodPower Official" },
    version: "1.0.0",
    sdk: ">=1.0.0 <2.0.0",
    types: ["subject"],
    subjects: ["politics"],
    platforms: ["html", "electron"],
    entry: { content: "subjects/politics.json" },
    permissions: [{ capability: "ui.card.register", required: true }],
    dependencies: {},
    optionalDependencies: {},
    contributes: [
      {
        localId: "daily-knowledge",
        kind: "card",
        descriptor: {
          slot: "home.cards",
          renderer: "builtin.dashboard-card",
          titleKey: "home.card.politics.knowledge",
          dataSelector: ".gp-daily-knowledge",
          recommendedSize: { w: 6, h: 6 },
          emptyState: "没有可审核的知识点内容。",
        },
      },
      {
        localId: "daily-challenge",
        kind: "card",
        descriptor: {
          slot: "home.cards",
          renderer: "builtin.dashboard-card",
          titleKey: "home.card.politics.challenge",
          dataSelector: ".gp-daily-challenge",
          recommendedSize: { w: 6, h: 6 },
          emptyState: "没有可用的课堂挑战。",
        },
      },
    ],
    data: { schemaVersion: 1 },
  };
  root.GodpowerMarxPoliticsPlugin = Object.freeze({ manifest });
})(globalThis);
