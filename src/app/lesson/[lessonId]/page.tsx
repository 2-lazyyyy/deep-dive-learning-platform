'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CodeSandbox } from '@/components/code-sandbox';
import { FillBlanksExercise } from '@/components/fill-blanks-exercise';
import { MultipleChoiceExercise } from '@/components/multiple-choice-exercise';
import { ResultModal } from '@/components/result-modal';
import { HeartsModal } from '@/components/hearts-modal';
import { useUserStore } from '@/store/use-user-store';
import { units, getLessonById, getNextLessonId, getAllLessons } from '@/data/lessons';
import { ContentBlock } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, X, BookOpen, Code, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
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

  if (!lesson) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F7F7F7]">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-extrabold text-[#4B4B4B] mb-2">Lesson Not Found</h1>
        <p className="text-[#AFAFAF] font-semibold mb-6">This lesson doesn&apos;t exist.</p>
        <Link
          href="/"
          className="bg-[#1CB0F6] text-white font-extrabold px-6 py-3 rounded-xl hover:bg-[#1899D6]"
        >
          GO HOME
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      {/* Top Bar (New Design) */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-[#E5E5E5] gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <Link href={prevLesson ? `/lesson/${prevLesson.id}` : '#'} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${prevLesson ? 'border-[#E5E5E5] text-[#AFAFAF] hover:bg-[#F7F7F7] cursor-pointer' : 'border-[#F7F7F7] text-[#E5E5E5] cursor-not-allowed'}`}>
            <ChevronLeft size={24} strokeWidth={3} />
          </Link>
          <Link href={nextLesson ? `/lesson/${nextLesson.id}` : '#'} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors ${nextLesson ? 'border-[#E5E5E5] text-[#AFAFAF] hover:bg-[#F7F7F7] cursor-pointer' : 'border-[#F7F7F7] text-[#E5E5E5] cursor-not-allowed'}`}>
            <ChevronRight size={24} strokeWidth={3} />
          </Link>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 flex-1 justify-center max-w-lg">
          <div className="flex items-center w-full relative">
            <div className="absolute left-0 right-0 h-1 bg-[#E5E5E5] rounded-full z-0 top-1/2 -translate-y-1/2" />
            <div className="flex items-center justify-between w-full relative z-10">
              {currentUnitLessons.map((l, idx) => {
                const isCurrent = idx === lessonIndex;
                const isCompleted = completedLessonIds.includes(l.id);
                const isLocked = isLessonLocked(l.id);
                
                return (
                  <Link key={l.id} href={isLocked ? '#' : `/lesson/${l.id}`} style={{ pointerEvents: isLocked ? 'none' : 'auto' }}>
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all ${isLocked ? 'cursor-not-allowed opacity-30 bg-white border-[#E5E5E5]' : 'cursor-pointer'} ${
                        !isLocked && isCurrent
                          ? 'bg-white border-[#1CB0F6] w-5 h-5 shadow-[0_0_0_4px_rgba(28,176,246,0.2)]'
                          : !isLocked && isCompleted
                          ? 'bg-[#FFC800] border-[#FFC800]'
                          : !isLocked
                          ? 'bg-white border-[#E5E5E5]'
                          : ''
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-2 rounded-xl border-2 border-[#E5E5E5] font-bold text-[#4B4B4B] bg-white outline-none cursor-pointer focus:border-[#1CB0F6] hover:bg-[#F7F7F7] transition"
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
            className="px-4 py-2 rounded-xl border-2 border-[#E5E5E5] font-bold text-[#4B4B4B] bg-white outline-none cursor-pointer focus:border-[#1CB0F6] hover:bg-[#F7F7F7] transition appearance-none"
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

        {/* Exit Button */}
        <Link href="/">
          <div className="w-10 h-10 rounded-xl border-2 border-[#E5E5E5] flex items-center justify-center text-[#AFAFAF] hover:bg-[#F7F7F7] cursor-pointer transition-colors">
            <X size={24} strokeWidth={3} />
          </div>
        </Link>
      </div>

      {/* Main Content — Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Lesson Content */}
        <div className="w-1/2 overflow-y-auto border-r-2 border-[#E5E5E5] bg-white">
          <div className="p-8 max-w-xl mx-auto">
            {/* Lesson Title & Badges */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#CE82FF] bg-[#F3E8FF] px-2.5 py-1 rounded-full">
                  {lesson.unitTitle?.replace(/^Unit \d+:\s*/, '')}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] bg-[#DDF4FF] px-2.5 py-1 rounded-full">
                  {lesson.moduleTitle}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-[#4B4B4B]">{lesson.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-[#58CC02]">+{lesson.xpReward} XP</span>
                <span className="text-xs font-bold text-[#AFAFAF]">•</span>
                <span className="text-xs font-extrabold text-[#AFAFAF] uppercase">
                  {lesson.lessonType === 'code_fix' ? '🖥️ Code Fix' : lesson.lessonType === 'fill_blanks' ? '🧩 Fill Blanks' : '🔘 Multiple Choice'}
                </span>
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
              <Code size={18} className="text-[#1CB0F6]" />
              <h2 className="font-extrabold text-[#4B4B4B] text-sm uppercase tracking-wider">
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
        <div className="text-sm text-[#4B4B4B] leading-relaxed font-semibold">
          {/* Simple markdown-like rendering */}
          {block.content.split('\n').map((line, i) => {
            // Bold
            const rendered = line.replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="font-extrabold text-[#4B4B4B]">$1</strong>'
            ).replace(
              /`([^`]+)`/g,
              '<code class="bg-[#F3E8FF] text-[#CE82FF] px-1.5 py-0.5 rounded text-xs font-mono font-bold">$1</code>'
            );
            return (
              <p
                key={i}
                className="mb-2"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            );
          })}
        </div>
      );

    case 'code':
      return (
        <div className="rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0F172A]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-xs text-[#6B7280] font-bold ml-2">{block.language || 'code'}</span>
          </div>
          <pre className="bg-[#1E293B] text-green-400 p-4 text-sm font-mono overflow-x-auto">
            {block.content}
          </pre>
        </div>
      );

    case 'image':
      return (
        <div className="rounded-xl overflow-hidden border-2 border-[#E5E5E5]">
          <div className="bg-[#F7F7F7] h-[180px] flex flex-col items-center justify-center">
            <ImageIcon size={32} className="text-[#AFAFAF] mb-2" />
            <p className="text-xs font-bold text-[#AFAFAF]">Image placeholder</p>
          </div>
          {block.caption && (
            <div className="px-4 py-2 bg-white">
              <p className="text-xs font-semibold text-[#AFAFAF] text-center">{block.caption}</p>
            </div>
          )}
        </div>
      );

    case 'video':
      return (
        <div className="rounded-xl overflow-hidden border-2 border-[#E5E5E5]">
          <div className="bg-[#1E293B] h-[200px] flex flex-col items-center justify-center">
            <Video size={40} className="text-[#1CB0F6] mb-2" />
            <p className="text-xs font-bold text-[#6B7280]">Video placeholder</p>
            <p className="text-xs text-[#4B5563] mt-1">{block.content}</p>
          </div>
          {block.caption && (
            <div className="px-4 py-2 bg-white">
              <p className="text-xs font-semibold text-[#AFAFAF] text-center">{block.caption}</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
