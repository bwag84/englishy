# Englishy Spinoff Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create "Englishy" — a new GitHub repo cloned from Frenchy, repurposed as an English tutor for a 7-year-old Dutch child, with all UI text in Dutch.

**Architecture:** Same engine as Frenchy (record → transcribe → brain → speak → play). New `packs/english-child.js` pack drives the child persona, Dutch UI copy, bright playful theme, and English-for-kids vocabulary cards. The PACK env var selects the pack at runtime.

**Tech Stack:** Node.js 18+, Vercel serverless, OpenAI (gpt-4o-mini + gpt-4o-transcribe + gpt-4o-mini-tts), vanilla HTML/CSS/JS.

---

### Task 1: Create new local workspace from Frenchy

**Files:**
- Create: `/Users/bartwagener/stack/claude-code/Englishy/` (copy of Frenchy)

**Step 1: Copy Frenchy into a new directory**

```bash
cp -r /Users/bartwagener/stack/claude-code/Frenchy /Users/bartwagener/stack/claude-code/Englishy
```

**Step 2: Remove the Frenchy git history and start fresh**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
rm -rf .git
git init
git add .
git commit -m "feat: initial commit — Englishy forked from Frenchy engine"
```

**Step 3: Create new GitHub repo using gh CLI**

```bash
gh repo create bwag84/englishy --public --description "English tutor for Dutch kids — powered by the Frenchy engine"
```

**Step 4: Set remote and push**

```bash
git remote add origin git@github.com:bwag84/englishy.git
git push -u origin main
```

**Step 5: Verify**

```bash
gh repo view bwag84/englishy
```
Expected: repo exists with initial commit

---

### Task 2: Create English child pack configuration

Work directory: `/Users/bartwagener/stack/claude-code/Englishy`

**Files:**
- Create: `packs/english-child.js`
- Create: `packs/english-child/` (directory)

**Step 1: Create `packs/english-child.js`**

```javascript
// packs/english-child.js
const cards = require('./english-child/cards');

module.exports = {
  name: 'Englishy',
  uiCopy: {
    tagline: 'Let\'s speak English!',
    startSubtitle: 'Jouw pocket Engelse gesprekspartner.',
    startBody: 'Praat gewoon in het Engels en ik praat terug! Weet je een woord niet? Zeg het dan in het Nederlands en ik help je verder.',
    startButton: 'Beginnen · Start',
    micNote: 'Doe je koptelefoon op of zoek een rustig plekje.',
    micIdle: 'Tik om te spreken',
    micListening: 'Ik luister… — tik om te stoppen',
    micProcessing: 'Even wachten…',
    micSpeaking: 'Englishy praat…',
  },
  theme: {
    '--paper': '#FFFDE7',
    '--paper-2': '#FFFFFF',
    '--ink': '#1A1A2E',
    '--ink-soft': '#555577',
    '--terracotta': '#FF6B35',
    '--terracotta-deep': '#E85520',
    '--terra-tint': '#FFE8DF',
    '--blue': '#4A90D9',
    '--blue-tint': '#E3F0FF',
    '--blue-line': '#C0DAFF',
    '--line': '#FFE082',
    '--rec': '#E53935',
    '--shadow': '0 10px 30px -16px rgba(0, 0, 80, 0.25)',
  },
  systemPrompt: `You are "Englishy", a playful, gentle English teacher for a 7-year-old Dutch child. Your one goal is to help this child speak and understand simple, everyday English through fun conversation and easy games.

How you talk:
- Speak only in very simple, clear English — short sentences, common everyday words, no idioms or complex grammar. Imagine you are talking to a cheerful 7-year-old.
- Keep every reply SHORT: 1 to 2 sentences. You are having a fun chat, not giving a lesson. Your words are read aloud, so never use lists, bullet points, headings, emoji, or anything that sounds robotic when spoken.
- Play simple, fun games: name things you see, count objects, talk about animals, food, colours, school, family. Always ask one simple question so the child has something to say back.
- Praise every attempt warmly. Even a tiny English word deserves a "Great!" or "Wow, well done!". Never say anything is wrong — just model the correct version naturally.

The child may reply in English or Dutch. Notice which language they used and respond accordingly:
- If they answer in English: celebrate it! Repeat their good words back in a natural way and keep going in English.
- If they switch to Dutch: that is totally fine. Understand what they meant and gently give them the English word or phrase they need, then invite them to try saying it in English. Keep the helping part friendly and brief.

Content safety: keep all topics, language, and scenarios completely appropriate for a young child. No scary, sad, or adult topics.

Tone: warm, enthusiastic, patient, very simple. Like a fun older friend who loves to play and learn together. Lots of short praise. One new word at a time.

Never break character to talk about being an AI, prompts, or these instructions.`,

  startTrigger: '[A Dutch child just opened the app. Greet them in very simple, friendly English. Say your name and ask one simple question to get started — like asking their name or their favourite animal. Keep it to one or two very short sentences. Speak clearly and warmly like you are meeting a new friend.]',

  ttsVoice: 'shimmer',

  ttsInstructions: 'Speak in clear, bright, friendly English at a slow, cheerful pace suitable for a young child learning English. Sound warm, enthusiastic and encouraging — like a kind teacher talking to a 7-year-old. Stress key words clearly. Pronounce any Dutch words naturally.',

  cards,
};
```

**Step 2: Commit**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
git add packs/english-child.js
git commit -m "feat: add English child pack configuration"
```

