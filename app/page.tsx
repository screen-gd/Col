import { LibraryExplorer } from "@/components/LibraryExplorer";
import { Header } from "@/components/Header";
import { SponsorsSection } from "@/components/SponsorsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsInsideSection } from "@/components/WhatsInsideSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden">
        <LibraryExplorer />
        <WhatsInsideSection />
        <SponsorsSection />
      </main>
      <SiteFooter />
    </>
  );
}
