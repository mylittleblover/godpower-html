
/* Homepage-only binding layer. Source of truth remains the existing classroom state. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var started = false, introBusy = false, introFinished = false, slidePx = 0;
  var carouselTimer = null, pauseUntil = 0, draggingTrack = false;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var esc = function (value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  };
  function realGroups() { return typeof state !== "undefined" && Array.isArray(state.groups) ? state.groups : []; }
  function score(g) { return Number(g.score) || 0; }
  function scoreMasked() {
    return typeof state !== "undefined" && Number(state.itemGlobal && state.itemGlobal.blooperUntil || 0) > Date.now();
  }
  function render() {
    if (!$("gpRankList")) return;
    var groups = realGroups(), mask = scoreMasked();
    var ranked = groups.slice().sort(function (a, b) { return score(b) - score(a) || Number(a.id) - Number(b.id); });
    var max = Math.max(1, ...ranked.map(score));
    $("gpHeroCount").textContent = groups.length + " 组";
    $("gpRankNote").textContent = groups.length ? ("共 " + groups.length + " 组 · 积分从高到低") : "尚未添加小组";
    $("gpRankList").innerHTML = ranked.length ? ranked.map(function (g, i) {
      var med = i === 0 ? " gp-medal" : i === 1 ? " gp-medal gp-second" : i === 2 ? " gp-medal gp-third" : "";
      var pct = Math.max(0, Math.min(100, score(g) / max * 100));
      return '<div class="gp-rank-row">' +
        '<span class="gp-rank-index' + med + '">' + (i+1) + '</span>' +
        '<span class="gp-rank-name" title="' + esc(g.name) + '">' + esc(g.name) + '</span>' +
        '<span class="gp-rank-bar"><i style="width:' + (mask ? 0 : pct.toFixed(2)) + '%"></i></span>' +
        '<span class="gp-rank-points">' + (mask ? "???" : esc(g.score)) + '</span>' +
        '<span class="gp-rank-state">' + (i === 0 && !mask ? "领跑" : "参赛中") + '</span></div>';
    }).join("") : '<div class="gp-rank-empty">还没有小组。请在设置或比赛页面添加小组。</div>';
    var playing = typeof state !== "undefined" && !!state.roundActive;
    $("gpRoundTitle").textContent = playing ? "新一轮比赛进行中" : "赛场准备就绪";
    $("gpRoundDetail").textContent = playing ? "当前回合正在进行 · 分数实时更新" : "随时可以前往比赛页面开始新回合";
    var history = typeof historyStack !== "undefined" && Array.isArray(historyStack) ? historyStack : [];
    var recent = history.slice(-4).reverse();
    $("gpFeedList").innerHTML = recent.length ? recent.map(function (entry) {
      var desc = esc(entry.desc || "课堂操作"), when = esc(entry.time || "");
      return '<div class="gp-feed-row"><span class="gp-feed-icon">↗</span>' +
        '<div class="gp-feed-copy"><strong>' + desc + '</strong><p>操作记录已保留，可在历史页面查看快照</p></div>' +
        '<span class="gp-feed-time">' + when + '</span></div>';
    }).join("") : '<div class="gp-feed-row"><span class="gp-feed-icon">✦</span><div class="gp-feed-copy"><strong>等待第一条课堂动态</strong><p>开始答题、调整积分或使用道具后，相关操作将出现在这里。</p></div></div>';
  }
  function autoGroups() {
    var track = $("uiGroupTrack");
    if (!track || carouselTimer) return;
    track.addEventListener("pointerenter", function () { pauseUntil = Infinity; });
    track.addEventListener("pointerleave", function () { pauseUntil = Date.now() + 2300; });
    track.addEventListener("focusin", function () { pauseUntil = Infinity; });
    track.addEventListener("focusout", function () { pauseUntil = Date.now() + 2300; });
    track.addEventListener("pointerdown", function () { draggingTrack = true; pauseUntil = Date.now() + 5500; });
    window.addEventListener("pointerup", function () { draggingTrack = false; });
    ["uiGroupPrev","uiGroupNext"].forEach(function (id) {
      var b = $(id);
      if (b) b.addEventListener("click", function () { pauseUntil = Date.now() + 5000; });
    });
    carouselTimer = setInterval(function () {
      if (document.hidden || draggingTrack || reduceMotion.matches || !introFinished ||
          typeof currentView !== "undefined" && currentView !== "welcome" ||
          Date.now() < pauseUntil || pauseUntil === Infinity ||
          track.scrollWidth <= track.clientWidth + 6) return;
      var step = 214;
      var edge = track.scrollWidth - track.clientWidth;
      var next = track.scrollLeft + step;
      if (next >= edge - 4) next = 0;
      track.scrollTo({left:next,behavior:"smooth"});
    }, 3800);
  }
  function showIntro(replay) {
    if (!$("gpIntro") || introBusy) return;
    var overlay = $("gpIntro"), logo = $("gpIntroLogo"), mount = $("gpBrandMount");
    var svg = mount.querySelector("svg");
    if (svg) logo.appendChild(svg);
    logo.removeAttribute("style");
    $("gpIntroTitle").removeAttribute("style");
    overlay.hidden = false;
    overlay.classList.remove("departing","ready");
    overlay.classList.add("active");
    introFinished = false; slidePx = 0; drawSlide(0);
    document.body.classList.add("gp-intro-active");
    document.body.classList.remove("gp-intro-reveal");
    var header = document.querySelector(".app-topnav");
    if (header) header.inert = true;
    var page = $("view-welcome");
    if (page) page.inert = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.add("ready"); });
    });
    if (!replay && reduceMotion.matches) setTimeout(function () { finish(true); }, 100);
  }
  function drawSlide(px) {
    var track = $("gpSlideTrack");
    if (!track) return;
    var max = Math.max(1, track.clientWidth - 56);
    slidePx = Math.min(Math.max(0, px), max);
    track.style.setProperty("--gp-slide", slidePx + "px");
    $("gpSlideFill").style.width = (slidePx + 54) + "px";
    track.setAttribute("aria-valuenow", Math.round(slidePx/max*100));
  }
  function finish(skip) {
    if (introBusy || introFinished) return;
    introBusy = true;
    var overlay = $("gpIntro"), logo = $("gpIntroLogo"), title = $("gpIntroTitle");
    var mount = $("gpBrandMount"), label = document.querySelector(".gp-brand-label");
    var svg = logo.querySelector("svg");
    document.body.classList.remove("gp-intro-active");
    document.body.classList.add("gp-intro-reveal");
    var header = document.querySelector(".app-topnav");
    if (header) header.inert = false;
    var page = $("view-welcome");
    if (page) page.inert = false;
    overlay.classList.add("departing");
    function settle() {
      if (svg) mount.appendChild(svg);
      logo.removeAttribute("style"); title.removeAttribute("style");
      overlay.classList.remove("active","ready","departing");
      overlay.hidden = true;
      introBusy = false; introFinished = true;
      if (typeof window.startResumeRetry === "function") window.startResumeRetry();
      if (typeof window.tryAutoResumeAndPlay === "function") window.tryAutoResumeAndPlay();
    }
    if (skip || reduceMotion.matches || !logo.animate || !mount || !label) {
      settle();
      return;
    }
    // FLIP: animate the SVG as a single aspect-locked object. Never interpolate border-radius.
    var a = logo.getBoundingClientRect(), b = mount.getBoundingClientRect();
    var t = title.getBoundingClientRect(), v = label.getBoundingClientRect();
    var dx = b.left + b.width/2 - a.left - a.width/2;
    var dy = b.top + b.height/2 - a.top - a.height/2;
    var tx = v.left + v.width/2 - t.left - t.width/2;
    var ty = v.top + v.height/2 - t.top - t.height/2;
    var duration = 840, ease = "cubic-bezier(.22,.8,.22,1)";
    var animations = [
      logo.animate([{transform:"translate(0px,0px) scale(1)",opacity:1},{transform:"translate(" + dx + "px," + dy + "px) scale(" + b.width/a.width + ")",opacity:1}],{duration:duration,easing:ease,fill:"forwards"}),
      title.animate([{transform:"translate(0px,0px) scale(1)",opacity:1},{transform:"translate(" + tx + "px," + ty + "px) scale(" + Math.min(1,v.height/t.height) + ")",opacity:0}],{duration:duration,easing:ease,fill:"forwards"})
    ];
    Promise.all(animations.map(function (ani) {return ani.finished.catch(function () {}); })).then(function () {
      animations.forEach(function (ani) { ani.cancel(); });
      settle();
    });
  }
  function initSlider() {
    var track = $("gpSlideTrack");
    var activePointer = null;
    if (!track) return;
    var fromEvent = function (event) {
      var box = track.getBoundingClientRect();
      drawSlide(event.clientX - box.left - 28);
    };
    track.addEventListener("pointerdown", function (ev) {
      if (introBusy || !ev.isPrimary) return;
      activePointer = ev.pointerId;
      track.setPointerCapture(ev.pointerId);
      fromEvent(ev);
    });
    track.addEventListener("pointermove", function (ev) {
      if (ev.pointerId !== activePointer) return;
      fromEvent(ev);
    });
    var release = function (ev) {
      if (ev.pointerId !== activePointer) return;
      activePointer = null;
      if (Number(track.getAttribute("aria-valuenow")) >= 83) finish(false);
      else drawSlide(0);
    };
    track.addEventListener("pointerup", release);
    track.addEventListener("pointercancel", function (ev) { if (ev.pointerId === activePointer) {activePointer = null;drawSlide(0);} });
    track.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") {
        ev.preventDefault(); drawSlide(slidePx + (ev.key === "ArrowRight" ? 30 : -30));
      } else if (ev.key === "End") {
        ev.preventDefault(); drawSlide(track.clientWidth - 56);
      } else if (ev.key === "Home") {ev.preventDefault(); drawSlide(0);}
      else if ((ev.key === "Enter" || ev.key === " ") && Number(track.getAttribute("aria-valuenow")) >= 83) {
        ev.preventDefault(); finish(false);
      }
    });
  }
  function init() {
    if (started) return;
    started = true;
    var logo = $("gpIntroLogo") && $("gpIntroLogo").querySelector("svg");
    if (logo) {
      var favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.href = "data:image/svg+xml," + encodeURIComponent(logo.outerHTML);
    }
    initSlider(); autoGroups();
    $("gpIntroSkip").addEventListener("click", function () { finish(true); });
    $("gpReplayIntro").addEventListener("click", function () { showIntro(true); });
    showIntro(false);
    render();
  }
  window.WelcomeV2 = {render:render, replay:function(){showIntro(true);}, getStatus:function(){return {introFinished:introFinished, introBusy:introBusy};}};
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
