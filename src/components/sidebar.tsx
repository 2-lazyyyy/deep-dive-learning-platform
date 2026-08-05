'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Store, GraduationCap, Gem, Target, User, Swords } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Learn', icon: Home, color: 'text-[#1CB0F6]' },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, color: 'text-[#FFC800]' },
  { href: '/quests', label: 'Quests', icon: Target, color: 'text-[#FF9600]' },
  { href: '/shop', label: 'Shop', icon: Store, color: 'text-[#FF9600]' },
  { href: '/profile', label: 'Profile', icon: User, color: 'text-[#CE82FF]' },
  { href: '/challenge', label: 'Challenge', icon: Swords, color: 'text-[#FF4B4B]' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-full w-[256px] lg:flex flex-col hidden left-0 top-0 border-r-2 border-[#E5E5E5] px-4 fixed bg-white z-30">
      {/* Logo */}
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <GraduationCap size={32} className="text-[#58CC02]" strokeWidth={2.5} />
          <h1 className="text-2xl font-extrabold text-[#58CC02] tracking-wide">
            DeepDive
          </h1>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex flex-col gap-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-x-4 p-3.5 rounded-xl font-bold uppercase text-sm tracking-wide cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#DDF4FF] border-2 border-[#84D8FF] text-[#1CB0F6]'
                    : 'border-2 border-transparent text-[#777777] hover:bg-[#F7F7F7]'
                }`}
              >
                <Icon
                  size={28}
                  className={isActive ? 'text-[#1CB0F6]' : item.color}
                  strokeWidth={2.5}
                />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
