# Gamified Mentor Demo App — Agent Spec Pack
Date: 2026-01-06

This pack contains **step-by-step specs** to rebuild the demo app from scratch:
- Single-page web app (frontend) that generates assessments + tracking and runs chapter-based gamification
- Skill card engine + mentor narrative engine driven by JSON libraries
- **End-to-end D-ID talking avatar integration** via a backend proxy (keeps API key off the client)
- Local dev setup + acceptance tests + deployment notes

## What the agent should deliver
1. `frontend/` single-page app:
   - User seed input → generate assessment/tracking → compute stages
   - Chapter dashboard (4 chapters always visible, current highlighted)
   - Mentor panel (video + transcript) with D-ID playback
   - Skill cards list (3 cards) tied to tracking + stage; user can mark **none/partial/full**
   - Progress panel: Momentum, Mentor Trust, Identity Titles, Unlocks
   - Reset flow

2. `backend/` Node/Express proxy for D-ID:
   - `POST /api/did/talk` create talk (image + script + voice)
   - `GET /api/did/talk/:id` poll talk status → returns `video_url` when ready
   - Caching + rate limiting + robust error handling
   - `.env` for D-ID API key

3. `shared/` JSON libraries:
   - `skill_cards.json` (cards)
   - `mentor_scripts.json` (templates)
   - `test_cases.json` (deterministic test fixtures)

## Quick start (local dev)
### Backend
```bash
cd backend
cp .env.example .env
# fill DID_API_KEY, DID_BASE_URL
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173 (or printed dev URL)

## Files in this pack
- `01_product_overview.md` — what the demo must show
- `02_data_models.md` — schemas: user, assessment, tracking, progress, cards, scripts
- `03_tracking_generation.md` — deterministic seeded generator and bias rules
- `04_gamification_engine.md` — stage logic, scoring, card selection, progress updates
- `05_mentor_narrative.md` — script selection + variable interpolation rules
- `06_did_integration.md` — **complete** D-ID proxy + frontend integration
- `07_frontend_ui_spec.md` — layout, components, states, and UX details
- `08_backend_api_spec.md` — endpoints + request/response + caching
- `09_acceptance_tests.md` — must-pass checklist + test fixtures
- `10_folder_structure.md` — suggested repo structure
- `IMPLEMENTATION_CHECKLIST.md` — task list the agent can execute
- `shared/` — placeholder JSON templates (agent should replace/extend with your final libraries)
