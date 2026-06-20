"use client";

import { useMemo, useState } from "react";
import { MediaEntry } from "@/db/schema";
import MediaCard from "./MediaCard";
import MediaForm from "./MediaForm";

type SortKey = "genre" | "rating_desc" | "release_desc";

export default function MediaSection({
  title,
  mediaType,
  items,
}: {
  title: string;
  mediaType: "movie" | "show";
  items: MediaEntry[];
}) {
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState<SortKey>("release_desc");

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.genres.split(",").forEach((g) => g.trim() && set.add(g.trim())));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let rows = items.filter((i) => (genre ? i.genres.includes(genre) : true));
    rows = [...rows].sort((a, b) => {
      if (sort === "rating_desc") return (b.rating ?? -1) - (a.rating ?? -1);
      if (sort === "release_desc") {
        const ad = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const bd = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return bd - ad;
      }
      // genre sort: alphabetical by first genre
      return (a.genres || "zzz").localeCompare(b.genres || "zzz");
    });
    return rows;
  }, [items, genre, sort]);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
          {title} · {items.length}
        </h2>
      </div>
      <div className="mb-3">
        <MediaForm defaultType={mediaType} />
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft">
            <option value="">all genres</option>
            {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft">
            <option value="release_desc">newest release first</option>
            <option value="rating_desc">highest rating first</option>
            <option value="genre">by genre</option>
          </select>
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="text-sm text-ink-faint py-2">Nothing here yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
