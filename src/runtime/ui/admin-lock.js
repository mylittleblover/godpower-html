function toggleLock() {
  if (state.isLocked) openPwdModal();
  else {
    state.isLocked = true;
    showToast("上帝模式已下班，现实重新进入只读状态");
    renderAll();
  }
}

function openPwdModal() {
  document.getElementById("pwdInput").value = "";
  showClassroomWindow(document.getElementById("pwdModal"));
  setTimeout(() => document.getElementById("pwdInput").focus(), 80);
}

function closePwdModal() {
  hideClassroomWindow(document.getElementById("pwdModal"));
}

function handlePwdKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitPassword();
  } else if (event.key === "Escape") closePwdModal();
}

function submitPassword() {
  const val = document.getElementById("pwdInput").value.trim();
  if (val === state.adminPin) {
    state.isLocked = false;
    closePwdModal();
    showToast("认证通过，上帝模式已上线，请谨慎修改现实");
    renderAll();
  } else {
    themeAlert("密码错误，请重新输入");
    const input = document.getElementById("pwdInput");
    input.value = "";
    input.focus();
  }
}

function updateAdminPin() {
  const newPin = document.getElementById("newPwdInput").value.trim();
  if (newPin.length < 3) {
    themeAlert("新密码长度不能少于 3 位");
    return;
  }
  state.adminPin = newPin;
  saveState();
  document.getElementById("newPwdInput").value = "";
  showToast("管理密码修改成功");
}
