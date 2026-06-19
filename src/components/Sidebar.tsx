"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Today", entry: "01" },
  { href: "/tasks", label: "Tasks", entry: "02" },
  { href: "/goals", label: "Goals", entry: "03" },
  { href: "/habits", label: "Habits", entry: "04" },
  { href: "/notes", label: "Notes", entry: "05" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[68px] sm:w-56 shrink-0 bg-ink text-paper flex flex-col">
      <div className="px-3 sm:px-5 pt-7 pb-6 border-b border-white/10">
        <div className="hidden sm:block">
          <p className="font-display italic text-xl leading-none">Ledger</p>
          <p className="text-[11px] text-paper/50 mt-1 tracking-wide uppercase font-mono">
            Daily record
          </p>
        </div>
        <div className="sm:hidden text-center font-display italic text-lg">L.</div>
      </div>

      <nav className="flex-1 py-4">
        {links.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 sm:px-5 py-3 text-sm transition-colors relative ${
                active
                  ? "bg-white/10 text-paper"
                  : "text-paper/60 hover:text-paper hover:bg-white/5"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber" />
              )}
              <span className="font-mono text-[11px] text-paper/40 hidden sm:inline">
                {link.entry}
              </span>
              <span className="hidden sm:inline">{link.label}</span>
              <span className="sm:hidden text-base">{link.label[0]}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden sm:block px-5 py-4 border-t border-white/10 text-[11px] text-paper/40 font-mono">
        no login · single ledger
      </div>
    </aside>
  );
}
