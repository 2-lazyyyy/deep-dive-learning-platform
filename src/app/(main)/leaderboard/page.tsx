'use client';

import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';

// Mock leaderboard data
const mockUsers = [
  { id: 1, name: 'Aung Kyaw', xp: 2450, avatar: '🧑‍💻', streak: 14 },
  { id: 2, name: 'Thiri Wai', xp: 2180, avatar: '👩‍💻', streak: 21 },
  { id: 3, name: 'Min Thant', xp: 1920, avatar: '🧑‍🎓', streak: 7 },
  { id: 4, name: 'Su Su Hlaing', xp: 1750, avatar: '👩‍🎓', streak: 12 },
  { id: 5, name: 'Zaw Lin', xp: 1600, avatar: '🧑‍💻', streak: 5 },
  { id: 6, name: 'Aye Chan', xp: 1480, avatar: '👩‍💻', streak: 9 },
  { id: 7, name: 'Htet Aung', xp: 1350, avatar: '🧑‍🎓', streak: 3 },
  { id: 8, name: 'May Thu', xp: 1200, avatar: '👩‍🎓', streak: 11 },
  { id: 9, name: 'Kyaw Zin', xp: 1050, avatar: '🧑‍💻', streak: 6 },
  { id: 10, name: 'Thin Thin', xp: 900, avatar: '👩‍💻', streak: 2 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown size={22} className="text-[#FFC800]" fill="currentColor" />;
    case 2:
      return <Medal size={22} className="text-[#C0C0C0]" fill="currentColor" />;
    case 3:
      return <Medal size={22} className="text-[#CD7F32]" fill="currentColor" />;
    default:
      return <span className="text-sm font-extrabold text-[#AFAFAF] w-[22px] text-center">{rank}</span>;
  }
};

export default function LeaderboardPage() {
  const { xp, username } = useUserStore();

  // Insert current user into leaderboard
  const allUsers = [...mockUsers, { id: 0, name: username, xp, avatar: '🎯', streak: 0 }]
    .sort((a, b) => b.xp - a.xp)
    .map((user, idx) => ({ ...user, rank: idx + 1 }));

  const currentUserRank = allUsers.find((u) => u.id === 0)?.rank ?? allUsers.length;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy size={32} className="text-[#FFC800]" fill="currentColor" />
        <h1 className="text-2xl font-extrabold text-[#4B4B4B]">Leaderboard</h1>
      </div>

      {/* Your Rank Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-2xl p-4 mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1CB0F6] flex items-center justify-center text-lg">
            🎯
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#1CB0F6]">YOUR RANK</p>
            <p className="text-2xl font-extrabold text-[#4B4B4B]">#{currentUserRank}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={18} className="text-[#58CC02]" />
          <span className="font-extrabold text-[#58CC02]">{xp} XP</span>
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden">
        {allUsers.map((user, idx) => {
          const isCurrentUser = user.id === 0;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className={`flex items-center justify-between px-5 py-3.5 ${
                idx !== allUsers.length - 1 ? 'border-b border-[#E5E5E5]' : ''
              } ${isCurrentUser ? 'bg-[#FFF8E1]' : 'hover:bg-[#F7F7F7]'} transition-colors`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    user.rank <= 3 ? 'bg-[#FFF3CD]' : 'bg-[#F7F7F7]'
                  }`}
                >
                  {user.avatar}
                </div>

                {/* Name */}
                <span
                  className={`font-bold ${
                    isCurrentUser ? 'text-[#1CB0F6]' : 'text-[#4B4B4B]'
                  }`}
                >
                  {user.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs bg-[#1CB0F6] text-white px-2 py-0.5 rounded-full font-extrabold">
                      YOU
                    </span>
                  )}
                </span>
              </div>

              {/* XP */}
              <span className="font-extrabold text-[#777777]">{user.xp} XP</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
