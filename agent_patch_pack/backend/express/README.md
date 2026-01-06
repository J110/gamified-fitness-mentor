# Backend (Express) Patch Templates

This folder contains:
- `avatar_source_route.js` : saves base64 selfie -> /uploads -> returns public URL
- `did_routes.js` : D-ID proxy routes with caching + polling support

## Minimal integration steps (Express)
1. Install deps:
   npm i express cors node-fetch dotenv

2. Serve uploads:
   app.use('/uploads', express.static(path.join(__dirname,'uploads')))

3. Mount routes:
   const avatarSourceRouter = require('./avatar_source_route');
   const didRouter = require('./did_routes');
   app.use('/api', avatarSourceRouter);
   app.use('/api', didRouter);

## ENV required
DID_API_KEY=...
DID_BASE_URL=https://api.d-id.com
PUBLIC_BASE_URL=http://localhost:3000   # must match where uploads are served
