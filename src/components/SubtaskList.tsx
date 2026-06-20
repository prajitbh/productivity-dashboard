"use client";

import { useRef, useState } from "react";
import { Task } from "@/db/schema";
import { createSubtask } from "@/app/actions/tasks";
import TaskRow from "./TaskRow";

export default function SubtaskList({
  parentTask,
  subtasks,
}: {
  parentTask: Task;
  subtasks: Task[];
}) {
  const [expanded, setExpanded] = useState(subtasks.length > 0);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="pl-9 -mt-1 mb-1">
      {subtasks.map((s) => (
        <div key={s.id} className="border-l border-paper-line pl-3">
          <TaskRow task={s} />
        </div>
      ))}

      {expanded ? (
        <form
          action={async (formData) => {
            const title = String(formData.get("title") || "");
            await createSubtask(parentTask.id, title);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="border-l border-paper-line pl-3 py-1.5"
        >
          <input
            ref={inputRef}
            name="title"
            placeholder="Add a subtask…"
            className="w-full bg-transparent text-xs placeholder:text-ink-faint outline-none text-ink-soft"
          />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-[11px] font-mono text-ink-faint hover:text-amber pl-3 py-1"
        >
          + add subtask
        </button>
      )}
    </div>
  );
}
