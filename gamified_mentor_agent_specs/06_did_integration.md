# 06 — D‑ID Integration (End-to-End)

## Backend proxy (required)
Frontend must call backend; backend calls D-ID.

### POST /api/did/talk
Request:
{
  "source_url": "https://.../mentor.jpg",
  "text": "mentor script...",
  "voice": { "provider": "microsoft", "voice_id": "en-US-JennyNeural" },
  "config": { "stitch": true }
}

Response:
{ "talk_id": "tlk_xxx", "status": "created" }

### GET /api/did/talk/:id
Response:
{ "talk_id": "tlk_xxx", "status": "done", "video_url": "https://..." }

## Caching
hash = sha256(source_url + voice_id + text)
- if done cached => return done+video_url
- if inflight => return processing+talk_id

## Frontend behavior
- POST on each mentor update
- poll GET every 1.2s up to 45s
- on done: set <video src autoplay>
- on error: TTS fallback

## Voice mapping
tone->voice_id:
- calm: JennyNeural
- structured: GuyNeural
- aspirational: SaraNeural

## Security
- rate limit
- validate text length
- allowlist source host(s)
- keep API key in .env
