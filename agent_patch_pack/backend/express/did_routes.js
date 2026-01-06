const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const DID_BASE = process.env.DID_BASE_URL || 'https://api.d-id.com';
const DID_KEY = process.env.DID_API_KEY;

function authHeader() {
  // Common D-ID auth: API key as username with empty password.
  const token = Buffer.from(`${DID_KEY}:`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

function mapVoice(voiceId) {
  switch (voiceId) {
    case 'energetic': return 'en-US-JennyNeural';
    case 'deep': return 'en-US-GuyNeural';
    case 'calm':
    default: return 'en-US-AriaNeural';
  }
}

function mapStyle(style) {
  return style ? { style } : undefined;
}

// POST /api/did/talk
// body: { sourceUrl, text, voiceId, style }
// returns: { talkId }
router.post('/did/talk', async (req, res) => {
  try {
    if (!DID_KEY) return res.status(500).json({ error: 'DID_API_KEY missing' });

    const { sourceUrl, text, voiceId, style } = req.body || {};
    if (!sourceUrl || !text) return res.status(400).json({ error: 'sourceUrl and text required' });

    const body = {
      source_url: sourceUrl,
      script: {
        type: "text",
        input: text,
        provider: {
          type: "microsoft",
          voice_id: mapVoice(voiceId),
        }
      },
      config: {
        fluent: true,
        pad_audio: 0,
        driver_expressions: mapStyle(style),
      }
    };

    const r = await fetch(`${DID_BASE}/talks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'D-ID create failed', details: t });
    }
    const data = await r.json(); // { id, ... }
    return res.json({ talkId: data.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'did talk failed' });
  }
});

// GET /api/did/talk/:id
// returns: { status, resultUrl? }
router.get('/did/talk/:id', async (req, res) => {
  try {
    if (!DID_KEY) return res.status(500).json({ error: 'DID_API_KEY missing' });

    const id = req.params.id;
    const r = await fetch(`${DID_BASE}/talks/${id}`, { headers: { ...authHeader() } });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'D-ID status failed', details: t });
    }
    const data = await r.json();
    const status = data.status || 'unknown';
    const resultUrl = data.result_url || data?.result?.url || null;
    return res.json({ status, resultUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'did status failed' });
  }
});

module.exports = router;
