import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const scope = vm.createContext({ TextDecoder, TextEncoder });
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\n" +
    readFileSync("src/domain/teaching-resource.js", "utf8") +
    "\nglobalThis.api = TeachingResource;",
  scope,
);

const metadata = (changes = {}) => ({
  resourceId: "resource-test-1",
  profileId: "profile-teacher-1",
  classroomId: "classroom-1",
  subjectId: "politics",
  title: "权利与义务",
  tags: ["复习", "必修"],
  fileName: "notes.txt",
  mimeType: "text/plain",
  byteSize: 5,
  sha256: "a".repeat(64),
  importedAt: "2026-10-21T08:00:00.000Z",
  schemaVersion: 1,
  ...changes,
});

test("resource metadata validates stable identities, normalized tags and safe bounds", () => {
  const result = scope.api.validateMetadata(metadata());
  assert.equal(result.title, "权利与义务");
  assert.deepEqual(JSON.parse(JSON.stringify(result.tags)), ["复习", "必修"]);
  for (const changes of [
    { title: " " },
    { fileName: "../../notes.txt" },
    { mimeType: "text/html" },
    { fileName: "fake.png" },
    { byteSize: 20 * 1024 * 1024 + 1 },
    { sha256: "bad" },
    { profileId: "bad" },
  ])
    assert.throws(() => scope.api.validateMetadata(metadata(changes)));
});

test("resource bytes require matching signatures and reject active formats", () => {
  const bytes = new TextEncoder().encode("lesson");
  assert.equal(
    scope.api.validateFile({ ...metadata(), fileName: "notes.txt" }, bytes)
      .byteSize,
    6,
  );
  assert.throws(() =>
    scope.api.validateFile(
      { ...metadata(), fileName: "notes.html", mimeType: "text/html" },
      new TextEncoder().encode("<script>alert(1)</script>"),
    ),
  );
  assert.throws(() =>
    scope.api.validateFile(
      metadata({ fileName: "fake.png", mimeType: "image/png" }),
      bytes,
    ),
  );
  assert.throws(() =>
    scope.api.validateFile(
      metadata({ fileName: "active.pdf", mimeType: "application/pdf" }),
      new TextEncoder().encode("%PDF-1.7 /OpenAction /JavaScript"),
    ),
  );
});

test("resource matching is case-insensitive for filename extension only", () => {
  const result = scope.api.validateFile(
    metadata({ fileName: "NOTES.TXT" }),
    new TextEncoder().encode("text"),
  );
  assert.equal(result.fileName, "NOTES.TXT");
});

test("the six declared formats require matching MIME and recognizable content", () => {
  const cases = [
    ["guide.pdf", "application/pdf", "%PDF-1.7\n%%EOF"],
    ["guide.txt", "text/plain", "纯文本"],
    ["guide.json", "application/json", '{"topic":"rights"}'],
    [
      "picture.png",
      "image/png",
      Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
    ],
    ["picture.jpg", "image/jpeg", Uint8Array.from([255, 216, 255])],
    [
      "picture.webp",
      "image/webp",
      Uint8Array.from([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]),
    ],
  ];
  for (const [fileName, mimeType, content] of cases) {
    const bytes =
      typeof content === "string" ? new TextEncoder().encode(content) : content;
    assert.doesNotThrow(
      () =>
        scope.api.validateFile(
          metadata({ fileName, mimeType, byteSize: bytes.length }),
          bytes,
        ),
      fileName,
    );
  }
  assert.throws(() =>
    scope.api.validateFile(
      metadata({ fileName: "bad.json", mimeType: "application/json" }),
      new TextEncoder().encode("not valid json"),
    ),
  );
});
