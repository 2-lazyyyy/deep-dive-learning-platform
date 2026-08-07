import { TeacherSidebar } from "@/components/teacher-sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TeacherSidebar />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0 bg-[#F8F8F8] min-h-screen">
        <div className="max-w-[1200px] mx-auto pt-6 h-full px-6">
          {children}
        </div>
      </main>
    </>
  );
}
