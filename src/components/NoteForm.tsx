"use client";

import { useRef, useState } from "react";
import { createNote } from "@/app/actions/notes";
import RichTextEditor from "./RichTextEditor";

export default function NoteForm() {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function save() {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("contentHtml", html);
    await createNote(fd);
    setTitle("");
    setHtml("");
    setExpanded(false);
  }

  return (
    <div className="border border-paper-line rounded-md bg-paper-raised p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New note title…"
        onFocus={() => setExpanded(true)}
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none font-medium"
      />
      {expanded && (
        <>
          <div className="mt-2">
            <RichTextEditor defaultHtml="" onChangeHtml={setHtml} placeholder="Write it down…" />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={save}
              className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90"
            >
              Save note
            </button>
          </div>
        </>
      )}
    </div>
  );
}