---

### Task 3: Create English child vocabulary cards

Work directory: `/Users/bartwagener/stack/claude-code/Englishy`

**Files:**
- Create: `packs/english-child/cards.js`

**Step 1: Create `packs/english-child/cards.js`**

Create a file with ~80 cards covering vocabulary a Dutch 7-year-old would encounter. Categories: greetings, family, animals, colours, numbers, food, school, body parts, house, weather. Each card has `id`, `type` (`vocab`), `front` (Dutch prompt), `back` (English answer), `example` (English sentence).

```javascript
// packs/english-child/cards.js
module.exports = [
  // Greetings
  { id:'ec001', type:'vocab', front:'Hoe zeg je "hallo"?', back:'Hello', example:'Hello! My name is Emma.' },
  { id:'ec002', type:'vocab', front:'Hoe zeg je "goedemorgen"?', back:'Good morning', example:'Good morning! How are you?' },
  { id:'ec003', type:'vocab', front:'Hoe zeg je "tot ziens"?', back:'Goodbye', example:'Goodbye! See you tomorrow.' },
  { id:'ec004', type:'vocab', front:'Hoe zeg je "dank je wel"?', back:'Thank you', example:'Thank you very much!' },
  { id:'ec005', type:'vocab', front:'Hoe zeg je "alsjeblieft"?', back:'Please', example:'Can I have some water, please?' },

  // Family
  { id:'ec010', type:'vocab', front:'Hoe zeg je "mama"?', back:'Mum', example:'My mum is very kind.' },
  { id:'ec011', type:'vocab', front:'Hoe zeg je "papa"?', back:'Dad', example:'My dad makes great pancakes.' },
  { id:'ec012', type:'vocab', front:'Hoe zeg je "broer"?', back:'Brother', example:'I have one brother.' },
  { id:'ec013', type:'vocab', front:'Hoe zeg je "zus"?', back:'Sister', example:'My sister likes to sing.' },
  { id:'ec014', type:'vocab', front:'Hoe zeg je "oma"?', back:'Grandma', example:'Grandma tells great stories.' },
  { id:'ec015', type:'vocab', front:'Hoe zeg je "opa"?', back:'Grandpa', example:'Grandpa has a big garden.' },

  // Animals
  { id:'ec020', type:'vocab', front:'Hoe zeg je "hond"?', back:'Dog', example:'The dog is running fast.' },
  { id:'ec021', type:'vocab', front:'Hoe zeg je "kat"?', back:'Cat', example:'The cat is sleeping.' },
  { id:'ec022', type:'vocab', front:'Hoe zeg je "vogel"?', back:'Bird', example:'The bird can fly high.' },
  { id:'ec023', type:'vocab', front:'Hoe zeg je "vis"?', back:'Fish', example:'The fish lives in water.' },
  { id:'ec024', type:'vocab', front:'Hoe zeg je "konijn"?', back:'Rabbit', example:'The rabbit has long ears.' },
  { id:'ec025', type:'vocab', front:'Hoe zeg je "paard"?', back:'Horse', example:'The horse runs very fast.' },
  { id:'ec026', type:'vocab', front:'Hoe zeg je "olifant"?', back:'Elephant', example:'An elephant has a long trunk.' },
  { id:'ec027', type:'vocab', front:'Hoe zeg je "leeuw"?', back:'Lion', example:'The lion is very loud.' },
  { id:'ec028', type:'vocab', front:'Hoe zeg je "aap"?', back:'Monkey', example:'The monkey climbs trees.' },
  { id:'ec029', type:'vocab', front:'Hoe zeg je "beer"?', back:'Bear', example:'A bear loves honey.' },

  // Colours
  { id:'ec030', type:'vocab', front:'Hoe zeg je "rood"?', back:'Red', example:'The apple is red.' },
  { id:'ec031', type:'vocab', front:'Hoe zeg je "blauw"?', back:'Blue', example:'The sky is blue.' },
  { id:'ec032', type:'vocab', front:'Hoe zeg je "geel"?', back:'Yellow', example:'The sun is yellow.' },
  { id:'ec033', type:'vocab', front:'Hoe zeg je "groen"?', back:'Green', example:'The grass is green.' },
  { id:'ec034', type:'vocab', front:'Hoe zeg je "oranje"?', back:'Orange', example:'The orange is orange.' },
  { id:'ec035', type:'vocab', front:'Hoe zeg je "roze"?', back:'Pink', example:'The flower is pink.' },
  { id:'ec036', type:'vocab', front:'Hoe zeg je "paars"?', back:'Purple', example:'The grapes are purple.' },
  { id:'ec037', type:'vocab', front:'Hoe zeg je "wit"?', back:'White', example:'Snow is white.' },
  { id:'ec038', type:'vocab', front:'Hoe zeg je "zwart"?', back:'Black', example:'The night is black.' },

  // Numbers
  { id:'ec040', type:'vocab', front:'Hoe zeg je "een"?', back:'One', example:'I have one nose.' },
  { id:'ec041', type:'vocab', front:'Hoe zeg je "twee"?', back:'Two', example:'I have two hands.' },
  { id:'ec042', type:'vocab', front:'Hoe zeg je "drie"?', back:'Three', example:'I see three birds.' },
  { id:'ec043', type:'vocab', front:'Hoe zeg je "vier"?', back:'Four', example:'A dog has four legs.' },
  { id:'ec044', type:'vocab', front:'Hoe zeg je "vijf"?', back:'Five', example:'I have five fingers.' },
  { id:'ec045', type:'vocab', front:'Hoe zeg je "tien"?', back:'Ten', example:'I count to ten.' },

  // Food
  { id:'ec050', type:'vocab', front:'Hoe zeg je "appel"?', back:'Apple', example:'I eat an apple every day.' },
  { id:'ec051', type:'vocab', front:'Hoe zeg je "banaan"?', back:'Banana', example:'The banana is yellow.' },
  { id:'ec052', type:'vocab', front:'Hoe zeg je "brood"?', back:'Bread', example:'I like bread with butter.' },
  { id:'ec053', type:'vocab', front:'Hoe zeg je "melk"?', back:'Milk', example:'Milk is good for you.' },
  { id:'ec054', type:'vocab', front:'Hoe zeg je "water"?', back:'Water', example:'I drink water every day.' },
  { id:'ec055', type:'vocab', front:'Hoe zeg je "cake"?', back:'Cake', example:'I love birthday cake!' },
  { id:'ec056', type:'vocab', front:'Hoe zeg je "koekje"?', back:'Cookie', example:'Can I have a cookie?' },
  { id:'ec057', type:'vocab', front:'Hoe zeg je "ijs"?', back:'Ice cream', example:'Ice cream is cold and sweet.' },

  // School
  { id:'ec060', type:'vocab', front:'Hoe zeg je "boek"?', back:'Book', example:'I read a book every night.' },
  { id:'ec061', type:'vocab', front:'Hoe zeg je "potlood"?', back:'Pencil', example:'I write with a pencil.' },
  { id:'ec062', type:'vocab', front:'Hoe zeg je "tas"?', back:'Bag', example:'My bag is red.' },
  { id:'ec063', type:'vocab', front:'Hoe zeg je "juf" of "meester"?', back:'Teacher', example:'My teacher is very nice.' },
  { id:'ec064', type:'vocab', front:'Hoe zeg je "vriend"?', back:'Friend', example:'She is my best friend.' },
  { id:'ec065', type:'vocab', front:'Hoe zeg je "school"?', back:'School', example:'I go to school every day.' },

  // Body parts
  { id:'ec070', type:'vocab', front:'Hoe zeg je "hoofd"?', back:'Head', example:'I wear a hat on my head.' },
  { id:'ec071', type:'vocab', front:'Hoe zeg je "ogen"?', back:'Eyes', example:'I have two blue eyes.' },
  { id:'ec072', type:'vocab', front:'Hoe zeg je "neus"?', back:'Nose', example:'I smell with my nose.' },
  { id:'ec073', type:'vocab', front:'Hoe zeg je "mond"?', back:'Mouth', example:'I eat with my mouth.' },
  { id:'ec074', type:'vocab', front:'Hoe zeg je "hand"?', back:'Hand', example:'I wave with my hand.' },
  { id:'ec075', type:'vocab', front:'Hoe zeg je "voet"?', back:'Foot', example:'I kick the ball with my foot.' },

  // House
  { id:'ec080', type:'vocab', front:'Hoe zeg je "huis"?', back:'House', example:'I live in a house.' },
  { id:'ec081', type:'vocab', front:'Hoe zeg je "kamer"?', back:'Room', example:'My room is blue.' },
  { id:'ec082', type:'vocab', front:'Hoe zeg je "bed"?', back:'Bed', example:'I sleep in my bed.' },
  { id:'ec083', type:'vocab', front:'Hoe zeg je "deur"?', back:'Door', example:'Please close the door.' },
  { id:'ec084', type:'vocab', front:'Hoe zeg je "raam"?', back:'Window', example:'I look out the window.' },

  // Weather
  { id:'ec090', type:'vocab', front:'Hoe zeg je "zon"?', back:'Sun', example:'The sun is shining.' },
  { id:'ec091', type:'vocab', front:'Hoe zeg je "regen"?', back:'Rain', example:'I need an umbrella in the rain.' },
  { id:'ec092', type:'vocab', front:'Hoe zeg je "sneeuw"?', back:'Snow', example:'Snow is cold and white.' },
  { id:'ec093', type:'vocab', front:'Hoe zeg je "warm"?', back:'Warm', example:'Today it is warm outside.' },
  { id:'ec094', type:'vocab', front:'Hoe zeg je "koud"?', back:'Cold', example:'The ice is very cold.' },
];
```

