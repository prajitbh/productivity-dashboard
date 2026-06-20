import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { tasks, goals, habits, habitLogs, notes } from "@/db/schema";
import { eq, ne, desc } from "drizzle-orm";
import TaskRow from "@/components/TaskRow";
import TodayHabitItem from "@/components/TodayHabitItem";
import StatsRow from "@/components/StatsRow";
import WeekCalendar from "@/components/WeekCalendar";
import TabNote from "@/components/TabNote";
import { getTabNote } from "@/app/actions/notes";
import { getWeekEvents, CalendarEvent } from "@/lib/outlook";
import { currentStreak, toDateStr } from "@/lib/habit-utils";
import { TasksPerWeekChart, HabitConsistencyChart } from "@/components/Charts";

export const dynamic = "force-dynamic";

function weekRange() {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday: toDateStr(monday), sunday: toDateStr(sunday) };
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken as string | undefined;

  const today = toDateStr(new Date());
  const { monday, sunday } = weekRange();

  const [openTasks, allTasksEver, allGoals, activeHabits, allHabitLogs, pinnedNotes, tabNote, weekEvents] =
    await Promise.all([
      db.select().from(tasks).where(ne(tasks.status, "done")),
      db.select().from(tasks),
      db.select().from(goals),
      db.select().from(habits).where(eq(habits.archived, false)),
      db.select().from(habitLogs),
      db.select().from(notes).where(eq(notes.pinned, true)).orderBy(desc(notes.updatedAt)),
      getTabNote("home"),
      accessToken ? getWeekEvents(accessToken) : Promise.resolve([] as CalendarEvent[]),
    ]);

  const activeGoals = allGoals.filter((g) => g.status === "active");

  const thisWeekTasks = openTasks
    .filter((t) => !t.parentTaskId)
    .filter((t) => !t.dueDate || (t.dueDate >= monday && t.dueDate <= sunday) || t.dueDate < monday)
    .sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    })
    .slice(0, 8);

  const goalTitleById = new Map(allGoals.map((g) => [g.id, g.title]));

  const logsByHabit = new Map<number, string[]>();
  for (const log of allHabitLogs) {
    const arr = logsByHabit.get(log.habitId) ?? [];
    arr.push(log.date);
    logsByHabit.set(log.habitId, arr);
  }

  // ---- Stats row ----
  const tasksDoneThisWeek = allTasksEver.filter(
    (t) => t.completedAt && toDateStr(new Date(t.completedAt)) >= monday && toDateStr(new Date(t.completedAt)) <= sunday
  ).length;
  const bestStreakAcrossHabits = Math.max(
    0,
    ...activeHabits.map((h) => currentStreak(logsByHabit.get(h.id) ?? []))
  );

  // ---- Charts ----
  const tasksPerWeekData: { week: string; done: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - i * 7 - start.getDay() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const count = allTasksEver.filter((t) => {
      if (!t.completedAt) return false;
      const d = new Date(t.completedAt);
      return d >= start && d <= end;
    }).length;
    tasksPerWeekData.push({ week: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }), done: count });
  }

  const habitConsistencyData = activeHabits.slice(0, 6).map((h) => {
    const logs = logsByHabit.get(h.id) ?? [];
    const last30 = logs.filter((d) => {
      const diff = (Date.now() - new Date(d).getTime()) / 86400000;
      return diff <= 30;
    }).length;
    return { name: h.name, pct: Math.round((last30 / 30) * 100) };
  });

  const dateHeadline = `Week of ${new Date(monday + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;

  return (
    <div>
      <header className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-paper-line">
        <p className="font-mono text-[11px] text-ink-faint uppercase tracking-widest mb-1">
          Entry 01 · Home
        </p>
        <h1 className="font-display italic text-3xl sm:text-4xl text-ink">{dateHeadline}</h1>
      </header>

      <StatsRow
        tasksDoneThisWeek={tasksDoneThisWeek}
        bestStreakAcrossHabits={bestStreakAcrossHabits}
        goalsOnTrack={activeGoals.length}
        goalsTotal={allGoals.length}
      />

      <TabNote tabKey="home" initialHtml={tabNote?.contentHtml ?? ""} />

      <div className="px-6 sm:px-10 py-8 grid sm:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl">
        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              This week's tasks
            </h2>
            <Link href="/tasks" className="text-[11px] font-mono text-ink-soft hover:text-amber">
              all tasks →
            </Link>
          </div>
          {thisWeekTasks.length === 0 ? (
            <p className="text-sm text-ink-faint py-4">Nothing on the books this week.</p>
          ) : (
            <div>
              {thisWeekTasks.map((t) => (
                <TaskRow key={t.id} task={t} goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null} />
              ))}
            </div>
          )}
        </section>

        <section>
          <WeekCalendar connected={!!accessToken} events={weekEvents} />
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
            {activeGoals.length === 0 ? (
              <p className="text-sm text-ink-faint py-4">No active goals yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {activeGoals.map((g) => (
                  <li key={g.id} className="text-sm text-ink flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
                    {g.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="sm:col-span-2 grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
              Tasks completed · last 6 weeks
            </h2>
            <TasksPerWeekChart data={tasksPerWeekData} />
          </div>
          {habitConsistencyData.length > 0 && (
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
                Habit consistency · last 30 days
              </h2>
              <HabitConsistencyChart data={habitConsistencyData} />
            </div>
          )}
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
