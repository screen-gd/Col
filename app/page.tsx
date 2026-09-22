import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { LibraryExplorer } from "@/components/LibraryExplorer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <Header />

      <LibraryExplorer />

      <footer className="theme-border border-t">
        <div className="mx-auto max-w-7xl px-5 py-32 sm:px-8 sm:py-40">
          <h2 className="theme-text mt-6 max-w-3xl text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] font-semibold tracking-tight">
            Know one we missed?
          </h2>
          <a
            href="https://github.com/screen-gd/Col"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-invert-button group mt-10 inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-85"
          >
            Contribute on GitHub
            <ArrowUpRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </div>
        <div className="theme-border border-t">
          <div className="theme-muted mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 py-8 text-xs sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <Image src="/brand/col-mark.png" alt="" width={30} height={30} className="brand-mark size-[30px] object-contain" />
              <div>
                <p className="footer-wordmark text-base font-bold tracking-[-0.03em]">Col</p>
                <p className="mt-0.5">Sol could not do it himself so we made Col</p>
              </div>
            </div>
            <p>Built with Next.js, TypeScript & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
