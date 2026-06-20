"use client";

import { useRef, useState } from "react";
import { createContact } from "@/app/actions/contacts";
import { INDUSTRIES, POSITIONS, LOCATION_TYPES } from "@/lib/contact-options";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createContact(formData);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="border border-paper-line rounded-md bg-paper-raised p-3"
    >
      <input
        name="name"
        placeholder="Add a contact's name…"
        onFocus={() => setExpanded(true)}
        required
        className="w-full bg-transparent text-sm placeholder:text-ink-faint outline-none"
      />
      {expanded && (
        <div className="mt-3 space-y-2">
          <input
            name="linkedinUrl"
            placeholder="Paste their LinkedIn URL…"
            type="url"
            className="w-full bg-paper border border-paper-line rounded px-2 py-1.5 text-sm placeholder:text-ink-faint outline-none"
          />
          <textarea
            name="description"
            placeholder="Describe them — how you know them, what stood out…"
            rows={2}
            className="w-full bg-paper border border-paper-line rounded px-2 py-1.5 text-sm placeholder:text-ink-faint outline-none"
          />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <input
              name="company"
              placeholder="Company"
              className="bg-paper border border-paper-line rounded px-2 py-1.5 placeholder:text-ink-faint outline-none"
            />
            <input
              name="howMet"
              placeholder="How you met"
              className="bg-paper border border-paper-line rounded px-2 py-1.5 placeholder:text-ink-faint outline-none"
            />
            <select
              name="industry"
              defaultValue=""
              className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft"
            >
              <option value="">industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <select
              name="position"
              defaultValue=""
              className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft"
            >
              <option value="">position…</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              name="locationType"
              defaultValue=""
              className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft"
            >
              <option value="">location…</option>
              {LOCATION_TYPES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <label className="font-mono text-ink-faint">last contacted</label>
              <input
                type="date"
                name="lastContactedDate"
                className="bg-paper border border-paper-line rounded px-2 py-1.5 font-mono text-ink-soft flex-1"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-ink text-paper rounded px-3 py-1.5 text-xs font-medium hover:bg-ink/90"
            >
              Add contact
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
