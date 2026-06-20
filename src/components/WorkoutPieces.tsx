"use client";

import { useRef, useState } from "react";
import { Workout } from "@/db/schema";
import { createWorkout, deleteWorkout } from "@/app/actions/workouts";

export function WorkoutForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createWorkout(fd);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input
        name="type"
        placeholder="Log a workout — e.g. Push day, 5k run…"
        onFocus={() => setExpanded(true)}
        required
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none"
      />
      {expanded && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <input type="date" name="date" defaultValue={new Date().toISOString().slice(0, 10)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono" />
          <input type="number" name="durationMinutes" placeholder="Minutes" className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono" />
          <input name="notes" placeholder="Notes" className="col-span-2 bg-paper border border-paper-line rounded px-2 py-1.5" />
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="bg-ink text-paper rounded px-3 py-1.5 font-medium hover:bg-ink/90">
              Log it
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export function WorkoutRow({ item }: { item: Workout }) {
  const dateLabel = new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <div className="group flex items-center justify-between py-2.5 ledger-line">
      <div>
        <p className="text-sm text-ink">{item.type}</p>
        <p className="font-mono text-[11px] text-ink-faint mt-0.5">
          {dateLabel}
          {item.durationMinutes ? ` · ${item.durationMinutes} min` : ""}
          {item.notes ? ` · ${item.notes}` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={() => deleteWorkout(item.id)}
        className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-brick text-xs transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
