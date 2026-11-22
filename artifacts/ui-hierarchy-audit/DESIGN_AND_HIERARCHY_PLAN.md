# GodPower UI Visual & Hierarchy Audit + Unified Component Library Blueprint (Phase 1)

**Branch / Version**: `V3.0.77` (`godpower-html` + `godpower-electron`)  
**Audit Baseline**: `artifacts/ui-hierarchy-audit/baseline/` (68 screenshots @ `1920×1080`, `1x`, Edge Chromium, `0` page errors)  
**Capture Script**: `scripts/capture-all-surfaces.mjs --phase=baseline|after`

---

## 1. Baseline Capture Inventory & Automated DOM/CSS Metrics

### 1.1 Captured Surface Inventory (68 Screenshots)

| Group | Captured Files (`artifacts/ui-hierarchy-audit/baseline/screenshots/`) | Count |
| --- | --- | ---: |
| Intro & Welcome | `01-intro.png`, `02-welcome-normal.png`, `03-welcome-edit.png` | 3 |
| Battle (14 Groups) | `04-battle-14-double-active.png`, `05-battle-14-double-resizer-evaluated.png`, `06-battle-14-single-batch.png` | 3 |
| Gameplay Playbook | `07-gameplay-items.png`, `07-gameplay-statuses.png`, `07-gameplay-events.png`, `07-gameplay-achievements.png`, `07-gameplay-rules.png`, `08-gameplay-item-dialog.png` | 6 |
| History & Archives | `09-history.png`, `10-archives-records.png`, `11-archives-achievements.png` | 3 |
| AI Copilot | `12-ai-chat.png`, `13-ai-knowledge-dialog.png` | 2 |
| Settings (10 Categories, Collapsed + Expanded) | `14-settings-{rules,appearance,motion,sound,items,students,welcome,data,ai,about}-collapsed.png` + `-expanded.png` for disclosures (`rules`, `appearance`, `sound`, `items`, `students`, `welcome`, `data`) | 17 |
| Modals & Dialogs | `15-modal-component-library-{components,tokens,styles,animations,conflicts}.png`, `16-modal-picker-{individual,group,two_tier}.png`, `17-modal-hand-{select,judge,reward}.png`, `18-modal-group-{detail,items,score}.png`, `19-modal-score.png`, `20-modal-quick-person.png`, `21-modal-member-search.png`, `22-modal-random-event-banner.png`, `23-modal-theme-confirm.png`, `24-modal-program-confirm.png`, `25-modal-settlement-name.png`, `26-modal-pwd.png`, `27-classroom-recovery-panel.png` | 23 |
| Marx Theme Parity | `28-marx-welcome.png`, `29-marx-battle-14.png`, `30-marx-gameplay-items.png`, `31-marx-ai-chat.png`, `32-marx-settings-appearance.png` | 5 |
| Electron Native Surfaces | `33-electron-picker-panel.png`, `34-electron-picker-hand.png`, `35-electron-picker-launcher.png`, `36-electron-hand-cards-{judge,reward_choice,score}.png` | 6 |
| **Total** | | **68** |

### 1.2 Automated DOM Hierarchy & Token Drift Metrics (`metrics.json`)

- **Horizontal overflow**: `0 / 68` surfaces overflowed horizontally at `1920×1080`.
- **Card nesting depth (`maxCardDepth >= 3`)**: Detected on **20 surfaces**:
  - `18-modal-group-detail`: **depth 4** (`.item-window` → `.ui-settings-group` → nested custom-color bordered card inside `基本信息`).
  - `08-gameplay-item-dialog`, `18-modal-group-items`, `27-classroom-recovery-panel`, and **all 16 Settings panels** (`rules`, `appearance`, `motion`, `sound`, `items`, `students`, `welcome`, `data`, `marx-settings-appearance`): **depth 3** (`.ui-settings-group` / `.ui-danger-zone` wrapping bordered `.ui-settings-row` / `.idraw-field` / `.ui-settings-disclosure` cards).
