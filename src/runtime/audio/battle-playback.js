let activeLoopTimeouts = [];
function clearAllLoopTimeouts() {
  activeLoopTimeouts.forEach((id) => clearTimeout(id));
  activeLoopTimeouts = [];
}

function scheduleDualLoopChunk(startTime, offsetSec) {
  if (
    bgmEngine.state === "IDLE" ||
    bgmEngine.state === "VICTORY" ||
    bgmEngine.state === "NO_TRACKS"
  )
    return;

  const battleBuf = activeSetBuffers["battle"];
  const thinkBuf = activeSetBuffers["thinking"];
  if (!battleBuf && !thinkBuf) return;

  const secPerBeat = getSecPerBeat();
  const loopStartSec = 8 * secPerBeat;
  const loopEndSec = 184 * secPerBeat;
  const chunkDuration = loopEndSec - offsetSec;

  const now = audioCtx.currentTime;
  const actualStart = Math.max(now, startTime);

  if (battleBuf) {
    const bSrc = audioCtx.createBufferSource();
    bSrc.buffer = battleBuf;
    bSrc.connect(bgmEngine.battleGain);
    bSrc.start(actualStart, offsetSec);
    bSrc.stop(actualStart + chunkDuration);
    bgmEngine.activeNodes.push(bSrc);
  }

  if (thinkBuf) {
    const tSrc = audioCtx.createBufferSource();
    tSrc.buffer = thinkBuf;
    tSrc.connect(bgmEngine.thinkingGain);
    tSrc.start(actualStart, offsetSec);
    tSrc.stop(actualStart + chunkDuration);
    bgmEngine.activeNodes.push(tSrc);
  }

  const nextStartTime = actualStart + chunkDuration;
  const delayMs = Math.max(
    0,
    (nextStartTime - audioCtx.currentTime - 0.25) * 1000,
  );

  const timerId = setTimeout(() => {
    scheduleDualLoopChunk(nextStartTime, loopStartSec);
  }, delayMs);

  activeLoopTimeouts.push(timerId);
}

async function bgmStartNewRoundMusicWithProgress(onProgress) {
  try {
    onProgress(10);
    await getAudioContext();
    onProgress(20);
    bgmStopAll();

    if (bgmEngine.preloadedSet && bgmEngine.preloadedSet.setIndex !== -1) {
      currentSetIndex = bgmEngine.preloadedSet.setIndex;
      activeSetBuffers = bgmEngine.preloadedSet.buffers;
      bgmEngine.preloadedSet = null;
      onProgress(80);
    } else {
      const { setIndex } = await pickNextPlayableSetIndex();
      currentSetIndex = setIndex;
      onProgress(40);
      if (currentSetIndex === -1) {
        bgmEngine.state = "NO_TRACKS";
        onProgress(100);
        return;
      }
      activeSetBuffers = await fetchAndDecodeSetBuffers(
        currentSetIndex,
        onProgress,
      );
    }

    onProgress(90);
    const now = audioCtx.currentTime + 0.05;

    let chosenIntroKey = "intro_normal";
    if (state.lastRoundAllIn) {
      const { wins, losses } = state.lastRoundAllIn;
      if (losses > 0) {
        chosenIntroKey = "intro_loss";
      } else if (wins > 0 && losses === 0) {
        chosenIntroKey = "intro_win";
      } else {
        chosenIntroKey = "intro_normal";
      }
    }

    const introBuf =
      activeSetBuffers[chosenIntroKey] || activeSetBuffers["intro_normal"];
    const thinkBuf = activeSetBuffers["thinking"];
    const battleBuf = activeSetBuffers["battle"];

    if (introBuf) {
      const introSrc = audioCtx.createBufferSource();
      introSrc.buffer = introBuf;
      introSrc.connect(musicGainNode);
      introSrc.start(now);
      bgmEngine.activeNodes.push(introSrc);
    }

    if (thinkBuf || battleBuf) {
      bgmEngine.syncStartTime = now;
      const ratioMet = checkAllInRatio();
      bgmEngine.state = ratioMet ? "BATTLE" : "THINKING";
      if (bgmEngine.thinkingGain)
        bgmEngine.thinkingGain.gain.setValueAtTime(ratioMet ? 0 : 1, now);
      if (bgmEngine.battleGain)
        bgmEngine.battleGain.gain.setValueAtTime(ratioMet ? 1 : 0, now);

      scheduleDualLoopChunk(now, 0);
    }

    onProgress(100);

    setTimeout(() => {
      bgmPreloadNextSet();
    }, 1000);
  } catch (e) {
    onProgress(100);
  }
}

