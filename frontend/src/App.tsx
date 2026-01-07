import { useState, useMemo, useEffect } from 'react';
import './App.css';
import type { UserSeed, ChapterStatus, Progress, Chapter, TrackingData } from './types';
import { generateTrackingData } from './lib/tracking';
import { evaluateGamification, getCardsForChapter, getIdentityTitle } from './lib/gamification';
import MentorPanel from './components/MentorPanel';
import ChapterDashboard from './components/ChapterDashboard';

import CustomizationPanel from './components/CustomizationPanel';
import SkillCardItem from './components/SkillCardItem';
import { MENTOR_SCRIPTS, MENTOR_REACTIONS } from './shared/data';

const mentorScriptsData = MENTOR_SCRIPTS;


// Note: Using Unsplash images for reliability

const SAFE_AVATAR_OPTIONS = [
  { id: 'alice', url: 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg', label: 'Alice', voice: 'en-US-JennyNeural' },
  { id: 'amy', url: 'https://d-id-public-bucket.s3.amazonaws.com/jane.png', label: 'Amy', voice: 'en-US-SaraNeural' },
  { id: 'brian', url: 'https://d-id-public-bucket.s3.amazonaws.com/face.jpg', label: 'Brian', voice: 'en-US-DavisNeural' }
];

function App() {
  // State
  const [seed, setSeed] = useState<UserSeed>({
    gender: 'female',
    age: 28,
    profession: 'Engineer',
    work_environment: 'indoor',
    smoker: 'no'
  });

  const [generated, setGenerated] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData>();
  const [chapters, setChapters] = useState<ChapterStatus[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter>('HEALTH');
  const [progress, setProgress] = useState<Progress>({
    momentum: 5,
    mentor_trust: 10,
    unlocks: [],
    identity_title: ""
  });
  const [completedCardIds, setCompletedCardIds] = useState<string[]>([]);
  const [pendingOutcomes, setPendingOutcomes] = useState<Record<string, 'partial' | 'full'>>({});

  const [mentorScript, setMentorScript] = useState("");
  const [triggerMentorCount, setTriggerMentorCount] = useState(0); // Numeric Trigger
  const [didSourceUrl, setDidSourceUrl] = useState<string | null>(SAFE_AVATAR_OPTIONS[0].url);
  const [theme, setTheme] = useState('dark');
  const [mentorVoice, setMentorVoice] = useState(SAFE_AVATAR_OPTIONS[0].voice);

  // Derived state: Cards for ACTIVE chapter
  const cards = useMemo(() => {
    if (!trackingData) return [];
    const currentCh = chapters.find(c => c.id === activeChapter);
    if (!currentCh) return [];
    return getCardsForChapter(activeChapter, currentCh.stage, trackingData, completedCardIds);
  }, [activeChapter, chapters, trackingData, completedCardIds]);


  // Handle Tab Switch: Update Mentor Narrative
  useEffect(() => {
    try {
      if (!generated || !chapters.length) return;

      const currentCh = chapters.find(c => c.id === activeChapter);
      if (currentCh) {
        // Find matching script
        const scriptTemplate = mentorScriptsData.find(s => s.chapter === currentCh.id && s.stage === currentCh.stage);
        let script = scriptTemplate
          ? scriptTemplate.template.replace('{{score}}', currentCh.score.toString())
          : `Reviewing your ${currentCh.id} chapter. You are in the ${currentCh.stage.replace('_', ' ')} stage with a score of ${currentCh.score}. Let's focus on improvement.`;

        setMentorScript(script);
        setTriggerMentorCount(prev => prev + 1);
      }
    } catch (err: any) {
      console.error("Narrative Update Error:", err);
    }
  }, [activeChapter, generated]); // Removed 'chapters' to prevent overwrite on score update

  const handleGenerate = () => {
    try {
      // 1. Generate Data (With Salt)
      const tracking = generateTrackingData(seed, Date.now().toString());
      setTrackingData(tracking);

      // 2. Evaluate
      const chapterResults = evaluateGamification(tracking);
      setChapters(chapterResults);

      // 3. Initial Mentor Script (Lowest Chapter)
      const lowest = [...chapterResults].sort((a, b) => a.score - b.score)[0];

      // Safety check for script logic
      let script = "";
      try {
        // Find matching script for lowest chapter to start
        const scriptTemplate = mentorScriptsData.find(s => s.chapter === lowest.id && s.stage === lowest.stage);
        script = scriptTemplate
          ? scriptTemplate.template.replace('{{score}}', lowest.score.toString())
          : `I've analyzed your life chapters. Your ${lowest.id} score is ${lowest.score}. Let's work on it.`;
      } catch (e) {
        console.warn("Script template error, using fallback", e);
        script = `Start with ${lowest.id}. Score: ${lowest.score}.`;
      }

      setMentorScript(script);
      setTriggerMentorCount(prev => prev + 1);
      setGenerated(true);
      setActiveChapter(lowest.id);
    } catch (err: any) {
      console.error("Generation Error:", err);
      alert("Failed to generate: " + (err.message || err));
    }
  };

  const handleOutcomeChange = (cardId: string, outcome: 'none' | 'partial' | 'full') => {
    setPendingOutcomes(prev => {
      const next = { ...prev };
      if (outcome === 'none') {
        delete next[cardId];
      } else {
        next[cardId] = outcome;
      }
      return next;
    });
  };

  const submitPendingActions = () => {
    if (!trackingData) return;

    let newProgress = { ...progress };
    const newTracking = { ...trackingData };
    const completedIds: string[] = [];

    // Process all pending
    Object.entries(pendingOutcomes).forEach(([cardId, outcome]) => {
      const card = cards.find(c => c.id === cardId);
      if (!card) return;

      // 1. Update Momentum/Trust
      const momBoost = outcome === 'full' ? 2 : 1;
      const trustBoost = outcome === 'full' ? 1 : 0;
      newProgress.momentum += momBoost;
      newProgress.mentor_trust += trustBoost;

      // 2. Update Stats (Demo Mode: Fast Updates)
      // 2. Update Stats (Demo Mode: Fast Updates)
      // Health
      if (card.tags.includes('stress') || card.tags.includes('impulse')) newTracking.stress_level = Math.max(0, newTracking.stress_level - 15);
      if (card.tags.includes('sleep') || card.tags.includes('recovery')) newTracking.sleep_hours = Math.min(10, newTracking.sleep_hours + 2);
      if (card.tags.includes('activity')) newTracking.physical_activity_min = Math.min(100, newTracking.physical_activity_min + 20);
      if (card.tags.includes('metabolic')) newTracking.metabolic_risk = Math.max(0, newTracking.metabolic_risk - 15);

      // Finance
      if (card.tags.includes('spending')) newTracking.spending_control = Math.min(100, newTracking.spending_control + 15);
      if (card.tags.includes('savings')) newTracking.savings_rate = Math.min(100, newTracking.savings_rate + 15);
      if (card.tags.includes('financial_stress')) newTracking.financial_stress = Math.max(0, newTracking.financial_stress - 15);

      // Purpose
      if (card.tags.includes('focus')) newTracking.focus_score = Math.min(100, newTracking.focus_score + 15);
      if (card.tags.includes('direction')) newTracking.direction_clarity = Math.min(100, newTracking.direction_clarity + 15);
      if (card.tags.includes('engagement')) newTracking.work_engagement = Math.min(100, newTracking.work_engagement + 15);

      // Relationships
      if (card.tags.includes('connection')) newTracking.connection_quality = Math.min(100, newTracking.connection_quality + 15);
      if (card.tags.includes('loneliness')) newTracking.loneliness_score = Math.max(0, newTracking.loneliness_score - 20);
      if (card.tags.includes('social')) newTracking.social_support = Math.min(100, newTracking.social_support + 15);

      // 3. Mark Complete
      completedIds.push(cardId);
    });

    setProgress(newProgress);
    setTrackingData(newTracking);

    // 4. Re-evaluate Chapters ONCE
    const newChapters = evaluateGamification(newTracking);
    setChapters(newChapters);

    // 5. Update Completed IDs
    setCompletedCardIds(prev => [...prev, ...completedIds]);

    // 6. Trigger Reaction
    const reaction = MENTOR_REACTIONS[Math.floor(Math.random() * MENTOR_REACTIONS.length)];
    const count = Object.keys(pendingOutcomes).length;
    const multiMsg = count > 1 ? `I see you tackled ${count} actions at once. Impressive.` : reaction;



    setMentorScript(multiMsg);
    setTriggerMentorCount(prev => prev + 1);

    // 7. Clear Pending
    setPendingOutcomes({});
  };

  return (
    <div className={`app-container theme-${theme}`}>
      <header>
        <h1>Gamified Fitness Mentor</h1>
        <button onClick={() => window.location.reload()} className="reset-btn">Reset</button>
      </header>

      <main>
        {!generated ? (
          <section className="setup-section section-card">
            <h2>User Profile</h2>
            <div className="form-grid">
              <label>
                Profession
                <input value={seed.profession} onChange={e => setSeed({ ...seed, profession: e.target.value })} />
              </label>
              <label>
                Age
                <input type="number" value={seed.age} onChange={e => setSeed({ ...seed, age: parseInt(e.target.value) })} />
              </label>
              <label>
                Work Env
                <select value={seed.work_environment} onChange={e => setSeed({ ...seed, work_environment: e.target.value })}>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </label>
              <label>
                Smoker
                <select value={seed.smoker} onChange={e => setSeed({ ...seed, smoker: e.target.value })}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
            </div>
            <div className="avatar-selection">
              <h3>Select Mentor Avatar</h3>
              <div className="avatar-grid">
                {SAFE_AVATAR_OPTIONS.map(opt => (
                  <div
                    key={opt.id}
                    className={`avatar-option ${didSourceUrl === opt.url ? 'selected' : ''}`}
                    onClick={() => {
                      setDidSourceUrl(opt.url);
                      setMentorVoice(opt.voice);
                    }}
                  >
                    <img src={opt.url} alt={opt.label} />
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <br />
            <button className="primary-btn" onClick={handleGenerate}>Generate My Life</button>
          </section>
        ) : (
          <div className="dashboard-layout">
            <div className="left-col">
              <ChapterDashboard
                chapters={chapters}
                activeChapter={activeChapter}
                onSelectChapter={setActiveChapter}
              />

              <section className="skills-section section-card">
                <h2>Suggested Actions ({activeChapter})</h2>
                <div className="cards-list">
                  {cards.map(c => (
                    <SkillCardItem
                      key={c.id}
                      card={c}
                      selectedOutcome={pendingOutcomes[c.id] || 'none'}
                      onChange={(outcome) => handleOutcomeChange(c.id, outcome)}
                    />
                  ))}
                  {cards.length === 0 && <p className="empty-msg">No actions needed right now. Good work!</p>}

                  {/* Batch Submit Button */}
                  {Object.keys(pendingOutcomes).length > 0 && (
                    <div className="batch-actions">
                      <button className="primary-btn pulse" onClick={submitPendingActions}>
                        Complete {Object.keys(pendingOutcomes).length} Action(s)
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <CustomizationPanel
                progress={progress}
                currentTheme={theme}
                onSetTheme={setTheme}
                currentVoice={mentorVoice}
                onSetVoice={setMentorVoice}
              />
            </div>

            <div className="right-col">
              <MentorPanel
                scriptText={mentorScript}
                triggerGeneration={triggerMentorCount}
                onGenerationComplete={() => { }}
                sourceUrl={didSourceUrl}
                voiceId={mentorVoice}
              />

              <section className="progress-section section-card">
                <h2>Progress</h2>
                <div className="stats-row">
                  <div className="stat">
                    <label>Momentum</label>
                    <div className="value">{progress.momentum}</div>
                  </div>
                  <div className="stat">
                    <label>Trust</label>
                    <div className="value">{progress.mentor_trust}</div>
                  </div>
                </div>
                <p className="identity">{getIdentityTitle(progress.momentum) || "Beginner"}</p>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
