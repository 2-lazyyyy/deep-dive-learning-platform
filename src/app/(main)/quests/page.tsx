'use client';

import { useUserStore } from '@/store/use-user-store';
import { motion } from 'framer-motion';
import { Target, Zap, Gem, CheckCircle, CalendarDays, Award } from 'lucide-react';
import { useState } from 'react';

// Mock data for quests
const dailyQuests = [
  { id: 1, title: 'Earn 50 XP', target: 50, rewardGems: 10, rewardXp: 0, currentProgress: (xp: number) => xp },
  { id: 2, title: 'Complete 3 Lessons', target: 3, rewardGems: 15, rewardXp: 50, currentProgress: (xp: number, lessons: number) => lessons },
  { id: 3, title: 'Score a perfect lesson', target: 1, rewardGems: 20, rewardXp: 0, currentProgress: () => 0 },
];

const monthlyQuests = [
  { id: 4, title: 'Earn 1000 XP', target: 1000, rewardGems: 100, rewardXp: 500, currentProgress: (xp: number) => xp },
  { id: 5, title: 'Reach a 7-day streak', target: 7, rewardGems: 50, rewardXp: 200, currentProgress: (xp: number, lessons: number, streak: number) => streak },
];

export default function QuestsPage() {
  const { xp, gems, streak, completedLessonIds, addGems, addXp } = useUserStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [claimedIds, setClaimedIds] = useState<number[]>([]);

  const questsToDisplay = activeTab === 'daily' ? dailyQuests : monthlyQuests;

  const handleClaim = (questId: number, rGems: number, rXp: number) => {
    if (claimedIds.includes(questId)) return;
    addGems(rGems);
    addXp(rXp);
    setClaimedIds((prev) => [...prev, questId]);
  };

  return (
    <div className="pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Target size={40} className="text-[#FF9600]" strokeWidth={2.5} />
          <h1 className="text-3xl font-extrabold text-[#4B4B4B]">Quests</h1>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#DDF4FF] px-4 py-2 rounded-xl text-[#1CB0F6] font-bold">
            <Zap size={20} fill="currentColor" /> {xp} XP
          </div>
          <div className="flex items-center gap-2 bg-[#F3F3F3] px-4 py-2 rounded-xl text-[#1CB0F6] font-bold">
            <Gem size={20} fill="currentColor" /> {gems}
          </div>
        </div>
      </div>

      <p className="text-lg text-[#AFAFAF] font-bold mb-8">
        Complete quests to earn rewards!
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-4 font-extrabold text-lg uppercase tracking-wide rounded-2xl transition-all border-2 ${
            activeTab === 'daily'
              ? 'bg-[#E8F5E9] text-[#58CC02] border-[#46A302]'
              : 'bg-white text-[#AFAFAF] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          Daily Quests
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 py-4 font-extrabold text-lg uppercase tracking-wide rounded-2xl transition-all border-2 ${
            activeTab === 'monthly'
              ? 'bg-[#F3E8FF] text-[#CE82FF] border-[#A86BD8]'
              : 'bg-white text-[#AFAFAF] border-[#E5E5E5] hover:bg-[#F7F7F7]'
          }`}
        >
          Monthly Quests
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
              className={`p-6 rounded-2xl border-2 flex items-center justify-between gap-6 ${
                isClaimed ? 'bg-[#F7F7F7] border-[#E5E5E5]' : 'bg-white border-[#E5E5E5]'
              }`}
            >
              <div className="flex items-center gap-6 flex-1">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activeTab === 'daily' ? 'bg-[#FF9600]/20' : 'bg-[#CE82FF]/20'
                }`}>
                  {activeTab === 'daily' ? (
                    <Target size={32} className="text-[#FF9600]" />
                  ) : (
                    <CalendarDays size={32} className="text-[#CE82FF]" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`font-extrabold text-lg mb-2 ${isClaimed ? 'text-[#AFAFAF]' : 'text-[#4B4B4B]'}`}>
                    {quest.title}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[#E5E5E5] rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isClaimed ? 'bg-[#AFAFAF]' : 'bg-[#58CC02]'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress / quest.target) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className={`font-bold text-sm ${isClaimed ? 'text-[#AFAFAF]' : 'text-[#58CC02]'}`}>
                      {progress} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards / Claim Button */}
              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                <div className="flex items-center gap-3">
                  {quest.rewardGems > 0 && (
                    <div className="flex items-center gap-1 text-[#1CB0F6] font-bold text-sm">
                      <Gem size={16} fill="currentColor" /> +{quest.rewardGems}
                    </div>
                  )}
                  {quest.rewardXp > 0 && (
                    <div className="flex items-center gap-1 text-[#FFC800] font-bold text-sm">
                      <Zap size={16} fill="currentColor" /> +{quest.rewardXp}
                    </div>
                  )}
                </div>

                {isClaimed ? (
                  <button disabled className="bg-[#E5E5E5] text-[#AFAFAF] font-bold px-6 py-2.5 rounded-xl text-sm w-full">
                    CLAIMED
                  </button>
                ) : isCompleted ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(quest.id, quest.rewardGems, quest.rewardXp)}
                    className="bg-[#58CC02] hover:bg-[#46A302] text-white font-extrabold px-6 py-2.5 rounded-xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all text-sm w-full"
                  >
                    CLAIM
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
