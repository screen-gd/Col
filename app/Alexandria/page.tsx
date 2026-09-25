import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { LibraryLogo } from "@/components/LibraryLogo";
import { libraries } from "@/data/libraries";
import { BookOpen, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Alexandria — A Col Concept",
  description:
    "Alexandria held every scroll. Col holds every UI library. A minimal hero concept preserving Col brand colors.",
};

const SHELF = [
  { slug: "radix-ui", name: "Radix UI" },
  { slug: "gsap", name: "GSAP" },
  { slug: "mantine", name: "Mantine" },
  { slug: "base-ui", name: "Base UI" },
  { slug: "flowbite", name: "Flowbite" },
  { slug: "motion", name: "Motion" },
  { slug: "lucide", name: "Lucide" },
  { slug: "magic-ui", name: "Magic UI" },
] as const;

const GLOW_BACKDROP = [
  { src: "/hero-logos/21st-dev-glow.png", name: "21st.dev" },
  { src: "/hero-logos/aceternity-glow.png", name: "Aceternity UI" },
  { src: "/hero-logos/mobbin-glow.png", name: "Mobbin" },
  { src: "/hero-logos/shadcn-glow.png", name: "shadcn/ui" },
  { src: "/hero-logos/react-bits-glow.png", name: "React Bits" },
] as const;

const FEATURED_SLUGS = ["shadcn-ui", "magic-ui", "gsap"] as const;

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function AlexandriaPage() {
  const featured = FEATURED_SLUGS.map((slug) =>
    libraries.find((library) => library.slug === slug),
  ).filter((library) => library !== undefined);

  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <section className="hero-wash relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center sm:px-8">
          <div className="hero-registers pointer-events-none" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-20 z-0 hidden justify-center gap-10 opacity-25 blur-[1px] sm:flex"
          >
            {GLOW_BACKDROP.map(({ src, name }) => (
              <span key={name} className="relative block size-20 shrink-0">
                <Image src={src} alt="" fill sizes="80px" className="object-contain" />
              </span>
            ))}
          </div>

          <div className="relative z-10 mx-auto w-full max-w-3xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border theme-border theme-panel px-4 py-1.5 font-mono text-[11px] tracking-[0.18em] uppercase theme-muted">
              <BookOpen className="size-3.5" aria-hidden />
              Alexandria — a Col concept
            </p>

            <h1 className="hero-headline animate-fade-up delay-1 mx-auto mt-6 max-w-2xl text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.03em]">
              The ancient library,
              <span className="mt-1 block font-pixel-square text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.15] font-bold tracking-normal hero-pixel-line">
                rebuilt for interfaces
              </span>
            </h1>

            <p className="hero-description animate-fade-up delay-2 mx-auto mt-5 max-w-xl text-base leading-[1.6] font-medium sm:text-[17px]">
              Alexandria held every scroll. Col holds every UI library —
              minimal, curated, and open.
            </p>

            <div className="animate-fade-up delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="/libraries" className="hero-cta hero-cta-primary min-h-[52px] px-8">
                Browse the collection
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a href="/docs" className="hero-cta hero-cta-secondary h-[52px] px-7">
                How Col curates
              </a>
            </div>

            <div className="animate-fade-up delay-3 mt-12 flex flex-col items-center gap-4">
              <p className="hero-popular font-pixel text-[11px] tracking-[0.18em] uppercase">
                Shelved in this hall
              </p>
              <ul
                aria-label="Sample of libraries shelved in Col"
                className="flex max-w-full flex-wrap items-center justify-center gap-2.5"
              >
                {SHELF.map(({ slug, name }) => (
                  <li
                    key={slug}
                    title={name}
                    className="theme-panel theme-border flex items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5"
                  >
                    <span className="relative block size-7 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={`/hero-logos/background/${slug}.png`}
                        alt={`${name} logo`}
                        fill
                        sizes="28px"
                        className="object-contain"
                      />
                    </span>
                    <span className="theme-muted text-xs font-medium whitespace-nowrap">
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-12 w-full max-w-4xl">
            <ul
              aria-label="Featured libraries, styled like the Col directory"
              className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3"
            >
              {featured.map((library) => (
                <li
                  key={library.slug}
                  className="library-card flex flex-col gap-3 rounded-xl border p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="theme-border grid size-9 shrink-0 place-items-center rounded-lg border bg-white/[0.035]">
                      <LibraryLogo url={library.url} name={library.name} size={24} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold tracking-[-0.01em]">
                        {library.name}
                      </span>
                      <span className="library-subtle block truncate text-[11px]">
                        {hostname(library.url)}
                      </span>
                    </span>
                  </div>
                  <p className="library-muted line-clamp-2 text-[13px] leading-5">
                    {library.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="library-chip rounded-md border px-2 py-0.5 text-[10px]">
                      {library.category}
                    </span>
                    {library.stacks.slice(0, 2).map((stack) => (
                      <span
                        key={stack}
                        className="library-chip rounded-md border px-2 py-0.5 text-[10px]"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <p className="theme-muted mt-4 text-center text-xs">
              Styled like the directory cards — same logos, chips, and brand base.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
