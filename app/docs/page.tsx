import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs — Col",
  description: "Learn how to use and contribute to Col.",
};

export default function DocsPage() {
  return (
    <article>
      <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Introduction</h1>
      <p className="theme-text mt-6 text-lg leading-8">Col is an open-source directory for discovering UI libraries by category, stack, and use case.</p>
      <p className="theme-muted mt-4 text-lg leading-8">Find a library, narrow the results, then visit its official project page. You can save useful entries locally and request anything missing.</p>

      <div className="docs-steps mt-9 overflow-hidden rounded-xl border">
        <div className="grid sm:grid-cols-3">
          <div className="docs-step p-5">
            <div className="docs-accent flex items-center justify-between text-xs font-semibold"><span>01</span><Search className="size-4" aria-hidden /></div>
            <h2 className="theme-text mt-6 font-semibold">Search the directory</h2>
            <p className="theme-muted mt-2 text-sm leading-6">Find libraries by name, keyword, category, or use case.</p>
          </div>
          <div className="docs-step p-5">
            <div className="docs-accent flex items-center justify-between text-xs font-semibold"><span>02</span><SlidersHorizontal className="size-4" aria-hidden /></div>
            <h2 className="theme-text mt-6 font-semibold">Refine your results</h2>
            <p className="theme-muted mt-2 text-sm leading-6">Filter by stack and compare the options that fit.</p>
          </div>
          <div className="docs-step p-5">
            <div className="docs-accent flex items-center justify-between text-xs font-semibold"><span>03</span><ArrowUpRight className="size-4" aria-hidden /></div>
            <h2 className="theme-text mt-6 font-semibold">Visit the source</h2>
            <p className="theme-muted mt-2 text-sm leading-6">Every listing points to the library’s official website.</p>
          </div>
        </div>
        <div className="theme-border flex flex-wrap items-center gap-5 border-t px-5 py-4">
          <a className="docs-rail-cta inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold" href="/libraries">Browse libraries <ArrowRight className="size-4" aria-hidden /></a>
          <a className="docs-text-link theme-muted text-sm" href="/docs/find-a-library">Read the search guide</a>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="theme-text text-2xl font-semibold tracking-[-0.025em]">What Col does</h2>
        <p className="theme-muted mt-4 leading-7">Col catalogs libraries rather than individual components. Each listing has a category, supported stacks, and use cases so you can decide where to look next without opening dozens of tabs.</p>
        <ul className="theme-muted mt-5 list-disc space-y-3 pl-5 leading-7 marker:text-cyan-400">
          <li>Explore libraries across the directory’s categories.</li>
          <li>Save entries in your browser for later.</li>
          <li>Request a library or contribute an improvement on GitHub.</li>
        </ul>
      </section>
    </article>
  );
}
