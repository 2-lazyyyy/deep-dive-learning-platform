import { TeacherSidebar } from "@/components/teacher-sidebar";
import { TeacherMobileNav } from "@/components/teacher-mobile-nav";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TeacherSidebar />
      <TeacherMobileNav />
      <main className="lg:pl-[256px] h-full pb-[80px] lg:pb-0 pt-[50px] lg:pt-0 bg-[#F8F8F8] dark:bg-[#060a1d] min-h-screen">
        <div className="max-w-[1200px] mx-auto pt-6 h-full px-6">
          {children}
        </div>
      </main>
    </>
  );
}
