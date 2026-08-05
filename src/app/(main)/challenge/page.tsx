'use client';

import { useUserStore } from '@/store/use-user-store';
import { challenges } from '@/data/challenges';
import { motion } from 'framer-motion';
import { Swords, CheckCircle, Zap, Gem, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ChallengeDashboard() {
  const { completedChallenges, level } = useUserStore();

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-[#58CC02] bg-[#E8F5E9] border-[#58CC02]';
      case 'Medium': return 'text-[#FF9600] bg-[#FFF3E0] border-[#FF9600]';
      case 'Hard': return 'text-[#FF4B4B] bg-[#FFEBEE] border-[#FF4B4B]';
      default: return 'text-[#AFAFAF] bg-[#F7F7F7] border-[#E5E5E5]';
    }
  };

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-10 py-8 border-b-2 border-[#E5E5E5]">
        <div className="w-20 h-20 bg-[#FF4B4B]/20 rounded-2xl flex items-center justify-center mb-4">
          <Swords size={48} className="text-[#FF4B4B]" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#4B4B4B] mb-2">Coding Challenges</h1>
        <p className="text-lg text-[#AFAFAF] font-bold max-w-xl mx-auto">
          Test your Python skills with Leetcode-style algorithmic challenges. Complete them to earn massive XP and Gems!
        </p>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge, idx) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          // Unlock Medium/Hard based on level or just leave them open. We'll leave them open for now.
          const isLocked = false; 

          return (
            <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
              <motion.div
                whileHover={!isLocked ? { scale: 1.02 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                className={`p-6 rounded-2xl border-2 flex flex-col h-full transition-all ${
                  isCompleted
                    ? 'bg-[#F7F7F7] border-[#E5E5E5]'
                    : isLocked
                    ? 'bg-white border-[#E5E5E5] opacity-60 cursor-not-allowed'
                    : 'bg-white border-[#E5E5E5] hover:border-[#FF4B4B] hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-extrabold ${isCompleted ? 'text-[#AFAFAF]' : 'text-[#4B4B4B]'}`}>
                    {idx + 1}. {challenge.title}
                  </h2>
                  {isCompleted ? (
                    <CheckCircle size={28} className="text-[#58CC02]" fill="white" />
                  ) : isLocked ? (
                    <Lock size={28} className="text-[#AFAFAF]" />
                  ) : null}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t-2 border-[#E5E5E5] pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[#FFC800] font-bold text-sm">
                      <Zap size={18} fill="currentColor" /> {challenge.rewardXp} XP
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1CB0F6] font-bold text-sm">
                      <Gem size={18} fill="currentColor" /> {challenge.rewardGems}
                    </div>
                  </div>
                  
                  {!isCompleted && !isLocked && (
                    <span className="text-[#FF4B4B] font-extrabold text-sm uppercase tracking-wider">
                      Solve
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
