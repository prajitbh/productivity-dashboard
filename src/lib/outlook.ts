export type CalendarEvent = {
  id: string;
  subject: string;
  start: string;
  end: string;
  isAllDay: boolean;
};

/** Monday–Sunday range containing today, as ISO strings for the Graph calendarView call. */
function thisWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + mondayOffset);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  return { start: monday.toISOString(), end: nextMonday.toISOString() };
}

export async function getWeekEvents(accessToken: string): Promise<CalendarEvent[]> {
  const { start, end } = thisWeekRange();
  const url = `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${start}&endDateTime=${end}&$orderby=start/dateTime&$top=50`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'outlook.timezone="UTC"',
    },
    // Calendar data changes; don't let Next.js cache this server-side fetch.
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.value ?? []).map((e: any) => ({
    id: e.id,
    subject: e.subject || "(no title)",
    start: e.start?.dateTime,
    end: e.end?.dateTime,
    isAllDay: !!e.isAllDay,
  }));
}
