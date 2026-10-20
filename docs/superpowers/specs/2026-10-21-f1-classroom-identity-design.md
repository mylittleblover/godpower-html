# F1 Classroom Identity and Roster Foundation

## Status and context

This design resolves the F1 requirements in the 2026-10-21 replacement handoff and original feature requirements. The user has authorized direct implementation and asks that ambiguous points be resolved using the recommended compatibility-first choice. The implementation remains additive; it does not switch the classroom persistence authority.

## Goals

- Give local teacher/workspace profiles stable identities.
- Represent a classroom roster independently from competition groups.
- Represent teacher-specific group assignments against stable student IDs.
- Allow individual mode without forcing students into groups.
- Preserve legacy `groups[].members` behavior and data exactly during rollout.
- Provide reversible migration/projection functions with deterministic tests.

## Non-goals for this stage

- Cloud accounts, authentication, cross-device roster sync, or simultaneous multi-writer editing.
- Replacing the current classroom state or production storage with IndexedDB.
- Changing scoring, ranking, item, undo, archive, picker, or 14-group card behavior.
- Migrating existing names into shared identities by fuzzy name matching.
- Introducing image uploads before the existing resource/backup policy is defined.

## Recommended model

Use a versioned profile/roster document stored separately from the authoritative competition snapshot:

```js
{
  schemaVersion: 1,
  profiles: [{ userProfileId, displayName, subjectId, createdAt }],
  classrooms: [{ classroomId, name, studentIds: [] }],
  students: [{ studentUid, classroomId, displayName, number, avatarResourceId }],
  assignments: [{ userProfileId, classroomId, mode, groupAssignments: [{ studentUid, groupUid }] }]
}
```

The actual domain API uses validated constructors and immutable projections. IDs are opaque stable strings. Names and student numbers are display data and never serve as identity keys. In group mode an assignment may contain zero or one group per student; in individual mode the assignment list is empty and students remain participants independently. A student must belong to the referenced classroom; a group reference must match a current stable `groupUid` before it can be projected.

## Compatibility and storage

The first implementation adds pure domain functions and a separate local repository adapter. It does not automatically write into existing `godpower_state_v2`, does not mutate groups, and does not delete any key. A migration preview derives a candidate profile/roster document from a copy of legacy group data. Duplicate names are not merged; each legacy membership gets a new `studentUid` unless a future explicit import mapping exists. Projection to `groups[].members` is read-only and returns copies. Once integrated, old consumers keep receiving the same member strings through the adapter.

The repository writes a versioned roster payload using write/readback verification and compare-and-swap revision. On quota/security/readback failure, source and previous target bytes remain unchanged and the operation returns a structured error. A later phase may connect profile selection to active class context; it must not occur until this adapter is exercised against import, undo, reload, and old backup paths.

## Boundaries

- `src/domain/classroom-roster.js`: schema validation, student/profile/assignment operations, migration preview, compatibility projection; pure and deterministic.
- `src/infrastructure/classroom-roster-repository.js`: storage adapter with revision checking and readback; no DOM or UI.
- `src/domain/identity.js`: add stable `userProfileId`, `classroomId`, and `studentUid` factories/validators without changing existing ID factories.
- `tests/unit/classroom-roster.test.mjs`: legacy duplicates, invalid references, individual mode, immutability, profile assignment isolation, deterministic migration.
- `tests/unit/classroom-roster-repository.test.mjs`: success/readback/quota/conflict rollback in an injected storage fake.

## Error behavior

Invalid input is rejected before persistence. Storage failures are surfaced and do not imply success. Duplicate IDs and cross-classroom references are hard errors. Legacy names remain valid as display labels, including Unicode, whitespace after normalization, and repeated names; stable identity is never inferred from a label.

## Migration rollout

1. Add and test pure domain model.
2. Add a repository under a separate key and verify its round trip in isolated storage.
3. Add a migration preview/export artifact; do not auto-commit migration or alter groups.
4. Later integrate a teacher profile picker and assignment UI only after a dedicated backup/import/undo regression gate.
5. Retire `groups[].members` only in a future explicit migration after all readers/writers are mapped and rollback is demonstrated.

## Acceptance

- Existing 272 unit/integration tests remain green.
- New roster tests prove student IDs survive rename/reorder, group assignment is profile-scoped, and individual mode has no required group.
- Failure injection proves migration preview and repository failures do not change the legacy source.
- Chromium E2E remains at 1920×1080 DPR 1; battle layout still fits all 14 groups.
- HTML file build remains self-contained. Electron receives the same HTML after source commit and passes bundle/smoke checks.
