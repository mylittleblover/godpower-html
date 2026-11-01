# Floating classroom tools plan

Latest user decisions: bottom dock Picker opens the internal program picker, never automatically starts the floating window. Floating icon is an independent launcher: click chooses Picker or Hand; hand group selection, correct/wrong and rewards run inside the floating window. Fix independent taskbar entry and ordinary fullscreen video/PPT z-order without stealing presentation focus.

Baselines: HTML b6981f9, Electron fff94ea, both verified 3.0.63 candidates. Work on isolated fix/20261101-floating-tools branches. Planned version 3.0.64.

- [ ] Reproduce footer redirection and window-option defects with regression tests.
- [ ] DeepSeek Flash implements Electron windows/menu/renderer/contracts/tests in isolated worker; GPT inspects full patch and independently tests before accepting snapshot. Network disabled; no automatic merge. If Windows account spawning remains broken, report actual blockage, never pretend mock is real work.
- [ ] GPT implements authoritative main-renderer hand command port and exact hand session contract; use existing classroom command transactions, score rules and draw policies, no floating-window data owner.
- [ ] Dock controls keep internal modal; bridge-created picker engine DOM remains available but hidden for external selections. Explicit independent-window launcher remains.
- [ ] Validate hand session tokens after class/group/season changes, busy/locked/wrong-answer restrictions, repeated reward/duplicate transport, quota rollback and stale requests.
- [ ] Browser regression internal versus external picker, hand controls and existing item/state rules; Electron contract/window tests. Test actual fullscreen video/PPT z-order if runtime is available; state any untested hardware/exclusive-fullscreen limits.
- [ ] Build/check, commit and sync exact HTML to Electron, verify hashes/version, export test artifact and concise evidence report. Do not push or merge original development branches.

Contract sent to worker: snapshot.hand = {selectionId:string|null,groupId:integer|null,correct:boolean|null,itemRewarded:boolean,busy:boolean,inventoryCount:0..3,canDraw:boolean,itemName:string}. Commands: handSelect {groupId}; handJudge {groupId,selectionId,correct}; handScore {groupId,selectionId,delta}; handDraw {groupId,selectionId}. Existing Broker owns role authorization, epochs and duplicate transport receipts. Main port validates session identity, groupUid and season; state remains in main renderer and persistence is atomic.
