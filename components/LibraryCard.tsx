import { ArrowUpRight, Heart, Layers3, Target } from "lucide-react";
import type { Library } from "@/data/libraries";
import type { LibraryComponent } from "@/data/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LibraryLogo } from "./LibraryLogo";

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface LibraryCardProps {
  library: Library;
  /** Components the query matched, ordered by relevance. */
  matches: LibraryComponent[];
  saved: boolean;
  onToggleSaved: () => void;
}

export function LibraryCard({ library, matches, saved, onToggleSaved }: LibraryCardProps) {
  return (
    <Card className="library-card group relative min-h-[286px] gap-4 rounded-xl py-5 shadow-none transition-colors">
      <CardHeader className="px-5">
        <CardTitle className="min-w-0">
          <a href={library.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2">
            <span className="theme-border grid size-9 shrink-0 place-items-center rounded-lg border bg-white/[0.035]">
              <LibraryLogo url={library.url} name={library.name} size={24} />
            </span>
            <span className="truncate text-[15px] tracking-[-0.01em]">{library.name}</span>
          </a>
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
        {matches.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {matches.slice(0, 3).map((component) => (
              <a
                key={component.url}
                href={component.url}
                target="_blank"
                rel="noopener noreferrer"
                className="library-chip focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 relative z-10 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:opacity-80"
              >
                {component.name}
                <ArrowUpRight className="size-2.5" aria-hidden />
              </a>
            ))}
            {matches.length > 3 && (
              <details className="relative z-10 w-full">
                <summary className="library-subtle w-fit cursor-pointer rounded py-2 text-xs focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2">{matches.length - 3} more matches</summary>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matches.slice(3).map((component) => (
                    <a key={component.url} href={component.url} target="_blank" rel="noopener noreferrer" className="library-chip inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:opacity-80 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2">
                      {component.name}<ArrowUpRight className="size-2.5" aria-hidden />
                    </a>
                  ))}
                </div>
              </details>
            )}
          </div>
        ) : library.stacks.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {library.stacks.slice(0, 3).map((stack) => (
              <Badge key={stack} variant="outline" className="library-chip px-2 py-0.5 text-[10px]">{stack}</Badge>
            ))}
            {library.stacks.length > 3 && <Badge variant="outline" className="library-chip px-2 py-0.5 text-[10px]">+{library.stacks.length - 3}</Badge>}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="library-subtle theme-border flex justify-between border-t px-5 pt-3 text-[10px]">
        <div className="flex items-center gap-4">
          {library.stacks.length > 0 && <span className="flex items-center gap-1.5"><Layers3 className="size-3" aria-hidden />{library.stacks.length} {library.stacks.length === 1 ? "stack" : "stacks"}</span>}
          <span className="flex items-center gap-1.5"><Target className="size-3" aria-hidden />{library.useCases.length} {library.useCases.length === 1 ? "use" : "uses"}</span>
        </div>
        <Button asChild size="icon-xs" variant="ghost" className="library-subtle relative z-10 rounded-md hover:opacity-80">
          <a href={library.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${library.name}`}><ArrowUpRight aria-hidden /></a>
        </Button>
      </CardFooter>
    </Card>
  );
}
