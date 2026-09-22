"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GitFork, Search, Star } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.github.com/repos/screen-gd/Col", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((repository: { stargazers_count?: number }) => {
        if (typeof repository.stargazers_count === "number") {
          setStars(repository.stargazers_count);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <header
      className={`site-header fixed left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 border transition-[top,max-width,background-color,border-color,box-shadow,border-radius,backdrop-filter] duration-500 ease-[cubic-bezier(.16,1,.3,1)] sm:w-[calc(100%-4rem)] ${
        scrolled
          ? "site-header-scrolled top-3 max-w-6xl rounded-2xl border-white/10 bg-black/90 backdrop-blur-xl"
          : "top-2 max-w-[1450px] rounded-none border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="/"
          aria-label="Col — Collection of Libraries"
          title="Collection of Libraries"
          className="flex items-center gap-2.5 text-white"
        >
          <Image src="/brand/col-mark.png" alt="" width={28} height={28} className="brand-mark size-7 object-contain" priority />
          <span className="brand-wordmark text-base font-bold tracking-[-0.03em]">Col</span>
        </a>
        <a href="/libraries" className="absolute left-1/2 hidden -translate-x-1/2 text-sm text-white lg:block">
          Libraries
        </a>
        <nav className="flex items-center gap-5">
          <ThemeToggle />
          <a href="/#hero-search" aria-label="Search libraries" className="hidden text-white sm:block">
            <Search className="size-4" aria-hidden />
          </a>
          <a
            href="https://github.com/screen-gd/Col/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-white md:block"
          >
            Submit
          </a>
          <a
            href="https://github.com/screen-gd/Col"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contribute on GitHub${stars === null ? "" : `, ${stars} stars`}`}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:border-white/30"
          >
            <GitFork className="size-4" aria-hidden />
            <span>Contribute</span>
            <span className="h-4 w-px bg-white/15" aria-hidden />
            <span className="flex items-center gap-1.5 font-medium tabular-nums">
              <Star className="size-3.5" aria-hidden />
              {stars === null ? "—" : compactNumber.format(stars)}
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
