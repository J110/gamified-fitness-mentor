// === Mentor Narrative Selection + Variable Interpolation (Vanilla JS) ===
//
// Works with either:
// A) flat array of scripts: {chapter, stage, variant, tone, template}
// B) nested object: scripts[chapter][stage][variant] -> array of templates
//
// Required DOM: #mentorNarrative

function renderMentorNarrative(chapter, stage, cards) {
  const variant = chooseVariant(); // base|recovery|challenge
  const script = pickMentorScript(chapter, stage, variant) || pickMentorScript(chapter, stage, 'base');

  const vars = {
    weak_metric_hint: getWeakMetricHint(chapter),
    recent_win: state.lastWinTitle || '',
    card_title: cards?.[0]?.title || '',
    stage_label: stageLabel(stage),
    chapter_label: chapterLabel(chapter)
  };

  const message = interpolate(script?.template || fallbackMentorText(chapter, stage), vars);
  document.querySelector('#mentorNarrative').textContent = message;

  // OPTIONAL: trigger D-ID video generation
  // generateMentorVideo(message);
}

function interpolate(tpl, vars) {
  return (tpl || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (_,k) => (vars[k] ?? ''));
}
