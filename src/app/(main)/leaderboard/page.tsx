'use client';

import { useUserStore } from '@/store/use-user-store';
import { useAuthStore } from '@/store/use-auth-store';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Shield, Award, Star, Gem, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { translations } from '@/lib/i18n';

const TIERS = [
  { id: 'bronze', name: 'Bronze', color: '#CD7F32', minXP: 0, baseXP: 1000, icon: Award },
  { id: 'silver', name: 'Silver', color: '#C0C0C0', minXP: 1000, baseXP: 2500, icon: Shield },
  { id: 'gold', name: 'Gold', color: '#FFC800', minXP: 2500, baseXP: 4500, icon: Trophy },
  { id: 'platinum', name: 'Platinum', color: '#8CC6D7', minXP: 4500, baseXP: 7000, icon: Star },
  { id: 'diamond', name: 'Diamond', color: '#00BCD4', minXP: 7000, baseXP: 10000, icon: Gem },
  { id: 'ruby', name: 'Ruby', color: '#E0115F', minXP: 10000, baseXP: 15000, icon: Crown },
];

const mockAvatars = ['🧑‍💻', '👩‍💻', '🧑‍🎓', '👩‍🎓', '😎', '🤓', '😇', '🤠', '👽', '🤖'];

interface RealLeaderboardUser {
  id: string;
  name: string;
  xp: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { xp, username, language } = useUserStore();
  const authUser = useAuthStore((state) => state.user);
  const t = translations.leaderboard;
  const [isMounted, setIsMounted] = useState(false);
  const [realUsers, setRealUsers] = useState<RealLeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserLeagueId = (userXp: number) => {
    if (userXp < 1000) return 'bronze';
    if (userXp < 2500) return 'silver';
    if (userXp < 4500) return 'gold';
    if (userXp < 7000) return 'platinum';
    if (userXp < 10000) return 'diamond';
    return 'ruby';
  };

