"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ThemeToggle } from "./ThemeToggle";

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const links = [
  ["Libraries", "/libraries"],
  ["Docs", "/docs"],
  ["Sponsors", "/#sponsors"],
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const linksRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/") return;
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.key !== "/" || event.altKey || event.ctrlKey || event.metaKey ||
        (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)))) return;
      event.preventDefault();
      window.location.assign("/#hero-search");
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [pathname]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/screen-gd/Col", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((repository: { stargazers_count?: number }) => {
        if (typeof repository.stargazers_count === "number") setStars(repository.stargazers_count);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const positionHighlight = useCallback((link: HTMLAnchorElement | null) => {
    const container = linksRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight || !link) return;

    const linkRect = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    highlight.style.width = `${linkRect.width}px`;
    highlight.style.height = `${linkRect.height}px`;
    highlight.style.transform = `translateX(${linkRect.left - containerRect.left}px)`;
    highlight.style.opacity = "1";
  }, []);

  const getActiveLink = useCallback(
    () => linksRef.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]') ?? null,
    [],
  );

  const restoreActiveHighlight = useCallback(() => {
    const activeLink = getActiveLink();
    if (activeLink) positionHighlight(activeLink);
    else if (highlightRef.current) highlightRef.current.style.opacity = "0";
  }, [getActiveLink, positionHighlight]);

  useEffect(() => {
    const frame = requestAnimationFrame(restoreActiveHighlight);
    window.addEventListener("resize", restoreActiveHighlight);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", restoreActiveHighlight);
    };
  }, [pathname, restoreActiveHighlight]);

  const landing = pathname === "/";
  const headerClass = `site-header${landing ? "" : " site-header--docs"}${scrolled ? " site-header--scrolled" : ""}`;

  return (
    <header className={headerClass}>
      <div className="site-header-inner">
        <div className="site-header-left">
          <a href="/" aria-label="Col, Collection of Libraries" className="site-header-brand">
            <Image src="/brand/col-mark.png" alt="" width={24} height={24} className="brand-mark" priority />
            <span>Col</span>
          </a>
          <span className="site-header-divider" aria-hidden="true">/</span>
          <nav
            ref={linksRef}
            aria-label="Primary"
            className="site-header-links"
            onMouseLeave={restoreActiveHighlight}
            onBlur={(event) => {
              if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
                restoreActiveHighlight();
              }
            }}
          >
            <span ref={highlightRef} className="site-header-link-highlight" aria-hidden="true" />
            {links.map(([label, href]) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="site-header-link"
                  onMouseEnter={(event) => positionHighlight(event.currentTarget)}
                  onFocus={(event) => positionHighlight(event.currentTarget)}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="site-header-actions">
          {!landing && (
            <a href="/#hero-search" className="site-header-search" aria-label="Search libraries">
              <Search size={14} aria-hidden="true" />
              <span>Search...</span>
              <kbd>/</kbd>
            </a>
          )}
          <ThemeToggle />
          <a href="https://github.com/screen-gd/Col" target="_blank" rel="noopener noreferrer" className="site-header-github" aria-label={`Col on GitHub${stars === null ? "" : `, ${stars} stars`}`}>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
            <span>{stars === null ? "..." : compactNumber.format(stars)}</span>
          </a>
          <RainbowButton
            asChild
            className="h-9 rounded-[10px] px-[19px] text-xs text-white! dark:text-black! max-[760px]:h-[34px] max-[760px]:rounded-[9px] max-[760px]:px-3"
          >
            <a href="https://github.com/screen-gd/Col/issues/new" target="_blank" rel="noopener noreferrer">Submit</a>
          </RainbowButton>
          <button
            type="button"
            className="site-header-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-header-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="site-header-mobile-menu" aria-label="Mobile primary" className="site-header-mobile-menu">
            {links.map(([label, href]) => <a key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</a>)}
            <a href="/#hero-search">Search libraries</a>
          </nav>
        )}
      </div>
    </header>
  );
}
