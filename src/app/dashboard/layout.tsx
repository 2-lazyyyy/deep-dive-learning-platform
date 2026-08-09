import Link from 'next/link';
import { LayoutDashboard, BookOpen } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Teacher Portal</h1>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/lessons" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <BookOpen size={20} />
            <span>Syllabus Builder</span>
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
