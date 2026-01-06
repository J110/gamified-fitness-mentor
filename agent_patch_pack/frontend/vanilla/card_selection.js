// === Skill Card Selection that never returns empty (Vanilla JS) ===
//
// Card schema assumed:
// { id, chapter, stage, title, why, time_min, tracking_targets: [{metric, direction, weight}], cooldown_hours }
//
// Provide:
// - isOnCooldown(cardId): boolean
// - state.chapterTracking[chapter][metric] numeric

function selectCardsForChapter(chapter, stage, n=3) {
  const lib = (window.fullSkillCards && window.fullSkillCards.length) ? window.fullSkillCards : window.skillCards;
  const pool = (lib || []).filter(c => c.chapter === chapter);
  if (!pool.length) return [];

  // strict stage first
  let candidates = pool.filter(c => c.stage === stage);
  if (!candidates.length) candidates = pool;

  // cooldown filter
  let cooldownFiltered = candidates.filter(c => !isOnCooldown(c.id));
  if (!cooldownFiltered.length) cooldownFiltered = candidates;

  const tracking = (state.chapterTracking && state.chapterTracking[chapter]) ? state.chapterTracking[chapter] : {};
  cooldownFiltered.sort((a,b) => scoreCard(b, tracking) - scoreCard(a, tracking));

  return cooldownFiltered.slice(0, n);
}

// Example scoring: favor cards targeting weak metrics (<50)
function scoreCard(card, tracking) {
  let score = 0;
  (card.tracking_targets || []).forEach(t => {
    const val = tracking[t.metric];
    if (typeof val === 'number' && val < 50) score += 2 * (t.weight ?? 1);
  });
  // slight randomness
  score += Math.random() * 0.01;
  return score;
}
