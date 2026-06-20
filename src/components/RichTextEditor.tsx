"use client";

import { useEffect, useRef } from "react";

const buttons: { cmd: string; label: string; arg?: string }[] = [
  { cmd: "bold", label: "B" },
  { cmd: "italic", label: "I" },
  { cmd: "underline", label: "U" },
  { cmd: "insertUnorderedList", label: "•" },
  { cmd: "insertOrderedList", label: "1." },
  { cmd: "formatBlock", label: "H", arg: "h3" },
];

export default function RichTextEditor({
  defaultHtml,
  onChangeHtml,
  placeholder,
  minHeight = 80,
  autoFocus,
}: {
  defaultHtml: string;
  onChangeHtml: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set the starting content exactly once, on mount. Re-applying it on every
  // render (e.g. via dangerouslySetInnerHTML tied to React state) would wipe
  // out live typing and reset the cursor on every keystroke, since the parent
  // re-renders in response to onInput firing.
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = defaultHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChangeHtml(ref.current.innerHTML);
  }

  return (
    <div className="border border-paper-line rounded-md bg-paper">
      <div className="flex items-center gap-1 border-b border-paper-line px-2 py-1">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec(b.cmd, b.arg);
            }}
            className="h-6 w-6 rounded text-xs font-mono text-ink-soft hover:bg-paper-line flex items-center justify-center"
            title={b.cmd}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        autoFocus={autoFocus}
        data-placeholder={placeholder}
        onInput={(e) => onChangeHtml((e.target as HTMLDivElement).innerHTML)}
        className="rich-text-area px-3 py-2 text-sm text-ink outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
