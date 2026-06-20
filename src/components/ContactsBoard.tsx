"use client";

import { useMemo, useState } from "react";
import { Contact } from "@/db/schema";
import ContactCard from "./ContactCard";
import { INDUSTRIES, POSITIONS, LOCATION_TYPES } from "@/lib/contact-options";

type SortKey = "recent" | "least_recent";

export default function ContactsBoard({ contacts }: { contacts: Contact[] }) {
  const [industry, setIndustry] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    let rows = contacts.filter((c) => {
      if (industry && c.industry !== industry) return false;
      if (position && c.position !== position) return false;
      if (location && c.locationType !== location) return false;
      return true;
    });

    rows = [...rows].sort((a, b) => {
      const aDate = a.lastContactedDate ? new Date(a.lastContactedDate).getTime() : -Infinity;
      const bDate = b.lastContactedDate ? new Date(b.lastContactedDate).getTime() : -Infinity;
      return sort === "recent" ? bDate - aDate : aDate - bDate;
    });

    return rows;
  }, [contacts, industry, position, location, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft">
          <option value="">all industries</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft">
          <option value="">all positions</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft">
          <option value="">in & out of state</option>
          {LOCATION_TYPES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <div className="flex-1" />
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft">
          <option value="recent">most recently contacted</option>
          <option value="least_recent">least recently contacted</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-faint py-6">No contacts match these filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>
      )}
    </div>
  );
}
