const AIKnowledgeRepository = (() => {
  let connection;
  function open() {
    return (connection ||= new Promise((resolve, reject) => {
      const r = indexedDB.open("godpower_ai_knowledge", 1);
      r.onupgradeneeded = () =>
        r.result.createObjectStore("documents", { keyPath: "id" });
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
      r.onblocked = () => reject(Error("资料库被其他窗口占用"));
    }));
  }
  async function list() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("documents", "readonly"),
        r = tx.objectStore("documents").getAll();
      tx.oncomplete = () => {
        try {
          resolve(r.result.map(AIKnowledge.validate));
        } catch (e) {
          reject(e);
        }
      };
      tx.onabort = tx.onerror = () => reject(tx.error || Error("资料读取失败"));
    });
  }
  async function importDocuments(input) {
    if (!Array.isArray(input) || !input.length || input.length > 100)
      throw Error("单次导入需为1至100条资料");
    const documents = [];
    for (const value of input) {
      const d = AIKnowledge.validate({ ...value, kind: "user-note" }),
        canonical = JSON.stringify({ ...d, id: "" }),
        digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(canonical),
        );
      d.id =
        "user-" +
        [...new Uint8Array(digest)]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      documents.push(d);
    }
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("documents", "readwrite"),
        store = tx.objectStore("documents"),
        r = store.getAll();
      let failure;
      r.onsuccess = () => {
        try {
          const previous = r.result.map(AIKnowledge.validate),
            ids = new Set(previous.map((d) => d.id));
          if (
            previous.length + documents.length > 100 ||
            JSON.stringify([...previous, ...documents]).length > 2 * 1024 * 1024
          )
            throw Error(
              "资料库上限为100条或2Mi字符，请先导出并删除不需要的资料",
            );
          for (const d of documents) {
            if (ids.has(d.id))
              throw Error("发现重复资料，本批导入未修改资料库");
            ids.add(d.id);
          }
          for (const d of documents) store.add(d);
        } catch (e) {
          failure = e;
          tx.abort();
        }
      };
      tx.oncomplete = () => resolve(documents);
      tx.onabort = tx.onerror = () =>
        reject(failure || tx.error || Error("导入未保存，原资料未改变"));
    });
  }
  async function remove(id) {
    if (!/^user-[a-f0-9]{64}$/.test(id)) throw Error("内置资料不可删除");
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("documents", "readwrite");
      tx.objectStore("documents").delete(id);
      tx.oncomplete = () => resolve();
      tx.onabort = tx.onerror = () => reject(tx.error || Error("删除失败"));
    });
  }
  return Object.freeze({ list, importDocuments, remove });
})();
