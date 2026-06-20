"use client";

import { useRef, useState } from "react";
import { createHabit } from "@/app/actions/habits";

export default function HabitForm({ category = "general" }: { category?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input type="hidden" name="category" value={category} />
      <input
        name="name"
        placeholder="Name a habit to keep…"
        onFocus={() => setExpanded(true)}
        required
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none"
      />
      {expanded && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <label className="font-mono text-ink-soft">Mark color</label>
          <select
            name="color"
            defaultValue="sage"
            className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-ink-soft"
          >
            <option value="sage">sage</option>
            <option value="amber">amber</option>
            <option value="brick">brick</option>
          </select>
          <label className="font-mono text-ink-soft ml-2">Target / week</label>
          <input
            type="number"
            name="targetPerWeek"
            min={1}
            max={7}
            defaultValue={7}
            className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-ink-soft w-14"
          />
          <div className="flex-1" />
          <button
            type="submit"
            className="bg-ink text-paper rounded px-3 py-1.5 font-medium hover:bg-ink/90"
          >
            Add habit
          </button>
        </div>
      )}
    </form>
  );
}
