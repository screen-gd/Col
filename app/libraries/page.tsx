import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { firstQuery } from "@/lib/directory";

export default async function LibrariesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const initialQuery = firstQuery(q);

  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <DirectoryExplorer initialQuery={initialQuery} />
      </main>
      <SiteFooter />
    </>
  );
}
