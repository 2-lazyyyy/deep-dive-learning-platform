'use client';

import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LogOut, Flame, Medal, Crown, User, Ghost, Bot, Smile, Sparkles, Star, Heart, Trophy, Target, Shield, Gem, Award, Settings } from 'lucide-react';

const AVATARS = [
  { id: 'user', icon: User },
  { id: 'ghost', icon: Ghost },
  { id: 'bot', icon: Bot },
  { id: 'smile', icon: Smile },
  { id: 'sparkles', icon: Sparkles },
  { id: 'star', icon: Star },
  { id: 'heart', icon: Heart },
  { id: 'trophy', icon: Trophy },
  { id: 'target', icon: Target },
  { id: 'shield', icon: Shield },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Wildfire', desc: 'Reach a 7-day streak', icon: Flame, color: 'text-[#FF9600]', bg: 'bg-[#FF9600]/20' },
  { id: 2, title: 'Sage', desc: 'Earn 1,000 Total XP', icon: Star, color: 'text-[#FFC800]', bg: 'bg-[#FFC800]/20' },
  { id: 3, title: 'Scholar', desc: 'Learn 50 new words (Tokens)', icon: Medal, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20' },
  { id: 4, title: 'Champion', desc: 'Reach #1 in Bronze League', icon: Crown, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20' },
];

export default function ProfilePage() {
  const { username, profilePicture, xp, gems, streak } = useUserStore();
  
  const getLeagueDetails = (userXp: number) => {
    if (userXp < 1000) return { name: 'Bronze', color: '#CD7F32', icon: Award };
    if (userXp < 2500) return { name: 'Silver', color: '#C0C0C0', icon: Shield };
    if (userXp < 4500) return { name: 'Gold', color: '#FFC800', icon: Trophy };
    if (userXp < 7000) return { name: 'Platinum', color: '#8CC6D7', icon: Star };
    if (userXp < 10000) return { name: 'Diamond', color: '#00BCD4', icon: Gem };
    return { name: 'Ruby', color: '#E0115F', icon: Crown };
  };

  const currentLeague = getLeagueDetails(xp);
  const LeagueIcon = currentLeague.icon;
  
  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Profile Section */}
      <div className="flex items-center gap-6 mb-8 border-b-2 border-[#00031333] dark:border-white/20 pb-8 relative">
        <Link href="/settings" className="lg:hidden absolute top-0 right-0 p-2 text-[#0ba2b3] hover:bg-[#F8F8F8] dark:hover:bg-white/10 rounded-full transition-colors">
          <Settings size={28} />
        </Link>
        <div className="relative">
          <div className="w-32 h-32 shrink-0 rounded-full bg-[#0ba2b3] flex items-center justify-center text-white shadow-inner border-4 border-white">
            {(() => {
              const SelectedIcon = AVATARS.find(a => a.id === profilePicture)?.icon || User;
              return <SelectedIcon size={48} />;
            })()}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">
            {username}
          </h1>
          <p className="text-lg font-bold text-[#6B7280] dark:text-gray-400">
            @{username.toLowerCase().replace(/\s+/g, '')}
          </p>
          <p className="text-[#000313] dark:text-white font-bold mt-2">Joined August 2026</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-[#000313] dark:text-white mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border-2 border-[#00031333] dark:border-white/20 flex items-center gap-4 bg-white dark:bg-[#000313]">
            <Star size={32} className="text-[#FFC800]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#000313] dark:text-white">{xp}</p>
              <p className="text-sm font-bold text-[#000313] dark:text-white">Total XP</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#00031333] dark:border-white/20 flex items-center gap-4 bg-white dark:bg-[#000313]">
            <LeagueIcon size={32} style={{ color: currentLeague.color }} fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#000313] dark:text-white">{currentLeague.name}</p>
              <p className="text-sm font-bold text-[#000313] dark:text-white">Current League</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#00031333] dark:border-white/20 flex items-center gap-4 bg-white dark:bg-[#000313]">
            <Flame size={32} className="text-[#FF9600]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#000313] dark:text-white">{streak}</p>
              <p className="text-sm font-bold text-[#000313] dark:text-white">Day Streak</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#00031333] dark:border-white/20 flex items-center gap-4 bg-white dark:bg-[#000313]">
            <Gem size={32} className="text-[#00BCD4]" fill="currentColor" />
            <div>
              <p className="font-extrabold text-xl text-[#000313] dark:text-white">{gems}</p>
              <p className="text-sm font-bold text-[#000313] dark:text-white">Gems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#000313] dark:text-white">Achievements</h2>
          <Link href="/profile/achievements" className="text-sm font-bold text-[#0ba2b3] hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {ACHIEVEMENTS.map((ach) => (
            <div key={ach.id} className="p-4 rounded-2xl border-2 border-[#00031333] dark:border-white/20 flex items-center gap-4 bg-white dark:bg-[#000313]">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${ach.bg}`}>
                <ach.icon size={28} className={ach.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg text-[#000313] dark:text-white">{ach.title}</h3>
                <p className="text-sm font-bold text-[#000313] dark:text-white">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
