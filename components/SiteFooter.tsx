import Image from "next/image";
import { ArrowUpRight, BookOpen, GitFork, MessageSquarePlus } from "lucide-react";

const linkIcon = <ArrowUpRight className="size-4" aria-hidden />;

export function SiteFooter() {
  return (
    <footer className="theme-border border-t">
      <div className="site-footer-panel overflow-hidden px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 sm:grid-cols-2">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <Image src="/brand/col-mark.png" alt="" width={40} height={40} className="size-10 object-contain" />
                <span className="text-3xl font-semibold tracking-[-0.035em] text-white">Col</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/60">Sol could not do it himself, so we made Col.</p>
            </div>

            <div className="sm:justify-self-end sm:pr-24">
              <h2 className="text-lg font-medium text-white">Explore the project</h2>
              <div className="mt-5 flex gap-2.5">
                <a className="footer-icon-link footer-icon-link--primary" href="https://github.com/screen-gd/Col" target="_blank" rel="noopener noreferrer" aria-label="View Col on GitHub">
                  <GitFork className="size-5" aria-hidden />
                </a>
                <a className="footer-icon-link" href="/docs" aria-label="Read the Col documentation">
                  <BookOpen className="size-5" aria-hidden />
                </a>
                <a className="footer-icon-link" href="https://github.com/screen-gd/Col/issues/new/choose" target="_blank" rel="noopener noreferrer" aria-label="Contribute to Col">
                  <MessageSquarePlus className="size-5" aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-24 grid gap-14 sm:grid-cols-3 sm:gap-10 lg:mt-32">
            <FooterLinks title="Discover" links={[["All libraries", "/libraries"], ["Search", "/#hero-search"], ["Contributors", "/contributors"]]} />
            <FooterLinks title="Contribute" links={[["Request a library", "https://github.com/screen-gd/Col/issues/new?template=library-request.yml"], ["Request a feature", "https://github.com/screen-gd/Col/issues/new?template=feature-request.yml"], ["Report a bug", "https://github.com/screen-gd/Col/issues/new?template=bug-report.yml"]]} external />
            <FooterLinks title="Project" links={[["Docs", "/docs"], ["GitHub", "https://github.com/screen-gd/Col"], ["Contributing", "https://github.com/screen-gd/Col/blob/main/CONTRIBUTING.md"]]} />
          </div>

          <div className="mt-20 flex flex-col gap-3 border-b border-white/15 pb-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Col. All rights reserved.</p>
            <p>Open source. Community maintained.</p>
          </div>

          <p className="site-footer-wordmark" aria-hidden>Col</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, external = false }: { title: string; links: readonly (readonly [string, string])[]; external?: boolean }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-medium tracking-[0.12em] text-white/45 uppercase">{title}</h3>
      <div className="mt-5 flex flex-col gap-3 text-lg">
        {links.map(([label, href]) => {
          const opensNewTab = external || href.startsWith("https://");
          return <a key={href} className="footer-link" href={href} {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span>{label}</span>{linkIcon}</a>;
        })}
      </div>
    </nav>
  );
}
