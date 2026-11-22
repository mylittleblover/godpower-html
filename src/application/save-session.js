/* One active save owner; serialized ACKs precede cutover and stale work is rejected. */
(function installSaveSession(root) {
  "use strict";
  const clone = (value) => root.SaveSchema.clone(value);
  async function create({
    repository,
    apply,
    onStatus = () => {},
    beforeSwitch = () => {},
    commandBusy = () => false,
  }) {
    const initial = await repository.list();
    if (!initial?.ok)
      throw Error(initial?.message || initial?.code || "无法读取存档索引");
    let index = initial.index;
    if (!index.activeSaveId) throw Error("NO_ACTIVE_SAVE");
    const loaded = await repository.load(index.activeSaveId);
    if (!loaded?.ok)
      throw Error(loaded?.message || loaded?.code || "无法读取当前存档");
    let current = root.SaveSchema.validateV2(loaded.document),
      switching = false,
      queue = Promise.resolve({ ok: true });
    function status(phase, error = null) {
      try {
        onStatus({
          phase,
          saveId: current.saveId,
          revision: current.revision,
          pendingSettlement: !!current.match.pendingSettlement,
          generation: index.generation,
          error,
        });
      } catch (reportError) {
        console.error("Save status presentation failed", reportError);
      }
    }
    const token = () =>
      Object.freeze({ saveId: current.saveId, generation: index.generation });
    const matches = (t) =>
      t && t.saveId === current.saveId && t.generation === index.generation;
    const reject = (code, message = code) => ({
      ok: false,
      code,
      error: message,
    });
    function enqueue(operation) {
      const run = async () => {
        try {
          return await operation();
        } catch (error) {
          status("error", error.message);
          return reject(error.code || "SAVE_FAILED", error.message);
        }
      };
      queue = queue.then(run, run);
      return queue;
    }
    async function applyCurrent() {
      try {
        await apply(clone(current));
        return true;
      } catch (error) {
        status("presentation-error", error.message);
        return false;
      }
    }
    if (!(await applyCurrent()))
      throw Error("无法显示已保存的课堂，存档原文仍保留");
    status("ready");
    return Object.freeze({
      token,
      snapshot: () => clone(current),
      rosterContext: () => ({
        ...token(),
        rosterRevision: current.roster.revision,
      }),
      archivesView: () => clone(current.archives),
      rosterView: () => ({
        saveId: current.saveId,
        revision: current.revision,
        name: current.name,
        roster: clone(current.roster),
      }),
      isSwitching: () => switching,
      whenIdle: () => queue,
      update: (
        prepare,
        {
          token: requested = token(),
          apply: shouldApply = false,
          cloneCurrent = true,
        } = {},
      ) => {
        if (switching)
          return Promise.resolve(
            reject("SAVE_SWITCHING", "正在切换存档，请稍候"),
          );
        if (!matches(requested))
          return Promise.resolve(
            reject("GENERATION_CONFLICT", "操作属于旧存档，已取消"),
          );
        return enqueue(async () => {
          if (!matches(requested)) return reject("GENERATION_CONFLICT");
          status("saving");
          const prepared = await prepare(
            cloneCurrent ? clone(current) : current,
          );
          if (!matches(requested)) return reject("GENERATION_CONFLICT");
          const doc = root.SaveSchema.assertV2(prepared.document);
          if (
            doc.saveId !== current.saveId ||
            doc.revision !== current.revision
          )
            return reject("REVISION_CONFLICT");
          const result = await repository.commit(
            current.saveId,
            current.revision,
            doc,
            {
              expectedGeneration: index.generation,
              assets: prepared.assets || [],
              owned: true,
            },
          );
          if (!result?.ok) {
            status("error", result?.message || result?.code);
            return {
              ...result,
              error: result?.message || result?.code || "保存失败",
            };
          }
          current = result.document;
          index = result.index;
          const applied = shouldApply ? await applyCurrent() : true;
          status(applied ? "saved" : "presentation-error");
          return { ...result, applied };
        });
      },
      switchTo: (id) => {
        if (switching) return Promise.resolve(reject("SAVE_SWITCHING"));
        if (commandBusy())
          return Promise.resolve(
            reject("COMMAND_PENDING", "请先完成当前操作再切换存档"),
          );
        switching = true;
        status("switching");
        return enqueue(async () => {
          try {
            await beforeSwitch();
            const result = await repository.switchActive(id, {
              expectedGeneration: index.generation,
            });
            if (!result?.ok) {
              status("error", result?.message || result?.code);
              return { ...result, error: result?.message || result?.code };
            }
            index = result.index;
            current = result.document;
            const applied = await applyCurrent();
            status(applied ? "ready" : "presentation-error");
            return { ...result, applied };
          } finally {
            switching = false;
          }
        });
      },
    });
  }
  root.SaveSession = Object.freeze({ create });
})(globalThis);