- **Border-radius fragmentation**: Up to **13 distinct computed `border-radius` values on a single screen** (`03-welcome-edit`: `6px, 7px, 8px, 9px, 10px, 11px, 13px, 15px, 16px, 17px, 21px, 50%, 99px`; `04-battle-14-double-active`: `10` distinct radii; `17-modal-hand-select`: `11` distinct radii).
- **Shadow fragmentation**: Up to **23 distinct `box-shadow` values on screen** (`22-modal-random-event-banner`: `23`, `17-modal-hand-select`: `22`, `04-battle-14-double-active`: `19`, `05-battle-14-double-resizer-evaluated`: `17`, `14-settings-students-collapsed`: `10`).
- **Font-size fragmentation**: Up to **15 distinct font sizes** (`17-modal-hand-select`, `22-modal-random-event-banner`), `12` on Battle (`7px` to `27px`), and `11` on Welcome (`11px` to `39px`, including fractional `13.3333px` / `18.72px` browser defaults on unstyled `<button>`/`<h3>`).

### 1.3 Static CSS & Motion Audit (`src/styles/` + `godpower-electron/renderer/`)

- `transition: all`: **11 occurrences**
  - `src/styles/battle/group-cards.css:175, 194, 211`
  - `src/styles/battle/overview-and-resizer.css:152, 168`
  - `src/styles/dialogs/settlement-and-core.css:76, 222`
  - `src/styles/shell/dock-and-buttons.css:68, 122`
  - `src/styles/shell/navigation-and-welcome.css:15, 43`
- `ease-in` (non `ease-in-out`): **0 occurrences**
- `scale(0)` entrance/exit: **1 occurrence**
  - `src/styles/feedback/classroom-effects.css:267` (`transform: translate(0, 0) scale(0);`)
- Layout-animating transitions (`width` / `height` / `padding` / `margin`): **4 occurrences**
  - `src/styles/battle/overview-and-resizer.css:38` (`transition: width 0.5s ...`)
  - `src/styles/home/welcome.css:871` (`transition: width 0.28s ...`)
  - `src/styles/items/draw-flow.css:43` (`transition: width 0.035s linear !important;`)
  - `src/styles/settings/save-workspace.css:433` (`transition: width 0.2s ...`)
- `:active` press feedback (`scale(0.97)`): Present in only 5 files (`hand-flow.css`, `application-surfaces.css`, `welcome.css`, `navigation-and-welcome.css`, `tokens-and-presets.css`); **missing on `.btn`, `.opt-btn`, `.allin-toggle-btn`, `.ui-settings-nav button`, `.gameplay-tabs .btn`, `.quick-person-chip`, `.picker-vtab`**.
- Unscoped `:hover` rules (lacking `@media (hover: hover) and (pointer: fine)`): **76 `:hover` selectors** across `src/styles/` & Electron CSS.
- `!important` declarations: **1,417 total** across 34 CSS files (concentrated in 3.0.66 legacy/checkpointed sheets: `desktop-foundation.css` 307, `controls-and-scrolling.css` 228, `score-and-state.css` 180, `draw-layout.css` 118, `catalog-and-card-compat.css` 116).

#### Emil Kowalski Motion & Interaction Review

