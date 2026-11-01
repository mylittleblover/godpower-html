/* A fixed on-disk save file for the desktop build. localStorage stays the
   synchronous cache the classroom already relies on; this module mirrors the
   same envelope to a real file and can hydrate it at startup. */
globalThis.ClassroomSaveFile = (() => {
  "use strict";
  const bridge = () => globalThis.godpowerDesktop;
  let info = null;
  let ready = false;
  let lastError = null;

  function available() {
    const desktop = bridge();
    return !!(
      desktop &&
      desktop.role === "main" &&
      typeof desktop.saveFileWrite === "function"
    );
  }

  async function refreshInfo() {
    if (!available()) return null;
    try {
      info = await bridge().saveFileInfo();
      ready = true;
      return info;
    } catch (error) {
      lastError = String(error?.message || error);
      return null;
    }
  }

  /* Startup hydration: the file wins only when it holds a valid envelope and
     localStorage has nothing usable, so an existing browser save is never lost. */
  async function hydrate() {
    if (!available()) return { status: "unavailable" };
    const current = await refreshInfo();
    if (!current) return { status: "unavailable", error: lastError };
    let result;
    try {
      result = await bridge().saveFileRead();
    } catch (error) {
      return { status: "error", error: String(error?.message || error) };
    }
    if (!result?.ok) return { status: "error", error: result?.error || "读取失败" };
    if (!result.present) return { status: "empty", info: current };
    try {
      Reliability.validateBackup(result.data);
    } catch (error) {
      return { status: "invalid", error: String(error?.message || error) };
    }
    return { status: "loaded", data: result.data, info: current, bytes: result.bytes };
  }

  function write(payload) {
    if (!available()) return { ok: true, skipped: true };
    // Fire and forget: a classroom command must not await disk I/O, and the
    // localStorage envelope already carries the durable confirmation.
    Promise.resolve()
      .then(() => bridge().saveFileWrite(payload))
      .then((result) => {
        if (result?.ok) {
          lastError = null;
          if (result.info) info = result.info;
        } else {
          lastError = result?.error || "存档文件写入失败";
          showClassroomSaveWarning("存档文件未写入：" + lastError);
        }
      })
      .catch((error) => {
        lastError = String(error?.message || error);
        showClassroomSaveWarning("存档文件未写入：" + lastError);
      });
    return { ok: true, async: true };
  }

  async function choose() {
    if (!available()) return { ok: false, error: "仅桌面版可用" };
    try {
      const result = await bridge().saveFileChoose();
      if (result?.ok) {
        info = result.info;
        return result;
      }
      return result || { ok: false };
    } catch (error) {
      return { ok: false, error: String(error?.message || error) };
    }
  }

  async function setPath(value) {
    if (!available()) return { ok: false, error: "仅桌面版可用" };
    try {
      const result = await bridge().saveFileSet(value);
      if (result?.ok) info = result.info;
      return result;
    } catch (error) {
      return { ok: false, error: String(error?.message || error) };
    }
  }

  async function reset() {
    if (!available()) return { ok: false, error: "仅桌面版可用" };
    try {
      const result = await bridge().saveFileReset();
      if (result?.ok) info = result.info;
      return result;
    } catch (error) {
      return { ok: false, error: String(error?.message || error) };
    }
  }

  /* Reading the file back is destructive only for the in-memory classroom, so
     the caller must confirm first and export a backup. */
  async function loadFromFile() {
    if (!available()) return { status: "unavailable" };
    let result;
    try {
      result = await bridge().saveFileRead();
    } catch (error) {
      return { status: "error", error: String(error?.message || error) };
    }
    if (!result?.ok) return { status: "error", error: result?.error };
    if (!result.present) return { status: "empty" };
    try {
      Reliability.validateBackup(result.data);
    } catch (error) {
      return { status: "invalid", error: String(error?.message || error) };
    }
    return { status: "loaded", data: result.data };
  }

  return {
    available,
    hydrate,
    write,
    choose,
    setPath,
    reset,
    loadFromFile,
    refreshInfo,
    info: () => info,
    lastError: () => lastError,
    isReady: () => ready,
  };
})();
