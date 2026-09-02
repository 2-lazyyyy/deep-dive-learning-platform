'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Store, Target, Swords } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/use-user-store';

const navItems = [
  { href: '/', label: 'Learn', icon: Home },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/quests', label: 'Quests', icon: Target },
  { href: '/shop', label: 'Shop', icon: Store },
  { href: '/challenge', label: 'Challenge', icon: Swords },
  { href: '/profile', label: 'Profile', isProfile: true },
];

export const MobileNav = () => {
  const pathname = usePathname();
  const profilePicture = useUserStore((state) => state.profilePicture);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-white dark:bg-[#000313] border-t-2 border-[#00031333] dark:border-white/20 z-50 lg:hidden px-2 pb-2">
      <div className="flex items-center justify-between h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.href} className="flex-1 flex justify-center">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF]' 
                    : 'border-2 border-transparent hover:bg-[#F8F8F8] dark:hover:bg-white/5'
                }`}
              >
                {item.isProfile ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-lg border-2 ${
                    isActive ? 'border-[#0ba2b3] bg-white' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {profilePicture || '🦊'}
                  </div>
                ) : item.icon ? (
                  <item.icon 
                    size={24} 
                    className={isActive ? 'text-[#0ba2b3]' : 'text-[#000313] dark:text-white/70'} 
                    strokeWidth={2.5} 
                  />
                ) : null}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
