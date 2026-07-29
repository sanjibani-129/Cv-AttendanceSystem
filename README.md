# Nexus — Attendance AI

Smart attendance system for the Build Club Computer Vision Challenge: recognizes
members from a laptop webcam, tracks makerspace hours, and shows it all on a
live dashboard. Built as one Next.js app so it ships straight to **Vercel** —
no Streamlit, no separate Python server to host.

## How it works

- **Face recognition runs in the browser.** `face-api.js` (TensorFlow.js)
  detects a face, computes a 128-value descriptor, and compares it against
  every registered member using euclidean distance. No frames ever leave the
  laptop — only the match result (member id + confidence) is sent to the API.
- **Next.js API routes are the backend.** `src/app/api/**` handles member
  registration, the check-in/check-out toggle, attendance history, and
  dashboard stats. These are serverless functions — they deploy automatically
  with the frontend on Vercel.
- **Supabase (Postgres) is the database.** Stores members (with their face
  descriptor as JSON), attendance sessions, and a `member_stats` SQL view
  that computes live hours + inside/away status.

```
Browser (webcam + face-api.js)
   │  detect + match locally
   ▼
Next.js API routes  ──────────►  Supabase (Postgres)
   (/api/members, /api/attendance, /api/stats)
```

## Project layout

```
src/
  app/
    page.tsx              Dashboard
    camera/page.tsx        Live Camera Console (detect, match, check-in)
    members/page.tsx       Registry + Register modal
    attendance/page.tsx     Full session log
    analytics/page.tsx      Charts (recharts)
    reports/page.tsx        CSV export
    settings/page.tsx       Engine + threshold info
    api/
      members/route.ts               GET list / POST register
      members/[id]/route.ts          DELETE member
      members/descriptors/route.ts   GET raw descriptors (for client-side matching)
      attendance/route.ts            GET log / POST check-in-or-out toggle
      stats/route.ts                 GET dashboard KPIs
  components/               Sidebar, Topbar, KpiCard, StatusBadge, RegisterMemberModal
  lib/
    faceEngine.ts            face-api.js loading + matching helpers
    supabaseClient.ts        browser client (anon key)
    supabaseServer.ts        server client (service role key) — used only in api/
    types.ts, utils.ts
supabase/schema.sql          Run once in the Supabase SQL editor
public/models/               Put face-api.js model weights here (see README inside)
```

## Setup

1. **Create a Supabase project** (free tier is fine) at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` once.
3. Copy `.env.local.example` to `.env.local` and fill in your project URL,
   anon key, and service role key from Project Settings → API.
4. Download the face-api.js model weights into `public/models/` — see
   `public/models/README.md` for the exact files and a one-line command.
5. Install and run:
   ```bash
   npm install
   npm run dev
   ```
6. Open http://localhost:3000, go to **Members → Register**, capture 5 face
   samples for a teammate, then open **Live Camera** to test recognition.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel → it auto-detects Next.js, no config needed.
3. Add the three env vars from `.env.local` in the Vercel project's
   Environment Variables settings.
4. Make sure `public/models/*` files are committed (Vercel serves them as
   static assets automatically).
5. Deploy. The webcam requires HTTPS to work in the browser — Vercel gives
   you that by default, so it'll work out of the box (unlike `localhost`
   testing over plain HTTP on some browsers/devices).

## Notes on the matching threshold

`NEXT_PUBLIC_FACE_MATCH_THRESHOLD` (default `0.5`) is the max euclidean
distance between a live descriptor and a stored one to count as a match.
Lower = stricter (fewer false positives, but may need better lighting/angle
to recognize legitimate members). Tune it during testing in Settings.

## What's left for your team to add

This gives you a complete, working vertical slice matching the rulebook's
requirements (face recognition attendance, hours tracking, live dashboard
with analytics). Nice-to-haves if you have time before the 30 July deadline:
- Auth (so only club admins can register members / see the dashboard)
- Multi-camera support (currently reads the default webcam)
- Export to the analytics dashboard's heatmap-by-hour-of-day view
