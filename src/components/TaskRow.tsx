"use client";

import { useState, useTransition } from "react";
import { Task } from "@/db/schema";
import { setTaskStatus, deleteTask } from "@/app/actions/tasks";

const priorityColor: Record<string, string> = {
  high: "text-brick",
  medium: "text-amber",
  low: "text-sage",
};

function formatDue(dueDate: string | null) {
  if (!dueDate) return null;
  const d = new Date(dueDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);

  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (diffDays < 0) return { label: `${label} · overdue`, overdue: true };
  if (diffDays === 0) return { label: "today", overdue: false };
  if (diffDays === 1) return { label: "tomorrow", overdue: false };
  return { label, overdue: false };
}

export default function TaskRow({
  task,
  goalTitle,
}: {
  task: Task;
  goalTitle?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useState(task.status === "done");
  const due = formatDue(task.dueDate);

  function toggle() {
    const next = !optimisticDone;
    setOptimisticDone(next);
    startTransition(async () => {
      await setTaskStatus(task.id, next ? "done" : "todo");
    });
  }

  return (
    <div className="group flex items-start gap-3 py-2.5 ledger-line">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="stamp mt-0.5"
        data-checked={optimisticDone}
        aria-label={optimisticDone ? "Mark as not done" : "Mark as done"}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            optimisticDone ? "line-through text-ink-faint" : "text-ink"
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
          <span className={priorityColor[task.priority] ?? "text-ink-soft"}>
            {task.priority}
          </span>
          {due && (
            <span className={due.overdue ? "text-brick" : "text-ink-soft"}>
              · {due.label}
            </span>
          )}
          {goalTitle && <span className="text-ink-faint">· {goalTitle}</span>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => startTransition(() => deleteTask(task.id))}
        className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-brick text-xs font-mono px-1 transition-opacity"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
