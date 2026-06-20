"use client";

import { signIn, signOut } from "next-auth/react";
import { CalendarEvent } from "@/lib/outlook";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
}

export default function WeekCalendar({
  connected,
  events,
}: {
  connected: boolean;
  events: CalendarEvent[];
}) {
  if (!connected) {
    return (
      <div className="border border-paper-line rounded-md bg-paper-raised p-4 text-center">
        <p className="text-sm text-ink-soft mb-3">
          Connect Outlook to see this week's calendar here.
        </p>
        <button
          type="button"
          onClick={() => signIn("azure-ad")}
          className="bg-ink text-paper rounded px-4 py-1.5 text-xs font-medium hover:bg-ink/90"
        >
          Connect Outlook
        </button>
      </div>
    );
  }

  // Group by day for a simple week-at-a-glance layout.
  const byDay = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const key = formatDay(e.start);
    byDay.set(key, [...(byDay.get(key) ?? []), e]);
  }

  return (
    <div className="border border-paper-line rounded-md bg-paper-raised p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">This week · Outlook</p>
        <button
          type="button"
          onClick={() => signOut()}
          className="text-[11px] font-mono text-ink-faint hover:text-brick"
        >
          disconnect
        </button>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-ink-faint">Nothing on the calendar this week.</p>
      ) : (
        <div className="space-y-3">
          {Array.from(byDay.entries()).map(([day, items]) => (
            <div key={day}>
              <p className="font-mono text-[10px] text-ink-faint mb-1">{day}</p>
              {items.map((e) => (
                <div key={e.id} className="flex items-baseline gap-2 text-sm py-0.5">
                  <span className="font-mono text-[11px] text-ink-soft w-16 shrink-0">
                    {e.isAllDay ? "all day" : formatTime(e.start)}
                  </span>
                  <span className="text-ink truncate">{e.subject}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