  const [activeTierId, setActiveTierId] = useState('bronze');

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/leaderboard');
      if (res.ok) {
        const data: RealLeaderboardUser[] = await res.json();
        setRealUsers(data);
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (isMounted) {
      setActiveTierId(getUserLeagueId(xp));
    }
  }, [xp, isMounted]);

  if (!isMounted) return null;

  const activeTier = TIERS.find((t) => t.id === activeTierId) || TIERS[0];
  const isUserInThisTier = activeTierId === getUserLeagueId(xp);

  // Helper to accurately identify the currently logged-in student
  const isCurrentUser = (u: RealLeaderboardUser) => {
    if (authUser?.id && u.id === authUser.id) return true;
    if (username && u.name.trim().toLowerCase() === username.trim().toLowerCase()) return true;
    if (authUser?.name && u.name.trim().toLowerCase() === authUser.name.trim().toLowerCase()) return true;
    return false;
  };

  // Merge real DB users with active tier filtering or display
  let displayedUsers = realUsers.map((u, idx) => {
    const isCurrent = isCurrentUser(u);
    return {
      id: u.id,
      name: u.name,
      xp: isCurrent ? Math.max(u.xp, xp) : u.xp,
      rank: u.rank || idx + 1,
      avatar: mockAvatars[idx % mockAvatars.length],
      isCurrent,
    };
  });

  // If current user is not in the list, insert them
  if (!displayedUsers.some((u) => u.isCurrent)) {
    displayedUsers.push({
      id: authUser?.id || 'current-user-temp',
      name: username || authUser?.name || 'Demo Student',
      xp: xp,
      rank: displayedUsers.length + 1,
      avatar: '🎯',
      isCurrent: true,
    });
  }

  // Sort by XP descending and re-rank
  displayedUsers.sort((a, b) => b.xp - a.xp);
  displayedUsers = displayedUsers.map((u, idx) => ({ ...u, rank: idx + 1 }));

  const currentUserRank = displayedUsers.find((u) => u.isCurrent)?.rank ?? 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={22} className="text-[#FFC800]" fill="currentColor" />;
      case 2:
        return <Medal size={22} className="text-[#C0C0C0]" fill="currentColor" />;
      case 3:
        return <Medal size={22} className="text-[#CD7F32]" fill="currentColor" />;
      default:
        return <span className="text-sm font-extrabold text-[#000313] dark:text-white w-[20px] text-center">{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">{t.title[language]}</h1>
          <p className="text-xs font-bold text-gray-500 mt-1">{t.subtitle[language]}</p>
        </div>
      </div>

      <div className="flex flex-row-reverse gap-4 md:gap-8">
        {/* Tier Navigation (Right Column) */}
        <div className="w-[60px] md:w-1/3 flex flex-col gap-3 flex-shrink-0">
          {TIERS.map((tier) => {
            const isActive = tier.id === activeTierId;
            const tierDisplayName = t.tiers[tier.id as keyof typeof t.tiers]?.[language] || tier.name;
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
                  color: isActive ? tier.color : undefined,
                }}
              >
                <tier.icon size={28} className="md:w-6 md:h-6" fill={isActive ? tier.color : 'currentColor'} />
                <span className="hidden md:inline">{tierDisplayName}</span>
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
            <h2 className="text-3xl font-extrabold">
              {(t.tiers[activeTier.id as keyof typeof t.tiers]?.[language] || activeTier.name)} {t.league[language]}
            </h2>
            <p className="font-bold opacity-90 mt-2">
              {isUserInThisTier
                ? t.competingDesc[language]
                : t.advanceDesc[language]}
            </p>

            {/* User Progress Bar for this League */}
            <div className="w-full max-w-md mt-6">
              <div className="flex justify-between text-sm font-extrabold text-white mb-2 opacity-90">
                <span>{activeTier.minXP} XP</span>
                <span>
                  {Math.max(activeTier.minXP, Math.min(activeTier.baseXP, xp))} / {activeTier.baseXP} XP
                </span>
              </div>
              <div className="w-full bg-[#000313]/20 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative bg-white dark:bg-[#000313]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.max(0, ((xp - activeTier.minXP) / (activeTier.baseXP - activeTier.minXP)) * 100))}%`,
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
                  : `${activeTier.baseXP - xp} XP to advance`}
              </p>
            </div>
          </motion.div>

          {/* Your Rank Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0ba2b3] flex items-center justify-center text-lg">
                🎯
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#0ba2b3] mb-1">{t.yourRank[language]}</p>
                <p className="text-xl font-extrabold text-[#000313] dark:text-white">#{currentUserRank}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={18} className="text-[#0ba2b3]" />
              <span className="font-extrabold text-[#0ba2b3]">{xp} XP</span>
            </div>
          </motion.div>

          {/* Leaderboard Table */}
          <div className="bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 overflow-hidden shadow-sm">
            <div className="p-4 bg-[#F8F8F8] dark:bg-[#060a1d] border-b-2 border-[#00031333] dark:border-white/20 flex justify-between font-extrabold text-sm text-[#6B7280] dark:text-gray-400 uppercase">
              <span>{t.rankAndStudent[language]}</span>
              <span>{t.totalXp[language]}</span>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-gray-500 font-bold text-sm flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin text-[#0ba2b3]" />
                {t.loading[language]}
              </div>
            ) : (
              displayedUsers.map((user, idx) => {
                const isTop3 = user.rank <= 3;

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    className={`flex items-center justify-between px-5 py-4 border-b-2 border-[#00031333] dark:border-white/20 last:border-b-0 transition-colors ${
                      user.isCurrent
                        ? 'bg-[#FFF8E1] dark:bg-[#FFC800]/20'
                        : isTop3
                        ? 'bg-[#F9FAFB] dark:bg-white/10'
                        : 'hover:bg-[#F8F8F8] dark:hover:bg-white/5 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-8 flex justify-center">{getRankIcon(user.rank)}</div>

                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${
                          isTop3
                            ? 'border-[#FFC800] bg-[#FFF3CD] dark:bg-[#FFC800]/20'
                            : 'border-[#00031333] dark:border-white/20 bg-[#F8F8F8] dark:bg-white/5'
                        }`}
                      >
                        {user.avatar}
                      </div>

                      {/* Name */}
                      <div className="flex flex-col">
                        <span
                          className={`font-extrabold ${
                            user.isCurrent ? 'text-[#0ba2b3]' : 'text-[#000313] dark:text-white'
                          }`}
                        >
                          {user.name}
                          {user.isCurrent && (
                            <span className="ml-2 text-[10px] bg-[#0ba2b3] text-white px-2 py-0.5 rounded-full font-extrabold align-middle">
                              {t.you[language]}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <span className={`font-extrabold text-lg ${isTop3 ? 'text-[#FFC800]' : 'text-[#000313] dark:text-white'}`}>
                      {user.xp} XP
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
