import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, setup } from "../fixtures/browser.mjs";
const root = "artifacts/component-library-3.0.61";
await mkdir(root, { recursive: true });
const html = await readFile("dist/godpower.html");
const server = createServer((_, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const errors = [],
  evidence = {};
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.addInitScript(() => {
    window.__libraryShadows = [];
    const attach = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (options) {
      const root = attach.call(this, options);
      window.__libraryShadows.push(root);
      return root;
    };
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await setup(page, 14);
  await page.evaluate(() => {
    switchView("settings");
    DesktopUI.selectSettings("appearance");
  });
  assert.equal(
    await page.locator("#uiComponentLibraryEntry").evaluate((n) => n.open),
    false,
  );
  const before = await page.evaluate(() => ({
    state: JSON.stringify(state),
    storage: JSON.stringify(Object.entries(localStorage)),
    theme: GodpowerTheme.get(),
  }));
  await page.locator("#uiComponentLibraryEntry summary").click();
  await page.locator("#openComponentLibrary").click();
  await page.waitForFunction(() => DesktopUI.getAnimationCount() === 0);
  assert.equal(await page.locator("#componentLibraryModal").isVisible(), true);
  assert.equal(
    await page.locator("#componentLibraryModal [data-ui-window-close]").count(),
    1,
  );
  evidence.catalog = await page.evaluate(() => UIComponentLibrary.getStatus());
  const ids = await page
    .locator("#componentLibraryList button")
    .evaluateAll((nodes) => nodes.map((n) => n.dataset.componentId));
  assert.ok(ids.length >= 80);
  for (const id of ids) {
    await page.locator(`[data-component-id="${id}"]`).click();
    assert.ok(await page.locator("#componentLibraryDetail h3").textContent());
  }
  // Search updates only its list, preserving the active text input and OS keyboard target.
  await page.locator("#componentLibrarySearch").focus();
  await page.evaluate(() => (window.__libraryInput = document.activeElement));
  for (const char of "按钮") {
    await page.keyboard.insertText(char);
    assert.equal(
      await page.evaluate(
        () =>
          document.activeElement === window.__libraryInput &&
          window.__libraryInput.isConnected,
      ),
      true,
    );
  }
  await page.locator("#componentLibrarySearch").fill("");
  await page.locator('[data-component-id="switches"]').click();
  for (const theme of ["classic", "marx"]) {
    await page.selectOption("#componentLibraryTheme", theme);
    const switches = await page.evaluate(() => {
      const root = window.__libraryShadows.at(-1);
      const inputs = root.querySelectorAll("input[type=checkbox]");
      const tracks = root.querySelectorAll(".ui-toggle-track");
      const style = (n) => {
        const s = getComputedStyle(n),
          r = n.getBoundingClientRect();
        return {
          width: r.width,
          height: r.height,
          background: s.backgroundColor,
          border: s.borderColor,
          radius: s.borderRadius,
          opacity: s.opacity,
        };
      };
      return {
        native: style(inputs[0]),
        compat: style(tracks[0]),
        nativeDisabled: style(inputs[2]),
        compatDisabled: style(tracks[1]),
        hiddenOpacity: getComputedStyle(inputs[3]).opacity,
        shadowOpen: root.host.shadowRoot !== null,
      };
    });
    assert.deepEqual(switches.native, switches.compat);
    assert.deepEqual(switches.nativeDisabled, switches.compatDisabled);
    assert.equal(switches.hiddenOpacity, "0");
    assert.equal(switches.shadowOpen, false);
    evidence[theme] = switches;
  }
  assert.equal(await page.evaluate(() => GodpowerTheme.get()), before.theme);
  await page.screenshot({ path: `${root}/switches.png` });
  await page.selectOption("#componentLibraryMode", "styles");
  assert.equal(
    await page.locator("#componentLibraryList button").count(),
    evidence.catalog.styles,
  );
  await page.selectOption("#componentLibraryMode", "animations");
  assert.equal(
    await page.locator("#componentLibraryList button").count(),
    evidence.catalog.animations,
  );
  await page.selectOption("#componentLibraryMode", "tokens");
  assert.equal(
    await page.locator("#componentLibraryList button").count(),
    evidence.catalog.tokens,
  );
  await page.screenshot({ path: `${root}/tokens.png` });
  // An isolated preview cannot copy event handlers, password values or script authority.
  await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.id = "librarySafetyProbe";
    probe.hidden = true;
    probe.innerHTML =
      '<button onclick="window.__libraryTriggered=true">不得触发</button><input type="password" value="do-not-copy"><script>window.__libraryTriggered=true<\/script>';
    document.body.append(probe);
  });
  await page.locator("#componentLibraryRefresh").click();
  await page.selectOption("#componentLibraryMode", "nodes");
  await page.locator("#componentLibrarySearch").fill("librarySafetyProbe");
  await page.locator('[data-component-id="node-librarySafetyProbe"]').click();
  const safety = await page.evaluate(() => {
    const shadow = window.__libraryShadows.at(-1);
    return {
      scripts: shadow.querySelectorAll("script,iframe,object,embed").length,
      events: [...shadow.querySelectorAll("*")]
        .flatMap((n) => [...n.attributes])
        .filter((a) => /^on/i.test(a.name)).length,
      password: shadow.querySelector("input[type=password]").value,
      inert: shadow.querySelector("#librarySafetyProbe").inert,
      triggered: !!window.__libraryTriggered,
    };
  });
  assert.deepEqual(safety, {
    scripts: 0,
    events: 0,
    password: "",
    inert: true,
    triggered: false,
  });
  evidence.safety = safety;
  await page.locator("#componentLibrarySearch").fill("");
  await page.selectOption("#componentLibraryMode", "components");
  await page.locator('[data-component-id="buttons"]').click();
  evidence.buttons = await page.evaluate(() => {
    const shadow = window.__libraryShadows.at(-1),
      button = shadow.querySelector(".btn-primary");
    const expected = document.createElement("span");
    expected.style.color = getComputedStyle(
      shadow.querySelector("body"),
    ).getPropertyValue("--ui-primary");
    shadow.append(expected);
    const result = {
      background: getComputedStyle(button).backgroundColor,
      expected: getComputedStyle(expected).color,
    };
    expected.remove();
    return result;
  });
  assert.equal(
    evidence.buttons.background,
    evidence.buttons.expected,
    "preview must retain the current theme, not the legacy blue fallback",
  );
  await page.screenshot({ path: `${root}/library.png` });
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      !document
        .querySelector("#componentLibraryModal")
        .classList.contains("active"),
  );
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "openComponentLibrary",
  );
  assert.equal(
    await page.evaluate(() => UIComponentLibrary.getStatus().previewActive),
    false,
  );
  const after = await page.evaluate(() => ({
    state: JSON.stringify(state),
    storage: JSON.stringify(Object.entries(localStorage)),
    theme: GodpowerTheme.get(),
  }));
  assert.deepEqual(after, before);
  await page.evaluate(() =>
    document.querySelector("#librarySafetyProbe").remove(),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS full component directory, CSS/tokens/animations coverage, isolated preview, both-theme switches, input focus, Escape and unchanged classroom data; Chromium1920x1080 1x",
  );
} finally {
  await browser.close();
  server.close();
  await writeFile(
    `${root}/results.json`,
    JSON.stringify({ evidence, errors }, null, 2),
  );
}
