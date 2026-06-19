export function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(toDateStr(d));
  }
  return days;
}

/** Current streak counting back from today (breaks on first missing day, today excused if not logged yet). */
export function currentStreak(loggedDates: string[]): number {
  const logged = new Set(loggedDates);
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);

  // If today isn't logged yet, start counting from yesterday so an
  // in-progress day doesn't falsely zero out an existing streak.
  if (!logged.has(toDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (logged.has(toDateStr(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function weekday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
}
