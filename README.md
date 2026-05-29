# Frenchy

A pocket French conversation partner. Speak French out loud, it talks back — and when you get lost mid-sentence, just switch to Dutch or English and it catches you, then slips back into French. Built for the moment you have to order at the boulangerie.

It's a single static page plus one small server function. **No build step, no dependencies.**

---

## What you need
- The OpenAI API key you already have.
- About 5 minutes.

---

## Put it live — Vercel (fastest)

**Option A — command line (3 commands):**
1. Install the CLI once: `npm i -g vercel`
2. From inside this unzipped folder, run `vercel` — log in and accept the defaults. It deploys a preview.
3. Add your key, then ship to production:
   - `vercel env add OPENAI_API_KEY` → paste your key → select all three environments
   - `vercel --prod`
4. Open the production URL on your phone → **Share → Add to Home Screen**. It now opens fullscreen, like an app.

**Option B — dashboard (no CLI):**
1. Push this folder to a GitHub repo.
2. On vercel.com: **Add New → Project**, import the repo.
3. Add an Environment Variable: `OPENAI_API_KEY` = your key.
4. Deploy, open the URL on your phone, Add to Home Screen.

---

## Put it live — your own VPS (optional)
It also runs as a tiny Node server with zero dependencies:
```
export OPENAI_API_KEY=sk-...
node server.js          # listens on PORT, default 3000
```
Then front it with Nginx and HTTPS. The microphone only works on a **secure origin** — a real https certificate is required. (`localhost` is fine for testing; a plain `http://` IP will not let the mic turn on.)

> Want a ready-made systemd unit + Nginx block? Just ask.

---

## How to use it
- Tap **Start**. Frenchy greets you and suggests a scene.
- Tap the mic, speak French, tap again to send. It replies in French and speaks the reply aloud.
- Stuck? Say it in Dutch or English — it hands you the words you need, then carries on in French.
- Tap **Replay** under any line to hear it again. Tap the mic any time to jump back in.

---

## Tuning (no code — just environment variables)
Set these on Vercel (`vercel env add NAME`, then `vercel --prod`) or in your VPS environment:

| Variable | Default | What it does |
|---|---|---|
| `TTS_VOICE` | `coral` | The speaking voice. Try `sage`, `shimmer`, `verse`, `nova`, `alloy`, `fable`. |
| `CHAT_MODEL` | `gpt-4o-mini` | The tutor's brain. Fast and cheap. Use `gpt-4o` for richer replies. |
| `STT_MODEL` | `gpt-4o-transcribe` | Speech-to-text (auto-detects French / Dutch / English). |
| `TTS_MODEL` | `gpt-4o-mini-tts` | Text-to-speech. |

---

## Cost
Billed per minute of voice on your own OpenAI key. A focused session is a few cents; a whole holiday's worth is a few dollars. No subscription.

## Privacy
Your audio goes to OpenAI to be transcribed and spoken. The app stores nothing itself — refresh and the conversation is gone.
