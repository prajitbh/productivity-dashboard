"use client";

import { useRef, useState } from "react";
import { createGoal } from "@/app/actions/goals";

export default function GoalForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createGoal(formData);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input
        name="title"
        placeholder="Name a goal worth tracking…"
        onFocus={() => setExpanded(true)}
        required
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none"
      />
      {expanded && (
        <div className="mt-3 space-y-2">
          <textarea
            name="description"
            placeholder="Why this matters (optional)"
            rows={2}
            className="w-full bg-paper border border-paper-line rounded px-2 py-1.5 text-sm placeholder:text-ink-faint outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-ink-soft">Target date</label>
            <input
              type="date"
              name="targetDate"
              className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-xs text-ink-soft"
            />
            <div className="flex-1" />
            <button
              type="submit"
              className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90"
            >
              Add goal
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
