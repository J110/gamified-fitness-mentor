# 04 — Gamification Engine

## Stage computation
Normalize "bad" metrics:
- stress_good = 100 - stress
- loneliness_good = 100 - loneliness
- financial_stress_good = 100 - financial_stress

chapter_score = avg(key_metrics_normalized)

Thresholds:
- STOP_LOSS: < 40
- START_GAIN: 40–69
- IMPROVE: >= 70

Key metrics:
- HEALTH: sleep, physical_activity, metabolic_health, stress_good
- FINANCE: spending_control, savings_behavior, financial_stress_good
- PURPOSE: focus, direction_clarity, work_engagement
- RELATIONSHIPS: social_support, connection_quality, loneliness_good

## Progress updates
Completion:
- none: +0 momentum, +0 trust
- partial: +1 momentum, +0 trust
- full: +2 momentum, +1 trust
Apply globally + per chapter; clamp 0–100

## Identity titles
- momentum >=10: Someone Who Starts
- >=25: Someone Who Shows Up
- >=50: Someone Who Follows Through
- >=75: Someone Who Raises the Bar

## Unlocks
- avatar unlocks at momentum 15/35/60
- advanced cards at trust 20/45/70
- deeper narratives at trust 25+

## Card selection (top 3)
Filter by chapter+stage.
Score:
- target weak metrics: +2*weight
- cooldown active: exclude
- repeat penalty: -2
- recent success on tag: +1
Take top 3.
