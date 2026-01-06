# 03 — Tracking Generation

## Deterministic seeded randomness
seed = sha256(`${gender}|${age}|${profession}|${work_environment}|${smoker}`)
Use seeded PRNG (e.g., `seedrandom`).

## Steps
1) Sample baseline: Uniform(35, 85) for each metric
2) Apply bias rules
3) Clamp [0,100]
4) Derive chapter metrics from assessments

## Bias rules (demo)
- smoker=yes: tobacco_risk +20, stress +5, metabolic_risk +5
- indoor: sedentary +10, physical_activity -5
- outdoor: physical_activity +10, stress -5
- age>=40: metabolic_risk +10, sleep -5
- profession contains "student": stress +5, direction_clarity -10

## Derivations
- HEALTH: sleep=lifestyle.sleep; physical_activity=lifestyle.physical_activity; stress=cognitive.stress; metabolic_health=avg(body_comp,fat_distribution,100-metabolic_risk)
- FINANCE: financial_stress=cognitive.stress; spending_control=avg(conscientiousness,100-exposure); savings_behavior=avg(grit,willpower)
- PURPOSE: focus=avg(conscientiousness,100-stress); direction_clarity=avg(openness,100-anxiety); work_engagement=avg(grit,100-depression)
- RELATIONSHIPS: loneliness=cognitive.loneliness; social_support=cognitive.social_support; connection_quality=avg(social_support,100-loneliness)
