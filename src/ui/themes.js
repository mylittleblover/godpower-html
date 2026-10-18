/* Theme composition owns appearance only. No classroom state or business commands. */
window.GodpowerTheme = (() => {
  "use strict";
  const KEY = "godpower_appearance_v1";
  const names = { classic: "上帝的力量", marx: "马克思的力量" };
  const star =
    "m12 2 2.8 6.2 6.7.8-5 4.7 1.4 6.7-5.9-3.3-5.9 3.3 1.4-6.7-5-4.7 6.7-.8Z";
  const paths = {
    home: "M3 11 12 4l9 7M5 10v11h14V10M9 21v-7h6v7M12 1v3",
    battle: "M4 20 16 8m-4-4 8 8m-8-8 4-3 7 7-3 4M2 16l6 6M3 3l6 3-3 3Z",
    history: "M4 12a8 8 0 1 0 3-6M3 3v6h6M12 7v5l4 3M10 22h4",
    archive: "M5 4h14v16H5ZM3 20h18M9 4V2h6v2M8 9l2 2 2-4 2 4 2-2M9 16h6",
    settings:
      "M8 3h8l2 4 4 1v8l-4 1-2 4H8l-2-4-4-1V8l4-1ZM12 8l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.4-2.5 1.4.5-2.8-2-2 2.8-.4Z",
    users:
      "M3 21v-3q4-5 8 0v3m2 0v-3q4-5 8 0v3M7 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6m10 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6M12 2v3",
    spark: star,
    sound: "M4 10h4l10-6v16L8 14H4ZM8 14v7h4v-5M21 8v8",
    book: "M12 5Q6 2 2 5v15q6-3 10 0 6-3 10 0V5q-6-3-10 0v15M6 8l3 1m6 0 3-1",
    shield:
      "M12 2 3 6v6q0 7 9 10 9-3 9-10V6ZM12 6l1.4 3 3.3.4-2.4 2.3.7 3.3-3-1.7-3 1.7.7-3.3-2.4-2.3 3.3-.4Z",
    arrow: "m8 5 7 7-7 7M4 12h11",
    gift: "M3 9h18v5H3Zm2 5v8h14v-8M12 9v13M12 9C2 9 5 0 9 4Zm0 0c10 0 7-9 3-5Z",
  };
  const emblem = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="红星麦穗徽记"><rect width="64" height="64" rx="15" fill="#a91e2c"/><g fill="none" stroke="#ffe0a0" stroke-width="2"><path d="M24 53Q5 42 14 22m26 31q19-11 10-31M14 34l-6-4m7 11-6-2m10 9-7-1M50 34l6-4m-7 11 6-2m-10 9 7-1"/></g><path d="m32 10 4.6 10 11 1.2-8.2 7.7 2.2 11L32 34.4l-9.6 5.3 2.2-11-8.2-7.7 11-1.2Z" fill="#ffe0a0"/><path d="M24 49h16M27 54h10" stroke="#ffe0a0" stroke-width="2"/></svg>`;
  let theme = "classic",
    active = null,
    classicBrand = null,
    classicIcon = null;
  try {
    if (JSON.parse(localStorage.getItem(KEY))?.theme === "marx") theme = "marx";
  } catch (error) {
    /* Appearance storage may be unavailable; classroom storage is untouched. */
  }
  const classics = new Map();
  function icon(name, fallback) {
    if (!classics.has(name)) classics.set(name, fallback);
    const path = theme === "marx" ? paths[name] || star : fallback;
    return `<svg class="ui-icon" data-theme-icon="${name}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function name() {
    return names[theme];
  }
  function boot() {
    document.documentElement.dataset.theme = theme;
    document.body?.classList.toggle("theme-marx", theme === "marx");
    if (document.body) document.body.dataset.theme = theme;
  }
  function apply() {
    boot();
    document.title = name() + " V@@VERSION@@";
    const label = document.querySelector(".gp-brand-label");
    if (label?.firstChild?.nodeType === Node.TEXT_NODE)
      label.firstChild.textContent = name() + " ";
    const title = document.getElementById("gpIntroTitle");
    if (title) title.textContent = name();
    document
      .getElementById("gpIntro")
      ?.setAttribute("aria-label", "滑动解锁进入" + name());
    document
      .querySelector(".gp-home")
      ?.setAttribute("aria-label", name() + "首页");
    const foot = document.querySelector(".gp-footnote");
    if (foot) foot.textContent = name() + " · 让每一次参与都有力量";
    const svg = document.querySelector("#gpBrandMount svg,#gpIntroLogo svg");
    if (svg) {
      if (classicBrand === null) classicBrand = svg.innerHTML;
      svg.innerHTML =
        theme === "marx"
          ? emblem.slice(emblem.indexOf(">") + 1, emblem.lastIndexOf("</svg>"))
          : classicBrand;
      svg.setAttribute(
        "viewBox",
        theme === "marx" ? "0 0 64 64" : "0 0 512 512",
      );
    }
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      classicIcon ??= favicon.href;
      favicon.href =
        theme === "marx"
          ? "data:image/svg+xml," + encodeURIComponent(emblem)
          : classicIcon;
    }
    for (const svg of document.querySelectorAll(".ui-icon[data-theme-icon]")) {
      const key = svg.dataset.themeIcon;
      svg
        .querySelector("path")
        ?.setAttribute(
          "d",
          theme === "marx" ? paths[key] || star : classics.get(key),
        );
    }
    for (const button of document.querySelectorAll("[data-appearance-theme]"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.appearanceTheme === theme),
      );
    if (typeof updateWelcomeClock === "function") updateWelcomeClock();
    // Dedicated event is consumed by presentation transports only.
    window.dispatchEvent(
      new CustomEvent("godpower:theme", { detail: { theme, name: name() } }),
    );
  }
  function cancel() {
    if (!active) return;
    const current = active;
    active = null;
    for (const animation of current.animations) animation.cancel();
    current.element.remove();
    current.resolve();
  }
  function set(next, { animate = true } = {}) {
    if (!Object.hasOwn(names, next)) return Promise.resolve({ ok: false });
    cancel();
    theme = next;
    let persisted = true;
    try {
      localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, theme }));
    } catch (error) {
      persisted = false;
      window.showToast?.("主题仅在本次生效：界面偏好保存失败");
    }
    const prefs =
      typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : {};
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      !animate ||
      reduce ||
      prefs.motion === "off" ||
      prefs.motion === "simple" ||
      !document.body.animate
    ) {
      apply();
      return Promise.resolve({ ok: true, persisted });
    }
    const overlay = document.createElement("div");
    overlay.id = "gpThemeTransition";
    overlay.className = "gp-theme-transition";
    overlay.dataset.target = theme;
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-label", "正在切换至" + name());
    overlay.innerHTML = `<div class="gp-theme-ribbon" aria-hidden="true"></div><div class="gp-theme-transition-content">${emblem}<h2>${name()}</h2><p>KNOWLEDGE IS POWER · 知识就是力量</p></div><button type="button" id="gpThemeSkip" class="ui-cinematic-skip">跳过动画</button>`;
    document.body.append(overlay);
    const result = new Promise((resolve) => {
      active = {
        element: overlay,
        animations: [],
        resolve: () => resolve({ ok: true, persisted }),
      };
    });
    const current = active;
    document.getElementById("gpThemeSkip").onclick = cancel;
    apply();
    // A rare theme change earns a short ceremonial reveal; normal use remains instant.
    const motion = overlay.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.24 },
        { opacity: 1, offset: 0.6 },
        { opacity: 0 },
      ],
      { duration: 960, easing: "cubic-bezier(0.23,1,0.32,1)" },
    );
    const content = overlay
      .querySelector(".gp-theme-transition-content")
      .animate(
        [
          { opacity: 0, transform: "translateY(24px) scale(.95)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 500, easing: "cubic-bezier(0.23,1,0.32,1)" },
      );
    const ribbon = overlay.querySelector(".gp-theme-ribbon").animate(
      [
        { transform: "translateX(-35%) rotate(-12deg)", opacity: 0 },
        { transform: "translateX(0) rotate(-12deg)", opacity: 1, offset: 0.45 },
        { transform: "translateX(35%) rotate(-12deg)", opacity: 0 },
      ],
      { duration: 960, easing: "cubic-bezier(0.77,0,0.175,1)" },
    );
    current.animations.push(motion, content, ribbon);
    motion.finished
      .then(() => {
        if (active === current) cancel();
      })
      .catch(() => {});
    return result;
  }
  function mount(panel) {
    if (document.getElementById("gpThemeOptions")) return;
    const section = document.createElement("section");
    section.className = "ui-settings-group";
    section.id = "gpThemeOptions";
    section.innerHTML = `<h3>应用主题</h3><p class="ui-muted">立即保存。仅改变外观、名称与图标，不改变比赛规则。</p><div class="gp-theme-options"><button id="gpTheme-classic" type="button" class="gp-theme-card" data-appearance-theme="classic"><span class="gp-theme-swatch">✦</span><span><strong>上帝的力量</strong><small>经典青绿 · 珊瑚橙</small></span></button><button id="gpTheme-marx" type="button" class="gp-theme-card" data-appearance-theme="marx"><span class="gp-theme-swatch marx">${emblem}</span><span><strong>马克思的力量</strong><small>朱红旗帜 · 暖白 · 金色麦穗</small></span></button></div>`;
    panel.querySelector(".ui-settings-title")?.after(section);
    section.querySelectorAll("[data-appearance-theme]").forEach((button) =>
      button.addEventListener("click", () => {
        void set(button.dataset.appearanceTheme);
      }),
    );
    apply();
  }
  document.documentElement.dataset.theme = theme;
  window.addEventListener("DOMContentLoaded", apply, { once: true });
  window.addEventListener("pagehide", cancel);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cancel();
  });
  return {
    get: () => theme,
    name,
    icon,
    boot,
    set,
    mount,
    cancel,
    isSwitching: () => !!active,
  };
})();
