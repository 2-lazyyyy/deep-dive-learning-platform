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
import { useAuthStore } from '@/store/use-auth-store';
import { ContentBlock } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, X, BookOpen, Code, Image as ImageIcon, Video, ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, Lock, Star, Target } from 'lucide-react';
import Link from 'next/link';
import { Chatbot } from '@/components/chatbot';
import { translations, getLocalizedLessonTitle, getLocalizedModuleTitle, getLocalizedUnitTitle, getLocalizedContentText, Language } from '@/lib/i18n';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const routeParam = params.lessonId as string;
  const [isMounted, setIsMounted] = useState(false);
  const [mobileTab, setMobileTab] = useState<'lesson' | 'code'>('lesson');
  const [isLessonMenuOpen, setIsLessonMenuOpen] = useState(false);

  const { fetchProgress } = useUserStore();

  useEffect(() => {
    setIsMounted(true);
    fetchProgress();
    useLessonStore.getState().fetchLessons();
  }, [fetchProgress]);
  const { units, getLessonById, getNextLessonId, getAllLessons } = useLessonStore();
  const lesson = getLessonById(routeParam);
  const lessonId = lesson?.id || routeParam;
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);

  const getCleanLessonUrl = (targetId: string) => {
    const idx = allLessons.findIndex((l) => l.id === targetId);
    return idx !== -1 ? `/lesson/${idx + 1}` : `/lesson/${targetId}`;
  };

  // Automatically replace long UUID URL with clean /lesson/N in address bar
  useEffect(() => {
    if (routeParam && !/^\d+$/.test(routeParam) && allLessons.length > 0) {
      const idx = allLessons.findIndex((l) => l.id === routeParam);
      if (idx !== -1) {
        router.replace(`/lesson/${idx + 1}`);
      }
    }
  }, [routeParam, allLessons, router]);

  const { hearts, xp, addXp, reduceHeart, completeLesson, completedLessonIds, language } = useUserStore();

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
  const unitNumber = currentUnit?.orderIndex || (currentUnit as any)?.order_index || (currentUnit?.title?.match(/Unit\s*(\d+)/i)?.[1]) || (units.findIndex(u => u.id === currentUnit?.id) + 1);

  // All lessons are unlocked for demonstration and evaluation
  const isLessonLocked = (_id: string) => false;

  // For arrows navigation
  const prevLesson = lessonIndex > 0 ? currentUnitLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < currentUnitLessons.length - 1 ? currentUnitLessons[lessonIndex + 1] : null;

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

    const authUser = useAuthStore.getState().user;
    const currentUserId = authUser?.id || '00000000-0000-0000-0000-000000000002';
    const token = useAuthStore.getState().token;

    if (lesson?.lessonType !== 'code_fix') {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch(`http://localhost:8000/api/v1/users/${currentUserId}/progress/update`, {
          method: 'POST',
          headers,
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
    
    const authUser = useAuthStore.getState().user;
    const currentUserId = authUser?.id || '00000000-0000-0000-0000-000000000002';
    const token = useAuthStore.getState().token;

    if (lesson?.lessonType !== 'code_fix') {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch(`http://localhost:8000/api/v1/users/${currentUserId}/progress/update`, {
          method: 'POST',
          headers,
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
      {/* Duolingo Lesson Top Navigation Bar */}
      <div className="w-full flex items-center justify-between px-3 sm:px-6 py-3 bg-white dark:bg-[#000313] border-b-2 border-[#00031333] dark:border-white/20 h-[76px] gap-2 sm:gap-4 shrink-0 z-30">
        {/* Left Side: Exit Button & Hearts */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <Link href="/" className="shrink-0">
            <div className="w-10 h-10 rounded-xl border-2 border-[#00031333] dark:border-white/20 flex items-center justify-center text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:bg-[#060a1d] cursor-pointer transition-colors" title={language === "my" ? "ထွက်မည်" : "Exit Lesson"}>
              <X size={22} strokeWidth={3} />
            </div>
          </Link>

          <div className="flex items-center gap-1.5 text-[#FC4B0B] font-extrabold text-lg sm:text-xl shrink-0 whitespace-nowrap">
            <Heart fill="currentColor" size={24} />
            <span>{hearts}</span>
          </div>
        </div>

        {/* Center: Connected Circular Progress Nodes / Dots (Original Design) */}
        <div className="flex-1 min-w-0 mx-2 sm:mx-4 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center min-w-full relative px-2">
            <div className="absolute left-2 right-2 h-1 bg-[#00031333] dark:bg-white/20 rounded-full z-0 top-1/2 -translate-y-1/2" />
            <div className="flex items-center justify-between w-full relative z-10 gap-2 sm:gap-3">
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
                    className="shrink-0"
                  >
                    <div
                      className={`rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                        isLocked 
                          ? 'opacity-30 bg-white dark:bg-[#000313] border-[#00031333] dark:border-white/20 w-4 h-4' 
                          : isCurrent
                            ? 'bg-white dark:bg-[#000313] border-[#0ba2b3] w-5 h-5 shadow-[0_0_0_4px_rgba(11,162,179,0.25)] ring-2 ring-[#0ba2b3]/30'
                            : isCompleted
                              ? 'bg-[#0ba2b3] border-[#0ba2b3] w-4 h-4'
                              : 'bg-white dark:bg-[#000313] border-[#00031333] dark:border-white/20 w-4 h-4'
                      }`}
                    >
                      {isCompleted && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Controls: Sleek Interactive Lesson Navigator Pill & Arrows */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {/* Modern Interactive Pill Button */}
          <div className="relative">
            <button
              onClick={() => setIsLessonMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border-2 border-[#00031320] dark:border-white/20 bg-white dark:bg-[#000313] hover:border-[#0ba2b3] dark:hover:border-[#0ba2b3] shadow-sm hover:shadow transition-all group active:translate-y-0.5 select-none"
            >
              <BookOpen size={16} className="text-[#0ba2b3] group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#000313] dark:text-white">
                <span className="text-gray-500 dark:text-gray-400 font-extrabold">Unit {unitNumber} •</span>
                <span className="text-[#0ba2b3]">L{lessonIndex + 1}</span>
                <span className="text-gray-400 font-medium">/{currentUnitLessons.length}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isLessonMenuOpen ? 'rotate-180 text-[#0ba2b3]' : ''}`} />
            </button>

            {/* Floating Beautiful Lesson Drawer / Popover Menu */}
            <AnimatePresence>
              {isLessonMenuOpen && (
                <>
                  {/* Backdrop to dismiss on click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLessonMenuOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-3xl p-3 shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Popover Header: Current Unit & Module Info */}
                    <div className="p-2 border-b-2 border-gray-100 dark:border-white/10 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0ba2b3]">
                        {currentUnit.title}
                      </span>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {getLocalizedModuleTitle(currentModule?.title || 'Lessons', language)}
                      </h4>
                    </div>

                    {/* Scrollable Lesson Items */}
                    <div className="max-h-64 overflow-y-auto flex flex-col gap-1 pr-1">
                      {currentUnitLessons.map((l, i) => {
                        const isCurrent = l.id === lessonId;
                        const isCompleted = completedLessonIds.includes(l.id);
                        const isLocked = isLessonLocked(l.id);

                        return (
                          <button
                            key={l.id}
                            disabled={isLocked}
                            onClick={() => {
                              setIsLessonMenuOpen(false);
                              router.push(getCleanLessonUrl(l.id));
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#0ba2b3]/10 border-2 border-[#0ba2b3] text-[#0ba2b3]'
                                : isLocked
                                ? 'opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600'
                                : 'hover:bg-gray-100 dark:hover:bg-white/5 text-[#000313] dark:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isCompleted ? (
                                <CheckCircle2 size={16} className="text-[#0ba2b3] shrink-0" />
                              ) : isLocked ? (
                                <Lock size={14} className="text-gray-400 shrink-0" />
                              ) : (
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-black shrink-0 ${
                                  isCurrent ? 'border-[#0ba2b3] text-[#0ba2b3]' : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  {i + 1}
                                </span>
                              )}
                              <span className="truncate">{getLocalizedLessonTitle(l.title, language)}</span>
                            </div>

                            <span className="text-[10px] font-extrabold text-gray-400 shrink-0 ml-2">
                              +{l.xpReward || 15} XP
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Prev/Next Tactile 3D Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={prevLesson ? getCleanLessonUrl(prevLesson.id) : '#'}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                prevLesson 
                  ? 'border-[#00031325] dark:border-white/20 text-[#000313] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-[#0ba2b3] cursor-pointer shadow-sm active:translate-y-0.5' 
                  : 'border-transparent text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-40'
              }`}
              title={language === "my" ? "ရှေ့သင်ခန်းစာ" : "Previous Lesson"}
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </Link>
            <Link
              href={nextLesson ? getCleanLessonUrl(nextLesson.id) : '#'}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                nextLesson 
                  ? 'border-[#00031325] dark:border-white/20 text-[#000313] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-[#0ba2b3] cursor-pointer shadow-sm active:translate-y-0.5' 
                  : 'border-transparent text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-40'
              }`}
              title={language === "my" ? "နောက်သင်ခန်းစာ" : "Next Lesson"}
            >
              <ChevronRight size={20} strokeWidth={3} />
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
                  {getLocalizedUnitTitle(lesson.unitTitle || '', language).replace(/^Unit \d+:\s*/, '')}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] px-2.5 py-1 rounded-full">
                  {getLocalizedModuleTitle(lesson.moduleTitle || '', language)}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-4">{getLocalizedLessonTitle(lesson.title, language)}</h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-bold text-[#0ba2b3]">+{lesson.xpReward} XP</span>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-5">
              {lesson.contentBlocks.map((block, idx) => (
                <ContentBlockRenderer key={idx} block={block} language={language} />
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
                  ? (language === 'my' ? 'ကုဒ်ရေးသားရန်နေရာ (Code Editor)' : 'Code Editor')
                  : lesson.lessonType === 'fill_blanks'
                    ? (language === 'my' ? 'ကွက်လပ်ဖြည့်ပါ (Fill in the Blanks)' : 'Fill in the Blanks')
                    : (language === 'my' ? 'အဖြေမှန်ရွေးချယ်ပါ (Multiple Choice)' : 'Choose the Answer')}
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
          {language === 'my' ? 'သင်ခန်းစာ' : 'Lesson'}
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 text-center font-extrabold text-sm tracking-wide transition-colors ${
            mobileTab === 'code' 
              ? 'text-[#0ba2b3] border-t-4 border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128]' 
              : 'text-[#000313] dark:text-white/70 hover:bg-[#F8F8F8] dark:hover:bg-white/5 border-t-4 border-transparent'
          }`}
        >
          {language === 'my' ? 'လေ့ကျင့်ခန်း' : 'Code'}
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

      {/* Floating AI Coding Tutor */}
      <Chatbot lessonTitle={lesson?.title} />
    </div>
  );
}

// Render a single content block
function ContentBlockRenderer({ block, language }: { block: ContentBlock; language: Language }) {
  switch (block.type) {
    case 'text':
      const contentToRender = getLocalizedContentText(block.content, language);
      return (
        <div className="text-[15px] text-[#000313] dark:text-white leading-[1.8] font-medium space-y-4">
          {/* Simple markdown-like rendering */}
          {contentToRender.split('\n').map((line, i) => {
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
