"use client";

import { useState, useTransition } from "react";
import { Habit } from "@/db/schema";
import { toggleHabitForDate } from "@/app/actions/habits";
import { lastNDays, toDateStr, weekday } from "@/lib/habit-utils";

const colorMap: Record<string, { fill: string; ring: string }> = {
  sage: { fill: "bg-sage", ring: "ring-sage" },
  amber: { fill: "bg-amber", ring: "ring-amber" },
  brick: { fill: "bg-brick", ring: "ring-brick" },
};

export default function HabitRow({
  habit,
  loggedDates,
}: {
  habit: Habit;
  loggedDates: string[];
}) {
  const [logged, setLogged] = useState(new Set(loggedDates));
  const [, startTransition] = useTransition();
  const days = lastNDays(14);
  const today = toDateStr(new Date());
  const colors = colorMap[habit.color] ?? colorMap.sage;

  // streak computed from local optimistic state
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (logged.has(days[i])) streak += 1;
    else if (days[i] !== today) break;
  }

  function toggle(date: string) {
    const next = new Set(logged);
    if (next.has(date)) next.delete(date);
    else next.add(date);
    setLogged(next);
    startTransition(() => toggleHabitForDate(habit.id, date));
  }

  return (
    <div className="py-3 ledger-line">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-sm text-ink font-medium">{habit.name}</h3>
        <span className="font-mono text-[11px] text-ink-soft">
          {streak > 0 ? `${streak} day streak` : "no streak yet"}
        </span>
      </div>
      <div className="flex gap-[5px]">
        {days.map((d) => {
          const isLogged = logged.has(d);
          const isToday = d === today;
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              title={d}
              className={`group relative h-7 w-3 rounded-sm border transition-transform ${
                isLogged
                  ? `${colors.fill} border-transparent rotate-[-4deg]`
                  : "bg-transparent border-paper-line hover:border-ink-faint"
              } ${isToday ? `ring-2 ring-offset-1 ring-offset-paper ${colors.ring}` : ""}`}
              aria-label={`${isLogged ? "Unmark" : "Mark"} ${habit.name} for ${d}`}
            >
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-ink-faint opacity-0 group-hover:opacity-100">
                {weekday(d)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
