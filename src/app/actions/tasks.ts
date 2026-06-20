"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nextDueDate, Recurrence } from "@/lib/recurrence";

function refresh() {
  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/review");
}

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const description = String(formData.get("description") || "").trim() || null;
  const priority = String(formData.get("priority") || "medium");
  const dueDateRaw = String(formData.get("dueDate") || "").trim();
  const goalIdRaw = String(formData.get("goalId") || "").trim();
  const recurrenceRaw = String(formData.get("recurrence") || "").trim();
  const parentTaskIdRaw = String(formData.get("parentTaskId") || "").trim();

  await db.insert(tasks).values({
    title,
    description,
    priority,
    dueDate: dueDateRaw || null,
    goalId: goalIdRaw ? Number(goalIdRaw) : null,
    recurrence: recurrenceRaw || null,
    parentTaskId: parentTaskIdRaw ? Number(parentTaskIdRaw) : null,
  });

  refresh();
}

export async function createSubtask(parentTaskId: number, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const [parent] = await db.select().from(tasks).where(eq(tasks.id, parentTaskId));
  if (!parent) return;

  await db.insert(tasks).values({
    title: trimmed,
    priority: "medium",
    parentTaskId,
    goalId: parent.goalId,
  });

  refresh();
}

export async function setTaskStatus(id: number, status: "todo" | "in_progress" | "done") {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
  if (!task) return;

  await db
    .update(tasks)
    .set({
      status,
      completedAt: status === "done" ? new Date() : null,
    })
    .where(eq(tasks.id, id));

  // If this was a recurring task being completed, spin up the next occurrence.
  if (status === "done" && task.recurrence) {
    const baseDate = task.dueDate ?? new Date().toISOString().slice(0, 10);
    await db.insert(tasks).values({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: nextDueDate(task.recurrence as Recurrence, baseDate),
      goalId: task.goalId,
      recurrence: task.recurrence,
    });
  }

  refresh();
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  refresh();
}

export async function updateTask(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const description = String(formData.get("description") || "").trim() || null;
  const priority = String(formData.get("priority") || "medium");
  const dueDateRaw = String(formData.get("dueDate") || "").trim();
  const goalIdRaw = String(formData.get("goalId") || "").trim();
  const recurrenceRaw = String(formData.get("recurrence") || "").trim();

  await db
    .update(tasks)
    .set({
      title,
      description,
      priority,
      dueDate: dueDateRaw || null,
      goalId: goalIdRaw ? Number(goalIdRaw) : null,
      recurrence: recurrenceRaw || null,
    })
    .where(eq(tasks.id, id));

  refresh();
}

/** Persist a new manual order for a set of task ids (lower sortOrder = earlier). */
export async function reorderTasks(orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(tasks).set({ sortOrder: index }).where(eq(tasks.id, id))
    )
  );
  refresh();
}

export async function getTasksForGoal(goalId: number) {
  return db.select().from(tasks).where(eq(tasks.goalId, goalId));
}

export async function getUnlinkedOpenTasksCount() {
  const rows = await db
    .select()
    .from(tasks)
    .where(and(isNull(tasks.goalId), eq(tasks.status, "todo")));
  return rows.length;
}
