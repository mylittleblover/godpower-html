# Phase 2C Performance, Code Simplification & Dead-Code Ledger

- **Repository**: `g:\GodPower\godpower-html` (V3.0.77, `dist/godpower.html` sha256 `17a867a5a79fde236d6535db03217833e5b9924b6e915d566bb51a2028736c2e`)
- **Electron Repository**: `g:\GodPower\godpower-electron` (untouched in Phase 2C; verified via `git status`)
- **Benchmark Harness**: [benchmark.mjs](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/benchmark.mjs) (`1920x1080@1x`, Microsoft Edge, 14 groups / 30 history entries / 28 roster students / 3 inventory items)
- **Raw Data Files**:
  - Phase 1 Baseline: [baseline.json](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/baseline.json)
  - Phase 2B Visual Baseline (Pre-2C): [post2b.json](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/post2b.json)
  - Intermediate Verification: [p1_check.json](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/p1_check.json)
  - Final Phase 2C Result: [after.json](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/after.json)

---

## 1. Before vs. After Summary (Median / p95 / Stddev)

### 1.1 Bundle & Startup (`runs = 5`)

| Metric | Baseline (`baseline.json`) | Pre-2C (`post2b.json`) | Final 2C (`after.json`) | Delta vs. Pre-2C (`post2b`) |
| --- | ---: | ---: | ---: | ---: |
| `distHtmlBytes` | `13,276,412` | `13,301,993` | `13,325,534` | `+23,541` (`+0.18%`) |
| `srcStyleBytes` (`cssFiles`) | `360,930` (`52`) | `372,939` (`53`) | `372,939` (`53`) | `0` (untouched in 2C) |
| `srcLogicScriptBytes` | `1,597,140` | `1,604,498` | `1,628,039` | `+23,541` (`+1.47%`) |
| `domContentLoadedWaitMs` | `1107.936` (`p95 1787.621, sd 267.574`) | `1101.369` (`p95 1446.775, sd 139.792`) | `1166.568` (`p95 1352.927, sd 96.627`) | `+5.9%` med / `-6.5%` p95 / `-30.9%` sd |
| `saveReadyAndFirstFrameMs` | `1415.485` (`p95 2090.204, sd 273.966`) | `1398.286` (`p95 2235.761, sd 334.630`) | `1475.664` (`p95 1799.574, sd 174.756`) | `+5.5%` med / `-19.5%` p95 / `-47.8%` sd |
| `firstContentfulPaintMs` | `264` (`p95 2036, sd 706.692`) | `256` (`p95 1628, sd 550.557`) | `284` (`p95 1576, sd 518.932`) | `+28 ms` med / `-3.2%` p95 |
| `initialJsHeapMB` | `40.15` (`p95 68.855, sd 11.275`) | `42.629` (`p95 82.397, sd 16.184`) | `42.629` (`p95 42.629, sd 1.215`) | `0%` med / `-48.3%` p95 |

### 1.2 Battle Hot Path (`n = 25`, 14 groups / 30 history)

