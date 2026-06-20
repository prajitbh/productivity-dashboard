"use client";

import { useRef, useState } from "react";
import { createMediaEntry } from "@/app/actions/media";

export default function MediaForm({ defaultType }: { defaultType: "movie" | "show" }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        setSubmitting(true);
        await createMediaEntry(fd);
        formRef.current?.reset();
        setSubmitting(false);
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="mediaType" value={defaultType} />
      <input
        name="title"
        required
        placeholder={`Type a ${defaultType} title…`}
        className="flex-1 bg-paper border border-paper-line rounded px-3 py-2 text-sm placeholder:text-ink-faint outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-paper rounded px-3 py-2 text-xs font-medium hover:bg-ink/90 disabled:opacity-50 whitespace-nowrap"
      >
        {submitting ? "fetching poster…" : "Add"}
      </button>
    </form>
  );
}
