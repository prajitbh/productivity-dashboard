"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!title && !content) return;

  await db.insert(notes).values({
    title: title || "Untitled",
    content,
  });

  revalidatePath("/");
  revalidatePath("/notes");
}

export async function updateNote(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();

  await db
    .update(notes)
    .set({ title: title || "Untitled", content, updatedAt: new Date() })
    .where(eq(notes.id, id));

  revalidatePath("/");
  revalidatePath("/notes");
}

export async function togglePinNote(id: number, pinned: boolean) {
  await db.update(notes).set({ pinned: !pinned }).where(eq(notes.id, id));
  revalidatePath("/");
  revalidatePath("/notes");
}

export async function deleteNote(id: number) {
  await db.delete(notes).where(eq(notes.id, id));
  revalidatePath("/");
  revalidatePath("/notes");
}
