import { db } from "@/db";
import { notes } from "@/db/schema";
import { desc, isNull } from "drizzle-orm";
import PageHeader from "@/components/PageHeader";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const allNotes = await db
    .select()
    .from(notes)
    .where(isNull(notes.tabKey))
    .orderBy(desc(notes.updatedAt));
  const pinned = allNotes.filter((n) => n.pinned);
  const rest = allNotes.filter((n) => !n.pinned);

  return (
    <div>
      <PageHeader entry="08" title="Notes" subtitle="Margin notes for everything else." />
      <div className="px-6 sm:px-10 py-8 max-w-4xl space-y-8">
        <div className="max-w-2xl">
          <NoteForm />
        </div>

        {pinned.length > 0 && (
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-3">
              Pinned
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {pinned.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
            </div>
          </section>
        )}

        <section>
          {pinned.length > 0 && (
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-3">
              All notes
            </h2>
          )}
          {rest.length === 0 && pinned.length === 0 ? (
            <p className="text-sm text-ink-faint">No notes yet. Write your first one above.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {rest.map((n) => (
                <NoteCard key={n.id} note={n} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
