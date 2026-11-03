/* First-level gameplay reference; data and copy remain in their existing owners. */
(function installGameplayPage(root) {
  "use strict";
  function render() {
    const host = document.getElementById("gameplayContent");
    if (host) host.innerHTML = itemReferenceMarkup();
  }
  function open() {
    switchView("gameplay");
  }
  function mountAbout(parent) {
    if (!parent || document.getElementById("aboutMain")) return;
    const section = document.createElement("section");
    section.className = "ui-settings-card gameplay-about-settings";
    section.innerHTML =
      '<nav class="gameplay-about-tabs" aria-label="关于与帮助"><button type="button" class="btn" data-about="info">项目与版本</button><button type="button" class="btn" data-about="guide">操作帮助</button></nav><div id="aboutMain" class="about-main"></div>';
    section.addEventListener("click", (event) => {
      const button = event.target.closest("[data-about]");
      if (button) renderAbout(button.dataset.about);
    });
    parent.append(section);
    renderAboutInformation("info");
  }
  root.GameplayPage = Object.freeze({ render, open, mountAbout });
})(globalThis);
