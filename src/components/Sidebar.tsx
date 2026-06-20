"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  entry: string;
  children?: { href: string; label: string }[];
};

const links: NavItem[] = [
  { href: "/", label: "Home", entry: "01" },
  { href: "/tasks", label: "Tasks", entry: "02" },
  { href: "/goals", label: "Goals", entry: "03" },
  { href: "/career", label: "Career", entry: "04" },
  {
    href: "/university",
    label: "University",
    entry: "05",
    children: [
      { href: "/university/classes", label: "Classes" },
      { href: "/university/clubs", label: "Clubs" },
    ],
  },
  { href: "/workouts", label: "Working Out", entry: "06" },
  {
    href: "/habits",
    label: "Habits",
    entry: "07",
    children: [
      { href: "/habits/reading", label: "Reading" },
      { href: "/habits/tv", label: "TV" },
      { href: "/habits/journaling", label: "Journaling" },
    ],
  },
  { href: "/notes", label: "Notes", entry: "08" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[68px] sm:w-60 shrink-0 bg-ink text-paper flex flex-col">
      <div className="px-3 sm:px-5 pt-7 pb-4 border-b border-white/10">
        <div className="hidden sm:flex items-baseline justify-between">
          <div>
            <p className="font-display italic text-xl leading-none">Mind Palace</p>
            <p className="text-[11px] text-paper/50 mt-1 tracking-wide uppercase font-mono">
              Daily record
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="sm:hidden text-center font-display italic text-lg">MP</div>
      </div>

      <div className="hidden sm:block px-5 py-3 border-b border-white/10">
        <SearchBar />
      </div>

      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        {links.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <div key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-3 sm:px-5 py-2.5 text-sm transition-colors relative ${
                  active ? "bg-white/10 text-paper" : "text-paper/60 hover:text-paper hover:bg-white/5"
                }`}
              >
                {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber" />}
                <span className="font-mono text-[11px] text-paper/40 hidden sm:inline">
                  {link.entry}
                </span>
                <span className="hidden sm:inline">{link.label}</span>
                <span className="sm:hidden text-base">{link.label[0]}</span>
              </Link>
              {link.children && active && (
                <div className="hidden sm:block pl-10 pb-1">
                  {link.children.map((child) => {
                    const childActive = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block py-1.5 text-xs ${
                          childActive ? "text-amber" : "text-paper/50 hover:text-paper"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sm:hidden flex justify-center py-3 border-t border-white/10">
        <ThemeToggle />
      </div>
      <div className="hidden sm:block px-5 py-4 border-t border-white/10 text-[11px] text-paper/40 font-mono">
        no login · single ledger
      </div>
    </aside>
  );
}
