import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

/* The item cinematic must spread targets flat: no scrollbar, nothing clipped,
   and the whole spread inside the viewport for 1, 4 and 12 targets. */
const css = await readFile("../electron/renderer/effect.css", "utf8");
const js = await readFile("../electron/renderer/effect.js", "utf8");
const bridge = "window.__r=null;window.godpowerDesktop={onReveal:function(fn){window.__r=fn;},ready:function(){},finish:function(){},interactive:function(){}};";
const body = [
  '<div class="shade"></div><div class="halo halo-one"></div><div class="halo halo-two"></div>',
  '<div id="particles" class="particles"></div>',
  '<section class="reveal"><div class="eyebrow" id="mode">ITEM</div><div class="rule"></div><p id="group"></p>',
  '<div id="avatarFrame" class="avatar-frame" hidden><img id="avatar" alt=""></div>',
  '<h1 id="name"></h1><p id="number"></p>',
  '<img id="itemIcon" class="item-icon" alt="" hidden>',
  '<div id="itemTargets" class="item-targets" hidden></div>',
  '<div class="caption">让答案闪耀 · 让思考被看见</div></section>',
  '<button id="skip">跳过演出 · Esc</button>',
].join("");
const html = '<!doctype html><html><head><meta charset="utf-8"><style>' + css + '</style></head><body><script>' + bridge + '</script><main id="stage">' + body + '</main></body></html>';

const server = createServer((_, res) => { res.setHeader("Content-Type","text/html; charset=utf-8"); res.end(html); });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const out = process.env.TARGETS_ARTIFACT_DIR || "artifacts/item-targets";
await mkdir(out, { recursive: true });
const results = [];
try {
  for (const count of [1, 4, 12]) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1040 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.addScriptTag({ content: js });
    await page.waitForFunction(() => typeof window.__r === "function", null, { timeout: 8000 });
    await page.evaluate(({ count }) => {
      const names = Array.from({ length: count }, (_, i) => `第 ${i + 1} 组`);
      window.__r({
        id: "t" + count, theme: "classic", kind: "item",
        item: { key: "lightning", name: "闪电", icon: null,
          caster: { id: 1, name: "第 1 组" },
          targets: names.map((n, i) => ({ name: n, delta: -(10 + i), status: "" })) },
        effects: { style: "comet", duration: 2600 },
      });
    }, { count });
    await page.waitForTimeout(900);
    const probe = await page.evaluate((count) => {
      const box = document.getElementById("itemTargets");
      const ul = box.querySelector(".item-target-list");
      const items = [...ul.children];
      const vh = window.innerHeight, vw = window.innerWidth;
      const rect = box.getBoundingClientRect();
      const last = items[items.length - 1]?.getBoundingClientRect();
      return {
        count,
        caster: document.getElementById("name").textContent,
        items: items.length,
        head: box.querySelector(".item-targets-head")?.textContent,
        columns: getComputedStyle(ul).gridTemplateColumns.split(" ").length,
        scrolls: box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1,
        overflow: getComputedStyle(box).overflow,
        boxBottom: Math.round(rect.bottom),
        lastBottom: last ? Math.round(last.bottom) : null,
        viewport: { vw, vh },
        lastInside: last ? last.bottom <= vh && last.right <= vw : false,
        fontSize: getComputedStyle(items[0].querySelector("strong")).fontSize,
      };
    }, count);
    await page.screenshot({ path: `${out}/spread-${count}.png` });
    assert.equal(probe.items, count, `all ${count} targets rendered`);
    assert.equal(probe.scrolls, false, `no scrollbar at ${count} targets`);
    assert.equal(probe.overflow, "visible", "the spread is not a scroll box");
    assert.equal(probe.lastInside, true, `last tile inside the viewport at ${count}`);
    assert.ok(probe.boxBottom <= probe.viewport.vh, "the panel stays on screen");
    assert.equal(probe.caster, "第 1 组", "caster renders as a name, not an object");
    assert.match(probe.head, new RegExp(`影响 ${count} 个小组`));
    assert.deepEqual(errors, []);
    results.push(probe);
    await page.close();
  }
  await writeFile(`${out}/results.json`, JSON.stringify({ status: "PASS", results }, null, 2));
  console.log(JSON.stringify({ status: "PASS", results }, null, 2));
} finally {
  await browser.close();
  server.close();
}
