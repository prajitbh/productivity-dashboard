"use client";

import { useEffect, useState } from "react";

export function ThemeScript() {
  // Runs before React hydrates, so the page never flashes the wrong theme.
  const code = `
    (function () {
      try {
        var saved = localStorage.getItem("mind-palace-theme");
        var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        if (theme === "dark") document.documentElement.classList.add("dark");
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mind-palace-theme", next ? "dark" : "light");
    setIsDark(next);
  }

  if (isDark === null) {
    // Avoid rendering the wrong icon before we know the real state.
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="h-8 w-8 rounded-full flex items-center justify-center text-paper/70 hover:text-paper hover:bg-white/10 transition-colors"
    >
      <span className="text-base leading-none">{isDark ? "☀" : "☾"}</span>
    </button>
  );
}
