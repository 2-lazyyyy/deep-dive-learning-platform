'use client';

import { units } from '@/data/lessons';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Code,
  CheckCircle,
  Layers,
  FileText,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

export default function TeacherLessonsPage() {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(units[0]?.id ?? null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  // Find the selected lesson data
  const selectedLessonData = (() => {
    for (const unit of units) {
      for (const mod of unit.modules) {
        const lesson = mod.lessons.find((l) => l.id === selectedLesson);
        if (lesson) return { lesson, module: mod, unit };
      }
    }
    return null;
  })();

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#4B4B4B]">Lesson Manager</h1>
          <p className="text-sm font-semibold text-[#AFAFAF] mt-1">
            Unit, Module, Lesson တွေကို ကြည့်ရှုပြီး စီမံခန့်ခွဲပါ
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#CE82FF] hover:bg-[#B86EE6] text-white font-extrabold py-2.5 px-5 rounded-xl border-b-4 border-[#A86BD8] active:border-b-0 active:translate-y-1 transition-all text-sm uppercase tracking-wide">
          <Plus size={18} strokeWidth={3} />
          Add Lesson
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Syllabus Tree */}
        <div className="lg:col-span-1 bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-[#E5E5E5]">
            <h2 className="font-extrabold text-[#4B4B4B] text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-[#CE82FF]" />
              Syllabus
            </h2>
          </div>

          <div className="divide-y divide-[#F7F7F7]">
            {units.map((unit, unitIdx) => {
              const isUnitExpanded = expandedUnit === unit.id;

              return (
                <div key={unit.id}>
                  {/* Unit Row */}
                  <button
                    onClick={() =>
                      setExpandedUnit(isUnitExpanded ? null : unit.id)
                    }
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#F7F7F7] transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#CE82FF]/10 flex items-center justify-center">
                        <BookOpen size={16} className="text-[#CE82FF]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#AFAFAF] uppercase tracking-wider">
                          Unit {unitIdx + 1}
                        </p>
                        <p className="font-bold text-[#4B4B4B] text-sm">
                          {unit.title.replace(/^Unit \d+:\s*/, '')}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isUnitExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={18} className="text-[#AFAFAF]" />
                    </motion.div>
                  </button>

                  {/* Modules under this Unit */}
                  {isUnitExpanded &&
                    unit.modules.map((mod, modIdx) => {
                      const isModExpanded = expandedModule === mod.id;

                      return (
                        <div key={mod.id}>
                          {/* Module Row */}
                          <button
                            onClick={() =>
                              setExpandedModule(isModExpanded ? null : mod.id)
                            }
                            className="w-full flex items-center justify-between pl-10 pr-5 py-3 hover:bg-[#F7F7F7] transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-md bg-[#1CB0F6]/10 flex items-center justify-center">
                                <Layers size={12} className="text-[#1CB0F6]" />
                              </div>
                              <p className="font-semibold text-[#4B4B4B] text-sm">
                                Module {modIdx + 1}: {mod.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#AFAFAF]">
                                {mod.lessons.length}
                              </span>
                              <motion.div
                                animate={{ rotate: isModExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight size={14} className="text-[#AFAFAF]" />
                              </motion.div>
                            </div>
                          </button>

                          {/* Lessons under this Module */}
                          {isModExpanded &&
                            mod.lessons.map((lesson) => {
                              const isSelected = selectedLesson === lesson.id;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setSelectedLesson(lesson.id)}
                                  className={`w-full flex items-center gap-3 pl-16 pr-5 py-2.5 text-left transition-colors ${
                                    isSelected
                                      ? 'bg-[#F3E8FF] border-l-4 border-[#CE82FF]'
                                      : 'hover:bg-[#F7F7F7] border-l-4 border-transparent'
                                  }`}
                                >
                                  <Code
                                    size={14}
                                    className={isSelected ? 'text-[#CE82FF]' : 'text-[#AFAFAF]'}
                                  />
                                  <span
                                    className={`text-sm font-semibold truncate ${
                                      isSelected ? 'text-[#CE82FF]' : 'text-[#777777]'
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Lesson Detail Panel */}
        <div className="lg:col-span-2">
          {selectedLessonData ? (
            <motion.div
              key={selectedLessonData.lesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden"
            >
              {/* Lesson Header */}
              <div className="px-6 py-5 border-b-2 border-[#E5E5E5]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#CE82FF] bg-[#F3E8FF] px-2.5 py-1 rounded-full">
                    {selectedLessonData.unit.title.replace(/^Unit \d+:\s*/, '')}
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] bg-[#DDF4FF] px-2.5 py-1 rounded-full">
                    {selectedLessonData.module.title}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-[#4B4B4B]">
                  {selectedLessonData.lesson.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-bold text-[#58CC02] flex items-center gap-1">
                    <CheckCircle size={12} />
                    +{selectedLessonData.lesson.xpReward} XP
                  </span>
                  <span className="text-xs font-bold text-[#AFAFAF]">
                    ID: {selectedLessonData.lesson.id}
                  </span>
                </div>
              </div>

              {/* Content Blocks (Theory) */}
              <div className="px-6 py-5 border-b-2 border-[#E5E5E5]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] mb-3 flex items-center gap-2">
                  <FileText size={14} />
                  Content Blocks ({selectedLessonData.lesson.contentBlocks.length})
                </h3>
                <div className="space-y-3">
                  {selectedLessonData.lesson.contentBlocks.map((block, idx) => (
                    <div key={idx} className="bg-[#F7F7F7] rounded-xl p-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CE82FF] bg-[#F3E8FF] px-2 py-0.5 rounded-full mb-2 inline-block">
                        {block.type}
                      </span>
                      {block.type === 'code' ? (
                        <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mt-2 overflow-x-auto">
                          {block.content}
                        </pre>
                      ) : (
                        <p className="text-sm text-[#4B4B4B] font-semibold mt-1">{block.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Type-specific data */}
              <div className="px-6 py-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] mb-3 flex items-center gap-2">
                  <Code size={14} />
                  Exercise Data — {selectedLessonData.lesson.lessonType.replace('_', ' ').toUpperCase()}
                </h3>

                {selectedLessonData.lesson.lessonType === 'code_fix' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Starter Code</p>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                        {selectedLessonData.lesson.initialCode}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Expected Output</p>
                      <pre className="bg-[#E8F5E9] text-[#2E7D32] p-4 rounded-xl text-sm font-mono border border-green-200">
                        {selectedLessonData.lesson.expectedOutput}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedLessonData.lesson.lessonType === 'fill_blanks' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Code Template</p>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                        {selectedLessonData.lesson.codeTemplate.join('\n')}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Correct Tokens</p>
                      <div className="flex gap-2">
                        {selectedLessonData.lesson.correctTokens.map((t, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] font-mono text-sm font-bold rounded-lg border border-green-200">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Token Pool</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLessonData.lesson.tokenPool.map((t, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#F7F7F7] text-[#4B4B4B] font-mono text-sm font-bold rounded-lg border border-[#E5E5E5]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedLessonData.lesson.lessonType === 'multiple_choice' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Question</p>
                      <div className="bg-[#F7F7F7] rounded-xl p-4 text-sm text-[#4B4B4B] font-semibold">
                        {selectedLessonData.lesson.question}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#AFAFAF] mb-1">Options</p>
                      <div className="space-y-2">
                        {selectedLessonData.lesson.options.map((opt, i) => (
                          <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
                            i === (selectedLessonData.lesson as any).correctIndex
                              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-green-200'
                              : 'bg-[#F7F7F7] text-[#4B4B4B]'
                          }`}>
                            <span className="text-xs text-[#AFAFAF] font-extrabold">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] h-[400px] flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-[#AFAFAF]" />
              </div>
              <h3 className="font-extrabold text-[#4B4B4B] mb-1">Select a Lesson</h3>
              <p className="text-sm text-[#AFAFAF] font-semibold">
                ဘယ်ဘက်က syllabus tree ထဲက lesson ကိုရွေးပါ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
