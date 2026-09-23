import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Find a library — Col" };

export default function FindLibraryPage() {
  return (
    <article>
      <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Find a library</h1>
      <p className="theme-text mt-6 text-lg leading-8">Use the directory to move from a broad idea to a short list of relevant UI libraries.</p>
      <div className="mt-10 space-y-8">
        <section className="theme-border border-t pt-7">
          <h2 className="theme-text text-2xl font-semibold">Search</h2>
          <p className="theme-muted mt-3 leading-7">Search by name, keyword, category, stack, or use case. A homepage search opens the directory with your query already applied.</p>
        </section>
        <section className="theme-border border-t pt-7">
          <h2 className="theme-text text-2xl font-semibold">Filter and compare</h2>
          <p className="theme-muted mt-3 leading-7">Narrow results by category, supported stack, and use case. Open a listing to visit the project’s official site and check its documentation.</p>
        </section>
        <section className="theme-border border-t pt-7">
          <h2 className="theme-text text-2xl font-semibold">Save for later</h2>
          <p className="theme-muted mt-3 leading-7">Save useful entries locally in your browser and return to them from the directory.</p>
        </section>
      </div>
      <a className="docs-rail-cta mt-8 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold" href="/libraries">Browse all libraries <ArrowUpRight className="size-4" aria-hidden /></a>
      <div className="theme-border mt-12 border-t pt-6"><a className="docs-rail-link inline-flex items-center gap-2 text-sm font-medium" href="/docs/request-a-library">Next: Request a library <ArrowUpRight className="size-4" aria-hidden /></a></div>
    </article>
  );
}
