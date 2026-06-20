"use client";

import { useEffect, useRef, useState } from "react";
import { createTask } from "@/app/actions/tasks";

export default function QuickAdd() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey;
      if (modifierPressed && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (open) {
      setSaved(false);
      // small delay so the element exists before focusing
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-start justify-center pt-[20vh] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-paper-raised border border-paper-line rounded-md shadow-xl w-full max-w-md mx-4 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          ref={formRef}
          action={async (formData) => {
            await createTask(formData);
            formRef.current?.reset();
            setSaved(true);
            setTimeout(() => setOpen(false), 500);
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
            Quick add task
          </p>
          <input
            ref={inputRef}
            name="title"
            placeholder="Type a task and press Enter…"
            required
            className="w-full bg-transparent text-base placeholder:text-ink-faint outline-none border-b border-paper-line pb-2"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="font-mono text-[10px] text-ink-faint">
              {saved ? "Added." : "Esc to close · Enter to save"}
            </p>
            <button
              type="submit"
              className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
