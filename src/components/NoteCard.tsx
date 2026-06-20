"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "@/db/schema";
import { updateNote, togglePinNote, deleteNote, resizeNote } from "@/app/actions/notes";
import RichTextEditor from "./RichTextEditor";

export default function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [html, setHtml] = useState(note.contentHtml || note.content);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatedLabel = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Persist size changes from the native CSS `resize: both` corner-drag handle.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(([entry]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const { width, height } = entry.contentRect;
        resizeNote(note.id, Math.round(width), Math.round(height));
      }, 400);
    });
    observer.observe(el);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [note.id]);

  async function save() {
    const fd = new FormData();
    fd.set("title", title);
    fd.set("contentHtml", html);
    await updateNote(note.id, fd);
    setEditing(false);
  }

  const style = note.width && note.height ? { width: note.width, height: note.height } : undefined;

  if (editing) {
    return (
      <div
        ref={containerRef}
        style={style}
        className="resizable-note border border-paper-line rounded-md bg-paper-raised p-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent font-display text-lg outline-none mb-2"
        />
        <RichTextEditor defaultHtml={html} onChangeHtml={setHtml} autoFocus minHeight={120} />
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={() => setEditing(false)} className="text-xs font-mono text-ink-soft px-3 py-1.5">
            Cancel
          </button>
          <button type="button" onClick={save} className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={style}
      className="resizable-note group border border-paper-line rounded-md bg-paper-raised p-4 relative"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg text-ink cursor-text" onClick={() => setEditing(true)}>
          {note.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => togglePinNote(note.id, note.pinned)}
            className={`text-xs px-1 ${note.pinned ? "text-amber" : "text-ink-faint hover:text-amber"}`}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
          >
            ★
          </button>
          <button
            type="button"
            onClick={() => deleteNote(note.id)}
            className="text-xs px-1 text-ink-faint hover:text-brick"
            aria-label="Delete note"
          >
            ✕
          </button>
        </div>
      </div>
      <div
        onClick={() => setEditing(true)}
        className="rich-text-area text-sm text-ink-soft mt-2 cursor-text overflow-auto"
        dangerouslySetInnerHTML={{
          __html: note.contentHtml || note.content || "<span class='text-ink-faint'>Empty — click to write.</span>",
        }}
      />
      <p className="font-mono text-[10px] text-ink-faint mt-3">
        edited {updatedLabel} · drag corner ↘ to resize
      </p>
    </div>
  );
}
