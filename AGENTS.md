# Englishy

Voice-first English tutor for a specific 7-year-old Dutch girl named **Isa**. The tutor is a personal character — **Sterre**, a warm little rainbow unicorn who is Isa's English friend. Sterre talks **mainly in Dutch** and weaves English in gently, one little word at a time, then invites Isa to say it back. Built for **speaking and listening first**, playful and gentle, with friendly games drawn from Isa's world (ballet, dancing, gymnastics, unicorns and magic, animals, school, easy maths, food and play).

The on-screen **UI is in Dutch** (so a young child knows what to do); the language she **learns** is **British English** (vocabulary and accent). The conversation starts in Dutch and ramps up English as she gets comfortable — earlier "start in English" was too hard.

This repo is a spinoff of the original "Frenchy" app. Frenchy has been removed; Englishy keeps the engine and ships a single English-for-a-child course pack.

---

## Architecture: engine + course pack

The reusable **engine** (UI shell, conversation loop, drilling, PWA, deploy plumbing) is separated from a config-driven **course pack** (everything language-specific). A new language/learner is a new pack, not a new app.

- **Engine:** `index.html` (UI + record→play loop + drills), `api/chat.js`, `api/drill.js`, `server.js`, PWA assets.
- **Pack:** `packs/english-child.js` (+ `packs/english-child/cards.js`) — target language, tutor persona/system prompt, UI copy, theme colours, voice + voice instructions, and the drill cards. Selected by the `PACK` env var, **defaulting to `english-child`**.

