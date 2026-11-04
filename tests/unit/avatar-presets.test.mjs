import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { createHash } from "node:crypto";
const items = vm.runInNewContext(
  readFileSync("src/resources/avatar-presets.js", "utf8") +
    "\nAvatarPresetCatalog.items",
);
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
  for (const category of ["游戏角色", "政治人物", "花草", "岩石"])
    assert.ok(items.some((x) => x.category === category));
  for (const name of [
    "习近平",
    "胡锦涛",
    "邓小平",
    "马力欧",
    "火狐",
    "卡比",
    "皮卡丘",
  ])
    assert.ok(items.some((x) => x.name === name));
});
