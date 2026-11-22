# GodPower Phase 1 Performance & Code Simplification Plan

- **Target Baseline**: `godpower-html` V3.0.77 (`dist/godpower.html`) + `godpower-electron` V3.0.77
- **Benchmark Artifact**: [benchmark.mjs](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/benchmark.mjs) -> [baseline.json](file:///g:/GodPower/godpower-html/artifacts/perf-simplification/baseline.json)
- **Test Baseline Verified**: `473 / 473` passing (`77` unit + `6` integration files, `0` failed, `0` skipped, `60,269 ms` on Node `v24.22.3`).
- **Phase 1 Status**: `src/` untouched in both repositories. Measurement & planning only.

---

## 1. Baseline Benchmark Summary (`1920x1080@1x`, Microsoft Edge)

Seeded state: **14 groups**, WebP preset avatars, **3 inventory items/group**, active defensive/negative statuses (`star`/`mega`/`power` + `burn`/`freeze`/`stun`/`poison`/`paralysis`/`iceLock`), **28 roster students**, and **30 `historyStack` entries**.

### 1.1 Bundle & Startup (`5` clean contexts)

| Metric | Baseline Value | Notes |
| --- | --- | --- |
| `dist/godpower.html` size | `13,276,412 B` (`12.66 MB`) | Built output |
| `<style>` blocks / CSS source | `38` blocks (`52` files), `360,930 B` | Inline CSS |
| `<script>` blocks total | `161` blocks (`221` files), `12,854,159 B` | Includes base64 assets |
| Embedded `data:*;base64` URIs | `265` URIs, `10,888,878 B` | **Protected by `scripts/check.mjs`** |
| Logic JS vs Resources+Catalog | `1,597,140 B` logic / `1,482,640 B` data | `avatar-presets.js` (`1,287,724 B`), `component-catalog.js` (`171,120 B`) |
| `domContentLoadedWaitMs` | median `1107.94 ms` (`p95 1787.62 ms`, `sd 267.57`) | File parse + sync scripts |
| `saveReadyAndFirstFrameMs` | median `1415.49 ms` (`p95 2090.20 ms`, `sd 273.97`) | Ready + initial frame |
| `firstContentfulPaintMs` | median `264.00 ms` (`p95 2036.00 ms`, `sd 706.69`) | High p95 variance from sync parse/timer storms |
| `initialJsHeapMB` | median `40.15 MB` (`p95 68.86 MB`, `sd 11.28`) | Initial heap |

### 1.2 Battle Hot Paths (`5` warmup + `25` measured warm iterations)

| Operation | Median | p95 | Stddev | Root-Cause Signal |
| --- | --- | --- | --- | --- |
| `renderAll()` sync / frame | `83.10 ms` / `98.80 ms` | `92.70 ms` / `112.90 ms` | `3.74` / `5.53` | Rebuilds full grid + chart + dashboard + resizer |
| `renderGrid()` sync / frame | `74.70 ms` / `88.30 ms` | `82.70 ms` / `96.30 ms` | `4.21` / `5.14` | **~90% of `renderAll()` time**; 42 slot `innerHTML` overwrites |
| `itemCommandSnapshot()` | `0.30 ms` | `0.50 ms` | `0.13` | `JSON.stringify` of all 14 groups + `itemGlobal` |
| `HistorySnapshots.capture()` | `0.30 ms` | `0.50 ms` | `0.13` | Full JSON clone per history push |
| `ManualScoreCommands.adjust()` + snapshot | `75.70 ms` (`75.50 ms` adjust) | `91.10 ms` | `7.95` | 2 full JSON clones (`command` + `history`) + sync `renderAll()` |
| Score update -> `classroomCommands.whenIdle()` | `263.70 ms` | `309.70 ms` | `21.65` | Sync adjust (`~75ms`) + `SaveProjection` + IDB commit + post-commit sync |
| `SaveProjection.fromRuntime()` | `59.90 ms` | `72.20 ms` | `6.44` | 2x `copy(roster)` + `JSON.stringify` diff + `O(G*M*S)` + `validateV2` |
| `SaveSchema.validateV2()` | `17.70 ms` | `22.90 ms` | `2.37` | Re-clones entire document (`copy(assertV2(input))`) on every check |
| `SaveProjection + validateV2` combined | `78.20 ms` | `90.10 ms` | `7.73` | Executed on every transactional commit |
| Battle batch CDP & LongTasks | `119` long tasks (max `271 ms`) | `1543.05 ms` recalcStyle | `340.42 ms` layout | `251` layouts, `414` style recalcs, heap reached `188.20 MB` |

### 1.3 Navigation, Views, Tabs, Settings & Idle Telemetry

| Hot Path | Median (Frame / Sync) | p95 (Frame) | Stddev (Frame) | DOM / Engine Signal |
| --- | --- | --- | --- | --- |
| **7-View Full Cycle** (`10` cycles) | `558.25 ms` / `411.85 ms` | `609.50 ms` | `31.86` | `62` long tasks (max `217 ms`), `2493.86 ms` recalcStyle, `628.04 ms` layout, `78,750` nodes before GC |
| -> `welcome` | `202.20 ms` / `143.95 ms` | `210.20 ms` | `10.15` | `612` view nodes; double `syncRepeats()` + `outerHTML` + layout reads |
| -> `battle` | `122.85 ms` / `98.40 ms` | `139.10 ms` | `8.26` | `544` view nodes, `27` animations on enter; full `renderAll()` |
| -> `gameplay` | `103.20 ms` / `82.55 ms` | `110.00 ms` | `5.08` | `1,288` view nodes; rebuilds all 28 items/12 MKW/16 events/60 ach HTML |
| -> `history` | `43.30 ms` / `32.10 ms` | `49.00 ms` | `4.92` | **`3,797` view nodes** (37% of total DOM!); `JSON.stringify` x4 per group x 30 rows |
| -> `archives` | `41.70 ms` / `30.05 ms` | `45.30 ms` | `3.28` | `72` view nodes; eager `<pre>` JSON formatting |
| -> `settings` | `23.65 ms` / `15.10 ms` | `43.10 ms` | `9.00` | `3,056` view nodes pre-mounted inside `#view-settings` |
| -> `ai` | `16.80 ms` / `3.35 ms` | `25.70 ms` | `3.46` | `114` view nodes |
| **Gameplay 5 Tabs Cycle** (`15` cycles) | `53.30 ms` total | `64.80 ms` | `6.53` | `rules: 16.4ms`, `items: 14.7ms`, `achievements: 12.4ms`; `589.34ms` layout / `473.44ms` recalcStyle |
| **Settings 10 Categories Cycle** (`10` cycles) | `96.10 ms` total | `108.40 ms` | `5.19` | Slowest: `sound` (`28.90 ms`), `students` (`20.30 ms`), `items` (`9.50 ms`); `831` style recalcs (`481.72 ms`) |
| **`ItemDrawSettings` Simulator Update** (`20` updates) | `18.90 ms` / `6.35 ms` | `43.00 ms` (`max 51.90 ms`) | `8.98` | Rebuilds full `.idraw-settings` innerHTML per input event (`159.08 ms` recalcStyle, `63.63 ms` layout) |
| **Idle: `welcome` (`2000 ms`)** | `1` interval (`2` ticks), **`284` rAF ticks** | `0` long tasks | `0` CSS animations | **~142 Hz continuous rAF loop** (`105.90 ms` script, `276.36 ms` CPU tasks every 2s!) |
| **Idle: `battle` (`2000 ms`)** | `1` interval (`2` ticks), `0` rAF ticks | `0` long tasks | **`9` active animations** | `29` style recalcs (`10.90 ms`) from ambient CSS animations + 1s header stat timer |

---

## 2. Governance & Safety Constraints (Hard Invariants for Phase 2)

Phase 2 **must never violate** these verified checks:
1. **AST-Locked Compatibility Files** (`tests/integration/cascade-governance.test.mjs`, `artifacts/semantic-governance-3.0.65/about-removals.json`):
   - **DO NOT MODIFY**:
     - `src/runtime/items/{defense-chain-compat,encyclopedia-effects,group-encyclopedia,encyclopedia-rules,encyclopedia-copy,catalog-refresh}.js`
     - `src/runtime/ui/{interface-copy,settings-and-about,battle-appearance-and-hand-rewards}.js`
   - Note: `interface-copy.js:74-87` wraps `window.renderAll`, `window.renderItemWindow`, `window.renderHandRaise`, `window.renderPickerInfo` to enqueue `setTimeout(polishVisibleCopyV2187, 0)`. Reducing unnecessary calls to `renderAll()` avoids triggering this overhead without editing `interface-copy.js`.
2. **21 Canonical Entrypoints** (`tests/unit/canonical-entrypoints.test.mjs`):
   - `renderAll`, `globalItemDraw`, `handDrawItem`, `openHandRaise`, `closeHandRaise`, `renderHandRaise`, `selectHandGroup`, `judgeHandRaise`, `handQuickScore`, `renderGrid`, `useItem`, `selectGroupOpt`, `toggleAllInCard`, `legacyUseItem`, `legacyJudgeRound`, `applyItemScore`, `tryDefend`, `saveState`, `recordHistory`, `restoreStateFromSnapshot`, `undoLast` must each remain a single top-level `FunctionDeclaration` with zero reassignment overrides in non-exempted files.
3. **Bundle & CSS Governance Integrity** (`scripts/check.mjs`, `scripts/component-inventory.mjs`, `tests/integration/semantic-style-names.test.mjs`, `css-consolidation.test.mjs`, `css-cleanup-proof.test.mjs`):
   - Keep all `265` embedded `data:*;base64` resources untouched (`scripts/check.mjs:53-60`).
   - **3.0.66 Receipt-Locked vs Unlocked CSS Files**: `css-consolidation.test.mjs:401-405` asserts formatter-equality for the `28` active CSS files listed in `artifacts/css-consolidation-3.0.66/supported-removals.json` (including `group-cards.css`, `overview-and-resizer.css`, `dock-and-buttons.css`, `navigation-and-welcome.css`, `settlement-and-core.css`, `inventory-and-roulette.css`) against baseline + `style-owner-edits.json` receipts. By contrast, **24 post-3.0.66 CSS files are unlocked** (including `src/styles/home/welcome.css`, `src/styles/settings/save-workspace.css`, `src/styles/components/surface-polish.css` at manifest tail index `51`, `application-surfaces.css`, `desktop-shell.css`, `classroom-effects.css`, `motion.css`). Therefore, override `transition-property` / `.view:not(.active)` animation pausing safely in `src/styles/components/surface-polish.css` (or `welcome.css` / `save-workspace.css`) rather than modifying receipt-locked 3.0.66 CSS files.
   - Keep CSS class names, `--*` tokens, and `@keyframes` synchronized with `src/ui/component-catalog.js` (`GodPowerComponentCatalog` literal format verified by `verifyComponentInventory()`).
   - Maintain strict `domain/` (zero DOM/Window/IndexedDB) and `infrastructure/` (zero UI/render functions) layer isolation (`scripts/check-boundaries.mjs`).

---

## 3. Ranked Optimization Plan (Track A: Runtime Performance)

All changes should follow `performance-optimization` discipline: apply one coherent change at a time, rebuild `dist/godpower.html`, run `473` unit/integration tests + `scripts/check.mjs` + `benchmark.mjs`, and **REVERT** if median is neutral/worse or any test fails.

### P0-1: Eliminate `SaveProjection` / `SaveSchema.validateV2` Double-Cloning & `O(N^2)` Scans
- **Files / Functions / Lines**:
  - `src/application/save-projection.js`: `projectRuntime` (`33-167`, especially `76-126` & `149-163`), `toRuntime` (`5-32`)
  - `src/domain/save-document.js`: `assertV2` (`80-194`), `validateV2` (`195-197`)
  - `src/application/save-manager.js`: `persist` (`189-254`), `applyDocument` (`23-39`)
  - `src/infrastructure/save-repository.js`: `load` (`212-220`), `commit` (`233-294`)
- **Measured Baseline**: `SaveProjection.fromRuntime()` **59.9 ms** (`p95 72.2 ms`), `SaveSchema.validateV2()` **17.7 ms** (`p95 22.9 ms`), combined **78.2 ms** per save; `scoreUpdatePlusCommandIdleSaveMs` **263.7 ms**.
- **Bottleneck**:
  1. `validateV2(input)` runs `copy(assertV2(input))`, performing a full `JSON.parse(JSON.stringify(doc))` on the entire save document (including all groups, avatars, 30 history entries, archives) on every validation — even when `projectRuntime` just built a fresh `document` object or `saveRepository.load`/`commit` immediately clones or stores it.
  2. `projectRuntime:120-126` clones the entire `roster` twice (`const a = copy(roster), b = copy(current.roster)`), deletes `revision`, and runs `JSON.stringify(a) === JSON.stringify(b)` to decide `roster.revision + (0|1)`, plus `O(G*M*S)` nested `.filter`/`.find`/`.includes` loops across lines `76-117`.
  3. `persist:204-208, 230-234` runs additional full `SaveSchema.clone(payload)` + `JSON.stringify(state.rosterSnapshot) === JSON.stringify(snapshot.rosterSnapshot)` checks.
- **Safe Transformation**:
  1. Split `SaveSchema.assertV2` (in-place structural validator returning `input` without cloning, exported cleanly on `SaveSchema.assertV2` or internal helper) from `validateV2` (keep public `SaveSchema.validateV2` defensive-cloning semantics for untrusted external callers so all unit tests pass identically, while letting internal trusted fresh projections in `projectRuntime` / `save-repository.commit` validate without redundant extra deep-JSON round-trips when the caller already owns a fresh copy).
  2. Replace `copy(roster)` x2 + `JSON.stringify` revision comparison in `save-projection.js:120-126` with a pure structural comparison function `rosterEqualIgnoringRevision(rosterA, rosterB)` comparing arrays/fields directly with early exit on length/value mismatch.
  3. Pre-index `oldAssignments` by `groupUid`, `roster.students` by `studentUid`, and `roster.groups` by `groupUid` into `Map`s in `projectRuntime` and `toRuntime` (converting `O(G*M*S)` -> `O(G*M)`).
- **Keep/Revert Gate**: `saveProjectionPlusValidateV2Ms.median` improves by `>= 40%` (`78.2 ms -> <= 45 ms`), `scoreUpdatePlusCommandIdleSaveMs.median` improves beyond stddev (`21.6 ms`), `473/473` tests + `persistence.test.mjs` pass.

### P0-2: Honor `changedGroups` in `enhanceItemCards` & Skip Hidden Battle Full Rebuilds
- **Files / Functions / Lines**:
  - `src/runtime/items/queue-adapters.js`: `enhanceItemCards` override (`136-182`) & `renderItemWindow` wrapper (`75-133`)
  - `src/ui/battle-grid.js`: `renderBattleGridCards` (`44-268`), `buildBattleCardFastKey` (`7-43`), `decorateBattleRanks` (`270-309`)
  - `src/ui/render.js`: `renderAll` (`4-21`), `refreshPages` (`23-34`), `renderGrid` (`36-52`), `refreshBattleGrid` (`54-72`)
  - `src/runtime/ui/competition-summary.js`: `renderChart` (`22-93`), `renderDashboard` (`95-142`), `renderControls` (`170-214`)
- **Measured Baseline**: `renderAll()` **98.8 ms frame / 83.1 ms sync**, `renderGrid()` **88.3 ms frame / 74.7 ms sync**, `scoreUpdateAdjustMs` **75.5 ms**, `battle` view switch **122.85 ms frame**.
- **Bottleneck**:
  1. `battle-grid.js` carefully passes `changedGroups` to `enhanceItemCards(changedGroups)`, but `queue-adapters.js:138` replaces `enhanceItemCards` with a 0-arg wrapper calling `_v2120EnhanceItemCards()` (which falls back to ALL `state.groups`) and then loops over ALL 14 groups x 3 `.item-slot` nodes overwriting `.innerHTML` (`42` DOM innerHTML parses with base64 `itemVisual` strings) on every `renderGrid()`!
  2. `renderAll()` / `refreshPages()` runs full `renderGrid()`, `renderControls()`, `renderChart()`, `renderDashboard()`, `updateResizerUI()` even when `#view-battle` is inactive (hidden via `.view:not(.active)` CSS `display: none`, NOT `[hidden]`, so `closest?.("[hidden]")` in `competition-summary.js:24,97` returns `null` and does not skip inactive views!).
- **Safe Transformation**:
  1. Forward `changedGroups` in `queue-adapters.js` (`function enhanceItemCards(changedGroups) { _v2120EnhanceItemCards(changedGroups); ... }`) and scope the slot-decoration loop to `(Array.isArray(changedGroups) ? changedGroups : state.groups)`, adding a `dataset.slotSig` fast-key guard per `.item-slot` so identical slots skip `innerHTML` replacement completely.
  2. Track `battleDirty` / `chartDirty` flags when `currentView !== "battle"` so `renderAll()` / score updates mark battle UI dirty while hidden and defer `renderGrid()` + `renderChart()` + `renderDashboard()` until `switchView("battle")` runs (`Canonical entrypoint` `FunctionDeclaration renderAll()` stays intact!). Keep `updateHeaderStats()` immediate if header strip is globally visible.
  3. Cache/reuse `group` fast-key lookup in `battle-grid.js` to avoid repeated `querySelectorAll` calls in `decorateBattleRanks` and `decorateRoundItemLocks`.
- **Keep/Revert Gate**: `renderGrid.frameMs.median` improves `>= 35%` (`88.3 ms -> <= 55 ms`), `renderAll.frameMs.median` improves `>= 35%`, `scoreUpdateAdjustMs.median` drops sharply when partial-card update applies, and `battle` view switch drops below `70 ms`; `473/473` + E2E battle/item tests pass.

### P0-3: Eliminate Welcome Idle 142 Hz `requestAnimationFrame` Loop & Double `syncRepeats()` Reflow
- **Files / Functions / Lines**:
  - `src/ui/welcome-dashboard.js`: `render` (`56-135`), `syncCruise` (`158-198`, inner `tick:174-196`), `syncRepeats` (`199-238`), `viewChanged` (`606-611`)
  - `src/runtime/ui/navigation-and-clock.js`: `updateWelcomeClock` (`122-157`), `renderWelcomePage` (`159-187`)
  - `src/ui/desktop.js`: `renderWelcome` (`212-288`)
- **Measured Baseline**: `welcome` switch **202.20 ms frame / 143.95 ms sync** (`#1` slowest view!); Idle Welcome logs **`284` `requestAnimationFrame` callbacks in `2000 ms` (~142 Hz)**, `105.90 ms` script + `276.36 ms` CPU tasks every 2 seconds forever.
- **Bottleneck**:
  1. `WelcomeV2.render()` calls `syncRepeats()` at line `133` AND calls `syncCruise()` -> `syncRepeats()` a second time at line `160`.
  2. `syncRepeats()` serializes every original group card via `originals[i]?.outerHTML` (14 full HTML subtree serializations!) and reads layout properties (`offsetWidth`, `clientWidth`, `offsetLeft`).
  3. `tick()` inside `syncCruise()` reads `repeat.offsetLeft - first.offsetLeft` on **every single animation frame** right alongside reading/writing `track.scrollLeft` (forced synchronous layout at 144 Hz while sitting idle!).
  4. `updateWelcomeClock()` ticks every 1s via `setInterval`, unconditionally writing `.innerText` (which triggers style/layout invalidation in Blink) to `#welcomeClock`, `#welcomeDate`, `#welcomeGreeting` even when `currentView !== "welcome"` or text is unchanged (`welcomeDate`/`welcomeGreeting` only change once per minute/hour!).
- **Safe Transformation**:
  1. Remove duplicate `syncRepeats()` call in `syncCruise()` when already synced in `render()`, and build `copySignature` from data fields (`id|name|score|color|avatarUrl`) instead of serializing `outerHTML` of 14 DOM nodes.
  2. Compute `loopWidth = repeat.offsetLeft - first.offsetLeft` once on `syncRepeats()` / `ResizeObserver` instead of querying `offsetLeft` on every rAF tick, and pause cruise rAF cleanly when `document.hidden`, `currentView !== "welcome"`, or when marquee is switched to CSS-composited `transform` animation (if interactive scroll drag isn't active) or throttled cleanly without per-frame layout reads.
  3. In `updateWelcomeClock()`: skip writing `#welcomeClock`/`#welcomeDate`/`#welcomeGreeting` when `currentView !== "welcome"` (keep `updateHeaderStats()` running if tested — check clock unit test!), replace `.innerText` with `.textContent`, and guard `#welcomeDate`/`#welcomeGreeting` writes by comparing against cached previous text so they update once per day/hour instead of every second.
- **Keep/Revert Gate**: `welcome` view switch frame median drops `>= 50%` (`202.2 ms -> <= 100 ms`), Idle Welcome `windowRafCallbacks` drops cleanly (either `0` if GPU CSS marquee / paused or `0` `layoutCount` in CDP during idle), `clock` unit test & welcome E2E tests pass.

### P0-4: Deduplicate Full-State Deep Clones in `commandLifecycle` & `HistorySnapshots`
- **Files / Functions / Lines**:
  - `src/application/command-lifecycle.js`: `run` (`148-199`)
  - `src/core/history.js`: `HistorySnapshots.capture` (`3-23`), `recordHistory` (`25-37`), `persistHistoryV26` (`38-48`)
  - `src/application/legacy-classroom-adapter.js`: `captureClassroomCommandSnapshot` (`61-78`), `itemCommandSnapshot` (`223-225`), `useItem` (`333-546`)
  - `src/items/operation.js`: `run` (`386-495`, `JSON.stringify(g.competitionEffects)` x2 at `437-441` and `468-469`)
- **Measured Baseline**: `scoreUpdateAdjustMs` **75.50 ms**, `HistorySnapshots.capture()` `0.30 ms` + `captureClassroomCommandSnapshot()` full `clone(state)` + `useItem` `itemCommandSnapshot()` (`JSON.stringify` + `JSON.parse` + `itemCommandSnapshot()` again).
- **Bottleneck**: Every classroom command clones `state` TWICE (`captureClassroomCommandSnapshot()` before mutation + `HistorySnapshots.capture(state)` after mutation), AND `recordHistory()` synchronously serializes up to 40 snapshots via `STORAGE.setJSON(V26_HISTORY_KEY, ...)` in `persistHistoryV26()`. In `useItem()`, `itemCommandSnapshot()` stringifies and parses `groups` + `itemGlobal` even though `commandLifecycle` already handles transactional diff/rollback.
- **Safe Transformation**:
  1. Use fast `structuredClone` helper (or shallow immutable snapshot helpers for `groups`/`inventory`/`competitionEffects`/`itemGlobal`) when `structuredClone` is faster than `JSON.parse(JSON.stringify(...))` for non-DOM plain data, OR compute history entry directly from `commandLifecycle`'s pre-mutation clone / delta without cloning unmodified heavy nested arrays like `rosterSnapshot` when `rosterSnapshot` reference hasn't changed (structural sharing with freeze/copy-on-write!).
  2. Throttle/coalesce `persistHistoryV26()` writes (and avoid re-stringifying unchanged older entries in `historyStack`), keeping immediate flush on `pagehide` / `beforeunload`.
  3. Replace `beforeEffects` `JSON.stringify(g.competitionEffects)` in `src/items/operation.js:437-441,468-469` with a tiny shallow key-value comparator (`effectsEqual(a, b)`).
  4. Avoid `JSON.parse(itemCommandSnapshot())` in `useItem:356` by snapshot-diffing directly against the typed clone or targeted fields (`inventory`, `score`, `itemEffect`, `competitionEffects`).
- **Keep/Revert Gate**: `scoreUpdateAdjustMs.median` + `scoreUpdatePlusCommandIdleSaveMs.median` drop measurably beyond `stddev`, rollback/undo tests + `473/473` tests pass.

### P0-5: Lazy / Incremental Rendering for `GameplayPage`, `DesktopUI.renderHistory/Archives`, and `ItemDrawSettings`
- **Files / Functions / Lines**:
  - `src/ui/gameplay-page.js`: `render` (`336-364`), `updateLookup` (`283-312`), `filter` (`128-182`), `buildEventsSection` (`38-74`), `buildAchievementsSection` (`87-126`), `buildRulesSection` (`184-334`)
  - `src/ui/desktop.js`: `viewChanged` (`134-211`), `renderHistory` (`453-522`), `renderArchives` (`523-633`), `init` (`1665-1838`, especially eager `1810-1811`)
  - `src/ui/model.js`: `differences` (`73-111`)
  - `src/ui/item-draw-settings.js`: `renderPanel` (`58-366`), `sync` (`395-401`)
- **Measured Baseline**:
  - `gameplay` view switch: **103.20 ms frame / 82.55 ms sync** (`1,288` view nodes rebuilt on every visit).
  - `history` view switch: **43.30 ms frame / 32.10 ms sync** (`3,797` DOM nodes created in `#view-history`, 37% of entire page DOM!).
  - `archives` view switch: **41.70 ms frame / 30.05 ms sync**.
  - `ItemDrawSettings` simulator update: **18.90 ms frame (`p95 43.00 ms`, `max 51.90 ms`)** per single input event.
- **Bottleneck**:
  1. `DesktopUI.viewChanged` calls `GameplayPage?.render()` on every switch to `gameplay`, discarding and rebuilding all 28 item cards, 12 MKW modes, 16 random events, and 60 achievement cards even when static catalog data hasn't changed.
  2. `DesktopUI.renderHistory()` / `renderArchives()` run eagerly in `init()` and completely rebuild `historyList` (`3,797` nodes) on every `history` view switch, calling `GodpowerUIModel.differences()` which runs 4x `JSON.stringify` per group across 30 history entries (`4 * 14 * 30 = 1,680` stringifies per view open!).
  3. `ItemDrawSettings.renderPanel()` destroys and rebuilds the entire `.idraw-settings` panel HTML on every `input`/`change` on simulator sliders/selects.
- **Safe Transformation**:
  1. Cache static HTML / DOM skeleton for `GameplayPage` tabs (`items`, `statuses`, `events`, `achievements`, `rules`) keyed by a dirty/revision token (rule config hash + achievement ledger revision + `GodpowerTheme.get()`), patching only stateful toggles/badges when reopening `gameplay`.
  2. Skip `renderHistory()` and `renderArchives()` during `init()` while hidden; render lazily on first entry into `#view-history` / `#view-archives`, and guard subsequent renders with a monotonic `(historyVersion, theme)` key. In `GodpowerUIModel.differences()`, compare numeric `score` and shallow `inventory`/`itemEffect` keys instead of `JSON.stringify`. Cap initial visible history DOM (e.g., show latest 15 expanded/compact rows + "展开更早记录" button or lightweight lazy details) if compatible with E2E history selectors (verify tests first!).
  3. Split `ItemDrawSettings.renderSimulatorResult()` out of `renderPanel()` so `[data-idraw-sim]` `input`/`change` updates ONLY the simulator result container without replacing controls, event listeners, or focus.
- **Keep/Revert Gate**: `7-view cycle` frame median drops `>= 40%` (`558.25 ms -> <= 335 ms`), `gameplay` switch `<= 25 ms`, `history` switch `<= 15 ms`, `itemDrawSimulatorUpdate.frameMs.median <= 6 ms`, `473/473` + UI/E2E tests pass.

### P1-1: Eliminate `O(N^2)` Lookups & Excess Ledger Normalization Clones
- **Files / Functions / Lines**:
  - `src/domain/achievements/ledger.js`: `normalize` (`10-86`), `apply` (`197-279` cloning full ledger + `processedEvents.includes` `O(E)`)
  - `src/application/round-settlement.js`: `execute` (`3-135`, `rankOf` `84-89`)
  - `src/runtime/archives/settlement-actions.js`: `evaluateSeasonArchiveAchievements` (`77-129`)
  - `src/domain/save-roster.js`: `project` (`8-15`)
  - `src/ui/classroom-avatar-display.js`: `readSaveIndex` (`87-135`), `decorateGroupCards` (`346-402`)
  - `src/ui/save-workspace.js`: `openMembers` (`434-460`)
  - `src/ui/classroom-roster-workspace.js`: `download` (`533-601`), `importRosterBackup` (`603-720`)
- **Measured Baseline / Complexity Signal**: Multiple quadratic `O(N^2)` loops (`array.filter`/`find`/`some` inside `for`/`map` over groups, students, assignments, or `processedEvents`) plus full ledger JSON clone per achievement event in `ledger.apply`.
- **Safe Transformation**:
  1. Precompute `rankByGroupId`, `groupByUid`, `assignmentsByGroupUid`, `studentByUid` `Map`s once before looping.
  2. In `achievements/ledger.js`, maintain an indexed `Set` or bounded tail / O(1) lookup for `processedEvents` during batch evaluation and avoid re-normalizing/deep-cloning untouched group progress branches on every single event in a multi-event batch.
- **Keep/Revert Gate**: `achievement` & `round-settlement` unit tests pass `100%`, batch achievement evaluation micro-time improves, zero regressions in `benchmark.mjs`.

### P1-2: Trim Startup `setTimeout` Storms, Eager Hidden Scans & Double Theme Hydration
- **Files / Functions / Lines**:
  - `src/runtime/items/queue-adapters.js`: `DOMContentLoaded` `setTimeout(..., 220)` -> `renderAll()` (`204-210`)
  - `src/runtime/ui/battle-order-compat.js`: `DOMContentLoaded` `setTimeout(..., 280)` -> `renderAll()` + `renderItemEncyclopedia()` (`101-110`)
  - `src/runtime/items/catalog-adapters.js`: `DOMContentLoaded` `setTimeout(..., 80)` (`233-238`) calling `appendMissingEncyclopediaV283` (`151-174`, reads `document.body.innerText` forcing full layout!) + `patchItemIconSettingsV283` (`177-198`, calls `querySelectorAll("*")`)
  - `src/runtime/ui/dock-tooltips.js`: 3 redundant runs of `applyDockHumorV2185` (`110-175`, `177-179`)
  - `src/ui/themes.js`: double `hydrate(document)` (`123-130`, `172`, `294-303`)
  - `src/ui/desktop.js`: `setupSettings` (`647-815`) + Settings category switching (`sound: 28.90 ms`, `students: 20.30 ms`)
- **Measured Baseline**: `saveReadyAndFirstFrameMs` **1415.49 ms** (`p95 2090.20 ms`); Settings cycle **96.10 ms** (`sound 28.90 ms`, `students 20.30 ms`).
- **Safe Transformation**:
  1. Consolidate startup compatibility hooks after `SaveManager.ready()` instead of scheduling 3 staggered `setTimeout(80/220/280)` full `renderAll()` / DOM scans, and skip `document.body.innerText` + `querySelectorAll("*")` scans when target containers already match or don't exist.
  2. Guard `themes.js` `hydrate(document)` so `apply()` only hydrates un-hydrated `[data-md3-icon]` hosts instead of querying the whole DOM twice during `DOMContentLoaded`.
  3. Lazily refresh heavy Settings sections (`sound` audio lists, `students` roster/save panels) only when their category is active & marked dirty instead of on every `selectSettings` click.
- **Keep/Revert Gate**: `saveReadyAndFirstFrameMs.median` drops (`<= 1200 ms`, tightening `p95`), `settingsCategories.cycleFrameTotalMs` drops `>= 30%`, startup/settings E2E tests pass.

### P1-3: Narrow CSS `transition: all`, Remove Costly Software Blurs & Fix Electron IPC/Vault Overhead
- **Files / Lines (`godpower-html`)**:
  - `transition: all` on 12 hot selectors (in 3.0.66 receipt-locked files — **override `transition-property` in unlocked `src/styles/components/surface-polish.css`**, manifest tail #51): `src/styles/battle/group-cards.css:175,194,211`, `src/styles/battle/overview-and-resizer.css:152,168`, `src/styles/shell/dock-and-buttons.css:68,122`, `src/styles/shell/navigation-and-welcome.css:15,43`, `src/styles/dialogs/settlement-and-core.css:76,222`.
  - Continuous/animated blur: **unlocked** `src/styles/home/welcome.css:150-151` (`backdrop-filter: blur(7px)`), **unlocked** `src/styles/settings/save-workspace.css:368` (`backdrop-filter: blur(4px)`), and 3.0.66-locked `src/styles/items/inventory-and-roulette.css:337,453,458,475,480,625,929,976,980` (`filter: blur(...)` during spinning/card fx; override `.item-draw-spinning` blur via unlocked `surface-polish.css` or `draw-layout.css`).
  - Idle animations (`animationsIdle: 9` on Battle): pause decorative infinite card/status CSS animations in `src/styles/components/surface-polish.css` when `#view-battle` is inactive (`.view:not(.active) * { animation-play-state: paused }`) and when `document.hidden`.
- **Files / Functions / Lines (`godpower-electron`)**:
  - `desktop/save-vault.cjs` (`#getAsset:368-394`): O(Assets x Saves) full-file decrypt/parse scan inside serial queue -> maintain an in-memory `assetId -> saveId` map populated when reading/committing index entries.
  - `desktop/windows.cjs` (`#state:420-445`, `#broadcast:446-453`, `#reconcileHandCard:495-506`) + `src/ui/electron-host.js:214` + `renderer/picker.js` (`render:64-237`, `renderHand:239-330`) + `renderer/hand-cards.js` (`paint:72-102`, `render:103-147`): replace `JSON.stringify` over full 14-group + 30-history + base64 avatar/icon snapshots every `350 ms` with a monotonic revision counter; cache `screen.getAllDisplays()` on Electron `display-metrics-changed` instead of polling per broadcast.
  - `main.cjs:31` + `desktop/protocol.cjs:5-21` + `desktop/save-vault-bridge.cjs:6-21`: stop `loadSaveSchema(root)` from synchronously calling `verifyHtml(root)` a second time (re-reading and SHA-256ing all `13.27 MB` `resources/index.html`) when `main.cjs` already verified it at boot; verify only `save-schema.js` or reuse cached `verifyHtml` result.
- **Measured Baseline (`godpower-html`)**: Battle `recalcStyleDurationMs: 1543.05 ms`, Nav `recalcStyleDurationMs: 2493.86 ms`, Battle idle `animationsIdle: 9` causing `29` style recalcs / 2s.
- **Safe Transformation**: Override `transition-property: transform, opacity, background-color, border-color, color, box-shadow` for the 12 hot selectors inside unlocked `src/styles/components/surface-polish.css` (manifest tail #51), simplify `.gp-hero-status` / dialog backdrop blur in unlocked `welcome.css` / `save-workspace.css`, pause inactive `.view:not(.active)` animations in `surface-polish.css`, and leave all 28 active 3.0.66 receipt-locked CSS files untouched so `css-consolidation.test.mjs`, `npm run audit:styles`, and `verifyComponentInventory()` stay 100% green.
- **Keep/Revert Gate**: `recalcStyleDurationMs` drops meaningfully on battle/navigation benchmarks, idle battle style recalcs drop toward `0`, `473/473` + `audit:styles` + `godpower-electron` `npm test` + Playwright UI tests pass.

### P2-1: Bundle & Parse Hygiene (Respecting Resource Lock)
- **Measured Baseline**: `13,276,412 B` total; `10,888,878 B` in `265` baseline base64 data URIs (locked by `scripts/check.mjs`), `1,287,724 B` in `avatar-presets.js` (checked against `AVATAR_PRESET_SOURCES.json`), `171,120 B` in `component-catalog.js` (required literal AST by `component-inventory.mjs`), `1,597,140 B` logic JS.
- **Safe Transformation**: Focus JS size savings exclusively on pruning verified dead legacy compatibility code (Track C) and deduplicating repeated helper boilerplate (Track B), avoiding any modification to `src/resources/`, `src/ui/component-catalog.js`, or embedded `data:` URIs.

---

## 4. Ranked Code Simplifications (Track B: Clarity & Deduplication)

### S1: Consolidate Duplicated Utility Helpers
1. **HTML Escape Helper (`esc` / `E` / `escapeHtml`)** — duplicated in `8` web files + `2` Electron renderer files:
   - `src/runtime/ui/navigation-and-clock.js:1-8` (`escapeHtml`), `src/ui/achievement-archive.js:31`, `src/ui/gameplay-page.js:6-12`, `src/ui/hand-flow-view.js:24`, `src/ui/item-draw-settings.js:17-23`, `src/ui/random-event-ui.js:4`, `src/ui/save-workspace.js:4-15`, `src/ui/welcome-dashboard.js:26-37`; Electron `renderer/hand-cards.js:11-22`, `renderer/effect.js:98-106`.
   - **Transform**: Expose single `escapeHtml` helper via `src/ui/model.js` (or shared UI utility loaded before `ui/*.js` in `src/manifest.json`) and alias locally where needed.
2. **JSON Blob Download Helper (`download` / `downloadJson`)** — duplicated `5` times:
   - `src/ui/desktop.js:634-645`, `src/ui/save-workspace.js:148-157`, `src/ui/ai-knowledge.js:148`, `src/ui/migration.js:116-126`, `src/ui/classroom-roster-workspace.js:590-597`.
   - **Transform**: Extract `GodpowerUIModel.downloadJson(filename, data)` (or shared UI export helper) keeping exact `URL.createObjectURL` + `1000 ms` revoke semantics.
3. **Theme Icon & Reduced-Motion Queries**:
   - `icon`/`ic`/`mdIcon` wrappers duplicated in `src/ui/desktop.js:29-31`, `src/ui/about-view.js:118`, `src/ui/ai-chat.js:475`, `src/ui/gameplay-page.js:31-36`, `src/ui/random-event-ui.js:23`, `src/ui/save-workspace.js:176-181`, `src/ui/hand-flow-view.js:32`, `src/runtime/items/feedback-and-icons.js:90`.
   - `matchMedia("(prefers-reduced-motion: reduce)").matches` repeated `14+` times across UI modules -> centralize `GodpowerTheme.icon(...)` fallback & `DesktopUI.prefersReducedMotion()` (keeping `GodpowerTheme` graceful fallback if loaded first).
4. **Scoped `clone` / `copy` Helpers**:
   - `26` local `const copy/clone = (v) => JSON.parse(JSON.stringify(v))` definitions. Respect layer boundaries (`scripts/check-boundaries.mjs` forbids `domain/` & `infrastructure/` from referencing UI/DOM); share within `domain/` via existing `DomainValues.cloneJson` where already present, and keep `application/` / `ui/` lightweight.

### S2: Flatten Deep Nesting & Chained Conditionals via Lookup Tables / Guard Clauses
1. `src/core/action-sounds.js`: `classify` (`35-84`, AST branch depth `23` chained ternaries/if-chains) -> replace with declarative action-prefix / selector pattern table `[{ match, sound }]`.
2. `src/ui/battle-motion.js`: `styleFor` (`61-116`, AST branch depth `16` chained key checks) -> replace with `EFFECT_MOTION_MAP` table + default entry.
3. `src/runtime/items/card-effects-legacy.js`: `cardFxTargets` (`123-140`, depth `7`) & `src/runtime/items/lightning-and-hit-legacy.js`: `attackHitClassV2116` (`1-14`) -> convert cascading `if (...) return ...` chains to `Object` / `Map` lookups (`CARD_HIT_CLASS[key] || "hit-generic"`).
4. `src/ui/desktop.js`: `setupDock` (`970-1050`, depth `10`) and `setupModals` (`1105-1369`) -> extract focused single-purpose binding helpers with early returns (`if (!dock) return;`).

---

## 5. Dead Code Candidates (Track C — Zero Cross-Repo Callers Verified)

AST + regex cross-reference across `godpower-html/src/**`, `godpower-html/tests/**`, `godpower-html/src/index.template.html` (`onclick` / literals), `artifacts/semantic-governance-3.0.65/about-removals.json`, and `godpower-electron/{desktop,renderer,preload,tests}` confirmed **0** unused `FunctionDeclaration`s in `godpower-electron`, and **25** zero-caller declarations in non-locked `godpower-html` files.

### 5.1 Safe-to-Remove Legacy Compatibility Stubs / Dead Helpers (Verify w/ `npm test` + `npm run check` + `test:e2e`)
1. `src/runtime/history/compatibility-ui.js`: `openHistoryModal` (`1-3`), `closeHistoryModal` (`5-7`), `toggleHistExpand` (`13-17`) — retired modal shims superseded by `#view-history`. (Retain `renderHistoryList` if called by `DesktopUI`.)
2. `src/runtime/archives/settlement-actions.js`: `openSettlementHistoryModal` (`327-329`), `closeSettlementHistoryModal` (`331-333`), `renderArchiveClassStats` (`335-350`) — retired archive modal stubs superseded by `#view-archives`.
3. `src/runtime/items/weighted-selection.js`: `v282RandomOther` (`73-78`), `v282TakeFraction` (`79-89`), `v282Consume` (`90-95`) — retired V2.8.2 item helpers superseded by `ItemOperationBlocks`.
4. `src/runtime/items/triple-defense-helpers.js`: `consumeOneV218` (`7-12`), `attackOneFifthV218` (`13-17`), `finishOwnItemUseV218` (`18-27`) — unreferenced V2.18 triple-defense shims.
5. `src/runtime/items/catalog-adapters.js`: `renderGodItemManagerV283` (`62-85`), `renderEncyclopediaV283` (`108-148`) — unused V2.8.3 duplicate managers.

### 5.2 Review-Required Global Helpers (Zero Static Callers; Confirm No Ad-Hoc DevTools/Test Usage Before Deleting)
6. `src/runtime/picker/selection-engine.js`: `rewardPickedStudent` (`410-427`)
7. `src/runtime/audio/settings-and-transfer.js`: `openSoundSettings` (`1-12`)
8. `src/runtime/audio/menu-patterns.js`: `getNoiseBuffer` (`187-195`)
9. `src/runtime/items/ranking-and-drop-legacy.js`: `defenseCandidates` (`49-81`)
10. `src/runtime/picker/classroom-tools.js`: `itemBoxVisualV2121` (`83-87`)
11. `src/runtime/items/hand-reward-lifecycle.js`: `finishHandItemReward` (`56-64`)
12. `src/runtime/items/feedback-and-icons.js`: `itemFxTargetText` (`2-32`)
13. `src/runtime/items/drop-uniqueness-and-reset.js`: `itemRankBandV2172` (`25-33`)
14. `src/runtime/items/draw-throttle-legacy.js`: `commitDrawThrottleV2179` (`55-62`)
15. `src/runtime/items/spiny-cooldown.js`: `ensureSpinyCooldownV21717` (`3-13`)
16. `src/runtime/ui/battle-sort-contract.js`: `refreshSortingV21724` (`56-61`)

---

## 6. Verification & Keep/Revert Gate Protocol (Phase 2)

For each individual optimization / simplification step:
1. Edit source -> `npm run build` (must succeed cleanly; re-sync `godpower-electron` only when testing Electron changes).
2. Run governance & correctness suite in `godpower-html`:
   - `npm run check` (`scripts/check.mjs`: AST parse of all 161 scripts, boundary check, component catalog check, embedded resource hash equality)
   - `npm run audit:styles`
   - `node --test tests/unit/*.test.mjs tests/integration/*.test.mjs` (`473/473` passing, including `cascade-governance`, `canonical-entrypoints`, `persistence`, `semantic-style-names`, `css-consolidation`, `cleanup-equivalence`, `css-cleanup-proof`)
   - Relevant Playwright `tests/e2e/` suite + `godpower-electron` `npm test` (`tests/*.test.cjs`).
3. Run `$env:CHROMIUM_PATH = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"; node artifacts/perf-simplification/benchmark.mjs` and compare against `baseline.json`:
   - **KEEP** only if targeted metric beats baseline median beyond run-to-run `stddev` (aim `>= 10%` win for P0/P1, neutral/better on all non-target metrics, `0` new long tasks, `0` test regressions).
   - **REVERT** immediately if metrics are neutral/noisy/worse or any governance/unit/integration/E2E check fails.
