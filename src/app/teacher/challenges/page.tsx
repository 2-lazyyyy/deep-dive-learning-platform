'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Edit2, Shield, Gem, AlignLeft, Code, List, X } from 'lucide-react';
import { useChallengeStore } from '@/store/use-challenge-store';
import { ContentBlock, Difficulty, Challenge } from '@/types';

export default function TeacherChallengesPage() {
  const { challenges, addChallenge, deleteChallenge } = useChallengeStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '',
    creatorName: '',
    difficulty: 'easy',
    xpReward: 100,
    goal: 1,
    constraints: [],
    contentBlocks: [],
    initialCode: '',
    expectedOutput: '',
  });
  
  const [newConstraint, setNewConstraint] = useState('');

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]';
      case 'medium': return 'text-[#FF9600] bg-[#FF9600]/10 border-[#FF9600]';
      case 'hard': return 'text-[#FC4B0B] bg-[#FC4B0B]/10 border-[#FC4B0B]';
      default: return 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.creatorName) return;
    
    addChallenge({
      title: newChallenge.title,
      creatorName: newChallenge.creatorName,
      difficulty: newChallenge.difficulty as Difficulty,
      xpReward: newChallenge.xpReward || 100,
      goal: newChallenge.goal || 1,
      constraints: newChallenge.constraints || [],
      contentBlocks: newChallenge.contentBlocks || [],
      initialCode: newChallenge.initialCode || '',
      expectedOutput: newChallenge.expectedOutput || '',
    });
    
    setIsCreating(false);
    setNewChallenge({
      title: '',
      creatorName: '',
      difficulty: 'easy',
      xpReward: 100,
      goal: 1,
      constraints: [],
      contentBlocks: [],
      initialCode: '',
      expectedOutput: '',
    });
  };

  const addContentBlock = (type: 'text' | 'code') => {
    setNewChallenge(prev => ({
      ...prev,
      contentBlocks: [
        ...(prev.contentBlocks || []),
        { type, content: '' }
      ]
    }));
  };

  const updateContentBlock = (index: number, content: string) => {
    setNewChallenge(prev => {
      const newBlocks = [...(prev.contentBlocks || [])];
      newBlocks[index].content = content;
      return { ...prev, contentBlocks: newBlocks };
    });
  };

  const removeContentBlock = (index: number) => {
    setNewChallenge(prev => {
      const newBlocks = [...(prev.contentBlocks || [])];
      newBlocks.splice(index, 1);
      return { ...prev, contentBlocks: newBlocks };
    });
  };

  const addConstraint = () => {
    if (!newConstraint.trim()) return;
    setNewChallenge(prev => ({
      ...prev,
      constraints: [...(prev.constraints || []), newConstraint.trim()]
    }));
    setNewConstraint('');
  };

  const removeConstraint = (index: number) => {
    setNewChallenge(prev => {
      const newConstraints = [...(prev.constraints || [])];
      newConstraints.splice(index, 1);
      return { ...prev, constraints: newConstraints };
    });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1C1D20]">Manage Challenges</h1>
        </div>
        
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold uppercase px-5 py-3 rounded-xl transition shadow-[0_4px_0_#1e91a3] active:shadow-none active:translate-y-1"
          >
            <Plus size={20} strokeWidth={3} />
            New Challenge
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCreating ? (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border-2 border-[#1C1D2033] rounded-2xl p-6 shadow-sm mb-8"
          >
            <h2 className="text-xl font-extrabold text-[#1C1D20] mb-6 border-b-2 border-[#1C1D2011] pb-4">Create New Challenge</h2>
            
            <form onSubmit={handleCreate} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">Challenge Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 7-Day Streak Master"
                    value={newChallenge.title || ''}
                    onChange={e => setNewChallenge({...newChallenge, title: e.target.value})}
                    className="w-full border-2 border-[#1C1D2033] rounded-xl px-4 py-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none transition bg-[#F8F8F8] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">Creator Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Teacher Alex"
                    value={newChallenge.creatorName || ''}
                    onChange={e => setNewChallenge({...newChallenge, creatorName: e.target.value})}
                    className="w-full border-2 border-[#1C1D2033] rounded-xl px-4 py-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none transition bg-[#F8F8F8] focus:bg-white"
                  />
                </div>
              </div>

              {/* Content Blocks Section */}
              <div className="border-t-2 border-[#1C1D2011] pt-6">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1C1D20] mb-4 uppercase tracking-wide">
                  <AlignLeft size={18} className="text-[#0ba2b3]" />
                  Rich Content (Description)
                </label>
                
                <div className="space-y-4 mb-4">
                  {(newChallenge.contentBlocks || []).map((block, idx) => (
                    <div key={idx} className="relative bg-[#F8F8F8] p-4 rounded-xl border-2 border-[#1C1D2033]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-[#0ba2b3] uppercase tracking-wide bg-[#0ba2b3]/10 px-2 py-0.5 rounded">
                          {block.type} Block
                        </span>
                        <button
                          type="button"
                          onClick={() => removeContentBlock(idx)}
                          className="text-[#FC4B0B] hover:text-[#E53E3E] transition p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {block.type === 'text' ? (
                        <textarea
                          placeholder="Write text here... Use **bold** for emphasis."
                          value={block.content}
                          onChange={(e) => updateContentBlock(idx, e.target.value)}
                          className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold text-[#1C1D20] outline-none focus:border-[#0ba2b3] min-h-[100px] resize-y bg-white"
                        />
                      ) : (
                        <textarea
                          placeholder="Write code here..."
                          value={block.content}
                          onChange={(e) => updateContentBlock(idx, e.target.value)}
                          className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-mono text-sm font-bold text-[#0ba2b3] outline-none focus:border-[#0ba2b3] bg-[#1E293B] min-h-[100px] resize-y"
                          style={{ color: '#E2E8F0' }}
                        />
                      )}
                    </div>
                  ))}
                  
                  {(newChallenge.contentBlocks || []).length === 0 && (
                    <div className="text-center py-6 bg-[#F8F8F8] border-2 border-[#1C1D2033] border-dashed rounded-xl">
                      <p className="text-sm font-bold text-[#6B7280]">No content added yet. Add text or code blocks.</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => addContentBlock('text')}
                    className="flex items-center gap-2 text-sm font-bold text-[#1C1D20] bg-white border-2 border-[#1C1D2033] px-4 py-2 rounded-xl hover:bg-[#F8F8F8] transition"
                  >
                    <AlignLeft size={16} /> Add Text
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock('code')}
                    className="flex items-center gap-2 text-sm font-bold text-[#1C1D20] bg-white border-2 border-[#1C1D2033] px-4 py-2 rounded-xl hover:bg-[#F8F8F8] transition"
                  >
                    <Code size={16} /> Add Code
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-[#1C1D2011] pt-6">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1C1D20] mb-4 uppercase tracking-wide">
                  <Code size={18} className="text-[#0ba2b3]" />
                  Code Editor Settings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">Initial Code</label>
                    <textarea 
                      placeholder="// Starter code here"
                      value={newChallenge.initialCode || ''}
                      onChange={e => setNewChallenge({...newChallenge, initialCode: e.target.value})}
                      className="w-full border-2 border-[#1C1D2033] rounded-xl px-4 py-3 font-mono text-sm font-bold text-[#0ba2b3] outline-none transition bg-[#1E293B] focus:border-[#0ba2b3] min-h-[150px] resize-y"
                      style={{ color: '#E2E8F0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">Expected Output</label>
                    <textarea 
                      placeholder="Expected output..."
                      value={newChallenge.expectedOutput || ''}
                      onChange={e => setNewChallenge({...newChallenge, expectedOutput: e.target.value})}
                      className="w-full border-2 border-[#1C1D2033] rounded-xl px-4 py-3 font-mono text-sm font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none transition bg-[#F8F8F8] focus:bg-white min-h-[150px] resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Constraints Section */}
              <div className="border-t-2 border-[#1C1D2011] pt-6">
                <label className="flex items-center gap-2 text-sm font-extrabold text-[#1C1D20] mb-4 uppercase tracking-wide">
                  <List size={18} className="text-[#0ba2b3]" />
                  Constraints
                </label>
                
                <div className="space-y-2 mb-4">
                  {(newChallenge.constraints || []).map((constraint, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border-2 border-[#1C1D2033] p-3 rounded-xl">
                      <span className="font-bold text-sm text-[#1C1D20]">{constraint}</span>
                      <button
                        type="button"
                        onClick={() => removeConstraint(idx)}
                        className="text-[#6B7280] hover:text-[#FC4B0B] transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(newChallenge.constraints || []).length === 0 && (
                    <p className="text-sm font-bold text-[#6B7280] italic">No constraints added.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Must use let or const"
                    value={newConstraint}
                    onChange={(e) => setNewConstraint(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addConstraint())}
                    className="flex-1 border-2 border-[#1C1D2033] rounded-xl px-4 py-2 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none"
                  />
                  <button
                    type="button"
                    onClick={addConstraint}
                    className="bg-[#1C1D20] text-white px-4 rounded-xl font-bold hover:bg-[#374151] transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t-2 border-[#1C1D2011] pt-6">
                <div>
                  <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">Difficulty</label>
                  <select 
                    value={newChallenge.difficulty}
                    onChange={e => setNewChallenge({...newChallenge, difficulty: e.target.value as Difficulty})}
                    className="w-full border-2 border-[#1C1D2033] rounded-xl px-4 py-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none appearance-none bg-[#F8F8F8]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">XP Reward</label>
                  <div className="relative">
                    <Gem size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00BCD4]" />
                    <input 
                      type="number" 
                      min="10"
                      required
                      value={newChallenge.xpReward}
                      onChange={e => setNewChallenge({...newChallenge, xpReward: parseInt(e.target.value)})}
                      className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none transition bg-[#F8F8F8] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-[#1C1D20] mb-2 uppercase tracking-wide">Goal Requirement</label>
                  <div className="relative">
                    <Target size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0ba2b3]" />
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={newChallenge.goal}
                      onChange={e => setNewChallenge({...newChallenge, goal: parseInt(e.target.value)})}
                      className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none transition bg-[#F8F8F8] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4 border-t-2 border-[#1C1D2011] pt-6">
                <button 
                  type="submit"
                  className="flex-1 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold uppercase px-6 py-3.5 rounded-xl transition shadow-[0_4px_0_#1e91a3] active:shadow-none active:translate-y-1"
                >
                  Save Challenge
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 bg-white hover:bg-[#F8F8F8] text-[#1C1D20] font-extrabold uppercase px-6 py-3.5 rounded-xl border-2 border-[#1C1D2033] transition shadow-[0_4px_0_#1C1D2033] active:shadow-none active:translate-y-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {challenges.length === 0 ? (
              <div className="col-span-full bg-white border-2 border-[#1C1D2033] border-dashed rounded-2xl p-12 text-center text-[#6B7280]">
                <Target size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="font-extrabold text-lg text-[#1C1D20]">No challenges yet</h3>
                <p className="font-bold text-sm">Create your first challenge to engage your students!</p>
              </div>
            ) : (
              challenges.map(challenge => (
                <div key={challenge.id} className="bg-white border-2 border-[#1C1D2033] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#0ba2b3] transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-[#1C1D20] text-lg leading-tight">{challenge.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[#6B7280] hover:text-[#0ba2b3] transition">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteChallenge(challenge.id)}
                        className="text-[#6B7280] hover:text-[#FC4B0B] transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm font-bold text-[#6B7280] mb-2 flex-1">
                    By <span className="text-[#1C1D20]">{challenge.creatorName}</span>
                  </p>
                  
                  <div className="flex items-center gap-3 border-t-2 border-[#1C1D2011] pt-4">
                    <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-lg border-2 ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-extrabold text-[#00BCD4]">
                      <Gem size={16} fill="currentColor" /> {challenge.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1 text-sm font-extrabold text-[#0ba2b3] ml-auto">
                      <Shield size={16} fill="currentColor" /> Goal: {challenge.goal}
                    </span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