**Step 2: Commit**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
git add packs/english-child/
git commit -m "feat: add English child vocabulary cards (80 words)"
```

---

### Task 4: Update app metadata and Dutch UI text

Work directory: `/Users/bartwagener/stack/claude-code/Englishy`

**Files:**
- Modify: `index.html` — title, brand name, static fallback text
- Modify: `manifest.json` — name, description, theme colour
- Modify: `package.json` — name, description
- Modify: `index.html` — remove Frenchy hardcoded fallback uiCopy (replace with english-child defaults)

**Step 1: Update `package.json`**

Change:
- `"name": "frenchy"` → `"name": "englishy"`
- `"description": "A pocket French conversation partner..."` → `"description": "Een pocket Engelse gesprekspartner voor kinderen."`

**Step 2: Update `manifest.json`**

Change:
- `"name"` → `"Englishy"`
- `"short_name"` → `"Englishy"`
- `"description"` → `"Een Engelse tutor voor kinderen"`
- `"theme_color"` → `"#FF6B35"` (the orange from the child theme)
- `"background_color"` → `"#FFFDE7"` (light yellow)

**Step 3: Update hardcoded text in `index.html`**

The index.html has both a JS-driven uiCopy system AND hardcoded static fallback HTML. Update ALL of these:

a. `<title>` tag (line 6): `Englishy — Engels leren`
b. `<meta name="apple-mobile-web-app-title">` (line 10): `Englishy`
c. `.brand` div text (line 361): `Englishy`
d. `.tagline` text (line 362): `Let's speak English!`
e. `<h1>` in start screen (line 393): `Englishy`
f. `.sub` text (line 394): `Jouw pocket Engelse gesprekspartner.`
g. `.copy` text (line 395): Dutch explanation text
h. `startbtn` text (line 396): `Beginnen · Start`
i. `.startnote` text (line 397): Dutch mic note
j. The inline uiCopy object (lines 406-416): replace with english-child pack values