| Before | After | Why |
| --- | --- | --- |
| `transition: all 0.15s` / `0.2s` in 11 rules across `group-cards.css`, `dock-and-buttons.css`, `navigation-and-welcome.css`, `settlement-and-core.css`, `overview-and-resizer.css` | `transition: transform 160ms var(--ease-out), background-color 160ms ease, border-color 160ms ease, color 160ms ease` | Avoids unintended layout/paint property transitions; explicit properties stay predictable and fast |
| `transform: translate(0, 0) scale(0)` in `src/styles/feedback/classroom-effects.css:267` | `transform: translate(0, 0) scale(0.92); opacity: 0` | Nothing in the real world appears from zero size; starting at `>= 0.9` feels grounded |
| `transition: width 0.2s` / `0.28s` / `0.5s` on progress bars & rank bars (`welcome.css`, `save-workspace.css`, `overview-and-resizer.css`) | `transform: scaleX(var(--progress))` with `transform-origin: left` and `transition: transform 220ms var(--ease-out)` | `width` triggers layout + paint on every frame; `scaleX` runs on the GPU compositor |
| No `:active` state on `.btn`, `.opt-btn`, `.ui-settings-nav button`, `.quick-person-chip`, `.picker-vtab` | `transition: transform 140ms var(--ease-out)` + `:active:not(:disabled) { transform: scale(0.97); }` | Buttons and pressable tiles feel immediately responsive to pointer press |
| `ease-out` / default `ease` / `cubic-bezier(0.2, 0.8, 0.2, 1)` mixed with `0.22, 1, 0.36, 1` and `0.16, 1, 0.3, 1` | Unified `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` and `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` | Consistent, crisp deceleration across all UI surfaces |
| `:hover` elevation (`translate: 0 -2px/-3px`) outside `@media (hover: hover) and (pointer: fine)` | Wrap hover-lift & hover-tint rules in `@media (hover: hover) and (pointer: fine)` | Prevents sticky hover states on touch/interactive whiteboard displays |

### 1.4 Visual Inspection Findings (Anti-Slop & Hierarchy Audit)

1. **Duplicate Close Buttons (`17-modal-hand-reward.png`)**: `#handRaiseBackdrop .classroom-head` renders both `[退出举手 ×]` AND an injected `.ui-window-close` circular `×` button side-by-side. Across modals, **5 incompatible close patterns** coexist (`❌` emoji button in `gameplay-item-dialog`, plain `"关闭"` text button in `quickPersonBackdropV218`, plain `×` in `itemModalBackdrop`, circular `ui-window-close` in `aiKnowledgeDialog` & `componentLibraryModal`, and `"退出"` footer button in `pickerModal`).
2. **Raw JSON Leaking into User Tables (`09-history.png`, `10-archives-records.png`)**:
   - `#historyListView` renders `{"booShield":0,"booRoundsLeftV218":0} → {"booShield":0,"booRoundsLeftV218":0}` in the `持续状态` column even when no statuses are active.
   - `#settlementHistoryContainer` renders `{"used":6,"hits":4}` in `道具与答题统计`.
3. **3–4 Level Card Nesting (`14-settings-*.png`, `18-modal-group-detail.png`)**:
   - Every Settings section wraps `.ui-settings-group` (bordered card + shadow) around `.ui-settings-row` / `.idraw-field` / `.idraw-toggle-card` (another bordered card + shadow) around inputs.
   - `18-modal-group-detail.png` reaches depth 4 (modal → `基本信息` card → `自由颜色` card) and clips the bottom `删除小组` button.
   - `14-settings-motion-collapsed.png` mixes ungrouped top cards with a grouped bottom card (`全屏课堂特效`).
4. **Template Chrome & Repetitive Labels (`04-battle-14-double-active.png`, `07-gameplay-items.png`, `07-gameplay-events.png`, `09-history.png`)**:
   - Every battle card repeats `"小组名称 · 当前按编号排列"` (`.battle-group-subtitle`) 14 times — zero information value.
   - Every Gameplay item card repeats `"实际效果"` eyebrow above 1 sentence and appends `"→"` (`"说明与效果演示 →"`), also seen on `"查看完整档案 →"` and `"查看 snapshots →"`.
   - 5 full-page views (`gameplay`, `history`, `archives`, `ai`, `settings`) stamp the identical 150px-tall green/crimson gradient `.ui-collection-header` banner with uppercase English eyebrow (`CLASSROOM PLAYBOOK`, `YOUR CLASSROOM · YOUR WAY`, `CLASSROOM COPILOT`), flattening visual distinction and pushing real content down.
   - `07-gameplay-events.png` uses heavy saturated multi-stop linear gradients on every `EV01..EV16` badge (`#d97706 → #ea580c`, `#7c3aed → #db2777`), competing with actual event titles and causing pill tags to wrap onto 2 lines.
