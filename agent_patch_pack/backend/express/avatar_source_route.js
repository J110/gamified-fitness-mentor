const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// POST /api/avatar/source
// body: { imageBase64: "data:image/jpeg;base64,..." }
// returns: { sourceUrl: "<PUBLIC_BASE_URL>/uploads/<id>.jpg" }
router.post('/avatar/source', async (req, res) => {
  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 required' });
    }

    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: 'invalid data url' });

    const mime = match[1];
    const b64 = match[2];
    const ext = mime.includes('png') ? 'png' : 'jpg';

    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `${id}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));

    const publicBase = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
    const sourceUrl = `${publicBase}/uploads/${filename}`;

    return res.json({ sourceUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'avatar source failed' });
  }
});

module.exports = router;
