"use client";

import { useRef, useState } from "react";
import { Class } from "@/db/schema";
import { createClass, updateClass, deleteClass } from "@/app/actions/classes";

export function ClassForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createClass(fd);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input
        name="name"
        placeholder="Add a class…"
        onFocus={() => setExpanded(true)}
        required
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none"
      />
      {expanded && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <input name="term" placeholder="Term (e.g. Fall 2026)" className="bg-paper border border-paper-line rounded px-2 py-1.5" />
          <input name="instructor" placeholder="Instructor" className="bg-paper border border-paper-line rounded px-2 py-1.5" />
          <input name="grade" placeholder="Grade (optional)" className="bg-paper border border-paper-line rounded px-2 py-1.5" />
          <input name="notes" placeholder="Notes" className="bg-paper border border-paper-line rounded px-2 py-1.5" />
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="bg-ink text-paper rounded px-3 py-1.5 font-medium hover:bg-ink/90">
              Add class
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export function ClassCard({ item }: { item: Class }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (fd) => {
          await updateClass(item.id, fd);
          setEditing(false);
        }}
        className="border border-paper-line rounded-md bg-paper-raised p-4 grid grid-cols-2 gap-2 text-sm"
      >
        <input name="name" defaultValue={item.name} className="col-span-2 bg-transparent font-display text-lg outline-none" />
        <input name="term" defaultValue={item.term ?? ""} placeholder="Term" className="bg-paper border border-paper-line rounded px-2 py-1.5 text-xs" />
        <input name="instructor" defaultValue={item.instructor ?? ""} placeholder="Instructor" className="bg-paper border border-paper-line rounded px-2 py-1.5 text-xs" />
        <input name="grade" defaultValue={item.grade ?? ""} placeholder="Grade" className="bg-paper border border-paper-line rounded px-2 py-1.5 text-xs" />
        <input name="notes" defaultValue={item.notes ?? ""} placeholder="Notes" className="bg-paper border border-paper-line rounded px-2 py-1.5 text-xs" />
        <div className="col-span-2 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="text-xs font-mono text-ink-soft px-3 py-1.5">Cancel</button>
          <button type="submit" className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90">Save</button>
        </div>
      </form>
    );
  }

  return (
    <div className="group border border-paper-line rounded-md bg-paper-raised p-4 flex items-start justify-between gap-2">
      <div className="cursor-text" onClick={() => setEditing(true)}>
        <h3 className="font-display text-lg text-ink">{item.name}</h3>
        <p className="text-xs text-ink-soft mt-0.5">
          {[item.term, item.instructor].filter(Boolean).join(" · ")}
        </p>
        {item.grade && <p className="text-xs font-mono text-amber mt-1">grade: {item.grade}</p>}
        {item.notes && <p className="text-sm text-ink-soft mt-2">{item.notes}</p>}
      </div>
      <button
        type="button"
        onClick={() => deleteClass(item.id)}
        className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-brick text-xs transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