5. **Settings & Workspace Rough Edges (`14-settings-data-expanded.png`, `14-settings-students-collapsed.png`, `14-settings-items-expanded.png`, `13-ai-knowledge-dialog.png`, `12-ai-chat.png`)**:
   - `ui-settings-disclosure > summary` renders a tiny floating `+`/`-` pill right after the description text instead of a right-aligned chevron.
   - `14-settings-students-collapsed.png` shows an orphan bordered note bar between `更多存档管理` and the two-column roster workspace, and every group row combines left color bar + colored border + colored background + colored dot.
   - `12-ai-chat.png` renders user and assistant messages as nearly identical `.ui-panel` cards with no conversational alignment distinction, and keeps a bright red `删除当前对话` button permanently prominent in the left sidebar.
   - `13-ai-knowledge-dialog.png` displays an unstyled native browser `<input type="file">` inside a bordered box.

---

## 2. Unified Component Library Specification

> **Guiding Principle**: Establish a single, cohesive set of primitives first (new `src/styles/components/unified-primitives.css` + updated `surface-polish.css` & `UIComponentLibrary` showcase), then migrate every page and modal against those primitives in Phase 2. Preserve all business IDs, event handlers, 14-group battle card geometry, and Classic + Marx theme parity.

### 2.1 Four-Tier Surface Hierarchy (Max Card Depth ≤ 2)

| Tier | Role | Fill & Border | Radius | Shadow | Permitted Children |
| --- | --- | --- | --- | --- | --- |
| **Tier 0: Canvas** | Page background (`body`, `.view`) | `--ui-bg` (`#f4f8f6` Classic / `#faf6f1` Marx) | `0` | `none` | Tier 1 panels, headers, toolbars |
| **Tier 1: Panel / Section** | Primary content block (`.ui-panel`, `.ui-settings-group`, `.gp-panel`, `.group-row-card`) | `--ui-panel` (`#ffffff` / `#fffdfa`), `1px solid var(--ui-border)` | `--radius-md` (`14px`) | `--shadow-card` | Hairline-divided rows, tables, compact controls (**NO nested Tier-1 cards**) |
| **Tier 2: Inset / Interactive Tile** | Sub-region inside Tier 1 when grouping is functionally required (`.gp-inset`, `.hand-flow-card`, `.idraw-table-wrap`) | `--ui-soft-2` (`#f5f9f7` / `#fcf5f0`), `1px solid var(--ui-border)` | `--radius-sm` (`10px`) | `none` | Text, inputs, pills, buttons (**NO Tier-2 inside Tier-2**) |
| **Tier 3: Floating / Modal** | Dialogs, popovers, toasts (`.ui-function-surface`, `.ai-knowledge-window`, `.re-banner`) | `--ui-panel`, `1px solid var(--ui-border-strong)` | `--radius-lg` (`20px`) | `--shadow-float` | Tier-1-style flat sections separated by `1px solid var(--ui-border)` hairlines |

**Strict Nesting Rule**: Inside `.ui-settings-group` (Tier 1) and inside modals (Tier 3), `.ui-settings-row` and form groups use **flat hairline dividers** (`border-bottom: 1px solid var(--ui-border)` + hover tint) instead of wrapping every row in its own bordered/shadowed card. That immediately eliminates all `depth >= 3` violations.

### 2.2 Consolidated Design Tokens (`Classic` & `Marx`)

- **Radius Scale (4 tokens + pill)**:
  - `--radius-xs: 6px` (micro badges, checkboxes, code chips)
  - `--radius-sm: 10px` (buttons, inputs, selects, item slots, nav tabs, rows)
  - `--radius-md: 14px` (Tier-1 cards, battle cards, disclosure blocks, Tier-2 insets)
  - `--radius-lg: 20px` (modals, collection headers, hero panels)
  - `--radius-pill: 999px` (pills, switches, avatar circles, toast)
