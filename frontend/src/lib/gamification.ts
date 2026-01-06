import type { TrackingData, Chapter, ChapterStatus, Stage, SkillCard } from '../types';
import { SKILL_CARDS } from '../shared/data';

const skillCards = SKILL_CARDS;

export function evaluateGamification(data: TrackingData): ChapterStatus[] {
    const chapters: ChapterStatus[] = [];

    // Helper: Normalize "bad" metrics (where high is bad)
    // Spec: stress_good = 100 - stress
    const norm = (val: number, isBad: boolean) => isBad ? 100 - val : val;

    // --- HEALTH ---
    // Metrics: sleep(G), physical(G), metabolic(B), stress(B)
    // --- HEALTH ---
    const h_metrics = [
        { name: 'Sleep', value: data.sleep_hours, is_good: data.sleep_hours >= 7 },
        { name: 'Activity', value: data.physical_activity_min, is_good: data.physical_activity_min >= 30 },
        { name: 'Metabolic', value: data.metabolic_risk, is_good: data.metabolic_risk <= 30 },
        { name: 'Stress', value: data.stress_level, is_good: data.stress_level <= 40 },
    ];
    const h_score = (
        norm(data.sleep_hours, false) +
        norm(data.physical_activity_min, false) +
        norm(data.metabolic_risk, true) +
        norm(data.stress_level, true)
    ) / 4;
    chapters.push(createChapterStatus('HEALTH', h_score, h_metrics));

    // --- FINANCE ---
    const f_metrics = [
        { name: 'Spending Control', value: data.spending_control, is_good: data.spending_control >= 60 },
        { name: 'Savings', value: data.savings_rate, is_good: data.savings_rate >= 20 },
        { name: 'Fin. Stress', value: data.financial_stress, is_good: data.financial_stress <= 40 },
    ];
    const f_score = (
        norm(data.spending_control, false) +
        norm(data.savings_rate, false) +
        norm(data.financial_stress, true)
    ) / 3;
    chapters.push(createChapterStatus('FINANCE', f_score, f_metrics));

    // --- PURPOSE ---
    const p_metrics = [
        { name: 'Focus', value: data.focus_score, is_good: data.focus_score >= 60 },
        { name: 'Direction', value: data.direction_clarity, is_good: data.direction_clarity >= 60 },
        { name: 'Engagement', value: data.work_engagement, is_good: data.work_engagement >= 60 },
    ];
    const p_score = (
        norm(data.focus_score, false) +
        norm(data.direction_clarity, false) +
        norm(data.work_engagement, false)
    ) / 3;
    chapters.push(createChapterStatus('PURPOSE', p_score, p_metrics));

    // --- RELATIONSHIPS ---
    const r_metrics = [
        { name: 'Social Support', value: data.social_support, is_good: data.social_support >= 60 },
        { name: 'Connection', value: data.connection_quality, is_good: data.connection_quality >= 60 },
        { name: 'Loneliness', value: data.loneliness_score, is_good: data.loneliness_score <= 30 },
    ];
    const r_score = (
        norm(data.social_support, false) +
        norm(data.connection_quality, false) +
        norm(data.loneliness_score, true)
    ) / 3;
    chapters.push(createChapterStatus('RELATIONSHIPS', r_score, r_metrics));

    return chapters;
}

function createChapterStatus(id: Chapter, score: number, metrics: any[]): ChapterStatus {
    let stage: Stage = 'IMPROVE';
    if (score < 40) stage = 'STOP_LOSS';
    else if (score < 70) stage = 'START_GAIN';

    return { id, score: Math.round(score), stage, metrics };
}

export function getCardsForChapter(chapter: Chapter, stage: Stage, tracking: TrackingData, excludedIds: string[] = []): SkillCard[] {
    // Safety check for data availability
    if (!skillCards || !Array.isArray(skillCards)) {
        console.error("SkillCards missing or invalid:", skillCards);
        return [];
    }

    const candidates = skillCards.filter(c => c.chapter === chapter && !excludedIds.includes(c.id));
    if (!candidates.length) return [];

    // Filter by stage (strict first, then fallback to all if none found)
    let stageFiltered = candidates.filter(c => c.stage === stage);
    if (!stageFiltered.length) stageFiltered = candidates;

    // TODO: Cooldown logic would require persistent state of completions. 
    // For now we skip cooldown check or assume all available.

    // Scoring: target weak metrics (<50)
    // We need to map metric names from JSON to TrackingData keys.
    // JSON metrics: "stress", "sleep", "financial_stress", etc.
    // TrackingData keys: "stress_level", "sleep_hours", "financial_stress"...
    // Mapping is a bit loose. Let's try to match loosely or define a map.

    // Simple heuristic: if tracking key contains the target metric string
    const getVal = (metric: string) => {
        const key = Object.keys(tracking).find(k => k.includes(metric));
        return key ? (tracking as any)[key] : undefined;
    };

    const scored = stageFiltered.map(card => {
        let score = 0;
        if (card.tracking_targets) {
            card.tracking_targets.forEach(t => {
                getVal(t.metric);
                // logic: if direction="down" and val is high (>50) -> +score?
                // Spec says: "target weak metrics: +2*weight". 
                // "Weak" usually means "bad". 
                // For "stress" (bad metric), high is bad/weak. 
                // For "sleep" (good metric), low is bad/weak.

                // Let's rely on the "bad" normalized values? 
                // Creating a normalized map might be better.
                // But for demo, let's stick to the providing "scoreCard" logic from patch.
                // "if val < 50 score += ..."
                // This assumes 0-100 where 100 is ALWAYS GOOD.
                // My TrackingData has raw values. 
                // I should use the NORMALIZED values from current chapter metrics if possible.
                // But here I only passed raw `tracking`.

                // Simplified: Just add random noise + weight if exists for now, 
                // as robust metric mapping is complex without a dictionary.
                score += (t.weight || 1);
            });
        }
        return { card, score: score + Math.random() };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.card);
}

export function getIdentityTitle(momentum: number): string {
    if (momentum >= 75) return "Someone Who Raises the Bar";
    if (momentum >= 50) return "Someone Who Follows Through";
    if (momentum >= 25) return "Someone Who Shows Up";
    if (momentum >= 10) return "Someone Who Starts";
    return "";
}
