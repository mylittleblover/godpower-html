/* Canonical roster edits; labels are a compatibility projection, never identity. */
(function installSaveRoster(root) {
  "use strict";
  const validate = (input) => root.SaveSchema.validateV2(input);
  const label = (student) =>
    student.legacyLabel ||
    [student.number, student.displayName].filter(Boolean).join(" ");
  function project(doc) {
    const students = new Map(doc.roster.students.map((s) => [s.studentUid, s]));
    for (const group of doc.match.groups)
      group.members = doc.roster.assignments
        .filter((a) => a.groupUid === group.groupUid)
        .map((a) => label(students.get(a.studentUid)));
    return doc;
  }
  function finish(doc) {
    doc.roster.revision = (doc.roster.revision || 1) + 1;
    return validate(doc);
  }
  function assign(input, groupUid, studentUids) {
    const doc = validate(input);
    if (!doc.roster.groups.some((g) => g.groupUid === groupUid))
      throw Error("小组不存在");
    if (
      !Array.isArray(studentUids) ||
      new Set(studentUids).size !== studentUids.length
    )
      throw Error("学生选择重复或无效");
    const ids = new Set(doc.roster.students.map((s) => s.studentUid)),
      selection = new Set(studentUids);
    for (const id of studentUids) if (!ids.has(id)) throw Error("学生不存在");
    doc.roster.assignments = doc.roster.assignments.filter(
      (a) => a.groupUid !== groupUid && !selection.has(a.studentUid),
    );
    doc.roster.assignments.push(
      ...studentUids.map((studentUid) => ({ studentUid, groupUid })),
    );
    return finish(project(doc));
  }
  function editStudent(input, studentUid, changes) {
    const doc = validate(input),
      student = doc.roster.students.find((s) => s.studentUid === studentUid);
    if (!student) throw Error("学生不存在");
    const name = String(changes.displayName ?? student.displayName).trim();
    if (!name || name.length > 200) throw Error("姓名不能为空且不得超过200字");
    const number = String(changes.number ?? student.number ?? "").trim();
    if (number.length > 30) throw Error("学号过长");
    student.displayName = name;
    student.number = number || null;
    student.legacyLabel = [number, name].filter(Boolean).join(" ");
    return finish(project(doc));
  }
  function addStudent(input, { displayName, number = null }) {
    const doc = validate(input),
      name = String(displayName ?? "").trim(),
      studentNumber = String(number ?? "").trim();
    if (!name || name.length > 200 || studentNumber.length > 30)
      throw Error("学生姓名或学号无效");
    const studentUid = root.StableIdentity.createStudentUid();
    doc.roster.students.push({
      studentUid,
      displayName: name,
      number: studentNumber || null,
      legacyLabel: [studentNumber, name].filter(Boolean).join(" "),
      avatarResourceId: null,
    });
    return finish(doc);
  }
  function setAvatar(input, type, identity, resourceId) {
    const doc = validate(input);
    if (resourceId !== null && !doc.assetReferences.includes(resourceId))
      throw Error("头像资源 asset 尚未加入当前存档");
    const rows =
      type === "student"
        ? doc.roster.students
        : type === "group"
          ? doc.roster.groups
          : null;
    if (!rows) throw Error("头像目标类型无效");
    const row = rows.find(
      (r) => (type === "student" ? r.studentUid : r.groupUid) === identity,
    );
    if (!row) throw Error("头像目标不存在");
    row.avatarResourceId = resourceId;
    return finish(doc);
  }
  root.SaveRoster = Object.freeze({
    assign,
    editStudent,
    addStudent,
    setAvatar,
    label,
  });
})(globalThis);
