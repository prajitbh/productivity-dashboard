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

export default async function ReadingPage() {
  const [readingHabits, tabNote] = await Promise.all([
    db
      .select()
      .from(habits)
      .where(and(eq(habits.category, "reading"), eq(habits.archived, false)))
      .orderBy(desc(habits.createdAt)),
    getTabNote("habits-reading"),
  ]);

  const logsByHabit = await Promise.all(
    readingHabits.map((h) => db.select().from(habitLogs).where(eq(habitLogs.habitId, h.id)))
  );

  return (
    <div>
      <PageHeader entry="07" title="Habits" subtitle="Reading — pages, chapters, books, whatever you're tracking." />
      <SubTabs tabs={SUBTABS} />
      <TabNote tabKey="habits-reading" initialHtml={tabNote?.contentHtml ?? ""} />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-6">
        <HabitForm category="reading" />
        {readingHabits.length === 0 ? (
          <p className="text-sm text-ink-faint">No reading habits tracked yet.</p>
        ) : (
          <div>
            {readingHabits.map((h, i) => (
              <HabitRow key={h.id} habit={h} loggedDates={logsByHabit[i].map((l) => l.date)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
