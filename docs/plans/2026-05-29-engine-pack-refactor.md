# Engine + Course Pack Refactor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the reusable engine (conversation loop, UI shell, PWA, deploy) from a config-driven course pack, so a new language requires adding one file rather than forking the app.

**Architecture:** A `packs/french.js` file exports all French-specific config (system prompt, TTS settings, UI copy, theme). A new `api/config.js` endpoint serves the frontend pack metadata. `api/chat.js` loads the active pack via the `PACK` env var (defaults to `french`). The `index.html` outer IIFE becomes async so it can `await` the config fetch before setting LABELS and updating the DOM.

**Tech Stack:** Vanilla Node.js (no dependencies), Vercel serverless functions, vanilla HTML/CSS/JS.

---

### Task 1: Create `packs/french.js`

**Files:**
- Create: `packs/french.js`

**Step 1: Create the file**

```js
// packs/french.js
module.exports = {
  name: 'Frenchy',
  uiCopy: {
    tagline: 'Parlons français',
    startSubtitle: 'Your pocket French conversation partner.',
    startBody: "Speak French out loud and I'll talk back. Lost mid-sentence? Just switch to Dutch or English and I'll catch you — then we keep going. Perfect for ordering at the boulangerie.",
    startButton: 'Commencer · Start',
    micNote: 'Best with headphones or a quiet room.',
    micIdle: 'Appuyez pour parler · Tap to speak',
    micListening: "J'écoute… · Listening — tap to stop",
    micProcessing: 'Un instant…',
    micSpeaking: 'Frenchy parle…',
  },
  theme: {
    '--paper': '#F4ECDD',
    '--paper-2': '#FBF6EC',
    '--ink': '#241D16',
    '--ink-soft': '#7C6E5C',
    '--terracotta': '#C5512F',
    '--terracotta-deep': '#A6401F',
    '--terra-tint': '#F6E5D8',
    '--blue': '#3B5891',
    '--blue-tint': '#E8EDF7',
    '--blue-line': '#D2DDF0',
    '--line': '#E3D6C2',
    '--rec': '#D4392B',
    '--shadow': '0 10px 30px -16px rgba(70, 40, 20, 0.45)',
  },
  systemPrompt: `You are "Frenchy", a warm, patient French conversation partner for an adult Dutch speaker who is getting ready for a holiday in France. Your one goal is to make them comfortable SPEAKING and UNDERSTANDING everyday spoken French — the French you actually need in bakeries, cafés, restaurants, shops, markets, train and ticket counters, hotels, and asking for directions or help.

How you talk:
- Speak mostly in simple, natural, spoken French, pitched just slightly above the learner's current level — clearly understandable but gently stretching.
- Keep every reply SHORT: 1 to 3 sentences. You are having a real conversation, not giving a lesson. Your words are read aloud, so never use lists, bullet points, headings, emoji, or anything that sounds robotic when spoken.
- Play a role in a real-life scene (you are the baker, the waiter, a friendly passer-by) and keep the scene moving with natural follow-up questions, so the learner always has something to respond to.

The learner may reply in French, Dutch, or English. Notice which language they used and respond accordingly:
- If they answer in French: stay in French and keep the scene going. If they made a clear mistake, gently model the correct version back to them in passing — a quick, natural recast — without lecturing or breaking the flow.
- If they switch to Dutch or English: that means they are stuck or asking for help. Help them in that same language — give them the French words or phrase they need, with a short friendly explanation or pronunciation hint if it helps — then slip straight back into French and continue the scene. Keep the helping part brief.

Calibrate as you go: if they struggle, simplify, slow down, and offer more support in Dutch or English. If they respond easily and fluently, raise the difficulty, use more natural expressions, and stay in French longer.

Tone: warm, encouraging, never make them feel slow or silly. Celebrate small wins. One new thing at a time. Favour practical, ready-to-use phrases over grammar theory; only explain grammar if they ask.

