import { launch, setup } from "../fixtures/browser.mjs";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
const html = await readFile("dist/godpower.html");
const server = createServer((q, s) => {
  s.setHeader("Content-Type", "text/html;charset=utf-8");
  s.setHeader("Cache-Control", "no-store");
  s.end(html);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const b = await launch(),
  p = await b.newPage(),
  evidence = [];
try {
  await p.goto("http://127.0.0.1:" + server.address().port, {
    waitUntil: "domcontentloaded",
  });
  await setup(p);
  await p.evaluate(() => {
    state.groups[0].score = 1234;
    saveState();
  });
  await p.context().route("**/*", (r) => r.continue());
  const t = Date.now();
  await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForFunction(() => window.classroomReady);
  evidence.push({
    duration: Date.now() - t,
    score: await p.evaluate(() => state.groups[0].score),
  });
  console.log(evidence);
} catch (e) {
  console.log("FAIL", e.message);
  process.exitCode = 1;
  evidence.push({ error: e.message });
} finally {
  await b.close();
  server.close();
  await writeFile(
    "artifacts/reload-check.json",
    JSON.stringify(evidence, null, 2),
  );
}
