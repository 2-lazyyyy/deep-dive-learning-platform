'use client';

import { useUserStore } from '@/store/use-user-store';
import { useChallengeStore } from '@/store/use-challenge-store';
import { motion } from 'framer-motion';
import { Swords, CheckCircle, Star, Gem, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ChallengeDashboard() {
  const { completedChallenges } = useUserStore();
  const { challenges } = useChallengeStore();

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-[#0ba2b3] bg-[#F0F8FF] border-[#0ba2b3]';
      case 'medium': return 'text-[#FF9600] bg-[#FFF3E0] border-[#FF9600]';
      case 'hard': return 'text-[#FC4B0B] bg-[#FFEBEE] border-[#FC4B0B]';
      default: return 'text-[#1C1D20] bg-[#F8F8F8] border-[#1C1D2033]';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1C1D20]">Coding Challenges</h1>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.length === 0 ? (
          <div className="col-span-full bg-white border-2 border-[#1C1D2033] border-dashed rounded-2xl p-12 text-center text-[#6B7280]">
            <Swords size={48} className="mx-auto mb-4 opacity-30" />
            <h3 className="font-extrabold text-lg text-[#1C1D20]">No challenges available</h3>
            <p className="font-bold text-sm">Wait for your teachers to create new challenges.</p>
          </div>
        ) : (
          challenges.map((challenge, idx) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            const isLocked = false; 

            return (
              <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                <motion.div
                  whileHover={!isLocked ? { scale: 1.02 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  className={`p-6 rounded-2xl border-2 flex flex-col h-full transition-all ${
                    isCompleted
                      ? 'bg-[#F8F8F8] border-[#1C1D2033]'
                      : isLocked
                      ? 'bg-white border-[#1C1D2033] opacity-60 cursor-not-allowed'
                      : 'bg-white border-[#1C1D2033] hover:border-[#0ba2b3] hover:shadow-sm cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className={`text-xl font-extrabold ${isCompleted ? 'text-[#1C1D20]' : 'text-[#1C1D20]'}`}>
                      {challenge.title}
                    </h2>
                    {isCompleted ? (
                      <CheckCircle size={28} className="text-[#0ba2b3]" fill="white" />
                    ) : isLocked ? (
                      <Lock size={28} className="text-[#0ba2b3]" />
                    ) : null}
                  </div>

                  <p className="text-sm font-bold text-[#6B7280] mb-4 flex-1">
                    Created by <span className="text-[#1C1D20]">{challenge.creatorName}</span>
                  </p>

                  <div className="flex items-center gap-2 mb-6">
                    <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border-2 ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t-2 border-[#1C1D2033] pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[#FFC800] font-bold text-sm">
                        <Star size={18} fill="currentColor" /> {challenge.xpReward} XP
                      </div>
                      <div className="flex items-center gap-1.5 text-[#00BCD4] font-bold text-sm">
                        <Gem size={18} fill="currentColor" /> {Math.floor(challenge.xpReward / 10)}
                      </div>
                    </div>
                    
                    {!isCompleted && !isLocked && (
                      <span className="text-[#0ba2b3] font-extrabold text-sm uppercase tracking-wider">
                        Solve
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