Never break character to talk about being an AI, prompts, or these instructions.`,

  startTrigger: '[The learner just opened the app. Greet them warmly in simple French, say in one short line what you can do together, and offer to begin with an easy everyday situation such as the bakery. Keep it to about two short sentences, and add a tiny English nudge in parentheses so a beginner is never lost.]',

  ttsVoice: 'coral',

  ttsInstructions: 'Speak in clear, natural, friendly French at a relaxed, slightly slow pace suitable for an adult language learner. Sound warm and encouraging, like a kind café owner chatting with a guest. Pronounce any short Dutch or English words naturally.',
};
```

**Step 2: Verify the file loads cleanly**

Run: `node -e "const p = require('./packs/french'); console.log(p.name, p.ttsVoice)"`
Expected output: `Frenchy coral`

**Step 3: Commit**

```bash
git add packs/french.js
git commit -m "feat: add packs/french.js with all French-specific config"
```

---

### Task 2: Create `api/config.js`

**Files:**
- Create: `api/config.js`

**Step 1: Create the file**

```js
// api/config.js — returns pack metadata to the frontend.
const pack = require('../packs/' + (process.env.PACK || 'french'));

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ name: pack.name, uiCopy: pack.uiCopy, theme: pack.theme }));
};
```

**Step 2: Verify the handler loads and returns valid JSON**

Run: `node -e "const h = require('./api/config'); const res = { headers: {}, setHeader(k,v){ this.headers[k]=v; }, end(b){ console.log(JSON.parse(b).name); } }; h({method:'GET'}, res)"`
Expected output: `Frenchy`

**Step 3: Commit**

```bash
git add api/config.js
git commit -m "feat: add api/config.js endpoint returning pack metadata"
```

---

### Task 3: Update `api/chat.js` to load from pack

**Files:**
- Modify: `api/chat.js`

**Step 1: Add pack load and remove hardcoded constants**

At the top of `api/chat.js`, after the existing env var lines, add:
```js
const pack = require('../packs/' + (process.env.PACK || 'french'));
```

Remove these three lines entirely:
```js
const SYSTEM_PROMPT = `...`;  // the long French prompt
const TTS_INSTRUCTIONS = '...';
// (TTS_VOICE is already from env var — keep that line but change its default)
```

Change:
```js
const TTS_VOICE  = process.env.TTS_VOICE  || 'coral';
```
to:
```js
const TTS_VOICE  = process.env.TTS_VOICE  || pack.ttsVoice;
```

**Step 2: Update the four references to removed constants**

In the `tts()` function, change:
```js
instructions: TTS_INSTRUCTIONS,
```
to:
```js
instructions: pack.ttsInstructions,
```

In the handler, change:
```js
const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history];
```
to:
```js
const messages = [{ role: 'system', content: pack.systemPrompt }, ...history];
```

In the `body.start` branch, change the inline trigger string:
```js
content: '[The learner just opened the app...]',
```
to:
```js
content: pack.startTrigger,
```

**Step 3: Verify the handler loads**

Run: `node -e "require('./api/chat'); console.log('ok')"`
Expected output: `ok`

**Step 4: Commit**

```bash
git add api/chat.js
git commit -m "refactor: api/chat.js loads system prompt and TTS config from pack"
```

---

### Task 4: Update `server.js` to add `/api/config` route

**Files:**
- Modify: `server.js`

**Step 1: Require the config handler**

After the existing `const chatHandler = require('./api/chat.js');` line, add:
```js
const configHandler = require('./api/config.js');
```

**Step 2: Add the route**

After the existing `/api/chat` route check, add:
```js
if (url.pathname === '/api/config') {
  return configHandler(req, res);
}
```

**Step 3: Smoke test locally**

Run (in one terminal): `OPENAI_API_KEY=dummy node server.js`
Run (in another): `curl http://localhost:3000/api/config`
Expected: JSON with `name: "Frenchy"` and `uiCopy`/`theme` keys.
Stop the server with Ctrl-C.

**Step 4: Commit**