- **Shadow Scale (3 tokens)**:
  - `--shadow-xs: 0 1px 2px var(--theme-tone-17302d08, rgba(15, 38, 33, 0.05))`
  - `--shadow-card: 0 2px 10px var(--theme-tone-17302d08, rgba(15, 38, 33, 0.05))`
  - `--shadow-float: 0 18px 48px var(--theme-tone-17302d26, rgba(15, 38, 33, 0.18))`
- **Typography Scale (6 steps, `tabular-nums` on all numeric KPIs/scores/ranks)**:
  - `--font-xs: 12px` (captions, metadata, table headers, badges — **floor for readable UI text**)
  - `--font-sm: 13px` (dense table cells, helper descriptions, secondary controls)
  - `--font-base: 14px` (body copy, buttons, inputs, settings labels)
  - `--font-md: 16px` (card titles, modal section titles, settings group headings)
  - `--font-lg: 22px` (page titles, modal headers, card scores)
  - `--font-xl: 32px` (hero headline, welcome KPI numbers)
- **Spacing Scale**: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 24px`, `--space-6: 32px`.
- **Motion Tokens**:
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`
  - `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`
  - `--dur-press: 120ms`, `--dur-fast: 160ms`, `--dur-normal: 220ms`, `--dur-modal: 260ms`.

### 2.3 Unified Component Primitives

1. **Buttons (`.btn`)**: Unified height (`36px` default, `30px` `.btn-sm`), `border-radius: var(--radius-sm)`, single icon+label gap `6px`, explicit `transition: transform var(--dur-press) var(--ease-out), background-color var(--dur-fast) ease, border-color var(--dur-fast) ease`, `:active:not(:disabled) { transform: scale(0.97); }`, zero appended `→` arrows in copy.
2. **Segmented Tab Bar (`.gp-tabs` / `.gameplay-tabs` / `.ach-view-switch` / `.gameplay-about-tabs`)**: Single pill-rail container (`background: var(--ui-soft-2); border: 1px solid var(--ui-border); padding: 4px; border-radius: var(--radius-md)`), active tab uses crisp `--ui-panel` elevated pill (`color: var(--ui-primary); box-shadow: var(--shadow-xs)`) or `--ui-primary` filled state depending on surface contrast.
3. **Status Pills & Badges (`.ui-chip`)**: Unified `height: 24px`, `padding: 0 9px`, `border-radius: var(--radius-pill)`, `font-size: 12px`, `font-weight: 600`, soft tinted background + subtle border (`data-tone="neutral|primary|positive|warning|danger"`). Replace saturated multi-stop gradients on `EV01..EV16` and `ACH` badges with clean tinted icon tiles (`background: color-mix(in srgb, <tone> 12%, var(--ui-panel)); color: <tone>; border: 1px solid color-mix(in srgb, <tone> 24%, transparent)`). **Max 2 pills per card row.**
4. **Compact Page Header (`.gp-page-header` / refactored `.ui-collection-header`)**: Retain the hero card on `#view-welcome`, and streamline sub-pages (`gameplay`, `history`, `archives`, `ai`, `settings`) to a clean, low-height (`~76–88px`) Tier-1 header bar with subtle left accent or soft gradient wash, removing repetitive uppercase English eyebrows (`CLASSROOM PLAYBOOK`, `YOUR CLASSROOM · YOUR WAY`) so ~70px more content sits above the fold.
5. **Settings Row & Disclosure (`.ui-settings-group`, `.ui-settings-row`, `.ui-settings-disclosure`)**:
   - `.ui-settings-group` is the Tier-1 card (`padding: 18px 20px`).
   - `.ui-settings-row` inside it is a flat horizontal row separated by `1px solid var(--ui-border)` (no inner card box, no inner shadow).
   - `.ui-settings-disclosure > summary` right-aligns a clean `▾` chevron indicator (`margin-left: auto`) instead of floating a tiny `+`/`-` pill beside the subtitle.