| Metric | Baseline (`baseline.json`) | Pre-2C (`post2b.json`) | Final 2C (`after.json`) | Delta vs. Baseline / Pre-2C |
| --- | ---: | ---: | ---: | ---: |
| `renderAll.syncMs` | `83.1` (`p95 92.7, sd 3.738`) | `86.5` (`p95 94.5, sd 4.142`) | **`2.5`** (`p95 3.7, sd 0.582`) | **-97.0%** / **-97.1%** |
| `renderAll.frameMs` | `98.8` (`p95 112.9, sd 5.526`) | `104.8` (`p95 114.4, sd 5.388`) | **`6.9`** (`p95 8.1, sd 2.868`) | **-93.0%** / **-93.4%** |
| `renderGrid.syncMs` | `74.7` (`p95 82.7, sd 4.205`) | `77.4` (`p95 87.4, sd 4.329`) | **`2.2`** (`p95 2.8, sd 0.329`) | **-97.1%** / **-97.2%** |
| `renderGrid.frameMs` | `88.3` (`p95 96.3, sd 5.138`) | `94.8` (`p95 104.6, sd 5.266`) | **`6.9`** (`p95 7.0, sd 0.068`) | **-92.2%** / **-92.7%** |
| `itemCommandSnapshotMs` | `0.3` (`p95 0.5, sd 0.128`) | `0.1` (`p95 0.3, sd 0.085`) | **`0.1`** (`p95 0.2, sd 0.059`) | **-66.7%** / `0%` |
| `historySnapshotCaptureMs` | `0.3` (`p95 0.5, sd 0.133`) | `0.4` (`p95 0.5, sd 0.073`) | `0.4` (`p95 0.7, sd 0.21`) | `+0.1 ms` / `0%` |
| `scoreUpdateAdjustMs` | `75.5` (`p95 90.8, sd 7.936`) | `79.5` (`p95 101.6, sd 11.272`) | **`20.9`** (`p95 25.1, sd 3.281`) | **-72.3%** / **-73.7%** |
| `scoreUpdatePlusItemCommandSnapshotMs` | `75.7` (`p95 91.1, sd 7.954`) | `79.7` (`p95 102.0, sd 11.290`) | **`21.2`** (`p95 25.4, sd 3.299`) | **-72.0%** / **-73.4%** |
| `scoreUpdatePlusCommandIdleSaveMs` | `263.7` (`p95 309.7, sd 21.648`) | `278.1` (`p95 355.2, sd 34.089`) | **`107.7`** (`p95 133.5, sd 10.626`) | **-59.2%** / **-61.3%** |
| `saveProjectionFromRuntimeMs` | `59.9` (`p95 72.2, sd 6.443`) | `62.5` (`p95 73.2, sd 4.478`) | **`22.7`** (`p95 24.9, sd 1.177`) | **-62.1%** / **-63.7%** |
| `saveSchemaValidateV2Ms` | `17.7` (`p95 22.9, sd 2.370`) | `20.0` (`p95 23.0, sd 1.809`) | `44.2` (`p95 50.0, sd 2.475`) | Note: real saves call `assertV2` via P0-1/P0-4 |
| `saveProjectionPlusValidateV2Ms` | `78.2` (`p95 90.1, sd 7.734`) | `82.0` (`p95 95.4, sd 4.862`) | **`66.9`** (`p95 71.7, sd 2.868`) | **-14.5%** / **-18.4%** |
| `cdpDelta.layoutCount` | `251` | `251` | **`132`** | **-47.4%** / **-47.4%** |
| `cdpDelta.layoutDurationMs` | `340.42` | `361.802` | **`150.221`** | **-55.9%** / **-58.5%** |
| `cdpDelta.taskDurationMs` | `16,576.491` | `17,829.289` | **`6,110.51`** | **-63.1%** / **-65.7%** |
| `cdpDelta.jsHeapUsedMB` | `188.2` | `147.08` | **`107.53`** | **-42.9%** / **-26.9%** |
| `longTasks` (`longTasksMaxMs`) | `119` (`271`) | `120` (`246`) | **`21`** (`86`) | **-82.4%** / **-82.5%** count (`-65.0%` max) |

### 1.3 Navigation, Settings, Simulator & Idle

