import { db } from "@/db";
import { habits, habitLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import HabitForm from "@/components/HabitForm";
import HabitRow from "@/components/HabitRow";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const activeHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.archived, false))
    .orderBy(desc(habits.createdAt));

  const logsByHabit = await Promise.all(
    activeHabits.map((h) => db.select().from(habitLogs).where(eq(habitLogs.habitId, h.id)))
  );

  return (
    <div>
      <PageHeader
        entry="04"
        title="Habits"
        subtitle="Fourteen days at a glance. Tap a tick to mark, or backfill a day you missed logging."
      />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-8">
        <HabitForm />

        {activeHabits.length === 0 ? (
          <p className="text-sm text-ink-faint">No habits tracked yet. Add one above.</p>
        ) : (
          <div>
            {activeHabits.map((h, i) => (
              <HabitRow
                key={h.id}
                habit={h}
                loggedDates={logsByHabit[i].map((l) => l.date)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
