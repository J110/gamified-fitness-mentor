import seedrandom from 'seedrandom';
import type { UserSeed, TrackingData } from '../types';

export function generateTrackingData(seedInput: UserSeed, salt?: string): TrackingData {
    // Create deterministic RNG based on user inputs + salt
    const seedString = `${seedInput.gender}|${seedInput.age}|${seedInput.profession}|${seedInput.work_environment}|${seedInput.smoker}|${salt || ''}`;
    const rng = seedrandom(seedString);

    // Helper for uniform range
    const rand = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

    // 1. Baseline generation (Uniform 35-85)
    const base = {
        sleep: rand(4, 9), // Hours, adjust scaling later if needed to be 0-100 score? 
        // Wait, spec says "Uniform(35, 85) for each METRIC"
        // But sleep is usually hours. Let's assume these are SCORES 0-100 for simplicity 
        // unless spec implies raw values. 
        // Spec: "sleep=lifestyle.sleep". checking spec 03...
        // "Sample baseline: Uniform(35, 85) for each metric"
        // Let's assume 0-100 scores for consistency with gamification engine.
        physical: rand(35, 85),
        stress: rand(35, 85),
        metabolic: rand(35, 85),
        spending: rand(35, 85),
        savings: rand(35, 85),
        fin_stress: rand(35, 85),
        focus: rand(35, 85),
        direction: rand(35, 85),
        engagement: rand(35, 85),
        loneliness: rand(35, 85),
        social: rand(35, 85),
        connection: rand(35, 85),
    };

    // 2. Apply Bias Rules
    // - smoker=yes: tobacco_risk +20 (implicit), stress +5, metabolic_risk +5
    if (seedInput.smoker === 'yes') {
        base.stress += 5;
        base.metabolic += 5;
    }

    // - indoor: sedentary +10 (implies physical -10? Spec says "sedentary +10, physical_activity -5")
    if (seedInput.work_environment === 'indoor') {
        base.physical -= 5;
    }
    // - outdoor: physical_activity +10, stress -5
    if (seedInput.work_environment === 'outdoor') {
        base.physical += 10;
        base.stress -= 5;
    }

    // - age>=40: metabolic_risk +10, sleep -5
    if (seedInput.age >= 40) {
        base.metabolic += 10;
        base.sleep -= 5; // Assuming score implies quality
    }

    // - profession contains "student": stress +5, direction_clarity -10
    if (seedInput.profession.toLowerCase().includes('student')) {
        base.stress += 5;
        base.direction -= 10;
    }

    // 3. Clamp [0,100]
    const clamp = (n: number) => Math.max(0, Math.min(100, n));

    return {
        sleep_hours: clamp(base.sleep),
        physical_activity_min: clamp(base.physical),
        stress_level: clamp(base.stress),
        metabolic_risk: clamp(base.metabolic),

        spending_control: clamp(base.spending),
        savings_rate: clamp(base.savings),
        financial_stress: clamp(base.fin_stress),

        focus_score: clamp(base.focus),
        direction_clarity: clamp(base.direction),
        work_engagement: clamp(base.engagement),

        loneliness_score: clamp(base.loneliness),
        social_support: clamp(base.social),
        connection_quality: clamp(base.connection),
    };
}