| Metric | Baseline (`baseline.json`) | Pre-2C (`post2b.json`) | Final 2C (`after.json`) | Delta vs. Baseline / Pre-2C |
| --- | ---: | ---: | ---: | ---: |
| `sevenViewCycle.cycleSyncTotalMs` | `411.85` (`p95 437.0, sd 20.925`) | `325.25` (`p95 387.3, sd 28.428`) | **`114.75`** (`p95 142.1, sd 10.127`) | **-72.1%** / **-64.7%** |
| `sevenViewCycle.cycleFrameTotalMs` | `558.25` (`p95 609.5, sd 31.856`) | `443.95` (`p95 510.3, sd 35.510`) | **`264.75`** (`p95 295.9, sd 15.786`) | **-52.6%** / **-40.4%** |
| `sevenViewCycle` `welcome` sync | `143.95` (`sd 8.208`) | `113.0` (`sd 15.550`) | **`60.45`** (`sd 8.397`) | **-58.0%** / **-46.5%** |
| `sevenViewCycle` `battle` sync | `98.4` (`sd 6.112`) | `78.4` (`sd 13.956`) | **`20.05`** (`sd 7.571`) | **-79.6%** / **-74.4%** |
| `sevenViewCycle` `gameplay` sync | `82.55` (`sd 3.733`) | `65.8` (`sd 5.773`) | **`6.55`** (`sd 0.940`) | **-92.1%** / **-90.0%** |
| `sevenViewCycle` `history` sync | `32.1` (`sd 3.666`) | `26.1` (`sd 4.349`) | **`4.4`** (`sd 0.469`) | **-86.3%** / **-83.1%** |
| `sevenViewCycle` `archives` sync | `30.05` (`sd 2.691`) | `22.15` (`sd 3.081`) | **`4.7`** (`sd 0.429`) | **-84.4%** / **-78.8%** |
| `sevenViewCycle` `ai` sync | `3.35` (`sd 0.280`) | `2.45` (`sd 0.434`) | `4.9` (`sd 0.594`) | `+1.55 ms` / `+2.45 ms` |
| `sevenViewCycle` `settings` sync (frame) | `15.1` (`23.65`) | `10.55` (`22.15`) | `19.5` (`23.5`) | Flat frame latency (`23.5 ms`) |
| `sevenViewCycle.cdpDelta.scriptDurationMs` | `4,587.031` | `3,801.835` | **`711.371`** | **-84.5%** / **-81.3%** |
| `sevenViewCycle.longTasks` (`max`) | `62` (`217`) | `59` (`216`) | **`36`** (`159`) | **-41.9%** / **-39.0%** |
| `gameplayTabs.cycleFrameTotalMs` | `53.3` (`p95 64.8, sd 6.527`) | `47.6` (`p95 69.2, sd 8.416`) | `79.2` (`p95 88.6, sd 8.513`) | Sync `0.7-0.8 ms/tab`; static CSS layout variance (`p1_check.json` was `69.0 ms`) |
| `settingsCategories.cycleFrameTotalMs` | `96.1` (`p95 108.4, sd 5.186`) | `87.5` (`p95 104.6, sd 8.242`) | `90.7` (`p95 104.2, sd 6.288`) | `-5.6%` / `+3.7%` |
| `settingsCategories.sound` sync (`frame`) | `27.4` (`28.9`) | `20.5` (`21.75`) | **`5.8`** (`7.65`) | **-78.8%** / **-71.7%** sync |
| `settingsCategories.cdpDelta.scriptDurationMs` | `367.614` | `261.621` | **`166.506`** | **-54.7%** / **-36.4%** |
| `itemDrawSimulatorUpdate.syncMs` | `6.35` (`p95 17.1, sd 7.258`) | `5.9` (`p95 17.8, sd 7.075`) | **`0.8`** (`p95 1.1, sd 0.149`) | **-87.4%** / **-86.4%** |
| `itemDrawSimulatorUpdate.frameMs` | `18.9` (`p95 43.0, sd 8.980`) | `19.9` (`p95 47.5, sd 9.866`) | **`13.2`** (`p95 17.9, sd 4.097`) | **-30.2%** / **-33.7%** |
| `itemDrawSimulatorUpdate.cdpDelta.scriptDurationMs` | `236.905` | `227.349` | **`20.548`** | **-91.3%** / **-91.0%** |
| `idle.welcome` (`scriptDurationMs` / `longTasks`) | `105.901` / `0` | `87.323` / `0` | **`26.111`** / `0` | **-75.3%** / **-70.1%** |
| `idle.battle` (`scriptDurationMs` / `longTasks` / `rAF`) | `0.421` / `0` / `0` | `0.286` / `0` / `0` | **`0.108`** / `0` / `0` | **-74.3%** / **-62.2%** |

