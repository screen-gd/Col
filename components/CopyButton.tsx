"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyStatus = "idle" | "copied" | "failed";

interface CopyButtonProps {
  text: string;
  /** Button label shown while idle. */
  label?: string;
  /** Accessible name, when the visible label alone does not identify the control. */
  ariaLabel?: string;
}

/**
 * One-click clipboard copy with polite screen-reader feedback.
 * The button stays usable when the clipboard is unavailable so the text can
 * still be selected and copied manually.
 */
export function CopyButton({ text, label = "Copy", ariaLabel }: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 2400);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className="library-chip theme-border inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold whitespace-nowrap transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {status === "copied" ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : ""}
      </span>
    </>
  );
}
