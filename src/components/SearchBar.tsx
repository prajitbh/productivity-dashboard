"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchResult = {
  type: string;
  id: number;
  title: string;
  subtitle?: string;
  href: string;
};

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs font-mono text-paper/50 hover:text-paper/80 px-2 py-1.5 border border-white/10 rounded-md w-full"
      >
        <span>🔍</span>
        <span className="hidden sm:inline">Search the palace…</span>
        <span className="hidden sm:inline ml-auto text-paper/30">/</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-paper-raised border border-paper-line rounded-lg w-full max-w-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks, goals, notes, contacts, classes…"
              className="w-full px-4 py-3 bg-transparent text-sm outline-none border-b border-paper-line text-ink placeholder:text-ink-faint"
            />
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {loading && <p className="px-4 py-3 text-xs text-ink-faint font-mono">searching…</p>}
              {!loading && query.trim() && results.length === 0 && (
                <p className="px-4 py-3 text-xs text-ink-faint font-mono">no matches</p>
              )}
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    router.push(r.href);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-paper-line/40 flex items-center justify-between gap-2"
                >
                  <span className="text-sm text-ink truncate">{r.title}</span>
                  <span className="text-[10px] font-mono text-ink-faint uppercase shrink-0">
                    {r.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
