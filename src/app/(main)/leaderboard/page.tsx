'use client';

import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Shield, Award, Star, Gem } from 'lucide-react';
import { useState, useEffect } from 'react';

const TIERS = [
  { id: 'bronze', name: 'Bronze', color: '#CD7F32', minXP: 0, baseXP: 1000, icon: Award },
  { id: 'silver', name: 'Silver', color: '#C0C0C0', minXP: 1000, baseXP: 2500, icon: Shield },
  { id: 'gold', name: 'Gold', color: '#FFC800', minXP: 2500, baseXP: 4500, icon: Trophy },
  { id: 'platinum', name: 'Platinum', color: '#8CC6D7', minXP: 4500, baseXP: 7000, icon: Star },
  { id: 'diamond', name: 'Diamond', color: '#00BCD4', minXP: 7000, baseXP: 10000, icon: Gem },
  { id: 'ruby', name: 'Ruby', color: '#E0115F', minXP: 10000, baseXP: 15000, icon: Crown },
];

const mockNames = [
  'Aung Kyaw', 'Thiri Wai', 'Min Thant', 'Su Su Hlaing', 'Zaw Lin',
  'Aye Chan', 'Htet Aung', 'May Thu', 'Kyaw Zin', 'Thin Thin'
];

const mockAvatars = ['🧑‍💻', '👩‍💻', '🧑‍🎓', '👩‍🎓', '😎', '🤓', '😇', '🤠', '👽', '🤖'];

