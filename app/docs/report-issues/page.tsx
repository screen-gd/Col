import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Report issues — Col" };

export default function ReportIssuesPage() {
  return (
    <article>
      <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Report issues</h1>
      <p className="theme-text mt-6 text-lg leading-8">Found something broken or have an idea for Col? Open a focused issue so it can be reproduced and discussed.</p>
      <p className="theme-muted mt-4 text-lg leading-8">Search existing issues first. Keep one problem or requested outcome per issue.</p>

      <section className="theme-border mt-12 border-t pt-8">
        <h2 className="theme-text text-2xl font-semibold">Report a bug</h2>
        <p className="theme-muted mt-3 leading-7">Include the page or action that failed, steps to reproduce it, what you expected, and what happened instead. Browser details, screenshots, or console errors help when the problem is visual or intermittent.</p>
        <a className="docs-rail-cta mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold" href="https://github.com/screen-gd/Col/issues/new?template=bug-report.yml" target="_blank" rel="noopener noreferrer">Report a bug <ArrowUpRight className="size-4" aria-hidden /></a>
      </section>

      <section className="theme-border mt-10 border-t pt-8">
        <h2 className="theme-text text-2xl font-semibold">Request a feature</h2>
        <p className="theme-muted mt-3 leading-7">Lead with the problem you are trying to solve and the result you expect. A short example of how you would use it is more helpful than a long list of possible settings.</p>
        <a className="docs-rail-link mt-5 inline-flex items-center gap-2 font-medium" href="https://github.com/screen-gd/Col/issues/new?template=feature-request.yml" target="_blank" rel="noopener noreferrer">Request a feature <ArrowUpRight className="size-4" aria-hidden /></a>
      </section>

      <div className="theme-border mt-12 border-t pt-6">
        <a className="docs-rail-link inline-flex items-center gap-2 text-sm font-medium" href="/docs/pull-requests">Next: Open a pull request <ArrowUpRight className="size-4" aria-hidden /></a>
      </div>
    </article>
  );
}
