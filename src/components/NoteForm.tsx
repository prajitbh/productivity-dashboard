"use client";

import { useRef, useState } from "react";
import { createNote } from "@/app/actions/notes";

export default function NoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createNote(formData);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input
        name="title"
        placeholder="New note title…"
        onFocus={() => setExpanded(true)}
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none font-medium"
      />
      {expanded && (
        <>
          <textarea
            name="content"
            placeholder="Write it down…"
            rows={3}
            className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none mt-2"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90"
            >
              Save note
            </button>
          </div>
        </>
      )}
    </form>
  );
}