export default function LeaderboardPage() {
  const { xp, username } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  
  const getUserLeagueId = (userXp: number) => {
    if (userXp < 1000) return 'bronze';
    if (userXp < 2500) return 'silver';
    if (userXp < 4500) return 'gold';
    if (userXp < 7000) return 'platinum';
    if (userXp < 10000) return 'diamond';
    return 'ruby';
  };

  const [activeTierId, setActiveTierId] = useState('gold');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setActiveTierId(getUserLeagueId(xp));
    }
  }, [xp, isMounted]);

  if (!isMounted) return null;

  const activeTier = TIERS.find(t => t.id === activeTierId) || TIERS[0];

  // Generate deterministic mock users based on tier
  const tierIndex = TIERS.findIndex(t => t.id === activeTierId);
  const generateMockUsers = () => {
    return mockNames.map((name, idx) => {
      // Create some variation based on tier and index
      const variance = (idx * 150) + (tierIndex * 200);
      return {
        id: idx + 1,
        name: name,
        xp: activeTier.baseXP - variance + Math.floor(Math.random() * 100),
        avatar: mockAvatars[(idx + tierIndex) % mockAvatars.length],
        streak: (idx * 3) % 15 + 1
      };
    });
  };

  const currentMockUsers = generateMockUsers();

  const isUserInThisTier = activeTierId === getUserLeagueId(xp);
  
  let allUsers = [...currentMockUsers];
  
  if (isUserInThisTier) {
    allUsers.push({ id: 0, name: username, xp: xp, avatar: '🎯', streak: 0 });
  }

  // Sort and assign ranks
  const rankedUsers = allUsers
    .sort((a, b) => b.xp - a.xp)
    .map((user, idx) => ({ ...user, rank: idx + 1 }));

  const currentUserRank = isUserInThisTier 
    ? (rankedUsers.find((u) => u.id === 0)?.rank ?? rankedUsers.length)
    : '-';

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={20} className="text-[#FFC800]" fill="currentColor" />;
      case 2:
        return <Medal size={20} className="text-[#C0C0C0]" fill="currentColor" />;
      case 3:
        return <Medal size={20} className="text-[#CD7F32]" fill="currentColor" />;
      default:
        return <span className="text-sm font-extrabold text-[#000313] dark:text-white w-[20px] text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">Leaderboard</h1>
        </div>
      </div>

      <div className="flex flex-row-reverse gap-4 md:gap-8">
        {/* Tier Navigation (Right Column) */}
        <div className="w-[60px] md:w-1/3 flex flex-col gap-3 flex-shrink-0">
          {TIERS.map((tier) => {
            const isActive = tier.id === activeTierId;
            return (
              <button
                key={tier.id}
                onClick={() => setActiveTierId(tier.id)}
                className={`flex items-center justify-center md:justify-start md:gap-3 p-3 md:px-5 md:py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wide transition-all border-2 w-full text-left ${
                  isActive 
                    ? 'bg-white dark:bg-[#000313] shadow-[0_4px_0_rgba(28,29,32,0.2)] scale-[1.02]' 
                    : 'bg-[#F8F8F8] dark:bg-[#060a1d] border-transparent text-[#6B7280] dark:text-gray-400 hover:bg-[#E5E7EB]'
                }`}
                style={{
                  borderColor: isActive ? tier.color : 'transparent',
                  color: isActive ? tier.color : undefined
                }}
              >
                <tier.icon size={28} className="md:w-6 md:h-6" fill={isActive ? tier.color : 'currentColor'} />
                <span className="hidden md:inline">{tier.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content (Left Column) */}
        <div className="flex-1 min-w-0 md:w-2/3 flex flex-col gap-6">
          {/* Active League Banner */}
          <motion.div 
            key={activeTierId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 flex flex-col items-center justify-center text-white text-center shadow-sm border-2 border-[#00031333] dark:border-white/20"
        style={{ backgroundColor: activeTier.color }}
      >
        <activeTier.icon size={64} fill="white" className="mb-3 opacity-90" />
        <h2 className="text-3xl font-extrabold">{activeTier.name} League</h2>
        <p className="font-bold opacity-90 mt-2">
          {isUserInThisTier ? 'You are currently competing in this league!' : 'Advance through the leagues to reach here.'}
        </p>

        {/* User Progress Bar for this League */}
        <div className="w-full max-w-md mt-6">
          <div className="flex justify-between text-sm font-extrabold text-white mb-2 opacity-90">
            <span>{activeTier.minXP} XP</span>
            <span>{Math.max(activeTier.minXP, Math.min(activeTier.baseXP, xp))} / {activeTier.baseXP} XP</span>
          </div>
          <div className="w-full bg-[#000313]/20 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full rounded-full relative bg-white dark:bg-[#000313]"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, Math.max(0, ((xp - activeTier.minXP) / (activeTier.baseXP - activeTier.minXP)) * 100))}%` 
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="bg-[#000313] h-1.5 absolute left-2 right-2 top-1 rounded-full opacity-10" />
            </motion.div>
          </div>
          <p className="text-xs font-bold text-white mt-2 opacity-80 uppercase tracking-wider">
            {xp >= activeTier.baseXP 
              ? 'League Completed' 
              : xp < activeTier.minXP 
                ? `${activeTier.minXP - xp} XP needed to enter` 
                : `${activeTier.baseXP - xp} XP to advance`
            }
          </p>
        </div>
      </motion.div>

      {/* Your Rank Card (Only if in this tier) */}
      {isUserInThisTier && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0ba2b3] flex items-center justify-center text-lg">
              🎯
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#0ba2b3] mb-1">YOUR RANK</p>
              <p className="text-xl font-extrabold text-[#000313] dark:text-white">#{currentUserRank}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={18} className="text-[#0ba2b3]" />
            <span className="font-extrabold text-[#0ba2b3]">{xp} XP</span>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 overflow-hidden shadow-sm">
        <div className="p-4 bg-[#F8F8F8] dark:bg-[#060a1d] border-b-2 border-[#00031333] dark:border-white/20 flex justify-between font-extrabold text-sm text-[#6B7280] dark:text-gray-400 uppercase">
          <span>Rank & User</span>
          <span>Total XP</span>
        </div>
        
        {rankedUsers.map((user, idx) => {
          const isCurrentUser = user.id === 0;
          const isTop3 = user.rank <= 3;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className={`flex items-center justify-between px-5 py-4 border-b-2 border-[#00031333] dark:border-white/20 last:border-b-0 transition-colors ${
                isCurrentUser 
                  ? 'bg-[#FFF8E1] dark:bg-[#FFC800]/20' 
                  : isTop3 
                    ? 'bg-[#F9FAFB] dark:bg-white/10' 
                    : 'hover:bg-[#F8F8F8] dark:hover:bg-white/5 bg-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                    isTop3 ? 'border-[#FFC800] bg-[#FFF3CD] dark:bg-[#FFC800]/20' : 'border-[#00031333] dark:border-white/20 bg-[#F8F8F8] dark:bg-white/5'
                  }`}
                >
                  {user.avatar}
                </div>

                {/* Name */}
                <div className="flex flex-col">
                  <span
                    className={`font-extrabold ${
                      isCurrentUser ? 'text-[#0ba2b3]' : 'text-[#000313] dark:text-white'
                    }`}
                  >
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] bg-[#0ba2b3] text-white px-2 py-0.5 rounded-full font-extrabold align-middle">
                        YOU
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-[#6B7280] dark:text-gray-400">
                    {user.streak} day streak
                  </span>
                </div>
              </div>

              {/* XP */}
              <span className={`font-extrabold text-lg ${isTop3 ? 'text-[#FFC800]' : 'text-[#000313] dark:text-white'}`}>
                {user.xp}
              </span>
            </motion.div>
          );
        })}
        </div>
        </div>
      </div>
    </div>
  );
}
