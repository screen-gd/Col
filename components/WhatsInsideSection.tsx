import { ArrowUpRight, BookOpen, Layers3, Search } from "lucide-react";
import type { ReactNode } from "react";
import { LibraryLogo } from "@/components/LibraryLogo";
import { CATEGORIES, STACKS, libraries } from "@/data/libraries";

const featuredLibraries = ["21st-dev", "react-bits", "shadcn-ui"]
  .map((slug) => libraries.find((library) => library.slug === slug))
  .filter((library) => library !== undefined);
const detailLibrary = libraries.find((library) => library.slug === "shadcn-ui");

const cardClass = "theme-border theme-panel overflow-hidden rounded-2xl border p-1";
const previewClass = "theme-border theme-control flex h-40 items-center overflow-hidden rounded-xl border p-4 sm:h-44";
const chipClass = "theme-border theme-text inline-flex items-center rounded-md border px-2.5 py-1 text-[11px]";

function FeatureCard({
  title,
  description,
  preview,
  className = "",
}: {
  title: string;
  description: string;
  preview: ReactNode;
  className?: string;
}) {
  return (
    <article className={`${cardClass} ${className}`}>
      <div aria-hidden="true" className={`${previewClass} px-4 sm:px-5`}>
        {preview}
      </div>
      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <h3 className="theme-text text-base font-semibold tracking-[-0.02em]">{title}</h3>
        <p className="theme-muted mt-1.5 text-sm leading-5">{description}</p>
      </div>
    </article>
  );
}

export function WhatsInsideSection() {
  return (
    <section aria-labelledby="whats-inside-title" className="theme-border border-t px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 id="whats-inside-title" className="theme-text mb-8 text-4xl font-semibold tracking-[-0.04em] sm:mb-10 sm:text-5xl">
          What&apos;s inside
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
          <FeatureCard
            title={`${libraries.length} curated libraries`}
            description="Browse a focused index of UI libraries, animation tools, icon sets, and more."
            className="xl:col-span-5"
            preview={
              <div className="w-full">
                {featuredLibraries.map((library) => (
                  <div key={library.slug} className="theme-border flex items-center gap-3 border-b py-2.5 last:border-0 first:pt-0 last:pb-0">
                    <LibraryLogo url={library.url} name={library.name} size={24} />
                    <span className="theme-text min-w-0 flex-1 truncate text-sm font-medium">{library.name}</span>
                    <span className="theme-muted hidden text-xs sm:inline">{library.category}</span>
                    <ArrowUpRight className="theme-muted size-4 shrink-0" aria-hidden />
                  </div>
                ))}
              </div>
            }
          />

          <FeatureCard
            title="Search by what you need"
            description="Search names, descriptions, stacks, tags, and use cases together."
            className="xl:col-span-3"
            preview={
              <div className="w-full">
                <div className="theme-border theme-control flex h-11 items-center gap-3 rounded-lg border px-3">
                  <Search className="theme-muted size-4 shrink-0" aria-hidden />
                  <span className="theme-muted truncate text-sm">dashboard accessibility</span>
                  <kbd className="theme-border theme-muted ml-auto rounded border px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Dashboards", "Accessibility-first"].map((label) => <span key={label} className={chipClass}>{label}</span>)}
                </div>
              </div>
            }
          />

          <FeatureCard
            title={`${CATEGORIES.length} clear categories`}
            description="Move from components to motion, icons, data visualization, and more."
            className="xl:col-span-4"
            preview={
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
                {CATEGORIES.map((category, index) => (
                  <div key={category} className="theme-muted flex min-w-0 items-center gap-2 text-xs">
                    {index === 0 ? <BookOpen className="size-4 shrink-0" aria-hidden /> : <Layers3 className="size-4 shrink-0" aria-hidden />}
                    <span className="truncate">{category}</span>
                  </div>
                ))}
              </div>
            }
          />

          <FeatureCard
            title="Filter by your stack"
            description="Narrow the directory by framework, language, styling, or use case."
            className="xl:col-span-4"
            preview={
              <div className="w-full">
                <div className="theme-muted mb-3 flex items-center gap-2 text-xs">
                  <Layers3 className="size-4" aria-hidden />
                  Technology stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {STACKS.slice(0, 5).map((stack, index) => (
                    <span key={stack} className={`${chipClass} ${index === 0 ? "border-blue-400/40 bg-blue-500/10" : ""}`}>{stack}</span>
                  ))}
                </div>
              </div>
            }
          />

          <FeatureCard
            title="Know what each library supports"
            description="Check its category, supported stacks, and common use cases before you open it."
            className="xl:col-span-5"
            preview={
              detailLibrary ? (
                <div className="w-full">
                  <div className="flex items-center gap-3">
                    <LibraryLogo url={detailLibrary.url} name={detailLibrary.name} size={28} />
                    <div className="min-w-0">
                      <p className="theme-text truncate text-sm font-medium">{detailLibrary.name}</p>
                      <p className="theme-muted truncate text-xs">{detailLibrary.category}</p>
                    </div>
                  </div>
                  <div className="theme-border my-3 border-t" />
                  <div className="flex flex-wrap gap-2">
                    {[...detailLibrary.stacks, ...detailLibrary.useCases.slice(0, 1)].map((value) => (
                      <span key={value} className={chipClass}>{value}</span>
                    ))}
                  </div>
                </div>
              ) : null
            }
          />

          <FeatureCard
            title="Go straight to the source"
            description="Every listing links to its official project site or documentation."
            className="xl:col-span-3"
            preview={
              detailLibrary ? (
                <div className="theme-border theme-control flex w-full items-center gap-3 rounded-lg border p-3">
                  <LibraryLogo url={detailLibrary.url} name={detailLibrary.name} size={28} />
                  <span className="min-w-0 flex-1">
                    <span className="theme-text block text-sm font-medium">{detailLibrary.name}</span>
                    <span className="theme-muted block truncate text-xs">{new URL(detailLibrary.url).hostname}</span>
                  </span>
                  <ArrowUpRight className="theme-muted size-4 shrink-0" aria-hidden />
                </div>
              ) : null
            }
          />
        </div>
      </div>
    </section>
  );
}
