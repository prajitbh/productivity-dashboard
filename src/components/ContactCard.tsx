"use client";

import { useState, useTransition } from "react";
import { Contact } from "@/db/schema";
import { deleteContact, touchLastContacted, updateContact } from "@/app/actions/contacts";
import { INDUSTRIES, POSITIONS, LOCATION_TYPES } from "@/lib/contact-options";

function daysAgo(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const diff = Math.round((Date.now() - d.getTime()) / 86400000);
  return diff;
}

export default function ContactCard({ contact }: { contact: Contact }) {
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();
  const ago = daysAgo(contact.lastContactedDate);
  const locationLabel = LOCATION_TYPES.find((l) => l.value === contact.locationType)?.label;

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await updateContact(contact.id, formData);
          setEditing(false);
        }}
        className="border border-paper-line rounded-md bg-paper-raised p-4 space-y-2"
      >
        <input
          name="name"
          defaultValue={contact.name}
          className="w-full bg-transparent font-display text-lg outline-none"
        />
        <input
          name="linkedinUrl"
          defaultValue={contact.linkedinUrl ?? ""}
          placeholder="LinkedIn URL"
          className="w-full bg-paper border border-paper-line rounded px-2 py-1.5 text-sm outline-none"
        />
        <textarea
          name="description"
          defaultValue={contact.description ?? ""}
          rows={2}
          className="w-full bg-paper border border-paper-line rounded px-2 py-1.5 text-sm outline-none"
        />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input name="company" defaultValue={contact.company ?? ""} placeholder="Company" className="bg-paper border border-paper-line rounded px-2 py-1.5" />
          <input name="howMet" defaultValue={contact.howMet ?? ""} placeholder="How you met" className="bg-paper border border-paper-line rounded px-2 py-1.5" />
          <select name="industry" defaultValue={contact.industry ?? ""} className="bg-paper border border-paper-line rounded px-2 py-1.5">
            <option value="">industry…</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select name="position" defaultValue={contact.position ?? ""} className="bg-paper border border-paper-line rounded px-2 py-1.5">
            <option value="">position…</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select name="locationType" defaultValue={contact.locationType ?? ""} className="bg-paper border border-paper-line rounded px-2 py-1.5">
            <option value="">location…</option>
            {LOCATION_TYPES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
          <input type="date" name="lastContactedDate" defaultValue={contact.lastContactedDate ?? ""} className="bg-paper border border-paper-line rounded px-2 py-1.5" />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(false)} className="text-xs font-mono text-ink-soft px-3 py-1.5">Cancel</button>
          <button type="submit" className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90">Save</button>
        </div>
      </form>
    );
  }

  return (
    <div className="group border border-paper-line rounded-md bg-paper-raised p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg text-ink cursor-text" onClick={() => setEditing(true)}>
            {contact.name}
          </h3>
          {contact.company && <p className="text-xs text-ink-soft">{contact.company}</p>}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-amber hover:underline"
            >
              LinkedIn ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => startTransition(() => deleteContact(contact.id))}
            className="text-ink-faint hover:text-brick text-xs"
            aria-label="Delete contact"
          >
            ✕
          </button>
        </div>
      </div>

      {contact.description && <p className="text-sm text-ink-soft mt-2">{contact.description}</p>}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {contact.industry && <span className="text-[10px] font-mono bg-sage-soft text-ink px-2 py-0.5 rounded-full">{contact.industry}</span>}
        {contact.position && <span className="text-[10px] font-mono bg-amber-soft text-ink px-2 py-0.5 rounded-full">{contact.position}</span>}
        {locationLabel && <span className="text-[10px] font-mono bg-brick-soft text-ink px-2 py-0.5 rounded-full">{locationLabel}</span>}
        {contact.howMet && <span className="text-[10px] font-mono bg-paper-line text-ink-soft px-2 py-0.5 rounded-full">met: {contact.howMet}</span>}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="font-mono text-[11px] text-ink-faint">
          {ago === null ? "never contacted" : ago === 0 ? "contacted today" : `contacted ${ago}d ago`}
        </span>
        <button
          type="button"
          onClick={() => startTransition(() => touchLastContacted(contact.id))}
          className="text-[11px] font-mono text-ink-soft hover:text-amber"
        >
          mark contacted today
        </button>
      </div>
    </div>
  );
}
