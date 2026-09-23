import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Docs — Col",
  description: "Learn how to use and contribute to Col.",
};

const sections = [
  ["overview", "Overview"],
  ["find", "Find a library"],
  ["request", "Request a library"],
  ["issues", "Report issues"],
  ["pull-requests", "Open a pull request"],
] as const;

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <div className="mx-auto min-h-screen max-w-7xl px-5 pt-36 pb-28 sm:px-8 sm:pt-44">
        <div className="max-w-3xl">
          <h1 className="theme-text text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Documentation</h1>
          <p className="theme-muted mt-6 max-w-2xl text-lg leading-8">Find a library, request what is missing, or contribute an improvement to the directory.</p>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <nav aria-label="Documentation" className="theme-border border-t pt-5 lg:sticky lg:top-28 lg:h-fit">
            <ul className="space-y-3 text-sm">
              {sections.map(([id, label]) => <li key={id}><a className="theme-muted hover:underline" href={`#${id}`}>{label}</a></li>)}
            </ul>
          </nav>

          <article className="docs-copy max-w-[72ch]">
            <DocSection id="overview" title="What Col does">
              <p>Col organizes UI libraries by category, stack, and use case. It catalogs libraries rather than individual components, and every listing points back to the project’s official source.</p>
            </DocSection>

            <DocSection id="find" title="Find a library">
              <p>Search by name, keyword, category, stack, or use case. The homepage search opens the directory with your query applied, where you can refine the results and save useful entries locally.</p>
              <DocLink href="/libraries">Browse all libraries</DocLink>
            </DocSection>

            <DocSection id="request" title="Request a library">
              <p>Search the directory, existing issues, and open pull requests first. If the library is missing, include its official URL, supported stacks, category, use cases, and a short explanation of who it helps.</p>
              <DocLink href="https://github.com/screen-gd/Col/issues/new?template=library-request.yml">Open a library request</DocLink>
            </DocSection>

            <DocSection id="issues" title="Report bugs and request features">
              <p>Keep one outcome per issue. Bug reports should include the failing page or action, reproduction steps, expected and actual behavior, browser details, and supporting screenshots or console errors. Feature requests should lead with the problem and expected outcome.</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <DocLink href="https://github.com/screen-gd/Col/issues/new?template=bug-report.yml">Report a bug</DocLink>
                <DocLink href="https://github.com/screen-gd/Col/issues/new?template=feature-request.yml">Request a feature</DocLink>
              </div>
            </DocSection>

            <DocSection id="pull-requests" title="Open a pull request">
              <p>Fork the repository, create a focused branch, and keep unrelated changes out. Library additions belong in <code>data/libraries.ts</code> with a unique kebab-case slug, canonical URL, factual description, and existing taxonomy values where possible.</p>
              <pre><code>{`npm install\nnpm run dev\nnpm run check`}</code></pre>
              <p>Explain what changed, why it changed, and how you verified it. Include screenshots for visible interface changes.</p>
              <DocLink href="https://github.com/screen-gd/Col/blob/main/CONTRIBUTING.md">Read the contribution guide</DocLink>
            </DocSection>
          </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="theme-border scroll-mt-28 border-t py-10 first:border-t-0 first:pt-0"><h2 className="theme-text text-2xl font-semibold tracking-[-0.025em]">{title}</h2><div className="theme-muted mt-4 space-y-5 leading-7">{children}</div></section>;
}

function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("https://");
  return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="theme-text inline-flex items-center gap-2 font-medium underline decoration-current underline-offset-4">{children}<ArrowUpRight className="size-4" aria-hidden /></a>;
}