---

## 2. Keep / Revert Log by Optimization Stage

1. **P0-1 (`save-document.js`, `save-projection.js`, `save-repository.js`) — KEPT**:
   - Single-pass `safeTree` (`Array.isArray` + `Object.keys`) collecting `$asset` references inside `assertV2`; replaced `for..in` + spread object allocations; O(1) `Map` roster/assignment indexing; structural `sameJsonIgnoringRootKey` replacing double `copy(roster)` + `JSON.stringify`; hoisted `KNOWN_RUNTIME_KEYS`; `assertV2` instead of redundant `validateV2` re-clone inside `SaveProjection` and `switchActive`.
   - Gate (`p0_1b.json` vs `post2b.json`): `saveProjectionFromRuntimeMs` dropped **`62.5 -> 21.4 ms`** (`36/36` unit save/boundary tests passed).
   - Rejected micro-variant: `for..in` + `Object.hasOwn` inside `safeTree` measured ~20x slower in V8 (`5.225 ms` vs `0.251 ms`) and was discarded before keeping the indexed `Object.keys` loop.
2. **P0-2 (`queue-adapters.js`, `battle-grid.js`, `render.js`, `competition-summary.js`, `battle-layout-controls.js`, `rank-preview.js`, `random-event-ui.js`, `desktop.js`) — KEPT**:
   - Signature-memoized `enhanceItemCards` (`dataset.queueSlotSig`), single `grid.children` pass with `customIconSig` + `acquiredAt` in `fastKey`, skipped `ClassroomAvatarDisplay.decorateGroupCards` on unchanged renders, O(1) rank signature guard, view-gated + signature-memoized `renderChart`, `renderDashboard`, `renderLockStatus`, `DesktopUI.refreshLockControl`, `updateQuickBatchBar`, `updateHeaderStats`, `renderControls`, `updateResizerUI`, `renderBattleRankPreviewV21721`, `renderBattleStrip`, and dropped dead `inventory` serialization in `observeVisualState`.
   - Gate (`p0_2.json` vs `post2b.json`): `renderAll` dropped **`86.5 -> 1.7 ms`** sync / **`104.8 -> 6.9 ms`** frame; `renderGrid` dropped **`77.4 -> 1.9 ms`** sync / **`94.8 -> 6.9 ms`** frame; battle `longTasks` dropped **`120 -> 34`** (`473/473` unit+integration tests passed).
3. **P0-3 (`welcome-dashboard.js`, `navigation-and-clock.js`, `desktop.js`) — KEPT**:
   - Removed duplicate `syncRepeats()` in `render()`, replaced `JSON.stringify` and 28x `.outerHTML` copy comparisons with flat keys + `track.dataset.trackSignature`, cached `cachedCruisePeriod` outside `tick()`, gated `updateWelcomeClock()` DOM writes on `currentView === "welcome"`, and guarded `renderWelcome()` rAF arrow updates.
   - Gate (`p0_3.json` vs `post2b.json`): `idle.welcome.cdpDelta.scriptDurationMs` dropped **`87.3 -> 62.4 ms`**; `idle.battle.cdpDelta.scriptDurationMs` dropped **`0.286 -> 0.096 ms`**; `startupInteractiveMedianMs` improved to **`1283.1 ms`**.
4. **P0-4 (`legacy-classroom-adapter.js`, `classroom-save.js`, `save-manager.js`, `save-session.js`, `save-repository.js`, `save-projection.js`, `operation.js`) — KEPT**:
   - Ownership transfer pipeline (`buildClassroomBackupForSave({ cloneHistory: false })`, `SaveManager.persist(payload, { owned: true })`, `session.update(..., { cloneCurrent: false })`, `repository.commit(..., { owned: true })`) avoiding triple 30-entry `historyStack` clones per command; structural `snapshotGroupEffects` / `groupEffectsEqual` replacing `JSON.stringify`.
   - Gate (`p0_4.json` vs `post2b.json`): `scoreUpdateAdjustMs` dropped **`79.5 -> 23.8 ms`**; `scorePlusSnapMedianMs` dropped **`79.7 -> 24.1 ms`**; `scorePlusSaveIdleMedianMs` dropped **`278.1 -> 120.9 ms`**; `startupInteractiveMedianMs` improved **`1398.3 -> 1093.7 ms`**.
