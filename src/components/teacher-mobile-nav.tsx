'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Target,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

const teacherNavItems = [
  { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/teacher/challenges', label: 'Challenges', icon: Target },
  { href: '/teacher/submissions', label: 'Submissions', icon: FileText },
  { href: '/teacher/profile', label: 'Profile', icon: User },
];

export const TeacherMobileNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-white dark:bg-[#000313] border-t-2 border-[#00031333] dark:border-white/20 z-50 lg:hidden px-2 pb-2">
      <div className="flex items-center justify-between h-full">
        {teacherNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.href} className="flex-1 flex justify-center">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF]' 
                    : 'border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'
                }`}
              >
                <Icon 
                  size={24} 
                  className={isActive ? 'text-[#0ba2b3]' : 'text-[#000313] dark:text-white/70'} 
                  strokeWidth={2.5} 
                />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
