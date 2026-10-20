import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { launch, setup } from "../fixtures/browser.mjs";

const html = await readFile("dist/godpower.html");
const server = createServer((_, response) => {
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  response.end(html);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await launch("chromium");
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await setup(page, 4);
  const result = await page.evaluate(async () => {
    const unavailable = await TeachingResourceRepository.open({
      indexedDB: null,
    }).then(
      () => "unexpected-success",
      (error) => error.code,
    );
    const repo = await TeachingResourceRepository.open();
    const bytes = new TextEncoder().encode("offline lesson text");
    const file = new File([bytes], "lesson.txt", { type: "text/plain" });
    const base = {
      profileId: "profile-teacher-test",
      classroomId: "classroom-test",
      subjectId: "politics",
      title: "权利与义务",
      tags: ["复习", "必修"],
    };
    const created = await repo.addBatch([{ ...base, file }]);
    const duplicate = await repo
      .addBatch([{ ...base, resourceId: "resource-duplicate", file }])
      .then(
        () => "unexpected-success",
        (error) => error.code,
      );
    const malformedBatch = await repo
      .addBatch([
        {
          ...base,
          resourceId: "resource-good-in-batch",
          file: new File(["new"], "new.txt", { type: "text/plain" }),
        },
        {
          ...base,
          resourceId: "resource-bad-in-batch",
          file: new File(["<script>bad()</script>"], "bad.html", {
            type: "text/html",
          }),
        },
      ])
      .then(
        () => "unexpected-success",
        (error) => error.code || error.message,
      );
    const afterMalformed = await repo.list();
    const query = await repo.list({ query: "复习", subjectId: "politics" });
    const stored = await repo.get(created[0].resourceId);
    const restoredText = await stored.blob.text();
    const insufficientSpace = await TeachingResourceRepository.open({
      storageManager: { estimate: async () => ({ usage: 100, quota: 101 }) },
    }).then(async (limited) =>
      limited
        .addBatch([
          {
            ...base,
            resourceId: "resource-quota",
            file: new File(["too large for quota"], "quota.txt", {
              type: "text/plain",
            }),
          },
        ])
        .then(
          () => "unexpected-success",
          (error) => error.code,
        ),
    );
    await repo.remove(created[0].resourceId);
    const afterDelete = await repo.list();
    repo.close();
    return {
      unavailable,
      duplicate,
      malformedBatch,
      afterMalformedCount: afterMalformed.length,
      queryCount: query.length,
      restoredText,
      insufficientSpace,
      afterDeleteCount: afterDelete.length,
      listLoadsBlob: Object.hasOwn(afterMalformed[0] || {}, "blob"),
    };
  });
  assert.equal(result.duplicate, "DUPLICATE_CONTENT");
  assert.equal(result.unavailable, "UNAVAILABLE");
  assert.notEqual(result.malformedBatch, "unexpected-success");
  assert.equal(result.afterMalformedCount, 1);
  assert.equal(
    result.listLoadsBlob,
    false,
    "metadata listings should not load large Blob objects",
  );
  assert.equal(result.queryCount, 1);
  assert.equal(result.restoredText, "offline lesson text");
  assert.equal(result.insufficientSpace, "QUOTA_PREDICTED");
  assert.equal(result.afterDeleteCount, 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS isolated IndexedDB resource repository at Chromium 1920x1080",
  );
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
