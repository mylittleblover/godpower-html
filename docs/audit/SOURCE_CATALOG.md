# 自动源码目录

由 `npm run audit` 生成。此目录包含旧实现和覆盖层，不能把定义存在视为功能通过。测试覆盖见 TEST_MATRIX.md。

共 997 个命名定义、835 个函数名；35 个字面量存储键、108 个动画名、1654 个 !important。

| 功能／实现 | 位置 | 输入 | 源码返回表达式（截断） | 依赖调用 | 涉及状态字段 | 风险 | 测试结果 |
|---|---|---|---|---|---|---|---|
| assertSafeJson | src/ui/contribution-registry.js:89 | value, path = "descriptor", depth = 0 | void; void | fail, assertSafeJson |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createContributionRegistry | src/ui/contribution-registry.js:121 | 无参数 | activation; {         id: ${activationRecord.pluginId}/${input.localId},         pluginId: activationRecord.pl; Object.freeze({         activationId: activationRecord.activationId,         registeredIds: staged.m; false; true; [...contributions.values()]         .filter((item) => item.pluginId === pluginId)         .map(clone; [...pages.values()].map(clone); page ? clone(page) : null; Object.freeze({ status: "missing", route }); Object.freeze({ status: "navigated", route, sourceInstanceId }); Object.freeze({         status: "workspace-required",         route,         page: clone(page),     ; Object.freeze({       activate,       register,       dispose,       listByPlugin,       listPages, ; revision | fail, assertSafeJson, clone, equal, validateContribution |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| activate | src/ui/contribution-registry.js:148 | pluginId, options = {} | activation | fail, assertSafeJson, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateContribution | src/ui/contribution-registry.js:182 | input, activationRecord | {         id: ${activationRecord.pluginId}/${input.localId},         pluginId: activationRecord.pl | fail, equal, assertSafeJson, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| register | src/ui/contribution-registry.js:326 | batch, activation | Object.freeze({         activationId: activationRecord.activationId,         registeredIds: staged.m | fail, validateContribution |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dispose | src/ui/contribution-registry.js:360 | activationId | false; true |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| listByPlugin | src/ui/contribution-registry.js:374 | pluginId | [...contributions.values()]         .filter((item) => item.pluginId === pluginId)         .map(clone |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| listPages | src/ui/contribution-registry.js:379 | 无参数 | [...pages.values()].map(clone) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resolvePage | src/ui/contribution-registry.js:382 | route | page ? clone(page) : null | clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| navigate | src/ui/contribution-registry.js:386 | route, sourceInstanceId = null | Object.freeze({ status: "missing", route }); Object.freeze({ status: "navigated", route, sourceInstanceId }); Object.freeze({         status: "workspace-required",         route,         page: clone(page),      | clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createDisposableScope | src/ui/disposable-scope.js:5 | route = "" | void; () => {}; () => {         removeCleanup(entry);         entry();       }; () => {}; release; null; id; null; id; observer; observer; animation; animation; childScope; []; errors; Object.freeze({       route,       add,       listen,       timeout,       frame,       observe,    ; disposed; abortController.signal; cleanups.length | cleanup, entry, removeCleanup, release, add, setTimeout, callback, clearTimeout, requestAnimationFrame, cancelAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| removeCleanup | src/ui/disposable-scope.js:10 | entry | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| add | src/ui/disposable-scope.js:15 | cleanup | void; () => {}; () => {         removeCleanup(entry);         entry();       } | cleanup, entry, removeCleanup |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| listen | src/ui/disposable-scope.js:35 | target, type, listener, options | () => {}; release | release, add |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| timeout | src/ui/disposable-scope.js:60 | callback, delay = 0 | null; id | setTimeout, release, callback, add, clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/ui/disposable-scope.js:73 | callback | null; id | requestAnimationFrame, release, callback, add, cancelAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| observe | src/ui/disposable-scope.js:86 | observer, target, options | observer; observer | add |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| animation | src/ui/disposable-scope.js:99 | animation | animation; animation | add |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| child | src/ui/disposable-scope.js:111 | childScope | childScope | add |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dispose | src/ui/disposable-scope.js:118 | 无参数 | []; errors | cleanup |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createPageLifecycle | src/ui/disposable-scope.js:159 | onDisposeError = (route, errors) => {       for (const error of errors)         console.error(UI scope cleanup failed (${route}), error);     } | Object.freeze({ route, scope: active, changed: false }); Object.freeze({ route, scope: active, changed: true }); []; errors; Object.freeze({       enter,       dispose,       current: () => active,     }) | onDisposeError, createDisposableScope |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| enter | src/ui/disposable-scope.js:167 | route | Object.freeze({ route, scope: active, changed: false }); Object.freeze({ route, scope: active, changed: true }) | onDisposeError, createDisposableScope |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dispose | src/ui/disposable-scope.js:184 | 无参数 | []; errors | onDisposeError |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| icon | src/ui/themes.js:36 | name, fallback | <svg class="ui-icon" data-theme-icon="${name}" viewBox="0 0 24 24" aria-hidden="true"><path d="${pa |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| name | src/ui/themes.js:41 | 无参数 | names[theme] |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| boot | src/ui/themes.js:44 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| apply | src/ui/themes.js:49 | 无参数 | DOM／状态副作用；需按调用场景确认 | boot, name, encodeURIComponent, String, updateWelcomeClock |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancel | src/ui/themes.js:105 | 无参数 | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| set | src/ui/themes.js:113 | next, { animate = true } = {} | Promise.resolve({ ok: false }); Promise.resolve({ ok: true, persisted }); result | cancel, matchMedia, apply, name, resolve |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mount | src/ui/themes.js:190 | panel | void | set, apply |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dayIndex | src/ui/model.js:60 | d = new Date() | Math.floor(       Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000,     ) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| daily | src/ui/model.js:65 | list, date = new Date(), offset = 0 | list.length       ? list[           (((dayIndex(date) + offset) % list.length) + list.length) %      | dayIndex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| differences | src/ui/model.js:73 | before, after | [...new Set([...a.keys(), ...b.keys()])].map((id) => {       const x = a.get(id),         y = b.get(; {         id,         name: y?.name ／／ x?.name,         before: x?.score ?? null,         after: y?. | Number, rank | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateBank | src/ui/model.js:112 | value | value | Error |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| standings | src/ui/model.js:163 | ordered | {       count: ordered.length,       total,       highest: scores[0] ?? 0,       leader: ordered[0]? | Number, BigInt, String | score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| badgeColors | src/ui/model.js:176 | color | { background: "#607773", foreground: "#FFFFFF" }; {       background: "#" + raw,       foreground: luminance > 0.45 ? "#000000" : "#FFFFFF",     } | String, parseInt |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isValidGroupUid | src/domain/identity.js:9 | value | typeof value === "string" && GROUP_UID_PATTERN.test(value) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createUuid | src/domain/identity.js:13 | prefix | ${prefix}-${globalThis.crypto.randomUUID()}; ${prefix}-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.sl; ${prefix}-${fallbackEpoch}-${Date.now().toString(36)}-${(++fallbackSequence).toString(36)}-${clock} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| assignGroupUids | src/domain/identity.js:44 | groups, idFactory = createGroupUid | groups.map((group) => {       const copy =         group && typeof group === "object" && !Array.isAr; copy | isValidGroupUid, idFactory |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| assignEntityUids | src/domain/identity.js:98 | field, prefix, idFactory | (items, makeId = idFactory) => {       if (!Array.isArray(items)) throw new TypeError("items must be; items.map((item) => {         const copy =           item && typeof item === "object" && !Array.isAr; copy | isValidGroupUid, makeId |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateJson | src/domain/home-layout.js:14 | value, depth = 0, count = { value: 0 } | void; void; void | fail, validateJson |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validSize | src/domain/home-layout.js:40 | size | !!(       size &&       Number.isInteger(size.minW) &&       size.minW >= 1 &&       size.minW <= GR |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeCatalog | src/domain/home-layout.js:62 | catalog | map | fail, validSize, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| intersects | src/domain/home-layout.js:90 | a, b | a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateLayout | src/domain/home-layout.js:96 | input | clone(instance); {       schemaVersion: 1,       layoutId: input.layoutId,       name: input.name.trim(),       revis | fail, validateJson, clone, intersects |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| emptyLayout | src/domain/home-layout.js:171 | layoutId = "layout-default", name = "默认布局" | validateLayout({       schemaVersion: 1,       layoutId,       name,       revision: 1,       gridPr | validateLayout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createDefaultLayout | src/domain/home-layout.js:182 | layoutId, name, cards, makeInstanceId | validateLayout({       schemaVersion: 1,       layoutId,       name,       revision: 1,       gridPr | fail, validSize, makeInstanceId, validateLayout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createLayoutService | src/domain/home-layout.js:222 | { catalog, initial, makeInstanceId } | type; value; candidate; clone(targetCopy); Object.freeze({       getSaved: () => clone(saved),       getDraft: () => clone(draft),       add(ty; clone(instance); clone(instance); repack(id, position); repack(id, position); clone(instance); clone(draft); false; true; false; true; clone(saved) | normalizeCatalog, fail, validateLayout, emptyLayout, clone, intersects, requireInstance, apply, requireType, validateJson, makeInstanceId, freePosition, repack |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| apply | src/domain/home-layout.js:242 | next | DOM／状态副作用；需按调用场景确认 | validateLayout, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| freePosition | src/domain/home-layout.js:249 | w, h, ignoredId = "" | candidate | intersects, fail |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| repack | src/domain/home-layout.js:265 | changedId, changedPosition | clone(targetCopy) | requireInstance, clone, intersects, fail, apply |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createHomeLayoutRepository | src/infrastructure/home-layout-repository.js:6 | { storage, key = KEY } | {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; { ok: true, revision: 0, layout: null, source: "empty" }; { ok: false, code: "CORRUPT_REPOSITORY" }; {           ok: true,           revision: envelope.revision,           layout: root.HomeLayout.valid; {           ok: false,           code: "CORRUPT_REPOSITORY",           message: error.message,      ; current; {           ok: false,           code: "REVISION_CONFLICT",           revision: current.revision,   ; { ok: false, code: "INVALID_LAYOUT", message: error.message }; {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; { ok: true, revision, layout: clone(valid) }; {             ok: false,             code: "ROLLBACK_FAILED",             message: ${error.message}; {           ok: false,           code: "STORAGE_WRITE_FAILED",           message: error.message,    ; Object.freeze({       key,       read,       write,       previewLegacyMigration(defaultLayout) {   ; current; {             ok: false,             code: "INVALID_MIGRATION_PREVIEW",             message: error.m; {           ok: true,           source: current.revision ? "saved" : "legacy-fixed-home",            | read, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| read | src/infrastructure/home-layout-repository.js:15 | 无参数 | {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; { ok: true, revision: 0, layout: null, source: "empty" }; { ok: false, code: "CORRUPT_REPOSITORY" }; {           ok: true,           revision: envelope.revision,           layout: root.HomeLayout.valid; {           ok: false,           code: "CORRUPT_REPOSITORY",           message: error.message,       |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| write | src/infrastructure/home-layout-repository.js:51 | layout, { expectedRevision } = {} | current; {           ok: false,           code: "REVISION_CONFLICT",           revision: current.revision,   ; { ok: false, code: "INVALID_LAYOUT", message: error.message }; {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; { ok: true, revision, layout: clone(valid) }; {             ok: false,             code: "ROLLBACK_FAILED",             message: ${error.message}; {           ok: false,           code: "STORAGE_WRITE_FAILED",           message: error.message,     | read, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateRosterDocument | src/domain/classroom-roster.js:9 | input | clone(input) | fail, validId, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createRosterDocument | src/domain/classroom-roster.js:131 | input | validateRosterDocument({       schemaVersion: 1,       profiles: [],       classrooms: [],       stu | validateRosterDocument, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| previewLegacyRoster | src/domain/classroom-roster.js:142 | {     classroomId,     userProfileId,     classroomName = "课堂",     profileName = "教师",     mode = "group",     groups,     idFactory = root.StableIdentity.createStudentUid,   } | createRosterDocument({       profiles: [{ userProfileId, displayName: profileName, subjectId: null } | validId, fail, idFactory, createRosterDocument |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| projectLegacyMembers | src/domain/classroom-roster.js:209 | {     groups,     rosterData,     userProfileId,     classroomId,   } | groups.map((group) => ({       ...group,       members: [...(byGroup.get(group.groupUid) ／／ [])],    | validateRosterDocument, fail |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| planCompetitionMemberUpdate | src/domain/classroom-roster.js:240 | {     groups,     rosterData,     userProfileId,     classroomId,   } | {       groups: projected,       groupChanges,       changedGroups: groupChanges.filter((change) =>  | fail, validateRosterDocument, validId, projectLegacyMembers |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createClassroomRosterRepository | src/infrastructure/classroom-roster-repository.js:6 | { storage, key = KEY } | { ok: true, revision: 0, rosterData: null }; { ok: false, code: "CORRUPT_REPOSITORY" }; {           ok: true,           revision: envelope.revision,           rosterData: root.ClassroomRos; { ok: false, code: "CORRUPT_REPOSITORY" }; current; {           ok: false,           code: "REVISION_CONFLICT",           revision: current.revision,   ; { ok: false, code: "INVALID_DOCUMENT", message: error.message }; { ok: true, revision, rosterData: clone(valid) }; {             ok: false,             code: "ROLLBACK_FAILED",             message: ${error.message}; {           ok: false,           code: "STORAGE_WRITE_FAILED",           message: error.message,    ; Object.freeze({       key,       read,       write,       previewMigration: root.ClassroomRoster.pre | read, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| read | src/infrastructure/classroom-roster-repository.js:14 | 无参数 | { ok: true, revision: 0, rosterData: null }; { ok: false, code: "CORRUPT_REPOSITORY" }; {           ok: true,           revision: envelope.revision,           rosterData: root.ClassroomRos; { ok: false, code: "CORRUPT_REPOSITORY" } |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| write | src/infrastructure/classroom-roster-repository.js:37 | rosterData, { expectedRevision } = {} | current; {           ok: false,           code: "REVISION_CONFLICT",           revision: current.revision,   ; { ok: false, code: "INVALID_DOCUMENT", message: error.message }; { ok: true, revision, rosterData: clone(valid) }; {             ok: false,             code: "ROLLBACK_FAILED",             message: ${error.message}; {           ok: false,           code: "STORAGE_WRITE_FAILED",           message: error.message,     | read, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| sha256 | src/ui/classroom-roster-workspace.js:23 | bytes | [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]       .map((value) => value.toStri |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mount | src/ui/classroom-roster-workspace.js:35 | host, { storage = localStorage, getGroups } | avatarRepositoryPromise; void; void; void; false; true; assignment; void; void; void; void; void; void; void; root.ClassroomRoster.validateRosterDocument(documentData); {           rosterData: root.ClassroomRoster.validateRosterDocument(parsed),           createdResour; { rosterData, createdResources: [] }; { rosterData, createdResources }; void; result.createdResources.length; void; void; void; void; void; void; void; void; void; void; void; void; true; void; void; void; setStatus("请输入课堂名称。", true); setStatus("请输入教师档案名称。", true); void; void; void; Object.freeze({ refresh: render, repository }) | text, getAvatarRepository, setStatus, render, clearAvatarUrls, assignmentFor, getGroups, renderAvatar, Boolean, clone, serializeRows, writeDocument, renderRows, toBase64, setTimeout, fromBase64, sha256, importRosterBackup, rollbackImportedResources, openPwdModal, buildClassroomBackup, closeApplyPreview, stillCurrent, runClassroomCommand, commitRosterImport | isLocked, seasonId, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAvatarRepository | src/ui/classroom-roster-workspace.js:88 | 无参数 | avatarRepositoryPromise |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAvatarUrls | src/ui/classroom-roster-workspace.js:92 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAvatar | src/ui/classroom-roster-workspace.js:96 | student, image | void; void; void | getAvatarRepository, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setStatus | src/ui/classroom-roster-workspace.js:135 | message, error = false | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| writeDocument | src/ui/classroom-roster-workspace.js:139 | next, message = "名单已保存" | false; true | setStatus, render |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| assignmentFor | src/ui/classroom-roster-workspace.js:151 | profileId, classroomId | assignment |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderRows | src/ui/classroom-roster-workspace.js:167 | 无参数 | void; void; void; void; void; void | clearAvatarUrls, assignmentFor, getGroups, renderAvatar, text, Boolean, setStatus, clone, serializeRows, getAvatarRepository, render, writeDocument, renderRows |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| render | src/ui/classroom-roster-workspace.js:397 | 无参数 | void | setStatus, Boolean, getGroups, renderRows |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| serializeRows | src/ui/classroom-roster-workspace.js:448 | 无参数 | root.ClassroomRoster.validateRosterDocument(documentData) | assignmentFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| download | src/ui/classroom-roster-workspace.js:484 | 无参数 | DOM／状态副作用；需按调用场景确认 | clone, serializeRows, getAvatarRepository, toBase64, setTimeout, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| importRosterBackup | src/ui/classroom-roster-workspace.js:554 | parsed | {           rosterData: root.ClassroomRoster.validateRosterDocument(parsed),           createdResour; { rosterData, createdResources: [] }; { rosterData, createdResources } | fromBase64, sha256, getAvatarRepository |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| rollbackImportedResources | src/ui/classroom-roster-workspace.js:711 | resources | void | getAvatarRepository |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| commitRosterImport | src/ui/classroom-roster-workspace.js:725 | parsed | result.createdResources.length | importRosterBackup, render, rollbackImportedResources |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeApplyPreview | src/ui/classroom-roster-workspace.js:757 | 无参数 | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openApplyPreview | src/ui/classroom-roster-workspace.js:765 | 无参数 | void; void; void; void; void; void; void; void; void; void; void; true; void; void | openPwdModal, setStatus, clone, serializeRows, getGroups, buildClassroomBackup, closeApplyPreview, stillCurrent, runClassroomCommand | isLocked, seasonId, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| currentContext | src/ui/classroom-avatar-display.js:12 | 无参数 | null; value; null |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearUrls | src/ui/classroom-avatar-display.js:30 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| canvasImage | src/ui/classroom-avatar-display.js:38 | source, width, height | ""; canvas.toDataURL("image/webp", 0.82) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| compactImage | src/ui/classroom-avatar-display.js:59 | url | compactImages.get(url); canvasImage(image, 256, 256); ""; pending | canvasImage |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| readIndex | src/ui/classroom-avatar-display.js:84 | 无参数 | void; void; void; void; void; void; void | currentContext, clearUrls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| studentUrl | src/ui/classroom-avatar-display.js:164 | group, name, occurrence = 0 | entry.resourceId ? urls.get(entry.resourceId) ／／ "" : ""; "" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| groupUrls | src/ui/classroom-avatar-display.js:175 | group | result |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| groupDataUrl | src/ui/classroom-avatar-display.js:189 | group | cached; ""; image; ""; canvas.toDataURL("image/webp", 0.82); pending | groupUrls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| studentDataUrl | src/ui/classroom-avatar-display.js:246 | group, name, occurrence = 0 | typeof value === "string" ? value : "" | studentUrl |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| groupDataUrlCached | src/ui/classroom-avatar-display.js:252 | group | typeof value === "string" ? value : "" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| decorateGroupCards | src/ui/classroom-avatar-display.js:257 | groups | void | readIndex, String, groupUrls, groupNoTextV213 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderRaffleReel | src/ui/classroom-avatar-display.js:291 | element, group, studentName = "", occurrence = 0 | void | studentUrl, groupUrls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateDocument | src/domain/teaching-schedule.js:8 | input | clone({ ...entry, note: entry.note ?? "" }); { schemaVersion: 1, entries } | fail, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createDocument | src/domain/teaching-schedule.js:82 | entries = [] | validateDocument({ schemaVersion: 1, entries }) | validateDocument |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| findCurrentLesson | src/domain/teaching-schedule.js:86 | scheduleDocument, userProfileId, weekday, minuteOfDay | valid.entries.find(         (entry) =>           entry.userProfileId === userProfileId &&            | validateDocument, fail |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createTeachingScheduleRepository | src/infrastructure/teaching-schedule-repository.js:6 | { storage, key = KEY } | {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; {           ok: true,           revision: 0,           schedule: root.TeachingSchedule.createDocumen; { ok: false, code: "CORRUPT_REPOSITORY" }; {           ok: true,           revision: envelope.revision,           schedule: root.TeachingSchedu; {           ok: false,           code: "CORRUPT_REPOSITORY",           message: error.message,      ; current; {           ok: false,           code: "REVISION_CONFLICT",           revision: current.revision,   ; { ok: false, code: "INVALID_DOCUMENT", message: error.message }; {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; { ok: true, revision, schedule: clone(valid) }; {             ok: false,             code: "ROLLBACK_FAILED",             message: ${error.message}; {           ok: false,           code: "STORAGE_WRITE_FAILED",           message: error.message,    ; Object.freeze({ key, read, write }) | read, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| read | src/infrastructure/teaching-schedule-repository.js:14 | 无参数 | {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; {           ok: true,           revision: 0,           schedule: root.TeachingSchedule.createDocumen; { ok: false, code: "CORRUPT_REPOSITORY" }; {           ok: true,           revision: envelope.revision,           schedule: root.TeachingSchedu; {           ok: false,           code: "CORRUPT_REPOSITORY",           message: error.message,       |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| write | src/infrastructure/teaching-schedule-repository.js:52 | schedule, { expectedRevision } = {} | current; {           ok: false,           code: "REVISION_CONFLICT",           revision: current.revision,   ; { ok: false, code: "INVALID_DOCUMENT", message: error.message }; {           ok: false,           code: "STORAGE_READ_FAILED",           message: error.message,     ; { ok: true, revision, schedule: clone(valid) }; {             ok: false,             code: "ROLLBACK_FAILED",             message: ${error.message}; {           ok: false,           code: "STORAGE_WRITE_FAILED",           message: error.message,     | read, clone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| formatFor | src/domain/teaching-resource.js:18 | fileName | null; FORMATS[fileName.slice(index).toLowerCase()] ／／ null |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateMetadata | src/domain/teaching-resource.js:24 | input | tag.trim(); {       resourceId: input.resourceId,       profileId: input.profileId,       classroomId: input.cla | fail, formatFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateFile | src/domain/teaching-resource.js:103 | input, rawBytes | validateMetadata({ ...input, byteSize: bytes.byteLength }) | fail, formatFor, starts, validateMetadata |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| requestValue | src/infrastructure/teaching-resource-repository.js:8 | request | new Promise((resolve, reject) => {       request.onsuccess = () => resolve(request.result);       re | resolve, reject, fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| transactionDone | src/infrastructure/teaching-resource-repository.js:18 | transaction | new Promise((resolve, reject) => {       transaction.oncomplete = () => resolve();       transaction | resolve, reject, fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hex | src/infrastructure/teaching-resource-repository.js:34 | bytes | [...new Uint8Array(bytes)]       .map((value) => value.toString(16).padStart(2, "0"))       .join("" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| open | src/infrastructure/teaching-resource-repository.js:40 | {     indexedDB = root.indexedDB,     crypto = root.crypto,     storageManager = root.navigator?.storage,     now = () => new Date(),   } = {} | hex(await crypto.subtle.digest("SHA-256", bytes)); {         ...metadata,         blob: new Blob([bytes], { type: metadata.mimeType }),       }; readBack; metadata && storedBlob         ? { ...metadata, blob: storedBlob.blob }         : null; all         .filter(           (item) =>             (!filter.profileId ／／ item.profileId === filter; Promise.all(metadata.map((item) => get(item.resourceId))); Object.freeze({       addBatch,       get,       list,       remove,       exportAll,       close: ( | fault, resolve, reject, hex, hash, now, transactionDone, requestValue, get, String, list |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hash | src/infrastructure/teaching-resource-repository.js:79 | bytes | hex(await crypto.subtle.digest("SHA-256", bytes)) | hex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| prepare | src/infrastructure/teaching-resource-repository.js:83 | input | {         ...metadata,         blob: new Blob([bytes], { type: metadata.mimeType }),       } | fault, hash, now |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| addBatch | src/infrastructure/teaching-resource-repository.js:130 | files | readBack | fault, transactionDone, requestValue, get, hash |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| get | src/infrastructure/teaching-resource-repository.js:233 | resourceId | metadata && storedBlob         ? { ...metadata, blob: storedBlob.blob }         : null | transactionDone, requestValue |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| list | src/infrastructure/teaching-resource-repository.js:246 | filter = {} | all         .filter(           (item) =>             (!filter.profileId ／／ item.profileId === filter | transactionDone, requestValue, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| remove | src/infrastructure/teaching-resource-repository.js:271 | resourceId | DOM／状态副作用；需按调用场景确认 | transactionDone |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportAll | src/infrastructure/teaching-resource-repository.js:279 | filter = {} | Promise.all(metadata.map((item) => get(item.resourceId))) | list, get |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mount | src/ui/teaching-workspace.js:28 | host, { storage = localStorage, getNow = () => new Date() } = {} | schedule.entries.filter(         (entry) => entry.userProfileId === profileId,       ); void; void; void; void; setStatus(           课程表保存失败：${result.message ／／ result.code},           true,         ); Object.freeze({ refresh, scheduleRepository }) | id, getNow, toTime, setStatus, currentEntries, text, refreshCurrent, String, cancelEdit, renderList, fillProfilesAndClasses, Number, toMinute, refresh |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setStatus | src/ui/teaching-workspace.js:53 | message, error = false | DOM／状态副作用；需按调用场景确认 | id |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| currentEntries | src/ui/teaching-workspace.js:58 | 无参数 | schedule.entries.filter(         (entry) => entry.userProfileId === profileId,       ) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelEdit | src/ui/teaching-workspace.js:63 | 无参数 | DOM／状态副作用；需按调用场景确认 | id |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshCurrent | src/ui/teaching-workspace.js:67 | 无参数 | void | getNow, id, toTime, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderList | src/ui/teaching-workspace.js:107 | 无参数 | void | id, currentEntries, text, refreshCurrent, toTime, String, cancelEdit, renderList, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fillProfilesAndClasses | src/ui/teaching-workspace.js:176 | 无参数 | DOM／状态副作用；需按调用场景确认 | id |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refresh | src/ui/teaching-workspace.js:200 | 无参数 | void | setStatus, fillProfilesAndClasses, renderList |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| safeFileName | src/ui/teaching-resource-workspace.js:15 | value | value.replace(/[\\/\0]/g, "_").slice(0, 255) ／／ "resource" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toBase64 | src/ui/teaching-resource-workspace.js:19 | bytes | btoa(binary) | btoa |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fromBase64 | src/ui/teaching-resource-workspace.js:29 | value | Uint8Array.from(binary, (character) => character.charCodeAt(0)) | atob |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mount | src/ui/teaching-resource-workspace.js:41 | host, { storage = localStorage } = {} | subjectMatches && queryMatches; void; void; void; void; void; setStatus("请先选择资源文件。", true); setStatus("单次最多导入 100 个文件，合计不超过 100 MiB。", true); setStatus("请填写资源学科。", true); setStatus("请先选择资源备份文件。", true); setStatus("备份文件超过 150 MiB 上限。", true); {             file: restoredFile,             resourceId: entry.resourceId,             profileId: e; Object.freeze({ refresh, repository: () => repository }) | byId, safeFileName, setTimeout, releasePreview, make, closePreview, download, matchingResource, preview, setStatus, ensureResourceUnreferenced, refresh, fillScope, renderList, toBase64, Number, fromBase64, importFiles, restorePack, exportPack |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setStatus | src/ui/teaching-resource-workspace.js:59 | message, error = false | DOM／状态副作用；需按调用场景确认 | byId |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureResourceUnreferenced | src/ui/teaching-resource-workspace.js:65 | resourceId | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fillScope | src/ui/teaching-resource-workspace.js:77 | 无参数 | DOM／状态副作用；需按调用场景确认 | byId |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| matchingResource | src/ui/teaching-resource-workspace.js:121 | resource, search, subject | subjectMatches && queryMatches |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| download | src/ui/teaching-resource-workspace.js:135 | resource, fileName = resource.fileName | DOM／状态副作用；需按调用场景确认 | safeFileName, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| releasePreview | src/ui/teaching-resource-workspace.js:146 | dialog | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closePreview | src/ui/teaching-resource-workspace.js:152 | dialog | void | setTimeout, releasePreview |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| preview | src/ui/teaching-resource-workspace.js:162 | resource | DOM／状态副作用；需按调用场景确认 | make, closePreview, download, releasePreview |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderList | src/ui/teaching-resource-workspace.js:231 | 无参数 | void; void; void | byId, matchingResource, make, preview, setStatus, download, ensureResourceUnreferenced, refresh |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refresh | src/ui/teaching-resource-workspace.js:323 | 无参数 | void | setStatus, fillScope, byId, renderList, make |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| importFiles | src/ui/teaching-resource-workspace.js:350 | 无参数 | setStatus("请先选择资源文件。", true); setStatus("单次最多导入 100 个文件，合计不超过 100 MiB。", true); setStatus("请填写资源学科。", true) | byId, setStatus, refresh |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportPack | src/ui/teaching-resource-workspace.js:389 | 无参数 | DOM／状态副作用；需按调用场景确认 | byId, toBase64, download, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| restorePack | src/ui/teaching-resource-workspace.js:427 | 无参数 | setStatus("请先选择资源备份文件。", true); setStatus("备份文件超过 150 MiB 上限。", true); {             file: restoredFile,             resourceId: entry.resourceId,             profileId: e | byId, setStatus, Number, fromBase64, refresh |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ordered | src/domain/competition/ranking.js:3 | groups | groups       .map((group, index) => ({ group, index }))       .sort(         (a, b) =>           (Nu | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| set | src/domain/competition/score-adjustments.js:3 | group, after | {       groupId: group.id,       before,       after,       delta: after - before,       milestone:  |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| delta | src/domain/competition/score-adjustments.js:17 | group, points | set(group, group.score + points) | set |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| calculateRound | src/domain/competition/rules.js:3 | { groups, correctAns } | groups.map((group) => {       const scoreBefore = Number(group.score);       if (!Number.isSafeInteg; {         groupId: group.id,         answered,         correct,         allIn,         scoreBefore,  | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| derive | src/domain/competition/phase.js:3 | round | "NOT_STARTED"; "FINISHED"; "SETTLED"; round.correctAns ? "ANSWER_SELECTED" : "ANSWERING" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| writeVerified | src/infrastructure/legacy/classroom-repository.js:3 | storage, key, data | { ok: true }; { ok: false, error: String(error?.message ／／ error) } | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| appendArchive | src/infrastructure/legacy/classroom-repository.js:14 | storage, record | null; JSON.stringify({             groups: data.groups,             round: data.round,             itemGlo; { ok: true, idempotent: true }; {           ok: false,           error: "本赛季已有不同内容的正式归档，已保留原档案。",         }; writeVerified(storage, "politics_settlement_history", [         record,         ...archives,       ]; { ok: false, error: String(error?.message ／／ error) } | comparableSnapshot, writeVerified, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| parse | src/infrastructure/legacy/classroom-repository.js:54 | raw, label | JSON.parse(raw) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| loadOrMigrate | src/infrastructure/legacy/classroom-repository.js:62 | storage, options | { status: "current", data: current, sourceKey: currentKey }; {           status: "migrated-in-place",           data: current,           sourceKey: currentKey,  ; { status: "missing", data: null, sourceKey: null }; {         status: "migrated",         data: migrated,         sourceKey: sourceLabel,         receip; {         status: "failed",         data: candidate,         sourceKey: legacyKey ／／ null,         s | parse, migrate, validate, fallbackData, now, writeVerified, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fault | src/infrastructure/indexeddb/repository.js:20 | code, message | error |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| identifier | src/infrastructure/indexeddb/repository.js:25 | value, label | value | fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fingerprint | src/infrastructure/indexeddb/repository.js:33 | value | [...new Uint8Array(digest)]       .map((byte) => byte.toString(16).padStart(2, "0"))       .join("") | fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| transaction | src/infrastructure/indexeddb/repository.js:45 | db, names, operation | new Promise((resolve, reject) => {       const tx = db.transaction(names, "readwrite");       let re | fault, String, reject, fn, abort, resolve, operation |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| readOne | src/infrastructure/indexeddb/repository.js:97 | db, store, key | new Promise((resolve, reject) => {       const tx = db.transaction(store, "readonly");       const r | resolve, reject, fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| open | src/infrastructure/indexeddb/repository.js:115 | {     name = "godpower-domain-v1",     indexedDB = globalThis.indexedDB,     validateSnapshot = () => {},   } = {} | transaction(         db,         ["aggregates", "commands", "events", "archives"],         (tx, done; abort(                   fault(                     "COMMAND_REUSED",                     "Command I; done({ ...existing.result.result, duplicate: true }); abort(                   fault(                     "REVISION_CONFLICT",                     Expect; abort(                   fault(                     "REVISION_CONFLICT",                     "Revisi; transaction(         db,         ["aggregates", "archives", "resources", "migrations"],         (tx,; abort(                   fault(                     "MIGRATION_REUSED",                     "Migrati; done({ ...receipt.result, duplicate: true }); abort(                   fault(                     "MIGRATION_CONFLICT",                     "Desti; transaction(         db,         ["migrations", "aggregates"],         (tx, done, abort, guard) => {; abort(                 fault(                   "MIGRATION_REUSED",                   "Verification ; abort(                   fault(                     "REVISION_CONFLICT",                     "Stagin; abort(                   fault(                     "INVALID_REQUEST",                     "Verified; new Promise((resolve, reject) => {         const tx = db.transaction("events", "readonly");         ; null; { ...record.result, duplicate: true }; {       commit,       findCommand,       importSnapshot,       recordMigrationStatus,       listEven | identifier, fault, resolve, reject, structuredClone, validateSnapshot, fingerprint, transaction, guard, abort, done, String, readOne |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commit | src/infrastructure/indexeddb/repository.js:152 | request | transaction(         db,         ["aggregates", "commands", "events", "archives"],         (tx, done; abort(                   fault(                     "COMMAND_REUSED",                     "Command I; done({ ...existing.result.result, duplicate: true }); abort(                   fault(                     "REVISION_CONFLICT",                     Expect; abort(                   fault(                     "REVISION_CONFLICT",                     "Revisi | structuredClone, identifier, fault, validateSnapshot, fingerprint, transaction, guard, abort, done |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| importSnapshot | src/infrastructure/indexeddb/repository.js:256 | request | transaction(         db,         ["aggregates", "archives", "resources", "migrations"],         (tx,; abort(                   fault(                     "MIGRATION_REUSED",                     "Migrati; done({ ...receipt.result, duplicate: true }); abort(                   fault(                     "MIGRATION_CONFLICT",                     "Desti | structuredClone, fault, String, identifier, validateSnapshot, fingerprint, transaction, guard, abort, done |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| recordMigrationStatus | src/infrastructure/indexeddb/repository.js:335 | plan, report | transaction(         db,         ["migrations", "aggregates"],         (tx, done, abort, guard) => {; abort(                 fault(                   "MIGRATION_REUSED",                   "Verification ; abort(                   fault(                     "REVISION_CONFLICT",                     "Stagin; abort(                   fault(                     "INVALID_REQUEST",                     "Verified | structuredClone, identifier, fault, fingerprint, transaction, guard, abort, done |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| listEvents | src/infrastructure/indexeddb/repository.js:410 | aggregateId | new Promise((resolve, reject) => {         const tx = db.transaction("events", "readonly");          | resolve, reject, fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| findCommand | src/infrastructure/indexeddb/repository.js:424 | commandId, intent | null; { ...record.result, duplicate: true } | identifier, fingerprint, structuredClone, readOne, fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| copy | src/infrastructure/legacy/schema-migrations.js:6 | value | JSON.parse(JSON.stringify(value)) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| parseKey | src/infrastructure/legacy/schema-migrations.js:10 | storage, key, fallback | raw == null ? fallback : JSON.parse(raw) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| optionalNumber | src/infrastructure/legacy/schema-migrations.js:15 | storage, key | raw == null ／／ raw === "" ? undefined : Number(raw) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| optionalBoolean | src/infrastructure/legacy/schema-migrations.js:20 | storage, key | raw == null ? undefined : raw === "true" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fromLegacyKeys | src/infrastructure/legacy/schema-migrations.js:25 | storage, { now = () => new Date() } = {} | null; {       schemaVersion: LEGACY_SCHEMA_VERSION,       timestamp: now().toISOString(),       groups,    | parseKey, now, optionalNumber, optionalBoolean |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| migrateBackup | src/infrastructure/legacy/schema-migrations.js:55 | raw, { identity = StableIdentity, now = () => new Date() } = {} | output; ${uid}／${String(item.key ／／ "")}／${String(item.acquiredAt ?? "")}; void; value; snapshot; migrated; output | copy, String, signatureFor, normalizeInventory, now |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| signatureFor | src/infrastructure/legacy/schema-migrations.js:80 | uid, item | ${uid}／${String(item.key ／／ "")}／${String(item.acquiredAt ?? "")} | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeInventory | src/infrastructure/legacy/schema-migrations.js:83 | group, uid, historic = false | void; value | signatureFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| digest | src/infrastructure/legacy/inventory.js:9 | bytes | [...new Uint8Array(hash)]       .map((byte) => byte.toString(16).padStart(2, "0"))       .join("") |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| canonical | src/infrastructure/legacy/inventory.js:18 | value, seen = new Set() | ["undefined"]; value; ["ArrayBuffer", value.byteLength, await digest(value)]; [         "view",         value.constructor.name,         await canonical(           value.buffer.sl; [         "Blob",         value.type,         value.size,         await digest(await value.arrayBuff; ["Date", value.toISOString()]; result | digest, canonical |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hashValue | src/infrastructure/legacy/inventory.js:77 | value | digest(utf8(JSON.stringify(await canonical(value)))) | digest, utf8, canonical |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| readLocal | src/infrastructure/legacy/inventory.js:80 | storage | keys.map((key) => ({ key, raw: storage.getItem(key) })) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| readDatabase | src/infrastructure/legacy/inventory.js:90 | indexedDB, name | []; await new Promise((resolve, reject) => {         const tx = db.transaction(stores, "readonly");      | resolve, reject |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| capture | src/infrastructure/legacy/inventory.js:131 | {     storage = globalThis.localStorage,     indexedDB = globalThis.indexedDB,     sourceOrigin = globalThis.location?.origin ／／ "unknown",   } = {} | {       ready: !changedDuringRead,       sourceOrigin,       sourceManifest,       localEntries,     | readLocal, digest, utf8, hashValue, readDatabase, canonical |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| prepare | src/infrastructure/legacy/inventory.js:204 | captured, { aggregateId } = {} | {       migrationId: "legacy-" + sourceHash,       sourceOrigin: captured.sourceOrigin,       source | hashValue, newIdentity |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| verify | src/infrastructure/legacy/inventory.js:279 | plan, options = {} | {       ok,       conflicts: ok ? [] : ["来源数据已改变，旧预检结果不可提交，请重新预检"],     } | capture |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| verifyDestination | src/infrastructure/legacy/inventory.js:293 | repository, plan | {       ok: failures.length === 0,       failures,       verifiedArchives: plan.archives.length,     | hashValue |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| alias | src/infrastructure/legacy/audio-migration.js:3 | id | fixed[id] ／／       (id.startsWith("bgm_trans_") ? bgm_set_0_trans_${id.slice(10)} : id) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openExisting | src/infrastructure/legacy/audio-migration.js:15 | indexedDB, name | new Promise((resolve, reject) => {       let missing = false;       const request = indexedDB.open(n | resolve, reject |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| readSource | src/infrastructure/legacy/audio-migration.js:29 | indexedDB, name | []; []; await new Promise((resolve, reject) => {         const tx = source.transaction("sounds", "readonly") | openExisting, resolve, reject |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| run | src/infrastructure/legacy/audio-migration.js:45 | {     indexedDB = globalThis.indexedDB,     destination,     storage,     sourceNames = ["PoliticsScoreSoundDB_v3", "PoliticsScoreSoundDB"],     markerKey = "politics_audio_migration_v2",   } | { status: "current", copied: 0, skipped: 0 }; void; void; { status: "migrated", ...counts } | readSource, alias, resolve, reject |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cloneJson | src/domain/values.js:3 | value, seen = new Set(), depth = 0 | value; value; output | cloneJson |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deepFreeze | src/domain/values.js:47 | value | value; Object.freeze(value) | deepFreeze |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| requiredText | src/domain/events.js:19 | value, label, max = 160 | value.trim() |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeTime | src/domain/events.js:27 | value | date.toISOString() |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createScope | src/domain/events.js:34 | {     commandId,     actorId = null,     source = "classroom",     now = () => new Date(),   } = {} | event; {       emit,       list: () => records.slice(),       close: () => {         closed = true;       } | requiredText, String, cloneJson, encodeURIComponent, deepFreeze, normalizeTime, now |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| emit | src/domain/events.js:50 | type, aggregate, payload = {}, options = {} | event | requiredText, String, cloneJson, encodeURIComponent, deepFreeze, normalizeTime, now |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isAchievementEligible | src/domain/events.js:107 | event | !!event &&       event.schemaVersion === SCHEMA_VERSION &&       event.source === "classroom" &&     |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| evaluate | src/domain/achievements/learning-rules.js:35 | progress, event | []; unlocked | condition |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| empty | src/domain/achievements/ledger.js:6 | 无参数 | { schemaVersion: SCHEMA_VERSION, groups: {} } |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalize | src/domain/achievements/ledger.js:10 | value | empty(); ledger | empty, clone, emptySeasonProgress |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| newGroupProgress | src/domain/achievements/ledger.js:80 | seasonId | {       seasonId: seasonId ／／ null,       permanentUnlocks: {},       historicalCounters: {},        | emptySeasonProgress |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| emptySeasonProgress | src/domain/achievements/ledger.js:94 | 无参数 | {       answered: 0,       correct: 0,       correctStreak: 0,       answeredStreak: 0,       recove |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| apply | src/domain/achievements/ledger.js:105 | value, events, { seasonId = null } = {} | { ledger, applied, duplicates, unlocked } | normalize, newGroupProgress, emptySeasonProgress |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| create | src/core/item-module-model.js:27 | definitions, storage = null, notify = () => {} | result; copy(config); next; {       defaults,       validate,       update,       configuration: () => copy(config),       loadE; {           key,           charges,           acquiredAt,           itemInstanceId: root.StableIdent; false; operation() | Error, defaults, validate, String, notify, copy, forKey, Number, operation |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validate | src/core/item-module-model.js:45 | raw | result | Error, defaults |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| update | src/core/item-module-model.js:124 | raw | copy(config) | validate, notify, copy |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scoreDelta | src/core/item-module-model.js:131 | key, delta | next | forKey, Error |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| validateBackup | src/core/reliability.js:6 | data, depth = 0 | data | Error, Number, validateBackup | groupUid, score, members, inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| phase | src/core/reliability.js:217 | s | CompetitionPhase.derive(s) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validateItem | src/core/reliability.js:220 | s, g, index, enabled | "共产主义模式已关闭"; "没有可用道具"; "次要道具需要等待主要道具"; "负分保护：该组不能使用道具"; "本题已经使用过道具"; "主要道具持续状态尚未结束"; null | Number | inventory, score, roundItemContinuationKeyV218, itemUsedThisRound, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| onDefenseInvalidation | src/core/reliability.js:245 | handler | () => defenseInvalidationHandlers.delete(handler) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| invalidateDefenseDecisions | src/core/reliability.js:251 | 无参数 | defenseDecisionEpoch | handler |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| captureDefenseDecision | src/core/reliability.js:258 | s, target, key | null; {       epoch: defenseDecisionEpoch,       state: s,       groups: s.groups,       target,       tar | phase |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isDefenseDecisionCurrent | src/core/reliability.js:285 | s, d | false; Object.is(s.round, d.round) &&       s.roundActive === d.roundActive &&       s.evaluated === d.eval | phase | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| planBatchScoreChanges | src/core/reliability.js:309 | groups, groupCounts, points | groupCounts.map(([id, count]) => {       const g = groupMap.get(id);       if (!g ／／ !Number.isSafeI; { id, old, delta, score } | Error, Number | id, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| safeImage | src/core/reliability.js:331 | value | typeof value === "string" &&       /^data:image\/(?:png／jpe?g／webp／gif);base64,[a-zA-Z0-9+/=\s]+$/.t |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| count | src/core/reliability.js:339 | value | Number.isSafeInteger(n) && n >= 0 ? n : 0 | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeStats | src/core/reliability.js:343 | raw | Object.fromEntries(       ["correct", "wrong", "draws", "used"].map((k) => [k, count(raw?.[k])]),    | count |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeEffect | src/core/reliability.js:348 | raw | null; Object.keys(out).length ? out : null | count |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| calculateRoundScores | src/core/reliability.js:365 | s | CompetitionRules.calculateRound(s).map(       (result) => result.scoreAfter,     ) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| csvText | src/core/reliability.js:370 | text | /^[\s]*[=+@-]/.test(text) ? "'" + text : text | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clear | src/application/history-commands.js:3 | 无参数 | false; false; false; false; false; false; true; false; false; true | openPwdModal, themeConfirm, showToast, runClassroomCommand, renderHistoryList | isLocked, seasonId | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| apply | src/application/history-commands.js:54 | snapshot | DOM／状态副作用；需按调用场景确认 | cancelScoreAnimationAndSync, clone, normalizeAllGroups, renderAll, ensureItemState, startBulletTimer, startBlooperClock | itemGlobal, achievementLedger, groups, displayScore, score, correctAns, evaluated, roundActive, hasStartedOnce, lastRoundAllIn, picker, resizerHeight | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commitRestore | src/application/history-commands.js:80 | snapshot, index, message | true; false; false; true | runClassroomCommand, apply, playSound, renderHistoryList, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| restore | src/application/history-commands.js:101 | snapshot | false; commitRestore(snapshot, null, null) | commitRestore |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| undo | src/application/history-commands.js:106 | 无参数 | false; false; true; false; commitRestore(snapshot, index, 已恢复到历史节点：${snapshot.desc}) | openPwdModal, showToast, commitRestore | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| revert | src/application/history-commands.js:125 | index | false; false; false; commitRestore(       snapshot,       index,       已回溯至：[${snapshot.time}] ${snapshot.desc},     ) | themeAlert, openPwdModal, commitRestore | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| recordHistory | src/core/history.js:23 | actionDesc | void | persistHistoryV26 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| persistHistoryV26 | src/core/history.js:36 | 无参数 | void; { ok } |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| restoreStateFromSnapshot | src/core/history.js:47 | snapshot | HistoryCommands.restore(snapshot) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| undoLast | src/core/history.js:50 | 无参数 | HistoryCommands.undo() |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| choose | src/domain/items/defense-policy.js:3 | g, attackType, { eligible, shellAttack } | "timed-ghost"; "none"; "ineligible"; "feather"; "bullet"; "persistent"; "ghost"; "bomb"; "inventory"; "pending-mushroom"; "none" | Number | booRoundsLeftV218, booShield, inventory, __spinyHornDeclinedV218, itemEffect, __spinyMushroomDeclinedV21727 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefend | src/application/item-defense-adapter.js:2 | g, attackType | true; true; true; true; true; true; true; true; false | eligibleForItems, tinyDefenseToast, Number, explodeDestroyedBombV2170, consumeInventoryItem | inventory, booRoundsLeftV218, itemEffect, name, booShield | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| requestSpinyDefense | src/application/item-defense-adapter.js:78 | target, key, continueAttack | void; void; {     changed: false,     blocked: horn ? "pending-horn-defense" : "pending-defense",   } | themeConfirm, deferClassroomDefense, clear, consumeInventoryItem, tinyDefenseToast, continueAttack |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commitItemScore | src/core/item-score.js:2 | target, delta, sourceId, attackType, isAttack = delta < 0 | result | eligibleForItems, tryDefend, Number, scheduleScoreEffect, playAttackTargetFxV2116 | groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScoreAfterHorn | src/core/item-score.js:34 | target, delta, sourceId, attackType, isAttack = delta < 0 | result | Number, eligibleForItems, destroyPrimaryBasicDefenseV2170, requestSpinyDefense, commitItemScore, queueItemScoreChangesV21732, String |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyItemScore | src/core/item-score.js:75 | target, delta, sourceId, attackType = "normal" | requestSpinyDefense(target, "horn", () =>       applyItemScoreAfterHorn(target, delta, sourceId, att; applyItemScoreAfterHorn(target, delta, sourceId, attackType, isAttack) | requestSpinyDefense, applyItemScoreAfterHorn |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| classify | src/core/action-sounds.js:35 | button | explicit; key ? "ui_button_" + key : "ui_click" | isClick |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showClassroomWindow | src/runtime/ui/window-visibility.js:2 | root | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hideClassroomWindow | src/runtime/ui/window-visibility.js:7 | root, finish | void | commit |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| readableTextOnColor | src/runtime/core/state-and-preferences.js:20 | hex | "#FFFFFF"; "#FFFFFF"; "#17302D"; "#000000" | String, parseInt |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeGroup | src/runtime/core/state-and-preferences.js:275 | raw, index = 0 | {     id,     groupUid: StableIdentity.isValidGroupUid(source.groupUid)       ? source.groupUid      | Number, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeAllGroups | src/runtime/core/state-and-preferences.js:330 | groups | StableIdentity.assignGroupUids(     Array.isArray(groups) ? groups : [],   ).map((raw, index) => {  ; g | normalizeGroup | id, displayScore, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| initSessionState | src/runtime/core/state-and-preferences.js:343 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeAllGroups | roundActive, hasStartedOnce, evaluated, correctAns, editingScoreId, activeModalGroupId, groups, picker, displayScore, score, selectedOpt, allIn, resultText, animState | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| checkAllInRatio | src/runtime/core/state-and-preferences.js:404 | 无参数 | false; count / total >= 1 / 3 |  | groups, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSettlementHistory | src/runtime/archives/settlement-actions.js:4 | 无参数 | STORAGE.getJSON("politics_settlement_history", []) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| saveSettlementRecord | src/runtime/archives/settlement-actions.js:8 | record | Reliability.appendArchive(CLASSROOM_STORAGE, record) | buildSettlementClearedDataV21813 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerFinalSettlement | src/runtime/archives/settlement-actions.js:15 | 无参数 | false; void | themeAlert, openPwdModal, String, showClassroomWindow, setTimeout | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeSettlementNameModal | src/runtime/archives/settlement-actions.js:43 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| confirmFinalSettlement | src/runtime/archives/settlement-actions.js:48 | 无参数 | conflict; { ok: false, reason: "locked" }; { ok: false, reason: "busy" }; { ok: false, reason: "empty" }; archiveResult; resetResult; { ok: true } | showToast, openPwdModal, closeSettlementNameModal, Number, clone, saveSettlementRecord, themeAlert, recordHistory, bgmStopAll, renderControls, playSound, setTimeout, escapeHtml, showClassroomWindow, initConfetti, resetCompetitionDataAfterSettlementV21812, saveState, renderAll | isLocked, groups, score, inventory, itemStats, hasStartedOnce, seasonId, achievementLedger, roundActive, evaluated | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| initConfetti | src/runtime/archives/settlement-actions.js:169 | 无参数 | void | requestAnimationFrame, cancelAnimationFrame, loop |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| loop | src/runtime/archives/settlement-actions.js:200 | 无参数 | DOM／状态副作用；需按调用场景确认 | requestAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopConfetti | src/runtime/archives/settlement-actions.js:221 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeGrandSettlementModal | src/runtime/archives/settlement-actions.js:228 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow, stopConfetti |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openSettlementHistoryModal | src/runtime/archives/settlement-actions.js:233 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeSettlementHistoryModal | src/runtime/archives/settlement-actions.js:237 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderArchiveClassStats | src/runtime/archives/settlement-actions.js:241 | 无参数 | void; total + Number(stats.correct ／／ 0) + Number(stats.wrong ／／ 0) | Number | itemGlobal, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderSettlementHistoryList | src/runtime/archives/settlement-actions.js:258 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportSingleSettlementCSV | src/runtime/archives/settlement-actions.js:262 | index | void | getSettlementHistory, showToast | members, name, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportLatestSettlementCSV | src/runtime/archives/settlement-actions.js:283 | 无参数 | void | getSettlementHistory, themeAlert, exportSingleSettlementCSV |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteSettlementRecord | src/runtime/archives/settlement-actions.js:292 | index | void; void | themeAlert, openPwdModal, themeConfirm, getSettlementHistory, renderSettlementHistoryList, showToast | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleIdleTask | src/runtime/audio/session-cache.js:7 | fn, timeout = 1500 | window.requestIdleCallback(fn, { timeout }); window.setTimeout(fn, Math.min(timeout, 800)) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSoundIdCache | src/runtime/audio/session-cache.js:14 | 无参数 | new Promise((resolve) => {     if (!db) {       resolve(soundIdCache);       return;     }     try {; void | resolve |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hasSound | src/runtime/audio/session-cache.js:35 | slotId | soundIdCache.has(slotId) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSecPerBeat | src/runtime/audio/session-cache.js:53 | 无参数 | 60 / Math.max(1, effectiveBpm) | Number | bpm | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSecPerBar | src/runtime/audio/session-cache.js:60 | 无参数 | getSecPerBeat() * Math.max(1, Number(state.beatsPerBar) ／／ 4) | getSecPerBeat, Number | beatsPerBar | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getTrackCurrentBeat | src/runtime/audio/session-cache.js:64 | 无参数 | 0; currentSecInTrack / secPerBeat | getSecPerBeat |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openHistoryModal | src/runtime/history/compatibility-ui.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeHistoryModal | src/runtime/history/compatibility-ui.js:5 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHistoryList | src/runtime/history/compatibility-ui.js:9 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleHistExpand | src/runtime/history/compatibility-ui.js:13 | index | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearHistoryStack | src/runtime/history/compatibility-ui.js:19 | 无参数 | HistoryCommands.clear() |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| revertToHistory | src/runtime/history/compatibility-ui.js:23 | index | HistoryCommands.revert(index) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| initDB | src/runtime/audio/resource-loading.js:1 | 无参数 | dbInitPromise; dbInitPromise | refreshSoundIdCache, resolve, scheduleBackgroundAudioInit |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleBackgroundAudioInit | src/runtime/audio/resource-loading.js:31 | 无参数 | void | scheduleIdleTask, migrateOldDatabases, showToast, refreshSoundIdCache, loadFxSounds |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| migrateOldDatabases | src/runtime/audio/resource-loading.js:54 | 无参数 | LegacyAudioMigration.run({     indexedDB,     destination: db,     storage: CLASSROOM_STORAGE,   }) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAudioContext | src/runtime/audio/resource-loading.js:62 | 无参数 | audioCtx | setTimeout, res | masterVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| loadFxSounds | src/runtime/audio/resource-loading.js:92 | 无参数 | void; fxSoundsLoading; fxSoundsLoading | resolve, getAudioContext |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectFxBuffer | src/runtime/audio/resource-loading.js:152 | slotId, random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 | null; candidates[0]; candidates[     Math.min(       candidates.length - 1,       Math.max(0, Math.floor(random() * candi | random |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderFxChoices | src/runtime/audio/resource-loading.js:169 | slotId | <div class="cf-audio-choices"><button class="btn btn-sm" onclick="triggerUploadAudio('fx_${slotId}' | escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteFxCandidate | src/runtime/audio/resource-loading.js:174 | id | void | reject, renderFxSlotList, renderItemFxSoundListV26, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| checkSetCompleteness | src/runtime/audio/resource-loading.js:197 | setIdx | Promise.resolve({ isComplete: false, count: 0, hasCore: false }); {       isComplete: count === trackTypes.length,       count,       hasCore: hasThinking && hasBattl; refreshSoundIdCache().then(doCheck); Promise.resolve(doCheck()) | hasSound, refreshSoundIdCache, doCheck |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAllCompleteSetIndices | src/runtime/audio/resource-loading.js:232 | 无参数 | completeIndices | checkSetCompleteness |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getFallbackSetIndex | src/runtime/audio/resource-loading.js:241 | 无参数 | i; -1 | checkSetCompleteness |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickNextPlayableSetIndex | src/runtime/audio/resource-loading.js:249 | 无参数 | { setIndex: bgmShufflePool.shift(), isFallback: false }; { setIndex: fallbackIdx, isFallback: true }; { setIndex: -1, isFallback: false } | getAllCompleteSetIndices, getFallbackSetIndex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fetchAndDecodeSetBuffers | src/runtime/audio/resource-loading.js:274 | setIdx, onProgress | {}; void; {}; buffers; {} | resolve, getAudioContext, onProgress |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmPreloadNextSet | src/runtime/audio/resource-loading.js:336 | 无参数 | void | pickNextPlayableSetIndex, fetchAndDecodeSetBuffers |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playChiptuneSynth | src/runtime/audio/sound-playback.js:1 | slotId | void | getFxOutputV2176 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playSound | src/runtime/audio/sound-playback.js:172 | slotId | DOM／状态副作用；需按调用场景确认 | getAudioContext, loadFxSounds, selectFxBuffer, getFxOutputV2176, playChiptuneSynth |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAllLoopTimeouts | src/runtime/audio/battle-playback.js:2 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleDualLoopChunk | src/runtime/audio/battle-playback.js:7 | startTime, offsetSec | void; void | getSecPerBeat, setTimeout, scheduleDualLoopChunk |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmStartNewRoundMusicWithProgress | src/runtime/audio/battle-playback.js:58 | onProgress | void | onProgress, getAudioContext, bgmStopAll, pickNextPlayableSetIndex, fetchAndDecodeSetBuffers, checkAllInRatio, scheduleDualLoopChunk, setTimeout, bgmPreloadNextSet | lastRoundAllIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmTransitionThinkingToBattle | src/runtime/audio/battle-playback.js:135 | 无参数 | void | getAudioContext, getSecPerBeat, getTrackCurrentBeat, Number, clearTimeout, setTimeout, checkAllInRatio, bgmTransitionBattleToThinking |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmTransitionBattleToThinking | src/runtime/audio/battle-playback.js:239 | 无参数 | void | getAudioContext, clearTimeout, getSecPerBeat, getTrackCurrentBeat, getSecPerBar |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmTriggerVictory | src/runtime/audio/battle-playback.js:286 | callback | void | callback, getAudioContext, getSecPerBeat, getTrackCurrentBeat, clearTimeout, clearAllLoopTimeouts, setTimeout, bgmStopAll |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bgmStopAll | src/runtime/audio/battle-playback.js:388 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearAllLoopTimeouts, clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showToast | src/runtime/ui/toast.js:2 | msg | void | clearTimeout, String, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getPersistableGroups | src/runtime/storage/classroom-save.js:1 | 无参数 | state.groups.map((g) => ({     ...g,     score: Number.isFinite(Number(g.score)) ? Math.trunc(Number | Number | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveState | src/runtime/storage/classroom-save.js:11 | transaction | { ok: false, error: "需要先恢复主存档" }; { ok: true, deferred: true }; result; {     ...result,     legacyMirrorFailures: failed,     ...(Array.isArray(transaction?.events) && tra | showClassroomSaveWarning, ensureV2State, buildClassroomBackup, showToast | achievementLedger, seasonId, picker, itemGlobal, adminPin, masterVolume, sfxVolume, resizerHeight, columnMode, zoomLevel, saveAllIn, resizerEnabled | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyZoom | src/runtime/ui/battle-layout-controls.js:1 | level | DOM／状态副作用；需按调用场景确认 | showToast | zoomLevel | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| zoomIn | src/runtime/ui/battle-layout-controls.js:9 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyZoom | zoomLevel | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| zoomOut | src/runtime/ui/battle-layout-controls.js:13 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyZoom | zoomLevel | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| zoomReset | src/runtime/ui/battle-layout-controls.js:17 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyZoom |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleResizerEnabled | src/runtime/ui/battle-layout-controls.js:21 | enabled | DOM／状态副作用；需按调用场景确认 | saveState, updateResizerUI | resizerEnabled | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleSaveAllIn | src/runtime/ui/battle-layout-controls.js:27 | enabled | DOM／状态副作用；需按调用场景确认 | saveState | saveAllIn | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| updateColumnMode | src/runtime/ui/battle-layout-controls.js:32 | mode | DOM／状态副作用；需按调用场景确认 | saveState, renderGrid | columnMode | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateResizerUI | src/runtime/ui/battle-layout-controls.js:38 | 无参数 | void |  | resizerEnabled, resizerHeight | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| initResizerDrag | src/runtime/ui/battle-layout-controls.js:45 | 无参数 | void; void | saveState, showToast | resizerHeight | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleLock | src/runtime/ui/admin-lock.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | openPwdModal, showToast, renderAll | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPwdModal | src/runtime/ui/admin-lock.js:10 | 无参数 | DOM／状态副作用；需按调用场景确认 | showClassroomWindow, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closePwdModal | src/runtime/ui/admin-lock.js:16 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handlePwdKey | src/runtime/ui/admin-lock.js:20 | event | DOM／状态副作用；需按调用场景确认 | submitPassword, closePwdModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| submitPassword | src/runtime/ui/admin-lock.js:27 | 无参数 | DOM／状态副作用；需按调用场景确认 | closePwdModal, showToast, renderAll, themeAlert | adminPin, isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateAdminPin | src/runtime/ui/admin-lock.js:42 | 无参数 | void | themeAlert, saveState, showToast | adminPin | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleMainAction | src/runtime/competition/round-actions.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | startRound, judgeRound | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| preloadInitialAudio | src/runtime/competition/round-actions.js:9 | 无参数 | DOM／状态副作用；需按调用场景确认 | getAudioContext, bgmPreloadNextSet |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startRound | src/runtime/competition/round-actions.js:18 | 无参数 | false; false; true; false; true; false; true; false; false | getAudioContext, hasAnyPlayableBgm, setTimeout, res, showToast, finishStartRound, bgmStartNewRoundMusicWithProgress, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishStartRound | src/runtime/competition/round-actions.js:93 | 无参数 | RoundSettlement.start() |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| hasAnyPlayableBgm | src/runtime/competition/round-actions.js:97 | 无参数 | false; true; fb !== -1; false | initDB, refreshSoundIdCache, getAllCompleteSetIndices, getFallbackSetIndex |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| nextRound | src/runtime/competition/round-actions.js:114 | 无参数 | void; void; false; true; false; false | themeAlert, bgmStopAll, bgmStartNewRoundMusicWithProgress, showToast, playSound, captureCardRectsV21725, runClassroomCommand, resetRoundItemUseLocksV2177, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, animateCardsFromSnapshotV21725 | evaluated, correctAns, roundActive, groups, selectedOpt, saveAllIn, allIn, resultText, animState | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| forceEndRound | src/runtime/competition/round-actions.js:195 | 无参数 | RoundSettlement.forceEnd() |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applySettingsBatchMembers | src/runtime/classroom/roster-settings-actions.js:1 | 无参数 | void; void | openPwdModal, themeAlert, saveState, renderAll, updatePickerPoolUI, showToast, closeSoundModal | isLocked, groups, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchSelectOption | src/runtime/classroom/roster-settings-actions.js:58 | opt | AnswerCommands.batchSelect(opt) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchToggleAllIn | src/runtime/classroom/roster-settings-actions.js:61 | 无参数 | AnswerCommands.batchToggleAllIn() |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openScoreModal | src/runtime/ui/score-dialog-and-animation.js:1 | groupId, event | DOM／状态副作用；需按调用场景确认 | showClassroomWindow, setTimeout | activeModalGroupId, groups, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeScoreModal | src/runtime/ui/score-dialog-and-animation.js:21 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow | activeModalGroupId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| submitModalScore | src/runtime/ui/score-dialog-and-animation.js:26 | delta | void | closeScoreModal, applyScoreDelta | activeModalGroupId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleModalKey | src/runtime/ui/score-dialog-and-animation.js:33 | event | DOM／状态副作用；需按调用场景确认 | submitModalCustomScore, closeScoreModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| submitModalCustomScore | src/runtime/ui/score-dialog-and-animation.js:42 | 无参数 | void; void; void; void | fail, parseInt, closeScoreModal, applyScoreDelta | activeModalGroupId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showMilestoneBanner | src/runtime/ui/score-dialog-and-animation.js:75 | groupId | void; void | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelScoreAnimationAndSync | src/runtime/ui/score-dialog-and-animation.js:93 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelItemScoreAnimations, cancelAnimationFrame | groups, displayScore, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| animateScores | src/runtime/ui/score-dialog-and-animation.js:104 | scoreUpdates, onComplete | DOM／状态副作用；需按调用场景确认 | cancelAnimationFrame, renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete | groups, displayScore, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tick | src/runtime/ui/score-dialog-and-animation.js:112 | now | DOM／状态副作用；需按调用场景确认 | renderChart, renderDashboard, requestAnimationFrame, updateHeaderStats, onComplete | groups, displayScore, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyScoreDelta | src/runtime/ui/score-dialog-and-animation.js:147 | groupId, delta | ManualScoreCommands.adjust(groupId, delta) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| startDirectScoreEdit | src/runtime/ui/score-dialog-and-animation.js:151 | groupId | void | openPwdModal, renderGrid | isLocked, editingScoreId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleScoreInputKey | src/runtime/ui/score-dialog-and-animation.js:160 | event, groupId | DOM／状态副作用；需按调用场景确认 | finishDirectScoreEdit, renderGrid | editingScoreId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| finishDirectScoreEdit | src/runtime/ui/score-dialog-and-animation.js:168 | groupId | void; false; ManualScoreCommands.set(groupId, newVal) | cancelScoreAnimationAndSync, Number, showToast, renderGrid | editingScoreId, groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| selectGroupOpt | src/runtime/competition/answer-adapter.js:1 | groupId, opt | AnswerCommands.select(groupId, opt) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAllInCard | src/runtime/competition/answer-adapter.js:4 | groupId | AnswerCommands.toggleAllIn(groupId) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setCorrectAns | src/runtime/competition/answer-adapter.js:8 | opt | AnswerCommands.correct(opt) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| settleBaseRoundLegacy | src/runtime/competition/answer-adapter.js:12 | 无参数 | void; void; void; {     flipSnapshotV21725,     scoreUpdates,     allInWins,     allInLosses,     hasNormalWin,     ha | themeAlert, captureCardRectsV21725 | roundActive, evaluated, correctAns, groups, animState, resultText, score, id, lastRoundAllIn | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openMemberSearchModal | src/runtime/ui/member-search.js:1 | 无参数 | void | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeMemberSearchModal | src/runtime/ui/member-search.js:12 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleMemberSearchKey | src/runtime/ui/member-search.js:17 | event | DOM／状态副作用；需按调用场景确认 | searchMemberGroups, closeMemberSearchModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| searchMemberGroups | src/runtime/ui/member-search.js:27 | 无参数 | void; void; void;        <div class="member-search-result">         <div class="member-search-result-name">${escapeHt | String, escapeHtml | groups, members, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateQuickBatchBar | src/runtime/ui/competition-summary.js:1 | 无参数 | void |  | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateHeaderStats | src/runtime/ui/competition-summary.js:11 | 无参数 | void | ranking, Number, escapeHtml | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderChart | src/runtime/ui/competition-summary.js:22 | 无参数 | void; scB - scA | escapeHtml, formatChartScoreV294 | groups, displayScore, score, id, name, color | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderDashboard | src/runtime/ui/competition-summary.js:95 | 无参数 | void; scB - scA | escapeHtml, getScoreText | groups, displayScore, score, selectedOpt, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderLockStatus | src/runtime/ui/competition-summary.js:144 | 无参数 | void |  | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderControls | src/runtime/ui/competition-summary.js:170 | 无参数 | DOM／状态副作用；需按调用场景确认 | updateQuickBatchBar | roundActive, evaluated, correctAns | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPickerModal | src/runtime/picker/selection-engine.js:1 | { internal = false } = {} | void; void | showClassroomWindow, updatePickerView, updatePickerPoolUI, resetSlotDisplay |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closePickerModal | src/runtime/picker/selection-engine.js:18 | 无参数 | DOM／状态副作用；需按调用场景确认 | stopSlotSpin, hideClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setPickerMode | src/runtime/picker/selection-engine.js:26 | mode | void | updatePickerView, updatePickerPoolUI, resetSlotDisplay | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updatePickerView | src/runtime/picker/selection-engine.js:44 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderTwoTierChips | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderTwoTierChips | src/runtime/picker/selection-engine.js:66 | 无参数 | void; '<button type="button" class="two-tier-chip ' +           (on ? "active" : "") +           '" style= | escapeHtml | picker, groups, members, id, color, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleGroupPreselect | src/runtime/picker/selection-engine.js:104 | gid | void | saveState, renderTwoTierChips, updatePickerPoolUI, resetSlotDisplay | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetSlotDisplay | src/runtime/picker/selection-engine.js:119 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAntiRepeat | src/runtime/picker/selection-engine.js:131 | checked | DOM／状态副作用；需按调用场景确认 | saveState, updatePickerPoolUI | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetPickerPool | src/runtime/picker/selection-engine.js:137 | 无参数 | DOM／状态副作用；需按调用场景确认 | saveState, updatePickerPoolUI, showToast | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getAvailablePool | src/runtime/picker/selection-engine.js:145 | 无参数 | { type: "groups", list: grps }; { type: "students", list: students, total: students.length }; { type: "students", list: filtered, total: students.length }; { type: "students", list: students, total: students.length }; { type: "students", list: filtered, total: students.length }; { type: "students", list: students, total: students.length } |  | picker, groups, id, members | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updatePickerPoolUI | src/runtime/picker/selection-engine.js:223 | 无参数 | void | getAvailablePool |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleSlotSpin | src/runtime/picker/selection-engine.js:234 | 无参数 | startSlotSpin(); stopSlotSpin() | startSlotSpin, stopSlotSpin |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startSlotSpin | src/runtime/picker/selection-engine.js:239 | 无参数 | void; false | getAvailablePool, themeAlert, getAudioContext, startRollLoop, setInterval | groups, picker, members, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopSlotSpin | src/runtime/picker/selection-engine.js:329 | 无参数 | false | clearInterval, stopRollLoop, playSound, studentLabelHTMLV218, escapeHtml, ensureV2State, saveState, syncPickerScoreTarget, renderPickerInfo, updatePickerPoolUI | picker, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rewardPickedStudent | src/runtime/picker/selection-engine.js:402 | points | void; void | cancelScoreAnimationAndSync, recordHistory, saveState, animateScores, playSound, showToast | picker, groups, name, score, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openBatchImportModal | src/runtime/classroom/roster-text-import.js:1 | 无参数 | void | openPwdModal, showClassroomWindow | isLocked, groups, name, members | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeBatchImportModal | src/runtime/classroom/roster-text-import.js:13 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyBatchImport | src/runtime/classroom/roster-text-import.js:17 | 无参数 | void | closeBatchImportModal, saveState, renderGrid, updatePickerPoolUI, showToast | groups, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportData | src/runtime/storage/classroom-transfer.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | buildClassroomBackup, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerImport | src/runtime/storage/classroom-transfer.js:13 | 无参数 | void | openPwdModal | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleFileImport | src/runtime/storage/classroom-transfer.js:21 | event | void; void | themeAlert, importClassroomData, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| addGroup | src/runtime/classroom/group-actions.js:1 | 无参数 | void | openPwdModal, recordHistory, playSound, saveState, renderAll | isLocked, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteGroup | src/runtime/classroom/group-actions.js:28 | groupId | void | openPwdModal, themeConfirm, recordHistory, saveState, renderAll | isLocked, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateGroupName | src/runtime/classroom/group-actions.js:48 | groupId, newName | void; void | saveState, updateHeaderStats, renderChart, renderDashboard | isLocked, groups, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateGroupColor | src/runtime/classroom/group-actions.js:59 | groupId, newColor | void; void | saveState, renderAll | isLocked, groups, color | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetAllScores | src/runtime/classroom/group-actions.js:68 | 无参数 | void | cancelScoreAnimationAndSync, openPwdModal, themeConfirm, recordHistory, animateScores, playSound, saveState | isLocked, groups, id, score, displayScore, resultText, animState | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openSoundSettings | src/runtime/audio/settings-and-transfer.js:1 | 无参数 | void | themeAlert, openPwdModal, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, switchView | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeSoundModal | src/runtime/audio/settings-and-transfer.js:14 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncSettingsControls | src/runtime/audio/settings-and-transfer.js:18 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | resizerEnabled, saveAllIn, columnMode, masterVolume, groups, name, members | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateMasterVolume | src/runtime/audio/settings-and-transfer.js:34 | vol | DOM／状态副作用；需按调用场景确认 | parseFloat, saveState | masterVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateBgmVolume | src/runtime/audio/settings-and-transfer.js:47 | value | false; true | Number, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBgmSlotList | src/runtime/audio/settings-and-transfer.js:62 | 无参数 | void; void | parseInt, Number, refreshSoundIdCache, checkSetCompleteness, hasSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderFxSlotList | src/runtime/audio/settings-and-transfer.js:126 | 无参数 | void | escapeHtml, renderFxChoices |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| previewBgmTrack | src/runtime/audio/settings-and-transfer.js:162 | slotId | void | getAudioContext |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerUploadAudio | src/runtime/audio/settings-and-transfer.js:185 | slotId, append = false | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleSoundFileUpload | src/runtime/audio/settings-and-transfer.js:193 | event | void; Promise.all(     files.map(       (file, index) =>         new Promise((resolve) => {           cons; void | showToast, resolve, getAudioContext, themeAlert, Error, reject, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteBgmTrack | src/runtime/audio/settings-and-transfer.js:278 | slotId | void | showToast, renderBgmSlotList |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteFxTrack | src/runtime/audio/settings-and-transfer.js:292 | idbKey, fxKey | void | reject, String, showToast, renderFxSlotList, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportAudioBundle | src/runtime/audio/settings-and-transfer.js:323 | 无参数 | void; void | showToast, resolve, themeAlert |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| triggerImportAudioBundle | src/runtime/audio/settings-and-transfer.js:382 | 无参数 | void | openPwdModal | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleBundleFilePicked | src/runtime/audio/settings-and-transfer.js:390 | event | void; void | showToast, themeAlert, refreshSoundIdCache, loadFxSounds, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| escapeHtml | src/runtime/ui/navigation-and-clock.js:1 | str | String(str ?? "")     .replace(/&/g, "&amp;")     .replace(/</g, "&lt;")     .replace(/>/g, "&gt;")  | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureAudioUnlocked | src/runtime/ui/navigation-and-clock.js:27 | 无参数 | Promise.resolve(); getAudioContext()     .then(() => {       audioUnlocked = true;     })     .catch(() => {       audi | getAudioContext |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/runtime/ui/navigation-and-clock.js:38 | name | DOM／状态副作用；需按调用场景确认 | String, ensureAudioUnlocked, renderWelcomePage, updateWelcomeTrackIfNeeded, renderHistoryList, renderSettlementHistoryList, syncSettingsControls, renderBgmSlotList, renderFxSlotList, renderBgmEngineConsole, menuFadeOut, renderAll, bgmStopAll, getMenuTrackKeyForView, menuStartOrSwitch |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| enterBattleFromWelcome | src/runtime/ui/navigation-and-clock.js:85 | 无参数 | DOM／状态副作用；需按调用场景确认 | switchView |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getMenuTrackKeyForView | src/runtime/ui/navigation-and-clock.js:89 | name | getWelcomeTrackKey(); "aux_history"; "aux_archives"; "aux_settings"; "aux_settings"; null | getWelcomeTrackKey |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getWelcomeTrackKey | src/runtime/ui/navigation-and-clock.js:98 | 无参数 | "welcome_" + digits | Number, String | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startWelcomeClock | src/runtime/ui/navigation-and-clock.js:114 | 无参数 | void | updateWelcomeClock, setInterval |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateWelcomeClock | src/runtime/ui/navigation-and-clock.js:120 | 无参数 | DOM／状态副作用；需按调用场景确认 | updateHeaderStats, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderWelcomePage | src/runtime/ui/navigation-and-clock.js:156 | 无参数 | void | Number, escapeHtml, getScore | groups, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveMenuCfg | src/runtime/audio/menu-patterns.js:88 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| midiToFreq | src/runtime/audio/menu-patterns.js:93 | m | 440 * Math.pow(2, (m - 69) / 12) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mulberry32 | src/runtime/audio/menu-patterns.js:97 | seed | function () {     a ／= 0;     a = (a + 0x6d2b79f5) ／ 0;     let t = Math.imul(a ^ (a >>> 15), 1 ／ a); ((t ^ (t >>> 14)) >>> 0) / 4294967296 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| buildMenuPattern | src/runtime/audio/menu-patterns.js:112 | key, bars | MENU_PATTERN_CACHE[cacheKey]; MENU_PATTERN_CACHE[cacheKey] | Number, mulberry32, rnd |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getNoiseBuffer | src/runtime/audio/menu-patterns.js:187 | 无参数 | null; noiseBuffer; noiseBuffer |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuSecPerBeat | src/runtime/audio/menu-synthesis.js:1 | 无参数 | 60 / Math.max(40, Number(menuCfg.bpm) ／／ 130) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoopSpan | src/runtime/audio/menu-synthesis.js:5 | 无参数 | {     startBeat,     endBeat,     startSec: (startBeat - 1) * menuSecPerBeat(),     endSec: (endBeat | Number, menuSecPerBeat |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeWelcomeLoopBuffer | src/runtime/audio/menu-synthesis.js:20 | key, buf | buf; buf; fixed; buf | menuLoopSpan, menuSecPerBeat |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuEnsureGraph | src/runtime/audio/menu-synthesis.js:44 | 无参数 | false; true |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| makeSynthMenuBuffer | src/runtime/audio/menu-synthesis.js:55 | key | offline.startRendering() | Number, buildMenuPattern, midiToFreq | gain, connect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoadBuffer | src/runtime/audio/menu-transport.js:2 | key | menuBgm.buffers[key]; menuLoading[key]; buf; await p | res, normalizeWelcomeLoopBuffer, makeSynthMenuBuffer |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoopParams | src/runtime/audio/menu-transport.js:42 | buf, key | { startSec, endSec }; { startSec: 0, endSec: buf.duration } | menuLoopSpan |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuTrimFor | src/runtime/audio/menu-transport.js:52 | key | Math.max(0, Math.min(3, Number.isFinite(t) ? t : 1)) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuPosForKey | src/runtime/audio/menu-transport.js:58 | key, buf, t | elapsed; Math.min(elapsed, Math.max(0, buf.duration - 0.02)); lp.startSec + ((elapsed - lp.startSec) % dur) | menuLoopParams |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuVoiceGainAt | src/runtime/audio/menu-transport.js:67 | v, t | r.v0; r.v1; r.v0 + (r.v1 - r.v0) * ((t - r.t0) / (r.t1 - r.t0)) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuVoiceRamp | src/runtime/audio/menu-transport.js:75 | v, target, dur | DOM／状态副作用；需按调用场景确认 | menuVoiceGainAt | cancelScheduledValues, setValueAtTime, linearRampToValueAtTime | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuSpawnVoice | src/runtime/audio/menu-transport.js:85 | key, buf, startAt | v | menuLoopParams, menuPosForKey |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuRetireVoice | src/runtime/audio/menu-transport.js:125 | v, fadeSec | void | menuVoiceRamp |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuSwitchNow | src/runtime/audio/menu-transport.js:139 | key, buf | DOM／状态副作用；需按调用场景确认 | menuRetireVoice, menuTrimFor, menuVoiceGainAt, menuVoiceRamp, menuSpawnVoice |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuStartOrSwitch | src/runtime/audio/menu-transport.js:168 | key | void; void; void; void; void; void | ensureAudioUnlocked, menuEnsureGraph, menuLoadBuffer, menuSwitchNow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuFadeOut | src/runtime/audio/menu-transport.js:186 | 无参数 | void | menuPosForKey, menuRetireVoice |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuStop | src/runtime/audio/menu-transport.js:202 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuResyncGrid | src/runtime/audio/menu-transport.js:217 | 无参数 | void; void; void | menuLoopParams, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuScheduleReload | src/runtime/audio/menu-transport.js:241 | 无参数 | void; void | clearTimeout, setTimeout, menuLoadBuffer, menuRetireVoice, menuVoiceRamp, menuSpawnVoice, menuTrimFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateWelcomeTrackIfNeeded | src/runtime/audio/menu-transport.js:263 | 无参数 | void | getWelcomeTrackKey, menuStartOrSwitch |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBgmEngineConsole | src/runtime/audio/menu-settings.js:1 | 无参数 | void | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuEnabledChange | src/runtime/audio/menu-settings.js:95 | v | DOM／状态副作用；需按调用场景确认 | saveMenuCfg, menuStop, menuStartOrSwitch, getMenuTrackKeyForView |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuBpmChange | src/runtime/audio/menu-settings.js:102 | v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuScheduleReload |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuMeterChange | src/runtime/audio/menu-settings.js:109 | v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuResyncGrid |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuLoopChange | src/runtime/audio/menu-settings.js:114 | field, v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuResyncGrid |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| menuTrimChange | src/runtime/audio/menu-settings.js:119 | k, v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg, menuVoiceRamp, menuTrimFor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| battleBpmChange | src/runtime/audio/menu-settings.js:130 | which, v | DOM／状态副作用；需按调用场景确认 | Number, saveMenuCfg |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| makeRollLoopBuffer | src/runtime/audio/picker-roll.js:4 | 无参数 | null; buf |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startRollLoop | src/runtime/audio/picker-roll.js:24 | 无参数 | void; void | selectFxBuffer, makeRollLoopBuffer, getFxOutputV2176 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopRollLoop | src/runtime/audio/picker-roll.js:42 | cb | void | cb, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| uiDbOpen | src/runtime/ui/wallpaper.js:3 | 无参数 | uiDbPromise; uiDbPromise | res |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| uiDbReq | src/runtime/ui/wallpaper.js:20 | mode, fn | null; new Promise((res) => {     try {       const tx = d.transaction("kv", mode);       const req = fn(tx | uiDbOpen, fn, res |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getWallVeil | src/runtime/ui/wallpaper.js:36 | 无参数 | Number.isFinite(v) ? Math.max(0, Math.min(0.8, v)) : 0.35 | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyWallpaperVeil | src/runtime/ui/wallpaper.js:40 | 无参数 | DOM／状态副作用；需按调用场景确认 | getWallVeil |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyWallpaper | src/runtime/ui/wallpaper.js:55 | blob | DOM／状态副作用；需按调用场景确认 | applyWallpaperVeil |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| compressWallpaper | src/runtime/ui/wallpaper.js:71 | file | new Promise((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.85)) | createImageBitmap, res, rej |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onWallpaperFile | src/runtime/ui/wallpaper.js:104 | input | void; void | showToast, compressWallpaper, uiDbReq, applyWallpaper |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetWallpaper | src/runtime/ui/wallpaper.js:127 | 无参数 | DOM／状态副作用；需按调用场景确认 | uiDbReq, applyWallpaper, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| changeWallpaperVeil | src/runtime/ui/wallpaper.js:132 | v | DOM／状态副作用；需按调用场景确认 | Number, applyWallpaperVeil |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| initWallpaper | src/runtime/ui/wallpaper.js:136 | 无参数 | DOM／状态副作用；需按调用场景确认 | uiDbReq, applyWallpaper |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeInventoryV21718 | src/runtime/items/definitions-and-state.js:229 | inventory | (Array.isArray(inventory) ? inventory : [])     .slice(0, 3)     .filter((it) => {       const key =; false; true; it; {         key: it.key,         charges,         acquiredAt,         itemInstanceId,         ...(conf | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureItemState | src/runtime/items/definitions-and-state.js:277 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeInventoryV21718 | groups, inventory, itemStats, itemEffect, booShield, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ranking | src/runtime/items/ranking-and-drop-legacy.js:1 | 无参数 | RankingRules.ordered(state.groups) |  | groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rankIndex | src/runtime/items/ranking-and-drop-legacy.js:4 | id | ranking().findIndex((g) => g.id === id) | ranking | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roundQuarter | src/runtime/items/ranking-and-drop-legacy.js:7 | v | Math.round((Number(v) ／／ 0) / 4) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roundThird | src/runtime/items/ranking-and-drop-legacy.js:10 | v | Math.round((Number(v) ／／ 0) / 3) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roundHalf | src/runtime/items/ranking-and-drop-legacy.js:13 | v | Math.round((Number(v) ／／ 0) / 2) | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| eligibleForItems | src/runtime/items/ranking-and-drop-legacy.js:16 | g | g && Number(g.score) >= 0 | Number | score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| consumeInventoryItem | src/runtime/items/ranking-and-drop-legacy.js:19 | g, index, amount = 1 | void |  | inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| addItemToGroup | src/runtime/items/ranking-and-drop-legacy.js:25 | g, key | false; true | eligibleForItems | inventory, itemStats, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tinyDefenseToast | src/runtime/items/ranking-and-drop-legacy.js:41 | msg | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| defenseCandidates | src/runtime/items/ranking-and-drop-legacy.js:49 | g, attackType | -1; 1; -1; 1; (a.at ／／ 0) - (b.at ／／ 0); out |  | itemEffect, booShield, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| damageFraction | src/runtime/items/ranking-and-drop-legacy.js:83 | target, denom, sourceId, type = "normal" | applyItemScore(target, -loss, sourceId, type) | roundHalf, roundThird, roundQuarter, applyItemScore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| boostFraction | src/runtime/items/ranking-and-drop-legacy.js:92 | target, denom = 4 | false; true | eligibleForItems, roundQuarter |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/runtime/items/ranking-and-drop-legacy.js:104 | pos, total | W | put |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| weightedPick | src/runtime/items/ranking-and-drop-legacy.js:196 | weights | k; arr[0]?.[0] ／／ "coin" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| drawItemForGroup | src/runtime/items/ranking-and-drop-legacy.js:206 | g | null; Object.values(weights).some((w) => w > 0)     ? weightedPick(weights)     : null | eligibleForItems, ranking, itemDropWeights, weightedPick | inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| detectOvertakePunish | src/runtime/items/attack-legacy.js:1 | actorId, beforeOrder | void; void | ranking, eligibleForItems, tryDefend, roundQuarter | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyUseItem | src/runtime/items/attack-legacy.js:25 | groupId, index | useItem(groupId, index) | useItem |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| flashBomb | src/runtime/items/attack-legacy.js:28 | id | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startBulletTimer | src/runtime/items/attack-legacy.js:38 | 无参数 | void; void | clearInterval, setInterval, ensureItemState, rankIndex, showToast, eligibleForItems, saveState, renderGrid, renderChart, renderDashboard | groups, itemEffect, id, inventory, name, score, displayScore | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startBlooperClock | src/runtime/items/attack-legacy.js:69 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyBlooperMask, setTimeout | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyBlooperMask | src/runtime/items/attack-legacy.js:74 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openItemWindow | src/runtime/items/group-window.js:1 | groupId, tab = "detail" | DOM／状态副作用；需按调用场景确认 | ensureItemState, showClassroomWindow, renderItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeItemWindow | src/runtime/items/group-window.js:8 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| switchItemTab | src/runtime/items/group-window.js:12 | tab | DOM／状态副作用；需按调用场景确认 | renderItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/runtime/items/group-window.js:16 | 无参数 | closeItemWindow(); '<div class="item-big empty"><div class="item-big-icon">＋</div><div class="item-big-name">空道具槽</div>; <div class="item-big"><div class="item-big-icon">${itemVisual(it.key)}</div><div class="item-big-na | closeItemWindow, ensureGroupNumbersV213, String, Number, escapeHtml, eligibleForItems, itemVisual | groups, name, isLocked, itemStats, itemEffect, booShield, score, groupNo, color, id, members, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| previewItemDetailColor | src/runtime/items/group-window.js:116 | value | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| saveItemDetailColor | src/runtime/items/group-window.js:120 | id, value | void; void | renderItemWindow, updateGroupColor | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| saveItemGroupDetail | src/runtime/items/group-window.js:131 | id | void; void; void; void; void | openPwdModal, showToast, Number, recordHistory, saveState, renderAll, updatePickerPoolUI, renderItemWindow | isLocked, groups, name, groupNo, members | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteItemDetailGroup | src/runtime/items/group-window.js:179 | id | void | openPwdModal, deleteGroup, closeItemWindow, renderItemWindow | isLocked, groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemQuickScore | src/runtime/items/group-window.js:193 | id, d | void | openPwdModal, applyScoreDelta, renderItemWindow | isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemCustomScore | src/runtime/items/group-window.js:201 | id | void | Number, itemQuickScore |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| enhanceItemCards | src/runtime/items/group-window.js:207 | 无参数 | void; it             ? <div class="item-slot" title="${ITEM_DEFS[it.key].name}">${itemVisual(it.key)}${it | ensureItemState, itemVisual, openItemWindow, applyBlooperMask | groups, id, inventory, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureV2State | src/runtime/picker/classroom-tools.js:4 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureItemState | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemVisual | src/runtime/picker/classroom-tools.js:43 | key, cls = "" | src     ? <img class="${cls}" src="${escapeHtml(src)}" alt="${escapeHtml(d.name)}">     : d.icon | ensureV2State, escapeHtml | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemBoxVisualV2121 | src/runtime/picker/classroom-tools.js:53 | cls = "" | BUILTIN_ITEM_BOX_V2121     ? <img class="${cls}" src="${BUILTIN_ITEM_BOX_V2121}" alt="道具箱">     :  |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| setPickerInfoTab | src/runtime/picker/classroom-tools.js:58 | tab | DOM／状态副作用；需按调用场景确认 | renderPickerInfo |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderPickerInfo | src/runtime/picker/classroom-tools.js:68 | 无参数 | void | ensureV2State, escapeHtml | groups, itemStats, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPickerModal | src/runtime/picker/classroom-tools.js:93 | ...args | DOM／状态副作用；需按调用场景确认 | ensureV2State, _v2OpenPicker, setPickerInfoTab, syncPickerScoreTarget |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncPickerScoreTarget | src/runtime/picker/classroom-tools.js:100 | 无参数 | void; void | escapeHtml | picker, name, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| pickerTargetGroup | src/runtime/picker/classroom-tools.js:111 | 无参数 | null; state.picker.mode === "group" ? w : w.group |  | picker | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scorePickerTarget | src/runtime/picker/classroom-tools.js:116 | n | void | pickerTargetGroup, showToast, applyScoreDelta, syncPickerScoreTarget | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| scorePickerCustom | src/runtime/picker/classroom-tools.js:125 | 无参数 | void | Number, scorePickerTarget |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openHandRaise | src/runtime/picker/classroom-tools.js:134 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, showClassroomWindow, renderHandRaise |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeHandRaise | src/runtime/picker/classroom-tools.js:140 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRaise | src/runtime/picker/classroom-tools.js:143 | 无参数 | void | escapeHtml | groups, id, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectHandGroup | src/runtime/picker/classroom-tools.js:154 | id | DOM／状态副作用；需按调用场景确认 | renderHandRaise | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/runtime/picker/classroom-tools.js:164 | correct | void; void | ensureV2State, showToast, recordHistory, saveState, renderAll | groups, name, itemStats, itemGlobal, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handQuickScore | src/runtime/picker/classroom-tools.js:190 | n | DOM／状态副作用；需按调用场景确认 | applyScoreDelta |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseItem | src/runtime/picker/classroom-tools.js:194 | 无参数 | void | showToast, closeHandRaise, openItemWindow | groups, inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| openItemEncyclopedia | src/runtime/items/encyclopedia-and-icons.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | openAbout, renderAbout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemEncyclopedia | src/runtime/items/encyclopedia-and-icons.js:5 | 无参数 | void; <div class="ency-card"><div class="ency-icon">${itemVisual(k)}</div><div><div class="ency-name">${d | ensureV2State, itemVisual |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| chooseItemIcon | src/runtime/items/encyclopedia-and-icons.js:16 | k | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleItemIconUpload | src/runtime/items/encyclopedia-and-icons.js:21 | e | void | ensureV2State, saveState, renderItemEncyclopedia, renderAll, showToast | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| resetItemIcon | src/runtime/items/encyclopedia-and-icons.js:36 | k | DOM／状态副作用；需按调用场景确认 | ensureV2State, saveState, renderItemEncyclopedia, renderAll | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| resetAllItemIcons | src/runtime/items/encyclopedia-and-icons.js:44 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, saveState, renderItemEncyclopedia, renderAll | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportItemIconPack | src/runtime/items/encyclopedia-and-icons.js:52 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureV2State, setTimeout | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| importItemIconPack | src/runtime/items/encyclopedia-and-icons.js:70 | e | void | ensureV2State, saveState, renderItemEncyclopedia, renderAll, showToast, themeAlert | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installSettingsTabs | src/runtime/ui/settings-and-about.js:1 | 无参数 | void | renderItemEncyclopedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV2 | src/runtime/ui/settings-and-about.js:17 | which | DOM／状态副作用；需按调用场景确认 | installSettingsTabs, renderItemEncyclopedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openAbout | src/runtime/ui/settings-and-about.js:42 | 无参数 | DOM／状态副作用；需按调用场景确认 | showClassroomWindow, renderAbout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeAbout | src/runtime/ui/settings-and-about.js:46 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/ui/settings-and-about.js:49 | tab | DOM／状态副作用；需按调用场景确认 | itemVisual |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/runtime/ui/settings-and-about.js:64 | 无参数 | void | _v2RenderItemWindow, itemVisual | groups, isLocked, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItem | src/runtime/ui/settings-and-about.js:74 | id, k | void; void | showToast, recordHistory, saveState, renderAll, renderItemWindow | groups, inventory, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godClearItems | src/runtime/ui/settings-and-about.js:95 | id | void | recordHistory, saveState, renderAll, renderItemWindow | groups, name, inventory, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| enhanceItemCards | src/runtime/ui/settings-and-about.js:109 | 无参数 | void | _v2Enhance, ensureV2State, itemVisual | groups, id, inventory, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/runtime/ui/settings-and-about.js:127 | 无参数 | void | _v2RenderItemWindowIcons, itemVisual | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/runtime/ui/settings-and-about.js:149 | name | DOM／状态副作用；需按调用场景确认 | _v2SwitchView, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelHandItemDraw | src/runtime/items/hand-reward-lifecycle.js:7 | silent = false | DOM／状态副作用；需按调用场景确认 | clearInterval, clearTimeout, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeHandRaise | src/runtime/items/hand-reward-lifecycle.js:24 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelHandItemDraw, _v21CloseHandRaise |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectHandGroup | src/runtime/items/hand-reward-lifecycle.js:30 | id | void | showToast, _v21SelectHandGroup |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/runtime/items/hand-reward-lifecycle.js:39 | correct | DOM／状态副作用；需按调用场景确认 | cancelHandItemDraw, _v21JudgeHandRaise, eligibleForItems | groups, inventory, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| finishHandItemReward | src/runtime/items/hand-reward-lifecycle.js:56 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseNewItem | src/runtime/items/hand-reward-lifecycle.js:66 | 无参数 | void; void | showToast, closeHandRaise, openItemWindow, setTimeout | groups, inventory, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/items/feedback-and-icons.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemFxTargetText | src/runtime/items/feedback-and-icons.js:2 | key, gid | [       "coin",       "mushroom",       "triple_mushroom",       "star",       "mega",       "bullet; "目标：" + names.join("、") | ranking, add | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeItemWindowForFx | src/runtime/items/feedback-and-icons.js:33 | 无参数 | DOM／状态副作用；需按调用场景确认 | closeItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeItemIconFile | src/runtime/items/feedback-and-icons.js:43 | file, done | DOM／状态副作用；需按调用场景确认 | done |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleItemIconUpload | src/runtime/items/feedback-and-icons.js:73 | e | void | normalizeItemIconFile, ensureV2State, saveState, renderItemEncyclopedia, renderAll, showToast | itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| updateCardRouletteVisual | src/runtime/items/feedback-and-icons.js:88 | o, key | void | itemVisual |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelHandItemDraw | src/runtime/items/feedback-and-icons.js:107 | silent = false | DOM／状态副作用；需按调用场景确认 | clearTimeout, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| battleCard | src/runtime/items/card-effects-legacy.js:40 | id | document.querySelector(       #view-battle .group-row-card[data-group-id="${id}"],     ) ／／ docume |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearCardFx | src/runtime/items/card-effects-legacy.js:47 | card | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playCasterCardFx | src/runtime/items/card-effects-legacy.js:64 | key, gid | void; void | battleCard, clearCardFx, itemVisual, escapeHtml, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playTargetCardFx | src/runtime/items/card-effects-legacy.js:86 | id, key, type = "hit" | void; void | battleCard, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cardFxTargets | src/runtime/items/card-effects-legacy.js:123 | key, gid | ids | ranking, add | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/items/card-effects-legacy.js:144 | key, casterId = null, targetText = "" | _v25ShowItemUseFx(key, casterId, targetText) | playCasterCardFx, cardFxTargets, setTimeout, playTargetCardFx, _v25ShowItemUseFx |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| removeBgmEngineeringConsoleV26 | src/runtime/history/boot-and-settings-compat.js:35 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemFxSoundListV26 | src/runtime/audio/item-sound-settings.js:20 | 无参数 | void; <div class="sound-row"><div class="sound-desc"><div class="sound-name">${s.name}</div><div class="s | hasSound |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemSoundCategoryV26 | src/runtime/audio/item-sound-settings.js:32 | k | "item_attack"; "item_buff"; "item_steal"; "item_status" |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/audio/item-sound-settings.js:59 | k, g, t | _v26ShowItemUseFx(k, g, t) | playSound, setTimeout, itemSoundCategoryV26, _v26ShowItemUseFx |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tinyDefenseToast | src/runtime/audio/item-sound-settings.js:65 | m | _v26TinyDefense(m) | playSound, _v26TinyDefense |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| uiIconsV26 | src/runtime/ui/icon-settings.js:26 | 无参数 | STORAGE.getJSON("politics_ui_icons_v26", {}) ／／ {} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyUiIconsV26 | src/runtime/ui/icon-settings.js:29 | 无参数 | void | uiIconsV26, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| chooseUiIconV26 | src/runtime/ui/icon-settings.js:47 | id | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handleUiIconV26 | src/runtime/ui/icon-settings.js:53 | e | void | normalizeItemIconFile, uiIconsV26, applyUiIconsV26, renderUiIconManagerV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetUiIconV26 | src/runtime/ui/icon-settings.js:64 | id | DOM／状态副作用；需按调用场景确认 | uiIconsV26, applyUiIconsV26, renderUiIconManagerV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderUiIconManagerV26 | src/runtime/ui/icon-settings.js:71 | 无参数 | void | uiIconsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rebuildSettingsV26 | src/runtime/ui/settings-navigation-compat.js:1 | 无参数 | void | removeBgmEngineeringConsoleV26, installCommunismModeSetting, renderUiIconManagerV26, renderItemEncyclopedia, renderItemFxSoundListV26, showSettingsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/runtime/ui/settings-navigation-compat.js:73 | which | void | renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, renderItemEncyclopedia, installCommunismModeSetting, renderUiIconManagerV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installSettingsTabs | src/runtime/ui/settings-navigation-compat.js:100 | 无参数 | DOM／状态副作用；需按调用场景确认 | rebuildSettingsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV2 | src/runtime/ui/settings-navigation-compat.js:103 | which | DOM／状态副作用；需按调用场景确认 | showSettingsV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncVisualViewportV27 | src/runtime/ui/settings-navigation-compat.js:129 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| repairPersistentItemsV28 | src/runtime/items/persistent-state-repair.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | ensureItemState, normalizeInventoryV21718, saveState | groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| programConfirmV28 | src/runtime/ui/program-confirmation.js:2 | message, opts = {} | new Promise((resolve) => {     const previous = document.getElementById("programConfirmV28");     pr; void; void | escapeHtml, hideClassroomWindow, resolve, finish |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| heldItemKeysV281 | src/runtime/items/weighted-selection.js:1 | g | new Set((g?.inventory ／／ []).map((it) => it?.key).filter(Boolean)) |  | inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| weightedPickNoRepeatV281 | src/runtime/items/weighted-selection.js:4 | weights, blocked = new Set() | weightedPick(filtered); null | Number, weightedPick |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/runtime/items/weighted-selection.js:13 | g, batchUsed = new Set() | k | ranking, itemDropWeights, heldItemKeysV281, weightedPickNoRepeatV281, weightedPick | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| v282RandomOther | src/runtime/items/weighted-selection.js:74 | caster | arr.length ? arr[Math.floor(Math.random() * arr.length)] : null | Number | groups, id, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| v282TakeFraction | src/runtime/items/weighted-selection.js:80 | target, frac, key, caster | false; true; applyItemAttack(caster, target, amount, key); true | Number, applyItemAttack |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| v282Consume | src/runtime/items/weighted-selection.js:91 | g, index | void | Number | inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| roulettePreviewPickV282 | src/runtime/items/effect-palette-and-preview.js:15 | 无参数 | keys[Math.floor(Math.random() * keys.length)] |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemKeysV283 | src/runtime/items/catalog-adapters.js:32 | 无参数 | ITEM_ORDER_V283.filter((k) => ITEM_DEFS[k]) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemAdminButtonV283 | src/runtime/items/catalog-adapters.js:36 | k, gid | <button class="btn item-admin-add-v283" onclick="godAddItemV283(${gid},'${k}')">${itemVisual(k)} <s | itemVisual, escapeHtml |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItemV283 | src/runtime/items/catalog-adapters.js:40 | gid, key | void; void; void | showToast, Number, recordHistory, addItemToGroup, saveState, renderAll, renderGroupModalV283 | groups, inventory, score, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGodItemManagerV283 | src/runtime/items/catalog-adapters.js:60 | gid | void; void | itemKeysV283, itemAdminButtonV283 | groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| patchVisibleGodManagerV283 | src/runtime/items/catalog-adapters.js:86 | gid | void | itemKeysV283, itemAdminButtonV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderEncyclopediaV283 | src/runtime/items/catalog-adapters.js:106 | 无参数 | void; void; <div class="guide-block encyclopedia-item"><b>${itemVisual(k)} ${escapeHtml(d.name)}</b><br>${escap | itemKeysV283, itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| appendMissingEncyclopediaV283 | src/runtime/items/catalog-adapters.js:149 | 无参数 | void; void | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| patchItemIconSettingsV283 | src/runtime/items/catalog-adapters.js:175 | 无参数 | void; void; void | itemVisual, escapeHtml |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGroupModalV283 | src/runtime/items/catalog-adapters.js:199 | gid | DOM／状态副作用；需按调用场景确认 | setTimeout, patchVisibleGodManagerV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openGroupModal | src/runtime/items/catalog-adapters.js:204 | gid, ...a | r | renderGroupModalV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGroupModal | src/runtime/items/catalog-adapters.js:212 | ...a | r | renderGroupModalV283 | activeModalGroupId | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openAboutModal | src/runtime/items/catalog-adapters.js:224 | ...a | r | setTimeout, appendMissingEncyclopediaV283 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refresh26ItemInterfacesV284 | src/runtime/items/catalog-refresh.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderItemEncyclopedia, renderItemWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| appendMissingEncyclopediaV283 | src/runtime/items/catalog-refresh.js:32 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| patchItemIconSettingsV283 | src/runtime/items/catalog-refresh.js:33 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| patchVisibleGodManagerV283 | src/runtime/items/catalog-refresh.js:36 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGroupModalV283 | src/runtime/items/catalog-refresh.js:37 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/items/catalog-refresh.js:45 | tab | void; r | _v284RenderAbout, itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isCommunismMode | src/runtime/items/feature-switch.js:2 | 无参数 | STORAGE.getJSON(COMMUNISM_MODE_KEY, true) !== false |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setCommunismMode | src/runtime/items/feature-switch.js:5 | enabled | DOM／状态副作用；需按调用场景确认 | applyCommunismMode, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyCommunismMode | src/runtime/items/feature-switch.js:10 | 无参数 | DOM／状态副作用；需按调用场景确认 | isCommunismMode |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openItemWindow | src/runtime/items/feature-switch.js:44 | ...a | void; _v291OpenItemWindow.apply(this, a) | isCommunismMode, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installCommunismModeSetting | src/runtime/items/feature-switch.js:54 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| formatChartScoreV294 | src/runtime/ui/chart-and-window-polish.js:1 | value | String(Math.trunc(n)); sign +       (v >= 100         ? Math.round(v)         : v.toFixed(v >= 10 ? 1 : 2).replace(/\.?0+$/; sign +     (v >= 100       ? Math.round(v)       : v.toFixed(v >= 10 ? 1 : 2).replace(/\.?0+$/, "")) | Number, String |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| attackHitClassV2116 | src/runtime/items/lightning-and-hit-legacy.js:1 | key | "hit-green-shell"; "hit-red-shell"; "hit-spiny"; "hit-banana"; "hit-horn"; "hit-bomb-v2116"; "hit-hammer"; "hit-lightning"; "hit-fire"; "hit-ice"; "hit-boomerang"; "hit-generic-v2116" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAttackHitFxV2116 | src/runtime/items/lightning-and-hit-legacy.js:16 | card | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playAttackTargetFxV2116 | src/runtime/items/lightning-and-hit-legacy.js:26 | groupId, key, defended = false | void; void | battleCard, clearAttackHitFxV2116, attackHitClassV2116, itemVisual, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefendLightningV2116 | src/runtime/items/lightning-and-hit-legacy.js:67 | target | true; false; true | Number, tinyDefenseToast, setTimeout, playAttackTargetFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyLightningHitV2116 | src/runtime/items/lightning-and-hit-legacy.js:101 | caster, target | false; false; true | eligibleForItems, tryDefendLightningV2116, Number, roundHalf, setTimeout, playAttackTargetFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/items/lightning-and-hit-legacy.js:129 | key, casterId = null, targetText = "" | _v2116ShowItemUseFx.call(this, key, casterId, targetText) | setTimeout, playCasterCardFx |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| isQueuePersistentActiveV2120 | src/runtime/items/queue-adapters.js:1 | g, it = null | false; ["star", "mega", "power"].includes(g.itemEffect.type) &&     main.key === g.itemEffect.type |  | inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| queueRoleTextV2120 | src/runtime/items/queue-adapters.js:10 | index | index === 0 ? "主要道具" : 次要道具 ${index} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| queueUseStateV2120 | src/runtime/items/queue-adapters.js:14 | g, index | { usable: false, label: "空道具槽" }; { usable: false, label: "🔒 等待主要道具" }; { usable: false, label: "⏳ 生效中 · 等待结束" }; { usable: false, label: "负分保护" }; { usable: false, label: "请先解锁管理口令" }; { usable: false, label: reason }; { usable: true, label: "解除冻结（本次不发动）" }; { usable: true, label: "使用主要道具" } | isQueuePersistentActiveV2120, eligibleForItems, isCommunismMode | inventory, isLocked, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddQueueItemV2120 | src/runtime/items/queue-adapters.js:32 | gid, key | void; void; void | showToast, eligibleForItems, recordHistory, addItemToGroup, saveState, renderAll, renderItemWindow | groups, inventory, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godClearQueueItemsV2120 | src/runtime/items/queue-adapters.js:52 | gid | void | recordHistory, saveState, renderAll, renderItemWindow | groups, name, inventory, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItem | src/runtime/items/queue-adapters.js:66 | id, k | DOM／状态副作用；需按调用场景确认 | godAddQueueItemV2120 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godAddItemV283 | src/runtime/items/queue-adapters.js:68 | id, k | DOM／状态副作用；需按调用场景确认 | godAddQueueItemV2120 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| godClearItems | src/runtime/items/queue-adapters.js:70 | id | DOM／状态副作用；需按调用场景确认 | godClearQueueItemsV2120 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/runtime/items/queue-adapters.js:74 | 无参数 | void; <div class="item-big queue-item-card ${i === 0 ? "queue-main-card" : "queue-secondary-card"} empty"; <div class="item-big queue-item-card ${i === 0 ? "queue-main-card" : "queue-secondary-card"} ${acti | _v2120RenderItemWindow, queueRoleTextV2120, queueUseStateV2120, isQueuePersistentActiveV2120, itemVisual, escapeHtml | groups, inventory, id, score, isLocked | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| enhanceItemCards | src/runtime/items/queue-adapters.js:136 | 无参数 | void; void | _v2120EnhanceItemCards, isQueuePersistentActiveV2120, queueRoleTextV2120, itemVisual, setTimeout | groups, id, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseNewItem | src/runtime/items/queue-adapters.js:184 | 无参数 | void | showToast, closeHandRaise, openItemWindow | groups, id, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureGroupNumbersV213 | src/runtime/ui/battle-order-compat.js:9 | save = false | void; changed | saveState | groups, groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| groupNoTextV213 | src/runtime/ui/battle-order-compat.js:37 | g | String(n).padStart(2, "0") | String | groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| desiredGroupsV213 | src/runtime/ui/battle-order-compat.js:41 | 无参数 | ranking(); state.groups     .slice()     .sort(       (a, b) =>         (a.groupNo ／／ 999999) - (b.groupNo ／／ 9 | ensureGroupNumbersV213, ranking | roundActive, evaluated, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| currentCardSortLabelV213 | src/runtime/ui/battle-order-compat.js:53 | 无参数 | v213ForceRankSort ／／ !(state.roundActive && !state.evaluated)     ? "排名"     : "编号" |  | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemEncyclopedia | src/runtime/ui/battle-order-compat.js:60 | 无参数 | void; <div class="ency-v213-card">     <div class="ency-v213-icon-disc">${itemVisual(k, "ency-v213-img")} | ensureV2State, itemVisual, escapeHtml |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applySettingsBatchMembers | src/runtime/ui/battle-order-compat.js:83 | ...a | r | ensureGroupNumbersV213, saveState, renderAll | groups, id, groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyModernFlatV217 | src/runtime/ui/battle-appearance-and-hand-rewards.js:2 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rankOfGroupV214 | src/runtime/ui/battle-appearance-and-hand-rewards.js:6 | id | i >= 0 ? i + 1 : null | ranking | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/ui/battle-appearance-and-hand-rewards.js:15 | tab | void; void; <div class="v214-about-item"><div class="v214-about-item-disc">${itemVisual(k, "v214-about-item-img; void | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRaise | src/runtime/ui/battle-appearance-and-hand-rewards.js:38 | 无参数 | void | readableTextOnColor, escapeHtml | groups, id, color, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateHandScoreV214 | src/runtime/ui/battle-appearance-and-hand-rewards.js:50 | id | void |  | groups, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handQuickScore | src/runtime/ui/battle-appearance-and-hand-rewards.js:58 | n | void | applyScoreDelta, updateHandScoreV214, setTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRewardControlsV214 | src/runtime/ui/battle-appearance-and-hand-rewards.js:66 | 无参数 | void | eligibleForItems, escapeHtml | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/runtime/ui/battle-appearance-and-hand-rewards.js:79 | correct | DOM／状态副作用；需按调用场景确认 | renderHandRewardControlsV214 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handUsePrimaryV214 | src/runtime/ui/battle-appearance-and-hand-rewards.js:83 | 无参数 | void; void | showToast, closeHandRaise, setTimeout, useItem | groups, inventory, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishHandItemReward | src/runtime/ui/battle-appearance-and-hand-rewards.js:97 | 无参数 | DOM／状态副作用；需按调用场景确认 | closeHandRaise |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderWelcomeAllV216 | src/runtime/ui/welcome-score-sync.js:3 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderWelcomePage, renderChart, renderDashboard |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/runtime/ui/welcome-score-sync.js:18 | name | r | requestAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/ui/welcome-score-sync.js:28 | key, casterId = null, targetText = "" | void | playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, cardFxTargets, playTargetCardFx, itemVisual, escapeHtml | groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemFallbackToneV2164 | src/runtime/audio/item-sound-bindings.js:30 | freq, t, dur, type = "sine", gainValue = 0.12, endFreq = null | void | getFxOutputV2176 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playItemFallbackSoundV2164 | src/runtime/audio/item-sound-bindings.js:56 | slotId | void | itemFallbackToneV2164 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playSound | src/runtime/audio/item-sound-bindings.js:110 | slotId | _v2164PlaySoundBase.call(this, slotId); void | loadFxSounds, getAudioContext, getFxOutputV2176, playItemFallbackSoundV2164 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV2164 | src/runtime/audio/item-sound-bindings.js:147 | ms = 3600 | DOM／状态副作用；需按调用场景确认 | playSound, setInterval, clearInterval, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| explodeDestroyedBombV2170 | src/runtime/items/defense-chain-compat.js:68 | holder, sourceId = null, reason = "炸弹兵被摧毁" | []; []; []; targets | ranking, eligibleForItems, tinyDefenseToast, roundQuarter, applyItemScore, setTimeout, flashBomb |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| destroyPrimaryBasicDefenseV2170 | src/runtime/items/defense-chain-compat.js:97 | target, sourceId = null, reason = "特殊攻击" | null; destroyedKey | tinyDefenseToast, explodeDestroyedBombV2170 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| detectOvertakePunish | src/runtime/items/defense-chain-compat.js:130 | actorId, beforeOrder | void; void; void | ranking, eligibleForItems, destroyPrimaryBasicDefenseV2170, tryDefend, roundQuarter | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isQueuePersistentActiveV2120 | src/runtime/items/defense-chain-compat.js:166 | g, it = null | false; ["mega", "power"].includes(g.itemEffect.type) &&     main.key === g.itemEffect.type |  | inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tryDefendLightningV2116 | src/runtime/items/defense-chain-compat.js:176 | target | true; false; true | Number, tinyDefenseToast, setTimeout, playAttackTargetFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/items/defense-chain-compat.js:209 | tab | void; _v2170RenderAboutFallback.call(this, tab); <div class="v2170-ency-row">           <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopActiveDrawAudioV2171 | src/runtime/audio/draw-audio-lifecycle.js:11 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearInterval, clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playTrackedDrawSoundV2171 | src/runtime/audio/draw-audio-lifecycle.js:34 | slotId, generation | void; void; void; void | loadFxSounds, getAudioContext, getFxOutputV2176, playItemFallbackSoundV2164, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishDrawAudioV2171 | src/runtime/audio/draw-audio-lifecycle.js:70 | generation | void | clearInterval, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV2164 | src/runtime/audio/draw-audio-lifecycle.js:94 | 无参数 | void | stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, setInterval, clearInterval, setTimeout, finishDrawAudioV2171 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelHandItemDraw | src/runtime/audio/draw-audio-lifecycle.js:127 | ...args | _v2171CancelHandItemDraw.apply(this, args) | stopActiveDrawAudioV2171 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemExistsOnFieldV2172 | src/runtime/items/drop-uniqueness-and-reset.js:7 | key | true; state.groups.some(     (g) =>       Array.isArray(g.inventory) && g.inventory.some((it) => it?.key = | ensureItemState, Number | itemGlobal, groups, inventory | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemRankBandV2172 | src/runtime/items/drop-uniqueness-and-reset.js:25 | pos, total | "front"; "rear"; "mid" | Number |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/runtime/items/drop-uniqueness-and-reset.js:43 | pos, total | W | itemRankBandV2172, Number, put, itemExistsOnFieldV2172 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| addItemToGroup | src/runtime/items/drop-uniqueness-and-reset.js:156 | g, key | false; _v2172AddItemToGroup.call(this, g, key) | itemExistsOnFieldV2172, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| clearAllItemsV2172 | src/runtime/items/drop-uniqueness-and-reset.js:171 | 无参数 | void; void | ensureItemState, Number, showToast, themeConfirm, recordHistory, clearInterval, applyBlooperMask, saveState, renderAll | groups, inventory, itemEffect, booShield, itemGlobal, iceLock | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installClearItemsSettingV2172 | src/runtime/items/drop-uniqueness-and-reset.js:228 | 无参数 | void |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| rebuildSettingsV26 | src/runtime/items/drop-uniqueness-and-reset.js:249 | ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/runtime/items/drop-uniqueness-and-reset.js:257 | which, ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/runtime/items/drop-midfield-weights.js:3 | pos, total | W | Number, itemRankBandV2172, put, itemExistsOnFieldV2172 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playPerItemFallbackV2174 | src/runtime/audio/item-sound-map.js:17 | key | void | getFxOutputV2176, tone | gain, connect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| playSound | src/runtime/audio/item-sound-map.js:82 | slotId | void; void; void; void; void; _v2174PlaySound.call(this, slotId) | loadFxSounds, getAudioContext, selectFxBuffer, getFxOutputV2176, playPerItemFallbackV2174 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/audio/item-sound-map.js:130 | key, casterId = null, targetText = "" | _v2174ShowItemUseFx.call(this, key, casterId, targetText) | playSound |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemFxSoundListV26 | src/runtime/audio/item-sound-map.js:142 | 无参数 | void; <div class="sound-row v2174-sound-row${itemClass}">       ${description}       <div class="sound-co; rowHtml(item_${k}, d.name, "默认：该道具独立合成音", visual) | hasSound, escapeHtml, renderFxChoices, rowHtml, itemVisual |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| handleSoundFileUpload | src/runtime/audio/item-sound-map.js:205 | event | result | setTimeout, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deleteFxTrack | src/runtime/audio/item-sound-map.js:216 | idbKey, fxKey | result | setTimeout, renderItemFxSoundListV26 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportFxBundleV2175 | src/runtime/audio/fx-bundle-transfer.js:5 | 无参数 | void; void; void | openPwdModal, initDB, themeAlert, showToast, resolve, setTimeout | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getFxOutputV2176 | src/runtime/audio/effects-volume.js:14 | 无参数 | masterGainNode; fxGainNodeV2176 |  | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateSfxVolumeV2176 | src/runtime/audio/effects-volume.js:25 | vol | DOM／状态副作用；需按调用场景确认 | parseFloat, getFxOutputV2176 | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installSfxVolumeSliderV2176 | src/runtime/audio/effects-volume.js:46 | 无参数 | void |  | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncSettingsControls | src/runtime/audio/effects-volume.js:82 | ...args | r | installSfxVolumeSliderV2176 | sfxVolume | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rebuildSettingsV26 | src/runtime/audio/effects-volume.js:97 | ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/runtime/audio/effects-volume.js:106 | which, ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetRoundItemUseLocksV2177 | src/runtime/items/round-use-lock.js:9 | 无参数 | DOM／状态副作用；需按调用场景确认 |  | groups, itemUsedThisRound | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshAllInMusicAfterItemUseV2177 | src/runtime/items/round-use-lock.js:15 | 无参数 | DOM／状态副作用；需按调用场景确认 | checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| markItemUsedThisRoundV2177 | src/runtime/items/round-use-lock.js:28 | groupId | void; void | refreshAllInMusicAfterItemUseV2177, showToast, saveState, renderGrid, renderDashboard, renderItemWindow | roundActive, evaluated, groups, itemUsedThisRound, allIn, name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/items/round-use-lock.js:58 | key, casterId, targetText = "" | _v2177ShowItemUseFx.call(this, key, casterId, targetText) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| queueUseStateV2120 | src/runtime/items/round-use-lock.js:72 | g, index | { usable: false, label: "本题已使用道具" }; st |  | roundActive, evaluated, itemUsedThisRound | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchToggleAllIn | src/runtime/competition/batch-all-in-guard.js:5 | 无参数 | void; void | showToast, playSound, saveState, renderGrid, renderDashboard, refreshAllInMusicAfterItemUseV2177, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking | roundActive, evaluated, groups, itemUsedThisRound, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureDrawThrottleV2179 | src/runtime/items/draw-throttle-legacy.js:12 | 无参数 | t | ensureItemState, Number | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| restrictedItemWeightsV2179 | src/runtime/items/draw-throttle-legacy.js:44 | g | { weights: W, drawNo, throttle: t } | ranking, itemDropWeights, ensureDrawThrottleV2179, Number | id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| commitDrawThrottleV2179 | src/runtime/items/draw-throttle-legacy.js:70 | g, key, drawNo, t | DOM／状态副作用；需按调用场景确认 | Number | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/runtime/items/draw-throttle-legacy.js:94 | g, batchUsed = new Set() | k | heldItemKeysV281, restrictedItemWeightsV2179, weightedPickNoRepeatV281, weightedPick, Number, commitDrawThrottleV2179 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installDrawCooldownInfoV2179 | src/runtime/items/draw-throttle-legacy.js:152 | 无参数 | void | ensureDrawThrottleV2179 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installClearItemsSettingV2172 | src/runtime/items/draw-throttle-legacy.js:171 | ...args | r | installDrawCooldownInfoV2179 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureDrawSessionThrottleV21710 | src/runtime/items/draw-session-throttle.js:15 | 无参数 | t | ensureItemState, Number | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| beginDrawSessionV21710 | src/runtime/items/draw-session-throttle.js:46 | kind | activeDrawSessionV21710 | ensureDrawSessionThrottleV21710, saveState |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| sessionRestrictedWeightsV21710 | src/runtime/items/draw-session-throttle.js:63 | g | W | ranking, itemDropWeights, ensureDrawSessionThrottleV21710, Number, itemExistsOnFieldV2172, ensureDrawThrottleV2179 | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commitSessionDrawV21710 | src/runtime/items/draw-session-throttle.js:101 | g, key | DOM／状态副作用；需按调用场景确认 | ensureDrawSessionThrottleV21710, ensureDrawThrottleV2179, Number | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/runtime/items/draw-session-throttle.js:133 | g, batchUsed = new Set() | k | heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, weightedPick, Number, commitSessionDrawV21710 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshDrawCooldownInfoV21710 | src/runtime/items/draw-session-throttle.js:160 | 无参数 | void; ${label}：当前可抽取; ${label}：第 ${next} 个抽取轮次重新开放（当前第 ${t.sessionNo} 轮） | ensureDrawSessionThrottleV21710, Number, text |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| installDrawCooldownInfoV2179 | src/runtime/items/draw-session-throttle.js:186 | ...args | r | refreshDrawCooldownInfoV21710 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showSettingsV26 | src/runtime/items/draw-session-throttle.js:195 | which, ...args | r | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startDrawSoundBedV2164 | src/runtime/items/draw-flow.js:8 | 无参数 | void | stopActiveDrawAudioV2171, playTrackedDrawSoundV2171, setInterval, clearInterval, setTimeout, finishDrawAudioV2171 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| globalItemDraw | src/runtime/items/draw-flow.js:43 | 无参数 | void; void; void; void; void | ensureV2State, eligibleForItems, showToast, switchView, beginDrawSessionV21710, startDrawSoundBedV2164, recordHistory, renderGrid, updateCardRouletteVisual, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, saveState, setTimeout, renderAll | groups, inventory, id, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/runtime/items/draw-flow.js:101 | now | void; void | updateCardRouletteVisual, roulettePreviewPickV282, requestAnimationFrame, pickItemForGroupV281, addItemToGroup, saveState, renderGrid, setTimeout, renderAll | id, itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handDrawItem | src/runtime/items/draw-flow.js:176 | 无参数 | void; void; void; void; void; void; void; void; false; false; true; void; void | ensureV2State, eligibleForItems, showToast, beginDrawSessionV21710, startDrawSoundBedV2164, escapeHtml, roulettePreviewPickV282, itemVisual, requestAnimationFrame, cancelHandItemDraw, renderHandRaise, pickItemForGroupV281, runClassroomCommand, addItemToGroup, renderAll | groups, inventory, id, name, seasonId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| frame | src/runtime/items/draw-flow.js:221 | now | void; void; void; void; false; false; true; void; void | roulettePreviewPickV282, itemVisual, requestAnimationFrame, eligibleForItems, cancelHandItemDraw, showToast, renderHandRaise, pickItemForGroupV281, runClassroomCommand, addItemToGroup, renderAll, escapeHtml | groups, seasonId | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playCasterCardFx | src/runtime/items/draw-flow.js:339 | key, gid | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playTargetCardFx | src/runtime/items/draw-flow.js:342 | id, key, type = "hit" | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| playAttackTargetFxV2116 | src/runtime/items/draw-flow.js:345 | groupId, key, defended = false | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyLightningHitV2116 | src/runtime/ui/attack-reorder-scheduling.js:26 | caster, target | _v21713ApplyLightningHit.call(this, caster, target) | eligibleForItems |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/items/encyclopedia-effects.js:51 | tab | void; _v21715RenderAbout.call(this, tab); <div class="v2170-ency-row">           <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectGroupPresetColorV21716 | src/runtime/classroom/group-palette.js:1 | id, color | void; void | openPwdModal, updateGroupColor, renderItemWindow | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| previewItemDetailColorV21716 | src/runtime/classroom/group-palette.js:12 | value | DOM／状态副作用；需按调用场景确认 | previewItemDetailColor, String |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureSpinyCooldownV21717 | src/runtime/items/spiny-cooldown.js:7 | 无参数 | t | ensureDrawSessionThrottleV21710, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| sessionRestrictedWeightsV21710 | src/runtime/items/spiny-cooldown.js:21 | g | W | ensureSpinyCooldownV21717, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| commitSessionDrawV21710 | src/runtime/items/spiny-cooldown.js:36 | g, key | DOM／状态副作用；需按调用场景确认 | ensureSpinyCooldownV21717 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshDrawCooldownInfoV21710 | src/runtime/items/spiny-cooldown.js:48 | 无参数 | void | ensureSpinyCooldownV21717, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/runtime/items/inventory-recovery.js:6 | g, batchUsed = new Set() | null; k | heldItemKeysV281, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281, commitSessionDrawV21710 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| repairDuplicateInventoryV21718 | src/runtime/items/inventory-recovery.js:27 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeInventoryV21718, saveState, renderAll | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| repairFlowerChargesV21719 | src/runtime/items/flower-charges-recovery.js:2 | 无参数 | void; void | Number, saveState, renderAll | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearBrokenCardTranslateV21720 | src/runtime/ui/card-transform-repair.js:2 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBattleRankPreviewV21721 | src/runtime/ui/rank-preview.js:3 | 无参数 | void; <div class="battle-rank-chip-v21721 ${rank === 1 ? "rank-1" : ""}" style="--rank-group-color:${g.co | ranking, Number, groupNoTextV213, String, escapeHtml | groups, groupNo, id, color, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| switchView | src/runtime/ui/rank-preview.js:50 | name, ...args | result | setTimeout, renderBattleRankPreviewV21721 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| desiredGroupsV21724 | src/runtime/ui/battle-sort-contract.js:8 | 无参数 | groups.sort((a, b) => {       const na =         typeof groupNoValueV213 === "function"           ? ; na - nb; ranking().slice(); groups.sort((a, b) => {     const d = Number(b.score ／／ 0) - Number(a.score ／／ 0);     if (d !== 0) ; d; na - nb | groupNoValueV213, Number, ranking | groups, roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSortingV21724 | src/runtime/ui/battle-sort-contract.js:56 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderBattleRankPreviewV21721 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| captureCardRectsV21725 | src/runtime/ui/round-flip.js:5 | 无参数 | map | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| animateCardsFromSnapshotV21725 | src/runtime/ui/round-flip.js:21 | oldRects | void; void; void; void | String, clearTimeout, requestAnimationFrame, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| closeThemeDialogV21727 | src/runtime/ui/theme-dialog.js:4 | result = false | void | hideClassroomWindow, resolve |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openThemeDialogV21727 | src/runtime/ui/theme-dialog.js:14 | message, opts = {} | Promise.resolve(false); new Promise((resolve) => {     themeDialogResolveV21727 = resolve;      if (opts.confirm) {       co | prev, String, closeThemeDialogV21727, setTimeout, showClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| themeAlert | src/runtime/ui/theme-dialog.js:74 | message, opts = {} | openThemeDialogV21727(message, { ...opts, confirm: false }) | openThemeDialogV21727 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| themeConfirm | src/runtime/ui/theme-dialog.js:78 | message, opts = {} | openThemeDialogV21727(message, { ...opts, confirm: true }) | openThemeDialogV21727 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scheduleScoreEffect | src/runtime/ui/score-motion.js:2 | fn, delay | setTimeout(() => {     if (epoch === scoreAnimationEpoch) fn();   }, delay) | setTimeout, fn |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelItemScoreAnimations | src/runtime/ui/score-motion.js:8 | 无参数 | DOM／状态副作用；需按调用场景确认 | String, clearTimeout | groups, id, score, displayScore | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| snapshotScoresV21732 | src/runtime/ui/score-motion.js:49 | 无参数 | new Map(state.groups.map((g) => [String(g.id), Number(g.score) ／／ 0])) | String, Number | groups, id, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| getScoreElementV21732 | src/runtime/ui/score-motion.js:53 | groupId | document.getElementById(score-val-${groupId}) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyHeldDisplayScoresV21732 | src/runtime/ui/score-motion.js:57 | 无参数 | DOM／状态副作用；需按调用场景确认 | String | groups, displayScore | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showDeltaOnlyV21732 | src/runtime/ui/score-motion.js:64 | groupId, delta | void | getScoreElementV21732, requestAnimationFrame, scheduleScoreEffect |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mountScoreRollV21732 | src/runtime/ui/score-motion.js:83 | scoreEl, g, session | DOM／状态副作用；需按调用场景确认 |  | color | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| rollThenCommitScoreV21732 | src/runtime/ui/score-motion.js:98 | groupId, from, to | void; void | String, getScoreElementV21732, mountScoreRollV21732, scheduleScoreEffect, renderChart, renderDashboard, updateHeaderStats, renderBattleRankPreviewV21721 | groups, displayScore, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| queueItemScoreChangesV21732 | src/runtime/ui/score-motion.js:127 | beforeMap | void; void; void; void; void | matchMedia, String, Number, getScoreElementV21732, clearTimeout, scheduleScoreEffect, showDeltaOnlyV21732, rollThenCommitScoreV21732 | groups, displayScore, score, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| restoreHeldScoreElementsV21732 | src/runtime/ui/score-motion.js:204 | 无参数 | DOM／状态副作用；需按调用场景确认 | getScoreElementV21732, String, mountScoreRollV21732 | groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| normalizeItemEffectForStatusV21731 | src/runtime/items/status-normalization.js:2 | g | void | Number | itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| repairAllItemEffectsV21731 | src/runtime/items/status-normalization.js:25 | 无参数 | DOM／状态副作用；需按调用场景确认 | normalizeItemEffectForStatusV21731, saveState | groups, itemEffect | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureItemState | src/runtime/items/status-normalization.js:41 | ...args | result | repairAllItemEffectsV21731 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| getTopNoticeStackV21735 | src/runtime/ui/defense-notices.js:3 | 无参数 | stack; stack |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| appendTopNoticeV21735 | src/runtime/ui/defense-notices.js:14 | node, duration = 3800 | node | getTopNoticeStackV21735, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showItemUseFx | src/runtime/ui/defense-notices.js:30 | key, casterId = null, targetText = "" | void; void | playSound, setTimeout, itemSoundCategoryV26, playCasterCardFx, cardFxTargets, playTargetCardFx, itemVisual, escapeHtml, appendTopNoticeV21735 | groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| tinyDefenseToast | src/runtime/ui/defense-notices.js:99 | msg | DOM／状态副作用；需按调用场景确认 | playSound, escapeHtml, String, appendTopNoticeV21735 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| parseStudentV218 | src/runtime/classroom/student-labels-and-search.js:4 | raw | { number: null, name: text, raw: text }; {     number: Number(m[1]),     numberText: m[1],     name: (m[2] ／／ "").trim() ／／ text,     raw: te | String, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| studentLabelHTMLV218 | src/runtime/classroom/student-labels-and-search.js:16 | raw, g | <span class="student-name-v218">${escapeHtml(p.name)}</span>; <span class="student-no-inline-v218" style="color:${g?.color ／／ "#0f766e"}">${escapeHtml(p.numberTe | parseStudentV218, escapeHtml | color | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pinyinInitialV218 | src/runtime/classroom/student-labels-and-search.js:22 | raw | "#"; ch.toUpperCase(); "#"; result; "#" | parseStudentV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBattleRankPreviewV21721 | src/runtime/classroom/student-labels-and-search.js:72 | 无参数 | r | Number | itemGlobal | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| searchMemberGroups | src/runtime/classroom/student-labels-and-search.js:86 | 无参数 | void; void; void | parseStudentV218, String, escapeHtml, studentLabelHTMLV218 | groups, members, color, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncPickerScoreTarget | src/runtime/classroom/student-labels-and-search.js:130 | 无参数 | void; void | escapeHtml, studentLabelHTMLV218 | picker, color, name, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| allStudentsV218 | src/runtime/classroom/quick-person-score.js:7 | 无参数 | out | parseStudentV218, pinyinInitialV218 | groups, members, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| numberBandV218 | src/runtime/classroom/quick-person-score.js:23 | n | null; "1-9"; ${start}-${start + 9} |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openQuickPersonScoreV218 | src/runtime/classroom/quick-person-score.js:29 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderQuickPersonFiltersV218, renderQuickPersonListV218, showClassroomWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| closeQuickPersonScoreV218 | src/runtime/classroom/quick-person-score.js:40 | 无参数 | DOM／状态副作用；需按调用场景确认 | hideClassroomWindow |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleQPSetV218 | src/runtime/classroom/quick-person-score.js:43 | type, val | DOM／状态副作用；需按调用场景确认 | renderQuickPersonFiltersV218, renderQuickPersonListV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderQuickPersonFiltersV218 | src/runtime/classroom/quick-person-score.js:49 | 无参数 | DOM／状态副作用；需按调用场景确认 | allStudentsV218, numberBandV218, parseInt, escapeHtml | groups, id, color, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| filteredStudentsV218 | src/runtime/classroom/quick-person-score.js:84 | 无参数 | allStudentsV218().filter((s) => {     if (q) {       const qNum = q.replace(/\D/g, "");       const ; false; false; false; false; true | allStudentsV218, String, numberBandV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderQuickPersonListV218 | src/runtime/classroom/quick-person-score.js:110 | 无参数 | void | filteredStudentsV218, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleQuickPersonV218 | src/runtime/classroom/quick-person-score.js:129 | key | DOM／状态副作用；需按调用场景确认 | renderQuickPersonListV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyQuickPersonScoreV218 | src/runtime/classroom/quick-person-score.js:135 | points | false; false; false; false; name + " " + (u.delta >= 0 ? "+" : "") + u.delta; true; false; true | openPwdModal, Number, showToast, allStudentsV218, cancelScoreAnimationAndSync, runClassroomCommand, animateScores, playSound | isLocked, groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| applyQuickPersonCustomV218 | src/runtime/classroom/quick-person-score.js:195 | 无参数 | void | Number, showToast, applyQuickPersonScoreV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| consumeOneV218 | src/runtime/items/triple-defense-helpers.js:7 | g, index | void | Number | inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| attackOneFifthV218 | src/runtime/items/triple-defense-helpers.js:13 | caster, target, key | { changed: false }; applyItemScore(target, -amount, caster.id, key) | Number, applyItemScore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishOwnItemUseV218 | src/runtime/items/triple-defense-helpers.js:18 | g, key, index, targetText | true | Number, recordHistory, saveState, renderAll, showItemUseFx, showToast | itemStats, name, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| queueUseStateV2120 | src/runtime/items/triple-defense-helpers.js:32 | g, index | { usable: false, label: "设置中已关闭主动使用" }; {         usable: true,         label: 继续使用（剩余 ${g.inventory[0].charges}）,       }; _v218QueueState.call(this, g, index) |  | inventory, roundActive, evaluated, itemUsedThisRound, roundItemContinuationKeyV218 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemDropWeights | src/runtime/items/first-hand-pool.js:16 | pos, total | globalThis.ItemModules ? ItemModules.drawWeights(W) : W | Number |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| pickItemForGroupV281 | src/runtime/items/first-hand-pool.js:29 | g, batchUsed = new Set() | ItemDrawBlocks.pick(g, batchUsed) |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| scoreSnapshotV218 | src/runtime/classroom/hand-reward-controls.js:2 | 无参数 | new Map(state.groups.map((g) => [g.id, Number(g.score) ／／ 0])) | Number | groups, id, score | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showHandEffectV218 | src/runtime/classroom/hand-reward-controls.js:5 | key, before, note = "" | void; void | Number, escapeHtml, itemVisual, clearTimeout, setTimeout | groups, id, score, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseOneV218 | src/runtime/classroom/hand-reward-controls.js:34 | 无参数 | void | showToast, scoreSnapshotV218, useItem, setTimeout, showHandEffectV218, renderHandRewardControlsV218 | groups, inventory, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| handUseAllTripleV218 | src/runtime/classroom/hand-reward-controls.js:47 | 无参数 | void; void | showToast, scoreSnapshotV218, Number, showHandEffectV218, renderHandRewardControlsV218, useItem, setTimeout, fire | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHandRewardControlsV218 | src/runtime/classroom/hand-reward-controls.js:72 | 无参数 | void | Number, eligibleForItems, escapeHtml | groups, inventory | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeHandRaise | src/runtime/classroom/hand-reward-controls.js:93 | correct | r | setTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| finishHandItemReward | src/runtime/classroom/hand-reward-controls.js:100 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderHandRewardControlsV218 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/items/encyclopedia-rules.js:61 | tab | _v218RenderAbout.call(this, tab); void; <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img") | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| groupItemDescV2182 | src/runtime/items/group-encyclopedia.js:71 | key | GROUP_ITEM_DESC_V2182[key] ／／ ITEM_DEFS[key]?.desc ／／ "" |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| syncGodItemPickerV2182 | src/runtime/items/group-encyclopedia.js:83 | 无参数 | void; void; void | groupItemDescV2182 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| syncOwnedItemCardsV2182 | src/runtime/items/group-encyclopedia.js:120 | 无参数 | void | groupItemDescV2182 | groups, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| syncGroupItemInfoV2182 | src/runtime/items/group-encyclopedia.js:132 | 无参数 | DOM／状态副作用；需按调用场景确认 | syncGodItemPickerV2182, syncOwnedItemCardsV2182 |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderItemWindow | src/runtime/items/group-encyclopedia.js:139 | 无参数 | r | requestAnimationFrame |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| adminAddItem | src/runtime/items/group-encyclopedia.js:148 | 无参数 | r | setTimeout |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/items/encyclopedia-copy.js:83 | tab | _v2184RenderAbout.call(this, tab); void; <div class="v2170-ency-row">         <div class="v2170-ency-icon">${itemVisual(k, "v2170-ency-img") | itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ensureDockHumorTipV2185 | src/runtime/ui/dock-tooltips.js:77 | 无参数 | dockHumorTipV2185; el |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bindDockHumorV2185 | src/runtime/ui/dock-tooltips.js:85 | el, key | void | ensureDockHumorTipV2185, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyDockHumorV2185 | src/runtime/ui/dock-tooltips.js:110 | 无参数 | void | bindDockHumorV2185, byOnclick |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderLockState | src/runtime/ui/dock-tooltips.js:180 | 无参数 | r | bindDockHumorV2185 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| polishVisibleCopyV2187 | src/runtime/ui/interface-copy.js:4 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/ui/interface-copy.js:54 | tab | _v2187RenderAbout.call(this, tab); void; void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| openPwdModal | src/runtime/ui/interface-copy.js:93 | 无参数 | r |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cleanVisibleCopyV21811 | src/runtime/ui/about-copy.js:1 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAbout | src/runtime/ui/about-copy.js:17 | tab | r | cleanVisibleCopyV21811 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetCompetitionDataAfterSettlementV21812 | src/runtime/competition/season-cleanup.js:4 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelScoreAnimationAndSync, resetSlotDisplay, ensureV2State | seasonId, groups, score, displayScore, allIn, selectedOpt, resultText, animState, inventory, itemStats, itemEffect, booShield, itemUsedThisRound, booRoundsLeftV218, roundItemContinuationKeyV218, __spinyHornDecisionPendingV218, __spinyHornDeclinedV218, _pendingItemScoreV21727, _displayScoreHoldV21732, roundActive, evaluated, correctAns, correctAnswer, hasStartedOnce, lastRoundAllIn, roundNo, itemGlobal, picker | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| snapshotGroupForSettlementV21813 | src/runtime/archives/full-settlement.js:3 | g | {     id: g.id,     groupUid: g.groupUid ／／ "",     name: g.name,     color: g.color,     members: c | clone, Number | id, groupUid, name, color, members, score, displayScore, allIn, selectedOpt, resultText, animState, inventory, itemStats, itemEffect, booShield, booRoundsLeftV218, itemUsedThisRound, roundItemContinuationKeyV218, __spinyHornDecisionPendingV218, __spinyHornDeclinedV218 | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| compactUndoHistoryV21813 | src/runtime/archives/full-settlement.js:28 | 无参数 | (historyStack ／／ []).map((h) => ({     desc: h.desc ／／ "",     time: h.time ／／ "",     groups: (h.gr | clone |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| buildSettlementClearedDataV21813 | src/runtime/archives/full-settlement.js:45 | 无参数 | {     seasonId: state.seasonId,     archivedAt: new Date().toLocaleString(),      groups: state.grou | Number, clone, compactUndoHistoryV21813 | itemGlobal, seasonId, groups, roundActive, evaluated, correctAnswer, correctAns, roundNo, hasStartedOnce, lastRoundAllIn, picker | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| csvCellV21813 | src/runtime/archives/full-settlement.js:120 | v | '""'; "${text.replace(/"/g, '""')}" | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemNameV21813 | src/runtime/archives/full-settlement.js:132 | key | ITEM_DEFS?.[key]?.name ／／ key ／／ "" |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| inventoryTextV21813 | src/runtime/archives/full-settlement.js:135 | inv | (inv ／／ [])     .map((it) => {       const n = itemNameV21813(it.key);       const c = Number(it.cha; c > 1 ? ${n} ×${c} : n | itemNameV21813, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| effectTextV21813 | src/runtime/archives/full-settlement.js:144 | g | out.join(" / ") ／／ "无" | Number | itemEffect, booShield, booRoundsLeftV218 | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| exportSingleSettlementCSV | src/runtime/archives/full-settlement.js:164 | index | void | getSettlementHistory, Number, csvCellV21813, inventoryTextV21813, effectTextV21813, showToast | score, itemStats, name, members, inventory, booRoundsLeftV218, itemUsedThisRound, roundItemContinuationKeyV218, allIn, selectedOpt, resultText, id, itemEffect, booShield | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderBattleGridCards | src/ui/battle-grid.js:2 | 无参数 | void; void; void; void | ensureGroupNumbersV213, String, desiredGroupsV213, currentCardSortLabelV213, enhanceItemCards, useItem, showToast, openItemWindow, requestAnimationFrame, setTimeout | columnMode, id, animState, color, roundActive, evaluated, correctAns, isLocked, editingScoreId, inventory, itemEffect | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| decorateBattleRanks | src/ui/battle-grid.js:173 | 无参数 | void | ranking, Number, currentCardSortLabelV213 | id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| decorateRoundItemLocks | src/ui/battle-grid.js:193 | 无参数 | void; void |  | roundActive, evaluated, groups, itemUsedThisRound, id | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAll | src/ui/render.js:4 | 无参数 | void | clearTimeout, setTimeout, refreshPages |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshPages | src/ui/render.js:23 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderLockStatus, renderControls, renderGrid, updateHeaderStats, renderChart, renderDashboard, updateResizerUI, renderWelcomePage, updateWelcomeTrackIfNeeded |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderGrid | src/ui/render.js:35 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyHeldDisplayScoresV21732, setTimeout, refreshBattleGrid, restoreHeldScoreElementsV21732 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshBattleGrid | src/ui/render.js:53 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderBattleGridCards, decorateBattleRanks, decorateRoundItemLocks, renderBattleRankPreviewV21721 | roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scoreLosses | src/domain/items/impact-facts.js:3 | beforeGroups, afterGroups, { actorGroupUid, itemKey, seasonId } | []; []; []; facts |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| select | src/domain/items/targets.js:3 | kind, context, { random, eligible } | []; [c.ranking[i - 1], center, c.ranking[i + 1]].filter(           (t) => t && t.id !== c.group.id,     ; selector(context) | random, randomOne, selector |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| run | src/items/operation.js:134 | key, group, index | false; false; true | Error, ranking, eligibleForItems, showToast, snapshotScoresV21732, consumeInventoryItem, Number, detectOvertakePunish, showItemUseFx, queueItemScoreChangesV21732 | id, groups, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| settle | src/items/round-effects.js:3 | { rankingsBefore, answersBefore } | void; true | eligibleForItems, ranking, detectOvertakePunish | groups | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| expire | src/items/round-effects.js:35 | { answersBefore } | true | Number, showToast | groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| afterPowerRound | src/ui/round-feedback.js:3 | powerBefore, roundToken | void; void; void | setTimeout, cancelAnimationFrame, Number, renderDashboard, renderChart, updateHeaderStats, animateScores, refresh | groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| execute | src/application/round-settlement.js:3 | 无参数 | false; false; group         ? 1 + groups.filter((candidate) => candidate.score > group.score).length         : nul; {       ...presentation,       powerBefore: context.powerBefore,       roundFacts: context.answersBe; {           seasonId: state.seasonId,           roundNumber: state.itemGlobal.pkTotal,           gro | ranking, settleBaseRoundLegacy, ensureV2State, rankOf | roundActive, evaluated, correctAns, groups, itemGlobal, seasonId | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| present | src/application/round-settlement.js:67 | presentation | void; void; void | animateCardsFromSnapshotV21725, setTimeout, animateScores, playSound, bgmTriggerVictory | groups, correctAns | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| start | src/application/round-settlement.js:109 | 无参数 | true; false; false; true | captureCardRectsV21725, runClassroomCommand, resetRoundItemUseLocksV2177, renderAll, animateCardsFromSnapshotV21725 | hasStartedOnce, roundActive, evaluated, correctAns, groups, selectedOpt, allIn, resultText, animState | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| captureRoundToken | src/application/round-settlement.js:141 | 无参数 | {       classroom: state,       groups: state.groups,       season: state.seasonId,       generation |  | groups, seasonId, roundActive, evaluated, correctAns, id, selectedOpt, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isRoundTokenCurrent | src/application/round-settlement.js:155 | token | false; token.phase ===       JSON.stringify({         roundActive: state.roundActive,         evaluated: st |  | groups, seasonId, roundActive, evaluated, correctAns, id, selectedOpt, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| forceEnd | src/application/round-settlement.js:177 | 无参数 | false; false; false; false; true; false; false; true | themeConfirm, showToast, captureCardRectsV21725, runClassroomCommand, bgmStopAll, renderAll, animateCardsFromSnapshotV21725 | roundActive, evaluated, groups, seasonId, correctAns, id, selectedOpt, allIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pick | src/items/draw.js:3 | group, batchUsed = new Set() | key; "horn"; null; key | heldItemKeysV281, weightedPick, commitSessionDrawV21710, rankIndex, sessionRestrictedWeightsV21710, weightedPickNoRepeatV281 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| create | src/application/command-lifecycle.js:3 | host | Object.freeze({         commandId: tx.commandId,         emit: (...args) => {           if (current ; false; tx.eventScope.emit(...args); false; true; void; void; void; false; false; false; !tx.cancelled; false; void; void; true; {       run,       defer,       cancel,       isPending: () => !!(current ／／ persisting),       isCo | Error, TypeError, callback, cancel, String, finalizer, context, fail, notify, acknowledge, operation, finish, isCurrent, apply |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| context | src/application/command-lifecycle.js:13 | tx | Object.freeze({         commandId: tx.commandId,         emit: (...args) => {           if (current ; false; tx.eventScope.emit(...args) | Error, TypeError |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| notify | src/application/command-lifecycle.js:31 | tx, callback | DOM／状态副作用；需按调用场景确认 | callback |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancel | src/application/command-lifecycle.js:44 | reason = "cancelled" | false; true |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fail | src/application/command-lifecycle.js:60 | tx, error | void | cancel, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finish | src/application/command-lifecycle.js:65 | tx | void; void | finalizer, context, fail, notify, acknowledge, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| acknowledge | src/application/command-lifecycle.js:105 | tx, transaction, saved | DOM／状态副作用；需按调用场景确认 | notify, Error |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| run | src/application/command-lifecycle.js:148 | description, operation, options = {} | false; false; false; !tx.cancelled | cancel, operation, context, fail, finish |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| defer | src/application/command-lifecycle.js:200 | promise, apply, isCurrent = () => true | false; void; void; true | isCurrent, cancel, apply, finish, fail |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| fault | src/application/transactional-command-service.js:3 | code, message | error |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| text | src/application/transactional-command-service.js:9 | value, field | value.trim() | fault |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| capture | src/application/transactional-command-service.js:14 | raw | freeze({       commandId: text(request.commandId, "commandId"),       aggregateId: text(request.aggr | fault, String, text, freeze |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| create | src/application/transactional-command-service.js:41 | {     repository,     handlers,     authorize,     publish = () => {},     reportPresentationError = (error) =>       console.error("Committed command presentation failed", error),     validateSnapshot = () => {},     now = () => new Date(),   } | { ...prior, commandId: request.commandId, persisted: true }; { ...receipt, commandId: request.commandId, persisted: true }; Promise.reject(error); existing.intent === intent           ? existing.promise           : Promise.reject(               fa; promise; { dispatch, isPending: (commandId) => inFlight.has(commandId) } | fault, checkCancelled, authorize, handler, freeze, String, validateSnapshot, publish, reportPresentationError, capture, execute |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| execute | src/application/transactional-command-service.js:56 | request, { signal } = {} | { ...prior, commandId: request.commandId, persisted: true }; { ...receipt, commandId: request.commandId, persisted: true } | fault, checkCancelled, authorize, handler, freeze, String, validateSnapshot, publish, reportPresentationError |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dispatch | src/application/transactional-command-service.js:148 | raw, options | Promise.reject(error); existing.intent === intent           ? existing.promise           : Promise.reject(               fa; promise | capture, fault, execute |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| create | src/application/migration-coordinator.js:3 | { inventory, openRepository, sourceOptions = {} } | {           ok: false,           status: "SOURCE_UNSTABLE",           conflicts: captured.conflicts,; {         ok: true,         status: "PREVIEW",         migrationId: plan.migrationId,         aggreg; {             ok: false,             status: "SOURCE_CHANGED",             authorityChanged: false, ; {             ok: false,             status: "SOURCE_CHANGED",             authorityChanged: false, ; {             ok: false,             status: "SOURCE_CHANGED",             authorityChanged: false, ; {             ok: false,             status: "DESTINATION_INVALID",             authorityChanged: fa; {             ok: false,             status: "STAGED_SOURCE_CHANGED",             authorityChanged: ; {           ok: completedStatus === "VERIFIED",           status:             completedStatus === "V; {           ok: false,           status: error.code === "CANCELLED" ? "CANCELLED" : "FAILED",       ; { preview, execute } | cancelled, openRepository, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| preview | src/application/migration-coordinator.js:8 | 无参数 | {           ok: false,           status: "SOURCE_UNSTABLE",           conflicts: captured.conflicts,; {         ok: true,         status: "PREVIEW",         migrationId: plan.migrationId,         aggreg |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| execute | src/application/migration-coordinator.js:30 | selected, { signal } = {} | {             ok: false,             status: "SOURCE_CHANGED",             authorityChanged: false, ; {             ok: false,             status: "SOURCE_CHANGED",             authorityChanged: false, ; {             ok: false,             status: "SOURCE_CHANGED",             authorityChanged: false, ; {             ok: false,             status: "DESTINATION_INVALID",             authorityChanged: fa; {             ok: false,             status: "STAGED_SOURCE_CHANGED",             authorityChanged: ; {           ok: completedStatus === "VERIFIED",           status:             completedStatus === "V; {           ok: false,           status: error.code === "CANCELLED" ? "CANCELLED" : "FAILED",        | cancelled, openRepository, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| select | src/application/answer-commands.js:3 | groupId, opt | void; void; runClassroomCommand(       ${group.name} 选择答案,       () => {         group.selectedOpt = group.sel; true | playSound, runClassroomCommand | roundActive, evaluated, groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAllIn | src/application/answer-commands.js:17 | groupId | false; void; true; false | showToast, playSound, runClassroomCommand, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking | groups, id, roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchSelect | src/application/answer-commands.js:51 | opt | false; true; false; true | showToast, playSound, runClassroomCommand, renderGrid, renderDashboard | roundActive, evaluated, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| batchToggleAllIn | src/application/answer-commands.js:73 | 无参数 | false; true; false; true | showToast, playSound, runClassroomCommand, checkAllInRatio, bgmTransitionThinkingToBattle, bgmTransitionBattleToThinking, renderGrid, renderDashboard | roundActive, evaluated, groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| correct | src/application/answer-commands.js:110 | opt | false; false; false; false; true; false; false; true | programConfirmV28, showToast, runClassroomCommand, playSound, renderControls | evaluated, groups, seasonId, correctAns, roundActive, selectedOpt, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| adjust | src/application/manual-score-commands.js:3 | groupId, delta | void; void; false; void; true; false; true | cancelScoreAnimationAndSync, openPwdModal, showToast, runClassroomCommand, playSound, showMilestoneBanner, animateScores | isLocked, groups, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| set | src/application/manual-score-commands.js:60 | groupId, targetScore | false; false; true; false; true | showToast, runClassroomCommand, playSound, animateScores | groups, id, editingScoreId | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| buildClassroomBackup | src/application/legacy-classroom-adapter.js:3 | 无参数 | clone(classroomCommands.baseline().backup); {     schemaVersion: Reliability.schemaVersion,     appVersion: "V@@VERSION@@",     timestamp: new D | clone, getPersistableGroups | seasonId, achievementLedger, picker, itemGlobal, roundActive, evaluated, correctAns, hasStartedOnce, lastRoundAllIn, adminPin, masterVolume, sfxVolume, zoomLevel, resizerEnabled, resizerHeight, columnMode, saveAllIn | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyClassroomBackup | src/application/legacy-classroom-adapter.js:34 | raw | DOM／状态副作用；需按调用场景确认 | normalizeAllGroups, clone, String, Number, ensureV2State, ensureGroupNumbersV213 | seasonId, achievementLedger, groups, picker, itemGlobal, roundActive, evaluated, hasStartedOnce, correctAns, lastRoundAllIn, selectedOpt, allIn, itemUsedThisRound, adminPin, k, columnMode | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| importClassroomData | src/application/legacy-classroom-adapter.js:120 | data | conflict; { ok: false, error: "请先解锁" }; { ok: true }; { ok: false, error: String(error.message ／／ error) } | clone, Error, cancelScoreAnimationAndSync, applyClassroomBackup, saveState, renderAll, String | isLocked, zoomLevel | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| itemCommandSnapshot | src/application/legacy-classroom-adapter.js:161 | 无参数 | JSON.stringify({ groups: state.groups, itemGlobal: state.itemGlobal }) |  | groups, itemGlobal | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| showClassroomSaveWarning | src/application/legacy-classroom-adapter.js:164 | error | DOM／状态副作用；需按调用场景确认 | String, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| runClassroomCommand | src/application/legacy-classroom-adapter.js:240 | description, operation, options | classroomCommands.run(description, operation, options) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| deferClassroomDefense | src/application/legacy-classroom-adapter.js:243 | promise, apply, isCurrent | void; void | isCurrent, apply, saveState, renderAll, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| useItem | src/application/legacy-classroom-adapter.js:258 | groupId, index | false; false; false; runClassroomCommand(     ${g.name} 使用道具：${ITEM_DEFS[key]?.name ／／ key},     (context) => {       e; true; false; true | isCommunismMode, closeItemWindowForFx, showToast, runClassroomCommand, ensureV2State, itemCommandSnapshot, Number, markItemUsedThisRoundV2177 | groups, inventory, name, itemEffect, groupUid, seasonId | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| legacyJudgeRound | src/application/legacy-classroom-adapter.js:373 | 无参数 | RoundSettlement.execute() |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| judgeRound | src/application/legacy-classroom-adapter.js:377 | 无参数 | false; false; true; accepted | themeAlert, runClassroomCommand, legacyJudgeRound | roundActive, evaluated, correctAns | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| validCandidate | src/ui/classroom-recovery.js:10 | source, raw | {         source,         data,         groups: data.groups.length,         score: data.groups.reduc; null | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| collect | src/ui/classroom-recovery.js:27 | 无参数 | false; true; candidates | validCandidate |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderCandidates | src/ui/classroom-recovery.js:73 | 无参数 | DOM／状态副作用；需按调用场景确认 | byId, String, preview |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scan | src/ui/classroom-recovery.js:92 | 无参数 | void | byId, collect, renderCandidates, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| preview | src/ui/classroom-recovery.js:105 | index | void | Number, byId | groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| restore | src/ui/classroom-recovery.js:118 | 无参数 | void; void | themeConfirm, byId, importClassroomData, setStatus, showToast |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| exportRaw | src/ui/classroom-recovery.js:139 | 无参数 | void; void | setStatus, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/classroom-recovery.js:167 | 无参数 | void | byId |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| validate | src/ui/classroom-feedback.js:20 | raw | {       schemaVersion: 1,       slots: [...slots],       pickEffects:         typeof raw.pickEffects | Error |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setOptions | src/ui/classroom-feedback.js:47 | next, { persist = true } = {} | getOptions() | validate, showToast, refreshSlots, syncSettings, stopClickVoice, cancel, getOptions |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getOptions | src/ui/classroom-feedback.js:62 | 无参数 | { ...options, slots: [...options.slots] } |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| allowed | src/ui/classroom-feedback.js:65 | 无参数 | p.motion !== "off" &&       !(         p.systemMotion && matchMedia("(prefers-reduced-motion: reduce | matchMedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| slotMarkup | src/ui/classroom-feedback.js:74 | kind, id = "", disabled = false | <div class="cf-score-slots" data-score-slots="${kind}" data-score-group="${Number(id) ／／ 0}" role=" | Number, Error |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSlots | src/ui/classroom-feedback.js:85 | 无参数 | DOM／状态副作用；需按调用场景确认 | slotMarkup | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| customHand | src/ui/classroom-feedback.js:97 | 无参数 | false; true | Number, showToast, handQuickScore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dialog | src/ui/classroom-feedback.js:107 | 无参数 | document.getElementById("classroomShowcase") |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancel | src/ui/classroom-feedback.js:110 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearTimeout, dialog |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dismiss | src/ui/classroom-feedback.js:123 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearTimeout, dialog, hideClassroomWindow |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| show | src/ui/classroom-feedback.js:135 | { type, title, subtitle, value, avatars = [] } | void; void; void; void | allowed, playSound, cancel, Number, String, dialog, getComputedStyle, setTimeout, dismiss |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| score | src/ui/classroom-feedback.js:218 | name, delta | void | show |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| picked | src/ui/classroom-feedback.js:227 | win, mode | void | parseStudentV218, show |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncSettings | src/ui/classroom-feedback.js:251 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| settings | src/ui/classroom-feedback.js:261 | 无参数 | DOM／状态副作用；需按调用场景确认 | Number, setOptions, cancel, syncSettings |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| allowClickSound | src/ui/classroom-feedback.js:315 | 无参数 | false; false; true |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopClickVoice | src/ui/classroom-feedback.js:325 | 无参数 | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| ownClickVoice | src/ui/classroom-feedback.js:334 | source, gain | DOM／状态副作用；需按调用场景确认 | stopClickVoice |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bindButtonSound | src/ui/classroom-feedback.js:344 | 无参数 | void | stopClickVoice, clearTimeout, setTimeout, playSound |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/classroom-feedback.js:367 | 无参数 | void | validate, bindButtonSound, cancel, dialog, dismiss, settings, refreshSlots, stopClickVoice, clearLive, matchMedia, allowed |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| candidates | src/ui/classroom-feedback.js:408 | frame | frame.id === "reelFrameGroup"       ? groups.map((g) => ({ group: g, raw: g.name }))       : groups. |  | picker, groups, members, id, name | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| rowMarkup | src/ui/classroom-feedback.js:422 | candidate, isGroup | isGroup       ? escapeHtml(candidate?.raw ／／ "待开奖")       : studentLabelHTMLV218(candidate?.raw ／／ " | escapeHtml, studentLabelHTMLV218 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearLive | src/ui/classroom-feedback.js:427 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| startLive | src/ui/classroom-feedback.js:435 | 无参数 | void; void; void | clearLive, allowed, candidates, rowMarkup |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| takeLive | src/ui/classroom-feedback.js:479 | frame | null; {       index: Math.floor(phase),       fraction: phase % 1,       rows: live.rows,       visibility | Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| enabled | src/ui/battle-motion.js:7 | 无参数 | currentView === "battle" &&       p.itemFx &&       p.motion !== "off" &&       !(         p.systemM | matchMedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mount | src/ui/battle-motion.js:18 | session, card | void | enabled, itemVisual, escapeHtml |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| show | src/ui/battle-motion.js:49 | kind, gid, key, label | void; void | enabled, String, clearTimeout, setTimeout, mount |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| restore | src/ui/battle-motion.js:138 | card, gid | DOM／状态副作用；需按调用场景确认 | String, mount |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| event | src/ui/battle-motion.js:152 | type, detail | DOM／状态副作用；需按调用场景确认 | show |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clear | src/ui/battle-motion.js:160 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| node | src/ui/item-modules.js:12 | tag, className, text | el |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| itemIcon | src/ui/item-modules.js:18 | item, className | wrapper | node, itemVisual |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| button | src/ui/item-modules.js:25 | text, action, className = "btn btn-sm" | el | node |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| mount | src/ui/item-modules.js:31 | host | void; void; void; void; void; { ...item, ...defs[item.key], key: item.key }; void; block; void; void; void; void | node, renderList, Error, refresh, announce, button, setTimeout, confirmReset, String, itemIcon, metadata, saveField, Number, renderEditor, fieldBlock, matchMedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| announce | src/ui/item-modules.js:136 | message, error = false | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| metadata | src/ui/item-modules.js:140 | item = {} | { ...item, ...defs[item.key], key: item.key } |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderList | src/ui/item-modules.js:144 | 无参数 | DOM／状态副作用；需按调用场景确认 | button, refresh, String, itemIcon, node |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveField | src/ui/item-modules.js:185 | field, value, input | DOM／状态副作用；需按调用场景确认 | renderList, announce, metadata |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| fieldBlock | src/ui/item-modules.js:203 | index, label, help, field, settings, numeric | void; block | node, String, announce, saveField, Number |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderEditor | src/ui/item-modules.js:249 | 无参数 | void; void; void; void | metadata, node, itemIcon, button, confirmReset, refresh, announce, renderEditor, String, fieldBlock, matchMedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refresh | src/ui/item-modules.js:434 | 无参数 | DOM／状态副作用；需按调用场景确认 | renderList, renderEditor |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| confirmReset | src/ui/item-modules.js:447 | message | themeConfirm(message, { title: "恢复道具默认设置", danger: true }); window.confirm(message) | themeConfirm |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| titleOwner | src/ui/tooltips.js:11 | target | target instanceof Element ? target.closest("[title]") : null |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getTooltip | src/ui/tooltips.js:15 | 无参数 | tooltip |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| removeDescription | src/ui/tooltips.js:27 | owner | void; void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dismiss | src/ui/tooltips.js:43 | 无参数 | void | clearTimeout, removeDescription |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| position | src/ui/tooltips.js:51 | 无参数 | void; void | cancel |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| suppressTitle | src/ui/tooltips.js:81 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshTitle | src/ui/tooltips.js:90 | 无参数 | void | suppressTitle, dismiss, position |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| release | src/ui/tooltips.js:108 | 无参数 | void | dismiss |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| reconcile | src/ui/tooltips.js:126 | 无参数 | void; void | release, getTooltip, suppressTitle, position, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancel | src/ui/tooltips.js:162 | 无参数 | DOM／状态副作用；需按调用场景确认 | release |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| render | src/ui/content-bank-editor.js:11 | 无参数 | void; void; void | $, getBank, E, edit, Number, themeConfirm, saveContentBank, Error |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| edit | src/ui/content-bank-editor.js:82 | kind, index = -1 | DOM／状态副作用；需按调用场景确认 | getSubject, getBank, $, E, String, Number, saveContentBank |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| organize | src/ui/settings-layout.js:29 | sections, shell, { query: $, escape: E } | box | E, group, $, marked |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| group | src/ui/settings-layout.js:30 | parent, id, title, description, nodes, collapsed = false, danger = false | box | E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finishWindowClose | src/ui/window-motion.js:6 | root | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelWindowClose | src/ui/window-motion.js:16 | root | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| dismissWindow | src/ui/window-motion.js:25 | root, finish | void; void | getPreferences, canAnimate, finish, getComputedStyle, animate, motionEase, finishWindowClose |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| settleDisclosure | src/ui/disclosure-motion.js:7 | details | void |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| settleDisclosures | src/ui/disclosure-motion.js:15 | 无参数 | DOM／状态副作用；需按调用场景确认 | settleDisclosure |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| setupDisclosures | src/ui/disclosure-motion.js:18 | 无参数 | void; void; void; void | canAnimate, getPreferences, settleDisclosure, animate, finish |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| icon | src/ui/desktop.js:45 | name | GodpowerTheme.icon(name, paths[name] ／／ paths.spark) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| empty | src/ui/desktop.js:48 | title, text | <div class="ui-empty">${icon("archive")}<h3>${E(title)}</h3><p>${E(text)}</p><button class="btn btn | icon, E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| persistPreferences | src/ui/desktop.js:51 | 无参数 | true; false | showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyPreferences | src/ui/desktop.js:63 | 无参数 | DOM／状态副作用；需按调用场景确认 | settleDisclosures, cancelSettingsMotion, String, canAnimate, cancelItemScoreAnimations, cancelScoreAnimationAndSync, cancelAnimations |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| canAnimate | src/ui/desktop.js:80 | 无参数 | preferences.motion !== "off" &&       !(         preferences.systemMotion &&         matchMedia("(pr | matchMedia |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| motionEase | src/ui/desktop.js:89 | 无参数 | getComputedStyle(document.documentElement)       .getPropertyValue("--motion-ease")       .trim() | getComputedStyle |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| animate | src/ui/desktop.js:94 | el, frames, options = {} | void; a | canAnimate, motionEase |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelAnimations | src/ui/desktop.js:106 | 无参数 | DOM／状态副作用；需按调用场景确认 | observeVisualState, cancelAnimationFrame, settleDisclosures, cancelSettingsMotion, clearCardFx, clearAttackHitFxV2116 |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| visualEvent | src/ui/desktop.js:125 | type, detail = {} | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncViewport | src/ui/desktop.js:133 | 无参数 | void | Number, getComputedStyle |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| viewChanged | src/ui/desktop.js:149 | name | void; void | cancelItemScoreAnimations, cancelScoreAnimationAndSync, $, String, cancelAnimations, animate, requestAnimationFrame, renderWelcome, selectSettings |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderWelcome | src/ui/desktop.js:225 | 无参数 | void; void; <button class="ui-group-card" data-group="${Number(g.id)}" style="--group-color:${/^#[a-f\d]{3,8}$/ | $, syncViewport, observeVisualState, canAnimate, Number, E, itemVisual, icon, empty, openItemWindow, requestAnimationFrame, renderDaily | groups, itemGlobal, id, name, score, color, inventory, itemEffect, booShield, booRoundsLeftV218, groupNo | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| updateArrows | src/ui/desktop.js:299 | 无参数 | void | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| observeVisualState | src/ui/desktop.js:309 | notify = true | DOM／状态副作用；需按调用场景确认 | visualEvent | groups, inventory, itemEffect, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderDaily | src/ui/desktop.js:351 | 无参数 | void; void | $, getSettlementHistory, E, itemVisual, String, Number, renderDaily |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| historyKind | src/ui/desktop.js:444 | desc = "" | /清零／恢复／撤销／回溯／删除/.test(desc)       ? ["danger", "shield", "数据与恢复"]       : /道具／攻击／龟壳／蘑菇/.test(desc)   |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| inventory | src/ui/desktop.js:455 | items | items         .map((i) => ${ITEM_DEFS[i.key]?.name ／／ i.key} ×${i.charges ?? 1})         .join("、" |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderHistory | src/ui/desktop.js:462 | 无参数 | void; void; void; <article class="ui-panel ui-history" data-kind="${kind}" style="--record-index:'${String(i + 1).pad; void | $, empty, historyKind, String, icon, E, inventory, animate, Number, themeConfirm, revertToHistory | name | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| renderArchives | src/ui/desktop.js:531 | 无参数 | void; <article class="ui-panel ui-archive-card"><details><summary class="ui-archive-summary"><span class= | getSettlementHistory, Number, $, E, icon, empty, animate, exportSingleSettlementCSV, deleteSettlementRecord, downloadJson | score, name, members, itemStats | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| downloadJson | src/ui/desktop.js:640 | value, name | DOM／状态副作用；需按调用场景确认 | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupSettings | src/ui/desktop.js:653 | 无参数 | void; <div class="ui-settings-row"><label for="${id}">${title}</label>${content}</div>; void | $, icon, installCommunismModeSetting, installSfxVolumeSliderV2176, installClearItemsSettingV2172, selectSettings, row, check, String, refreshSubjects, Number, persistPreferences, applyPreferences, renderDaily, downloadJson, saveContentBank, themeConfirm, renderBankEditor, installSettingsSafetyGuard | groups | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| row | src/ui/desktop.js:693 | title, id, content | <div class="ui-settings-row"><label for="${id}">${title}</label>${content}</div> |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveContentBank | src/ui/desktop.js:828 | candidate | DOM／状态副作用；需按调用场景确认 | $, refreshSubjects, renderDaily, renderBankEditor |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| installSettingsSafetyGuard | src/ui/desktop.js:848 | 无参数 | void; void; void | openPwdModal, themeConfirm | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshSubjects | src/ui/desktop.js:888 | 无参数 | void | $, E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelSettingsMotion | src/ui/desktop.js:908 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| revealSettings | src/ui/desktop.js:915 | entering | void; void; void | cancelSettingsMotion, canAnimate, $, animate |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| selectSettings | src/ui/desktop.js:956 | id, entering = false | void | $, String, renderBgmSlotList, renderFxSlotList, renderItemFxSoundListV26, revealSettings |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupDock | src/ui/desktop.js:986 | 无参数 | void | $, icon, E |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshLockControl | src/ui/desktop.js:1054 | button | void | icon, uiIconsV26 | isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupModals | src/ui/desktop.js:1105 | 无参数 | void; void; void; void | focusModal, cancelAnimations, forgetModal, String, Number, getComputedStyle, animate, canAnimate, stopConfetti, queueMicrotask, scan |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| focusModal | src/ui/desktop.js:1107 | top | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| forgetModal | src/ui/desktop.js:1128 | id | DOM／状态副作用；需按调用场景确认 | focusModal, cancelAnimations |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| scan | src/ui/desktop.js:1151 | 无参数 | DOM／状态副作用；需按调用场景确认 | forgetModal, String, Number, getComputedStyle, animate, canAnimate, stopConfetti, queueMicrotask, focusModal |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| clearPickerReveal | src/ui/desktop.js:1328 | 无参数 | DOM／状态副作用；需按调用场景确认 | $, restore |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelPickerPreparation | src/ui/desktop.js:1333 | 无参数 | DOM／状态副作用；需按调用场景确认 | clearPickerReveal, $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isPickerCurrent | src/ui/desktop.js:1350 | generation | generation === pickerGeneration &&       $("#pickerModal").classList.contains("active") | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| togglePicker | src/ui/desktop.js:1356 | 无参数 | false; true; slotEngine.isSpinning; false | stopSlotSpin, $, toggleSlotSpin, showToast |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickerStopped | src/ui/desktop.js:1383 | 无参数 | void; void; void; void | $, clearPickerReveal, isPickerCurrent, pickerChanged, canAnimate, complete, studentLabelHTMLV218, animate | picker, groups, name, members | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| pickerChanged | src/ui/desktop.js:1481 | 无参数 | DOM／状态副作用；需按调用场景确认 | pickerTargetGroup, animate, $ | groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupPicker | src/ui/desktop.js:1501 | 无参数 | DOM／状态副作用；需按调用场景确认 | $, pickerChanged |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| prepareSettlement | src/ui/desktop.js:1524 | 无参数 | DOM／状态副作用；需按调用场景确认 | $ |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelSettlement | src/ui/desktop.js:1529 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| settleFromUI | src/ui/desktop.js:1532 | button | { ok: false, reason: "busy" }; { ok: false, reason: "cancelled" }; result | $, requestAnimationFrame, confirmFinalSettlement |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/desktop.js:1567 | 无参数 | void; void; void | applyPreferences, syncViewport, matchMedia, canAnimate, cancelAnimations, cancelSettingsMotion, icon, setupDock, $, applyUiIconsV26, setupSettings, setupPicker, setupModals, setupDisclosures, animate, renderArchives, viewChanged, renderWelcome, renderHistory |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| status | src/ui/migration.js:16 | code, message | void | element |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refresh | src/ui/migration.js:22 | 无参数 | DOM／状态副作用；需按调用场景确认 | element, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| available | src/ui/migration.js:28 | staging | false; false; false; true | showToast, openPwdModal | isLocked, roundActive, evaluated | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| inspect | src/ui/migration.js:53 | 无参数 | void; void | available, refresh, status |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stage | src/ui/migration.js:79 | 无参数 | void | available, refresh, status |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| download | src/ui/migration.js:116 | 无参数 | void | setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/migration.js:127 | 无参数 | void | element, refresh |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setText | src/ui/welcome-v2.js:51 | id, value | DOM／状态副作用；需按调用场景确认 | $, String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| render | src/ui/welcome-v2.js:56 | 无参数 | void; <div class="gp-rank-row" role="listitem"><span class="gp-rank-index${medal}">${mask ? "—" : i + 1}< | $, realGroups, Number, ranking, setText, score, esc, syncRepeats, syncCruise | itemGlobal, id, name, score | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| stopCruise | src/ui/welcome-v2.js:132 | 无参数 | DOM／状态副作用；需按调用场景确认 | cancelAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cruiseAllowed | src/ui/welcome-v2.js:138 | 无参数 | !!(       started &&       preferences().groupCruise &&       canAnimate() &&       introFinished && | $, preferences, canAnimate |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncCruise | src/ui/welcome-v2.js:154 | 无参数 | void; void; void; void | syncRepeats, preferences, setText, $, String, cruiseAllowed, stopCruise, requestAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| tick | src/ui/welcome-v2.js:170 | now | void | cruiseAllowed, stopCruise, requestAnimationFrame |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| syncRepeats | src/ui/welcome-v2.js:195 | 无参数 | DOM／状态副作用；需按调用场景确认 | $, preferences, canAnimate |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupCruise | src/ui/welcome-v2.js:236 | 无参数 | DOM／状态副作用；需按调用场景确认 | $, syncCruise, stopCruise, preferences |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| isolateBackground | src/ui/welcome-v2.js:280 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| releaseBackground | src/ui/welcome-v2.js:292 | 无参数 | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| activeIntro | src/ui/welcome-v2.js:296 | 无参数 | started && introOpened && !$("gpIntro").hidden | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| focusIntro | src/ui/welcome-v2.js:299 | 无参数 | DOM／状态副作用；需按调用场景确认 | activeIntro, $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| showIntro | src/ui/welcome-v2.js:305 | replay | void; void | getComputedStyle, showToast, $, isolateBackground, resetPointer, drawSlide, stopCruise, cancelAnimationFrame, requestAnimationFrame, canAnimate, finish, focusIntro |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| drawSlide | src/ui/welcome-v2.js:348 | px | DOM／状态副作用；需按调用场景确认 | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| resetPointer | src/ui/welcome-v2.js:356 | 无参数 | DOM／状态副作用；需按调用场景确认 | $ |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| finish | src/ui/welcome-v2.js:364 | skip | void; void; void; void | settleEntrance, resetPointer, cancelAnimationFrame, $, canAnimate, preferences, releaseBackground, syncCruise, settle, Number, getComputedStyle, movement |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setupSlider | src/ui/welcome-v2.js:515 | 无参数 | void; void; void; void | $, drawSlide, fromEvent, resetPointer, Number, finish, activeIntro, focusIntro |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| preferencesChanged | src/ui/welcome-v2.js:594 | 无参数 | void | canAnimate, preferences, activeIntro, finish, syncCruise |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| viewChanged | src/ui/welcome-v2.js:602 | name | void | activeIntro, finish, stopCruise, syncCruise |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/welcome-v2.js:608 | 无参数 | void | $, encodeURIComponent, setupSlider, setupCruise, preferencesChanged, finish, showIntro, settleEntrance, syncCruise, resetPointer, drawSlide, activeIntro, stopCruise, render |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| moveIntoGrid | src/ui/home-dashboard.js:71 | 无参数 | null; grid; grid |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| defaultLayout | src/ui/home-dashboard.js:89 | 无参数 | () => home-card-${++sequence}; root.HomeLayout.createDefaultLayout(       "home-default",       "默认布局",       catalog,       create |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| completeLegacyLayout | src/ui/home-dashboard.js:102 | layout | root.HomeLayout.validateLayout(layout) |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| createToolbar | src/ui/home-dashboard.js:118 | grid | toolbar; toolbar |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setStatus | src/ui/home-dashboard.js:139 | message, kind = "info" | void | clearTimeout, setTimeout |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| setToolbarMode | src/ui/home-dashboard.js:152 | isEditing | DOM／状态副作用；需按调用场景确认 | setStatus, renderEditorControls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderEditorControls | src/ui/home-dashboard.js:174 | 无参数 | void; void | renderAddPanel |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| renderAddPanel | src/ui/home-dashboard.js:191 | 无参数 | void; void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshDraft | src/ui/home-dashboard.js:224 | 无参数 | DOM／状态副作用；需按调用场景确认 | applyLayout, renderEditorControls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| beginEdit | src/ui/home-dashboard.js:229 | 无参数 | void | setToolbarMode |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancelEdit | src/ui/home-dashboard.js:239 | 无参数 | void | applyLayout, setToolbarMode, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| saveEdit | src/ui/home-dashboard.js:247 | 无参数 | void; void | setStatus, applyLayout, setToolbarMode |  | 高 | NOT TESTED（单个实现；集成覆盖另列） |
| resetDraft | src/ui/home-dashboard.js:269 | 无参数 | void | defaultLayout, refreshDraft, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| toggleAddPanel | src/ui/home-dashboard.js:280 | 无参数 | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onToolbarClick | src/ui/home-dashboard.js:287 | event | void; void | refreshDraft, beginEdit, toggleAddPanel, resetDraft, cancelEdit, saveEdit |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onAddCardClick | src/ui/home-dashboard.js:322 | event | void | refreshDraft, setStatus |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onGridClick | src/ui/home-dashboard.js:331 | event | void; void; void; void; void | refreshDraft |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onGridKeydown | src/ui/home-dashboard.js:366 | event | void; void | refreshDraft |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onGridPointerDown | src/ui/home-dashboard.js:395 | event | void; void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onDocumentPointerMove | src/ui/home-dashboard.js:419 | event | void |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onDocumentPointerUp | src/ui/home-dashboard.js:429 | event | void; void | refreshDraft |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| onEscape | src/ui/home-dashboard.js:457 | event | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| bindLegacyNodes | src/ui/home-dashboard.js:469 | grid | DOM／状态副作用；需按调用场景确认 |  |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| applyLayout | src/ui/home-dashboard.js:516 | grid, layout | void | String |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| refreshCards | src/ui/home-dashboard.js:548 | 无参数 | void | bindLegacyNodes, applyLayout, renderEditorControls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| init | src/ui/home-dashboard.js:555 | 无参数 | void; void | moveIntoGrid, createToolbar, bindLegacyNodes, applyLayout, defaultLayout, completeLegacyLayout, renderEditorControls |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| notify | src/core/picker-bridge.js:6 | next | snapshot | getSnapshot, listener |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| currentResult | src/core/picker-bridge.js:14 | 无参数 | null; null; { id: resultId, mode: state.picker.mode, groupId: group.id, groupName: group.name,       groupNo: gr | parseStudentV218 | picker, groups, id | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| getSnapshot | src/core/picker-bridge.js:30 | 无参数 | { protocolVersion: 1, theme: window.GodpowerTheme?.get() ／／ 'classic', phase: !slotEngine.isSpinning | currentResult, matchMedia | picker, groups, id, name, color, members, score, itemGlobal, isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| cancel | src/core/picker-bridge.js:48 | 无参数 | notify('cancelled') | clearInterval, stopRollLoop, resetSlotDisplay, notify |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| command | src/core/picker-bridge.js:54 | action, payload = {} | { ok: true }; { ok: true, phase: getSnapshot().phase }; { ok: false, error: 'BUSY' }; { ok: slotEngine.isSpinning, error: slotEngine.isSpinning ? undefined : 'NOT_STARTED' }; { ok: false, error: 'INVALID_MODE' }; { ok: false, error: 'INVALID_VALUE' }; { ok: false, error: 'INVALID_GROUP' }; { ok: false, error: 'LOCKED' }; { ok: false, error: 'STALE_RESULT' }; { ok: false, error: 'INVALID_SCORE' }; { ok: false, error: 'BUSY' }; { ok: false, error: 'UNKNOWN_COMMAND' }; { ok: true, persisted: !window.classroomUnsavedChanges } | cancel, stopSlotSpin, getSnapshot, notify, openPickerModal, setPickerMode, saveState, toggleAntiRepeat, toggleGroupPreselect, resetPickerPool, currentResult, applyScoreDelta, syncPickerScoreTarget | groups, id, isLocked | 中 | NOT TESTED（单个实现；集成覆盖另列） |
| install | src/ui/electron-windows.js:5 | 无参数 | void | sync |  | 中 | NOT TESTED（单个实现；集成覆盖另列） |

## 存储键

- `godpower_active_classroom_context_v1`
- `godpower_appearance_v1`
- `godpower_classroom_roster_v1`
- `godpower_home_layout_v1`
- `godpower_item_modules_v1`
- `godpower_migration_v2_receipt`
- `godpower_recovery_before_import_v2`
- `godpower_score_feedback_v1`
- `godpower_state_v1`
- `godpower_state_v2`
- `godpower_teaching_resources_v1`
- `godpower_teaching_schedule_v1`
- `godpower_ui_bank_v1`
- `godpower_ui_preferences_v1`
- `politics_admin_pin`
- `politics_audio_migration_v2`
- `politics_bgm_volume`
- `politics_column_mode`
- `politics_communism_mode`
- `politics_groups_data`
- `politics_history_stack_v26`
- `politics_history_v26`
- `politics_item_global`
- `politics_item_icons`
- `politics_master_volume`
- `politics_menu_audio_cfg`
- `politics_picker_state`
- `politics_resizer_enabled`
- `politics_resizer_height`
- `politics_save_allin`
- `politics_settlement_history`
- `politics_sfx_volume`
- `politics_ui_icons_v26`
- `politics_wall_veil`
- `politics_zoom_level`

## 动画

- `attackHitBadgeV2116`
- `bmBurst`
- `bmFlame`
- `bmMist`
- `bmStrike`
- `bmSweep`
- `bmTurn`
- `bounceTrophy`
- `cardFxBadge`
- `cardFxFrame`
- `cardFxSweep`
- `cardHeal`
- `cardHitFlash`
- `cardHitShake`
- `cardShield`
- `cf-avatar-arrive`
- `cf-name`
- `cf-orbit`
- `cf-spark`
- `cfxBomb`
- `cfxBoo`
- `cfxBoomerangV282`
- `cfxBoost`
- `cfxBulletCard`
- `cfxCoin`
- `cfxFeatherV282`
- `cfxFireFlowerV282`
- `cfxGiantCard`
- `cfxHammer`
- `cfxHorn`
- `cfxIceFlowerV282`
- `cfxImpact`
- `cfxInkCard`
- `cfxKick`
- `cfxLightning`
- `cfxLockPulse`
- `cfxPowerCard`
- `cfxRise`
- `cfxSkid`
- `cfxStarCard`
- `goldShimmer`
- `gp-content-reveal`
- `gp-nav-reveal`
- `grandScaleUp`
- `handCapsulePulse`
- `handCrystalFloat`
- `handEffectInV218`
- `handIconFloat`
- `handRevealV24`
- `hitBananaSweepV2116`
- `hitBananaV2116`
- `hitBombFlashV2116`
- `hitBombV2116`
- `hitBoomerangSweepV2116`
- `hitBoomerangV2116`
- `hitFireFlashV2116`
- `hitFireV2116`
- `hitGreenRingV2116`
- `hitGreenShellV2116`
- `hitHammerFlashV2116`
- `hitHammerV2116`
- `hitHornV2116`
- `hitHornWaveV2116`
- `hitIceFlashV2116`
- `hitIceV2116`
- `hitLightningFlashV2116`
- `hitLightningV2116`
- `hitRedLockV2116`
- `hitRedShellV2116`
- `hitSpinyFlashV2116`
- `hitSpinyV2116`
- `iceLockBlueGlowV2114`
- `itemBombHit`
- `itemDeltaFloatV21730`
- `itemMega`
- `itemPop`
- `itemRainbow`
- `itemReveal`
- `itemRouletteRevealFlat`
- `itemUseBannerV216`
- `megaOrangeGlowV2113`
- `pcFadeIn`
- `pcPopIn`
- `queuePromoteV2120`
- `roster-apply-backdrop-in`
- `roster-apply-card-in`
- `roster-avatar-arrive`
- `rouletteEnter`
- `rouletteReveal`
- `rouletteRevealRing`
- `rouletteRevealRingLeftV281`
- `rouletteRing`
- `rouletteSwap`
- `rouletteSweep`
- `scoreRollNewV21730`
- `scoreRollOldV21730`
- `shakeTremor`
- `teaching-resource-arrive`
- `teaching-resource-modal-enter`
- `teaching-resource-modal-exit`
- `themeDialogInV21727`
- `ui-menu-reveal`
- `v213AuraBreath`
- `v213IceAura`
- `v213MegaAura`
- `v213PowerAura`
- `v213StarAura`
- `v2162RouletteReveal`

## 静态及模板事件入口

- `${commands[kind](n)}`
- `ClassroomFeedback.customHand()`
- `ClassroomFeedback.dismiss()`
- `DesktopUI.settleFromUI(this)`
- `DesktopUI.togglePicker()`
- `addGroup()`
- `applyBatchImport()`
- `applyQuickPersonCustomV218()`
- `applySettingsBatchMembers()`
- `batchSelectOption('A')`
- `batchSelectOption('B')`
- `batchSelectOption('C')`
- `batchSelectOption('D')`
- `batchToggleAllIn()`
- `battleBpmChange(\`
- `changeWallpaperVeil(this.value)`
- `chooseItemIcon(`
- `chooseUiIconV26(`
- `clearAllItemsV2172()`
- `clearHistoryStack()`
- `closeAbout()`
- `closeBatchImportModal()`
- `closeGrandSettlementModal()`
- `closeHandRaise()`
- `closeItemWindow()`
- `closeMemberSearchModal()`
- `closePickerModal()`
- `closePwdModal()`
- `closeQuickPersonScoreV218()`
- `closeScoreModal()`
- `closeSettlementNameModal()`
- `deleteBgmTrack(`
- `deleteFxCandidate(this.dataset.fxRemove)`
- `deleteFxTrack(`
- `deleteItemDetailGroup(${g.id})`
- `document.getElementById(`
- `enterBattleFromWelcome()`
- `event.stopPropagation()`
- `event.stopPropagation();openItemWindow(${g.id},`
- `exportAudioBundle()`
- `exportData()`
- `exportFxBundleV2175()`
- `exportItemIconPack()`
- `exportLatestSettlementCSV()`
- `finishHandItemReward()`
- `forceEndRound()`
- `globalItemDraw()`
- `godAddItem(${g.id},`
- `godAddItemV283(${gid},`
- `godAddQueueItemV2120(${g.id},`
- `godClearItems(${g.id})`
- `godClearQueueItemsV2120(${g.id})`
- `handDrawItem()`
- `handQuickScore(1)`
- `handQuickScore(2)`
- `handQuickScore(5)`
- `handUseAllTripleV218()`
- `handUseItem()`
- `handUseNewItem()`
- `handUseOneV218()`
- `handUsePrimaryV214()`
- `handleBundleFilePicked(event)`
- `handleFileImport(event)`
- `handleItemIconUpload(`
- `handleItemIconUpload(event)`
- `handleMainAction()`
- `handleMemberSearchKey(event)`
- `handleModalKey(event)`
- `handlePwdKey(event)`
- `handleScoreInputKey(event,${g.id})`
- `handleSoundFileUpload(event)`
- `if(event.target===this)closeQuickPersonScoreV218()`
- `importItemIconPack(event)`
- `itemCustomScore(${g.id})`
- `judgeHandRaise(false)`
- `judgeHandRaise(true)`
- `menuBpmChange(this.value)`
- `menuEnabledChange(this.checked)`
- `menuLoopChange(\`
- `menuMeterChange(this.value)`
- `menuTrimChange(\`
- `nextRound()`
- `onWallpaperFile(this)`
- `openAbout()`
- `openHandRaise()`
- `openItemEncyclopedia()`
- `openMemberSearchModal()`
- `openPickerModal()`
- `playSound(`
- `previewBgmTrack(`
- `previewItemDetailColorV21716(this.value)`
- `renderAbout('guide')`
- `renderAbout('info')`
- `renderAbout('items')`
- `renderBgmSlotList()`
- `renderItemWindow()`
- `renderQuickPersonListV218()`
- `resetAllItemIcons()`
- `resetAllScores()`
- `resetItemIcon(`
- `resetPickerPool()`
- `resetUiIconV26(`
- `resetWallpaper()`
- `saveItemDetailColor(${g.id},this.value)`
- `saveItemGroupDetail(${g.id})`
- `scorePickerCustom()`
- `searchMemberGroups()`
- `selectGroupOpt(${g.id},`
- `selectGroupPresetColorV21716(${g.id},`
- `selectHandGroup(${g.id})`
- `setCorrectAns('A')`
- `setCorrectAns('B')`
- `setCorrectAns('C')`
- `setCorrectAns('D')`
- `setPickerInfoTab('history')`
- `setPickerInfoTab('stats')`
- `setPickerMode('group')`
- `setPickerMode('individual')`
- `setPickerMode('two_tier')`
- `showSettingsV2(`
- `showSettingsV26(`
- `startDirectScoreEdit(${g.id})`
- `submitModalCustomScore()`
- `submitPassword()`
- `switchItemTab('detail')`
- `switchItemTab('items')`
- `switchItemTab('score')`
- `switchView(`
- `switchView('archives')`
- `switchView('archives'); closeGrandSettlementModal();`
- `switchView('battle')`
- `switchView('history')`
- `switchView('settings')`
- `switchView('welcome')`
- `toggleAllInCard(${g.id})`
- `toggleAntiRepeat(this.checked)`
- `toggleGroupPreselect(`
- `toggleLock()`
- `toggleQPSetV218(`
- `toggleQuickPersonV218(`
- `toggleResizerEnabled(this.checked)`
- `toggleSaveAllIn(this.checked)`
- `triggerFinalSettlement()`
- `triggerImport()`
- `triggerImportAudioBundle()`
- `triggerUploadAudio(`
- `undoLast()`
- `updateAdminPin()`
- `updateBgmVolume(this.value)`
- `updateColumnMode(this.value)`
- `updateMasterVolume(this.value)`
- `updateSfxVolumeV2176(this.value)`
- `useItem(${g.id},${i})`
- `useItem(${g.id},0)`
- `zoomIn()`
- `zoomOut()`
- `zoomReset()`