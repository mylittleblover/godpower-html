import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";
const catalog = vm.runInNewContext(
  readFileSync("src/resources/avatar-presets.js", "utf8") +
    "\nAvatarPresetCatalog",
);
const items = catalog.items;
test("offline avatar presets are bounded, unique and backed by source hashes", () => {
  const proof = JSON.parse(
    readFileSync("docs/AVATAR_PRESET_SOURCES.json", "utf8"),
  );
  assert.equal(items.length, proof.items.length);
  assert.equal(
    items.filter((x) => x.id.startsWith("smash-")).length,
    proof.sourceRosterCount,
  );
  assert.equal(new Set(items.map((x) => x.id)).size, items.length);
  for (const item of items) {
    assert.match(item.dataUrl, /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/);
    const bytes = Buffer.from(item.dataUrl.split(",")[1], "base64");
    assert.equal(bytes.length, item.bytes);
    assert.ok(bytes.length < 30000);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
    assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
    assert.ok(item.source.startsWith("https://"));
    assert.ok(item.license.length > 10);
  }
  assert.deepEqual(Array.from(catalog.categories || []), [
    "花草",
    "岩石",
    "近代政治人物",
    "现代政治人物",
    "任天堂与大乱斗",
  ]);
  assert.equal(items.at(-1).category, "任天堂与大乱斗");
  for (const category of [
    "花草",
    "岩石",
    "近代政治人物",
    "现代政治人物",
    "任天堂与大乱斗",
  ])
    assert.ok(items.some((x) => x.category === category));
  for (const name of [
    "习近平",
    "胡锦涛",
    "邓小平",
    "毛泽东",
    "孙中山",
    "蒋介石",
    "汪精卫",
    "林彪",
    "王洪文",
    "赵紫阳",
    "马力欧",
    "火狐",
    "卡比",
    "皮卡丘",
  ])
    assert.ok(items.some((x) => x.name === name));
});
