Agent Checklist (tick all)

Repo
[ ] Confirm monorepo layout: /frontend and /backend
[ ] Backend listens on process.env.PORT
[ ] Backend has GET /api/health
[ ] Backend uses DID_API_KEY from env only

Backend
[ ] package.json has build/start for compiled JS (no ts-node in prod)
[ ] CORS configured via CORS_ORIGIN env var
[ ] D-ID calls are server-side only

Render
[ ] render.yaml added and validated
[ ] Render service deployed successfully
[ ] /api/health returns ok

Vercel
[ ] Frontend deployed from /frontend
[ ] VITE_API_BASE_URL set to Render URL
[ ] App loads and can call backend

Security
[ ] DID_API_KEY never appears in frontend
[ ] No secrets logged

Deliverables
[ ] Share Vercel URL + Render URL
[ ] Provide evidence (screenshot/recording)
[ ] Provide commit/PR link
