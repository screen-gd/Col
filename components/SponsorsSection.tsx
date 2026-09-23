import { ArrowUpRight } from "lucide-react";

const inquiryUrl = "https://github.com/screen-gd/Col/issues/new?template=sponsorship.yml";

export function SponsorsSection() {
  return (
    <section id="sponsors" className="theme-border scroll-mt-28 border-b px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="theme-text text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Sponsors</h2>
            <p className="theme-muted mt-4 max-w-xl text-base leading-7">
              Sponsorship helps keep Col free, open source, and maintained.
            </p>
          </div>
          <a
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-text inline-flex w-fit items-center gap-2 border-b border-current pb-1 text-sm font-medium"
          >
            Become a sponsor <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
        <div className="theme-border mt-12 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="theme-text text-sm font-medium">No sponsors listed yet.</p>
          <p className="theme-muted text-sm">Interested in supporting Col? Send a sponsorship inquiry.</p>
        </div>
      </div>
    </section>
  );
}
