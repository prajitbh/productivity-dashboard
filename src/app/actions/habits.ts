"use server";

import { db } from "@/db";
import { habits, habitLogs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function createHabit(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  const color = String(formData.get("color") || "sage");
  const targetPerWeek = Number(formData.get("targetPerWeek") || 7);
  const category = String(formData.get("category") || "general");

  await db.insert(habits).values({ name, color, targetPerWeek, category });

  revalidatePath("/");
  revalidatePath("/habits", "layout");
}

export async function archiveHabit(id: number) {
  await db.update(habits).set({ archived: true }).where(eq(habits.id, id));
  revalidatePath("/");
  revalidatePath("/habits", "layout");
}

export async function toggleHabitToday(habitId: number) {
  return toggleHabitForDate(habitId, todayStr());
}

export async function toggleHabitForDate(habitId: number, date: string) {
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)));

  if (existing.length > 0) {
    await db
      .delete(habitLogs)
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)));
  } else {
    await db.insert(habitLogs).values({ habitId, date });
  }

  revalidatePath("/");
  revalidatePath("/habits", "layout");
}
