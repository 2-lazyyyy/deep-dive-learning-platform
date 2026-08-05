'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const teacherNavItems = [
  { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard, color: 'text-[#1CB0F6]' },
  { href: '/teacher/lessons', label: 'Lessons', icon: BookOpen, color: 'text-[#58CC02]' },
  { href: '/teacher/submissions', label: 'Submissions', icon: FileText, color: 'text-[#FF9600]' },
  { href: '/teacher/settings', label: 'Settings', icon: Settings, color: 'text-[#777777]' },
];

export const TeacherSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-full w-[256px] lg:flex flex-col hidden left-0 top-0 border-r-2 border-[#E5E5E5] px-4 fixed bg-white z-30">
      {/* Logo */}
      <Link href="/teacher">
        <div className="pt-8 pl-4 pb-3 flex items-center gap-x-3">
          <GraduationCap size={32} className="text-[#CE82FF]" strokeWidth={2.5} />
          <h1 className="text-2xl font-extrabold text-[#CE82FF] tracking-wide">
            DeepDive
          </h1>
        </div>
      </Link>
      <div className="pl-4 pb-6">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white bg-[#CE82FF] px-2.5 py-1 rounded-full">
          Teacher
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-y-1 flex-1">
        {teacherNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-x-4 p-3.5 rounded-xl font-bold uppercase text-sm tracking-wide cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#F3E8FF] border-2 border-[#CE82FF]/40 text-[#CE82FF]'
                    : 'border-2 border-transparent text-[#777777] hover:bg-[#F7F7F7]'
                }`}
              >
                <Icon
                  size={24}
                  className={isActive ? 'text-[#CE82FF]' : item.color}
                  strokeWidth={2.5}
                />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom: Switch to Student + Logout */}
      <div className="border-t-2 border-[#E5E5E5] pt-4 pb-6 flex flex-col gap-2">
        <Link href="/">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#1CB0F6] hover:bg-[#DDF4FF] transition-colors cursor-pointer">
            <GraduationCap size={20} strokeWidth={2.5} />
            Student View
          </div>
        </Link>
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#FF4B4B] hover:bg-red-50 transition-colors cursor-pointer">
          <LogOut size={20} strokeWidth={2.5} />
          Logout
        </div>
      </div>
    </div>
  );
};
