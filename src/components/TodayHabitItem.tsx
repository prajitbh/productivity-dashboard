"use client";

import { useState, useTransition } from "react";
import { Habit } from "@/db/schema";
import { toggleHabitToday } from "@/app/actions/habits";

const colorMap: Record<string, string> = {
  sage: "bg-sage border-sage",
  amber: "bg-amber border-amber",
  brick: "bg-brick border-brick",
};

export default function TodayHabitItem({
  habit,
  doneToday,
  streak,
}: {
  habit: Habit;
  doneToday: boolean;
  streak: number;
}) {
  const [checked, setChecked] = useState(doneToday);
  const [pending, startTransition] = useTransition();

  function toggle() {
    setChecked(!checked);
    startTransition(() => toggleHabitToday(habit.id));
  }

  return (
    <div className="flex items-center gap-3 py-2 ledger-line">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`h-5 w-5 rounded-sm border-[1.5px] transition-colors ${
          checked ? colorMap[habit.color] ?? colorMap.sage : "border-ink-soft bg-transparent"
        }`}
        aria-label={`Mark ${habit.name} done today`}
      />
      <span className="text-sm text-ink flex-1">{habit.name}</span>
      <span className="font-mono text-[11px] text-ink-faint">{streak}d</span>
    </div>
  );
}
