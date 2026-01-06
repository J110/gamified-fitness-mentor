export type UserSeed = {
    gender: string;
    age: number;
    profession: string;
    work_environment: string;
    smoker: string;
};

export type TrackingData = {
    // Health
    sleep_hours: number;
    physical_activity_min: number;
    stress_level: number;
    metabolic_risk: number;

    // Finance
    spending_control: number;
    savings_rate: number;
    financial_stress: number;

    // Purpose
    focus_score: number;
    direction_clarity: number;
    work_engagement: number;

    // Relationships
    loneliness_score: number;
    social_support: number;
    connection_quality: number;
};

export type Chapter = 'HEALTH' | 'FINANCE' | 'PURPOSE' | 'RELATIONSHIPS';
export type Stage = 'STOP_LOSS' | 'START_GAIN' | 'IMPROVE';

export type ChapterStatus = {
    id: Chapter;
    score: number;
    stage: Stage;
    metrics: { name: string; value: number; is_good: boolean }[];
};

export type SkillCard = {
    id: string;
    chapter: Chapter;
    stage: Stage;
    title: string;
    why: string;
    time_min: number;
    difficulty: number;
    tags: string[];
    tracking_targets?: {
        metric: string;
        direction: string;
        weight: number;
    }[];
    cooldown_hours?: number;
    completion_effects?: {
        none: { momentum: number; mentor_trust: number };
        partial: { momentum: number; mentor_trust: number };
        full: { momentum: number; mentor_trust: number };
    };
};

export type Progress = {
    momentum: number;
    mentor_trust: number;
    unlocks: string[];
    identity_title: string;
};
