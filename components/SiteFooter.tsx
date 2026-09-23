import Image from "next/image";
import { BookOpen, GitFork, MessageSquarePlus } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="theme-border border-t">
      <div className="site-footer-panel px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-7 border-b border-white/15 py-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2.5">
                <Image src="/brand/col-mark.png" alt="" width={28} height={28} className="size-7 object-contain" />
                <span className="text-xl font-semibold tracking-[-0.035em] text-white">Col</span>
              </div>
              <p className="text-sm text-white/60">Sol could not do it himself, so we made Col.</p>
              <nav aria-label="Project links" className="flex gap-2.5">
                <a className="footer-icon-link footer-icon-link--primary" href="https://github.com/screen-gd/Col" target="_blank" rel="noopener noreferrer" aria-label="View Col on GitHub">
                  <GitFork className="size-4" aria-hidden />
                </a>
                <a className="footer-icon-link" href="/docs" aria-label="Read the Col documentation">
                  <BookOpen className="size-4" aria-hidden />
                </a>
                <a className="footer-icon-link" href="https://github.com/screen-gd/Col/issues/new/choose" target="_blank" rel="noopener noreferrer" aria-label="Contribute to Col">
                  <MessageSquarePlus className="size-4" aria-hidden />
                </a>
              </nav>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 xl:flex xl:gap-8">
              <FooterLinks title="Discover" links={[["All libraries", "/libraries"], ["Search", "/#hero-search"], ["Contributors", "/contributors"]]} />
              <FooterLinks title="Contribute" links={[["Request a library", "https://github.com/screen-gd/Col/issues/new?template=library-request.yml"], ["Request a feature", "https://github.com/screen-gd/Col/issues/new?template=feature-request.yml"], ["Report a bug", "https://github.com/screen-gd/Col/issues/new?template=bug-report.yml"]]} external />
              <FooterLinks title="Project" links={[["Docs", "/docs"], ["Sponsors", "/#sponsors"], ["GitHub", "https://github.com/screen-gd/Col"], ["Contributing", "https://github.com/screen-gd/Col/blob/main/CONTRIBUTING.md"]]} />
            </div>
          </div>

          <div className="flex flex-col gap-2 py-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Screen. <a className="footer-link" href="https://github.com/screen-gd/Col/blob/main/LICENSE">MIT license</a>.</p>
            <p>Open source. Community maintained.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, external = false }: { title: string; links: readonly (readonly [string, string])[]; external?: boolean }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-medium tracking-[0.12em] text-white/45 uppercase">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px]">
        {links.map(([label, href]) => {
          const opensNewTab = external || href.startsWith("https://");
          return <a key={href} className="footer-link" href={href} {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}</a>;
        })}
      </div>
    </nav>
  );
}
