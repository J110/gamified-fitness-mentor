// === Chapter Tabs + Chapter View Renderer (Vanilla JS) ===
//
// Expected globals / state:
// state.currentChapter (string)
// state.chapterTracking[chapter], state.progress
// getStageForChapter(chapter)
// selectCardsForChapter(chapter, stage, n)
// renderSkillCards(cards)
// renderMentorNarrative(chapter, stage, cards)

function bindChapterTabs() {
  document.querySelectorAll('[data-chapter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentChapter = btn.dataset.chapter;
      renderChapterView();
    });
  });
}

function renderChapterView() {
  const chapter = state.currentChapter || 'HEALTH';
  highlightActiveChapterTab(chapter);

  const stage = getStageForChapter(chapter);
  const cards = selectCardsForChapter(chapter, stage, 3);

  renderSkillCards(cards);
  renderMentorNarrative(chapter, stage, cards);
}

function highlightActiveChapterTab(chapter) {
  document.querySelectorAll('[data-chapter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.chapter === chapter);
  });
}