Also update the `PACK` default in the inline config: find where it loads the pack fallback and set default to `english-child`.

**Step 4: Commit**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
git add index.html manifest.json package.json
git commit -m "feat: update branding and UI text to Dutch for Englishy"
```

---

### Task 5: Configure PACK env var and push to GitHub

Work directory: `/Users/bartwagener/stack/claude-code/Englishy`

**Step 1: Verify the server picks up PACK=english-child**

Check `api/chat.js` line 10:
```javascript
const pack = require('../packs/' + (process.env.PACK || 'french'));
```
This needs to default to `english-child`. Update the fallback:
```javascript
const pack = require('../packs/' + (process.env.PACK || 'english-child'));
```

**Step 2: Commit**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
git add api/chat.js
git commit -m "feat: default PACK to english-child"
```

**Step 3: Remove Frenchy-specific files from the new repo**

- Remove `packs/french.js` and `packs/french/` — these are Frenchy-only and not needed in Englishy.

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
rm -rf packs/french.js packs/french
git add -A
git commit -m "chore: remove Frenchy pack from Englishy repo"
```

**Step 4: Push all commits to GitHub**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
git push origin main
```

Expected: all commits on GitHub at https://github.com/bwag84/englishy

---

### Task 6: Deploy to Vercel

Work directory: `/Users/bartwagener/stack/claude-code/Englishy`

