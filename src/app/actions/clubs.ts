"use server";

import { db } from "@/db";
import { clubs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createClub(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await db.insert(clubs).values({
    name,
    role: String(formData.get("role") || "").trim() || null,
    schedule: String(formData.get("schedule") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  revalidatePath("/university/clubs");
}

export async function updateClub(id: number, formData: FormData) {
  await db
    .update(clubs)
    .set({
      name: String(formData.get("name") || "").trim(),
      role: String(formData.get("role") || "").trim() || null,
      schedule: String(formData.get("schedule") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    })
    .where(eq(clubs.id, id));
  revalidatePath("/university/clubs");
}

export async function deleteClub(id: number) {
  await db.delete(clubs).where(eq(clubs.id, id));
  revalidatePath("/university/clubs");
}
