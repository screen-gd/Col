import { LibraryExplorer } from "@/components/LibraryExplorer";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <LibraryExplorer />
      </main>
      <SiteFooter />
    </>
  );
}
