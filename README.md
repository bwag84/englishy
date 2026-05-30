# Englishy

A pocket English tutor for a young Dutch child. She speaks English out loud, Englishy talks back in a warm British voice — and when she gets stuck, she can switch to Dutch and Englishy gently hands her the English words, then carries on. Built for a 7-year-old: **speaking and listening first**, with friendly games about ballet, dancing, gymnastics, unicorns, animals, school and easy maths.

The whole interface is in **Dutch** so a young child knows what to do; the language she *learns* is **British English**.

It's a single static page plus a couple of small server functions. **No build step, no dependencies.**

---

## What you need
- An OpenAI API key.
- About 5 minutes.

---

## Put it live — Vercel (fastest)

**Option A — command line:**
1. Install the CLI once: `npm i -g vercel`
2. From inside this folder, run `vercel` — log in and accept the defaults. It deploys a preview.
3. Add your key, then ship to production:
   - `vercel env add OPENAI_API_KEY` → paste your key → select all environments
   - `vercel --prod`
4. Open the production URL on the phone → **Share → Add to Home Screen**. It opens fullscreen, like an app, with a Union Jack icon.

**Option B — dashboard (no CLI):**
1. Push this folder to a GitHub repo.
2. On vercel.com: **Add New → Project**, import the repo.
3. Add an Environment Variable: `OPENAI_API_KEY` = your key.
4. Deploy, open the URL on the phone, Add to Home Screen.

> This repo ships a single course pack (`english-child`) and uses it by default — no `PACK` env var needed.

---

## Put it live — your own VPS (optional)
It also runs as a tiny Node server with zero dependencies:
```
export OPENAI_API_KEY=sk-...
node server.js          # listens on PORT, default 3000
```
Then front it with Nginx and HTTPS. The microphone only works on a **secure origin** — a real https certificate is required. (`localhost` is fine for testing; a plain `http://` IP will not let the mic turn on.)

---

## How she uses it
- Tap **Beginnen**. Englishy says hello in simple English and asks a friendly question.
- Tap the mic, say something in English, tap again to send. Englishy replies in English and speaks it aloud in a British voice.
- Stuck? She can answer in Dutch — Englishy gives her the English words and invites her to try.
- Tap **Nog eens** under any line to hear it again.
- The bottom tabs switch between **Praten** (chat), **Woorden** (spoken word drills), **Zinnen** (spoken sentence drills) and **Kiezen** (a quiet tap-to-choose game). The drills use spaced repetition and remember progress on the device.

---

## Safety
The tutor is prompted to stay strictly inside a young child's world (ballet, dancing, animals, unicorns, school, maths, food, play) and to gently change the subject away from anything scary, sad, grown-up or otherwise unsuitable. Keep this in mind if you tune the prompt.

---

## Tuning (no code — just environment variables)
Set these on Vercel (`vercel env add NAME`, then `vercel --prod`) or in your VPS environment:

| Variable | Default | What it does |
|---|---|---|
| `TTS_VOICE` | `fable` (from the pack) | The speaking voice. `fable` leans British; the British accent is mainly driven by the pack's voice instructions. |
| `CHAT_MODEL` | `gpt-4o-mini` | The tutor's brain. Fast and cheap. Use `gpt-4o` for richer replies. |
| `STT_MODEL` | `gpt-4o-transcribe` | Speech-to-text (auto-detects Dutch / English). |
| `TTS_MODEL` | `gpt-4o-mini-tts` | Text-to-speech (honours the voice instructions, including the British accent). |
| `PACK` | `english-child` | Which course pack to load. Only `english-child` ships in this repo. |

---

## Cost
Billed per minute of voice on your own OpenAI key. A short session is a few cents. No subscription.

## Privacy
Audio goes to OpenAI to be transcribed and spoken. The conversation itself is not stored; drill progress is kept only in the browser on the device (`localStorage`).
