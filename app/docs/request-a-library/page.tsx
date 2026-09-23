import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Request a library — Col" };

export default function RequestLibraryPage() {
  return (
    <article>
      <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Request a library</h1>
      <p className="theme-text mt-6 text-lg leading-8">If a useful UI library is missing, send a request with enough detail for it to be reviewed.</p>
      <section className="theme-border mt-10 border-t pt-7">
        <h2 className="theme-text text-2xl font-semibold">Before you request</h2>
        <p className="theme-muted mt-3 leading-7">Search the directory, existing issues, and open pull requests to avoid duplicates.</p>
      </section>
      <section className="theme-border mt-8 border-t pt-7">
        <h2 className="theme-text text-2xl font-semibold">What to include</h2>
        <ul className="theme-muted mt-3 list-disc space-y-2 pl-5 leading-7 marker:text-cyan-400">
          <li>The library’s name and official URL.</li>
          <li>Supported stacks, category, and common use cases.</li>
          <li>A short explanation of who it helps.</li>
        </ul>
      </section>
      <a className="docs-rail-cta mt-8 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold" href="https://github.com/screen-gd/Col/issues/new?template=library-request.yml" target="_blank" rel="noopener noreferrer">Open a library request <ArrowUpRight className="size-4" aria-hidden /></a>
      <div className="theme-border mt-12 border-t pt-6"><a className="docs-rail-link inline-flex items-center gap-2 text-sm font-medium" href="/docs/report-issues">Next: Report issues <ArrowUpRight className="size-4" aria-hidden /></a></div>
    </article>
  );
}
