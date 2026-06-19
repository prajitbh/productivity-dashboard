export default function PageHeader({
  entry,
  title,
  subtitle,
}: {
  entry: string;
  title: string;
  subtitle?: string;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-paper-line">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] text-ink-faint uppercase tracking-widest mb-1">
            Entry {entry}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink">{title}</h1>
        </div>
        <p className="font-mono text-xs text-ink-faint hidden sm:block">{today}</p>
      </div>
      {subtitle && <p className="text-ink-soft text-sm mt-2 max-w-lg">{subtitle}</p>}
    </header>
  );
}