### Conversation loop
1. The browser records the learner — push-to-talk via `MediaRecorder`.
2. Audio is sent to `/api/chat` as base64 JSON.
3. The function transcribes it (`gpt-4o-transcribe`, **no `language` param** so Dutch / English auto-detect), runs the tutor brain (chat completion with the pack's system prompt = Sterre's persona), and synthesises a spoken reply (`gpt-4o-mini-tts`, using the pack's `ttsInstructions`). The reply is **Dutch-primary with English words mixed in**; the voice instructions tell a single voice to pronounce Dutch naturally and any English words in a British accent.
4. It returns `{ userText, assistantText, audio }` (`audio` is base64 mp3).
5. The browser shows both lines and plays the audio.

The OpenAI key is read **server-side only** and never sent to the browser.

### Drilling (vocab / sentences / quiet game)
The bottom tabs add stateful practice on top of the chat:
- **Woorden** (vocab) and **Zinnen** (sentences) are *spoken* drills: the Dutch prompt is read aloud (in Dutch, via the pack's `promptTtsInstructions`), the child speaks the English answer, `/api/drill` checks it and speaks warm Dutch-first feedback that addresses Isa by name.
- **Kiezen** is a quiet multiple-choice game.
- Scheduling uses an **SM-2 spaced-repetition** algorithm; progress is stored in the browser (`localStorage`, key `englishy_progress`). Cards have `{ id, type, front, back, example }` where `front` is the Dutch prompt and `back` is the English answer. `type` is `vocab` or `conj` (used for the sentence drill).

### Gamification — golden stars
Every correct drill answer awards one **golden star** (a sparkle-burst animation, no punishment for wrong answers — you never lose stars). A HUD in the topbar shows **stars this session** (`#star-session`) and **total stars** (`#star-total`). The store lives in `localStorage` under key `englishy_stars` as `{ total, today: { date, count } }`; `sessionStars` is in-memory per page load. `awardStar()` (in `index.html`) is wired into the correct-answer branches of both the spoken drills and the quiet game, and fires a bigger rainbow celebration (addressing Isa) every 10th total star.

---

## Key files

- **`index.html`** — the entire front end: Dutch, mobile-first UI, push-to-talk recording, audio playback, transcript with a "Nog eens" replay button, the drill tabs (SM-2 + localStorage), the golden-star gamification system, and PWA wiring. Vanilla HTML/CSS/JS, all inline. Styled with the **Kawaii Rainbow** design system. Reads the active pack from `/api/config` and applies its copy + theme at runtime.
- **`kawaii-rainbow.css`** — the pastel unicorn/ice-cream design system (Fredoka + Baloo 2 fonts, `--kr-*` tokens, `.kr-*` components: candy buttons, frosted panels, sparkles, clouds, rainbow). Linked by `index.html` and served as a static file. This is the Englishy look; it does not affect any other pack.
- **`api/chat.js`** — the conversation handler (STT → brain → TTS). Loads the pack for the system prompt and voice.
- **`api/drill.js`** — evaluates a spoken drill answer and returns spoken feedback; also reads prompts aloud (`ttsOnly`).
- **`api/config.js`** — returns pack metadata (name, uiCopy, theme, cards) to the front end.
- **`packs/english-child.js`** + **`packs/english-child/cards.js`** — the course pack.
- **`server.js`** — optional zero-dependency Node server for self-hosting on a VPS; routes `/api/chat`, `/api/config`, `/api/drill`.
- **`manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-src.svg`** — PWA assets. The icon is a Union Jack (`icon-src.svg` is the source; regenerate the PNGs from it).
- **`package.json`** — no dependencies; `engines.node >= 18`; `start` runs `server.js`.

---

## Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | _(required)_ | OpenAI key. Server-side only. |
| `PACK` | `english-child` | Which course pack to load. |
| `CHAT_MODEL` | `gpt-4o-mini` | The tutor's brain. |
| `STT_MODEL` | `gpt-4o-transcribe` | Speech-to-text (auto-detects NL / EN). |
| `TTS_MODEL` | `gpt-4o-mini-tts` | Text-to-speech (honours voice instructions). |
| `TTS_VOICE` | _(pack: `coral`)_ | Speaking voice (light, warm, feminine). The British accent is driven mainly by the pack's `ttsInstructions`. |

---

## Common commands

- **Run locally (VPS-style):** `export OPENAI_API_KEY=sk-... && node server.js` → http://localhost:3000
- **Deploy to production (Vercel):** `vercel --prod`
- **Add/update a Vercel env var:** `vercel env add NAME`, then `vercel --prod`
- **Regenerate the icon:** edit `icon-src.svg`, then rasterise to `icon-512.png` / `icon-192.png` (e.g. `qlmanage -t -s 512 -o OUTDIR icon-src.svg`).

The microphone requires a **secure (https) origin** — `localhost` is fine for testing, a plain `http://` IP is not.

---

## Design principles (preserve these)

- **Voice-first.** The point is speaking and listening, not reading.
- **Spoken-style replies.** The tutor's text is read aloud, so replies stay very short (at most two sentences, often just one — also hard-capped via `max_tokens` in `api/chat.js`) and must **never** contain lists, bullet points, headings, or emoji.
- **Dutch-first, then English.** Sterre speaks mainly Dutch and introduces English gently, one word at a time. Don't make the conversation English-first — it's too hard for a beginner. The English she learns is **British English** (vocabulary like mum, colour, maths… and a British accent); keep the English side of the voice instructions British.
- **Personal.** The tutor is Sterre (a rainbow unicorn) and always addresses the child by name, **Isa**. Keep it warm and personal.
- **Dutch UI, Dutch safety net.** Everything on screen is Dutch; the child can fall back to Dutch any time and Sterre helps, then nudges back toward English.
- **Child-safe always.** Stay inside a 7-year-old's world; gently steer away from anything scary, sad, grown-up or unsuitable. The system prompt enforces this — keep it strong.
- **Playful and encouraging + rewarding.** Lots of short praise; never make her feel slow. Lean into her interests (ballet, dance, gymnastics, unicorns, animals, maths). Reward success with golden stars and never punish mistakes (stars only go up).
- **Kawaii Rainbow look.** The Englishy UI uses `kawaii-rainbow.css` (pastel, candy, sparkly). Keep new UI consistent with those tokens/components.
- **Mobile-first and installable.** It should feel like a real app on a phone.
- **Secrets only via env.** Never put the OpenAI key in client code.
- **No build step / zero dependencies.** Keep it this way unless there's a strong reason not to.

---

## Roadmap

- **Done:** engine + pack split; vocab/sentence/quiet drills with SM-2 spaced repetition and localStorage progress; Dutch UI; Dutch-first "Sterre" personality addressing Isa; British accent for taught English; golden-star gamification; Kawaii Rainbow visual redesign; Union Jack branding; child-safety guardrails.
- **Next ideas:** cross-device progress (a small backend store instead of localStorage); more drill content per topic; streaks / daily goals on top of the star system; a parent view of progress.

---

## Known considerations

- **iOS audio playback.** Playback uses the Web Audio API (`decodeAudioData` + a buffer source), unlocked inside the Start tap. On iPhones, Web Audio can be silenced by the hardware mute switch and the context can go dormant between turns. If playback problems surface, the robust fix is to play replies through a reusable HTML `<audio>` element (an object URL from the mp3 blob) — HTML media plays through the silent switch.
- **Cost.** Voice is metered per minute on the OpenAI key. Fine for personal use (cents per session).
- **Request size.** Audio is sent as base64 JSON; recording auto-stops at 40s to keep clips within serverless body limits.
- **Drill prompt audio.** Drill prompts are Dutch and read with the pack's `promptTtsInstructions`; feedback is Dutch-first (with the English answer word) read with the default `ttsInstructions`. Both use the single pack `ttsVoice` (`coral`).
- **Two localStorage stores.** `englishy_progress` (SM-2 drill scheduling) and `englishy_stars` (gamification). Changing these keys resets that data.
- **Tuning knobs (set per parent feedback).** Reply length: `max_tokens: 140` in `api/chat.js` plus a "hooguit twee korte zinnetjes" brevity line in the system prompt. Speech pace: `gpt-4o-mini-tts` has **no numeric speed parameter** — pacing is set qualitatively in the pack's `ttsInstructions` / `promptTtsInstructions` (currently nudged ~10% faster than a slow pace). Voice: `coral` (light/warm/feminine); alternatives if asked — `shimmer`/`nova` (lighter), `sage` (calmer).
