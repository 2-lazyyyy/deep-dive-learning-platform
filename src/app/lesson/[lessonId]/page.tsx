'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { CodeSandbox } from '@/components/code-sandbox';
import { FillBlanksExercise } from '@/components/fill-blanks-exercise';
import { MultipleChoiceExercise } from '@/components/multiple-choice-exercise';
import { ResultModal } from '@/components/result-modal';
import { HeartsModal } from '@/components/hearts-modal';
import { useUserStore } from '@/store/use-user-store';
import { useLessonStore } from '@/store/use-lesson-store';
import { ContentBlock } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, X, BookOpen, Code, Image as ImageIcon, Video, ChevronLeft, ChevronRight, Star, Target } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const [isMounted, setIsMounted] = useState(false);
  const [mobileTab, setMobileTab] = useState<'lesson' | 'code'>('lesson');

  const { fetchProgress } = useUserStore();

  useEffect(() => {
    setIsMounted(true);
    fetchProgress('00000000-0000-0000-0000-000000000002');
    useLessonStore.getState().fetchLessons();
  }, [fetchProgress]);
  const { units, getLessonById, getNextLessonId, getAllLessons } = useLessonStore();
  const lesson = getLessonById(lessonId);
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);

  const { hearts, xp, addXp, reduceHeart, completeLesson, completedLessonIds } = useUserStore();

  let currentUnit = units[0];
  let currentModule = units[0].modules[0];
  let currentUnitLessons = currentUnit.modules.flatMap(m => m.lessons);

  units.forEach(u => {
    u.modules.forEach(m => {
      if (m.lessons.some(l => l.id === lessonId)) {
        currentUnit = u;
        currentModule = m;
        currentUnitLessons = u.modules.flatMap(mod => mod.lessons);
      }
    });
  });

  const isLastInModule = currentModule?.lessons[currentModule.lessons.length - 1].id === lessonId;

  const lessonIndex = currentUnitLessons.findIndex(l => l.id === lessonId);
  const globalFirstUncompletedIndex = allLessons.findIndex(l => !completedLessonIds.includes(l.id));
  const maxGlobalAccessibleIndex = globalFirstUncompletedIndex === -1 ? allLessons.length - 1 : globalFirstUncompletedIndex;

  const isLessonLocked = (id: string) => {
    const idx = allLessons.findIndex(l => l.id === id);
    return idx > maxGlobalAccessibleIndex;
  };

  // For arrows navigation
  const prevLesson = lessonIndex > 0 ? currentUnitLessons[lessonIndex - 1] : null;
  const nextLesson = (lessonIndex < currentUnitLessons.length - 1 && !isLessonLocked(currentUnitLessons[lessonIndex + 1].id))
    ? currentUnitLessons[lessonIndex + 1]
    : null;

  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const isPractice = completedLessonIds.includes(lessonId);
  const xpReward = isPractice ? 5 : (lesson?.xpReward || 0);

  const handleSuccess = useCallback(async () => {
    setIsCorrect(true);
    setShowResult(true);
    addXp(xpReward);
    completeLesson(lessonId);

    if (lesson?.lessonType !== 'code_fix') {
      try {
        await fetch(`http://localhost:8000/api/v1/users/00000000-0000-0000-0000-000000000002/progress/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson_id: lessonId, passed: true, is_practice: isPractice })
        });
      } catch (e) {
        console.error("Failed to update progress on backend", e);
      }
    }
  }, [lessonId, xpReward, addXp, completeLesson, lesson?.lessonType, isPractice]);

  const handleError = useCallback(async () => {
    if (!isPractice) {
      reduceHeart();
    }
    setIsCorrect(false);
    setShowResult(true);
    if (!isPractice && hearts <= 1) {
      setTimeout(() => setShowHeartsModal(true), 1500);
    }
    
    if (lesson?.lessonType !== 'code_fix') {
      try {
        await fetch(`http://localhost:8000/api/v1/users/00000000-0000-0000-0000-000000000002/progress/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lesson_id: lessonId, passed: false, is_practice: isPractice })
        });
      } catch (e) {
        console.error("Failed to update progress on backend", e);
      }
    }
  }, [hearts, reduceHeart, lessonId, lesson?.lessonType, isPractice]);

  const handleContinue = useCallback(() => {
    setShowResult(false);
    if (isCorrect) {
      if (isLastInModule) {
        setIsFinished(true);
      } else {
        const nextId = getNextLessonId(lessonId);
        if (nextId) router.push(`/lesson/${nextId}`);
        else router.push('/');
      }
    }
  }, [isCorrect, isLastInModule, lessonId, getNextLessonId, router]);

  const handleFinalComplete = useCallback(() => {
    const nextId = getNextLessonId(lessonId);
    if (nextId) {
      router.push(`/lesson/${nextId}`);
    } else {
      router.push('/');
    }
  }, [lessonId, getNextLessonId, router]);

  if (!isMounted) return null;

  if (!lesson) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F8F8] dark:bg-[#060a1d]">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">Lesson Not Found</h1>
        <p className="text-[#000313] dark:text-white font-semibold mb-6">This lesson doesn&apos;t exist.</p>
        <Link
          href="/"
          className="bg-[#0ba2b3] text-white font-extrabold px-6 py-3 rounded-xl hover:bg-[#1e91a3]"
        >
          GO HOME
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#000313]">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-10">
          <motion.img 
            src="/mascot2.svg" 
            alt="Mascot"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-8 drop-shadow-2xl"
          />
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-extrabold text-[#FFC800] mb-8"
          >
            Module Complete!
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 flex-wrap justify-center"
          >
            <div className="flex flex-col items-center p-4 border-2 border-[#FFC800] rounded-2xl bg-[#FFC800]/10 min-w-[140px]">
              <span className="text-sm font-bold text-[#FFC800] uppercase mb-1">Total XP</span>
              <div className="flex items-center gap-1.5 text-2xl font-extrabold text-[#FFC800]">
                <Star size={24} fill="currentColor" />
                <span>+{xpReward}</span>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 border-2 border-[#0ba2b3] rounded-2xl bg-[#0ba2b3]/10 min-w-[140px]">
              <span className="text-sm font-bold text-[#0ba2b3] uppercase mb-1">Accuracy</span>
              <div className="flex items-center gap-1.5 text-2xl font-extrabold text-[#0ba2b3]">
                <Target size={24} strokeWidth={3} />
                <span>100%</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20, delay: 0.8 }}
          className="p-6 border-t-2 border-[#00031333] dark:border-white/20 max-w-4xl w-full mx-auto flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full bg-white dark:bg-[#000313] text-[#0ba2b3] border-2 border-[#0ba2b3] font-extrabold py-4 rounded-2xl text-lg hover:bg-[#0ba2b3]/10 transition uppercase"
          >
            Home
          </button>
          <button
            onClick={handleFinalComplete}
            className="w-full bg-[#0ba2b3] text-white font-extrabold py-4 rounded-2xl text-lg hover:bg-[#1e91a3] transition shadow-[0_4px_0_0_#157a87] active:shadow-none active:translate-y-1 uppercase"
          >
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8F8F8] dark:bg-[#060a1d]">
      <div className="flex items-center justify-between px-3 md:px-6 py-4 bg-white dark:bg-[#000313] border-b-2 border-[#00031333] dark:border-white/20 gap-2 md:gap-4 h-[76px]">
        {/* Left: Exit, Hearts, and Progress */}
        <div className="flex items-center gap-3 md:gap-6 flex-1 max-w-[800px]">
          <Link href="/">
            <div className="w-10 h-10 rounded-xl border-2 border-[#00031333] dark:border-white/20 flex items-center justify-center text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:bg-[#060a1d] cursor-pointer transition-colors">
              <X size={24} strokeWidth={3} />
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-[#FC4B0B] font-extrabold text-xl whitespace-nowrap">
            <Heart fill="currentColor" size={28} /> {hearts}
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center justify-start flex-1 ml-2 md:ml-4 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center min-w-full relative px-1">
              <div className="absolute left-1 right-1 h-1 bg-[#00031333] dark:bg-white/20 rounded-full z-0 top-1/2 -translate-y-1/2" />
              <div className="flex items-center justify-between w-full relative z-10 gap-3 md:gap-4">
                {currentUnitLessons.map((l, idx) => {
                  const isCurrent = idx === lessonIndex;
                  const isCompleted = completedLessonIds.includes(l.id);
                  const isLocked = isLessonLocked(l.id);

                  return (
                    <Link 
                      key={l.id} 
                      href={isLocked ? '#' : `/lesson/${l.id}`} 
                      onClick={(e) => { if (isLocked) e.preventDefault(); }} 
                      title={l.title}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all cursor-pointer ${isLocked ? 'opacity-30 bg-white dark:bg-[#000313] border-[#00031333] dark:border-white/20' : ''} ${!isLocked && isCurrent
                            ? 'bg-white dark:bg-[#000313] border-[#0ba2b3] w-5 h-5 shadow-[0_0_0_4px_rgba(28,176,246,0.2)]'
                            : !isLocked && isCompleted
                              ? 'bg-[#0ba2b3] border-[#0ba2b3]'
                              : !isLocked
                                ? 'bg-white dark:bg-[#000313] border-[#00031333] dark:border-white/20'
                                : ''
                          }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dropdowns & Arrows */}
        <div className="flex items-center justify-end gap-4 flex-1">
          {/* Dropdowns */}
          <div className="hidden md:flex items-center gap-3">
            <select
              className="px-4 py-2 rounded-xl border-2 border-[#00031333] dark:border-white/20 font-bold text-[#000313] dark:text-white bg-white dark:bg-[#000313] outline-none cursor-pointer focus:border-[#0ba2b3] hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition"
              value={currentUnit.id}
              onChange={(e) => {
                const unit = units.find(u => u.id === e.target.value);
                if (unit && unit.modules.length > 0 && unit.modules[0].lessons.length > 0) {
                  const targetLessonId = unit.modules[0].lessons[0].id;
                  if (!isLessonLocked(targetLessonId)) {
                    router.push(`/lesson/${targetLessonId}`);
                  }
                }
              }}
            >
              {units.map(u => {
                const firstLessonId = u.modules[0]?.lessons[0]?.id;
                const isLocked = firstLessonId ? isLessonLocked(firstLessonId) : false;
                return <option key={u.id} value={u.id} disabled={isLocked}>{u.title.replace('Unit', 'Module')} {isLocked ? '🔒' : ''}</option>;
              })}
            </select>
            <select
              className="px-4 py-2 rounded-xl border-2 border-[#00031333] dark:border-white/20 font-bold text-[#000313] dark:text-white bg-white dark:bg-[#000313] outline-none cursor-pointer focus:border-[#0ba2b3] hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition appearance-none"
              value={lessonId}
              onChange={(e) => {
                router.push(`/lesson/${e.target.value}`);
              }}
            >
              {currentUnitLessons.map((l, i) => {
                const isLocked = isLessonLocked(l.id);
                return (
                  <option key={l.id} value={l.id} disabled={isLocked}>L{i + 1}: {l.title} {isLocked ? '🔒' : ''}</option>
                );
              })}
            </select>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <Link href={prevLesson ? `/lesson/${prevLesson.id}` : '#'} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${prevLesson ? 'border-[#00031333] dark:border-white/20 text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:bg-[#060a1d] cursor-pointer' : 'border-[#F8F8F8] text-[#00031333] cursor-not-allowed'}`}>
              <ChevronLeft size={24} strokeWidth={3} />
            </Link>
            <Link href={nextLesson ? `/lesson/${nextLesson.id}` : '#'} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${nextLesson ? 'border-[#00031333] dark:border-white/20 text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:bg-[#060a1d] cursor-pointer' : 'border-[#F8F8F8] text-[#00031333] cursor-not-allowed'}`}>
              <ChevronRight size={24} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content — Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Lesson Content */}
        <div className={`w-full lg:w-1/2 h-full lg:h-full overflow-y-auto border-b-2 lg:border-b-0 lg:border-r-2 border-[#00031333] dark:border-white/20 bg-white dark:bg-[#000313] ${mobileTab === 'lesson' ? 'block' : 'hidden'} lg:block`}>
          <div className="p-8 max-w-xl mx-auto pb-24 lg:pb-8">
            {/* Lesson Title & Badges */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] px-2.5 py-1 rounded-full">
                  {lesson.unitTitle?.replace(/^Unit \d+:\s*/, '')}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] px-2.5 py-1 rounded-full">
                  {lesson.moduleTitle}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-4">{lesson.title}</h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-bold text-[#0ba2b3]">+{lesson.xpReward} XP</span>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-5">
              {lesson.contentBlocks.map((block, idx) => (
                <ContentBlockRenderer key={idx} block={block} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Exercise */}
        <div className={`w-full lg:w-1/2 h-full lg:h-full overflow-y-auto bg-[#F8F8F8] dark:bg-[#060a1d] ${mobileTab === 'code' ? 'block' : 'hidden'} lg:block`}>
          <div className="p-8 max-w-xl mx-auto h-full flex flex-col pb-24 lg:pb-8">
            {/* Exercise Header */}
            <div className="flex items-center gap-2 mb-5">
              <Code size={18} className="text-[#0ba2b3]" />
              <h2 className="font-extrabold text-[#000313] dark:text-white text-sm uppercase tracking-wider">
                {lesson.lessonType === 'code_fix'
                  ? 'Code Editor'
                  : lesson.lessonType === 'fill_blanks'
                    ? 'Fill in the Blanks'
                    : 'Choose the Answer'}
              </h2>
            </div>

            {/* Exercise Component */}
            <div className="flex-1 flex flex-col">
              {lesson.lessonType === 'code_fix' && (
                <CodeSandbox
                  key={`${lesson.id}-${retryCount}`}
                  lessonId={lesson.id}
                  initialCode={(lesson as any).initialCode}
                  expectedOutput={(lesson as any).expectedOutput}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  isPractice={isPractice}
                />
              )}

              {lesson.lessonType === 'fill_blanks' && (
                <FillBlanksExercise
                  key={`${lesson.id}-${retryCount}`}
                  codeTemplate={(lesson as any).codeTemplate}
                  correctTokens={(lesson as any).correctTokens}
                  tokenPool={(lesson as any).tokenPool}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {lesson.lessonType === 'multiple_choice' && (
                <MultipleChoiceExercise
                  key={`${lesson.id}-${retryCount}`}
                  question={(lesson as any).question}
                  options={(lesson as any).options}
                  correctIndex={(lesson as any).correctIndex}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex h-[60px] bg-white dark:bg-[#000313] border-t-2 border-[#00031333] dark:border-white/20 z-40">
        <button
          onClick={() => setMobileTab('lesson')}
          className={`flex-1 text-center font-extrabold text-sm tracking-wide transition-colors ${
            mobileTab === 'lesson' 
              ? 'text-[#0ba2b3] border-t-4 border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128]' 
              : 'text-[#000313] dark:text-white/70 hover:bg-[#F8F8F8] dark:hover:bg-white/5 border-t-4 border-transparent'
          }`}
        >
          Lesson
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 text-center font-extrabold text-sm tracking-wide transition-colors ${
            mobileTab === 'code' 
              ? 'text-[#0ba2b3] border-t-4 border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128]' 
              : 'text-[#000313] dark:text-white/70 hover:bg-[#F8F8F8] dark:hover:bg-white/5 border-t-4 border-transparent'
          }`}
        >
          Code
        </button>
      </div>

      {/* Modals */}
      {showResult && (
        <ResultModal
          isOpen={true}
          isSuccess={isCorrect}
          xpEarned={isCorrect ? xpReward : 0}
          onContinue={handleContinue}
          onRetry={() => {
            setShowResult(false);
            setRetryCount(prev => prev + 1);
          }}
        />
      )}
      {showHeartsModal && (
        <HeartsModal onClose={() => setShowHeartsModal(false)} />
      )}
    </div>
  );
}

// Render a single content block
function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="text-[15px] text-[#000313] dark:text-white leading-[1.8] font-medium space-y-4">
          {/* Simple markdown-like rendering */}
          {block.content.split('\n').map((line, i) => {
            if (!line.trim()) return null;
            // Bold
            const rendered = line.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="font-extrabold text-[#000313] dark:text-white">$1</strong>'
            ).replace(
              /`([^`]+)`/g,
              '<code class="bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] text-[#0ba2b3] px-2 py-0.5 rounded-md text-[13px] font-mono font-bold">$1</code>'
            );
            return (
              <p
                key={i}
                className="py-1"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            );
          })}
        </div>
      );

    case 'code':
      return (
        <div className="rounded-xl overflow-hidden border-2 border-[#84D8FF]">
          <pre className="bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] p-4 text-sm font-mono font-bold overflow-x-auto leading-relaxed">
            {block.content}
          </pre>
        </div>
      );

    case 'image':
      return (
        <div className="rounded-xl overflow-hidden border-2 border-[#00031333] dark:border-white/20">
          {block.content ? (
            <img src={block.content} alt={block.caption || 'Lesson image'} className="w-full object-cover" />
          ) : (
            <div className="bg-[#F8F8F8] dark:bg-[#060a1d] h-[180px] flex flex-col items-center justify-center">
              <ImageIcon size={32} className="text-[#000313] dark:text-white mb-2" />
              <p className="text-xs font-bold text-[#000313] dark:text-white">Image URL not provided</p>
            </div>
          )}
          {block.caption && (
            <div className="px-4 py-2 bg-white dark:bg-[#000313]">
              <p className="text-xs font-semibold text-[#000313] dark:text-white text-center">{block.caption}</p>
            </div>
          )}
        </div>
      );

    case 'video':
      const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (ytMatch && ytMatch[1]) {
          return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }
        return url;
      };
      
      return (
        <div className="rounded-xl overflow-hidden border-2 border-[#00031333] dark:border-white/20">
          {block.content ? (
            <div className="relative pt-[56.25%] bg-[#000313]">
              <iframe 
                src={getEmbedUrl(block.content)} 
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="bg-[#1E293B] h-[200px] flex flex-col items-center justify-center">
              <Video size={40} className="text-[#0ba2b3] mb-2" />
              <p className="text-xs font-bold text-[#6B7280] dark:text-gray-400">Video URL not provided</p>
            </div>
          )}
          {block.caption && (
            <div className="px-4 py-2 bg-white dark:bg-[#000313]">
              <p className="text-xs font-semibold text-[#000313] dark:text-white text-center">{block.caption}</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
