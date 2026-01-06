# 05 — Mentor Narrative Engine

Variant selection:
- last result none => recovery
- trust>=45 and momentum>=35 => challenge
- else base

Select template by chapter+stage+variant.
Interpolate:
- chapter_name, stage_name
- weak_metric_hint (top issues)
- card_title (top selected)
- recent_win (if last was full)
- next_step CTA

Keep text <= 500 chars for D-ID.
Always show transcript.
Fallback to TTS if D-ID fails.