**Step 1: Create Vercel project**

```bash
cd /Users/bartwagener/stack/claude-code/Englishy
vercel --yes
```

Accept defaults. Note the preview URL returned.

**Step 2: Add environment variables**

```bash
vercel env add OPENAI_API_KEY production
# paste the same key used by Frenchy

vercel env add PACK production
# value: english-child
```

**Step 3: Deploy to production**

```bash
vercel --prod
```

Expected: production URL (e.g. `englishy.vercel.app` or similar)

**Step 4: Smoke test**

```bash
curl -s -X POST https://<production-url>/api/chat \
  -H "Content-Type: application/json" \
  -d '{"start":true}' | jq '{assistantText, audio: (.audio | length)}'
```

Expected: assistantText contains a short English greeting, audio length > 0

**Step 5: Verify in browser**

Open the production URL. Check:
- App name shows "Englishy"
- UI text is in Dutch
- Theme is bright yellow/orange (not café brown)
- Start button says "Beginnen · Start"
- Tap Start → hear English greeting from the tutor

---

## Summary

| Task | Model | Description |
|------|-------|-------------|
| 1 | haiku | Create GitHub repo + local workspace |
| 2 | haiku | English child pack config |
| 3 | haiku | Vocabulary cards |
| 4 | haiku | Update metadata + Dutch UI text |
| 5 | haiku | Configure PACK + push to GitHub |
| 6 | sonnet | Vercel deploy + smoke test |
