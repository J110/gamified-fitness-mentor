// === Frontend D-ID flow: selfie -> sourceUrl -> talk -> poll ===
//
// Requires backend endpoints:
// POST /api/avatar/source  { imageBase64 } -> { sourceUrl }
// POST /api/did/talk       { sourceUrl, text, voiceId, style } -> { talkId }
// GET  /api/did/talk/:id   -> { status, resultUrl? }
//
// Store:
// state.userSourceImage (dataURL)
// state.didSourceUrl (public URL)

async function uploadSelfieToBackend(imageBase64) {
  const res = await fetch('/api/avatar/source', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ imageBase64 })
  });
  if (!res.ok) throw new Error('avatar/source failed');
  const data = await res.json();
  state.didSourceUrl = data.sourceUrl;
  return data.sourceUrl;
}

async function requestDidTalk({ text }) {
  const payload = {
    sourceUrl: state.didSourceUrl,
    text,
    voiceId: state.selectedVoice || 'calm',
    style: state.selectedAvatarStyle || 'default'
  };
  const res = await fetch('/api/did/talk', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('did/talk failed');
  return await res.json(); // { talkId }
}

async function pollDidTalk(talkId, { timeoutMs = 60000, intervalMs = 1500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`/api/did/talk/${talkId}`);
    if (!res.ok) throw new Error('did/talk status failed');
    const data = await res.json(); // { status, resultUrl? }
    if (data.status === 'done' && data.resultUrl) return data.resultUrl;
    if (data.status === 'error') throw new Error('D-ID error');
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('D-ID timeout');
}

async function generateMentorVideo(text) {
  try {
    if (!state.didSourceUrl) return null;
    const { talkId } = await requestDidTalk({ text });
    return await pollDidTalk(talkId);
  } catch (e) {
    console.warn('D-ID failed, fallback to TTS', e);
    return null;
  }
}
