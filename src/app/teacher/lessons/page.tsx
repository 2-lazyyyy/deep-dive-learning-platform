'use client';

import { useLessonStore } from '@/store/use-lesson-store';
import { LessonEditor } from '@/components/teacher/lesson-editor';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Code,
  CheckCircle,
  Layers,
  FileText,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TeacherLessonsPage() {
  const { units, addUnit, updateUnit, deleteUnit, addModule, updateModule, deleteModule, addLesson, updateLesson, deleteLesson } = useLessonStore();
  
  useEffect(() => {
    useLessonStore.getState().fetchLessons();
  }, []);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(units[0]?.id ?? null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add Lesson Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalUnitId, setAddModalUnitId] = useState<string>(units[0]?.id || '');
  const [addModalModuleId, setAddModalModuleId] = useState<string>(units[0]?.modules[0]?.id || '');

  // Add/Edit Unit Modal State
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDescription, setNewUnitDescription] = useState('');

  // Add/Edit Module Modal State
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [newModuleUnitId, setNewModuleUnitId] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');

  const handleAddLesson = () => {
    // Just open the modal
    setShowAddModal(true);
    if (!addModalUnitId && units.length > 0) {
      setAddModalUnitId(units[0].id);
      if (units[0].modules.length > 0) {
        setAddModalModuleId(units[0].modules[0].id);
      }
    }
  };

  const handleSave = (updatedLesson: any) => {
    updateLesson(updatedLesson.id, updatedLesson);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (selectedLesson) {
      deleteLesson(selectedLesson);
      setSelectedLesson(null);
      setIsEditing(false);
    }
  };

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
          <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white">Lesson Manager</h1>
        </div>
        <button
          onClick={handleAddLesson}
          className="flex items-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold py-2.5 px-5 rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all text-sm uppercase tracking-wide"
        >
          <Plus size={18} strokeWidth={3} />
          Add Lesson
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Syllabus Tree */}
        <div className="lg:col-span-1 bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-[#00031333] dark:border-white/20 flex items-center justify-between">
            <h2 className="font-extrabold text-[#000313] dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-[#0ba2b3]" />
              Syllabus
            </h2>
          </div>

          <div className="divide-y divide-[#F8F8F8]">
            {units.map((unit, unitIdx) => {
              const isUnitExpanded = expandedUnit === unit.id;

              return (
                <div key={unit.id}>
                  {/* Unit Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setExpandedUnit(isUnitExpanded ? null : unit.id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setExpandedUnit(isUnitExpanded ? null : unit.id);
                      }
                    }}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition-colors text-left cursor-pointer outline-none focus-visible:bg-[#F8F8F8] dark:bg-[#060a1d]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0ba2b3]/10 flex items-center justify-center">
                        <BookOpen size={16} className="text-[#0ba2b3]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white uppercase tracking-wider">
                          Unit {unitIdx + 1}
                        </p>
                        <p className="font-bold text-[#000313] dark:text-white text-sm">
                          {unit.title.replace(/^Unit \d+:\s*/, '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingUnitId(unit.id);
                          setNewUnitTitle(unit.title);
                          setNewUnitDescription(unit.description || '');
                          setShowAddUnitModal(true);
                        }}
                        className="text-[#000313] dark:text-white hover:text-[#000313] dark:text-white p-1 rounded hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition"
                        title="Edit Unit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Remove confirm dialog for UX consistency
                          deleteUnit(unit.id);  if (expandedUnit === unit.id) setExpandedUnit(null);
                        }}
                        className="text-[#000313] dark:text-white hover:text-red-500 p-1 rounded hover:bg-red-50 transition"
                        title="Delete Unit"
                      >
                        <Trash2 size={16} />
                      </button>
                      <motion.div
                        animate={{ rotate: isUnitExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={18} className="text-[#000313] dark:text-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Modules under this Unit */}
                  {isUnitExpanded &&
                    unit.modules.map((mod, modIdx) => {
                      const isModExpanded = expandedModule === mod.id;

                      return (
                        <div key={mod.id}>
                          {/* Module Row */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              setExpandedModule(isModExpanded ? null : mod.id)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                setExpandedModule(isModExpanded ? null : mod.id);
                              }
                            }}
                            className="w-full flex items-center justify-between pl-10 pr-5 py-3 hover:bg-[#F8F8F8] dark:bg-[#060a1d] transition-colors text-left cursor-pointer outline-none focus-visible:bg-[#F8F8F8] dark:bg-[#060a1d]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-md bg-[#0ba2b3]/10 flex items-center justify-center">
                                <Layers size={12} className="text-[#0ba2b3]" />
                              </div>
                              <p className="font-semibold text-[#000313] dark:text-white text-sm">
                                Module {modIdx + 1}: {mod.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingModuleId(mod.id);
                                  setNewModuleUnitId(unit.id);
                                  setNewModuleTitle(mod.title);
                                  setNewModuleDescription(mod.description || '');
                                  setShowAddModuleModal(true);
                                }}
                                className="text-[#000313] dark:text-white hover:text-[#000313] dark:text-white p-1 rounded hover:bg-white dark:bg-[#000313] transition"
                                title="Edit Module"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Remove confirm dialog for UX consistency
                                  deleteModule(mod.id);  if (expandedModule === mod.id) setExpandedModule(null);
                                }}
                                className="text-[#000313] dark:text-white hover:text-red-500 p-1 rounded hover:bg-red-50 transition"
                                title="Delete Module"
                              >
                                <Trash2 size={14} />
                              </button>
                              <motion.div
                                animate={{ rotate: isModExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight size={16} className="text-[#000313] dark:text-white" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Lessons under this Module */}
                          {isModExpanded &&
                            mod.lessons.map((lesson) => {
                              const isSelected = selectedLesson === lesson.id;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => {
                                    setSelectedLesson(lesson.id);
                                    setIsEditing(false);
                                  }}
                                    className={`w-full flex items-center gap-3 pl-16 pr-5 py-2.5 text-left transition-colors ${isSelected
                                      ? 'bg-[#F4EAF9] dark:bg-purple-900/30 border-l-4 border-[#0ba2b3]'
                                      : 'hover:bg-[#F8F8F8] dark:hover:bg-[#060a1d] dark:bg-transparent border-l-4 border-transparent'
                                    }`}
                                >
                                  <Code
                                    size={14}
                                    className={isSelected ? 'text-[#0ba2b3]' : 'text-[#000313] dark:text-white'}
                                  />
                                  <span
                                    className={`text-sm font-semibold truncate ${isSelected ? 'text-[#0ba2b3]' : 'text-[#000313] dark:text-white'
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
            isEditing ? (
              <LessonEditor
                lesson={selectedLessonData.lesson}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <motion.div
                key={selectedLessonData.lesson.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 overflow-hidden"
              >
                {/* Lesson Header */}
                <div className="px-6 py-5 border-b-2 border-[#00031333] dark:border-white/20 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F4EAF9] dark:bg-purple-900/30 px-2.5 py-1 rounded-full">
                        {selectedLessonData.unit.title.replace(/^Unit \d+:\s*/, '')}
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] px-2.5 py-1 rounded-full">
                        {selectedLessonData.module.title}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#000313] dark:text-white">
                      {selectedLessonData.lesson.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs font-bold text-[#0ba2b3] flex items-center gap-1">
                        <CheckCircle size={12} />
                        +{selectedLessonData.lesson.xpReward} XP
                      </span>
                      <span className="text-xs font-bold text-[#000313] dark:text-white">
                        ID: {selectedLessonData.lesson.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-sm font-bold text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] px-3 py-1.5 rounded-lg hover:bg-[#1e91a3] hover:text-white transition"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>

                {/* Content Blocks (Theory) */}
                <div className="px-6 py-5 border-b-2 border-[#00031333] dark:border-white/20">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white mb-3 flex items-center gap-2">
                    <FileText size={14} />
                    Content Blocks ({selectedLessonData.lesson.contentBlocks.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedLessonData.lesson.contentBlocks.map((block, idx) => (
                      <div key={idx} className="bg-[#F8F8F8] dark:bg-[#060a1d] rounded-xl p-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0ba2b3] bg-[#F4EAF9] dark:bg-purple-900/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                          {block.type}
                        </span>
                        {block.type === 'code' ? (
                          <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mt-2 overflow-x-auto">
                            {block.content}
                          </pre>
                        ) : (
                          <p className="text-sm text-[#000313] dark:text-white font-semibold mt-1">{block.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type-specific data */}
                <div className="px-6 py-5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white mb-3 flex items-center gap-2">
                    <Code size={14} />
                    Exercise Data — {selectedLessonData.lesson.lessonType.replace('_', ' ').toUpperCase()}
                  </h3>

                  {selectedLessonData.lesson.lessonType === 'code_fix' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Starter Code</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                          {selectedLessonData.lesson.initialCode}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Expected Output</p>
                        <pre className="bg-[#E8F5E9] dark:bg-green-950/30 text-[#2E7D32] dark:text-green-400 p-4 rounded-xl text-sm font-mono border border-green-200 dark:border-green-900">
                          {selectedLessonData.lesson.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedLessonData.lesson.lessonType === 'fill_blanks' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Code Template</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                          {(selectedLessonData.lesson.codeTemplate || []).join('\n')}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Correct Tokens</p>
                        <div className="flex gap-2">
                          {(selectedLessonData.lesson.correctTokens || []).map((t: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 bg-[#E8F5E9] dark:bg-green-950/30 text-[#2E7D32] dark:text-green-400 font-mono text-sm font-bold rounded-lg border border-green-200 dark:border-green-900">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Token Pool</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedLessonData.lesson.tokenPool || []).map((t: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 bg-[#F8F8F8] dark:bg-[#060a1d] text-[#000313] dark:text-white font-mono text-sm font-bold rounded-lg border border-[#00031333] dark:border-white/20">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLessonData.lesson.lessonType === 'multiple_choice' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Question</p>
                        <div className="bg-[#F8F8F8] dark:bg-[#060a1d] rounded-xl p-4 text-sm text-[#000313] dark:text-white font-semibold">
                          {selectedLessonData.lesson.question}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#000313] dark:text-white mb-1">Options</p>
                        <div className="space-y-2">
                          {(selectedLessonData.lesson.options || []).map((opt: string, i: number) => (
                            <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${i === (selectedLessonData.lesson as any).correctIndex
                                ? 'bg-[#E8F5E9] dark:bg-green-950/30 text-[#2E7D32] dark:text-green-400 border border-green-200 dark:border-green-900'
                                : 'bg-[#F8F8F8] dark:bg-[#060a1d] text-[#000313] dark:text-white'
                              }`}>
                              <span className="text-xs text-[#000313] dark:text-white font-extrabold">{String.fromCharCode(65 + i)}.</span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          ) : (
            <div className="bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 h-[400px] flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-[#F8F8F8] dark:bg-[#060a1d] rounded-full flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-[#000313] dark:text-white" />
              </div>
              <h3 className="font-extrabold text-[#000313] dark:text-white mb-1">Select a Lesson</h3>
              <p className="text-sm text-[#000313] dark:text-white font-semibold">
                ဘယ်ဘက်က syllabus tree ထဲက lesson ကိုရွေးပါ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#000313]/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#000313] rounded-2xl p-6 w-full max-w-[400px]">
            <h2 className="text-xl font-extrabold text-[#000313] dark:text-white mb-4">Add New Lesson</h2>
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#000313] dark:text-white uppercase tracking-wider">Select Unit</label>
                  <button
                    onClick={() => {
                      setEditingUnitId(null);
                      setNewUnitTitle('');
                      setNewUnitDescription('');
                      setShowAddUnitModal(true);
                    }}
                    className="text-xs font-bold text-[#0ba2b3] hover:bg-[#F4EAF9] dark:hover:bg-purple-900/30 px-2 py-0.5 rounded transition"
                  >
                    + New Unit
                  </button>
                </div>
                <select
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl p-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3]"
                  value={addModalUnitId}
                  onChange={(e) => {
                    setAddModalUnitId(e.target.value);
                    const unit = units.find(u => u.id === e.target.value);
                    setAddModalModuleId(unit?.modules[0]?.id || '');
                  }}
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#000313] dark:text-white uppercase tracking-wider">Select Module</label>
                  <button
                    onClick={() => {
                      if (!addModalUnitId) return alert('Select a unit first.');
                      setEditingModuleId(null);
                      setNewModuleUnitId(addModalUnitId);
                      setNewModuleTitle('');
                      setNewModuleDescription('');
                      setShowAddModuleModal(true);
                    }}
                    className="text-xs font-bold text-[#0ba2b3] hover:bg-[#F0F8FF] dark:bg-[#0a1128] px-2 py-0.5 rounded transition"
                  >
                    + New Module
                  </button>
                </div>
                <select
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl p-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3]"
                  value={addModalModuleId}
                  onChange={(e) => setAddModalModuleId(e.target.value)}
                >
                  {units.find(u => u.id === addModalUnitId)?.modules.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl font-bold text-[#000313] dark:text-white bg-[#F8F8F8] dark:bg-[#060a1d] hover:bg-[#00031333] dark:bg-white/20 transition">Cancel</button>
              <button
                onClick={() => {
                  if (!addModalModuleId) return;
                  const newLessonId = `lesson-${Date.now()}`;
                  const newLesson = {
                    id: newLessonId,
                    moduleId: addModalModuleId,
                    lessonType: 'code_fix',
                    title: 'New Lesson',
                    xpReward: 10,
                    orderIndex: 99,
                    contentBlocks: [{ type: 'text', content: 'New text block' }],
                  } as any;
                  addLesson(addModalModuleId, newLesson);
                  setSelectedLesson(newLessonId);
                  setExpandedUnit(addModalUnitId);
                  setExpandedModule(addModalModuleId);
                  setIsEditing(true);
                  setShowAddModal(false);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-[#0ba2b3] border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Unit Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 bg-[#000313]/50 flex items-center justify-center z-[60] px-4">
          <div className="bg-white dark:bg-[#000313] rounded-2xl p-6 w-full max-w-[400px]">
            <h2 className="text-xl font-extrabold text-[#000313] dark:text-white mb-4">
              {editingUnitId ? 'Edit Unit' : 'Add New Unit'}
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#000313] dark:text-white uppercase tracking-wider mb-2">Unit Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 1: Python Basics"
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl p-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3]"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddUnitModal(false);
                  setNewUnitTitle('');
                  setNewUnitDescription('');
                  setEditingUnitId(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-[#000313] dark:text-white bg-[#F8F8F8] dark:bg-[#060a1d] hover:bg-[#00031333] dark:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newUnitTitle.trim()) return;
                  if (editingUnitId) {
                    updateUnit(editingUnitId, newUnitTitle, newUnitDescription);
                  } else {
                    const unitId = addUnit(newUnitTitle, newUnitDescription);
                    setAddModalUnitId(unitId);
                    setAddModalModuleId('');
                  }
                  setShowAddUnitModal(false);
                  setNewUnitTitle('');
                  setNewUnitDescription('');
                  setEditingUnitId(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-[#0ba2b3] border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition"
              >
                {editingUnitId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-[#000313]/50 flex items-center justify-center z-[60] px-4">
          <div className="bg-white dark:bg-[#000313] rounded-2xl p-6 w-full max-w-[400px]">
            <h2 className="text-xl font-extrabold text-[#000313] dark:text-white mb-4">
              {editingModuleId ? 'Edit Module' : 'Add New Module'}
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#000313] dark:text-white uppercase tracking-wider mb-2">Module Title</label>
                <input
                  type="text"
                  placeholder="e.g. Variables and Data Types"
                  className="w-full border-2 border-[#00031333] dark:border-white/20 rounded-xl p-3 font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3]"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModuleModal(false);
                  setNewModuleTitle('');
                  setNewModuleDescription('');
                  setEditingModuleId(null);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-[#000313] dark:text-white bg-[#F8F8F8] dark:bg-[#060a1d] hover:bg-[#00031333] dark:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newModuleTitle.trim() || !newModuleUnitId) return;
                  if (editingModuleId) {
                    updateModule(editingModuleId, newModuleTitle, newModuleDescription);
                  } else {
                    const modId = addModule(newModuleUnitId, newModuleTitle, newModuleDescription);
                    if (addModalUnitId === newModuleUnitId) {
                      setAddModalModuleId(modId);
                    }
                  }
                  setShowAddModuleModal(false);
                  setNewModuleTitle('');
                  setNewModuleDescription('');
                  setEditingModuleId(null);
                  setExpandedUnit(newModuleUnitId);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-[#0ba2b3] border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition"
              >
                {editingModuleId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
