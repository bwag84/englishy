# Frenchy

Voice-first French conversation tutor. You speak French out loud, Frenchy talks back, and when you get stuck you can drop into Dutch or English — it catches you, then returns to French. Built for an adult Dutch speaker getting ready for a holiday in France: **speaking and listening first**, with practical survival scenarios (bakery, café, restaurant, shops, train and ticket counters, hotels, directions).

---

## Current architecture

A single static page plus one small server function. **No build step. No dependencies** (relies on Node 18+ built-in `fetch`, `FormData`, and `Blob`).

The conversation loop:
1. The browser records the learner — push-to-talk via `MediaRecorder`.
2. Audio is sent to the server function as base64 JSON.
3. The function transcribes it (`gpt-4o-transcribe`, with **no `language` param** so French / Dutch / English are auto-detected), runs the tutor brain (a chat completion using the system prompt), and synthesises a spoken reply (`gpt-4o-mini-tts`).
4. The function returns `{ userText, assistantText, audio }` where `audio` is a base64 mp3.
5. The browser shows both lines and plays the audio.

The OpenAI key is read from the environment **server-side only** and is never sent to the browser.

---

## Key files

- **`index.html`** — the entire front end: mobile-first café-styled UI, push-to-talk recording, audio playback, the conversation transcript with a Replay button per line, and PWA wiring. Vanilla HTML/CSS/JS, all inline.
- **`api/chat.js`** — the server-side handler (Vercel serverless function). Holds the tutor **system prompt** and the STT → brain → TTS pipeline. Also reused by `server.js`.
- **`server.js`** — optional zero-dependency Node server for self-hosting on a VPS. Serves the static files and routes `/api/chat` to the handler in `api/chat.js`.
- **`manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`** — PWA assets (installable, fullscreen, app icon).
- **`package.json`** — no dependencies; `engines.node >= 18`; `start` runs `server.js`.
- **`README.md`** — deploy and usage notes.

---

## Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | _(required)_ | OpenAI key. Server-side only. |
| `CHAT_MODEL` | `gpt-4o-mini` | The tutor's brain. |
| `STT_MODEL` | `gpt-4o-transcribe` | Speech-to-text (auto-detects FR / NL / EN). |
| `TTS_MODEL` | `gpt-4o-mini-tts` | Text-to-speech. |
| `TTS_VOICE` | `coral` | Speaking voice. |

---

## Common commands

- **Run locally (VPS-style):** `export OPENAI_API_KEY=sk-... && node server.js` → http://localhost:3000
- **Deploy to production (Vercel):** `vercel --prod`
- **Add/update a Vercel env var:** `vercel env add NAME`, then `vercel --prod`

Deployed on Vercel; also runnable on a VPS behind Nginx + HTTPS. The microphone requires a **secure (https) origin** — `localhost` is fine for testing, a plain `http://` IP is not.

---

## Design principles (preserve these)

- **Voice-first.** The point is speaking and listening, not reading.
- **Spoken-style replies.** The tutor's text is read aloud by TTS, so replies must stay short (1–3 sentences) and must **never** contain lists, bullet points, headings, or emoji.
- **Bilingual safety net.** The learner can fall back to Dutch or English at any time; the tutor helps in that language, then returns to French.
- **Auto-calibration.** The tutor judges the learner's level from their responses and adjusts difficulty.
- **Warm and encouraging.** Never make the learner feel slow.
- **Mobile-first and installable.** It should feel like a real app on a phone.
- **Stateless today.** The app currently stores nothing — refresh clears the conversation.
- **Secrets only via env.** Never put the OpenAI key in client code.
- **No build step / zero dependencies.** Keep it this way unless there's a strong reason not to.

---

## Roadmap

Active and planned work, in priority order.

### 1. Refactor to an "engine + course pack" architecture (do this first)

Separate the reusable **engine** from a config-driven **course pack** so spinoffs don't require forking.

- **Engine:** the conversation loop (record → transcribe → brain → speak → play), the UI shell, the PWA and deploy plumbing, and — once built — the drilling features.
- **Course pack:** everything language-specific — target language, the tutor's persona and system prompt, the scenario list, the voice, the on-screen copy, and the theme.

French becomes the first pack. After this refactor, a new language is a new pack, not a new app.

### 2. Vocabulary drilling and grammar drilling

New engine features that any pack can switch on. These introduce **state**, which the app does not currently have:

- Track which words and grammar structures the learner has met, and how well they know each.
- Schedule what to resurface and when. **Spaced repetition** (e.g. an SM-2-style algorithm) is the standard approach.
- Choose a persistence layer: `localStorage` is the quickest start; a small backend store / database is needed for cross-device progress. (The conversation loop is stateless today and the front end uses no browser storage — adding persistence is a deliberate new capability.)

Keep drilling **conversational and spoken** where possible (spoken prompts, spoken answers) to stay true to the voice-first principle, rather than turning into silent flashcards.

### 3. Spinoff — an English course pack for a young child (DO NOT BUILD YET)

A planned second pack, **not to be built until explicitly requested**. The engine/pack split in step 1 should be designed with it in mind:

- **Target language:** English.
- **Learner:** a 7-year-old Dutch child.
- **Helper language:** Dutch (the child falls back to Dutch, not English).
- **Tutor persona:** playful, gentle, very simple, kid-appropriate; shorter turns; lots of praise; light gamification.
- **Theme:** brighter and more playful than the French pack.
- **Content safety:** all scenarios and language must be appropriate for a young child.

Same engine, new pack.

---

## Known considerations

- **iOS audio playback.** Playback currently uses the Web Audio API (`decodeAudioData` + a buffer source). On iPhones, Web Audio can be silenced by the hardware ringer/mute switch and the audio context can go dormant between turns. If playback problems surface, the robust fix is to play replies through a reusable HTML `<audio>` element (an object URL built from the mp3 blob), unlocked inside the Start tap — HTML media plays through the silent switch.
- **Cost.** Voice is metered per minute on the OpenAI key. Fine for personal use (cents per session); worth watching if usage grows.
- **Request size.** Audio is sent as base64 JSON; recording auto-stops at 40s to keep clips within serverless body limits.
