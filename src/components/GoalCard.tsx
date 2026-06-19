"use client";

import { useTransition } from "react";
import { Goal } from "@/db/schema";
import { setGoalStatus, deleteGoal } from "@/app/actions/goals";

export default function GoalCard({
  goal,
  doneCount,
  totalCount,
}: {
  goal: Goal;
  doneCount: number;
  totalCount: number;
}) {
  const [, startTransition] = useTransition();
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const targetLabel = goal.targetDate
    ? new Date(goal.targetDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="border border-paper-line rounded-md bg-paper-raised p-4 relative group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className={`font-display text-lg ${
              goal.status === "completed" ? "line-through text-ink-faint" : "text-ink"
            }`}
          >
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-sm text-ink-soft mt-1">{goal.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => startTransition(() => deleteGoal(goal.id))}
          className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-brick text-xs font-mono transition-opacity"
          aria-label="Delete goal"
        >
          ✕
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between font-mono text-[11px] text-ink-soft mb-1">
          <span>
            {totalCount > 0
              ? `${doneCount}/${totalCount} tasks settled`
              : "no linked tasks yet"}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-paper-line overflow-hidden">
          <div
            className="h-full bg-sage rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        {targetLabel ? (
          <span className="font-mono text-[11px] text-ink-faint">due {targetLabel}</span>
        ) : (
          <span />
        )}
        <select
          value={goal.status}
          onChange={(e) =>
            startTransition(() =>
              setGoalStatus(goal.id, e.target.value as "active" | "completed" | "archived")
            )
          }
          className="bg-paper border border-paper-line rounded px-2 py-1 font-mono text-[11px] text-ink-soft"
        >
          <option value="active">active</option>
          <option value="completed">completed</option>
          <option value="archived">archived</option>
        </select>
      </div>
    </div>
  );
}
