import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="theme-border border-t">
      <div className="site-footer-panel px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 pt-20 pb-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-28 lg:pb-28">
            <div>
              <div className="flex items-center gap-2.5">
                <Image src="/brand/col-mark.png" alt="" width={28} height={28} className="size-7 object-contain" />
                <span className="text-xl font-semibold tracking-[-0.035em] text-white">Col</span>
              </div>
              <p className="mt-3 text-sm text-white/60">Sol could not do it himself, so we made Col.</p>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-14">
              <FooterLinks title="Discover" links={[["All libraries", "/libraries"], ["Search", "/libraries#library-search"], ["Contributors", "/contributors"]]} />
              <FooterLinks title="Contribute" links={[["Contribute", "https://github.com/screen-gd/Col/issues/new/choose"], ["Request a library", "https://github.com/screen-gd/Col/issues/new?template=library-request.yml"], ["Request a feature", "https://github.com/screen-gd/Col/issues/new?template=feature-request.yml"], ["Report a bug", "https://github.com/screen-gd/Col/issues/new?template=bug-report.yml"]]} />
              <FooterLinks title="Project" links={[["Docs", "/docs"], ["Roadmap", "/#roadmap"], ["Sponsors", "/#sponsors"], ["GitHub", "https://github.com/screen-gd/Col"], ["Contributing", "https://github.com/screen-gd/Col/blob/main/CONTRIBUTING.md"]]} />
            </div>
          </div>

          <div className="pb-10 text-xs text-white/55">
            <p>© {new Date().getFullYear()} Screen. <a className="footer-link" href="https://github.com/screen-gd/Col/blob/main/LICENSE">MIT license</a>.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-medium tracking-[0.12em] text-white/45 uppercase">{title}</h3>
      <div className="mt-4 flex flex-col items-start gap-3 text-[13px]">
        {links.map(([label, href]) => {
          const opensNewTab = href.startsWith("https://");
          return <a key={href} className="footer-link" href={href} {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{label}</a>;
        })}
      </div>
    </nav>
  );
}
