import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { sourceAt } from "../fixtures/source-at.mjs";
import { launch, setup } from "../fixtures/browser.mjs";
const html = process.env.PERF_SOURCE_REF
  ? sourceAt(process.env.PERF_SOURCE_REF)
  : await readFile("dist/godpower.html");
const server = createServer((q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
await page.goto(`http://127.0.0.1:${server.address().port}`);
await setup(page, 14);
const cdp = await page.context().newCDPSession(page);
const profiling = process.env.PERF_PROFILE !== "0";
if (profiling) {
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.start");
}
const measurements = await page.evaluate(() => {
  const snapshots = Array.from({ length: 100 }, () =>
    GodpowerPicker.getSnapshot(),
  );
  const styles = new Set(snapshots.map((x) => x.effects.style));
  const normalized = new Set(
    snapshots.map((x) =>
      JSON.stringify({ ...x, effects: { ...x.effects, style: "omitted" } }),
    ),
  );
  return {
    reads: 100,
    uniqueStyles: styles.size,
    otherStateVariants: normalized.size,
    changedPayloads: snapshots
      .slice(1)
      .filter((s, i) => JSON.stringify(s) !== JSON.stringify(snapshots[i]))
      .length,
  };
});
assert.equal(
  measurements.changedPayloads,
  0,
  "idle polling must not create spurious IPC payloads",
);
assert.equal(measurements.otherStateVariants, 1);
const { profile } = profiling
  ? await cdp.send("Profiler.stop")
  : { profile: { nodes: [], samples: [], timeDeltas: [] } };
await writeFile(
  `artifacts/performance-3.0.67/${process.env.PERF_SOURCE_REF || "current"}-profile.json`,
  JSON.stringify(profile),
);
const hits = new Map();
const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
for (let i = 0; i < (profile.samples || []).length; i++) {
  const n = nodes.get(profile.samples[i]);
  const f = n.callFrame;
  const k = f.functionName + ":" + f.lineNumber;
  hits.set(k, (hits.get(k) || 0) + (profile.timeDeltas[i] || 0));
}
const top = [...hits].sort((a, b) => b[1] - a[1]).slice(0, 35);
await writeFile(
  `artifacts/performance-3.0.67/snapshot-churn.json`,
  JSON.stringify({ measurements, top }, null, 2),
);
console.log(JSON.stringify({ measurements, top }, null, 2));
await browser.close();
server.close();
