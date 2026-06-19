import Link from "next/link";
import { db } from "@/db";
import { tasks, goals, habits, habitLogs, notes } from "@/db/schema";
import { eq, ne, desc } from "drizzle-orm";
import TaskRow from "@/components/TaskRow";
import TodayHabitItem from "@/components/TodayHabitItem";
import { currentStreak, toDateStr } from "@/lib/habit-utils";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const today = toDateStr(new Date());

  const [openTasks, allGoals, activeHabits, allHabitLogs, pinnedNotes] = await Promise.all([
    db.select().from(tasks).where(ne(tasks.status, "done")),
    db.select().from(goals).where(eq(goals.status, "active")),
    db.select().from(habits).where(eq(habits.archived, false)),
    db.select().from(habitLogs),
    db.select().from(notes).where(eq(notes.pinned, true)).orderBy(desc(notes.updatedAt)),
  ]);

  const dueTodayOrOverdue = openTasks
    .filter((t) => t.dueDate && t.dueDate <= today)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));

  const upNext = openTasks
    .filter((t) => !t.dueDate || t.dueDate > today)
    .sort((a, b) => {
      const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 5);

  const goalTitleById = new Map(allGoals.map((g) => [g.id, g.title]));

  const logsByHabit = new Map<number, string[]>();
  for (const log of allHabitLogs) {
    const arr = logsByHabit.get(log.habitId) ?? [];
    arr.push(log.date);
    logsByHabit.set(log.habitId, arr);
  }

  const dateHeadline = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <header className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-paper-line">
        <p className="font-mono text-[11px] text-ink-faint uppercase tracking-widest mb-1">
          Entry 01 · Today
        </p>
        <h1 className="font-display italic text-3xl sm:text-4xl text-ink">{dateHeadline}</h1>
      </header>

      <div className="px-6 sm:px-10 py-8 grid sm:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl">
        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Due now · {dueTodayOrOverdue.length}
            </h2>
            <Link href="/tasks" className="text-[11px] font-mono text-ink-soft hover:text-amber">
              all tasks →
            </Link>
          </div>
          {dueTodayOrOverdue.length === 0 ? (
            <p className="text-sm text-ink-faint py-4">Nothing due. The ledger is clear.</p>
          ) : (
            <div>
              {dueTodayOrOverdue.map((t) => (
                <TaskRow key={t.id} task={t} goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null} />
              ))}
            </div>
          )}

          {upNext.length > 0 && (
            <div className="mt-6">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
                Up next
              </h2>
              {upNext.map((t) => (
                <TaskRow key={t.id} task={t} goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Habits today
            </h2>
            <Link href="/habits" className="text-[11px] font-mono text-ink-soft hover:text-amber">
              all habits →
            </Link>
          </div>
          {activeHabits.length === 0 ? (
            <p className="text-sm text-ink-faint py-4">No habits tracked yet.</p>
          ) : (
            <div>
              {activeHabits.map((h) => {
                const logs = logsByHabit.get(h.id) ?? [];
                return (
                  <TodayHabitItem
                    key={h.id}
                    habit={h}
                    doneToday={logs.includes(today)}
                    streak={currentStreak(logs)}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                Active goals
              </h2>
              <Link href="/goals" className="text-[11px] font-mono text-ink-soft hover:text-amber">
                all goals →
              </Link>
            </div>
            {allGoals.length === 0 ? (
              <p className="text-sm text-ink-faint py-4">No active goals yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {allGoals.map((g) => (
                  <li key={g.id} className="text-sm text-ink flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
                    {g.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {pinnedNotes.length > 0 && (
          <section className="sm:col-span-2">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
              Pinned notes
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {pinnedNotes.map((n) => (
                <Link
                  key={n.id}
                  href="/notes"
                  className="block border border-paper-line rounded-md bg-paper-raised p-4 hover:border-amber transition-colors"
                >
                  <h3 className="font-display text-base text-ink">{n.title}</h3>
                  <p className="text-sm text-ink-soft mt-1 line-clamp-2">{n.content}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
