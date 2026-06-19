import { db } from "@/db";
import { tasks, goals } from "@/db/schema";
import { desc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import TaskForm from "@/components/TaskForm";
import TaskRow from "@/components/TaskRow";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [allTasks, allGoals] = await Promise.all([
    db.select().from(tasks).orderBy(desc(tasks.createdAt)),
    db.select().from(goals),
  ]);

  const goalTitleById = new Map(allGoals.map((g) => [g.id, g.title]));

  const open = allTasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    });
  const done = allTasks.filter((t) => t.status === "done");

  return (
    <div>
      <PageHeader
        entry="02"
        title="Tasks"
        subtitle="Every line is a commitment. Stamp it when it's settled."
      />
      <div className="px-6 sm:px-10 py-8 max-w-2xl space-y-8">
        <TaskForm goals={allGoals} />

        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
            Open · {open.length}
          </h2>
          {open.length === 0 ? (
            <p className="text-sm text-ink-faint py-6">
              Nothing outstanding. Add a line above to start the day's ledger.
            </p>
          ) : (
            <div>
              {open.map((t) => (
                <TaskRow key={t.id} task={t} goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null} />
              ))}
            </div>
          )}
        </section>

        {done.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
              Settled · {done.length}
            </h2>
            <div>
              {done.map((t) => (
                <TaskRow key={t.id} task={t} goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
