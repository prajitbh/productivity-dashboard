import { db } from "@/db";
import { tasks, goals } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import TaskForm from "@/components/TaskForm";
import TaskRow from "@/components/TaskRow";
import TaskListDnd from "@/components/TaskListDnd";
import SubtaskList from "@/components/SubtaskList";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [allTasks, allGoals] = await Promise.all([
    db.select().from(tasks).orderBy(asc(tasks.sortOrder), desc(tasks.createdAt)),
    db.select().from(goals),
  ]);

  const goalTitleById = new Map(allGoals.map((g) => [g.id, g.title]));

  // Subtasks render nested under their parent rather than as standalone rows.
  const subtasksByParent = new Map<number, typeof allTasks>();
  for (const t of allTasks) {
    if (t.parentTaskId) {
      const arr = subtasksByParent.get(t.parentTaskId) ?? [];
      arr.push(t);
      subtasksByParent.set(t.parentTaskId, arr);
    }
  }

  const topLevel = allTasks.filter((t) => !t.parentTaskId);
  const open = topLevel.filter((t) => t.status !== "done");
  const done = topLevel.filter((t) => t.status === "done");

  return (
    <div>
      <PageHeader
        entry="02"
        title="Tasks"
        subtitle="Every line is a commitment. Drag to reorder, stamp it when it's settled."
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
            <TaskListDnd tasks={open} goalTitleById={goalTitleById} subtasksByParent={subtasksByParent} />
          )}
        </section>

        {done.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
              Settled · {done.length}
            </h2>
            <div>
              {done.map((t) => (
                <div key={t.id}>
                  <TaskRow task={t} goalTitle={t.goalId ? goalTitleById.get(t.goalId) : null} />
                  <SubtaskList parentTask={t} subtasks={subtasksByParent.get(t.id) ?? []} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
