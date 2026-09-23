import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Open a pull request — Col" };

export default function PullRequestsPage() {
  return (
    <article>
      <h1 className="theme-text text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Open a pull request</h1>
      <p className="theme-text mt-6 text-lg leading-8">Contributions to the directory are reviewed on GitHub.</p>
      <div className="theme-muted mt-8 space-y-5 leading-7">
        <p>Fork the repository, create a focused branch, and keep unrelated changes out. Library additions belong in <code>data/libraries.ts</code> with a unique kebab-case slug, canonical URL, factual description, and existing taxonomy values where possible.</p>
        <h2 className="theme-text pt-4 text-2xl font-semibold">Check your changes</h2>
        <pre><code>{`npm install\nnpm run dev\nnpm run build`}</code></pre>
        <p>Explain what changed, why it changed, and how you verified it. Include screenshots for visible interface changes.</p>
      </div>
      <a className="docs-rail-cta mt-8 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold" href="https://github.com/screen-gd/Col/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Read the contribution guide <ArrowUpRight className="size-4" aria-hidden /></a>
    </article>
  );
}
