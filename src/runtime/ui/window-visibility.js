/* Shared UI-only visibility adapter. Business cleanup stays in its original command. */
function showClassroomWindow(root) {
  if (!root) return;
  if (typeof DesktopUI !== "undefined") DesktopUI.cancelWindowClose(root);
  root.classList.add("active");
}
function hideClassroomWindow(root, finish) {
  if (!root) return;
  const commit = finish || (() => root.classList.remove("active"));
  if (typeof DesktopUI !== "undefined") DesktopUI.dismissWindow(root, commit);
  else commit();
}
