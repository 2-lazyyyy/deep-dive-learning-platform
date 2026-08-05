'use client';

import { useUserStore } from '@/store/use-user-store';
import { units, getAllLessons } from '@/data/lessons';
import { LessonNode } from '@/components/lesson-node';

import { Heart, Flame, Zap, Trophy, Target, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

// Duolingo color pairs per unit
const unitThemes = [
  { bg: 'bg-[#58CC02]', border: 'border-[#46A302]', color: '#58CC02', colorDark: '#46A302', text: 'text-white' },
  { bg: 'bg-[#1CB0F6]', border: 'border-[#1899D6]', color: '#1CB0F6', colorDark: '#1899D6', text: 'text-white' },
  { bg: 'bg-[#CE82FF]', border: 'border-[#A86BD8]', color: '#CE82FF', colorDark: '#A86BD8', text: 'text-white' },
  { bg: 'bg-[#FF9600]', border: 'border-[#E08500]', color: '#FF9600', colorDark: '#E08500', text: 'text-white' },
];

export default function Home() {
  const { hearts, xp, streak, gems, completedLessonIds } = useUserStore();
  const allLessons = getAllLessons();

  // Determine lesson status based on completion
  const getLessonStatus = (lessonId: string, lessonIndex: number) => {
    if (completedLessonIds.includes(lessonId)) return 'completed' as const;

    const previousLessons = allLessons.slice(0, lessonIndex);
    const allPreviousCompleted = previousLessons.every((l) =>
      completedLessonIds.includes(l.id)
    );

    if (allPreviousCompleted) return 'current' as const;
    return 'locked' as const;
  };

  // Snake path zigzag offsets
  const getSnakeOffset = (index: number) => {
    const pattern = [0, 55, 80, 55, 0, -55, -80, -55];
    return pattern[index % pattern.length];
  };

  let globalLessonIndex = 0;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Right Sidebar (Stats) */}
      <div className="w-[368px] sticky top-6 flex-col gap-y-4 hidden lg:flex self-start">
          <div className="flex items-center justify-between w-full border-2 border-[#E5E5E5] p-4 rounded-xl bg-white">
            <div className="flex items-center gap-x-1.5 text-[#FF4B4B] font-bold">
              <Heart fill="currentColor" size={22} /> {hearts}
            </div>
            <div className="flex items-center gap-x-1.5 text-[#FFC800] font-bold">
              <Zap fill="currentColor" size={22} /> {xp}
            </div>
            <div className="flex items-center gap-x-1.5 text-[#FF9600] font-bold">
              <Flame fill="currentColor" size={22} /> {streak}
            </div>
            <div className="flex items-center gap-x-1.5 text-[#1CB0F6] font-bold">
              <Gem fill="currentColor" size={22} /> {gems}
            </div>
          </div>

        {/* Progress Summary */}
        <div className="border-2 border-[#E5E5E5] p-4 rounded-xl bg-white">
          <p className="text-sm font-bold text-[#AFAFAF] uppercase tracking-wider mb-2">
            Progress
          </p>
          <div className="w-full bg-[#E5E5E5] rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-[#58CC02] h-full rounded-full relative"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  allLessons.length > 0
                    ? (completedLessonIds.length / allLessons.length) * 100
                    : 0
                }%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="bg-white h-1 absolute left-2 right-2 top-0.5 rounded-full opacity-30" />
            </motion.div>
          </div>
          <p className="text-xs text-[#AFAFAF] font-semibold mt-2">
            {completedLessonIds.length} / {allLessons.length} lessons completed
          </p>
        </div>

        {/* Rank Box */}
        <div className="border-2 border-[#E5E5E5] p-4 rounded-xl bg-white hover:bg-gray-50 transition cursor-pointer flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#4B4B4B] text-lg">Bronze League</h3>
            <p className="text-sm font-semibold text-[#1CB0F6]">Rank #1</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFC800]/20 flex items-center justify-center">
            <Trophy className="text-[#FFC800]" size={28} />
          </div>
        </div>

        {/* Daily Quests Box */}
        <div className="border-2 border-[#E5E5E5] p-4 rounded-xl bg-white hover:bg-gray-50 transition cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#4B4B4B] text-lg">Daily Quests</h3>
            <Target className="text-[#FF9600]" size={24} />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1CB0F6]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="text-[#1CB0F6]" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#4B4B4B] mb-1">Earn 50 XP</p>
              <div className="w-full bg-[#E5E5E5] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#1CB0F6] h-full rounded-full w-[40%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Tree */}
      <div className="w-full flex flex-col items-center pb-20">
        {units.map((unit, unitIdx) => {
          const theme = unitThemes[unitIdx % unitThemes.length];
          const unitLessons = unit.modules.flatMap((m) => m.lessons);
          const unitCompleted = unitLessons.filter((l) =>
            completedLessonIds.includes(l.id)
          ).length;
          const unitProgress = Math.round(
            (unitCompleted / unitLessons.length) * 100
          );

          // Strip "Unit X: " prefix from unit title for display
          const moduleTitle = unit.title.replace(/^Unit \d+:\s*/, '');

          return (
            <div key={unit.id} className="w-full mb-6">
              {/* Module Banner (Title Card) — one per unit */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full p-5 rounded-2xl ${theme.bg} ${theme.text} border-b-4 ${theme.border} mb-8`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest opacity-80 mb-0.5">
                      UNIT {unitIdx + 1}
                    </p>
                    <h2 className="text-lg font-extrabold">
                      Module {unitIdx + 1}: {moduleTitle}
                    </h2>
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                        animate={{
                          strokeDashoffset:
                            2 * Math.PI * 20 * (1 - unitCompleted / unitLessons.length),
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold">
                      {unitProgress}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Lesson groups (sections within the module) */}
              {unit.modules.map((section) => {
                return (
                  <div key={section.id} className="mb-8">
                    {/* Section label */}
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#AFAFAF]">
                        {section.title}
                      </span>
                    </div>

                    {/* Lesson Nodes — Snake path */}
                    <div className="flex flex-col items-center">
                      {section.lessons.map((lesson) => {
                        const currentGlobalIndex = globalLessonIndex;
                        globalLessonIndex++;
                        const status = getLessonStatus(
                          lesson.id,
                          currentGlobalIndex
                        );

                        return (
                          <LessonNode
                            key={lesson.id}
                            lessonId={lesson.id}
                            lessonNumber={currentGlobalIndex + 1}
                            status={status}
                            offsetX={getSnakeOffset(currentGlobalIndex)}
                            color={theme.color}
                            colorDark={theme.colorDark}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
