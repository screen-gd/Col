"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

const getStarted = [
  ["/docs", "Overview"],
  ["/docs/find-a-library", "Find a library"],
] as const;

const contribute = [
  ["/docs/request-a-library", "Request a library"],
  ["/docs/report-issues", "Report issues"],
  ["/docs/pull-requests", "Open a pull request"],
] as const;

export function DocsSidebar() {
  const pathname = usePathname();
  const linksRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const pendingLinkRef = useRef<HTMLAnchorElement>(null);

  const positionHighlight = useCallback((link: HTMLAnchorElement | null) => {
    const container = linksRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight || !link) return;

    const linkRect = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    highlight.style.width = `${linkRect.width}px`;
    highlight.style.height = `${linkRect.height}px`;
    highlight.style.transform = `translate(${linkRect.left - containerRect.left}px, ${linkRect.top - containerRect.top}px)`;
    highlight.style.opacity = "1";
  }, []);

  const restoreActiveHighlight = useCallback(() => {
    if (pendingLinkRef.current && linksRef.current?.contains(pendingLinkRef.current)) {
      positionHighlight(pendingLinkRef.current);
      return;
    }
    const activeLink = linksRef.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]');
    if (activeLink) positionHighlight(activeLink);
    else if (highlightRef.current) highlightRef.current.style.opacity = "0";
  }, [positionHighlight]);

  useEffect(() => {
    pendingLinkRef.current = null;
    let readyFrame = 0;
    const frame = requestAnimationFrame(() => {
      restoreActiveHighlight();
      readyFrame = requestAnimationFrame(() => {
        if (highlightRef.current) highlightRef.current.dataset.ready = "true";
      });
    });
    window.addEventListener("resize", restoreActiveHighlight);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(readyFrame);
      window.removeEventListener("resize", restoreActiveHighlight);
    };
  }, [pathname, restoreActiveHighlight]);

  return (
    <nav aria-label="Documentation pages" className="docs-sidebar rounded-xl border p-4">
      <a href="/libraries#library-search" className="docs-sidebar-search mb-6 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
        <Search className="size-4" aria-hidden /> Search libraries
      </a>
      <div
        ref={linksRef}
        className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-1"
        onMouseLeave={restoreActiveHighlight}
        onBlur={(event) => {
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) restoreActiveHighlight();
        }}
      >
        <span ref={highlightRef} className="docs-sidebar-link-highlight" aria-hidden="true" />
        <div>
          <p className="docs-sidebar-heading mb-2 px-3 text-xs font-semibold">Get started</p>
          <ul className="space-y-0.5 text-sm">
            {getStarted.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} className="docs-sidebar-link relative z-10 block rounded-md px-3 py-2" onMouseEnter={(event) => positionHighlight(event.currentTarget)} onFocus={(event) => positionHighlight(event.currentTarget)} onClick={(event) => { pendingLinkRef.current = event.currentTarget; positionHighlight(event.currentTarget); }}>{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="docs-sidebar-heading mb-2 px-3 text-xs font-semibold">Contribute</p>
          <ul className="space-y-0.5 text-sm">
            {contribute.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname === href ? "page" : undefined} className="docs-sidebar-link relative z-10 block rounded-md px-3 py-2" onMouseEnter={(event) => positionHighlight(event.currentTarget)} onFocus={(event) => positionHighlight(event.currentTarget)} onClick={(event) => { pendingLinkRef.current = event.currentTarget; positionHighlight(event.currentTarget); }}>{label}</Link></li>)}
          </ul>
        </div>
      </div>
    </nav>
  );
}
