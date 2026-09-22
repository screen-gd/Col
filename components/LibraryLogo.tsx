"use client";

import { useState } from "react";

interface LibraryLogoProps {
  url: string;
  name: string;
  size?: number;
  className?: string;
}

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Renders a library's real logo via Google's favicon service.
 * Falls back to a monogram tile if the fetch fails.
 */
export function LibraryLogo({
  url,
  name,
  size = 20,
  className = "",
}: LibraryLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-md bg-white/10 font-mono font-semibold text-white ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain(url)}&sz=128`}
      alt={`${name} logo`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-md object-contain ${className}`}
    />
  );
}
