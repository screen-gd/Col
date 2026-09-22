import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { Header } from "@/components/Header";

export default async function LibrariesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <Header />
      <DirectoryExplorer initialQuery={q} />
    </main>
  );
}
