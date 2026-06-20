"use client";

import { useEffect, useRef, useState } from "react";

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DatePicker({
  name,
  defaultValue,
  label = "due date",
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (defaultValue ? new Date(defaultValue + "T00:00:00") : new Date()));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = fmt(new Date());

  function pick(day: number) {
    const d = new Date(year, month, day);
    const str = fmt(d);
    setValue(str);
    setOpen(false);
  }

  const displayLabel = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : `set ${label}`;

  return (
    <div className="relative" ref={wrapperRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`bg-paper border border-paper-line rounded px-2 py-1 font-mono text-xs flex items-center gap-1.5 ${
          value ? "text-ink" : "text-ink-faint"
        }`}
      >
        <span>📅</span>
        {displayLabel}
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setValue("");
            }}
            className="text-ink-faint hover:text-brick ml-1"
          >
            ✕
          </span>
        )}
      </button>

      {open && (
        <div className="absolute z-40 mt-1 bg-paper-raised border border-paper-line rounded-md shadow-lg p-3 w-64">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="text-ink-soft hover:text-ink px-1"
            >
              ‹
            </button>
            <span className="font-display text-sm text-ink">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="text-ink-soft hover:text-ink px-1"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-ink-faint mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <span key={i} />;
              const dateStr = fmt(new Date(year, month, day));
              const isSelected = dateStr === value;
              const isToday = dateStr === today;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(day)}
                  className={`h-7 w-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-amber text-ink font-medium"
                      : isToday
                        ? "border border-amber text-ink"
                        : "text-ink-soft hover:bg-paper-line"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setValue(today);
              setViewDate(new Date());
              setOpen(false);
            }}
            className="w-full mt-2 text-[11px] font-mono text-ink-soft hover:text-amber text-center"
          >
            today
          </button>
        </div>
      )}
    </div>
  );
}
