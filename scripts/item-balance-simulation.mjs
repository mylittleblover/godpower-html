/* Reproducible observed command outcomes, not an invented universal item-strength score. */
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { launch, setup } from "../tests/fixtures/browser.mjs";
const index = process.argv.indexOf("--source-commit"),
  source = index < 0 ? null : process.argv[index + 1];
if (source && !/^[a-f0-9]{7,40}$/.test(source))
  throw Error("source commit must be a SHA");
const output =
  process.env.BALANCE_OUTPUT ||
  (source
    ? "artifacts/item-balance/baseline"
    : "artifacts/item-balance/current");
await mkdir(output, { recursive: true });
const html = source
  ? execFileSync("git", ["show", source + ":dist/godpower.html"], {
      maxBuffer: 30e6,
    })
  : await readFile("dist/godpower.html");
const server = createServer((_, r) => {
  r.setHeader("content-type", "text/html;charset=utf-8");
  r.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const rows = [];
const errors = [];
const started = performance.now();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => SaveManager.ready());
  const catalog = await page.evaluate(() =>
    Object.entries(ItemBlueprints).map(([key, rule]) => ({
      key,
      name: ITEM_DEFS[key].name,
      charges: ITEM_DEFS[key].charges,
      ...rule,
    })),
  );
  for (const count of [4, 8, 14, 20])
    for (const shape of ["equal", "double-gap"])
      for (const item of catalog) {
        await page.evaluate(() => classroomCommands.whenIdle());
        await setup(page, count);
        const row = await page.evaluate(
          async ({ key, shape }) => {
            let seed = 0x53686b;
            const oldRandom = Math.random;
            Math.random = () => {
              seed ^= seed << 13;
              seed ^= seed >>> 17;
              seed ^= seed << 5;
              return (seed >>> 0) / 4294967296;
            };
            try {
              state.groups.forEach((g, i) => {
                g.score = g.displayScore =
                  shape === "equal" ? 100 : 100 * (i + 1);
              });
              const group = state.groups[Math.floor(state.groups.length / 2)];
              addItemToGroup(group, key);
              const instance = group.inventory[0]?.itemInstanceId;
              const before = state.groups.map((g) => ({
                id: g.id,
                score: g.score,
              }));
              const ok = await useItem(group.id, 0);
              await classroomCommands.whenIdle();
              const rank = (rows, id) =>
                1 +
                rows.filter(
                  (g) => g.score > rows.find((g) => g.id === id).score,
                ).length;
              return {
                key,
                count: before.length,
                shape,
                ok: !!ok,
                ownDelta:
                  group.score - before.find((g) => g.id === group.id).score,
                totalLoss: state.groups.reduce(
                  (n, g) =>
                    n +
                    Math.max(
                      0,
                      before.find((x) => x.id === g.id).score - g.score,
                    ),
                  0,
                ),
                rankImprovement:
                  rank(before, group.id) - rank(state.groups, group.id),
                chargesLeft:
                  group.inventory.find((i) => i.itemInstanceId === instance)
                    ?.charges ?? 0,
                statusTargets: state.groups.filter(
                  (g) => Object.keys(g.competitionEffects || {}).length,
                ).length,
              };
            } finally {
              Math.random = oldRandom;
            }
          },
          { key: item.key, shape },
        );
        rows.push(row);
      }
  const report = {
    sourceCommit:
      source ||
      execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    worktree: !source,
    htmlSha256: createHash("sha256").update(html).digest("hex"),
    environment: await browser.version(),
    seed: "xorshift32:0x53686b",
    cases: rows.length,
    elapsedMs: Math.round(performance.now() - started),
    errors,
    rows,
    catalog,
    limits:
      "Immediate, undefended one-use outcomes only. Future status value, human sound, inventory-full, negative-score and defense combinations are not claimed by this audit.",
  };
  await writeFile(output + "/results.json", JSON.stringify(report, null, 2));
  const lines = [
    "# 28 道具实测抽样审计",
    "",
    "范围：4/8/14/20组；均分与倍差；固定种子，真实命令及持久化ACK。即时分值不代表防御/持续状态的总价值。此表用于查明影响，不作为删除功能或平衡排名的依据。",
    "",
    "| Key | 名称 | 效果 | 目标 | 余次 | 成功/案例 | 自身平均即时变化 | 平均实际扣分 |",
    "|---|---|---|---|---:|---:|---:|---:|",
  ];
  for (const item of catalog) {
    const sample = rows.filter((r) => r.key === item.key),
      mean = (k) =>
        (sample.reduce((n, r) => n + r[k], 0) / sample.length).toFixed(2);
    lines.push(
      `| ${item.key} | ${item.name} | ${item.effect} | ${item.target} | ${item.charges} | ${sample.filter((r) => r.ok).length}/${sample.length} | ${mean("ownDelta")} | ${mean("totalLoss")} |`,
    );
  }
  lines.push(
    "",
    `HTML SHA256：${report.htmlSha256}`,
    `实际案例 ${rows.length}；renderer errors ${errors.length}；耗时 ${report.elapsedMs} ms。非性能基准。`,
    "",
    "未覆盖：防御组合、负分/零分/满包、持续期完整收益与人工听感。不能宣称全部道具组合通过。",
  );
  await writeFile(output + "/AUDIT.md", lines.join("\n") + "\n");
  if (errors.length) throw Error("renderer errors: " + errors.join(";"));
  console.log(
    "PASS audit executed " + rows.length + " command cases; output " + output,
  );
} finally {
  await browser.close();
  server.close();
}
