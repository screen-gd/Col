import { ArrowUpRight, BookOpen, Layers3, Search } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { LibraryLogo } from "@/components/LibraryLogo";
import { CATEGORIES, STACKS, libraries } from "@/data/libraries";

const featuredLibraries = ["21st-dev", "react-bits", "shadcn-ui"]
  .map((slug) => libraries.find((library) => library.slug === slug))
  .filter((library) => library !== undefined);
const sourceLibrary = libraries.find((library) => library.slug === "shadcn-ui");

const features = [
  {
    Icon: BookOpen,
    name: `${libraries.length} curated libraries`,
    description: "Find UI libraries, animation tools, icon sets, and more in one place.",
    href: "/libraries",
    cta: "Browse libraries",
    className: "lg:col-span-1",
    background: (
      <div className="bento-preview absolute inset-x-4 top-4 rounded-lg border p-3">
        {featuredLibraries.map((library) => (
          <div key={library.slug} className="theme-border flex items-center gap-3 border-b py-3 last:border-0">
            <LibraryLogo url={library.url} name={library.name} size={26} />
            <span className="theme-text min-w-0 flex-1 truncate text-sm font-medium">{library.name}</span>
            <ArrowUpRight className="theme-muted size-4 shrink-0" />
          </div>
        ))}
      </div>
    ),
  },
  {
    Icon: Search,
    name: "Search and filter",
    description: "Narrow the directory by name, category, stack, or use case.",
    href: "/libraries#library-search",
    cta: "Search libraries",
    className: "lg:col-span-2",
    background: (
      <div className="bento-preview absolute inset-x-5 top-5 rounded-lg border p-4">
        <div className="theme-border theme-control flex h-11 items-center gap-3 rounded-md border px-3">
          <Search className="theme-muted size-4" />
          <span className="theme-muted text-sm">dashboard accessibility</span>
          <kbd className="theme-muted ml-auto text-xs">⌘ K</kbd>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {STACKS.slice(0, 4).map((stack, index) => (
            <span key={stack} className={`bento-preview-chip rounded-md border px-3 py-1.5 text-xs ${index === 0 ? "bento-preview-chip-active" : ""}`}>{stack}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    Icon: Layers3,
    name: "Browse by category",
    description: `${CATEGORIES.length} clear categories help you find the right kind of tool.`,
    href: "/libraries",
    cta: "Explore categories",
    className: "lg:col-span-2",
    background: (
      <div className="bento-preview absolute inset-x-5 top-5 grid grid-cols-2 gap-2 rounded-lg border p-4 sm:grid-cols-3">
        {CATEGORIES.slice(0, 6).map((category) => (
          <div key={category} className="bento-preview-chip theme-muted flex min-w-0 items-center gap-2 rounded-md border px-3 py-3 text-xs">
            <Layers3 className="size-4 shrink-0" />
            <span className="truncate">{category}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    Icon: ArrowUpRight,
    name: "Go to the source",
    description: "Every listing links to its official project site or documentation.",
    href: sourceLibrary?.url ?? "/libraries",
    cta: "Visit a project",
    className: "lg:col-span-1",
    background: sourceLibrary ? (
      <div className="bento-preview absolute inset-x-4 top-5 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <LibraryLogo url={sourceLibrary.url} name={sourceLibrary.name} size={32} />
          <div className="min-w-0">
            <p className="theme-text truncate text-sm font-semibold">{sourceLibrary.name}</p>
            <p className="theme-muted truncate text-xs">{new URL(sourceLibrary.url).hostname}</p>
          </div>
          <ArrowUpRight className="theme-muted ml-auto size-4 shrink-0" />
        </div>
        <div className="theme-border mt-4 border-t pt-3">
          <span className="bento-preview-chip rounded-md border px-2 py-1 text-[11px]">{sourceLibrary.category}</span>
        </div>
      </div>
    ) : null,
  },
];

export function WhatsInsideSection() {
  return (
    <section aria-labelledby="whats-inside-title" className="whats-inside-section px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 id="whats-inside-title" className="theme-text mb-8 text-4xl font-semibold tracking-[-0.04em] sm:mb-10 sm:text-5xl">What&apos;s inside</h2>
        <BentoGrid>
          {features.map((feature) => <BentoCard key={feature.name} {...feature} />)}
        </BentoGrid>
      </div>
    </section>
  );
}