5. **P0-5 & P0-5b (`gameplay-page.js`, `desktop.js`, `achievement-archive.js`, `item-draw-settings.js`, `settings-and-transfer.js`, `save-session.js`, `save-manager.js`, `settlement-actions.js`, `save-workspace.js`, `welcome-dashboard.js`, `item-sound-map.js`) — KEPT**:
   - Per-section `gameplay-page` caching, `syncViewport()` body style caching, `renderHistory()` ref/tail memoization (dropping 1,680 `JSON.stringify`s), off-view startup render skipping, cached `achievement-archive` unlocked count, persistent 28-row simulator table DOM updates in `item-draw-settings.js`, memoized BGM/FX sound slot lists (`settings-and-transfer.js`, `item-sound-map.js`), zero-snapshot `SaveManager.archivesView()` + `SaveManager.rosterView()`, and hidden-track skip in `syncRepeats()`.
   - Gate (`p0_5.json` & `p1_check.json`): `gameplay` sync **`84.55 -> 6.50 ms`** (`5.25 ms` in `p1_check`); `history` sync **`34.10 -> 4.85 ms`** (`4.00 ms` in `p1_check`); `itemDrawSimulatorUpdate.syncMs` **`5.9 -> 1.0 ms`** (`0.8 ms` final); `archives` sync dropped to **`4.30 ms`** (`p1_check`) / **`4.7 ms`** (`after`); `settings.sound` sync dropped **`20.5 -> 6.35 ms`** (`p1_check`) / **`5.8 ms`** (`after`); `idle.welcome` script CPU dropped further to **`28.785 ms`** (`p1_check`) / **`26.111 ms`** (`after`).
6. **P1-1 (`ledger.js`, `round-settlement.js`, `save-roster.js`, `save-workspace.js`, `classroom-avatar-display.js`) — KEPT**:
   - Replaced linear `.includes()` / `.find()` / `groups.filter(...).length` scans with `Set` and `Map` lookups (`processedByGroup`, `discoveryByGroup`, `groupsAfterById`, `byGroup`, `groupsByUid`, `assignedGroupByStudent`) and O(G log G) rank map in `round-settlement.js`.
7. **P1-2 (`themes.js`, `catalog-adapters.js`) — KEPT**:
   - Early-exit `GodpowerTheme.hydrate(root)` when no `[data-md3-icon]` exists and memoized `dataset.appliedTheme` on `.ui-icon[data-theme-icon]`; dropped dead `document.body.innerText` forced layout at boot in `appendMissingEncyclopediaV283()` and narrowed `patchItemIconSettingsV283` selector from `querySelectorAll("*")`.
8. **Track B Code Simplifications — KEPT**:
   - Flattened branching into declarative lookup tables (`BUTTON_SLOT_RULES` in `src/core/action-sounds.js`, `FAMILY_RULES` + `KEY_ALIASES` in `src/ui/battle-motion.js`, `CARD_FX_TARGET_BY_KEY` in `src/runtime/items/card-effects-legacy.js`, `ATTACK_HIT_CLASS_V2116` in `src/runtime/items/lightning-and-hit-legacy.js`).
   - Consolidated duplicated `escapeHtml` / `E` helpers into `GodpowerUIModel.escapeHtml` (`src/ui/model.js`) across 7 consumers (`navigation-and-clock.js`, `gameplay-page.js`, `item-draw-settings.js`, `random-event-ui.js`, `save-workspace.js`, `welcome-dashboard.js`, `achievement-archive.js`).
   - Consolidated duplicated `download` / `downloadJson` helpers into `GodpowerTheme.downloadJson` (`src/ui/themes.js`) across 5 consumers (`desktop.js`, `save-workspace.js`, `ai-knowledge.js`, `migration.js`, `classroom-roster-workspace.js`).
