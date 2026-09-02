'use client';

import { useUserStore } from '@/store/use-user-store';
import { useAuthStore } from '@/store/use-auth-store';
import { motion } from 'framer-motion';
import { Target, Star, Gem, CheckCircle, CalendarDays, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translations } from '@/lib/i18n';


// Quest definitions with translation keys
const dailyQuests = [
  { id: 1, key: 'earn50Xp', target: 50, rewardGems: 10, rewardXp: 0, currentProgress: (xp: number) => xp },
  { id: 2, key: 'complete3Lessons', target: 3, rewardGems: 15, rewardXp: 50, currentProgress: (xp: number, lessons: number) => lessons },
  { id: 3, key: 'scorePerfect', target: 1, rewardGems: 20, rewardXp: 0, currentProgress: () => 0 },
];

const monthlyQuests = [
  { id: 4, key: 'earn1000Xp', target: 1000, rewardGems: 100, rewardXp: 500, currentProgress: (xp: number) => xp },
  { id: 5, key: 'reach7Streak', target: 7, rewardGems: 50, rewardXp: 200, currentProgress: (xp: number, lessons: number, streak: number) => streak },
];

export default function QuestsPage() {
  const { xp, gems, streak, completedLessonIds, addGems, addXp, fetchProgress, language } = useUserStore();
  const t = translations.quests;
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [claimedIds, setClaimedIds] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('deepdive_claimed_quests') || '[]');
        if (Array.isArray(saved)) setClaimedIds(saved);
      } catch {}
    }
  }, []);

  const questsToDisplay = activeTab === 'daily' ? dailyQuests : monthlyQuests;

  const handleClaim = async (questId: number, rGems: number, rXp: number) => {
    if (claimedIds.includes(questId)) return;

    const nextClaimed = [...claimedIds, questId];
    setClaimedIds(nextClaimed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepdive_claimed_quests', JSON.stringify(nextClaimed));
    }

    // Optimistically award gems & XP
    addGems(rGems);
    addXp(rXp);

    const authUser = useAuthStore.getState().user;
    const targetUserId = authUser?.id || '00000000-0000-0000-0000-000000000002';
    const token = useAuthStore.getState().token;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:8000/api/v1/users/${targetUserId}/rewards/claim`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ gems: rGems, xp: rXp })
      });

      if (res.ok) {
        const data = await res.json();
        // Synchronize store with confirmed backend values
        useUserStore.setState({
          gems: data.gems,
          xp: data.xp
        });
      } else {
        await fetchProgress(targetUserId);
      }
    } catch (e) {
      console.error('Failed to persist quest reward:', e);
    }
  };


  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000313] dark:text-white">{t.title[language]}</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#F0F8FF] dark:bg-[#0a1128] px-4 py-2 rounded-xl text-[#FFC800] font-bold">
            <Star size={20} fill="currentColor" /> {xp} XP
          </div>
          <div className="flex items-center gap-2 bg-[#F0F8FF] dark:bg-[#0a1128] border border-[#84D8FF]/40 dark:border-blue-900/40 px-4 py-2 rounded-xl text-[#00BCD4] font-bold">
            <Gem size={20} fill="currentColor" /> {gems}
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-4 font-extrabold text-lg uppercase tracking-wide rounded-2xl transition-all border-2 ${
            activeTab === 'daily'
              ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-[#1e91a3]'
              : 'bg-white dark:bg-[#000313] text-[#000313] dark:text-white border-[#00031333] dark:border-white/20 hover:bg-[#F8F8F8] dark:bg-[#060a1d]'
          }`}
        >
          {t.daily[language]}
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 py-4 font-extrabold text-lg uppercase tracking-wide rounded-2xl transition-all border-2 ${
            activeTab === 'monthly'
              ? 'bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] border-[#1e91a3]'
              : 'bg-white dark:bg-[#000313] text-[#000313] dark:text-white border-[#00031333] dark:border-white/20 hover:bg-[#F8F8F8] dark:bg-[#060a1d]'
          }`}
        >
          {t.monthly[language]}
        </button>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {questsToDisplay.map((quest) => {
          const progress = Math.min(
            quest.currentProgress(xp, completedLessonIds.length, streak),
            quest.target
          );
          const isCompleted = progress >= quest.target;
          const isClaimed = claimedIds.includes(quest.id);

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border-2 flex items-center justify-between gap-6 transition-all ${
                isClaimed ? 'bg-[#F8F8F8] dark:bg-[#060a1d] border-[#00031311] dark:border-white/10 opacity-60' : 'bg-white dark:bg-[#000313] border-[#00031333] dark:border-white/20'
              }`}
            >
              <div className="flex items-center gap-6 flex-1">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#0ba2b3]/20`}>
                  {activeTab === 'daily' ? (
                    <Target size={32} className="text-[#0ba2b3]" />
                  ) : (
                    <CalendarDays size={32} className="text-[#0ba2b3]" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`font-extrabold text-lg mb-2 ${isClaimed ? 'text-[#00031380]' : 'text-[#000313] dark:text-white'}`}>
                    {t[quest.key as keyof typeof t]?.[language] || quest.key}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[#00031311] dark:bg-white/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isClaimed ? 'bg-[#00031333] dark:bg-white/20' : 'bg-[#0ba2b3]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress / quest.target) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className={`font-bold text-sm ${isClaimed ? 'text-[#00031380]' : 'text-[#0ba2b3]'}`}>
                      {progress} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards / Claim Button */}
              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                <div className="flex items-center gap-3">
                  {quest.rewardGems > 0 && (
                    <div className="flex items-center gap-1 text-[#00BCD4] font-bold text-sm">
                      <Gem size={16} fill="currentColor" /> +{quest.rewardGems}
                    </div>
                  )}
                  {quest.rewardXp > 0 && (
                    <div className="flex items-center gap-1 text-[#FFC800] font-bold text-sm">
                      <Star size={16} fill="currentColor" /> +{quest.rewardXp}
                    </div>
                  )}
                </div>

                {isClaimed ? (
                  <button disabled className="bg-[#00031333] dark:bg-white/20 text-[#000313] dark:text-white font-bold px-6 py-2.5 rounded-xl text-sm w-full">
                    {t.claimed[language]}
                  </button>
                ) : isCompleted ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(quest.id, quest.rewardGems, quest.rewardXp)}
                    className="bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold px-6 py-2.5 rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all text-sm w-full"
                  >
                    {t.claim[language]}
                  </motion.button>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
