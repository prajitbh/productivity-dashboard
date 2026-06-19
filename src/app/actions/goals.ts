"use server";

import { db } from "@/db";
import { goals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const description = String(formData.get("description") || "").trim() || null;
  const targetDateRaw = String(formData.get("targetDate") || "").trim();

  await db.insert(goals).values({
    title,
    description,
    targetDate: targetDateRaw || null,
  });

  revalidatePath("/");
  revalidatePath("/goals");
}

export async function setGoalStatus(id: number, status: "active" | "completed" | "archived") {
  await db.update(goals).set({ status }).where(eq(goals.id, id));
  revalidatePath("/");
  revalidatePath("/goals");
}

export async function deleteGoal(id: number) {
  await db.delete(goals).where(eq(goals.id, id));
  revalidatePath("/");
  revalidatePath("/goals");
}
