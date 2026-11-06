import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";
const html = await readFile("dist/godpower.html");
const server = createServer((_q, r) => r.end(html));
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.sent = [];
    window.godpowerDesktop = {
      ai: {
        status: async () => ({
          ok: true,
          config: { provider: "opencode", model: "test", keyPresent: true },
        }),
        request: async (v) => {
          sent.push(v);
          if (v.text === "slow") await new Promise((r) => setTimeout(r, 700));
          return {
            ok: true,
            text: JSON.stringify({ reply: "模型回复：" + v.text, actions: [] }),
          };
        },
        cancel: async () => ({ ok: true }),
      },
    };
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(() => SaveManager.ready());
  await setup(page, 14);
  await page.evaluate(() => {
    switchView("ai");
  });
  await page.waitForFunction(
    () =>
      document.querySelector("#aiSend") &&
      !document.querySelector("#aiSend").disabled,
  );
  const first = await page.evaluate(() =>
    AIConversationRepository.load().then((l) => l.activeId),
  );
  await page.locator("#aiConversationTitle").fill("积分记录");
  await page.locator("#aiRenameConversation").click();
  await page.locator("#aiPrompt").fill("查看小组积分");
  await page.locator("#aiSend").click();
  await page.waitForFunction(() => !document.querySelector("#aiSend").disabled);
  await page.waitForFunction(() =>
    document.querySelector("#aiSavedState").textContent.includes("已保存"),
  );
  await page.locator("#aiPrompt").fill("给第3组加5分");
  await page.locator("#aiSend").click();
  await page.waitForFunction(() => !document.querySelector("#aiSend").disabled);
  assert.equal(await page.locator("#aiMessages [data-proposal]").count(), 1);
  await page.locator("#aiNewConversation").click();
  assert.equal(await page.locator("#aiMessages .ai-message").count(), 0);
  await page.locator("#aiConversationTitle").fill("学科问题");
  await page.locator("#aiRenameConversation").click();
  await page.locator("#aiMode").selectOption("model");
  async function send(text, history = false) {
    await page.locator("#aiPrompt").fill(text);
    await page.locator("#aiShareHistory").setChecked(history);
    await page.locator("#aiConsent").check();
    await page.locator("#aiSend").click();
    await page.waitForFunction(
      () => !document.querySelector("#aiSend").disabled,
    );
  }
  await send("什么是分数");
  await send("再举一例", true);
  const sent = await page.evaluate(() => sent);
  assert.equal(sent.length, 2);
  assert.deepEqual(sent[0].history, []);
  assert.deepEqual(
    sent[1].history.map((m) => m.content),
    ["什么是分数", "模型回复：什么是分数"],
  );
  assert.ok(!JSON.stringify(sent[1]).includes("小组积分"));
  await page.locator("#aiPrompt").fill("slow");
  await page.locator("#aiConsent").check();
  await page.locator("#aiSend").click();
  await page.waitForFunction(() => sent.length === 3);
  await page.locator(`[data-conversation="${first}"]`).click();
  await page.waitForTimeout(850);
  assert.ok(
    !(await page.locator("#aiMessages").textContent()).includes(
      "模型回复：slow",
    ),
  );
  await page.waitForFunction(() =>
    document.querySelector("#aiSavedState").textContent.includes("已保存"),
  );
  await page.reload();
  await page.evaluate(() => SaveManager.ready());
  await page.evaluate(() => switchView("ai"));
  await page.waitForFunction(
    () => document.querySelector("#aiConversationTitle")?.value === "积分记录",
  );
  assert.ok((await page.locator("#aiMessages").textContent()).includes("小组"));
  assert.equal(await page.locator("#aiMessages [data-proposal]").count(), 0);
  assert.equal(await page.evaluate(() => sent.length), 0);
  await page.locator("#aiSearch").fill("学科");
  assert.equal(await page.locator("#aiConversationList button").count(), 1);
  await page.locator("#aiConversationList button").click();
  assert.ok(
    (await page.locator("#aiMessages").textContent()).includes("再举一例"),
  );
  assert.ok(
    !(await page.locator("#aiMessages").textContent()).includes(
      "模型回复：slow",
    ),
  );
  await page.waitForFunction(() =>
    document.querySelector("#aiSavedState").textContent.includes("已保存"),
  );
  await page.locator("#aiSearch").fill("");
  const sizes = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    dpr: devicePixelRatio,
  }));
  assert.equal(sizes.dpr, 1);
  assert.ok(sizes.scroll <= sizes.width);
  await mkdir("artifacts/ai-conversations", { recursive: true });
  await page.screenshot({ path: "artifacts/ai-conversations/workspace.png" });
  // Hold the IDB writer, then leave while send awaits persistence: no network call.
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        const r = indexedDB.open("godpower_ai_conversations", 1);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction("library", "readwrite"),
            store = tx.objectStore("library");
          window.releaseChatWriter = false;
          function loop() {
            const q = store.get("current");
            q.onsuccess = () => {
              if (!window.releaseChatWriter) loop();
            };
          }
          loop();
          tx.oncomplete = () => db.close();
          resolve();
        };
      }),
  );
  await page.locator("#aiMode").selectOption("model");
  await page.locator("#aiPrompt").fill("must not leave page");
  await page.locator("#aiConsent").check();
  await page.locator("#aiSend").click();
  await page.evaluate(() => {
    switchView("settings");
    window.releaseChatWriter = true;
  });
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => sent.length), 0);
  await page.evaluate(() => switchView("ai"));
  await page.waitForFunction(() => !document.querySelector("#aiSend").disabled);
  // Hold the IDB writer, then leave while send awaits persistence: no network call.
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        const r = indexedDB.open("godpower_ai_conversations", 1);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction("library", "readwrite"),
            store = tx.objectStore("library");
          window.releaseChatWriter = false;
          function loop() {
            const q = store.get("current");
            q.onsuccess = () => {
              if (!window.releaseChatWriter) loop();
            };
          }
          loop();
          tx.oncomplete = () => db.close();
          resolve();
        };
      }),
  );
  await page.locator("#aiPrompt").fill("old pending turn");
  await page.locator("#aiConsent").check();
  await page.locator("#aiSend").click();
  await page.locator("#aiNewConversation").click();
  await page.locator("#aiPrompt").fill("new turn survives");
  await page.locator("#aiConsent").check();
  await page.locator("#aiSend").click();
  await page.evaluate(() => (window.releaseChatWriter = true));
  await page.waitForFunction(() => !document.querySelector("#aiSend").disabled);
  assert.deepEqual(await page.evaluate(() => sent.map((r) => r.text)), [
    "new turn survives",
  ]);
  assert.ok(
    (await page.locator("#aiMessages").textContent()).includes(
      "模型回复：new turn survives",
    ),
  );
  await page.waitForFunction(() =>
    document.querySelector("#aiSavedState").textContent.includes("已保存"),
  );
  // A competing tab increments the CAS revision; this page must not overwrite it.
  const before = await page.evaluate(async () => {
    const l = await AIConversationRepository.load();
    return AIConversationRepository.save(l, l.revision);
  });
  await page.locator("#aiConversationTitle").fill("冲突写入");
  await page.locator("#aiRenameConversation").click();
  await page.waitForFunction(() =>
    document.querySelector("#aiSavedState").textContent.includes("其他页面"),
  );
  assert.deepEqual(
    await page.evaluate(() => AIConversationRepository.load()),
    before,
  );
  await page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open("godpower_ai_conversations", 1);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction("library", "readwrite");
          tx.objectStore("library").put({ broken: true }, "current");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
  );
  await page.reload();
  await page.evaluate(() => SaveManager.ready());
  await page.evaluate(() => switchView("ai"));
  await page.waitForFunction(() =>
    document.querySelector("#aiSavedState")?.textContent.includes("禁止覆盖"),
  );
  await page.locator("#aiPrompt").fill("查看小组积分");
  await page.locator("#aiSend").click();
  await page.waitForFunction(() => !document.querySelector("#aiSend").disabled);
  const raw = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const r = indexedDB.open("godpower_ai_conversations", 1);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction("library", "readonly"),
            q = tx.objectStore("library").get("current");
          tx.oncomplete = () => {
            db.close();
            resolve(q.result);
          };
        };
      }),
  );
  assert.deepEqual(raw, { broken: true });
  // Near-full library: input must stay intact and no model call may escape.
  await page.evaluate(async () => {
    const library = AIConversations.create({
      id: "large-one",
      time: new Date().toISOString(),
    });
    library.conversations.push(
      {
        id: "large-two",
        title: "历史",
        createdAt: new Date().toISOString(),
        messages: [],
      },
      {
        id: "empty",
        title: "新问题",
        createdAt: new Date().toISOString(),
        messages: [],
      },
    );
    library.activeId = "empty";
    for (let i = 0; i < 174; i++)
      library.conversations[i % 2].messages.push({
        id: "m" + i,
        role: "assistant",
        text: "x".repeat(24000),
        channel: "model",
        complete: true,
      });
    const tail = {
      id: "tail",
      role: "assistant",
      text: "x",
      channel: "model",
      complete: true,
    };
    library.conversations[1].messages.push(tail);
    tail.text += "x".repeat(
      4 * 1024 * 1024 - 100 - JSON.stringify(library).length,
    );
    AIConversations.validate(library);
    await new Promise((resolve) => {
      const r = indexedDB.open("godpower_ai_conversations", 1);
      r.onsuccess = () => {
        const db = r.result,
          tx = db.transaction("library", "readwrite");
        tx.objectStore("library").put(library, "current");
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
    });
  });
  await page.reload();
  await page.evaluate(() => SaveManager.ready());
  await page.evaluate(() => switchView("ai"));
  await page.waitForFunction(
    () => document.querySelector("#aiConversationTitle")?.value === "新问题",
  );
  await page.locator("#aiMode").selectOption("model");
  await page.locator("#aiPrompt").fill("z".repeat(500));
  await page.locator("#aiConsent").check();
  await page.locator("#aiSend").click();
  assert.equal(await page.locator("#aiPrompt").inputValue(), "z".repeat(500));
  assert.equal(await page.evaluate(() => sent.length), 0);
  assert.ok(
    (await page.locator("#aiSavedState").textContent()).includes("已满"),
  );
  assert.deepEqual(errors, []);
  await writeFile(
    "artifacts/ai-conversations/result.json",
    JSON.stringify(
      {
        status: "PASS",
        resolution: "1920x1080@1",
        checks: [
          "two-conversations",
          "rename-search",
          "reload",
          "history-consent",
          "late-result-discarded",
          "no-resumed-proposals",
          "CAS-conflict",
          "corrupt-library-preserved",
          "leave-during-save-no-network",
          "full-library-keeps-input",
          "old-send-cannot-cancel-new-send",
          "no-overflow",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS persistent conversations, bounded context, switch cancellation and CAS",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
