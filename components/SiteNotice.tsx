"use client";

import { useEffect, useState } from "react";

const noticeKey = "col:site-notice-dismissed";

export function SiteNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(sessionStorage.getItem(noticeKey) !== "true");
    } catch {
      setOpen(true);
    }
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(noticeKey, "true");
    } catch {
      // The notice still closes when storage is unavailable.
    }
  };

  if (!open) return null;

  return (
    <aside aria-labelledby="site-notice-title" className="fixed inset-x-0 bottom-0 z-[60] border-t border-zinc-200 bg-white px-5 py-5 text-black dark:border-white/20 dark:bg-black dark:text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="site-notice-title" className="text-base font-semibold">Col is still being built.</h2>
          <p className="mt-1 text-sm leading-6">Found an issue or bug? Please report it on GitHub.</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2">
          <a href="https://github.com/screen-gd/Col/issues/new/choose" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center bg-[#0800ff] px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0800ff]">
            Open GitHub issue
          </a>
          <button type="button" onClick={close} className="min-h-11 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current">
            Close notice
          </button>
        </div>
      </div>
    </aside>
  );
}
