"use server";

import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createWorkout(formData: FormData) {
  const type = String(formData.get("type") || "").trim();
  if (!type) return;

  await db.insert(workouts).values({
    date: String(formData.get("date") || "").trim() || new Date().toISOString().slice(0, 10),
    type,
    durationMinutes: formData.get("durationMinutes")
      ? Number(formData.get("durationMinutes"))
      : null,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  revalidatePath("/workouts");
  revalidatePath("/");
}

export async function deleteWorkout(id: number) {
  await db.delete(workouts).where(eq(workouts.id, id));
  revalidatePath("/workouts");
}
