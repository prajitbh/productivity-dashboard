import { db } from "@/db";
import { workouts } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import TabNote from "@/components/TabNote";
import { getTabNote } from "@/app/actions/notes";
import { WorkoutForm, WorkoutRow } from "@/components/WorkoutPieces";

export const dynamic = "force-dynamic";

export default async function WorkoutsPage() {
  const [allWorkouts, tabNote] = await Promise.all([
    db.select().from(workouts).orderBy(desc(workouts.date)),
    getTabNote("workouts"),
  ]);

  return (
    <div>
      <PageHeader entry="06" title="Working Out" subtitle="Every session logged, nothing fancy." />
      <TabNote tabKey="workouts" initialHtml={tabNote?.contentHtml ?? ""} />
      <div className="px-6 sm:px-10 py-8 max-w-xl space-y-4">
        <WorkoutForm />
        {allWorkouts.length === 0 ? (
          <p className="text-sm text-ink-faint">No workouts logged yet.</p>
        ) : (
          <div>
            {allWorkouts.map((w) => (
              <WorkoutRow key={w.id} item={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
