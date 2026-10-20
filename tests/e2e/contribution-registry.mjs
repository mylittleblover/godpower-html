import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { launch, dismissStartup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_request, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch();
const pageErrors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
  });
  await dismissStartup(page);
  const boot = await page.evaluate(() => ({
    available: Boolean(
      window.GodPowerContributionRegistry && window.GodPowerPageShell,
    ),
    routes: window.GodPowerPageShell?.listPages().map((route) => route.route),
  }));
  assert.equal(boot.available, true);
  assert.deepEqual(boot.routes, [
    "welcome",
    "battle",
    "history",
    "archives",
    "plugins",
    "settings",
  ]);

  const coreNavigation = await page.evaluate(() =>
    window.GodPowerPageShell.navigate("history", "test-source"),
  );
  assert.equal(coreNavigation.status, "navigated");
  assert.equal(await page.locator("#view-history").isVisible(), true);

  const plugin = await page.evaluate(() => {
    const host = window.GodPowerPageShell;
    const activation = host.activate("official.test", {
      scope: { teacherId: "isolated-teacher", classId: "isolated-class" },
      permissions: ["ui.page.register", "ui.card.register"],
    });
    const before = JSON.stringify(state);
    const receipt = host.register(
      [
        {
          localId: "help",
          kind: "page",
          descriptor: {
            titleKey: "test.help",
            renderer: "builtin.plugin-workspace",
          },
        },
        {
          localId: "home-card",
          kind: "card",
          descriptor: {
            slot: "home.cards",
            renderer: "builtin.dashboard-card",
            titleKey: "test.card",
          },
        },
      ],
      activation,
    );
    const route = host.resolvePage("plugins/official.test/help");
    const navigation = host.navigate("plugins/official.test/help", "test-card");
    let rejected = false;
    try {
      host.register(
        [
          {
            localId: "would-have-registered",
            kind: "page",
            descriptor: {
              titleKey: "test.atomic",
              renderer: "builtin.plugin-workspace",
            },
          },
          {
            localId: "unsafe",
            kind: "page",
            descriptor: {
              titleKey: "test.unsafe",
              renderer: "builtin.plugin-workspace",
              onerror: "alert(1)",
            },
          },
        ],
        activation,
      );
    } catch {
      rejected = true;
    }
    const atomicCount = host.listByPlugin("official.test").length;
    host.dispose(receipt.activationId);
    const disposedPage = host.resolvePage("plugins/official.test/help");
    const after = JSON.stringify(state);
    return {
      receipt,
      route,
      navigation,
      rejected,
      atomicCount,
      disposedPage,
      businessStateUnchanged: before === after,
      coreRoutes: host
        .listPages()
        .filter((entry) => entry.core)
        .map((entry) => entry.route),
    };
  });
  assert.equal(plugin.route.route, "plugins/official.test/help");
  assert.equal(plugin.navigation.status, "workspace-required");
  assert.equal(plugin.rejected, true);
  assert.equal(
    plugin.atomicCount,
    2,
    "invalid contribution batches commit no prefix entries",
  );
  assert.equal(plugin.disposedPage, null);
  assert.equal(plugin.businessStateUnchanged, true);
  assert.deepEqual(plugin.coreRoutes, [
    "welcome",
    "battle",
    "history",
    "archives",
    "plugins",
    "settings",
  ]);
  assert.deepEqual(pageErrors, []);
  console.log(
    JSON.stringify({
      status: "PASS",
      browser: "Chromium",
      viewport: "1920x1080",
      deviceScaleFactor: 1,
      routes: boot.routes,
      pageErrors,
    }),
  );
} finally {
  await browser.close();
  server.close();
}
