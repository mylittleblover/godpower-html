# GodPower V3 implementation ledger

Date: 2026-10-19. Branch: `feat/v3-foundation-sp01-sp02`, HTML base `2ba6bed`. User approved continuous implementation and explicitly required migration/architecture before feature expansion. UI browser scope: Chromium 1920×1080, 1×. No CircleCI operations.

## Rulings and ordering

- Ruling: migration and architecture precede achievement runtime — user corrected the implementation order; an unimplemented achievement-test draft was removed, catalog metadata remains harmless groundwork.
- Ruling: keep the existing localStorage adapter authoritative while validating the async transactional replacement — legacy mutators are still synchronous; switching the database first would create two authorities or expose partial commands.
- Ruling: use an IndexedDB adapter as the first shared HTML/Electron transaction implementation — actual Chromium tests prove cross-store atomicity and binary preservation; it requires no native ABI dependency. This is not yet a production cutover or a SQLite benchmark claim.
- Ruling: old source keys/databases are retained, never auto-cleaned. A corrupt current snapshot blocks fallback overwrite; explicit recovery import preserves its raw bytes first.

## Implemented

| Area | Actual change | Current boundary |
|---|---|---|
| Layers | Domain, application, infrastructure directories; template/manifest and test discovery follow relocated modules | Legacy global adapter and numbered scripts remain; not a completed domain rewrite |
| Identity | Stable groupUid/itemInstanceId/seasonId; archive dedupe by season | Numeric IDs, scores, roster, order and charges unchanged |
| Command contract | Command-scoped immutable events, deferred finalizers, publish only with explicit persisted-event acknowledgment | Production legacy repository does not claim event persistence; no runtime achievements yet |
| Commit/presentation boundary | A renderer failure after persistence cannot roll back already-saved classroom state | Regression observed RED then GREEN |
| Classroom migration | Schema1/unversioned → Schema2 copy, source retention, readback, receipt; malformed current envelope protected | New authority key godpower_state_v2; v1 remains migration baseline, not a live mirror |
| Recovery | Explicit import preserves corrupt primary raw text before replacing; failed import restores prior memory/recovery guard | No localStorage.clear |
| Audio migration | Missing-only copy, aliases/metadata preserved, atomic destination transaction, new verified v2 marker, retry after failure | Current audio database and BIN format unchanged; old sources retained |
| Transaction adapter | Aggregate/event/command/archive atomic commit, revision conflict, command SHA-256 identity, atomic media migration, receipts | Opt-in prototype; not activated as production authority |
| Full-source preflight | Read-only project-key/known-DB scan, original bytes/Blob/ArrayBuffer retained, SHA-256 manifest, source-change detection | Isolated import tested; UI and source-freeze coordinator still to implement |
| Achievement catalog | Exactly60 definitions, six categories and26 item mappings | Metadata only, no badges or progress claims |

## Executed evidence

- Node unit/integration suite: 160/160 after the renderer-failure regression was added.
- Core Chromium regression after Schema2 migration: 117 PASS, 0 FAIL, no page errors. Five-page screenshots at1920×1080 only. Managed Chromium file:// navigation: BLOCKED (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- Migration browser scenarios: v1 copy with14 groups; refresh identity stability; quota failure keeps source/current memory; corrupt current protection and explicit recovery; absent settings retain defaults.
- Transaction adapter: exact retry, conflicting command ID, stale revision, event failure rollback, caller-mutation isolation, reopen, atomic archive/audio import and failure/retry scenarios.
- Full-source isolated import: nine source-manifest records, five resource records, one archive; classroom score, audio bytes and wallpaper Blob preserved; source localStorage unchanged; no absent source DB created; subsequent source mutation detected.
- Legacy audio migration: custom current sound preserved, legacy aliases/metadata copied, absent DB not created, failed transaction has no partial sound or completion marker, retry succeeds; unsafe old v1 completion marker does not bypass the new verifier.
- Prior baseline Electron Linux:16 desktop scenarios PASS including14 groups, safe preload, child windows, picker modes, fullscreen overlays and restart/crash recovery. Must rerun after source sync; Windows native remains NOT TESTED.

