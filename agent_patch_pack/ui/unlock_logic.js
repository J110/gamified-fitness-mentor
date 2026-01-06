// === Unlock Logic (drop-in) ===
//
// Call computeUnlocks() after progress updates, then applyUnlocksToUI().

function computeUnlocks() {
  const unlocks = new Set(state.unlocks || []);

  if (state.progress.momentum >= 20) unlocks.add('VOICE_ENERGETIC');
  if (state.progress.mentorTrust >= 15) unlocks.add('VOICE_DEEP');
  if (state.progress.mentorTrust >= 10) unlocks.add('AVATAR_BRIGHT');
  if (state.progress.momentum >= 35) unlocks.add('AVATAR_PRO');

  state.unlocks = Array.from(unlocks);
}

function applyUnlocksToUI() {
  setLocked('[data-voice="energetic"]', !state.unlocks.includes('VOICE_ENERGETIC'));
  setLocked('[data-voice="deep"]', !state.unlocks.includes('VOICE_DEEP'));
  setLocked('[data-style="bright"]', !state.unlocks.includes('AVATAR_BRIGHT'));
  setLocked('[data-style="pro"]', !state.unlocks.includes('AVATAR_PRO'));
}

function setLocked(selector, locked) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.disabled = locked;
    btn.classList.toggle('locked', locked);
    btn.classList.toggle('unlocked', !locked);
  });
}
