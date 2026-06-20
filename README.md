# Mind Palace

Next.js 14 (App Router) + Drizzle ORM + Neon Postgres. No login — single-user, deployed
just for you.

## What's in here

- **Home** — weekly overview: stats, this week's tasks, Outlook calendar (optional),
  habits, active goals, charts
- **Tasks** — recurring tasks (daily/weekdays/weekly/monthly), drag-to-reorder, due dates
  via a custom calendar picker, confetti + sound on completion
- **Goals** — progress computed from linked tasks
- **Career** — professional network tracker: LinkedIn link, description, fixed
  industry/position/location tags, filter + sort by recency of contact
- **University** — Classes and Clubs as sub-tabs
- **Working Out** — a simple workout log
- **Habits** — Reading / TV / Journaling sub-tabs. The TV sub-tab tracks Movies and
  Shows (as two sections on one page) with auto-fetched poster art, status, your own
  rating, genres, and notes
- **Notes** — rich text (bold/italic/lists/headings), free corner-resize, pin to top
- **Every tab** has its own sticky note you can write in, and a global search (press `/`)
- **Cmd/Ctrl+K** quick-add for tasks from anywhere
- **Dark mode** toggle with a smooth cross-fade (top of the sidebar)

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — your Neon connection string (same as before)
- `TMDB_API_KEY` — optional, see step 2 below; without it, TV entries save with no poster
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` / `AZURE_AD_*` — optional, see step 3 below; without
  them, the Home page just shows a "Connect Outlook" button that won't do anything yet

Push the (updated) schema to your database:

```bash
npm run db:push
```

This adds all the new tables (contacts, classes, clubs, workouts, media_entries) and new
columns on tasks/habits/notes. It's safe to run again even if you already ran it before —
drizzle-kit only applies what's changed.

```bash
npm run dev
```

## 2. Get a free TMDB API key (for movie/show poster art)

1. Create an account at **https://www.themoviedb.org**
2. Go to **Settings → API** (or https://www.themoviedb.org/settings/api directly)
3. Click **Create** under "Request an API Key", choose "Developer," fill in the short
   form (you can put anything reasonable for "application" — it's just for their records)
4. Copy the **API Key (v3 auth)** value
5. Paste it into `.env.local` and your Vercel env vars as `TMDB_API_KEY`

## 3. Set up live Outlook calendar sync

This is the most involved piece — it needs a free app registration in Microsoft's portal
so Mind Palace is allowed to ask for your calendar. About 10 minutes, one time.

1. Go to **https://portal.azure.com**, sign in with any Microsoft account (a personal
   outlook.com account works fine, you don't need a work/school account)
2. Search for **"App registrations"** in the top search bar → **New registration**
3. Name it anything ("Mind Palace"), under **Supported account types** choose
   **"Accounts in any organizational directory and personal Microsoft accounts"**
4. Under **Redirect URI**, choose platform **Web** and enter:
   - For local dev: `http://localhost:3000/api/auth/callback/azure-ad`
   - You'll add your real Vercel URL here too once deployed (you can have multiple
     redirect URIs — add both)
5. Click **Register**. On the overview page, copy the **Application (client) ID** —
   that's your `AZURE_AD_CLIENT_ID`
6. In the sidebar, go to **Certificates & secrets → New client secret**, give it any
   description, click **Add**, then immediately copy the **Value** column (not the
   Secret ID) — that's your `AZURE_AD_CLIENT_SECRET`. It's only shown once.
7. Leave `AZURE_AD_TENANT_ID` as `common` (lets both personal and work accounts sign in)
8. Generate a `NEXTAUTH_SECRET` by running this in your terminal and pasting the output:
   ```bash
   openssl rand -base64 32
   ```
   (No `openssl`? Any random 32+ character string works fine too.)
9. Set `NEXTAUTH_URL` to `http://localhost:3000` locally, and to your real deployed URL
   in Vercel's environment variables once you've deployed

Once those five vars are set, the "Connect Outlook" button on the Home page will actually
sign you in and pull this week's events.

## 4. Deploy to Vercel

Same as before — push to GitHub, import at vercel.com/new, and add **all** the env vars
from `.env.example` in Project Settings → Environment Variables (not just `DATABASE_URL`
now). Set `NEXTAUTH_URL` to your real `https://your-app.vercel.app` URL, and add that same
URL's `/api/auth/callback/azure-ad` as a second redirect URI in your Azure app registration
(step 3.4 above).

## 5. Project structure

```
src/
  app/
    page.tsx                 Home — weekly overview
    tasks/ goals/             core tracking
    career/                   network tracker
    university/classes/ clubs/
    workouts/
    habits/reading/ tv/ journaling/
    notes/
    api/search/route.ts       global search endpoint
    api/auth/[...nextauth]/    Outlook OAuth
    actions/                  Server Actions — all writes go through these
  components/                 client components (forms, rows, cards, charts)
  db/schema.ts                Drizzle table definitions
  lib/
    habit-utils.ts             streaks + date grids
    recurrence.ts               next-due-date logic for recurring tasks
    contact-options.ts          fixed industry/position categories
    outlook.ts                  Microsoft Graph calendar fetch
    sound.ts                    synthesized completion sound
drizzle/0001_mind_palace.sql   migration matching the current schema
```

## 6. Notes on a few implementation choices

- **LinkedIn entries store the URL, not scraped profile data** — LinkedIn blocks
  scraping and it's against their terms, so the Career tracker is just a link plus
  whatever you type yourself.
- **The task-completion sound is synthesized in-browser** (Web Audio), not a licensed
  sound file, so there's nothing to swap out or attribute.
- **Notes resize via the browser's native corner-drag** (`resize: both` in CSS) rather
  than a custom-built handle — simpler and works exactly like resizing a textarea.
- **Recurring tasks** spawn their next occurrence the moment you mark one done, dated by
  `lib/recurrence.ts`. Completed recurring tasks stay in your "Settled" list as history.