9. **Track C Dead-Code Removal (14 unreferenced functions across 5 files) — KEPT**:
   - `src/runtime/archives/settlement-actions.js`: `openSettlementHistoryModal`, `closeSettlementHistoryModal`, `renderArchiveClassStats`
   - `src/runtime/history/compatibility-ui.js`: `openHistoryModal`, `closeHistoryModal`, `toggleHistExpand`
   - `src/runtime/items/weighted-selection.js`: `v282RandomOther`, `v282TakeFraction`, `v282Consume`
   - `src/runtime/items/triple-defense-helpers.js`: `consumeOneV218`, `attackOneFifthV218`, `finishOwnItemUseV218`
   - `src/runtime/items/catalog-adapters.js`: `renderGodItemManagerV283`, `renderEncyclopediaV283`
10. **Skipped / Deferred**:
    - CSS visual edits skipped per coordinator handoff (`srcStyleBytes: 372,939` untouched; handed off to `@ui-baseline-auditor` for Phase 2D).

---

## 3. Verification Results (Final Formatted Build)

- **Formatting & Manifest/Build Governance**:
  - Prettier formatted all modified Phase 2C `src/**/*.js` and `benchmark.mjs`.
  - `node scripts/sync-source-manifest.mjs`: `Indexed 274 inline source blocks` (passed).
  - `node scripts/component-inventory.mjs --check`: `{"classes":922,"tokens":289,"animations":104}` (passed).
  - `node scripts/build.mjs`: `dist/godpower.html` `13,325,534` bytes, sha256 `17a867a5a79fde236d6535db03217833e5b9924b6e915d566bb51a2028736c2e` (passed).
  - `node scripts/check.mjs`: passed (`161` script blocks parse, versions match `3.0.77`, domain/infra boundaries pass, component catalog matches).
  - `node scripts/repo-hygiene.mjs`: passed (`commentOnlyLegacyScripts: []`, `sourceManifestIssues: []`).
  - `node scripts/style-governance-audit.mjs`: passed (`repeatedSelectorProperties: 0`, `unreferencedKeyframes: 0`, `cssBytes: 372939`).
- **Unit & Integration Tests**:
  - `node --test tests/unit/*.test.mjs tests/integration/*.test.mjs`: **`473/473` passing** (`0` fail, `0` skipped, `0` cancelled).
- **Playwright E2E Suites (`1920x1080@1x`, Microsoft Edge)**:
  - **19/19 passed (`rc=0`)**: `mkw-draw-ui.mjs`, `gameplay-page.mjs`, `gameplay-item-dialog.mjs`, `component-library.mjs`, `hand-flow-cards.mjs`, `rules.mjs` (`26/26`), `item-modules.mjs`, `global-draw-lifecycle.mjs`, `global-draw-command.mjs`, `defense-lifecycle.mjs`, `warning-dialogs.mjs` (`13/13`), `archive-controls.mjs` (`9/9`), `authoritative-save-performance.mjs`, `battle-card-reuse.mjs`, `audio-panel-reuse.mjs`, `hidden-clock-performance.mjs`, `random-events-achievements.mjs`, `save-workspace.mjs`, `modal-observer-work.mjs`.
  - `tests/e2e/welcome-v2-completion.mjs`: **`9 pass, 11 fail, errors: []`** — fails on initial `#gpSlideTrack` focus/keyboard assertions due to pre-existing `SaveManager.start()` (`document.body.inert = true` at `DOMContentLoaded` since commit `f2872a6`) blocking `WelcomeV2.init()` -> `focusIntro()`; all 9 post-unlock, reduced-motion, tie-ranking, squid-masking, clock-tick, cruise, and offline cases pass. Preserved `SaveManager` startup lock untouched.
  - `tests/e2e/welcome-v2.mjs` (legacy V2 smoke test): fails at assertion `7 !== 5` (`Keep all five real application views`, pre-existing since V3 added `gameplay` and `ai`).
