export type Recurrence = "daily" | "weekdays" | "weekly" | "monthly";

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Given a completed task's due date and its recurrence rule, return the next due date (yyyy-mm-dd). */
export function nextDueDate(rule: Recurrence, fromDateStr: string): string {
  const d = new Date(fromDateStr + "T00:00:00");

  switch (rule) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekdays": {
      d.setDate(d.getDate() + 1);
      while (d.getDay() === 0 || d.getDay() === 6) {
        d.setDate(d.getDate() + 1);
      }
      break;
    }
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
  }

  return toDateStr(d);
}

export const recurrenceLabel: Record<Recurrence, string> = {
  daily: "every day",
  weekdays: "every weekday",
  weekly: "every week",
  monthly: "every month",
};
