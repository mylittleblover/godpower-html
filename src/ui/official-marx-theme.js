/* Trusted, declarative catalog entry for the official Marx appearance plugin. */
(function installOfficialMarxTheme(root) {
  "use strict";
  const manifest = {
    manifestVersion: 1,
    id: "official.marx-theme",
    name: { "zh-CN": "马克思主题", en: "Marx Theme" },
    description: {
      "zh-CN": "提供马克思的力量受控主题令牌。",
      en: "Provides the Marx visual theme tokens.",
    },
    author: { name: "GodPower Official" },
    version: "1.0.0",
    sdk: ">=1.0.0 <2.0.0",
    types: ["theme"],
    subjects: [],
    platforms: ["html", "electron"],
    entry: { theme: "themes/marx.json" },
    permissions: [{ capability: "ui.theme.register", required: true }],
    dependencies: {},
    optionalDependencies: {},
    contributes: [
      {
        localId: "marx",
        kind: "theme",
        descriptor: {
          displayNameKey: "theme.marx.name",
          tokens: {
            "--ui-primary": "#a91e2c",
            "--ui-primary-hover": "#831924",
            "--ui-accent": "#b26519",
            "--ui-accent-hover": "#874a12",
            "--ui-bg": "#faf6f1",
            "--ui-panel": "#fffdfa",
            "--ui-soft": "#f9eae6",
            "--ui-soft-2": "#fcf5f0",
            "--ui-text": "#382624",
            "--ui-muted": "#77534b",
            "--ui-border": "#e3cec5",
            "--ui-border-strong": "#c59d8e",
          },
        },
      },
    ],
    data: { schemaVersion: 1 },
  };
  root.GodpowerMarxThemePlugin = Object.freeze({ manifest });
})(globalThis);