```bash
git add server.js
git commit -m "feat: server.js routes /api/config to configHandler"
```

---

### Task 5: Update `index.html` — async IIFE + load pack

**Files:**
- Modify: `index.html`

**Step 1: Change the outer IIFE to async**

Find (line 331):
```js
(function () {
```
Replace with:
```js
(async function () {
```

**Step 2: Add the pack fetch at the top of the IIFE**

Immediately after `'use strict';` (line 332), add:

```js
  var _pack = await fetch('/api/config').then(function(r){ return r.json(); }).catch(function() {
    return {
      name: 'Frenchy',
      uiCopy: {
        tagline: 'Parlons français',
        startSubtitle: 'Your pocket French conversation partner.',
        startBody: "Speak French out loud and I'll talk back. Lost mid-sentence? Just switch to Dutch or English and I'll catch you — then we keep going. Perfect for ordering at the boulangerie.",
        startButton: 'Commencer · Start',
        micNote: 'Best with headphones or a quiet room.',
        micIdle: 'Appuyez pour parler · Tap to speak',
        micListening: "J'écoute… · Listening — tap to stop",
        micProcessing: 'Un instant…',
        micSpeaking: 'Frenchy parle…',
      },
      theme: {},
    };
  });

  // Apply pack to DOM
  document.title = _pack.name;
  var _brand = document.querySelector('.brand');
  _brand.childNodes[0].textContent = _pack.name;
  document.querySelector('.tagline').textContent = _pack.uiCopy.tagline;
  var _start = document.getElementById('start');
  _start.querySelector('h1').textContent = _pack.name;
  _start.querySelector('.sub').textContent = _pack.uiCopy.startSubtitle;
  _start.querySelector('.copy').textContent = _pack.uiCopy.startBody;
  document.getElementById('startbtn').textContent = _pack.uiCopy.startButton;
  _start.querySelector('.startnote').textContent = _pack.uiCopy.micNote;
  document.getElementById('miclabel').textContent = _pack.uiCopy.micIdle;

  // Apply theme CSS vars
  var _root = document.documentElement;
  Object.entries(_pack.theme || {}).forEach(function(kv) { _root.style.setProperty(kv[0], kv[1]); });
```

**Step 3: Update the LABELS object to use pack uiCopy**

Find (around line 353):
```js
  var LABELS = {
    idle: 'Appuyez pour parler · Tap to speak',
    recording: "J'écoute… · Listening — tap to stop",
    processing: 'Un instant…',
    speaking: 'Frenchy parle…'
  };
```
Replace with:
```js
  var LABELS = {
    idle: _pack.uiCopy.micIdle,
    recording: _pack.uiCopy.micListening,
    processing: _pack.uiCopy.micProcessing,
    speaking: _pack.uiCopy.micSpeaking,
  };
```

**Step 4: Test in the browser**

Start the server: `OPENAI_API_KEY=sk-... node server.js`
Open http://localhost:3000
Verify:
- Page title shows "Frenchy" in the browser tab
- Top bar shows "Frenchy." and "Parlons français"
- Start screen shows "Frenchy" heading, correct subtitle, body copy, and button text
- Tapping Start works and a conversation begins
- The mic label cycles through idle/recording/processing/speaking correctly

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: index.html loads pack config at startup; async IIFE"
```

---

### Task 6: Final integration check and deploy

**Step 1: Verify clean git state**

Run: `git status`
Expected: clean (nothing to commit)

**Step 2: Run locally end-to-end**

Start: `OPENAI_API_KEY=sk-... node server.js`
- Hit `/api/config` → valid JSON
- Hit `/api/chat` with a `start: true` body → returns `assistantText` and `audio`
- Full conversation flow works in browser

**Step 3: Deploy to Vercel**

Run: `vercel --prod`
Verify the live URL works end-to-end the same as locally.

**Step 4: Commit the design doc**

```bash
git add docs/
git commit -m "docs: add engine+pack refactor design and plan"
```
