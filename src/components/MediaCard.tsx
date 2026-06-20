"use client";

import { useState, useTransition } from "react";
import { MediaEntry } from "@/db/schema";
import { updateMediaEntry, deleteMediaEntry } from "@/app/actions/media";

const STATUS_LABELS: Record<string, string> = {
  want_to_watch: "want to watch",
  watching: "watching",
  completed: "completed",
};

export default function MediaCard({ item }: { item: MediaEntry }) {
  const [, startTransition] = useTransition();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(item.notes ?? "");

  function update(partial: Partial<{ status: string; rating: string; notes: string; genres: string }>) {
    const fd = new FormData();
    fd.set("status", partial.status ?? item.status);
    fd.set("rating", partial.rating ?? (item.rating?.toString() ?? ""));
    fd.set("notes", partial.notes ?? (item.notes ?? ""));
    fd.set("genres", partial.genres ?? item.genres);
    startTransition(() => updateMediaEntry(item.id, fd));
  }

  return (
    <div className="group border border-paper-line rounded-md bg-paper-raised overflow-hidden flex">
      <div className="w-20 shrink-0 bg-paper-line">
        {item.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-faint text-[10px] font-mono p-1 text-center">
            no poster
          </div>
        )}
      </div>
      <div className="flex-1 p-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base text-ink leading-snug">{item.title}</h3>
          <button
            type="button"
            onClick={() => deleteMediaEntry(item.id)}
            className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-brick text-xs transition-opacity shrink-0"
          >
            ✕
          </button>
        </div>
        {item.releaseDate && (
          <p className="font-mono text-[10px] text-ink-faint">{item.releaseDate.slice(0, 4)}</p>
        )}
        {item.genres && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.genres.split(",").map((g) => (
              <span key={g} className="text-[9px] font-mono bg-sage-soft text-ink px-1.5 py-0.5 rounded-full">
                {g.trim()}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <select
            value={item.status}
            onChange={(e) => update({ status: e.target.value })}
            className="text-[11px] font-mono bg-paper border border-paper-line rounded px-1.5 py-1"
          >
            {Object.entries(STATUS_LABELS).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            placeholder="★ rating"
            defaultValue={item.rating ?? ""}
            onBlur={(e) => update({ rating: e.target.value })}
            className="w-20 text-[11px] font-mono bg-paper border border-paper-line rounded px-1.5 py-1"
          />
        </div>
        {editingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              update({ notes });
              setEditingNotes(false);
            }}
            autoFocus
            rows={2}
            className="w-full mt-2 text-xs bg-paper border border-paper-line rounded px-2 py-1.5 outline-none"
          />
        ) : (
          <p
            onClick={() => setEditingNotes(true)}
            className="text-xs text-ink-soft mt-2 cursor-text"
          >
            {item.notes || "+ thoughts on this one…"}
          </p>
        )}
      </div>
    </div>
  );
}