function bgmTransitionThinkingToBattle() {
  if (bgmEngine.state !== "THINKING" || currentSetIndex === -1) return;
  try {
    getAudioContext();

    const now = audioCtx.currentTime;
    const secPerBeat = getSecPerBeat();
    const currentBeat = getTrackCurrentBeat();
    const beatInBar = currentBeat % 4;
    const beatsToNextBar = 4 - beatInBar;
    const effBeats =
      beatsToNextBar + (Number(menuCfg.battleTransitionLeadBeats) || 0);

    let triggerTime, transitionBeats, transKey;

    if (effBeats > 3.999) {
      triggerTime = now;
      transitionBeats = 4;
      transKey = "trans_3";
    } else if (effBeats < 1.0) {
      triggerTime = now + beatsToNextBar * secPerBeat;
      transitionBeats = 4;
      transKey = "trans_3";
    } else if (effBeats < 2.0) {
      const timeToNextBeat =
        (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
      triggerTime =
        now +
        (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
      transitionBeats = 1;
      transKey = "trans_0";
    } else if (effBeats < 3.0) {
      const timeToNextBeat =
        (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
      triggerTime =
        now +
        (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
      transitionBeats = 2;
      transKey = "trans_1";
    } else {
      const timeToNextBeat =
        (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
      triggerTime =
        now +
        (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
      transitionBeats = 3;
      transKey = "trans_2";
    }

    const transBuf = activeSetBuffers[transKey];
    const exactTransDuration = transitionBeats * secPerBeat;

    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    bgmEngine.thinkingGain.gain.cancelScheduledValues(now);
    bgmEngine.battleGain.gain.cancelScheduledValues(now);

    const curThink = bgmEngine.thinkingGain.gain.value;
    bgmEngine.thinkingGain.gain.setValueAtTime(curThink, now);
    if (triggerTime > now) {
      bgmEngine.thinkingGain.gain.setValueAtTime(1, triggerTime);
    }
    bgmEngine.thinkingGain.gain.linearRampToValueAtTime(0, triggerTime + 0.05);

    if (transBuf) {
      const transSrc = audioCtx.createBufferSource();
      transSrc.buffer = transBuf;
      transSrc.connect(musicGainNode);
      transSrc.start(triggerTime);
      bgmEngine.activeNodes.push(transSrc);
    }

    bgmEngine.state = "TRANSITION";

    const battleResumeTime = triggerTime + exactTransDuration;
    const battleFadeInStart = Math.max(triggerTime, battleResumeTime - 0.05);

    const curBattle = bgmEngine.battleGain.gain.value;
    bgmEngine.battleGain.gain.setValueAtTime(curBattle, now);
    if (battleFadeInStart > now) {
      bgmEngine.battleGain.gain.setValueAtTime(0, battleFadeInStart);
    }
    bgmEngine.battleGain.gain.linearRampToValueAtTime(1, battleResumeTime);

    bgmEngine.transitionTimer = setTimeout(
      () => {
        bgmEngine.transitionTimer = null;
        if (bgmEngine.state === "TRANSITION") {
          const stillAllIn = checkAllInRatio();
          if (stillAllIn) {
            bgmEngine.state = "BATTLE";
          } else {
            bgmTransitionBattleToThinking();
          }
        }
      },
      Math.max(0, (battleResumeTime - audioCtx.currentTime) * 1000),
    );
  } catch (e) {}
}

function bgmTransitionBattleToThinking() {
  if (currentSetIndex === -1) return;
  try {
    getAudioContext();

    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    const now = audioCtx.currentTime;
    const secPerBeat = getSecPerBeat();
    const currentBeat = getTrackCurrentBeat();
    const timeToNextBeat = (Math.ceil(currentBeat) - currentBeat) * secPerBeat;
    const triggerTime =
      now +
      (timeToNextBeat < 0.005 ? timeToNextBeat + secPerBeat : timeToNextBeat);
    const fadeDuration = getSecPerBar() * 0.5;

    bgmEngine.battleGain.gain.cancelScheduledValues(now);
    bgmEngine.thinkingGain.gain.cancelScheduledValues(now);

    const curBattle = bgmEngine.battleGain.gain.value;
    const curThink = bgmEngine.thinkingGain.gain.value;

    bgmEngine.battleGain.gain.setValueAtTime(curBattle, now);
    if (triggerTime > now) {
      bgmEngine.battleGain.gain.setValueAtTime(curBattle, triggerTime);
    }
    bgmEngine.battleGain.gain.linearRampToValueAtTime(
      0,
      triggerTime + fadeDuration,
    );

    bgmEngine.thinkingGain.gain.setValueAtTime(curThink, now);
    if (triggerTime > now) {
      bgmEngine.thinkingGain.gain.setValueAtTime(curThink, triggerTime);
    }
    bgmEngine.thinkingGain.gain.linearRampToValueAtTime(
      1,
      triggerTime + fadeDuration,
    );

    bgmEngine.state = "THINKING";
  } catch (e) {}
}

function bgmTriggerVictory(callback) {
  if (bgmEngine.state === "IDLE" || currentSetIndex === -1) {
    if (callback) callback();
    return;
  }
  try {
    getAudioContext();

    const victoryBuf = activeSetBuffers["victory"];
    const now = audioCtx.currentTime;
    const secPerBeat = getSecPerBeat();
    const currentBeat = getTrackCurrentBeat();
    const beatInBar = currentBeat % 4;
    const beatsToNextBar = 4 - beatInBar;
    const triggerTime = now + beatsToNextBar * secPerBeat;

    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    clearAllLoopTimeouts();

    bgmEngine.battleGain.gain.cancelScheduledValues(now);
    bgmEngine.thinkingGain.gain.cancelScheduledValues(now);

    const currentBattleVol = bgmEngine.battleGain.gain.value;
    const currentThinkingVol = bgmEngine.thinkingGain.gain.value;

    bgmEngine.battleGain.gain.setValueAtTime(currentBattleVol, now);
    if (triggerTime > now) {
      bgmEngine.battleGain.gain.setValueAtTime(currentBattleVol, triggerTime);
    }
    bgmEngine.battleGain.gain.linearRampToValueAtTime(0, triggerTime + 0.05);

    bgmEngine.thinkingGain.gain.setValueAtTime(currentThinkingVol, now);
    if (triggerTime > now) {
      bgmEngine.thinkingGain.gain.setValueAtTime(
        currentThinkingVol,
        triggerTime,
      );
    }
    bgmEngine.thinkingGain.gain.linearRampToValueAtTime(0, triggerTime + 0.05);

    bgmEngine.victoryFadeTimer = setTimeout(
      () => {
        bgmEngine.victoryFadeTimer = null;
        if (bgmEngine.battleSource) {
          try {
            bgmEngine.battleSource.stop();
          } catch (e) {}
          bgmEngine.battleSource = null;
        }
        if (bgmEngine.thinkingSource) {
          try {
            bgmEngine.thinkingSource.stop();
          } catch (e) {}
          bgmEngine.thinkingSource = null;
        }
        bgmEngine.activeNodes.forEach((item) => {
          if (item !== bgmEngine.victoryNode) {
            try {
              item.stop();
            } catch (e) {}
          }
        });
      },
      Math.max(0, (triggerTime + 0.055 - now) * 1000),
    );

    if (victoryBuf) {
      const victorySrc = audioCtx.createBufferSource();
      victorySrc.buffer = victoryBuf;
      victorySrc.loop = false;
      victorySrc.connect(musicGainNode);
      victorySrc.start(triggerTime);
      bgmEngine.victoryNode = victorySrc;
      bgmEngine.state = "VICTORY";

      victorySrc.onended = () => {
        if (bgmEngine.state === "VICTORY") {
          bgmStopAll();
          if (callback) callback();
        }
      };
    } else {
      bgmEngine.victoryTimer = setTimeout(
        () => {
          bgmEngine.victoryTimer = null;
          if (bgmEngine.state === "VICTORY") {
            bgmStopAll();
            if (callback) callback();
          }
        },
        Math.max(0, (triggerTime - now + 3.0) * 1000),
      );
    }
  } catch (e) {
    if (callback) callback();
  }
}

function bgmStopAll() {
  try {
    clearAllLoopTimeouts();
    if (bgmEngine.victoryTimer) {
      clearTimeout(bgmEngine.victoryTimer);
      bgmEngine.victoryTimer = null;
    }
    if (bgmEngine.victoryFadeTimer) {
      clearTimeout(bgmEngine.victoryFadeTimer);
      bgmEngine.victoryFadeTimer = null;
    }
    if (bgmEngine.transitionTimer) {
      clearTimeout(bgmEngine.transitionTimer);
      bgmEngine.transitionTimer = null;
    }

    if (bgmEngine.victoryNode) {
      bgmEngine.victoryNode.onended = null;
      try {
        bgmEngine.victoryNode.stop();
      } catch (e) {}
      bgmEngine.victoryNode = null;
    }

    bgmEngine.activeNodes.forEach((item) => {
      if (item) {
        item.onended = null;
        try {
          item.stop();
        } catch (e) {}
      }
    });
    bgmEngine.activeNodes = [];

    if (audioCtx && bgmEngine.battleGain && bgmEngine.thinkingGain) {
      const now = audioCtx.currentTime;
      bgmEngine.battleGain.gain.cancelScheduledValues(now);
      bgmEngine.thinkingGain.gain.cancelScheduledValues(now);
      bgmEngine.battleGain.gain.setValueAtTime(0, now);
      bgmEngine.thinkingGain.gain.setValueAtTime(0, now);
    }
  } catch (e) {}

  bgmEngine.state = "IDLE";
}
