"use client";

import { useRef, useState } from "react";
import { createTask } from "@/app/actions/tasks";
import { Goal } from "@/db/schema";
import DatePicker from "./DatePicker";

export default function TaskForm({ goals }: { goals: Goal[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTask(formData);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input
        name="title"
        placeholder="Add a task…"
        onFocus={() => setExpanded(true)}
        required
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none"
      />
      {expanded && (
        <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
          <select
            name="priority"
            defaultValue="medium"
            className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-ink-soft"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <DatePicker name="dueDate" />
          <select
            name="recurrence"
            defaultValue=""
            className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-ink-soft"
          >
            <option value="">doesn't repeat</option>
            <option value="daily">repeats daily</option>
            <option value="weekdays">repeats weekdays</option>
            <option value="weekly">repeats weekly</option>
            <option value="monthly">repeats monthly</option>
          </select>
          {goals.length > 0 && (
            <select
              name="goalId"
              defaultValue=""
              className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-ink-soft max-w-[160px]"
            >
              <option value="">no goal</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          )}
          <div className="flex-1" />
          <button
            type="submit"
            className="bg-ink text-paper rounded px-3 py-1.5 font-medium hover:bg-ink/90"
          >
            Add entry
          </button>
        </div>
      )}
    </form>
  );
}
