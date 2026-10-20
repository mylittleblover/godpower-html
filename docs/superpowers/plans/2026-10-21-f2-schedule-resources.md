# F2 Schedule and Subject Resources Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Each task ends with its own test and commit.

**Goal:** Add offline weekly class schedules and a safe, profile-scoped subject resource library without changing competition state.

**Architecture:** Pure domain validators determine schedule/resource validity. Separate repositories own schedule metadata and resource Blobs. The teaching workspace UI reads those repositories and never writes competition state.

**Tech Stack:** Browser JavaScript, localStorage CAS for small schedules, IndexedDB for file Blobs, Chromium/Playwright, Node tests.

**Spec:** `docs/superpowers/specs/2026-10-21-f2-schedule-resources-design.md`

## Global Constraints

- Browser-only/offline operation; no CDN, API, or development server dependency.
- The contest remains authoritative in `godpower_state_v2`; F2 never edits it.
- Weekly schedules reject overlaps and cross-midnight ranges.
- Allowed files are PDF, TXT, JSON, PNG, JPEG, and WebP; reject active content and unknown types.
- Maximum file size is 20 MiB; storage quota errors remain visible and cannot delete existing data.
- UI target is Chromium 1920×1080 @1x only; no CircleCI operation.
- Update package, visible, internal and Electron versions together after a release slice.

## Review Focus

- Duplicate or missing classroom IDs must fail before persistence.
- Daylight/time-of-day comparison must use local wall-clock minutes and must not implicitly change the contest.
- File extension and declared MIME can disagree; validation must reject mismatches before reading large data.
- A quota failure during import must leave all pre-existing resources retrievable.
- Preview close must revoke generated object URLs and not retain Blob references.

---

### Task 1: Weekly schedule domain and repository

**Files:**

- Create: `src/domain/teaching-schedule.js`
- Create: `src/infrastructure/teaching-schedule-repository.js`
- Modify: `src/index.template.html`, `src/manifest.json`
- Test: `tests/unit/teaching-schedule.test.mjs`

**Interfaces:** `TeachingSchedule.validateDocument(input)`, `findCurrentLesson(document, profileId, weekday, minuteOfDay)`. Repository `read()` and `write(document, {expectedRevision})` return structured success/failure results.

- [x] Write failing cases for malformed IDs, weekday/time boundaries, overlap, current lesson selection and stable ordering.
- [x] Run `node --test tests/unit/teaching-schedule.test.mjs` and confirm expected missing-module failures.
- [x] Implement schemaVersion 1 pure model and CAS repository under `godpower_teaching_schedule_v1`.
- [x] Verify invalid writes, conflicts and storage errors leave old bytes unchanged.
- [x] Run tests, format and build; commit schedule foundation with the UI milestone.

### Task 2: Teacher schedule UI

**Files:**

- Create/modify: `src/ui/teaching-workspace.js`
- Modify: `src/ui/desktop.js`, `src/ui/desktop.css`, `src/index.template.html`, `src/manifest.json`
- Test: `tests/e2e/teaching-workspace.mjs`

**Interfaces:** Mount in settings' student/classroom area using the selected local profile and roster classroom IDs. Editing stays local and is explicitly saved.

- [x] Add E2E for empty state, create/edit/delete schedule slot, overlap rejection, reload, today suggestion and explicit select.
- [x] Verify initial E2E fails because schedule workspace is absent.
- [x] Render weekday/time/subject/optional note fields; surface the current lesson as a suggestion requiring a click.
- [x] Verify active lesson selection changes only the teaching-context key and byte-for-byte preserves `godpower_state_v2`.
- [x] Run Chromium 1920×1080 and capture a screenshot; commit schedule UI.

### Task 3: Resource metadata validation and isolated Blob repository

**Files:**

- Create: `src/domain/teaching-resource.js`
- Create: `src/infrastructure/teaching-resource-repository.js`
- Modify: `src/index.template.html`, `src/manifest.json`
- Test: `tests/unit/teaching-resource.test.mjs`

**Interfaces:** Validate safe metadata and file signatures before storage. Repository imports a fully preflighted batch, uses IndexedDB database `godpower_teaching_resources_v1`, verifies readback and hash, and returns errors without partial success.

- [x] Add failing tests for MIME/extension mismatch, active content, size boundary, metadata, digest duplicates and rollback.
- [x] Verify RED, then implement validation and repository APIs.
- [x] Test absent IndexedDB, transaction abort, quota exception and duplicate content.
- [x] Run unit suite and commit resource repository.

### Task 4: Resource library UI and Electron sync

**Files:**

- Modify: `src/ui/teaching-workspace.js`, `src/ui/desktop.css`, `src/ui/desktop.js`
- Create: `tests/e2e/teaching-resource-library.mjs`
- Modify: `package.json`, `docs/ARCHITECTURE.md`, `docs/DATA_SCHEMA.md`, `docs/MAINTENANCE_BACKLOG.md`, `docs/v3/IMPLEMENTATION_LOG.md`
- Modify: Electron generated bundle and validation record after HTML commit.

- [x] Verify import/search/filter/text preview/download/delete/backup export/restore flows.
- [x] Verify image/PDF validation, object URL cleanup and invalid import preserves existing resources.
- [x] Capture final resource library screenshot and rerun complete acceptance after version bump.
- [x] Run HTML unit, resource E2E, Chromium 1920×1080, build checks and Electron bundle/smoke/desktop tests.
- [x] Record file:// blocked by managed Chromium policy, Windows NOT TESTED and no CircleCI operation.
- [ ] Commit HTML and Electron sync separately and push both development branches.