Identity fallback now uses a session clock/counter rather than the gameplay RNG; a test with a throwing Math.random proved the prior coupling and passes after the fix. Failed destination rollback is explicitly returned in the migration failure report.

## Next mandatory work

1. Complete migration coordinator/source mutation barrier, readback integrity report and interrupted migration recovery. Keep current authority until the entire switch is proven.
2. Replace synchronous legacy state mutation paths with scoped application commands, then connect the transactional adapter. Avoid unbounded dual writes.
3. Extract pure ranking/scoring/item rule families with differential tests; preserve all26 items and14-group geometry.
4. Add Teacher/Classroom/Student/Grouping/Season/ClassSession identity and isolation.
5. Only then implement achievement progress/event facts, undo rollback, archival promotion and UI; continue the rest of the approved V3 handoff by dependency.

Unknown gameplay thresholds/status/item/random-event details remain registered in the Electron V3 audit. They block only dependent rules, not migration or architecture work.

## 3.0.3 async gateway and staging coordinator

Implemented after449f2c1/bf248bf: shared domain JSON values; async transactional command service with actor/scope/revision guards, in-flight/persisted intent deduplication, immutable calculation, cancellation and postcommit presentation isolation. Trusted synthetic handlers are tested against actual IndexedDB; production legacy commands are not all routed through it yet.

Migration coordination now rebuilds source payloads, uses deterministic identity generation for repeat preflight, checks every destination snapshot/archive/media hash and receipt, and rechecks source data. Settings has an advanced collapsed preview/staging/report entry. It creates an independent copy and explicitly does not activate a new authority. Unsupported resource prototypes and corrupt target bytes are rejected.

Verification: Node160/160; Chromium core117/117 errors=[]; complete migration suite including8 async command scenarios, source/target corruption, repeat staging and actual settings clicks PASS. Screenshot artifacts/v3-async/screenshots/migration-panel.png was inspected. The14group score list and primary raw string remained identical before/after staging. file:// remains BLOCKED by managed browser policy.100 synchronous round-loop sample:2669.5ms, DOM nodes2514 at20/50/100; heap one-point35156851 bytes, not a memory-leak trend or real-class FPS claim.

Next: migrate actual legacy command families into pure/domain calculations and the async gateway; first consolidate duplicate basic score calculation and the five legacyJudgeRound writes, with a pre-change differential baseline. Only then can default storage authority be safely switched.

## 3.0.4 round settlement consolidation (verified)

Pre-change80-case characterization againstda00d1b passed before editing. Then structural guard failed5→1 and pure port test failed missing implementation. Implemented CompetitionRules, explicit RoundSettlement, item-round adapter and separate720ms feedback owner. Removed four legacy wrappers, retained one compatibility entry; actual old/new80-case full selected-state/visual/sound comparison PASS. Node173/173 PASS. Broad Chromium business regression117/117 errors=[], item oracle26/26, seeded draw448 cases and configured-item browser tests PASS. Evidence artifacts/v3-round. file:// remains BLOCKED.

Next investigation found the currentItemOperationBlocks executes all26blueprints directly, while legacyUseItem still has14definitions/assignments. This is a reachability lead, not yet a safe-deletion conclusion. Inspect every capture/IIFE side effect and prove current public commands never enter the chain before deleting it. Keep shared attack/defense/animation helpers.


## 3.0.5 legacy item dispatcher cleanup (verified)

Pre-change all26 public item oracle passed with legacy dispatcher replaced by throwing trap. AST guard then failed14writes instead of1. Removed13overrides, captured aliases and2isolated IIFEs; kept one compatibility forwarder and shared helpers/metadata. Node175/175, item26/26, differential464/464, asynchronous-defense30 and round80 PASS;14groupDOM/screenshot PASS at1920×1080 1x. See artifacts/v3-items and reports/V3_ITEM_CHAIN_ACCEPTANCE.md. Default storage unchanged. Continue architecture/migration; new rules ZIP deferred until rules work, per user.


