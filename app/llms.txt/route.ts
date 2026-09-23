import { libraries } from "@/data/libraries";

export const dynamic = "force-static";

export function GET() {
  const entries = libraries.map((library) => [
    `## ${library.name}`,
    `- Domain: [${new URL(library.url).hostname.replace(/^www\./, "")}](${library.url})`,
    `- Description: ${library.description}`,
    `- Category: ${library.category}`,
    `- Stacks: ${library.stacks.join(", ")}`,
    `- Use cases: ${library.useCases.join(", ")}`,
  ].join("\n"));

  const body = [
    "# Col",
    "Col is a curated directory of UI libraries organized by category, stack, and use case. Browse and filter the collection to find tools for your project. New libraries and corrections are submitted through pull requests.",
    "# Libraries",
    ...entries,
  ].join("\n\n") + "\n";

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
