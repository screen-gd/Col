import Link from "next/link";
import { ArrowUpRight, Heart, Layers3, Target } from "lucide-react";
import type { Library } from "@/data/libraries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { libraryPath } from "@/lib/site";
import { hostname } from "@/lib/utils";
import { LibraryLogo } from "./LibraryLogo";

interface LibraryCardProps {
  library: Library;
  saved: boolean;
  onToggleSaved: () => void;
}

export function LibraryCard({ library, saved, onToggleSaved }: LibraryCardProps) {
  return (
    <Card className="library-card group relative h-[286px] gap-4 overflow-hidden rounded-xl py-5 shadow-none transition-colors">
      <CardHeader className="px-5">
        <CardTitle className="min-w-0">
          <Link href={libraryPath(library.slug)} className="flex items-center gap-3 after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2">
            <span className="theme-border grid size-9 shrink-0 place-items-center rounded-lg border bg-white/[0.035]">
              <LibraryLogo url={library.url} name={library.name} size={24} />
            </span>
            <span className="truncate text-[15px] tracking-[-0.01em]">{library.name}</span>
          </Link>
        </CardTitle>
        <p className="library-subtle ml-12 truncate text-[11px]">{hostname(library.url)}</p>
        <CardAction className="relative z-10">
          <Button type="button" size="icon-sm" variant="ghost" onClick={onToggleSaved} aria-label={saved ? `Remove ${library.name} from saved` : `Save ${library.name}`} aria-pressed={saved} className="library-save min-h-11 min-w-11 rounded-lg hover:opacity-80">
            <Heart fill={saved ? "currentColor" : "none"} aria-hidden />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 px-5">
        <p className="library-muted line-clamp-3 text-[13px] leading-5">{library.description}</p>
        {library.stacks.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">
          {library.stacks.slice(0, 3).map((stack) => (
            <Badge key={stack} variant="outline" className="library-chip px-2 py-0.5 text-[10px]">{stack}</Badge>
          ))}
          {library.stacks.length > 3 && <Badge variant="outline" className="library-chip px-2 py-0.5 text-[10px]">+{library.stacks.length - 3}</Badge>}
        </div>}
      </CardContent>

      <CardFooter className="library-subtle theme-border flex justify-between border-t px-5 pt-3 text-[10px]">
        <div className="flex items-center gap-4">
          {library.stacks.length > 0 && <span className="flex items-center gap-1.5"><Layers3 className="size-3" aria-hidden />{library.stacks.length} {library.stacks.length === 1 ? "stack" : "stacks"}</span>}
          <span className="flex items-center gap-1.5"><Target className="size-3" aria-hidden />{library.useCases.length} {library.useCases.length === 1 ? "use" : "uses"}</span>
        </div>
        <Button asChild size="icon-xs" variant="ghost" className="library-subtle relative z-10 rounded-md hover:opacity-80">
          <a href={library.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${library.name} website`}><ArrowUpRight aria-hidden /></a>
        </Button>
      </CardFooter>
    </Card>
  );
}
