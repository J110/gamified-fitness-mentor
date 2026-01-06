import { useMemo, useState } from "react";

/**
 * Hook: useChapterView
 * - Keeps currentChapter in state
 * - Returns cards + mentorMessage based on chapter + stage + progress
 */
export function useChapterView({ getStageForChapter, selectCardsForChapter, buildMentorText }) {
  const [currentChapter, setCurrentChapter] = useState("HEALTH");
  const stage = useMemo(() => getStageForChapter(currentChapter), [currentChapter, getStageForChapter]);

  const cards = useMemo(
    () => selectCardsForChapter(currentChapter, stage, 3),
    [currentChapter, stage, selectCardsForChapter]
  );

  const mentorText = useMemo(
    () => buildMentorText(currentChapter, stage, cards),
    [currentChapter, stage, cards, buildMentorText]
  );

  return { currentChapter, setCurrentChapter, stage, cards, mentorText };
}
