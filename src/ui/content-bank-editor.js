/* Local knowledge/challenge form adapter. Persistence and validation belong to its injected save command. */
const GodPowerContentBankEditor = Object.freeze({
  create({
    query: $,
    escape: E,
    getBank,
    getSubject,
    saveContentBank,
    themeConfirm,
  }) {
    function render() {
      const host = $("#uiStructuredBank");
      if (!host) return;
      host.innerHTML = `<p class="ui-muted">知识 ${getBank().knowledge.length} 条 · 挑战 ${getBank().challenges.length} 条，合计最多 500 条。保存后立即生效，不影响课堂积分。</p><div class="ui-toolbar"><button class="btn" data-bank-add="knowledge">添加知识</button><button class="btn" data-bank-add="challenges">添加挑战</button><label class="btn" for="uiBankFile">导入 JSON 文件</label><input id="uiBankFile" type="file" accept=".json,application/json" aria-label="导入题库 JSON 文件"></div><div id="uiBankForm"></div>${[
        "knowledge",
        "challenges",
      ]
        .map(
          (kind) =>
            `<section><h4>${kind === "knowledge" ? "知识卡片" : "课堂挑战"}</h4>${
              getBank()[kind].length
                ? getBank()
                    [kind].map(
                      (row, index) =>
                        `<div class="ui-settings-row"><div><b>${E(row.title)}</b><p class="ui-muted">${E(row.subject)} · ${E(row.id)}</p></div><div class="ui-toolbar"><button class="btn btn-sm" data-bank-edit="${kind}" data-index="${index}">编辑</button><button class="btn btn-sm btn-danger" data-bank-delete="${kind}" data-index="${index}">删除</button></div></div>`,
                    )
                    .join("")
                : '<p class="ui-muted">暂无内容，点击上方按钮添加。</p>'
            }</section>`,
        )
        .join("")}`;
      host
        .querySelectorAll("[data-bank-add]")
        .forEach(
          (button) => (button.onclick = () => edit(button.dataset.bankAdd)),
        );
      host
        .querySelectorAll("[data-bank-edit]")
        .forEach(
          (button) =>
            (button.onclick = () =>
              edit(button.dataset.bankEdit, Number(button.dataset.index))),
        );
      host.querySelectorAll("[data-bank-delete]").forEach(
        (button) =>
          (button.onclick = async () => {
            const kind = button.dataset.bankDelete,
              index = Number(button.dataset.index),
              row = getBank()[kind][index];
            if (
              !(await themeConfirm("删除“" + row.title + "”？", {
                title: "删除题库内容",
                danger: true,
              }))
            )
              return;
            try {
              const next = JSON.parse(JSON.stringify(getBank()));
              // Resolve by id after confirmation in case another edit changed ordering.
              next[kind] = next[kind].filter((value) => value.id !== row.id);
              saveContentBank(next);
              $("#uiBankStatus").textContent = "内容已删除。";
            } catch (error) {
              $("#uiBankStatus").textContent = "删除失败：" + error.message;
            }
          }),
      );
      $("#uiBankFile").onchange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          if (file.size > 16 * 1024 * 1024) throw Error("文件不能超过 16 MB");
          saveContentBank(JSON.parse(await file.text()));
          $("#uiBankStatus").textContent = "文件已验证并导入。";
        } catch (error) {
          $("#uiBankStatus").textContent =
            "未导入，现有题库保持原样：" + error.message;
          event.target.value = "";
        }
      };
    }
    function edit(kind, index = -1) {
      const row =
        index < 0
          ? {
              id: "",
              subject: getSubject(),
              title: "",
              source: "",
              options: ["", "", "", ""],
              answer: 0,
            }
          : getBank()[kind][index];
      const fields =
        kind === "knowledge"
          ? [
              ["id", "唯一 ID"],
              ["subject", "学科"],
              ["title", "知识标题"],
              ["module", "模块"],
              ["summary", "知识摘要"],
              ["mistake", "易错点"],
              ["detail", "详细解释"],
              ["source", "来源"],
            ]
          : [
              ["id", "唯一 ID"],
              ["subject", "学科"],
              ["title", "题目"],
              ["source", "来源"],
              ["explanation", "答案解析"],
            ];
      const host = $("#uiBankForm");
      host.innerHTML = `<form class="ui-panel" id="uiBankRowForm"><h4>${index < 0 ? "添加" : "编辑"}${kind === "knowledge" ? "知识" : "挑战"}</h4>${fields.map(([key, label]) => `<label class="ui-settings-row" for="uiBankField-${key}"><span>${label}</span><textarea class="ui-bank-field" style="width:65%;min-height:44px;resize:vertical" id="uiBankField-${key}" name="${key}" maxlength="10000" ${["id", "subject", "title", "source"].includes(key) ? "required" : ""}>${E(row[key] || "")}</textarea></label>`).join("")}${kind === "challenges" ? row.options.map((value, i) => `<label class="ui-settings-row" for="uiBankOption-${i}"><span>选项 ${"ABCD"[i]}</span><input id="uiBankOption-${i}" name="option${i}" value="${E(value)}" maxlength="10000" required></label>`).join("") + `<label class="ui-settings-row" for="uiBankAnswer"><span>正确答案</span><select id="uiBankAnswer" name="answer">${[0, 1, 2, 3].map((i) => `<option value="${i}" ${row.answer === i ? "selected" : ""}>${"ABCD"[i]}</option>`).join("")}</select></label>` : ""}<div class="ui-toolbar"><button class="btn btn-primary" type="submit">保存内容</button><button class="btn" type="button" id="uiBankCancel">取消</button></div><p id="uiBankFormStatus" role="status"></p></form>`;
      $("#uiBankCancel").onclick = () => host.replaceChildren();
      $("#uiBankRowForm").onsubmit = (event) => {
        event.preventDefault();
        try {
          const data = new FormData(event.target),
            edited = { ...row };
          fields.forEach(
            ([key]) => (edited[key] = String(data.get(key)).trim()),
          );
          if (kind === "challenges") {
            edited.options = [0, 1, 2, 3].map((i) =>
              String(data.get("option" + i)).trim(),
            );
            edited.answer = Number(data.get("answer"));
          }
          const next = JSON.parse(JSON.stringify(getBank()));
          if (index < 0) next[kind].push(edited);
          else next[kind][index] = edited;
          saveContentBank(next);
          $("#uiBankStatus").textContent = "内容已保存。";
        } catch (error) {
          $("#uiBankFormStatus").textContent = "未保存：" + error.message;
        }
      };
      $("#uiBankField-title").focus();
    }
    return Object.freeze({ render, edit });
  },
});
