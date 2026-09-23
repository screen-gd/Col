"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FlowButtonProps = {
  text?: string;
  href?: string;
  className?: string;
};

export function FlowButton({ text = "Modern Button", href, className }: FlowButtonProps) {
  const classes = cn(
    "group relative inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-[#333333]/40 bg-transparent px-8 py-3 text-sm font-semibold text-[#111111] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-white active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2",
    className,
  );
  const content = (
    <>
      <ArrowRight aria-hidden className="absolute left-4 z-[9] size-4 -translate-x-[250%] stroke-[#111111] fill-none opacity-0 transition-[transform,opacity,stroke] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:stroke-white group-hover:opacity-100" />
      <span className="relative z-[1] -translate-x-1.5 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">{text}</span>
      <span data-slot="flow-fill" aria-hidden className="absolute top-1/2 left-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[#111111] opacity-0 transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" />
      <ArrowRight aria-hidden className="absolute right-4 z-[9] size-4 stroke-[#111111] fill-none transition-[transform,opacity,stroke] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[250%] group-hover:stroke-white group-hover:opacity-0" />
    </>
  );

  return href ? <Link href={href} className={classes}>{content}</Link> : <button type="button" className={classes}>{content}</button>;
}
