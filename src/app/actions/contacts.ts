"use server";

import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createContact(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await db.insert(contacts).values({
    name,
    linkedinUrl: String(formData.get("linkedinUrl") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    company: String(formData.get("company") || "").trim() || null,
    howMet: String(formData.get("howMet") || "").trim() || null,
    lastContactedDate: String(formData.get("lastContactedDate") || "").trim() || null,
    industry: String(formData.get("industry") || "").trim() || null,
    position: String(formData.get("position") || "").trim() || null,
    locationType: String(formData.get("locationType") || "").trim() || null,
  });

  revalidatePath("/career");
}

export async function updateContact(id: number, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await db
    .update(contacts)
    .set({
      name,
      linkedinUrl: String(formData.get("linkedinUrl") || "").trim() || null,
      description: String(formData.get("description") || "").trim() || null,
      company: String(formData.get("company") || "").trim() || null,
      howMet: String(formData.get("howMet") || "").trim() || null,
      lastContactedDate: String(formData.get("lastContactedDate") || "").trim() || null,
      industry: String(formData.get("industry") || "").trim() || null,
      position: String(formData.get("position") || "").trim() || null,
      locationType: String(formData.get("locationType") || "").trim() || null,
    })
    .where(eq(contacts.id, id));

  revalidatePath("/career");
}

export async function touchLastContacted(id: number) {
  await db
    .update(contacts)
    .set({ lastContactedDate: new Date().toISOString().slice(0, 10) })
    .where(eq(contacts.id, id));
  revalidatePath("/career");
}

export async function deleteContact(id: number) {
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath("/career");
}
