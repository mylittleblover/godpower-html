const UI_DB_NAME = "PoliticsUiDB";
let uiDbPromise = null;
function uiDbOpen() {
  if (uiDbPromise) return uiDbPromise;
  uiDbPromise = new Promise((res) => {
    try {
      const r = indexedDB.open(UI_DB_NAME, 1);
      r.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains("kv")) d.createObjectStore("kv");
      };
      r.onsuccess = (e) => res(e.target.result);
      r.onerror = () => res(null);
    } catch (_) {
      res(null);
    }
  });
  return uiDbPromise;
}
async function uiDbReq(mode, fn) {
  const d = await uiDbOpen();
  if (!d) return null;
  return new Promise((res) => {
    try {
      const tx = d.transaction("kv", mode);
      const req = fn(tx.objectStore("kv"));
      req.onsuccess = () => res(req.result === undefined ? null : req.result);
      req.onerror = () => res(null);
    } catch (_) {
      res(null);
    }
  });
}

let wallpaperUrl = null;
function getWallVeil() {
  const v = Number(STORAGE.get("politics_wall_veil", 0.35));
  return Number.isFinite(v) ? Math.max(0, Math.min(0.8, v)) : 0.35;
}
function applyWallpaperVeil() {
  const root = document.documentElement;
  const a = wallpaperUrl ? getWallVeil() : 0;
  root.style.setProperty(
    "--ui-wall-veil",
    `linear-gradient(rgba(243,247,246,${a}), rgba(243,247,246,${a}))`,
  );
  const label = document.getElementById("wallVeilLabel");
  if (label) label.innerText = Math.round(getWallVeil() * 100) + "%";
  const range = document.getElementById("cfgWallVeil");
  if (range) {
    range.value = getWallVeil();
    range.disabled = !wallpaperUrl;
  }
}
function applyWallpaper(blob) {
  const root = document.documentElement;
  if (wallpaperUrl) {
    URL.revokeObjectURL(wallpaperUrl);
    wallpaperUrl = null;
  }
  if (blob) {
    wallpaperUrl = URL.createObjectURL(blob);
    root.style.setProperty("--ui-wall", `url("${wallpaperUrl}")`);
  } else {
    root.style.removeProperty("--ui-wall");
  }
  const st = document.getElementById("wallpaperStatus");
  if (st) st.innerText = blob ? "当前：自定义壁纸" : "当前：内置极光";
  applyWallpaperVeil();
}
async function compressWallpaper(file) {
  const MAX_EDGE = 2560;
  let img;
  if (window.createImageBitmap) {
    img = await createImageBitmap(file);
  } else {
    img = await new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const im = new Image();
      im.onload = () => {
        URL.revokeObjectURL(url);
        res(im);
      };
      im.onerror = () => {
        URL.revokeObjectURL(url);
        rej(new Error("decode"));
      };
      im.src = url;
    });
  }
  const w0 = img.width,
    h0 = img.height;
  const scale = Math.min(1, MAX_EDGE / Math.max(w0, h0));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w0 * scale));
  canvas.height = Math.max(1, Math.round(h0 * scale));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if (img.close) img.close();
  return new Promise((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.85));
}
async function onWallpaperFile(input) {
  const file = input.files && input.files[0];
  input.value = "";
  if (!file) return;
  if (!/^image\//.test(file.type)) {
    showToast("请选择图片文件");
    return;
  }
  try {
    showToast("正在处理壁纸…");
    const blob = await compressWallpaper(file);
    if (!blob) throw new Error("encode");
    const saved = await uiDbReq("readwrite", (st) => st.put(blob, "wallpaper"));
    applyWallpaper(blob);
    showToast(
      saved === null
        ? "壁纸已应用，但本机存储失败，刷新后会恢复极光"
        : `壁纸已保存（${Math.round(blob.size / 1024)} KB）`,
    );
  } catch (e) {
    showToast("这张图片无法读取，换一张试试");
  }
}
async function resetWallpaper() {
  await uiDbReq("readwrite", (st) => st.delete("wallpaper"));
  applyWallpaper(null);
  showToast("已恢复内置极光壁纸");
}
function changeWallpaperVeil(v) {
  STORAGE.set("politics_wall_veil", Number(v));
  applyWallpaperVeil();
}
async function initWallpaper() {
  const b = await uiDbReq("readonly", (st) => st.get("wallpaper"));
  applyWallpaper(b instanceof Blob ? b : null);
}
window.addEventListener("DOMContentLoaded", initWallpaper);
