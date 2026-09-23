"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { ArrowRight, Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const hints = [
  "Find UI libraries for dashboards",
  "Explore React animation tools",
  "Browse accessible interface libraries",
];

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusHash = () => {
      if (window.location.hash === "#hero-search") inputRef.current?.focus();
    };
    focusHash();
    window.addEventListener("hashchange", focusHash);
    const handleShortcut = (event: KeyboardEvent) => {
      const isTyping = event.target instanceof HTMLElement && (
        event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
      );
      const slashShortcut = event.key === "/" && !isTyping;
      const commandShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!slashShortcut && !commandShortcut) return;
      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("hashchange", focusHash);
    };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      id="hero-search"
      role="search"
      action="/libraries"
      method="get"
      onSubmit={submit}
      className="hero-search relative flex h-14 w-full max-w-[44rem] items-center gap-3 rounded-xl border px-4"
    >
      <Search className="hero-search-icon size-4 shrink-0" aria-hidden />
      <div className="hero-search-hints" aria-hidden="true">
        {hints.map((hint) => <span key={hint} className="hero-search-hint">{hint}</span>)}
      </div>
      <input
        ref={inputRef}
        type="search"
        name="q"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") event.currentTarget.blur();
        }}
        placeholder="Search libraries, stacks, or use cases…"
        aria-label="Search UI libraries"
        className="hero-search-input h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-transparent focus:placeholder:text-white/45 [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="hero-search-shortcut hidden shrink-0 rounded-md border px-2 py-1 font-mono text-[10px] tracking-wide sm:block">Ctrl/⌘ K</kbd>
      <button type="submit" className="hero-search-submit grid size-9 shrink-0 place-items-center rounded-lg" aria-label="Search libraries">
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </form>
  );
}
