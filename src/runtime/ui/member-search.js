function openMemberSearchModal() {
  const backdrop = document.getElementById("memberSearchBackdrop");
  const input = document.getElementById("memberSearchInput");
  if (!backdrop || !input) return;
  backdrop.classList.add("active");
  input.value = "";
  document.getElementById("memberSearchResults").innerHTML =
    '<div class="member-search-empty">输点姓名或学号吧，读心术模块还没获批。</div>';
  setTimeout(() => input.focus(), 50);
}

function closeMemberSearchModal() {
  const backdrop = document.getElementById("memberSearchBackdrop");
  if (backdrop) hideClassroomWindow(backdrop);
}

function handleMemberSearchKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchMemberGroups();
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeMemberSearchModal();
  }
}

function searchMemberGroups() {
  const input = document.getElementById("memberSearchInput");
  const results = document.getElementById("memberSearchResults");
  if (!input || !results) return;

  const keyword = input.value.trim().toLowerCase();
  if (!keyword) {
    results.innerHTML =
      '<div class="member-search-empty">输点姓名或学号吧，读心术模块还没获批。</div>';
    return;
  }

  const matches = [];
  state.groups.forEach((g) => {
    const members = Array.isArray(g.members) ? g.members : [];
    members.forEach((member) => {
      const name = String(member).trim();
      if (name && name.toLowerCase().includes(keyword)) {
        matches.push({ name, group: g });
      }
    });
  });

  if (!matches.length) {
    results.innerHTML = `<div class="member-search-empty">没有找到“${escapeHtml(input.value.trim())}”</div>`;
    return;
  }

  results.innerHTML = matches
    .map((item) => {
      const g = item.group;
      const memberList = (Array.isArray(g.members) ? g.members : [])
        .map(escapeHtml)
        .join("、");
      return `
      <div class="member-search-result">
        <div class="member-search-result-name">${escapeHtml(item.name)}</div>
        <div class="member-search-result-group">${escapeHtml(g.name)}</div>
        <div class="member-search-result-members">成员：${memberList || "暂无成员"}</div>
      </div>`;
    })
    .join("");
}
