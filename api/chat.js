// Englishy — server-side handler.
// Runs as a Vercel serverless function (/api/chat) AND is reused by server.js for VPS hosting.
// Pipeline: audio -> transcription (auto-detects NL/EN) -> tutor brain -> spoken English reply.
// The OpenAI key is read from the environment and never sent to the browser.

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-4o-mini';
const STT_MODEL  = process.env.STT_MODEL  || 'gpt-4o-transcribe';
const TTS_MODEL  = process.env.TTS_MODEL  || 'gpt-4o-mini-tts';
const pack = require('../packs/' + (process.env.PACK || 'english-child'));
const TTS_VOICE  = process.env.TTS_VOICE  || pack.ttsVoice;


function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function transcribe(audioBase64, mimeType) {
  const buf = Buffer.from(audioBase64, 'base64');
  const type = mimeType || 'audio/webm';
  let ext = 'webm';
  if (type.includes('mp4') || type.includes('m4a') || type.includes('aac')) ext = 'mp4';
  else if (type.includes('mpeg') || type.includes('mp3')) ext = 'mp3';
  else if (type.includes('ogg')) ext = 'ogg';
  else if (type.includes('wav')) ext = 'wav';

  const form = new FormData();
  form.append('file', new Blob([buf], { type }), `audio.${ext}`);
  form.append('model', STT_MODEL);
  // Deliberately no "language" param so Dutch and English are auto-detected.

  const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: form,
  });
  if (!r.ok) throw new Error(`Transcription failed (${r.status}): ${await r.text()}`);
  const j = await r.json();
  return (j.text || '').trim();
}

async function chat(messages) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: CHAT_MODEL, messages, temperature: 0.7, max_tokens: 140 }),
  });
  if (!r.ok) throw new Error(`Chat failed (${r.status}): ${await r.text()}`);
  const j = await r.json();
  return ((j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '').trim();
}

async function tts(text) {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      instructions: pack.ttsInstructions, // honoured by gpt-4o-mini-tts; ignored by tts-1
      response_format: 'mp3',
    }),
  });
  if (!r.ok) throw new Error(`Speech failed (${r.status}): ${await r.text()}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab).toString('base64');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed'); }

  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };

  if (!OPENAI_API_KEY) {
    return send(500, { error: 'The server has no OPENAI_API_KEY set. Add it to the environment and redeploy.' });
  }

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const raw = await readRawBody(req);
      body = raw ? JSON.parse(raw) : {};
    }

    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    const messages = [{ role: 'system', content: pack.systemPrompt }, ...history];

    let userText = '';

    if (body.start) {
      messages.push({
        role: 'user',
        content: pack.startTrigger,
      });
    } else if (body.audio) {
      userText = await transcribe(body.audio, body.mimeType);
      if (!userText) return send(200, { userText: '', assistantText: '', audio: '', empty: true });
      messages.push({ role: 'user', content: userText });
    } else if (typeof body.text === 'string' && body.text.trim()) {
      userText = body.text.trim();
      messages.push({ role: 'user', content: userText });
    } else {
      return send(400, { error: 'Nothing to respond to.' });
    }

    const assistantText = await chat(messages);

    let audio = '';
    try { audio = await tts(assistantText); } catch (e) { audio = ''; } // text still useful if speech fails

    return send(200, { userText, assistantText, audio });
  } catch (err) {
    return send(500, { error: String((err && err.message) || err) });
  }
};