## 3.0.6 pure ranking and target policies (verified)

Extracted domain/competition/ranking.js and domain/items/targets.js; production ranking() and ItemOperationBlocks use these ports. Ranking is stable and nonmutating; target policy receives RNG and eligibility explicitly and returns original group references. Existing randomAhead comparator and RNG consumption are retained, not rebalanced. New 200 seeded ordering cases and17target contract/boundary tests were RED before implementation. Node195/195 PASS;464item-defense differential,448seeded draws,26oracle and configured-item tests PASS; Chromium core117/117 errors=[] at1920×1080 1x. file:// BLOCKED by managed policy. Evidence artifacts/v3-domain. No default storage cutover or achievement activation. Next: persistent migration verification journal and recovery distinction.


## 3.0.7 durable migration verification journal

Implemented separate migration receipt verification statuses VERIFYING/VERIFIED/DESTINATION_INVALID/STAGED_SOURCE_CHANGED/CANCELLED_STAGED, timestamp, sourceHash, source recheck and complete resource/archive counts. Imported complete=true means atomic copy completed; only verification.status=VERIFIED records subsequent full readback. It is never an authority-cutover marker. A new attempt invalidates an older verification result before checking bytes. Interrupted verification reopens/resumes by migrationId without duplicate import. Changed aggregate revisions cannot be certified as pristine staging. A postcommit cancellation race was reproduced RED then fixed: return outcome follows the persisted check result.

Node200/200 PASS; complete migration suite PASS; final updated source inventory/reopen/interrupted-check/corrupt-resource/journal-count tests and settings UI PASS,14group scores and source bytes unchanged. Evidence artifacts/v3-journal. No Windows native test or CircleCI. The source still needs a quiescence barrier and actual command migration before default authority activation. Continue with manual scoring command family.


## 3.0.8 actual manual score commands (verified)

Manual add/subtract and direct absolute editing now use ScoreAdjustments pure plans and the existing CommandLifecycle with source=manual, one pre-operation history snapshot, one primary save and explicit persistence result. Removed duplicate standalone history/save from these entries. Milestone/audio/visual rules and negative score behavior remain unchanged. Legacy RAM-only-on-quota compatibility remains explicit persisted=false; this is not a false durable success. Actual production callers (picker/hand/group/native bridge) still use applyScoreDelta, which now delegates to the application command. Backend remains legacy until the full command cutover, not a new dual authority.

Node208/208 PASS;7 browser command scenarios PASS (snapshot,undo,overflow,quota,direct edit,stale defense cancellation,presentation failure after durable save). Full test:e2e PASS:core117/117 errors=[],26item oracle,normal/quota/startup-denied scoring,10async defense lifecycle checks,batch student scoring+undo+overflow. Chromium1920×1080 1x only;file://BLOCKED;WindowsnativeNOT TESTED. Evidenceartifacts/v3-manual. Continue migrating interactive commands without adding undo entries that did not exist before.


## 3.0.9 answer/All In command migration (verified)

selectGroupOpt and toggleAllInCard are now single compatibility entries delegating to AnswerCommands. Removed the oldscript12AllIn override/captured alias, preserving its item-used guard and original music thresholds. CommandLifecycle adds explicit recordHistory=false so these controls get snapshots/validation/one save/result while preserving the original undo list. New answer selection cancels an older pending attack transaction before applying/persisting its choice; late defense confirmation cannot consume either item or alter scores.

Node211/211 PASS;4answer-control and7manual-score browser scenarios PASS; core117/117 errors=[],80round differential and14groupDOM/screenshots PASS at1920×1080 1x. Actual battle14 screenshot opened and inspected. file:// remainsBLOCKED. npm run test:commands now includes both new suites and test:e2e includes this command. Evidenceartifacts/v3-controls. Still legacy storage authority; continue actual command migration, not achievement runtime yet.
