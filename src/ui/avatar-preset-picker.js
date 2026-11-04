/* Presentation only. Every assignment uses the existing verified avatar save path. */
const AvatarPresetPicker = (() => {
  let dialog,
    owner,
    page = 0,
    busy = false;
  const size = 24;
  function close() {
    if (busy || !dialog?.open) return;
    const closingOwner = owner;
    DesktopUI.dismissWindow(dialog, () => {
      dialog.close();
      if (owner === closingOwner) owner = null;
    });
  }
  function current() {
    const now = SaveManager.context(),
      before = owner?.target.context;
    if (
      !before ||
      before.saveId !== now?.saveId ||
      before.generation !== now.generation
    )
      throw Error("存档已经切换，请重新选择头像");
  }
  async function perform(action) {
    if (busy) return;
    try {
      current();
      busy = true;
      dialog.setAttribute("aria-busy", "true");
      await action();
      busy = false;
      close();
    } catch (error) {
      dialog.querySelector("[role=status]").textContent = error.message;
    } finally {
      busy = false;
      dialog.removeAttribute("aria-busy");
    }
  }
  function render() {
    const category = dialog.querySelector("select").value,
      query = dialog.querySelector("input").value.trim().toLocaleLowerCase();
    const all = AvatarPresetCatalog.items.filter(
      (x) =>
        (!category || x.category === category) &&
        (x.name + " " + x.id).toLocaleLowerCase().includes(query),
    );
    const pages = Math.max(1, Math.ceil(all.length / size));
    page = Math.min(page, pages - 1);
    const grid = dialog.querySelector("[data-preset-grid]");
    grid.replaceChildren();
    for (const item of all.slice(page * size, (page + 1) * size)) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.presetCard = item.id;
      b.title = item.name;
      const img = new Image();
      img.src = item.dataUrl;
      img.alt = "";
      img.width = 80;
      img.height = 80;
      img.loading = "lazy";
      const label = document.createElement("span");
      label.textContent = item.name;
      b.append(img, label);
      b.onclick = () =>
        perform(async () => {
          const response = await fetch(item.dataUrl);
          current();
          await owner.onChoose(
            new File([await response.blob()], item.id + ".webp", {
              type: "image/webp",
            }),
          );
        });
      grid.append(b);
    }
    dialog.querySelector("[data-preset-count]").textContent =
      `${all.length} 个预设 · ${page + 1} / ${pages}`;
    dialog.querySelector("[data-preset-prev]").disabled = page === 0;
    dialog.querySelector("[data-preset-next]").disabled = page + 1 >= pages;
  }
  function mount() {
    if (dialog) return;
    dialog = document.createElement("dialog");
    dialog.id = "avatarPresetDialog";
    dialog.className = "avatar-preset-dialog";
    dialog.setAttribute("aria-label", "选择头像");
    dialog.innerHTML =
      '<header><div><h3>选择头像</h3><p>预设离线可用，也可以上传自己的照片。</p></div><button type="button" data-preset-close aria-label="关闭">❌</button></header><div class="avatar-preset-controls"><input id="avatarPresetSearch" type="search" placeholder="搜索名称或角色" aria-label="搜索预设"><select aria-label="预设分类"><option value="">全部分类</option></select></div><div data-preset-grid></div><p role="status"></p><footer><button type="button" class="btn" data-avatar-upload>上传照片</button><button type="button" class="btn btn-danger" data-avatar-clear>清除头像</button><span data-preset-count></span><button type="button" class="btn" data-preset-prev>上一页</button><button type="button" class="btn" data-preset-next>下一页</button></footer>';
    const surface = document.createElement("section");
    surface.className = "avatar-preset-surface ui-function-surface";
    surface.append(...dialog.childNodes);
    dialog.append(surface);
    for (const category of [
      ...new Set(AvatarPresetCatalog.items.map((x) => x.category)),
    ]) {
      const o = document.createElement("option");
      o.value = o.textContent = category;
      dialog.querySelector("select").append(o);
    }
    dialog.querySelector("[data-preset-close]").onclick = close;
    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      close();
    });
    dialog.querySelector("input").oninput = dialog.querySelector(
      "select",
    ).onchange = () => {
      page = 0;
      render();
    };
    dialog.querySelector("[data-preset-prev]").onclick = () => {
      page--;
      render();
    };
    dialog.querySelector("[data-preset-next]").onclick = () => {
      page++;
      render();
    };
    dialog.querySelector("[data-avatar-clear]").onclick = () =>
      perform(() => owner.onClear());
    dialog.querySelector("[data-avatar-upload]").onclick = () => {
      current();
      const upload = owner.onUpload;
      close();
      upload();
    };
    document.body.append(dialog);
    window.addEventListener("godpower:active-save-changed", () => {
      if (!busy) close();
    });
  }
  return {
    open(options) {
      mount();
      if (busy) return;
      DesktopUI.cancelWindowClose(dialog);
      owner = options;
      page = 0;
      dialog.querySelector("input").value = "";
      dialog.querySelector("select").value = "";
      dialog.querySelector("[role=status]").textContent = "";
      render();
      dialog.showModal();
      const preferences = DesktopUI.getPreferences();
      if (
        preferences.pageMotion &&
        preferences.motion !== "off" &&
        !(
          preferences.systemMotion &&
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
      ) {
        const style = getComputedStyle(document.documentElement);
        const animation = dialog
          .querySelector(".avatar-preset-surface")
          .animate(
            [
              {
                opacity: 0,
                transform:
                  preferences.motion === "full"
                    ? "translateY(32px) scale(.97)"
                    : "translateY(8px)",
              },
              { opacity: 1, transform: "none" },
            ],
            {
              duration:
                (parseFloat(style.getPropertyValue("--motion-normal")) || 240) /
                preferences.speed,
              easing: style.getPropertyValue("--motion-ease").trim(),
              fill: "backwards",
            },
          );
        animation.finished.catch(() => {});
      }
    },
    close,
  };
})();
