import { chromium } from "playwright";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9237");
const page = browser.contexts()[0].pages().find(p => p.url().includes("app/index.html"));
await page.waitForTimeout(1500);
const out = await page.evaluate(async () => {
  localStorage.removeItem(ClassroomRosterRepository.key);
  const nav = [...document.querySelectorAll("[data-view], .nav-btn, .tab-btn")].find(n => /设置/.test(n.textContent || ""));
  nav?.click();
  await new Promise(r => setTimeout(r, 400));
  const btn = document.getElementById("rosterCreateFromLive");
  const statuses = [];
  for (let i = 0; i < 2; i++) {
    btn.click();
    await new Promise(r => setTimeout(r, 450));
    statuses.push(document.getElementById("rosterStatus").textContent.trim());
  }
  const env = JSON.parse(localStorage.getItem(ClassroomRosterRepository.key) || "null");
  return {
    statuses,
    classrooms: env?.rosterData?.classrooms?.map(c => c.name) ?? [],
    students: env?.rosterData?.students?.length ?? null,
  };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
