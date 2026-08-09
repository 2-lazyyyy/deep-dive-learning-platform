import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { TopBar } from "@/components/top-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <MobileNav />
      <TopBar />
      <main className="lg:pl-[256px] h-full pb-[80px] lg:pb-0 pt-[84px] lg:pt-0 bg-[#F8F8F8] dark:bg-[#060a1d] min-h-screen">
        <div className="max-w-[1056px] mx-auto pt-6 h-full px-4">
          {children}
        </div>
      </main>
    </>
  );
}
