/* Separate from classroom saves. One atomic CAS record prevents stale tabs overwriting chats. */
const AIConversationRepository = (() => {
  let connection;
  async function open() {
    if (!connection)
      connection = new Promise((resolve, reject) => {
        const r = indexedDB.open("godpower_ai_conversations", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("library");
        r.onsuccess = () => {
          r.result.onversionchange = () => {
            r.result.close();
            connection = null;
          };
          resolve(r.result);
        };
        r.onerror = () => {
          connection = null;
          reject(r.error);
        };
        r.onblocked = () => {
          connection = null;
          reject(Error("其他页面正在占用对话库，请关闭后重试"));
        };
      });
    return connection;
  }
  async function load() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("library", "readonly");
      const r = tx.objectStore("library").get("current");
      tx.oncomplete = () => {
        try {
          resolve(r.result == null ? null : AIConversations.validate(r.result));
        } catch (e) {
          reject(e);
        }
      };
      tx.onabort = tx.onerror = () => reject(tx.error || Error("对话读取失败"));
    });
  }
  async function save(value, expectedRevision) {
    const candidate = AIConversations.validate(value),
      db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("library", "readwrite"),
        store = tx.objectStore("library"),
        r = store.get("current");
      let failure;
      r.onsuccess = () => {
        try {
          const previous =
            r.result == null ? null : AIConversations.validate(r.result);
          if ((previous?.revision || 0) !== expectedRevision)
            throw Error("其他页面已修改对话，请先导出当前记录，再重新打开");
          candidate.revision = expectedRevision + 1;
          store.put(candidate, "current");
        } catch (e) {
          failure = e;
          tx.abort();
        }
      };
      tx.oncomplete = () => resolve(candidate);
      tx.onabort = tx.onerror = () =>
        reject(failure || tx.error || Error("对话保存失败"));
    });
  }
  return Object.freeze({ load, save });
})();
