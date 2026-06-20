function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="border-r border-paper-line last:border-r-0 px-4 sm:px-6 first:pl-0 last:pr-0">
      <p className="font-display text-2xl sm:text-3xl text-ink leading-none">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mt-1.5">
        {label}
      </p>
    </div>
  );
}

export default function StatsRow({
  tasksDoneThisWeek,
  bestStreakAcrossHabits,
  goalsOnTrack,
  goalsTotal,
}: {
  tasksDoneThisWeek: number;
  bestStreakAcrossHabits: number;
  goalsOnTrack: number;
  goalsTotal: number;
}) {
  return (
    <div className="flex flex-wrap gap-y-4 px-6 sm:px-10 py-5 border-b border-paper-line bg-paper-raised/50">
      <Stat value={tasksDoneThisWeek} label="Settled this week" />
      <Stat value={`${bestStreakAcrossHabits}d`} label="Longest live streak" />
      <Stat value={`${goalsOnTrack}/${goalsTotal}`} label="Goals on track" />
    </div>
  );
}
