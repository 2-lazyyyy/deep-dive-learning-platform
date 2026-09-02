'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Store, GraduationCap, Target, Swords, MoreHorizontal, Settings, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/use-auth-store';
import { useUserStore } from '@/store/use-user-store';

import { translations } from '@/lib/i18n';

interface NavItem {
  href: string;
  key: 'learn' | 'leaderboard' | 'quests' | 'shop' | 'profile' | 'challenge';
  icon?: any;
  isProfile?: boolean;
  color: string;
}

const navItems: NavItem[] = [
  { href: '/', key: 'learn', icon: Home, color: 'text-[#0ba2b3]' },
  { href: '/leaderboard', key: 'leaderboard', icon: Trophy, color: 'text-[#0ba2b3]' },
  { href: '/quests', key: 'quests', icon: Target, color: 'text-[#0ba2b3]' },
  { href: '/shop', key: 'shop', icon: Store, color: 'text-[#0ba2b3]' },
  { href: '/profile', key: 'profile', isProfile: true, color: 'text-[#0ba2b3]' },
  { href: '/challenge', key: 'challenge', icon: Swords, color: 'text-[#0ba2b3]' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const signOut = useAuthStore((state) => state.signOut);
  const { profilePicture, language } = useUserStore();
  const t = translations;

  return (
    <div className="h-full w-[256px] lg:flex flex-col hidden left-0 top-0 border-r-2 border-[#00031333] dark:border-white/20 px-4 fixed bg-white dark:bg-[#000313] z-30">
      {/* Logo */}
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <GraduationCap size={32} className="text-[#0ba2b3]" strokeWidth={2.5} />
          <h1 className="text-2xl font-extrabold text-[#0ba2b3] tracking-wide">
            DeepDive
          </h1>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex flex-col gap-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const label = t.nav[item.key][language] || t.nav[item.key]['en'];

          return (
            <Link href={item.href} key={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-x-4 p-3.5 rounded-xl font-bold uppercase text-sm tracking-wide cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] text-[#0ba2b3]'
                    : 'border-2 border-transparent text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:bg-[#060a1d]'
                }`}
              >
                {item.isProfile ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-lg border-2 ${
                    isActive ? 'border-[#0ba2b3] bg-white shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {profilePicture || '🦊'}
                  </div>
                ) : item.icon ? (
                  <item.icon
                    size={28}
                    className={isActive ? 'text-[#0ba2b3]' : item.color}
                    strokeWidth={2.5}
                  />
                ) : null}
                <span>{label}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* More Tab */}
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-x-4 p-3.5 rounded-xl font-bold uppercase text-sm tracking-wide cursor-pointer transition-colors border-2 border-transparent text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-white/5"
          >
            <MoreHorizontal size={28} className="text-[#0ba2b3]" strokeWidth={2.5} />
            <span>{t.nav.more[language]}</span>
          </motion.div>

          {/* Dropdown Menu Wrapper to bridge the hover gap */}
          <div className="absolute left-full bottom-0 pl-2 hidden group-hover:block z-[100]">
            <div className="absolute -left-8 -top-8 -bottom-8 w-16 bg-transparent" />
            <div className="flex flex-col bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-56 overflow-hidden py-2 relative">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-white/5 font-bold text-[#000313] dark:text-white text-sm uppercase transition cursor-pointer">
                <Settings size={22} className="text-[#0ba2b3]" strokeWidth={2.5} />
                <span>{t.nav.settings[language]}</span>
              </Link>
              <Link href="/help" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-white/5 font-bold text-[#000313] dark:text-white text-sm uppercase transition cursor-pointer">
                <HelpCircle size={22} className="text-[#0ba2b3]" strokeWidth={2.5} />
                <span>{t.nav.help[language]}</span>
              </Link>
              <div className="h-[2px] bg-[#00031333] dark:bg-white/20 w-full my-1" />
              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = '/auth';
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-white/5 font-bold text-[#FC4B0B] text-sm uppercase transition cursor-pointer w-full text-left"
              >
                <LogOut size={22} className="text-[#FC4B0B]" strokeWidth={2.5} />
                <span>{t.nav.logout[language]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
