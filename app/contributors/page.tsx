import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { getContributors } from "@/lib/github-contributors";

export const metadata: Metadata = {
  title: "Contributors — Col",
  description: "Meet the people contributing to Col.",
};

export default async function ContributorsPage() {
  const contributors = await getContributors();

  return (
    <>
      <Header />
      <main className="contributors-page w-full max-w-full overflow-x-hidden">
        <div className="mx-auto min-h-screen max-w-7xl px-5 pt-36 pb-28 sm:px-8 sm:pt-44">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="theme-text text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Built by people.</h1>
            <p className="theme-muted mt-6 max-w-2xl text-lg leading-8">The contributors keeping Col useful, accurate, and open.</p>
          </div>
          <a href="https://github.com/screen-gd/Col/graphs/contributors" target="_blank" rel="noopener noreferrer" className="theme-text inline-flex items-center gap-2 text-sm font-medium">View on GitHub <ArrowUpRight className="size-4" aria-hidden /></a>
        </div>

        {contributors.length ? (
          <ul className={`theme-border mt-20 grid grid-cols-2 border-t ${contributors.length > 2 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
            {contributors.map((contributor) => (
              <li key={contributor.id} className="theme-border border-b p-4 sm:p-6 lg:border-r">
                <a href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`View ${contributor.login} on GitHub`}>
                  <img src={contributor.avatar_url} alt="" width="240" height="240" loading="lazy" className="aspect-square w-full bg-neutral-900 object-cover" />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div><p className="theme-text font-medium">{contributor.login}</p><p className="theme-muted mt-1 text-xs tabular-nums">{contributor.contributions} {contributor.contributions === 1 ? "contribution" : "contributions"}</p></div>
                    <ArrowUpRight className="theme-muted mt-1 size-4 shrink-0" aria-hidden />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="theme-border mt-20 border-y py-16">
            <p className="theme-text text-xl font-medium">Contributors could not be loaded right now.</p>
            <a href="https://github.com/screen-gd/Col/graphs/contributors" target="_blank" rel="noopener noreferrer" className="theme-muted mt-3 inline-flex items-center gap-2 text-sm">View the contributor graph on GitHub <ArrowUpRight className="size-4" aria-hidden /></a>
          </div>
        )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
