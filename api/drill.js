// api/drill.js — evaluates a spoken drill answer and returns audio feedback.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TTS_MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts';
const pack = require('../packs/' + (process.env.PACK || 'french'));

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function tts(text) {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: pack.ttsVoice,
      input: text,
      instructions: pack.ttsInstructions,
      response_format: 'mp3',
    }),
  });
  if (!r.ok) return '';
  return Buffer.from(await r.arrayBuffer()).toString('base64');
}

function normalise(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function checkAnswer(userAnswer, card) {
  const got = normalise(userAnswer);
  const expected = normalise(card.en);
  if (got === expected) return true;
  // Also accept without pronouns for conj cards (e.g. "vais" matches "je vais")
  if (card.type === 'conj') {
    const parts = expected.split(' ');
    return parts.some(p => p.length > 2 && got.includes(p));
  }
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  const send = (code, obj) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  };

  if (!OPENAI_API_KEY) return send(500, { error: 'No OPENAI_API_KEY' });

  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const raw = await readRawBody(req);
      body = raw ? JSON.parse(raw) : {};
    }

    const { card, userAnswer, ttsOnly, text } = body;

    // ttsOnly mode: just speak a prompt (used to read card prompt aloud)
    if (ttsOnly && text) {
      const audio = await tts(text);
      return send(200, { audio });
    }

    if (!card || !userAnswer) return send(400, { error: 'Missing card or userAnswer' });

    const correct = checkAnswer(userAnswer, card);

    let feedback;
    if (correct) {
      feedback = card.type === 'conj'
        ? `Oui! "${card.en}". Excellent!`
        : `Oui, c'est ça! "${card.fr}" — ${card.en}.`;
    } else {
      feedback = card.type === 'conj'
        ? `Pas tout à fait. La bonne réponse est: ${card.en}.`
        : `Pas tout à fait. C'est "${card.fr}" — ${card.en}.`;
    }

    const audio = await tts(feedback).catch(() => '');
    return send(200, { correct, feedback, audio });
  } catch (err) {
    return send(500, { error: String(err.message || err) });
  }
};
