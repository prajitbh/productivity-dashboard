"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function plainTextFromHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function createNote(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const contentHtml = String(formData.get("contentHtml") || "").trim();
  if (!title && !contentHtml) return;

  await db.insert(notes).values({
    title: title || "Untitled",
    content: plainTextFromHtml(contentHtml),
    contentHtml,
  });

  revalidatePath("/", "layout");
}

export async function updateNote(id: number, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const contentHtml = String(formData.get("contentHtml") || "").trim();

  await db
    .update(notes)
    .set({
      title: title || "Untitled",
      content: plainTextFromHtml(contentHtml),
      contentHtml,
      updatedAt: new Date(),
    })
    .where(eq(notes.id, id));

  revalidatePath("/", "layout");
}

export async function resizeNote(id: number, width: number, height: number) {
  await db.update(notes).set({ width, height }).where(eq(notes.id, id));
}

export async function togglePinNote(id: number, pinned: boolean) {
  await db.update(notes).set({ pinned: !pinned }).where(eq(notes.id, id));
  revalidatePath("/", "layout");
}

export async function deleteNote(id: number) {
  await db.delete(notes).where(eq(notes.id, id));
  revalidatePath("/", "layout");
}

// ---------- Per-tab sticky note ----------
// Each tab (e.g. "career", "university", "habits", "home") gets exactly one
// note pinned to its tabKey. Created lazily on first save.

export async function getTabNote(tabKey: string) {
  const rows = await db.select().from(notes).where(eq(notes.tabKey, tabKey));
  return rows[0] ?? null;
}

export async function saveTabNote(tabKey: string, contentHtml: string) {
  const existing = await db.select().from(notes).where(eq(notes.tabKey, tabKey));
  const plain = plainTextFromHtml(contentHtml);

  if (existing.length > 0) {
    await db
      .update(notes)
      .set({ contentHtml, content: plain, updatedAt: new Date() })
      .where(eq(notes.tabKey, tabKey));
  } else {
    await db.insert(notes).values({
      title: `${tabKey} note`,
      content: plain,
      contentHtml,
      tabKey,
    });
  }

  revalidatePath("/", "layout");
}

export async function getRegularNotes() {
  return db.select().from(notes).where(isNull(notes.tabKey));
}
