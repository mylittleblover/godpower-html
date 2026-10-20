/* Trusted declarative catalog entry for the official gameplay plugin. */
(function installOfficialMiyamotoPlugin(root) {
  "use strict";
  const manifest = {
    manifestVersion: 1,
    id: "official.miyamotos-power",
    name: { "zh-CN": "宫本茂的力量", en: "Miyamoto's Power" },
    description: {
      "zh-CN":
        "课堂道具玩法与百科。当前阶段仅迁移入口和功能开关，竞技规则仍由原业务内核执行。",
      en: "Classroom item gameplay and encyclopedia. This stage migrates entry points and the feature toggle only.",
    },
    author: { name: "GodPower Official" },
    version: "1.0.0",
    sdk: ">=1.0.0 <2.0.0",
    types: ["gameplay"],
    subjects: [],
    platforms: ["html", "electron"],
    entry: { content: "gameplay/items.json" },
    permissions: [
      { capability: "ui.page.register", required: true },
      { capability: "ui.settings.register", required: true },
      { capability: "ui.card.register", required: true },
    ],
    dependencies: {},
    optionalDependencies: {},
    contributes: [
      {
        localId: "items",
        kind: "page",
        descriptor: {
          titleKey: "plugin.miyamoto.items",
          renderer: "builtin.plugin-workspace",
        },
      },
      {
        localId: "settings",
        kind: "settings",
        descriptor: {
          slot: "settings.pluginLinks",
          renderer: "builtin.plugin-workspace",
          titleKey: "plugin.miyamoto.settings",
          schema: { type: "object", properties: {} },
        },
      },
      {
        localId: "daily-item-tip",
        kind: "card",
        descriptor: {
          slot: "home.cards",
          renderer: "builtin.dashboard-card",
          titleKey: "home.card.miyamoto.dailyItem",
          dataSelector: ".gp-daily-item",
          recommendedSize: { w: 6, h: 6 },
          emptyState: "当前没有可展示的道具知识。",
        },
      },
    ],
    data: { schemaVersion: 1 },
  };
  root.GodpowerMiyamotoPlugin = Object.freeze({ manifest });
})(globalThis);