6. **Unified Dialog Chrome (`.ui-function-surface`)**:
   - Single standard close button `.ui-window-close` (`32×32px`, `border-radius: 50%`, `×` glyph) top-right on every modal; remove duplicate close button on `#handRaiseBackdrop` and replace `❌` emoji in `gameplay-item-dialog`.
   - Consistent `20px` header padding, `20px` body padding, hairline footer actions (`justify-content: flex-end; gap: 10px`).
7. **Data Tables & Empty States (`.ui-table`, `.ui-empty`)**:
   - `.ui-table` formats all cells in human-readable Chinese labels (never raw JSON strings in History or Archives).
   - `.ui-empty` uses calm `1px dashed var(--ui-border-strong)`, clear single headline + 1-line action hint + single primary CTA.

---

## 3. Page-by-Page & Window-by-Window Migration Table

> **Governance Key**:  
> - **[Editable]** = Post-3.0.66 freely editable CSS/JS (`surface-polish.css`, `gameplay-page.css`, `ai-chat.css`, `hand-flow.css`, `save-workspace.css`, `item-draw-settings.css`, new `src/styles/components/unified-primitives.css`, `src/ui/*.js`, `godpower-electron/renderer/*.css`).  
> - **[Receipted]** = 3.0.66 checkpointed CSS file; modifying it directly requires appending exact baseline hash + byte-offset edit receipts to `artifacts/classroom-hotfix-3.0.72/style-owner-edits.json` (verified by `npm run test:css-governance`).

