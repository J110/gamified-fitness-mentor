import type { SkillCard } from '../types';

export const SKILL_CARDS: SkillCard[] = [
    {
        "id": "health_stop_delay_impulse",
        "chapter": "HEALTH",
        "stage": "STOP_LOSS",
        "title": "Delay the impulse",
        "why": "Give your system space to choose better.",
        "time_min": 5,
        "difficulty": 1,
        "tags": ["impulse", "stability"],
        "tracking_targets": [{ "metric": "stress", "direction": "down", "weight": 1.0 }],
        "completion_effects": {
            "none": { "momentum": 0, "mentor_trust": 0 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "full": { "momentum": 2, "mentor_trust": 1 }
        },
        // @ts-ignore
        "cooldown_hours": 24
    },
    {
        "id": "health_imp_walk_outside",
        "chapter": "HEALTH",
        "stage": "IMPROVE",
        "title": "20min Outdoor Walk",
        "why": "Fresh air and movement reset your cortisol.",
        "time_min": 20,
        "difficulty": 2,
        "tags": ["activity", "nature"],
        "tracking_targets": [{ "metric": "activity", "direction": "up", "weight": 1.0 }],
        "completion_effects": {
            "full": { "momentum": 3, "mentor_trust": 1 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "health_start_water",
        "chapter": "HEALTH",
        "stage": "START_GAIN",
        "title": "Morning Hydration",
        "why": "Jumpstarts metabolism immediately.",
        "time_min": 2,
        "difficulty": 1,
        "tags": ["metabolic", "habit"],
        "tracking_targets": [{ "metric": "metabolic", "direction": "down", "weight": 1.0 }],
        "completion_effects": {
            "full": { "momentum": 2, "mentor_trust": 1 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "finance_stop_audit",
        "chapter": "FINANCE",
        "stage": "STOP_LOSS",
        "title": "No-Spend Day",
        "why": "Break the cycle of impulsive spending.",
        "time_min": 1440,
        "difficulty": 3,
        "tags": ["spending", "discipline"],
        "tracking_targets": [{ "metric": "spending", "direction": "down", "weight": 2.0 }],
        "completion_effects": {
            "full": { "momentum": 5, "mentor_trust": 2 },
            "partial": { "momentum": 2, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "finance_imp_auto_save",
        "chapter": "FINANCE",
        "stage": "IMPROVE",
        "title": "Increase Auto-Save",
        "why": "Pay yourself first automatically.",
        "time_min": 10,
        "difficulty": 2,
        "tags": ["savings", "automation"],
        "tracking_targets": [{ "metric": "savings", "direction": "up", "weight": 1.0 }],
        "completion_effects": {
            "full": { "momentum": 4, "mentor_trust": 1 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "purpose_review_goals",
        "chapter": "PURPOSE",
        "stage": "START_GAIN",
        "title": "Review Weekly Goals",
        "why": "Align daily actions with long-term vision.",
        "time_min": 15,
        "difficulty": 2,
        "tags": ["focus", "planning"],
        "tracking_targets": [{ "metric": "direction", "direction": "up", "weight": 1.0 }],
        "completion_effects": {
            "full": { "momentum": 3, "mentor_trust": 1 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "rel_call_friend",
        "chapter": "RELATIONSHIPS",
        "stage": "STOP_LOSS",
        "title": "Call a Best Friend",
        "why": "Combat isolation with genuine connection.",
        "time_min": 30,
        "difficulty": 2,
        "tags": ["connection", "social"],
        "tracking_targets": [{ "metric": "loneliness", "direction": "down", "weight": 2.0 }],
        "completion_effects": {
            "full": { "momentum": 4, "mentor_trust": 2 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "rel_date_night",
        "chapter": "RELATIONSHIPS",
        "stage": "IMPROVE",
        "title": "Plan Quality Time",
        "why": "Deepen existing bonds with intentionality.",
        "time_min": 120,
        "difficulty": 3,
        "tags": ["connection", "quality_time"],
        "tracking_targets": [{ "metric": "connection", "direction": "up", "weight": 1.0 }],
        "completion_effects": {
            "full": { "momentum": 5, "mentor_trust": 2 },
            "partial": { "momentum": 2, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    },
    {
        "id": "health_sleep_ritual",
        "chapter": "HEALTH",
        "stage": "IMPROVE",
        "title": "Screen-free Bedtime",
        "why": "Improve sleep quality naturally.",
        "time_min": 60,
        "difficulty": 2,
        "tags": ["sleep", "recovery"],
        "tracking_targets": [{ "metric": "sleep", "direction": "up", "weight": 1.0 }],
        "completion_effects": {
            "full": { "momentum": 3, "mentor_trust": 1 },
            "partial": { "momentum": 1, "mentor_trust": 0 },
            "none": { "momentum": 0, "mentor_trust": 0 }
        }
    }
];

export const MENTOR_SCRIPTS = [
    {
        "chapter": "HEALTH",
        "stage": "STOP_LOSS",
        "template": "Health alert. Your score is {{score}}. You're in the Stop Loss zone. Prioritize recovery and stability immediately."
    },
    {
        "chapter": "HEALTH",
        "stage": "IMPROVE",
        "template": "Good traction in Health. Score: {{score}}. You're improving. Let's push a bit harder on the physical side."
    },
    {
        "chapter": "HEALTH",
        "stage": "START_GAIN",
        "template": "Excellent Health status. Score: {{score}}. You are thriving. Focus on maintaining this high energy."
    },
    {
        "chapter": "FINANCE",
        "stage": "STOP_LOSS",
        "template": "Financial warning. Score: {{score}}. We need to stop the bleeding. Look at the 'No Spend' actions now."
    },
    {
        "chapter": "FINANCE",
        "stage": "IMPROVE",
        "template": "Your finances are stabilizing. Score: {{score}}. Good job. Now let's optimize your savings rate."
    },
    {
        "chapter": "FINANCE",
        "stage": "START_GAIN",
        "template": "Financial freedom is in sight. Score: {{score}}. You have creating a solid foundation. Keep growing your assets."
    },
    {
        "chapter": "PURPOSE",
        "stage": "STOP_LOSS",
        "template": "Purpose is drifting. Score: {{score}}. You seem disconnected. Let's find one small goal to realign."
    },
    {
        "chapter": "PURPOSE",
        "stage": "IMPROVE",
        "template": "Purpose is clearer. Score: {{score}}. You are finding your groove. Deepen your focus on what matters."
    },
    {
        "chapter": "PURPOSE",
        "stage": "START_GAIN",
        "template": "You are on a mission. Score: {{score}}. Your purpose is strong. Lead the way."
    },
    {
        "chapter": "RELATIONSHIPS",
        "stage": "STOP_LOSS",
        "template": "Relationship alert. Score: {{score}}. Isolation risk. Reach out to one person today."
    },
    {
        "chapter": "RELATIONSHIPS",
        "stage": "IMPROVE",
        "template": "Connections are building. Score: {{score}}. Nurture these bonds. Plan some quality time."
    },
    {
        "chapter": "RELATIONSHIPS",
        "stage": "START_GAIN",
        "template": "Your social circle is vibrant. Score: {{score}}. You are well-connected and supported."
    }
];

export const MENTOR_REACTIONS = [
    "Great job taking action! Your stats are moving in the right direction.",
    "That's the momentum we need. One step at a time.",
    "Excellent work. Consistency is key, and you just proved you have it.",
    "I see that improvement! Keep pushing, you are doing great.",
    "Action completed. Your profile is looking stronger already."
];
