"use server";

import { db } from "@/db";
import { classes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createClass(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await db.insert(classes).values({
    name,
    term: String(formData.get("term") || "").trim() || null,
    instructor: String(formData.get("instructor") || "").trim() || null,
    grade: String(formData.get("grade") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  revalidatePath("/university/classes");
}

export async function updateClass(id: number, formData: FormData) {
  await db
    .update(classes)
    .set({
      name: String(formData.get("name") || "").trim(),
      term: String(formData.get("term") || "").trim() || null,
      instructor: String(formData.get("instructor") || "").trim() || null,
      grade: String(formData.get("grade") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    })
    .where(eq(classes.id, id));
  revalidatePath("/university/classes");
}

export async function deleteClass(id: number) {
  await db.delete(classes).where(eq(classes.id, id));
  revalidatePath("/university/classes");
}
