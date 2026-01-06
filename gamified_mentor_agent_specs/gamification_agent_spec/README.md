# Gamified Fitness Mentor — Agent Implementation Spec (Deploy Public Demo)

This pack tells an implementation agent exactly how to deploy the **Gamified Fitness Mentor** demo app to a public URL.
It assumes the app is a full-stack monorepo:

- `frontend/` : React 19 + Vite + TypeScript
- `backend/`  : Node.js + Express.js + TypeScript (must proxy D‑ID API; DO NOT expose API key in the browser)

If your repo differs, adapt paths but keep the same architecture.

---

## Goal

Deliver a public demo with:
- **Frontend URL** (shareable) hosted on **Vercel**
- **Backend API URL** hosted on **Render**
- D‑ID API key stored only on the backend (Render env vars)
- Working end-to-end: frontend can request mentor video generation via backend

---

## Required Accounts / Access

Agent needs:
1. GitHub access to push code
2. Vercel account access (or Vercel token)
3. Render account access
4. D‑ID API key (`DID_API_KEY`)

---

## Deployment Option (Recommended)

### Option A (Recommended): Vercel (frontend) + Render (backend)

Why: fastest, simplest, secure secret handling, strong DX.

---

## Implementation Steps (Do in order)

### 1) Repo sanity check

Confirm:
- `frontend/package.json` exists
- `backend/package.json` exists
- Backend has a single entry point (e.g., `src/index.ts` or `src/server.ts`)
- Backend listens on `process.env.PORT` (Render sets PORT)

If backend does NOT listen on `process.env.PORT`, fix it.

---

### 2) Backend: convert prod runtime to compiled JS (avoid ts-node in production)

**Update** `backend/package.json` scripts to:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js"
  }
}
```

Notes:
- If your entry file is not `src/index.ts`, adjust build output and start file accordingly.
- If you already have a build pipeline, keep it, but Render should run `node dist/...` in production.

**Ensure** `tsconfig.json` outputs to `dist/`:
- `compilerOptions.outDir` = `dist`

---

### 3) Backend: CORS configuration

Backend must allow requests from the Vercel frontend.

Add `cors` middleware:

```ts
import cors from "cors";

const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowed.length ? allowed : true,
  credentials: false
}));
```

Set `CORS_ORIGIN` on Render to your Vercel domain, e.g.:
- `https://gamified-fitness-mentor.vercel.app`
(or multiple domains comma-separated)

---

### 4) Backend: D‑ID proxy route

Confirm backend calls D‑ID with `Authorization` header from env var `DID_API_KEY`
and DOES NOT accept the key from the client.

Example pattern:

- `POST /api/did/generate` (frontend calls this)
- backend calls D‑ID API server-side and returns sanitized response

Store secrets in env vars:
- `DID_API_KEY` (required)
- `DID_BASE_URL` (optional; default https://api.d-id.com)

---

### 5) Render deployment (Backend)

#### 5.1 Add `render.yaml`
Create `render.yaml` at repo root (template included in this pack).

#### 5.2 Create service
On Render:
- New → Blueprint → connect GitHub repo
- Pick the Blueprint; Render reads `render.yaml`
- Set env var `DID_API_KEY` (secret)
- Set `CORS_ORIGIN` after you know the Vercel URL

#### 5.3 Verify backend health
Add (or confirm) a simple health endpoint:

- `GET /api/health` → `{ ok: true }`

Open in browser:
- `https://<render-service>.onrender.com/api/health`

---

### 6) Vercel deployment (Frontend)

#### 6.1 Create Vercel project
- Import repo
- Root directory: `frontend/`
- Build command: `npm run build`
- Output directory: `dist`

#### 6.2 Add environment variable
In Vercel project settings add:

- `VITE_API_BASE_URL` = `https://<render-service>.onrender.com`

Frontend should use:
- `import.meta.env.VITE_API_BASE_URL`

#### 6.3 Redeploy
Trigger a redeploy after env var changes.

---

### 7) End-to-end test checklist

1. Open frontend URL (Vercel)
2. Confirm it loads without console errors
3. Trigger a mentor generation action
4. In Render logs, confirm backend calls D‑ID
5. Ensure D‑ID key is NOT present in browser network requests
6. Confirm video/mentor result is returned and displayed

---

## Common Fixes

### SPA routing on Vercel
For Vite SPAs, Vercel typically works; if you have deep links failing, add a rewrite.
Use `vercel.json` template in this pack.

### Mixed content / CORS
- Backend must be HTTPS (Render is HTTPS by default)
- Ensure `CORS_ORIGIN` matches the exact Vercel domain
- Ensure frontend base URL uses https://

### Large payloads / uploads
If you support file upload:
- use `multer` in backend
- set appropriate body limits
- prefer direct-to-storage for large files (optional)

---

## Deliverables

Agent must provide:
- Vercel frontend URL
- Render backend URL
- Screenshot / short recording of working flow
- Repo changes PR or commit list:
  - `render.yaml`
  - any CORS changes
  - backend build/start adjustments
  - optional `vercel.json`

---

## Security Requirements

- **Never** expose `DID_API_KEY` in frontend env or code.
- All D‑ID calls must happen server-side.
- Do not log secrets.
