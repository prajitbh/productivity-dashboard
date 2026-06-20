import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, goals, notes, contacts, classes, clubs, mediaEntries } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const pattern = `%${q}%`;

  const [taskRows, goalRows, noteRows, contactRows, classRows, clubRows, mediaRows] =
    await Promise.all([
      db.select().from(tasks).where(or(ilike(tasks.title, pattern), ilike(tasks.description, pattern))),
      db.select().from(goals).where(or(ilike(goals.title, pattern), ilike(goals.description, pattern))),
      db.select().from(notes).where(or(ilike(notes.title, pattern), ilike(notes.content, pattern))),
      db
        .select()
        .from(contacts)
        .where(or(ilike(contacts.name, pattern), ilike(contacts.company, pattern), ilike(contacts.description, pattern))),
      db.select().from(classes).where(or(ilike(classes.name, pattern), ilike(classes.instructor, pattern))),
      db.select().from(clubs).where(ilike(clubs.name, pattern)),
      db.select().from(mediaEntries).where(ilike(mediaEntries.title, pattern)),
    ]);

  const results = [
    ...taskRows.map((t) => ({ type: "task", id: t.id, title: t.title, href: "/tasks" })),
    ...goalRows.map((g) => ({ type: "goal", id: g.id, title: g.title, href: "/goals" })),
    ...noteRows.map((n) => ({ type: "note", id: n.id, title: n.title, href: "/notes" })),
    ...contactRows.map((c) => ({ type: "contact", id: c.id, title: c.name, href: "/career" })),
    ...classRows.map((c) => ({ type: "class", id: c.id, title: c.name, href: "/university/classes" })),
    ...clubRows.map((c) => ({ type: "club", id: c.id, title: c.name, href: "/university/clubs" })),
    ...mediaRows.map((m) => ({ type: m.mediaType, id: m.id, title: m.title, href: "/habits/tv" })),
  ].slice(0, 30);

  return NextResponse.json({ results });
}
