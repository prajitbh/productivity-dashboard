"use client";

import { useState } from "react";
import { saveTabNote } from "@/app/actions/notes";
import RichTextEditor from "./RichTextEditor";

export default function TabNote({
  tabKey,
  initialHtml,
}: {
  tabKey: string;
  initialHtml: string;
}) {
  const [open, setOpen] = useState(!!initialHtml);
  const [html, setHtml] = useState(initialHtml);
  const [saving, setSaving] = useState(false);

  async function save(next: string) {
    setHtml(next);
    setSaving(true);
    await saveTabNote(tabKey, next);
    setSaving(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] font-mono text-ink-faint hover:text-amber px-6 sm:px-10 pt-3 block"
      >
        + add a note to this page
      </button>
    );
  }

  return (
    <div className="px-6 sm:px-10 pt-4">
      <div className="border border-amber/40 bg-amber-soft/30 rounded-md p-1">
        <RichTextEditor
          defaultHtml={html}
          onChangeHtml={save}
          placeholder="A running note for this page — context, reminders, anything…"
          minHeight={48}
        />
      </div>
      <p className="font-mono text-[10px] text-ink-faint mt-1">
        {saving ? "saving…" : "saved · page note"}
      </p>
    </div>
  );
}
