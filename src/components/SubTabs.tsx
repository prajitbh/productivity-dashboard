"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubTabs({
  tabs,
}: {
  tabs: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 px-6 sm:px-10 pt-4">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors ${
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-line"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