| Surface | Before Issue (Observed) | Unified Primitive / Hierarchy Fix | CSS / JS Owner File |
| --- | --- | --- | --- |
| **Design Tokens & Shared Primitives** | 13 radii, 23 shadows, missing `:active` `scale(0.97)`, `transition: all` (11x), `scale(0)` (1x), `width` transitions (4x) | Add `unified-primitives.css` tokens (`--ease-out`, `--radius-xs/sm/md/lg`, `--shadow-xs/card/float`, `:active` `scale(0.97)`, `@media (hover: hover)`). Fix 11 `transition: all`, 1 `scale(0)`, 4 `width` animations at their owners | `src/styles/components/unified-primitives.css` **[Editable, new]**, `src/styles/components/surface-polish.css` **[Editable]**, `group-cards.css`, `dock-and-buttons.css`, `navigation-and-welcome.css`, `settlement-and-core.css`, `overview-and-resizer.css`, `classroom-effects.css`, `draw-flow.css` **[Receipted]** |
| **Component Library Modal** (`#componentLibraryModal`) | Only shows legacy `.ui-*` snippets; lacks 4-tier hierarchy, motion tokens, pill/tab/dialog showcase | Update preview samples & definitions to showcase the new 4-tier surfaces, unified tabs, pills, rows, dialog header/close, and Classic/Marx parity | `src/ui/component-library.js` **[Editable]**, `src/styles/settings/component-library.css` **[Receipted if touched, or style via `surface-polish.css`]** |
| **Intro Screen** (`#gpIntro`) | Clean overall (`3` radii), slight shadow/caption contrast tuning | Align slider radius (`--radius-pill`), `:active` knob feedback, token colors for Classic & Marx | `src/styles/components/surface-polish.css` **[Editable]** |
| **Welcome Dashboard** (`#view-welcome`) | 12–13 distinct radii, `transition: width` on rank bars, hover lifts outside `@media (hover: hover)`, trailing `→` arrows on footer links | Unify card radii (`--radius-md`), `scaleX()` rank bars, remove `→` arrows from footer buttons, refine edit-mode toolbar alignment | `src/styles/components/surface-polish.css` **[Editable]**, `src/styles/home/welcome.css` **[Receipted]**, `src/ui/desktop.js` **[Editable]** |
| **Battle View (14 Groups)** (`#view-battle`) | 19 distinct shadows, 10 radii, repetitive `"小组名称 · 当前按编号排列"` subtitle on all 14 cards, `transition: all` on `.opt-btn`/`.allin-toggle-btn`, inconsistent `.score-capsule` radius vs number badge | Hide/trim zero-info repetitive `.battle-group-subtitle` in `battle-card-view.js`, unify card/slot/button radii (`--radius-md` card, `--radius-sm` slots/buttons), replace `transition: all` & add `:active` `scale(0.97)`, calm `#battleRandomEventStrip` + `#quickBatchBar` hierarchy without breaking 14-group geometry | `src/ui/battle-card-view.js` **[Editable]**, `src/styles/components/surface-polish.css` **[Editable]**, `src/styles/battle/group-cards.css` **[Receipted]** |
| **Gameplay Playbook** (`#view-gameplay`, `#gameplayItemDialog`) | Giant green banner eats vertical height; `"实际效果"` eyebrow & `"→"` arrows on all 28 cards; heavy gradient badges on Events; `❌` close button + depth-3 nesting in `#gameplayItemDialog` | Compact Tier-1 page header; remove `"实际效果"` eyebrow & `"→"` arrows; replace multi-stop gradients on `EV01..EV16` badges with tinted semantic tiles; unify `.ui-window-close` `×` on `#gameplayItemDialog` | `src/styles/classroom/gameplay-page.css` **[Editable]**, `src/ui/gameplay-page.js` **[Editable]**, `src/ui/gameplay-item-dialog.js` **[Editable]** |
| **History Timeline** (`#view-history`) | Giant banner; `持续状态` table column displays raw JSON `{"booShield":0,...}`; `"查看快照 →"` arrow; overlapping `05` watermark | Compact header; format status diff into human-readable tags (`"无状态"` / `"无敌 · 剩 3 轮"`); remove `→` arrow & awkward index watermark; flatten `.ui-snapshot-note` | `src/ui/desktop.js` **[Editable]**, `src/styles/components/surface-polish.css` **[Editable]** |
| **Archives & 60 Achievements** (`#view-archives`) | Giant banner; `道具与答题统计` renders raw JSON `{"used":6,"hits":4}`; bottom action buttons clip near scroll edge; redundant KPI cards + gradient emblems in Achievement Hall | Compact header; format `itemStats` (`"使用 6 次 · 命中 4 次"`); unify `.ach-view-switch` & `.ach-cat-pills` to `.gp-tabs`/`.gp-chip`; soften achievement emblems; ensure bottom padding | `src/ui/desktop.js` **[Editable]**, `src/ui/achievement-archive.js` **[Editable]**, `src/styles/classroom/gameplay-page.css` **[Editable]** |
| **AI Copilot & Knowledge Modal** (`#view-ai`, `#aiKnowledgeDialog`) | Messages look identical (user vs assistant); permanent red delete button in sidebar; right sidebar audit/actions crowded; raw `<input type="file">` in Knowledge dialog | Distinct user (right-aligned primary-soft bubble) vs assistant (left-aligned neutral surface) hierarchy; demote delete to secondary/ghost danger; clean 2-section right sidebar; custom file picker button in Knowledge modal | `src/styles/classroom/ai-chat.css` **[Editable]**, `src/ui/ai-chat.js` **[Editable]**, `src/ui/ai-knowledge.js` **[Editable]** |
| **Settings (All 10 Categories)** (`#view-settings`) | `depth 3` nested bordered cards in every panel; inconsistent grouped/ungrouped rows in Motion; tiny `+`/`-` pills on disclosures; orphan note box in Students; MKWorld table tight spacing | Flatten `.ui-settings-row` inside `.ui-settings-group` (hairline dividers instead of inner card borders); unify Motion/Welcome/Sound groups; right-align chevron on disclosures; clean Students toolbar & row grouping; polish MKWorld simulator table | `src/styles/components/surface-polish.css` **[Editable]**, `src/styles/settings/save-workspace.css` **[Editable]**, `src/styles/settings/item-draw-settings.css` **[Editable]**, `src/ui/settings-layout.js` **[Editable]** |
| **Hand-Raise Flow** (`#handRaiseBackdrop`, `hand-flow-shade`) | **Duplicate top-right close buttons** (`退出举手 ×` + circular `×`); heavy backdrop shadow | Remove duplicate `.ui-window-close` injection on `#handRaiseBackdrop` (keep single clean close button); align card press/hover tokens | `src/ui/hand-flow-view.js` / `src/ui/desktop.js` **[Editable]**, `src/styles/classroom/hand-flow.css` **[Editable]** |
| **Group Item Window** (`#itemModalBackdrop`) | **Depth-4 card nesting** (`自由颜色` card inside `基本信息` card inside modal); `删除小组` button clipped at bottom; plain `×` close | Flatten inner sections to hairline-separated blocks (`depth <= 2`); use unified `.ui-window-close`; add proper bottom scroll spacing | `src/runtime/items/group-window.js` **[Editable]**, `src/styles/components/surface-polish.css` **[Editable]** |
| **Picker, Score, Quick Person, Member Search, Confirmations, Recovery** | 4 different modal close button styles; `quick-person` & `picker` lack unified header/radius/active feedback; `classroomRecoveryTools` depth-3 nesting | Unify modal headers, `.ui-window-close`, `--radius-lg` card, `:active` `scale(0.97)` on all quick score/filter chips, flatten recovery candidate rows | `src/styles/components/surface-polish.css` **[Editable]**, `src/ui/classroom-recovery.js` **[Editable]**, `src/styles/classroom/student-picker-hand.css` **[Receipted]** |
| **Electron Floating Surfaces** (`picker.html`, `effect.html` / `hand-cards`) | `picker.html` uses custom palette/radii slightly out of sync with Classic/Marx tokens (`border-radius: 3px/9px/12px/20px`); `hand-cards` uses `❌` emoji in `退出举手 ❌` | Sync `--ease-out`, `--radius-sm/md/lg`, `:active` `scale(0.97)`, clean SVG close icon instead of `❌` emoji in `hand-cards.js`, Classic/Marx parity | `g:\GodPower\godpower-electron\renderer\picker.css` **[Editable]**, `g:\GodPower\godpower-electron\renderer\hand-cards.css` & `hand-cards.js` **[Editable]** |

