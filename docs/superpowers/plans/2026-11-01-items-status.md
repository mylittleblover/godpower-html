# Two items and seven statuses implementation plan

User authorization: implement competition rules design sections 4–5, using supplied Kamek and Item Box images; both new items are midfield draws. Start from verified HTML candidate 71ca77e (latest remote d97b44d plus reviewed governance).

Architecture: additive competitionEffects for five negative states, separate from legacy itemEffect defense counters. Existing classroom commands own persistence, undo, and acquisition facts. No automatic event engine or individual participant migration in this change. Preserve legacy scoring rounding and existing boomerang one-fifth loss exactly once. Freeze uses the two-answer duration, including Ice Flower.

Latest user amendment supersedes the old 25–50% bonus proposal: star/mega retain three defenses and multiply TOTAL score by 2 for an ordinary correct answer or 3 for a correct All In; wrong answers preserve score, including failed All In. User explicitly confirmed 20 → 40 / 60. Answer effects last until the third defense expires; no answer-duration expiration or compounding. Existing item activation/primary-slot rules are retained.

Further user amendments: hand-page item use replaces its result banner with a fullscreen attacker-left/defender-right cinematic after durable acknowledgment. Score changes use a card-wide theme-color expansion, centered/enlarged score, simultaneous delta/count update, then return; light/dark fill uses black/white ink. Static light-theme scores retain theme ink with black outline and no colored background. Encyclopedia and every item list use the same new grouping/order.

- [x] Pure seven-status engine with expiry, refresh, cleanse, score and dizziness tests.
- [x] Register kamek and item_box before inventory normalization; embed exact supplied PNGs, central enumeration and midfield weights.
- [x] Integrate actual hit outcomes, Kamek defenses, transactional box rewards and domain events.
- [x] Integrate round scoring, freeze use cancellation, individual/batch All In denial, status views and resets.
- [x] Primary audit of encyclopedia/copy/settings/audio/icons/achievement collection/backup and legacy lists; DeepSeek blocked by Windows 1909, inspected empty diff and discarded; no completed independent audit claimed.
- [x] Browser transaction/undo/reload/defense/failure and ranking tests; build/check and existing test regression.
- [x] Sync committed candidate to isolated Electron candidate, verify provenance and 35 tests, export test HTML and report actual limits. Final metadata is stored in the external candidate.json and Electron resources/BUILD_INFO.json.

Choices: new keys kamek/item_box; midfield weight 7 each, zero elsewhere. Negative-state durations: burn2/freeze2/paralysis2/poison3/dizziness2. New icons retain exact input bytes. Existing permanently unlocked achievements remain unlocked; existing 60 achievement IDs are preserved, no invented exclusive achievements for the new items. No pushes or automatic integration.
