# Patch Pack: Chapter Tabs + Skill Cards + User Photo D-ID + Customization/Unlocks

This pack contains **drop-in templates** and **step-by-step instructions** to apply to the existing app *without rewriting it*.

## What this patch fixes
1. Skill cards not appearing (always show 2–3 per life chapter).
2. Life chapter tabs become clickable; switching chapters updates:
   - mentor narrative
   - skill cards list
3. D-ID avatar uses **user photo** (camera or upload) instead of random mentor.
4. Add **avatar/voice customization** options with **locked (unavailable) options** that unlock with progress.

---

## Assumptions
- Your app already has:
  - an Output page
  - a skill card library (JSON or array)
  - progress model (momentum, mentorTrust, stage)
  - a backend “/api/did/talk” proxy working with D‑ID
- If your app is **React**, see `frontend/react/`.
- If your app is **vanilla JS**, see `frontend/vanilla/`.
- Backend examples assume **Node/Express**; adjust to your stack.

---

## Implementation Steps (High Level)

### A) Chapter Tabs + renderChapterView()
1. Add `state.currentChapter` (default "HEALTH").
2. Render chapter tabs with `data-chapter` attribute.
3. Bind click handlers to update `state.currentChapter` and call `renderChapterView()`.
4. `renderChapterView()` should:
   - compute chapter stage
   - select 2–3 cards (with fallbacks)
   - render cards
   - generate mentor narrative

### B) Make skill card selection never empty
Implement `selectCardsForChapter(chapter, stage, n=3)`:
- primary filter: chapter + stage
- fallback: chapter only
- optional: cooldown filter
- fallback: ignore cooldown if empty
Return top `n`.

### C) Use user photo as D‑ID source_url
Front-end flow:
1. Capture/Upload selfie → base64 data URL.
2. POST to backend `/api/avatar/source` with `{ imageBase64 }`.
3. Backend saves file in a static `/uploads` folder and returns `{ sourceUrl }`.
4. Store `state.didSourceUrl = sourceUrl`.
5. When generating mentor video, send `sourceUrl` to `/api/did/talk`.

Backend:
- Add `POST /api/avatar/source` to persist image & return public URL.
- Ensure `app.use('/uploads', express.static(...))` exposes images.

### D) Customization options + locked unlocks
1. Add UI for voice + avatar style.
2. Some options are locked:
   - disabled buttons with 🔒
3. Add `computeUnlocks()` based on `momentum`, `mentorTrust`, and/or stages.
4. Pass selected voice/style into mentor generation payload.

---

## Acceptance Tests (QA)
- After assessment generation, Output page shows **4 chapter tabs**.
- Default chapter shows **2–3 cards**.
- Clicking another chapter changes **mentor narrative + cards**.
- Upload selfie → mentor video uses same face (source image).
- Locked options visible and disabled.
- Increase momentum/trust → some locked options become available.
