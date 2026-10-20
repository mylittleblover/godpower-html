# V3 Handoff F0 Evidence Audit — 2026-10-21

## Baseline

- HTML repository: `feat/v3-foundation-sp01-sp02`, HEAD `18f4b0106129f0daa423fa47fab149d433bc9c3a` (3.0.32).
- Electron repository: `feat/v3-foundation-sp01-sp02`, HEAD `b0dd351` (3.0.32; full SHA recorded by Git in that repository).
- Worktrees were clean at handoff start; Electron's pre-existing untracked `artifacts/` screenshots and DOM captures were preserved.
- The nine ZIP files listed in the Drive folder were downloaded; all nine passed `unzip -t` CRC validation. Eight native Google Docs were read in full through the connected Drive document reader. The older 2026-10-19 ZIP is absent; the replacement v2.1 handoff is authoritative for routing/precedence.
- Source/design authority: user's direct instructions in this conversation > current repository and repeatable tests > latest replacement v2.1 > older summaries. A document's “approval required” line is superseded by the user's explicit instruction to proceed and choose recommendations for ambiguities.

## Repeatable evidence collected before F1

| Area                      | Evidence                                                      | Result                                                                            |
| ------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Unit/integration          | `npm test`                                                    | PASS, 272/272                                                                     |
| Battle geometry           | `node tests/e2e/battle-layout.mjs`, Chromium 1920×1080, DPR 1 | PASS, 14 groups fit                                                               |
| Plugin platform lifecycle | `node tests/e2e/plugin-platform.mjs`                          | PASS; install/permission/activate/navigation/deactivate/uninstall, no page errors |
| Miyamoto workspace        | `node tests/e2e/miyamoto-plugin.mjs`                          | PASS                                                                              |
| Item rules                | `npm run test:item-modules` in prior 3.0.32 delivery          | PASS; 26 item rules and seeded draw compatibility                                 |
| Archive integrity         | all nine downloaded ZIPs `unzip -t`                           | PASS                                                                              |
| Electron native Windows   | no Windows host used in this environment                      | NOT TESTED                                                                        |

The above does not certify every R01–R20 feature. Statuses below distinguish existing capabilities from new requested behavior.

## F1 slice verification (3.0.33)

- `npm test`: PASS, 284/284.
- `npm run build`: PASS, standalone `dist/godpower.html`, 8,065,192 bytes, SHA-256 `664ee78bba4847972399e7d39fb07cc1b978c0599718d7070837dc5700efc5cd`.
- `npm run check`: PASS; 104 built script blocks parse, all 27 original embedded resources remain, 137 template blocks match the source manifest, visible/runtime/package versions match 3.0.33, and layer boundaries pass.
- `npm run format:check`: PASS.
- `npm run audit:hygiene`: PASS with no source-manifest issues after including untracked non-ignored worktree files.
- Chromium 1920×1080 @1x: 14-group fit PASS; plugin lifecycle PASS; Miyamoto 26-item workspace/settings compatibility PASS; no page errors.
- No UI screenshot baseline was overwritten. Native Windows and full profile-selection UI remain NOT TESTED.

## R01–R20 traceability

