# Ledger — a personal productivity dashboard

Next.js 14 (App Router) + Drizzle ORM + Neon Postgres. Tasks, goals, habits, and notes,
no login — it's a single-user ledger meant for one Vercel deployment that only you use.

## Stack

- **Next.js 14** App Router, React Server Components, Server Actions for all writes
- **Neon Postgres** (serverless driver `@neondatabase/serverless`)
- **Drizzle ORM** for schema + queries, **drizzle-kit** for migrations
- **Tailwind CSS**, no UI library — custom "ledger" design system

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Create a free database at [neon.tech](https://neon.tech) → new project → copy the
**pooled** connection string from the dashboard's Connection Details panel → paste it
into `.env.local` as `DATABASE_URL`.

Push the schema to your database:

```bash
npm run db:push
```

(`db:push` reads `src/db/schema.ts` and syncs your Neon database directly — no
migration files needed for a project this size. If you'd rather use versioned
migrations, run `npm run db:generate` then apply `drizzle/0000_init.sql` yourself;
it's already included and matches the schema.)

Run the app:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 2. Deploy to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel
```

Or push this folder to a GitHub repo and import it at [vercel.com/new](https://vercel.com/new).

Either way, before the first deploy (or right after) add the environment variable in
your Vercel project settings → **Environment Variables**:

| Key | Value |
|---|---|
| `DATABASE_URL` | the same Neon pooled connection string from step 1 |

Add it for all three environments (Production, Preview, Development) so preview
deployments work too. Redeploy after adding it if you set it after the first deploy.

Vercel auto-detects Next.js — no build settings to change.

## 3. Project structure

```
src/
  app/
    page.tsx              Today — the dashboard home
    tasks/page.tsx
    goals/page.tsx
    habits/page.tsx
    notes/page.tsx
    actions/               Server Actions (all writes go through these)
      tasks.ts goals.ts habits.ts notes.ts
  components/              Client components (forms, rows, cards)
  db/
    schema.ts               Drizzle table definitions
    index.ts                 Neon connection
  lib/
    habit-utils.ts           streak + date-grid helpers
drizzle/0000_init.sql       hand-written initial migration (matches schema.ts)
drizzle.config.ts
```

## 4. Data model

- **goals** — title, description, status (active/completed/archived), target date
- **tasks** — title, description, status (todo/in_progress/done), priority, due date,
  optional `goal_id` link
- **habits** — name, color, weekly target; **habit_logs** — one row per day completed
  (unique on habit + date, so toggling is just insert/delete)
- **notes** — title, content, pinned flag

A goal's progress on the Goals page is computed from the tasks linked to it
(`doneCount / totalCount`) — there's no separate progress field to keep in sync.

## 5. Extending it

- Swap the Neon serverless driver for `node-postgres` if you want a long-lived
  connection pool instead of HTTP-per-query (matters more once traffic is real).
- Add auth later (e.g. NextAuth + a `users` table, then scope every query by
  `userId`) if this stops being single-user.
- The habit tally-mark row (`HabitRow.tsx`) and stamp checkbox (`globals.css`,
  `.stamp`) are the two custom visual pieces — everything else uses plain Tailwind.
