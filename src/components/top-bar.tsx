'use client';

import { Heart, Flame, Gem, Star } from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';

export const TopBar = () => {
  const { hearts, streak, gems, xp } = useUserStore();

  return (
    <div className="fixed top-0 left-0 right-0 h-[60px] bg-white dark:bg-[#000313] border-b-2 border-[#00031333] dark:border-white/20 z-40 flex items-center justify-between px-4 lg:hidden">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center gap-1.5 text-orange-500 font-extrabold cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 p-2 rounded-xl transition-colors">
          <Flame fill="currentColor" size={24} /> {streak}
        </div>
        <div className="flex items-center gap-1.5 text-[#00BCD4] font-extrabold cursor-pointer hover:bg-[#00BCD4]/10 dark:hover:bg-[#00BCD4]/30 p-2 rounded-xl transition-colors">
          <Gem fill="currentColor" size={24} /> {gems}
        </div>
        <div className="flex items-center gap-1.5 text-[#FC4B0B] font-extrabold cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl transition-colors">
          <Heart fill="currentColor" size={24} /> {hearts}
        </div>
        <div className="flex items-center gap-1.5 text-yellow-500 font-extrabold cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-950/30 p-2 rounded-xl transition-colors">
          <Star fill="currentColor" size={24} /> {xp}
        </div>
      </div>
    </div>
  );
};
