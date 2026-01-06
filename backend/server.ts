import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration for production
const allowed = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowed.length ? allowed : true,
    credentials: false
}));

// ...
app.use(express.json({ limit: '10mb' })); // Increase limit for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health endpoint for monitoring
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});
app.post('/api/avatar/source', async (req, res) => {
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

        // Ensure dir exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `${id}.${ext}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));

        const publicBase = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
        const sourceUrl = `${publicBase}/uploads/${filename}`;

        console.log(`Uploaded avatar: ${sourceUrl}`);
        return res.json({ sourceUrl });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: 'avatar source failed' });
    }
});

// Key: hash of params, Value: talk ID or result
const talkCache = new Map<string, any>();

app.post('/api/did/talk', async (req, res) => {
    try {
        const { source_url, text, voice, config } = req.body;

        if (!process.env.DID_API_KEY) {
            console.error("Missing DID_API_KEY");
            return res.status(502).json({ error: 'Missing DID_API_KEY' });
        }

        // Basic caching based on text and voice (simplified)
        const cacheKey = JSON.stringify({ text, voice: voice?.voice_id });
        if (talkCache.has(cacheKey)) {
            console.log(`Cache hit for ${cacheKey}`);
            const cached = talkCache.get(cacheKey);
            // If it's a finished result, we might want to return it, or the ID.
            // For now let's just create a new one to be safe unless we implement full polling logic here.
        }

        const response = await axios.post(
            `${process.env.DID_BASE_URL || 'https://api.d-id.com'}/talks`,
            {
                source_url,
                script: {
                    type: 'text',
                    input: text,
                    provider: voice?.provider ? { type: voice.provider, voice_id: voice.voice_id } : undefined
                },
                config: config || { stitch: true }
            },
            {
                headers: {
                    'Authorization': `Basic ${process.env.DID_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const { id, status } = response.data;
        console.log(`Created talk: ${id} status: ${status}`);
        res.json({ talk_id: id, status });

    } catch (error: any) {
        console.error('D-ID Create Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
    }
});

app.get('/api/did/talk/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!process.env.DID_API_KEY) {
            return res.status(502).json({ error: 'Missing DID_API_KEY' });
        }

        const response = await axios.get(
            `${process.env.DID_BASE_URL || 'https://api.d-id.com'}/talks/${id}`,
            {
                headers: {
                    'Authorization': `Basic ${process.env.DID_API_KEY}`
                }
            }
        );

        const { status, result_url, metadata } = response.data;
        // Normalize response
        const video_url = result_url;

        res.json({
            talk_id: id,
            status,
            video_url,
            metadata
        });

    } catch (error: any) {
        console.error('D-ID Get Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
