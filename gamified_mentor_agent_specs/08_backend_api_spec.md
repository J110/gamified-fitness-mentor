# 08 — Backend API Spec

Node 18+, Express, dotenv, undici/axios.

Env:
- DID_API_KEY
- DID_BASE_URL (per D-ID docs)
- DID_TIMEOUT_MS=45000
- ALLOWED_SOURCE_HOSTS=localhost,cdn.example.com

Endpoints:
- POST /api/did/talk (create or return cached)
- GET /api/did/talk/:id (poll and normalize)

Errors:
- auth errors -> 502
- rate limit -> 503
- timeout -> 504