---

## 4. Phase 2 Execution Order (For Implementers)

1. **Step 1 — Unified Component Library First**: Create `src/styles/components/unified-primitives.css` (registered in `src/index.template.html` + `src/manifest.json`), update `src/styles/components/surface-polish.css` and `src/ui/component-library.js`, and verify in `#componentLibraryModal` (Classic + Marx).
2. **Step 2 — Motion & CSS Root-Cause Fixes**: Fix the 11 `transition: all`, 1 `scale(0)`, 4 `width` animations, and `:active` / `@media (hover: hover)` rules, recording exact receipts in `artifacts/classroom-hotfix-3.0.72/style-owner-edits.json` for any touched 3.0.66 checkpointed file so `npm run test:css-governance` stays 100% green.
3. **Step 3 — Surface-by-Surface Migration**:
   - Modals & Dialogs (`#handRaiseBackdrop` duplicate close fix, `#itemModalBackdrop` depth flattening, `#gameplayItemDialog`, `#aiKnowledgeDialog`, confirmation/score/picker/quick-person dialogs).
   - Settings (all 10 categories: flatten nested row cards, unify disclosures & Students/Items/Sound/Motion layouts).
   - Collection & Playbook Pages (`#view-gameplay`, `#view-history`, `#view-archives`, `#view-ai`: compact headers, human-readable table cells, refined badges).
   - Welcome & 14-Group Battle (`#view-welcome`, `#view-battle` preserving 14-group geometry & FLIP).
   - Electron Floating Surfaces (`picker.css`, `hand-cards.css`, `hand-cards.js`).
4. **Step 4 — After-Phase Verification**: Run `npm run build`, `npm run check`, `npm run test:css-governance`, `npm run test:component-library`, `npm run test:ui`, and `node scripts/capture-all-surfaces.mjs --phase=after` to compare before/after screenshots and confirm `maxCardDepth <= 2`, `transitionAll === 0`, `scaleZero === 0`, `layoutAnimations === 0`, and `0` regressions.
