# F1 Classroom Identity Foundation Implementation Plan

> **For agentic workers:** Execute each task in order. Steps use checkbox syntax for tracking.

**Goal:** Add stable local teacher, classroom, and student identity plus profile-scoped roster assignments without replacing or mutating the legacy competition state.

**Architecture:** Keep pure roster rules in the domain layer and a separate revisioned local repository in infrastructure. Migration is a preview/projection only; existing `groups[].members` stays intact and remains the active compatibility source.

**Tech Stack:** Existing ES modules bundled into offline single-file HTML; Node native test runner; injected storage fake; Chromium at 1920×1080, DPR 1.

**Spec:** `docs/superpowers/specs/2026-10-21-f1-classroom-identity-design.md`

## Global Constraints

- Do not change scoring, ranking, items, undo, archive, picker, audio, or competition card geometry.
- Do not merge students by name or overwrite legacy roster fields.
- Do not claim cloud authentication or cross-device synchronization.
- Do not switch production classroom storage authority.
- Bump visible/internal app version together after the implementation is integrated.
- Preserve offline, single-file HTML and sync only from the committed HTML source.

## Review Focus

- Duplicate student labels in old groups remain distinct entities; migration must not merge them.
- Cross-profile assignments cannot leak or mutate one another.
- Individual mode must not require a group assignment.
- Malformed references and duplicate stable IDs are rejected before writes.
- Storage/quota/readback/CAS failures preserve both the old classroom and prior roster document.

---

### Task 1: Stable identity constructors

**Files:**

- Modify: `src/domain/identity.js`
- Test: `tests/unit/stable-identity.test.mjs`

**Interfaces:** add `createUserProfileId`, `createClassroomId`, `createStudentUid` and matching validators. Preserve all existing factory output prefixes and validation.

- [x] Add tests for valid prefixed IDs and collision-free `assignStudentUids` on copied legacy entries.
- [x] Run the stable identity unit test and observe failure.
- [x] Implement only the new factories/validator; do not change group/item/season IDs.
- [x] Run `node --test tests/unit/stable-identity.test.mjs`.

### Task 2: Pure roster domain and migration projection

**Files:**

- Create: `src/domain/classroom-roster.js`
- Modify: `src/manifest.json`
- Test: `tests/unit/classroom-roster.test.mjs`

**Interfaces:** export `validateRosterDocument(doc)`, `createRosterDocument(input)`, `previewLegacyRoster({classroomId,userProfileId,groups,idFactory})`, and `projectLegacyMembers({groups,document,userProfileId,classroomId})`.

- [x] Add tests covering duplicate names, rename/reorder, invalid group/classroom reference, individual mode, profile isolation, frozen source immutability, and deterministic factory injection.
- [x] Run `node --test tests/unit/classroom-roster.test.mjs` and observe failure.
- [x] Implement schema version 1 validation and pure preview/projection according to the spec.
- [x] Add module to the source manifest in dependency order.
- [x] Run roster and identity tests.

### Task 3: Isolated roster repository

**Files:**

- Create: `src/infrastructure/classroom-roster-repository.js`
- Modify: `src/manifest.json`
- Test: `tests/unit/classroom-roster-repository.test.mjs`

**Interfaces:** `createClassroomRosterRepository({storage,key,makeId})` exposes `read()`, `write(document,{expectedRevision})`, and `previewMigration(input)`; successful writes return `{ok:true,revision,document}`, errors return `{ok:false,code}`.

- [x] Add tests for absent document, write/readback, stale revision, quota exception, readback corruption, and proof that the legacy storage key is untouched.
- [x] Run the new repository tests and observe failure.
- [x] Implement versioned JSON storage, validation, CAS revision check, and readback verification; never clear data.
- [x] Add source module to manifest and test all new unit tests.

### Task 4: F0/F1 docs and versioned release sync

**Files:**

- Update: `docs/v3/F0-handoff-audit-2026-10-21.md`
- Update: `docs/v3/IMPLEMENTATION_LOG.md`
- Update: version metadata in `package.json`, `src/script/00.js` (visible app version), Electron package/BUILD_INFO after HTML commit.
- Test: `tests/e2e/battle-layout.mjs`, `npm test`, `npm run check`, Electron bundle/smoke.

- [x] Record final test evidence and any deferred F1 UI integration.
- [x] Bump version metadata consistently to 3.0.33 and build the standalone HTML.
- [x] Run unit/integration and Chromium layout test at exactly 1920×1080 DPR 1.
- [x] Commit the HTML phase; sync that exact HTML commit into Electron, verify SHA/build/smoke, then commit Electron.

## Self-review

- This is a bounded F1 foundation, not a claim that the complete 20-item roadmap is finished.
- Profile/roster UI, data import wizard, avatars, schedules, and individual scoring are deferred to later F1/F2 tasks and stay OPEN in the backlog.
- No unresolved interface names or rule calculations are delegated to guesswork.
