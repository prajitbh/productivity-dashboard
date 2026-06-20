import { db } from "@/db";
import { habits, habitLogs } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import SubTabs from "@/components/SubTabs";
import TabNote from "@/components/TabNote";
import { getTabNote } from "@/app/actions/notes";
import HabitForm from "@/components/HabitForm";
import HabitRow from "@/components/HabitRow";

export const dynamic = "force-dynamic";

const SUBTABS = [
  { href: "/habits/reading", label: "Reading" },
  { href: "/habits/tv", label: "TV" },
  { href: "/habits/journaling", label: "Journaling" },
];

export default async function JournalingPage() {
  const [journalHabits, tabNote] = await Promise.all([
    db
      .select()
      .from(habits)
      .where(and(eq(habits.category, "journaling"), eq(habits.archived, false)))
      .orderBy(desc(habits.createdAt)),
    getTabNote("habits-journaling"),
  ]);

  const logsByHabit = await Promise.all(
    journalHabits.map((h) => db.select().from(habitLogs).where(eq(habitLogs.habitId, h.id)))
  );

  return (
    <div>
      <PageHeader entry="07" title="Habits" subtitle="Journaling — keep the streak, not the pressure to write a lot." />
      <SubTabs tabs={SUBTABS} />
      <TabNote tabKey="habits-journaling" initialHtml={tabNote?.contentHtml ?? ""} />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-6">
        <HabitForm category="journaling" />
        {journalHabits.length === 0 ? (
          <p className="text-sm text-ink-faint">No journaling habits tracked yet.</p>
        ) : (
          <div>
            {journalHabits.map((h, i) => (
              <HabitRow key={h.id} habit={h} loggedDates={logsByHabit[i].map((l) => l.date)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
