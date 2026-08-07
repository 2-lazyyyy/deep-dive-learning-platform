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
import { ArrowLeft, Heart, X, BookOpen, Code, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { units, getLessonById, getNextLessonId, getAllLessons } = useLessonStore();
  const lesson = getLessonById(lessonId);
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);

  const { hearts, xp, addXp, reduceHeart, completeLesson, completedLessonIds } = useUserStore();

  let currentUnit = units[0];
  let currentUnitLessons = currentUnit.modules.flatMap(m => m.lessons);

  units.forEach(u => {
    u.modules.forEach(m => {
      if (m.lessons.some(l => l.id === lessonId)) {
        currentUnit = u;
        currentUnitLessons = u.modules.flatMap(mod => mod.lessons);
      }
    });
  });

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

  const xpReward = lesson?.xpReward || 0;

  const handleSuccess = useCallback(() => {
    setIsCorrect(true);
    setShowResult(true);
    addXp(xpReward);
    completeLesson(lessonId);
  }, [lessonId, xpReward, addXp, completeLesson]);

  const handleError = useCallback(() => {
    reduceHeart();
    setIsCorrect(false);
    setShowResult(true);
    if (hearts <= 1) {
      setTimeout(() => setShowHeartsModal(true), 1500);
    }
  }, [reduceHeart, hearts]);

  const handleContinue = useCallback(() => {
    setShowResult(false);
    if (isCorrect) {
      const nextId = getNextLessonId(lessonId);
      if (nextId) {
        router.push(`/lesson/${nextId}`);
      } else {
        router.push('/');
      }
    }
  }, [isCorrect, lessonId, router]);

  if (!isMounted) return null;

  if (!lesson) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F8F8]">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-extrabold text-[#1C1D20] mb-2">Lesson Not Found</h1>
        <p className="text-[#1C1D20] font-semibold mb-6">This lesson doesn&apos;t exist.</p>
        <Link
          href="/"
          className="bg-[#0ba2b3] text-white font-extrabold px-6 py-3 rounded-xl hover:bg-[#1e91a3]"
        >
          GO HOME
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8F8F8]">
      {/* Top Bar (New Design) */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-[#1C1D2033] gap-4 h-[76px]">
        {/* Left: Exit, Hearts, and Progress */}
        <div className="flex items-center gap-6 flex-1 max-w-[800px]">
          <Link href="/">
            <div className="w-10 h-10 rounded-xl border-2 border-[#1C1D2033] flex items-center justify-center text-[#1C1D20] hover:bg-[#F8F8F8] cursor-pointer transition-colors">
              <X size={24} strokeWidth={3} />
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-[#FC4B0B] font-extrabold text-xl whitespace-nowrap">
            <Heart fill="currentColor" size={28} /> {hearts}
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center justify-start w-full max-w-[400px] ml-4">
            <div className="flex items-center w-full relative">
              <div className="absolute left-0 right-0 h-1 bg-[#1C1D2033] rounded-full z-0 top-1/2 -translate-y-1/2" />
              <div className="flex items-center justify-between w-full relative z-10">
                {currentUnitLessons.map((l, idx) => {
                  const isCurrent = idx === lessonIndex;
                  const isCompleted = completedLessonIds.includes(l.id);
                  const isLocked = isLessonLocked(l.id);

                  return (
                    <Link key={l.id} href={isLocked ? '#' : `/lesson/${l.id}`} style={{ pointerEvents: isLocked ? 'none' : 'auto' }}>
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all ${isLocked ? 'cursor-not-allowed opacity-30 bg-white border-[#1C1D2033]' : 'cursor-pointer'} ${!isLocked && isCurrent
                            ? 'bg-white border-[#0ba2b3] w-5 h-5 shadow-[0_0_0_4px_rgba(28,176,246,0.2)]'
                            : !isLocked && isCompleted
                              ? 'bg-[#0ba2b3] border-[#0ba2b3]'
                              : !isLocked
                                ? 'bg-white border-[#1C1D2033]'
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
          <div className="flex items-center gap-3">
            <select
              className="px-4 py-2 rounded-xl border-2 border-[#1C1D2033] font-bold text-[#1C1D20] bg-white outline-none cursor-pointer focus:border-[#0ba2b3] hover:bg-[#F8F8F8] transition"
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
              className="px-4 py-2 rounded-xl border-2 border-[#1C1D2033] font-bold text-[#1C1D20] bg-white outline-none cursor-pointer focus:border-[#0ba2b3] hover:bg-[#F8F8F8] transition appearance-none"
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
            <Link href={prevLesson ? `/lesson/${prevLesson.id}` : '#'} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${prevLesson ? 'border-[#1C1D2033] text-[#1C1D20] hover:bg-[#F8F8F8] cursor-pointer' : 'border-[#F8F8F8] text-[#1C1D2033] cursor-not-allowed'}`}>
              <ChevronLeft size={24} strokeWidth={3} />
            </Link>
            <Link href={nextLesson ? `/lesson/${nextLesson.id}` : '#'} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${nextLesson ? 'border-[#1C1D2033] text-[#1C1D20] hover:bg-[#F8F8F8] cursor-pointer' : 'border-[#F8F8F8] text-[#1C1D2033] cursor-not-allowed'}`}>
              <ChevronRight size={24} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content — Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Lesson Content */}
        <div className="w-1/2 overflow-y-auto border-r-2 border-[#1C1D2033] bg-white">
          <div className="p-8 max-w-xl mx-auto">
            {/* Lesson Title & Badges */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F0F8FF] px-2.5 py-1 rounded-full">
                  {lesson.unitTitle?.replace(/^Unit \d+:\s*/, '')}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F0F8FF] px-2.5 py-1 rounded-full">
                  {lesson.moduleTitle}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#1C1D20] mb-4">{lesson.title}</h1>
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
        <div className="w-1/2 overflow-y-auto">
          <div className="p-8 max-w-xl mx-auto h-full flex flex-col">
            {/* Exercise Header */}
            <div className="flex items-center gap-2 mb-5">
              <Code size={18} className="text-[#0ba2b3]" />
              <h2 className="font-extrabold text-[#1C1D20] text-sm uppercase tracking-wider">
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
                  initialCode={(lesson as any).initialCode}
                  expectedOutput={(lesson as any).expectedOutput}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {lesson.lessonType === 'fill_blanks' && (
                <FillBlanksExercise
                  codeTemplate={(lesson as any).codeTemplate}
                  correctTokens={(lesson as any).correctTokens}
                  tokenPool={(lesson as any).tokenPool}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}

              {lesson.lessonType === 'multiple_choice' && (
                <MultipleChoiceExercise
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

      {/* Modals */}
      {showResult && (
        <ResultModal
          isOpen={true}
          isSuccess={isCorrect}
          xpEarned={isCorrect ? (lesson?.xpReward || 0) : 0}
          onContinue={handleContinue}
          onRetry={() => setShowResult(false)}
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
        <div className="text-[15px] text-[#1C1D20] leading-[1.8] font-medium space-y-4">
          {/* Simple markdown-like rendering */}
          {block.content.split('\n').map((line, i) => {
            if (!line.trim()) return null;
            // Bold
            const rendered = line.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="font-extrabold text-[#1C1D20]">$1</strong>'
            ).replace(
              /`([^`]+)`/g,
              '<code class="bg-[#F0F8FF] border-2 border-[#84D8FF] text-[#0ba2b3] px-2 py-0.5 rounded-md text-[13px] font-mono font-bold">$1</code>'
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
          <pre className="bg-[#F0F8FF] text-[#0ba2b3] p-4 text-sm font-mono font-bold overflow-x-auto leading-relaxed">
            {block.content}
          </pre>
        </div>
      );

    case 'image':
      return (
        <div className="rounded-xl overflow-hidden border-2 border-[#1C1D2033]">
          {block.content ? (
            <img src={block.content} alt={block.caption || 'Lesson image'} className="w-full object-cover" />
          ) : (
            <div className="bg-[#F8F8F8] h-[180px] flex flex-col items-center justify-center">
              <ImageIcon size={32} className="text-[#1C1D20] mb-2" />
              <p className="text-xs font-bold text-[#1C1D20]">Image URL not provided</p>
            </div>
          )}
          {block.caption && (
            <div className="px-4 py-2 bg-white">
              <p className="text-xs font-semibold text-[#1C1D20] text-center">{block.caption}</p>
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
        <div className="rounded-xl overflow-hidden border-2 border-[#1C1D2033]">
          {block.content ? (
            <div className="relative pt-[56.25%] bg-black">
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
              <p className="text-xs font-bold text-[#6B7280]">Video URL not provided</p>
            </div>
          )}
          {block.caption && (
            <div className="px-4 py-2 bg-white">
              <p className="text-xs font-semibold text-[#1C1D20] text-center">{block.caption}</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