| ID  | Requirement                                               | Current evidence                                                                                                     | Status         | Risk / next stage                                               |
| --- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------- |
| R01 | Multiple teacher profiles / subject naming                | `plugin-platform.js` has local `teacherId` scope default; no profile lifecycle/switch UI was found                   | PARTIAL        | F1; explicitly local profiles, not cloud authentication         |
| R02 | Individual mode, batch students, student/group separation | legacy `groups[].members` names and roster import/search exist; no independent stable student aggregate/mode model   | PARTIAL        | F1; additive identity + compatibility projection                |
| R03 | Automatic events every 4–8 valid rounds                   | no event scheduler/pool evidence in current domain manifest                                                          | MISSING        | F4; defer until round transaction/counter design                |
| R04 | Shared classroom roster, independent profile grouping     | 3.0.33 adds stable classroom/student IDs, shared roster data and profile-scoped assignment validation; no UI/sync  | PARTIAL        | F1; wire profile switching and roster editing without dual authority |
| R05 | Student and group avatars                                 | group color and student number presentation exist; no avatar resource management                                     | PARTIAL        | F1/F2; resource references only, no embedded executable content |
| R06 | Timetable and current class switching                     | no schedule domain/service/UI evidence found                                                                         | MISSING        | F2; manual selection must override suggestion                   |
| R07 | AI Q&A and existing API integration                       | AI design docs only; no authorized model gateway evidence in current source scan                                     | MISSING        | F6; secrets must not be persisted in renderer storage           |
| R08 | Bottom bar combine start/force-stop, next question icon   | battle toolbar exists; exact requested consolidation not verified by dedicated test                                  | UNVERIFIED     | F3; inspect behavior before altering                            |
| R09 | End-of-class settlement highlights and All In failures    | archive/settlement exists; requested session summary fields not evidenced                                            | PARTIAL        | F3; separate class close from season archive                    |
| R10 | Seven named status effects                                | legacy statuses/defenses exist, but full seven-effect model is not represented as a single verified domain catalogue | PARTIAL        | F4; no assumptions about priority/duration                      |
| R11 | Fire flower, boomerang flower, Kamek, item box changes    | legacy items and current 26-item compatibility tests exist; new deltas are not adopted without a rule oracle         | BLOCKED-DESIGN | F4; characterize before behavior edits                          |
| R12 | Encyclopedia preview/full animation                       | plugin encyclopedia uses live catalog; full demonstrations not verified                                              | PARTIAL        | F5; demo must not mutate competition state                      |
| R13 | Item activation animation                                 | item visuals exist and motion tests pass; new cast/travel/hit timeline not evidenced                                 | PARTIAL        | F5; presentation failure separated from commit                  |
| R14 | Archive page settlement and achievement entry             | archive/history UI exists; exact new entry and summary unverified                                                    | PARTIAL        | F3                                                              |
| R15 | Homepage decorations driven by highest team score         | welcome dashboard reads live group state; score-driven decoration stages not found                                   | PARTIAL        | F5                                                              |
| R16 | Six score-stage music bands                               | custom audio/music exists; six threshold state machine not found                                                     | PARTIAL        | F5; zero/negative rule is open                                  |
| R17 | Remove wallpaper setting and dead code                    | wallpaper/custom backgrounds remain in current UI/storage                                                            | NOT STARTED    | F6; inventory and export/back-up compatibility first            |
| R18 | Reduce battle-page bottom blank area                      | 14-group geometry is protected; no baseline-specific visual change approved                                          | NOT STARTED    | F6 only after same-config geometry capture                      |
| R19 | Score-change effect design                                | existing feedback exists, but replacement design is unresolved                                                       | BLOCKED-DESIGN | F5; retain current effect until selected                        |
| R20 | Subject resource tabs/import                              | plugin platform supports pages/storage; no general subject resource library/import flow found                        | MISSING        | F2; safe file metadata/content model required                   |

## Accepted ambiguity resolutions

1. Teacher profile means a local selectable workspace profile in this phase; it is not identity verification, account sync, or multi-device collaboration.
2. A classroom roster is a canonical collection of stable student IDs. Each teacher profile's group assignment is a separate relation to those IDs.
3. Individual competition uses stable student participant IDs; group competition keeps existing group participants. No name-based guessing is used to merge legacy students.
4. `groups[].members` remains readable and writable only through the current legacy adapter until a later migration is explicitly verified. F1 builds a reversible projection and never deletes/rewrites the old field.
5. Avatar fields are references to managed assets, not arbitrary remote URLs or executable files.

## Scope notes

- Homepage customization design is now in scope because the user requested use of all Drive-folder content; the replacement handoff distinguishes home cards from battle group-card extensions.
- Competition rule changes with unresolved rounding, caps, identity, and target semantics remain blocked. No new numerical rule is inferred from a design summary.
- This is a first evidence snapshot, not the final F7 acceptance report. Additional tests and screenshots are recorded as phases execute.
