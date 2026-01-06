# 02 — Data Models

All models are JSON-serializable. Use TypeScript types in frontend.

## UserSeed
```ts
export type UserSeed = {
  gender: "male"|"female"|"nonbinary";
  age: number; // 13-80
  profession: string;
  work_environment: "indoor"|"outdoor"|"mixed";
  smoker: "yes"|"no";
};
```

## Assessments (base profile)
```ts
export type Assessments = {
  personality: { willpower:number; grit:number; conscientiousness:number; openness:number; };
  cognitive: { stress:number; anxiety:number; depression:number; loneliness:number; social_support:number; };
  lifestyle: { sleep:number; diet:number; physical_activity:number; sedentary:number; tobacco_risk:number; alcohol_risk:number; };
  metabolic: { body_comp:number; fat_distribution:number; metabolic_risk:number; };
  diet_risk: { predilection:number; exposure:number; behavioral:number; };
};
```

## ChapterTracking (derived from Assessments)
```ts
export type Chapter = "HEALTH"|"FINANCE"|"PURPOSE"|"RELATIONSHIPS";
export type Stage = "STOP_LOSS"|"START_GAIN"|"IMPROVE";
export type ChapterTracking = Record<Chapter, Record<string, number>>;
```

## Skill Cards
```ts
export type SkillCard = {
  id: string;
  chapter: Chapter;
  stage: Stage;
  title: string;
  why: string;
  time_min: number;
  difficulty: 1|2|3|4|5;
  tags: string[];
  tracking_targets: Array<{ metric:string; direction:"up"|"down"; weight:number }>;
  completion_effects: {
    none: { momentum:number; mentor_trust:number };
    partial: { momentum:number; mentor_trust:number };
    full: { momentum:number; mentor_trust:number };
  };
  cooldown_hours: number;
};
```

## Mentor Scripts
```ts
export type MentorScriptTemplate = {
  id: string;
  chapter: Chapter;
  stage: Stage;
  variant: "base"|"recovery"|"challenge";
  tone: "calm"|"structured"|"aspirational";
  template: string; // with {{vars}}
};
```

Variables: {{chapter_name}}, {{stage_name}}, {{weak_metric_hint}}, {{card_title}}, {{recent_win}}, {{next_step}}

## Progress
```ts
export type ProgressState = {
  momentum: number;      // 0-100
  mentor_trust: number;  // 0-100
  identity_titles: string[];
  unlocks: string[];
  chapter_momentum: Record<Chapter, number>;
  history: Array<{ ts:string; card_id:string; result:"none"|"partial"|"full"; chapter:Chapter }>;
};
```

## AvatarChoice (demo)
```ts
export type AvatarChoice = {
  id: string;
  label: string;
  image_url: string;
  default_voice: string;
};
```
