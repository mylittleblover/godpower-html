function playChiptuneSynth(slotId) {
  const buttonTone = ActionSounds.slots.find((x) => x.id === slotId);
  if (buttonTone) slotId = "ui_click";
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    switch (slotId) {
      case "score_add": {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(getFxOutputV2176());
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case "score_sub": {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(getFxOutputV2176());
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case "big_win": {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + idx * 0.07 + 0.35,
          );
          osc.connect(gain);
          gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.35);
        });
        break;
      }
      case "rewind": {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(getFxOutputV2176());
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case "pk_correct": {
        [523.25, 783.99].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.2, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + idx * 0.09 + 0.25,
          );
          osc.connect(gain);
          gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.25);
        });
        break;
      }
      case "allin_win": {
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.22, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + idx * 0.08 + 0.35,
          );
          osc.connect(gain);
          gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
        break;
      }
      case "allin_lose": {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(getFxOutputV2176());
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case "ui_click": {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(buttonTone?.pitch || 1200, now);
        gain.gain.setValueAtTime(
          0.1 *
            (typeof ClassroomFeedback !== "undefined"
              ? ClassroomFeedback.getOptions().clickVolume
              : 1),
          now,
        );
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(getFxOutputV2176());
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
      case "roll_tick": {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.connect(gain);
        gain.connect(getFxOutputV2176());
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }
      case "roll_win": {
        [1046.5, 1567.98].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(getFxOutputV2176());
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.35);
        });
        break;
      }
    }
  } catch (e) {}
}

async function playSound(slotId) {
  try {
    await getAudioContext();
    if (!fxSoundsLoaded) await loadFxSounds();
    const selectedFx =
      selectFxBuffer(slotId) ||
      (ActionSounds.isClick(slotId) && slotId !== "ui_click"
        ? selectFxBuffer("ui_click")
        : null);
    if (selectedFx) {
      const source = audioCtx.createBufferSource();
      source.buffer = selectedFx;
      if (
        ActionSounds.isClick(slotId) &&
        typeof ClassroomFeedback !== "undefined"
      ) {
        const gain = audioCtx.createGain();
        gain.gain.value = ClassroomFeedback.getOptions().clickVolume;
        source.connect(gain);
        gain.connect(getFxOutputV2176());
        ClassroomFeedback.ownClickVoice(source, gain);
      } else source.connect(getFxOutputV2176());
      source.start(0);
    } else {
      playChiptuneSynth(
        {
          fullscreen_pick: "roll_win",
          fullscreen_score_add: "score_add",
          fullscreen_score_sub: "score_sub",
        }[slotId] || (slotId === "roll_loop" ? "roll_tick" : slotId),
      );
    }
  } catch (_) {}
}
