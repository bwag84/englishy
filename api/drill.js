// api/drill.js — evaluates a spoken drill answer and returns audio feedback.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TTS_MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts';
const pack = require('../packs/' + (process.env.PACK || 'english-child'));

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function tts(text, instructions) {
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: pack.ttsVoice,
      input: text,
      instructions: instructions || pack.ttsInstructions,
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
  const expected = normalise(card.back);
  if (got === expected) return true;
  // Be lenient: accept the answer if the key word is somewhere in what they said
  // (kids often say "it is a horse" instead of just "horse").
  const parts = expected.split(' ');
  return parts.some(p => p.length > 2 && got.includes(p));
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

    // ttsOnly mode: read the (Dutch) card prompt aloud using the pack's
    // prompt voice instructions, so Dutch is pronounced naturally.
    if (ttsOnly && text) {
      const audio = await tts(text, pack.promptTtsInstructions);
      return send(200, { audio });
    }

    if (!card || !userAnswer) return send(400, { error: 'Missing card or userAnswer' });

    const correct = checkAnswer(userAnswer, card);

    // Feedback is spoken aloud. Dutch-first, personal, with the English answer.
    let feedback;
    if (correct) {
      feedback = `Goed zo, Isa! "${card.back}". Wat knap!`;
    } else {
      feedback = `Bijna, Isa! Het is "${card.back}". Probeer maar eens: ${card.back}.`;
    }

    const audio = await tts(feedback).catch(() => '');
    return send(200, { correct, feedback, audio });
  } catch (err) {
    return send(500, { error: String(err.message || err) });
  }
};
