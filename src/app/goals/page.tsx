import { db } from "@/db";
import { goals, tasks } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import GoalForm from "@/components/GoalForm";
import GoalCard from "@/components/GoalCard";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const [allGoals, allTasks] = await Promise.all([
    db.select().from(goals).orderBy(desc(goals.createdAt)),
    db.select().from(tasks),
  ]);

  const active = allGoals.filter((g) => g.status === "active");
  const other = allGoals.filter((g) => g.status !== "active");

  function counts(goalId: number) {
    const linked = allTasks.filter((t) => t.goalId === goalId);
    return {
      total: linked.length,
      done: linked.filter((t) => t.status === "done").length,
    };
  }

  return (
    <div>
      <PageHeader
        entry="03"
        title="Goals"
        subtitle="The ledger's bottom line. Link tasks to a goal to track real progress."
      />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-8">
        <GoalForm />

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-3">
            Active · {active.length}
          </h2>
          {active.length === 0 ? (
            <p className="text-sm text-ink-faint">No active goals yet.</p>
          ) : (
            <div className="space-y-3">
              {active.map((g) => {
                const c = counts(g.id);
                return (
                  <GoalCard key={g.id} goal={g} doneCount={c.done} totalCount={c.total} />
                );
              })}
            </div>
          )}
        </section>

        {other.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-3">
              Completed &amp; archived · {other.length}
            </h2>
            <div className="space-y-3">
              {other.map((g) => {
                const c = counts(g.id);
                return (
                  <GoalCard key={g.id} goal={g} doneCount={c.done} totalCount={c.total} />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
