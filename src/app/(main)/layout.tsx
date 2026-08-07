import { Sidebar } from "@/components/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0 bg-[#F8F8F8] min-h-screen">
        <div className="max-w-[1056px] mx-auto pt-6 h-full px-4">
          {children}
        </div>
      </main>
    </>
  );
}
