"use client";

import { useRef, useState, useTransition } from "react";
import { Note } from "@/db/schema";
import { updateNote, togglePinNote, deleteNote } from "@/app/actions/notes";

export default function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const updatedLabel = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (editing) {
    return (
      <form
        ref={formRef}
        action={async (formData) => {
          await updateNote(note.id, formData);
          setEditing(false);
        }}
        className="border border-paper-line rounded-md bg-paper-raised p-4"
      >
        <input
          name="title"
          defaultValue={note.title}
          className="w-full bg-transparent font-display text-lg outline-none mb-2"
        />
        <textarea
          name="content"
          defaultValue={note.content}
          rows={5}
          autoFocus
          className="w-full bg-transparent text-sm outline-none"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs font-mono text-ink-soft px-3 py-1.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="group border border-paper-line rounded-md bg-paper-raised p-4 relative">
      <div className="flex items-start justify-between gap-2">
        <h3
          className="font-display text-lg text-ink cursor-text"
          onClick={() => setEditing(true)}
        >
          {note.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => startTransition(() => togglePinNote(note.id, note.pinned))}
            className={`text-xs px-1 ${note.pinned ? "text-amber" : "text-ink-faint hover:text-amber"}`}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
          >
            ★
          </button>
          <button
            type="button"
            onClick={() => startTransition(() => deleteNote(note.id))}
            className="text-xs px-1 text-ink-faint hover:text-brick"
            aria-label="Delete note"
          >
            ✕
          </button>
        </div>
      </div>
      <p
        onClick={() => setEditing(true)}
        className="text-sm text-ink-soft mt-2 whitespace-pre-wrap cursor-text line-clamp-6"
      >
        {note.content || "Empty — click to write."}
      </p>
      <p className="font-mono text-[10px] text-ink-faint mt-3">edited {updatedLabel}</p>
    </div>
  );
}
