/* Authoritative, presentation-neutral picker port. All commands reuse the existing classroom engine. */
window.GodpowerPicker = (() => {
  'use strict';
  let phase = 'idle', serial = 0, resultId = null, preparing = false, external = false, externalEffects = true;
  const listeners = new Set();
  function notify(next) {
    if (next === 'rolling') resultId = `pick-${Date.now()}-${++serial}`;
    if (next === 'idle' || next === 'cancelled') { next = 'idle'; resultId = null; }
    if (next) phase = next;
    const snapshot = getSnapshot();
    for (const listener of listeners) { try { listener(snapshot); } catch (e) { console.error('Picker observer failed', e); } }
    return snapshot;
  }
  function currentResult() {
    const win = slotEngine.chosenResult;
    if (!win || !resultId) return null;
    const source = state.picker.mode === 'group' ? win : win.group;
    const group = state.groups.find(g => g.id === source?.id);
    if (!group || group !== source || (state.picker.mode !== 'group' && !group.members?.includes(win.memberName))) return null;
    const student = state.picker.mode === 'group' ? null : parseStudentV218(win.memberName);
    const avatarDataUrl = state.picker.mode === 'group'
      ? window.ClassroomAvatarDisplay?.groupDataUrlCached(group) || ''
      : window.ClassroomAvatarDisplay?.studentDataUrl(group, win.memberName, win.memberIndex) || '';
    return { id: resultId, mode: state.picker.mode, groupId: group.id, groupName: group.name,
      groupNo: group.groupNo || group.id, color: group.color, score: group.score,
      name: student?.name || group.name, number: student?.number ?? null,
      avatarDataUrl,
      memberName: state.picker.mode === 'group' ? null : win.memberName };
  }
  function getSnapshot() {
    const actual = slotEngine.isSpinning ? 'rolling' : phase;
    const result = ['settling', 'revealed'].includes(actual) ? currentResult() : null;
    const options = ClassroomFeedback.getOptions(), motion = DesktopUI.getPreferences();
    const effectEnabled = options.pickEffects && motion.motion !== 'off' &&
      (window.godpowerDesktop?.role !== 'main' || (external && externalEffects)) &&
      !(motion.systemMotion && matchMedia('(prefers-reduced-motion: reduce)').matches);
    return { protocolVersion: 1, theme: window.GodpowerTheme?.get() || 'classic', phase: !slotEngine.isSpinning && !slotEngine.chosenResult && !preparing ? 'idle' : actual,
      mode: state.picker.mode, antiRepeat: !!state.picker.antiRepeat,
      preselectedGroupIds: [...(state.picker.preselectedGroupIds || [])],
      remaining: document.getElementById('poolStatusText')?.textContent || '',
      preview: { group: document.getElementById('reelTextGroup')?.textContent || '',
        student: document.getElementById('reelTextStudent')?.textContent || '' },
      groups: state.groups.map(g => ({ id: g.id, name: g.name, color: g.color, members: g.members?.length || 0, score: g.score })),
      result, slots: options.slots,
      history: (state.itemGlobal?.pickerHistory || []).slice(-30).map(x => ({ text: x.text, time: x.time })),
      locked: !!state.isLocked, unsaved: !!window.classroomUnsavedChanges,
      effects: { enabled: effectEnabled, style: options.style, duration: options.duration } };
  }
  function cancel() {
    clearInterval(slotEngine.timerGroup); clearInterval(slotEngine.timerStudent);
    slotEngine.isSpinning = false; slotEngine.chosenResult = null;
    DesktopUI.cancelPickerPreparation(); stopRollLoop(); resetSlotDisplay();
    return notify('cancelled');
  }
  async function command(action, payload = {}) {
    if (action === 'cancel') { cancel(); return { ok: true }; }
    if (action === 'stop') {
      if (preparing) cancel();
      else if (slotEngine.isSpinning) stopSlotSpin();
      return { ok: true, phase: getSnapshot().phase };
    }
    if (preparing || slotEngine.isSpinning || phase === 'settling') return { ok: false, error: 'BUSY' };
    if (action === 'start') {
      preparing = true; notify('preparing');
      try {
        openPickerModal({internal:true});
        await DesktopUI.togglePicker();
        return { ok: slotEngine.isSpinning, error: slotEngine.isSpinning ? undefined : 'NOT_STARTED' };
      } finally { preparing = false; if (!slotEngine.isSpinning) notify('idle'); }
    }
    if (action === 'mode') {
      if (!['individual', 'group', 'two_tier'].includes(payload.mode)) return { ok: false, error: 'INVALID_MODE' };
      setPickerMode(payload.mode); saveState(); notify('idle');
    } else if (action === 'antiRepeat') {
      if (typeof payload.enabled !== 'boolean') return { ok: false, error: 'INVALID_VALUE' };
      toggleAntiRepeat(payload.enabled); notify();
    } else if (action === 'preselect') {
      if (!state.groups.some(g => g.id === payload.groupId)) return { ok: false, error: 'INVALID_GROUP' };
      toggleGroupPreselect(payload.groupId); notify('idle');
    } else if (action === 'resetPool') {
      resetPickerPool(); notify();
    } else if (action === 'score') {
      const result = currentResult(), delta = payload.delta;
      if (state.isLocked) return { ok: false, error: 'LOCKED' };
      if (phase !== 'revealed' || !result || result.id !== payload.resultId) return { ok: false, error: 'STALE_RESULT' };
      if (!Number.isSafeInteger(delta) || !delta || !Number.isSafeInteger(result.score + delta)) return { ok: false, error: 'INVALID_SCORE' };
      if (classroomCommands.isPending()) return { ok: false, error: 'BUSY' };
      applyScoreDelta(result.groupId, delta); syncPickerScoreTarget(); notify();
    } else return { ok: false, error: 'UNKNOWN_COMMAND' };
    return { ok: true, persisted: !window.classroomUnsavedChanges };
  }
  return Object.freeze({ invalidate: cancel, command, getSnapshot, notify, isSettling: () => phase === 'settling',
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    setExternalEffectsEnabled(value) { externalEffects = value === true; },
    setExternalPresentation(value) { external = value === true; }, isExternalPresentation: () => external });
})();
