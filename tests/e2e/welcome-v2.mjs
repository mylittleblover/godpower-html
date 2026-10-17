import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createServer} from "node:http";
import {launch,setup} from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((req,res) => {
  res.setHeader("Content-Type","text/html;charset=utf-8");
  res.end(html);
});
await new Promise(resolve => server.listen(0,"127.0.0.1",resolve));
const browser = await launch();
const page = await browser.newPage({viewport:{width:1440,height:900}});
const errors = [];
page.on("pageerror",e => errors.push(e.message));
try {
  await page.goto("http://127.0.0.1:"+server.address().port,{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator("#gpIntro.active").count(),1,"The intro opens automatically at startup");
  assert.equal(await page.locator("#gpIntroLogo svg").count(),1,"The supplied vector artwork is inline");
  assert.equal(await page.locator(".nav-tab[data-view]").count(),5,"Keep all five real application views");
  await page.locator("#gpIntroSkip").click();
  await page.waitForFunction(() => window.WelcomeV2?.getStatus().introFinished);
  assert.equal(await page.locator("#gpBrandMount svg").count(),1,"Move the SAME SVG node into navbar");
  await setup(page,14);
  await page.evaluate(() => {switchView("welcome");renderAll();});
  await page.waitForTimeout(200);
  assert.equal(await page.locator("#gpRankList .gp-rank-row").count(),14,"Live rank must not be collapsed");
  assert.equal(await page.locator("#uiGroupTrack .ui-group-card").count(),14);
  assert.equal(await page.locator("#uiDailyGrid").count(),1);
  for(const name of ["battle","history","archives","settings","welcome"]){
    await page.locator('.nav-tab[data-view="'+name+'"]').click();
    assert.equal(await page.locator("#view-"+name).isVisible(),true,name+" stays a distinct view");
  }
  assert.deepEqual(errors,[],"No JavaScript page errors");
  console.log("PASS welcome-V2 entrance, preserved navigation and 14 group dashboard");
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
