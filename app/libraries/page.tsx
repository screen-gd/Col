import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export default async function LibrariesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <DirectoryExplorer initialQuery={q} />
      </main>
      <SiteFooter />
    </>
  );
}
