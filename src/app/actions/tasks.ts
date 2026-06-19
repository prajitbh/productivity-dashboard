"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const description = String(formData.get("description") || "").trim() || null;
  const priority = String(formData.get("priority") || "medium");
  const dueDateRaw = String(formData.get("dueDate") || "").trim();
  const goalIdRaw = String(formData.get("goalId") || "").trim();

  await db.insert(tasks).values({
    title,
    description,
    priority,
    dueDate: dueDateRaw || null,
    goalId: goalIdRaw ? Number(goalIdRaw) : null,
  });

  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function setTaskStatus(id: number, status: "todo" | "in_progress" | "done") {
  await db
    .update(tasks)
    .set({
      status,
      completedAt: status === "done" ? new Date() : null,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function updateTask(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const description = String(formData.get("description") || "").trim() || null;
  const priority = String(formData.get("priority") || "medium");
  const dueDateRaw = String(formData.get("dueDate") || "").trim();
  const goalIdRaw = String(formData.get("goalId") || "").trim();

  await db
    .update(tasks)
    .set({
      title,
      description,
      priority,
      dueDate: dueDateRaw || null,
      goalId: goalIdRaw ? Number(goalIdRaw) : null,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/");
  revalidatePath("/tasks");
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
