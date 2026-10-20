(function installTeachingResource(root) {
  "use strict";

  const MAX_BYTES = 20 * 1024 * 1024;
  const FORMATS = Object.freeze({
    ".pdf": { mimeType: "application/pdf", kind: "pdf" },
    ".txt": { mimeType: "text/plain", kind: "text" },
    ".json": { mimeType: "application/json", kind: "json" },
    ".png": { mimeType: "image/png", kind: "png" },
    ".jpg": { mimeType: "image/jpeg", kind: "jpeg" },
    ".jpeg": { mimeType: "image/jpeg", kind: "jpeg" },
    ".webp": { mimeType: "image/webp", kind: "webp" },
  });
  const fail = (message) => {
    throw new TypeError(message);
  };

  function formatFor(fileName) {
    if (typeof fileName !== "string") return null;
    const index = fileName.lastIndexOf(".");
    return FORMATS[fileName.slice(index).toLowerCase()] || null;
  }

  function validateMetadata(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
      fail("resource metadata must be an object");
    if (input.schemaVersion !== 1) fail("resource schemaVersion 1 is required");
    if (
      !root.StableIdentity.isValidGroupUid(input.resourceId) ||
      !input.resourceId.startsWith("resource-")
    )
      fail("resource identity is invalid");
    if (!root.StableIdentity.isValidUserProfileId(input.profileId))
      fail("profile identity is invalid");
    if (!root.StableIdentity.isValidClassroomId(input.classroomId))
      fail("classroom identity is invalid");
    if (
      typeof input.subjectId !== "string" ||
      !input.subjectId.trim() ||
      input.subjectId.length > 80
    )
      fail("subject is required and must be at most 80 characters");
    if (
      typeof input.title !== "string" ||
      !input.title.trim() ||
      input.title.length > 160
    )
      fail("title is required and must be at most 160 characters");
    if (
      typeof input.fileName !== "string" ||
      input.fileName.length > 255 ||
      /[/\\\0]/.test(input.fileName) ||
      input.fileName === "." ||
      input.fileName === ".."
    )
      fail("file name must be a plain file name");
    const format = formatFor(input.fileName);
    if (!format || input.mimeType !== format.mimeType)
      fail("file extension and allowed MIME type must match");
    if (
      !Number.isSafeInteger(input.byteSize) ||
      input.byteSize < 1 ||
      input.byteSize > MAX_BYTES
    )
      fail("file must be between 1 byte and 20 MiB");
    if (
      typeof input.sha256 !== "string" ||
      !/^[a-f0-9]{64}$/i.test(input.sha256)
    )
      fail("SHA-256 digest is invalid");
    if (
      typeof input.importedAt !== "string" ||
      Number.isNaN(Date.parse(input.importedAt))
    )
      fail("import time must be a valid date");
    if (!Array.isArray(input.tags) || input.tags.length > 30)
      fail("tags must be an array with at most 30 entries");
    const tags = [
      ...new Set(
        input.tags.map((tag) => {
          if (typeof tag !== "string" || !tag.trim() || tag.trim().length > 40)
            fail("each tag must contain 1 to 40 characters");
          return tag.trim();
        }),
      ),
    ];
    return {
      resourceId: input.resourceId,
      profileId: input.profileId,
      classroomId: input.classroomId,
      subjectId: input.subjectId.trim(),
      title: input.title.trim(),
      tags,
      fileName: input.fileName,
      mimeType: format.mimeType,
      byteSize: input.byteSize,
      sha256: input.sha256.toLowerCase(),
      importedAt: new Date(input.importedAt).toISOString(),
      schemaVersion: 1,
    };
  }

  function validateFile(input, rawBytes) {
    const bytes =
      rawBytes instanceof Uint8Array ? rawBytes : new Uint8Array(rawBytes);
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES)
      fail("file must be between 1 byte and 20 MiB");
    const format = formatFor(input?.fileName);
    if (!format || input.mimeType !== format.mimeType)
      fail("file extension and allowed MIME type must match");
    const starts = (...expected) =>
      expected.every((value, index) => bytes[index] === value);
    if (
      format.kind === "png" &&
      !starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
    )
      fail("PNG signature does not match the file extension");
    if (format.kind === "jpeg" && !starts(0xff, 0xd8, 0xff))
      fail("JPEG signature does not match the file extension");
    if (
      format.kind === "webp" &&
      !(
        starts(0x52, 0x49, 0x46, 0x46) &&
        String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
      )
    )
      fail("WebP signature does not match the file extension");
    const decoder = new TextDecoder("utf-8", { fatal: true });
    if (format.kind === "text" || format.kind === "json") {
      const text = decoder.decode(bytes);
      if (format.kind === "json") {
        try {
          JSON.parse(text);
        } catch {
          fail("JSON file is malformed");
        }
      }
    }
    if (format.kind === "pdf") {
      const header = new TextDecoder("latin1").decode(
        bytes.slice(0, Math.min(bytes.length, 1024)),
      );
      if (!header.startsWith("%PDF-"))
        fail("PDF signature does not match the file extension");
      const searchable = new TextDecoder("latin1").decode(bytes);
      if (/\/(?:JavaScript|JS|OpenAction|AA|Launch)\b/i.test(searchable))
        fail("active PDF actions are not allowed");
    }
    return validateMetadata({ ...input, byteSize: bytes.byteLength });
  }

  root.TeachingResource = Object.freeze({
    MAX_BYTES,
    FORMATS,
    validateMetadata,
    validateFile,
  });
})(globalThis);
