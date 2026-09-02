'use client';

import { useUserStore } from '@/store/use-user-store';
import { useLessonStore } from '@/store/use-lesson-store';
import { useState, useEffect, useRef } from 'react';
import { LessonNode } from '@/components/lesson-node';

import { Heart, Flame, Star, Trophy, Target, Gem, Award, Shield, Crown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { translations, getLocalizedUnitTitle, getLocalizedModuleTitle } from '@/lib/i18n';


// Duolingo color pairs per unit
const unitThemes = [
  { bg: 'bg-[#0ba2b3]', border: 'border-[#1e91a3]', color: '#0ba2b3', colorDark: '#1e91a3', text: 'text-white' },
  { bg: 'bg-[#0ba2b3]', border: 'border-[#1e91a3]', color: '#0ba2b3', colorDark: '#1e91a3', text: 'text-white' },
  { bg: 'bg-[#0ba2b3]', border: 'border-[#1e91a3]', color: '#0ba2b3', colorDark: '#1e91a3', text: 'text-white' },
  { bg: 'bg-[#0ba2b3]', border: 'border-[#1e91a3]', color: '#0ba2b3', colorDark: '#1e91a3', text: 'text-white' },
];

const pythonTips = {
  en: [
    "Tip: Use list comprehensions for cleaner code!",
    "Tip: 'enumerate()' gives you both index and value in loops.",
    "Tip: Use 'zip()' to iterate over multiple lists simultaneously.",
    "Tip: f-strings (f'Hello {name}') are the fastest way to format strings.",
    "Tip: 'dict.get(key, default)' is safer than 'dict[key]'.",
  ],
  my: [
    "အကြံပြုချက်: သန့်ရှင်းသောကုဒ်အတွက် list comprehensions ကို အသုံးပြုပါ!",
    "အကြံပြုချက်: loop များတွင် 'enumerate()' ဖြင့် index ရော value ပါ ရယူနိုင်ပါသည်။",
    "အကြံပြုချက်: list များကို တစ်ပြိုင်နက် loop ပတ်ရန် 'zip()' ကို အသုံးပြုပါ။",
    "အကြံပြုချက်: f-strings (f'Hello {name}') သည် string format ပြုလုပ်ရန် အမြန်ဆုံးနည်းလမ်း ဖြစ်သည်။",
    "အကြံပြုချက်: 'dict[key]' ထက် 'dict.get(key, default)' သုံးခြင်းက ပိုမိုလုံခြုံစိတ်ချရပါသည်။",
  ]
};

const InteractiveMascot = ({ positionClass }: { positionClass: string }) => {
  const language = useUserStore((state) => state.language);
  const [mascotImg, setMascotImg] = useState('/mascot1.svg');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mascotRef.current && !mascotRef.current.contains(event.target as Node)) {
        setCurrentTip('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Pick randomly from the other mascots
    const allMascots = [
      '/mascot1.svg', 
      '/mascot2.svg', 
      '/mascot3.svg', 
      '/mascot4.svg', 
      '/mascot5.svg'
    ];
    const available = allMascots.filter(m => m !== mascotImg);
    const nextMascot = available[Math.floor(Math.random() * available.length)];
    
    setMascotImg(nextMascot);
    
    // Pick a random Python tip
    let nextTip = currentTip;
    while (nextTip === currentTip) {
      const list = pythonTips[language] || pythonTips['en'];
      nextTip = list[Math.floor(Math.random() * list.length)];
    }
    setCurrentTip(nextTip);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div 
      ref={mascotRef}
      className={`absolute top-1/2 -translate-y-1/2 ${positionClass} z-20 cursor-pointer`}
      onClick={handleClick}
    >
      <motion.img 
        src={mascotImg} 
        alt="Interactive Mascot" 
        className="w-28 h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl select-none relative z-10 hover:scale-105 transition-transform" 
        animate={

          isAnimating 
            ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0], y: 0 } 
            : { y: [-8, 8, -8] }
        }
        transition={
          isAnimating 
            ? { duration: 0.5 } 
            : { repeat: Infinity, duration: 4, ease: "easeInOut" }
        }
      />
      <AnimatePresence>
        {currentTip && (
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-[#000313] border-2 border-[#0ba2b3] text-[#000313] dark:text-white px-4 py-3 rounded-2xl shadow-xl w-56 text-center text-sm font-bold pointer-events-none z-20"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#000313] border-l-2 border-t-2 border-[#0ba2b3] rotate-45"></div>
            <span className="relative z-10">{currentTip}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const { hearts, xp, streak, gems, completedLessonIds, language } = useUserStore();
  const { units, getAllLessons } = useLessonStore();
  const allLessons = getAllLessons();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fetch dynamic lessons & sync user progress from backend
    useLessonStore.getState().fetchLessons();
    useUserStore.getState().fetchProgress();
  }, []);

  // Determine lesson status based on completion (All unlocked for exploration & demo)
  const getLessonStatus = (lessonId: string, lessonIndex: number) => {
    if (completedLessonIds.includes(lessonId)) return 'completed' as const;

    const firstUncompletedIndex = allLessons.findIndex((l) => !completedLessonIds.includes(l.id));
    if (lessonIndex === firstUncompletedIndex || (firstUncompletedIndex === -1 && lessonIndex === 0)) {
      return 'current' as const;
    }

    // All lessons are unlocked for demo presentation
    return 'unlocked' as const;
  };

  // Snake path zigzag offsets
  const getSnakeOffset = (index: number) => {
    const pattern = [0, 55, 80, 55, 0, -55, -80, -55];
    return pattern[index % pattern.length];
  };

  let globalLessonIndex = 0;

  if (!isMounted) {
    return null;
  }

  const getLeagueDetails = (userXp: number) => {
    if (userXp < 1000) return { name: 'Bronze League', min: 0, max: 1000, color: '#CD7F32', icon: Award };
    if (userXp < 2500) return { name: 'Silver League', min: 1000, max: 2500, color: '#C0C0C0', icon: Shield };
    if (userXp < 4500) return { name: 'Gold League', min: 2500, max: 4500, color: '#FFC800', icon: Trophy };
    if (userXp < 7000) return { name: 'Platinum League', min: 4500, max: 7000, color: '#8CC6D7', icon: Star };
    if (userXp < 10000) return { name: 'Diamond League', min: 7000, max: 10000, color: '#00BCD4', icon: Gem };
    return { name: 'Ruby League', min: 10000, max: 15000, color: '#E0115F', icon: Crown };
  };
  
  const currentLeague = getLeagueDetails(xp);
  const xpProgressPercent = Math.min(100, Math.max(0, ((xp - currentLeague.min) / (currentLeague.max - currentLeague.min)) * 100));

  return (
    <div className="flex flex-row-reverse gap-[48px] px-3 sm:px-6 overflow-x-hidden">
      {/* Right Sidebar (Stats) */}

      <div className="w-[368px] sticky top-6 flex-col gap-y-4 hidden lg:flex self-start">
        <div className="flex items-center justify-between w-full border-2 border-[#00031333] dark:border-white/20 p-4 rounded-xl bg-white dark:bg-[#000313]">
          <div className="flex items-center gap-x-1.5 text-[#FC4B0B] font-bold">
            <Heart fill="currentColor" size={22} /> {hearts}
          </div>
          <div className="flex items-center gap-x-1.5 text-[#FFC800] font-bold">
            <Star fill="currentColor" size={22} /> {xp}
          </div>
          <div className="flex items-center gap-x-1.5 text-[#FF9600] font-bold">
            <Flame fill="currentColor" size={22} /> {streak}
          </div>
          <div className="flex items-center gap-x-1.5 text-[#00BCD4] font-bold">
            <Gem fill="currentColor" size={22} /> {gems}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="border-2 border-[#00031333] dark:border-white/20 p-4 rounded-xl bg-white dark:bg-[#000313]">
          <p className="text-sm font-bold text-[#000313] dark:text-white uppercase tracking-wider mb-2">
            {language === 'my' ? 'လေ့လာမှု တိုးတက်မှု' : 'Progress'}
          </p>
          <div className="w-full bg-[#00031333] dark:bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-[#0ba2b3] h-full rounded-full relative"
              initial={{ width: 0 }}
              animate={{
                width: `${allLessons.length > 0
                    ? (completedLessonIds.length / allLessons.length) * 100
                    : 0
                  }%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="bg-white dark:bg-[#000313] h-1 absolute left-2 right-2 top-0.5 rounded-full opacity-30" />
            </motion.div>
          </div>
          <p className="text-xs text-[#000313] dark:text-white font-semibold mt-2">
            {completedLessonIds.length} / {allLessons.length} {language === 'my' ? 'သင်ခန်းစာများ ပြီးစီး' : 'lessons completed'}
          </p>
        </div>

        {/* Rank Box */}
        <div 
          onClick={() => router.push('/leaderboard')}
          className="border-2 border-[#00031333] dark:border-white/20 p-4 rounded-xl bg-white dark:bg-[#000313] hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg" style={{ color: currentLeague.color }}>{currentLeague.name}</h3>
              <p className="text-sm font-semibold text-[#6B7280] dark:text-gray-400">
                {language === 'my' ? 'ထိပ်ဆုံး ၂၀ ဦး နောက် League သို့ တက်မည်' : 'Top 20 advance to next league'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border-2 border-[#00031311] dark:border-white/10" style={{ backgroundColor: `${currentLeague.color}15` }}>
              <currentLeague.icon size={28} style={{ color: currentLeague.color }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs font-extrabold text-[#6B7280] dark:text-gray-400 mb-1">
              <span>{currentLeague.min} XP</span>
              <span style={{ color: currentLeague.color }}>{xp} / {currentLeague.max} XP</span>
            </div>
            <div className="w-full bg-[#00031333] dark:bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full relative"
                style={{ backgroundColor: currentLeague.color }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="bg-white dark:bg-[#000313] h-1 absolute left-2 right-2 top-0.5 rounded-full opacity-30" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Daily Quests Box */}
        <div 
          onClick={() => router.push('/quests')}
          className="border-2 border-[#00031333] dark:border-white/20 p-4 rounded-xl bg-white dark:bg-[#000313] hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#000313] dark:text-white text-lg">
              {language === 'my' ? 'နေ့စဉ် မစ်ရှင်များ' : 'Daily Quests'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-[#000313] dark:text-white mb-1">
                {language === 'my' ? 'XP ၅၀ ရယူပါ' : 'Earn 50 XP'}
              </p>
              <div className="w-full bg-[#00031333] dark:bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#0ba2b3] h-full rounded-full w-[40%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 mt-4 mb-4">
          <Link href="/about" className="text-xs font-bold text-[#6B7280] dark:text-gray-400 hover:text-[#000313] dark:text-white transition uppercase tracking-wide">About</Link>
          <Link href="/contact" className="text-xs font-bold text-[#6B7280] dark:text-gray-400 hover:text-[#000313] dark:text-white transition uppercase tracking-wide">Contact</Link>
          <Link href="/terms" className="text-xs font-bold text-[#6B7280] dark:text-gray-400 hover:text-[#000313] dark:text-white transition uppercase tracking-wide">Terms</Link>
          <Link href="/privacy" className="text-xs font-bold text-[#6B7280] dark:text-gray-400 hover:text-[#000313] dark:text-white transition uppercase tracking-wide">Privacy</Link>
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

          const currentUnitStartIndex = globalLessonIndex;
          let targetMascotGlobalIdx = unitLessons.findIndex((_, idx) => {
            const gIndex = currentUnitStartIndex + idx;
            const offset = getSnakeOffset(gIndex);
            return Math.abs(offset) >= 55 && idx !== unitLessons.length - 1;
          });
          
          if (targetMascotGlobalIdx === -1 && unitLessons.length > 0) {
            targetMascotGlobalIdx = 0;
          }
          
          if (targetMascotGlobalIdx !== -1) {
            targetMascotGlobalIdx += currentUnitStartIndex;
          }

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
                      {getLocalizedUnitTitle(unit.title, language).replace(/^Unit \d+:\s*/, '')}
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
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#000313] dark:text-white">
                        {getLocalizedModuleTitle(section.title, language)}
                      </span>
                    </div>


                    {/* Lesson Nodes — Snake path */}
                    <div className="flex flex-col items-center">
                      {section.lessons.map((lesson, localIdx) => {
                        const currentGlobalIndex = globalLessonIndex;
                        globalLessonIndex++;
                        const status = getLessonStatus(
                          lesson.id,
                          currentGlobalIndex
                        );
                        
                        const offset = getSnakeOffset(currentGlobalIndex);
                        const showMascot = currentGlobalIndex === targetMascotGlobalIdx;

                        // If offset < 0 (left bend), put on right (ml). If offset > 0 (right bend), put on left (mr).
                        const mascotPositionClass = offset < 0 
                          ? "left-[50%] ml-8 sm:ml-24" 
                          : "right-[50%] mr-8 sm:mr-24";


                        return (
                          <div key={lesson.id} className="relative w-full flex justify-center">
                            {showMascot && (
                              <InteractiveMascot positionClass={mascotPositionClass} />
                            )}
                            <LessonNode
                              lessonId={lesson.id}
                              lessonNumber={currentGlobalIndex + 1}
                              status={status}
                              offsetX={getSnakeOffset(currentGlobalIndex)}
                              color={theme.color}
                              colorDark={theme.colorDark}
                            />
                          </div>
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
