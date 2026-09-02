'use client';

import { useParams, useRouter } from 'next/navigation';
import { useChallengeStore } from '@/store/use-challenge-store';
import { CodeSandbox } from '@/components/code-sandbox';
import { useUserStore } from '@/store/use-user-store';
import { ResultModal } from '@/components/result-modal';
import { useState, useCallback } from 'react';
import { ArrowLeft, BookOpen, Code, Swords, Star, Gem } from 'lucide-react';
import Link from 'next/link';
import { Chatbot } from '@/components/chatbot';

export default function ChallengeWorkspace() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.challengeId as string;
  const { getChallengeById } = useChallengeStore();
  const challenge = getChallengeById(challengeId);

  const { completeChallenge, addXp, addGems } = useUserStore();
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [mobileTab, setMobileTab] = useState<'lesson' | 'code'>('lesson');

  const handleSuccess = useCallback(() => {
    if (!challenge) return;
    setIsCorrect(true);
    setShowResult(true);
    completeChallenge(challenge.id);
    addXp(challenge.xpReward);
    addGems(Math.floor(challenge.xpReward / 10)); // Reward logic
  }, [challenge, completeChallenge, addXp, addGems]);

  const handleError = useCallback(() => {
    setIsCorrect(false);
    setShowResult(true);
  }, []);

  const handleContinue = useCallback(() => {
    setShowResult(false);
    if (isCorrect) {
      router.push('/challenge');
    }
  }, [isCorrect, router]);

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">Challenge Not Found</h1>
        <Link href="/challenge" className="text-[#0ba2b3] font-bold hover:underline">
          Go back to Challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -mt-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/challenge" className="text-[#0ba2b3] hover:text-[#1e91a3] transition">
            <ArrowLeft size={24} strokeWidth={3} />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white">{challenge.title}</h1>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            challenge.difficulty === 'easy' ? 'text-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128] border-[#0ba2b3]' :
            challenge.difficulty === 'medium' ? 'text-[#FF9600] bg-[#FFF3E0] border-[#FF9600]' :
            'text-[#FC4B0B] bg-[#FFEBEE] border-[#FC4B0B]'
          }`}>
            {challenge.difficulty}
          </span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[#FFC800] font-bold">
            <Star size={20} fill="currentColor" /> {challenge.xpReward} XP
          </div>
          <div className="flex items-center gap-1.5 text-[#00BCD4] font-bold">
            <Gem size={20} fill="currentColor" /> {Math.floor(challenge.xpReward / 10)} Gems
          </div>
        </div>
      </div>

      {/* Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden pb-24 lg:pb-4">
        {/* Left Panel: Description */}
        <div className={`w-full lg:w-1/2 bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-2xl flex-col overflow-hidden ${mobileTab === 'lesson' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="p-4 bg-[#F8F8F8] dark:bg-[#060a1d] border-b-2 border-[#00031333] dark:border-white/20 flex items-center gap-2">
            <BookOpen size={18} className="text-[#0ba2b3]" />
            <h2 className="font-extrabold text-[#000313] dark:text-white text-sm uppercase tracking-wider">Problem Description</h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 text-[#000313] dark:text-white">
            <p className="text-sm font-bold text-[#6B7280] dark:text-gray-400 mb-6 border-b-2 border-[#00031311] dark:border-white/10 pb-4">
              Published: <span className="text-[#000313] dark:text-white ml-1">{challenge.date}</span>
            </p>

            <div className="space-y-6">
              {challenge.contentBlocks.map((block, i) => {
                if (block.type === 'text') {
                  // Render markdown-like bold (**) and inline code (`)
                  const formattedContent = block.content.replace(
                    /\*\*(.*?)\*\*/g, 
                    '<strong class="font-extrabold text-[#000313] dark:text-white">$1</strong>'
                  ).replace(
                    /`([^`]+)`/g,
                    '<code class="bg-[#F0F8FF] dark:bg-[#0a1128] border-2 border-[#84D8FF] text-[#0ba2b3] px-2 py-0.5 rounded-md text-[13px] font-mono font-bold">$1</code>'
                  );
                  return (
                    <div 
                      key={i} 
                      className="text-[#000313] dark:text-white leading-relaxed font-semibold"
                      dangerouslySetInnerHTML={{ __html: formattedContent.replace(/\n/g, '<br/>') }}
                    />
                  );
                }
                
                if (block.type === 'code') {
                  return (
                    <div key={i} className="rounded-xl overflow-hidden border-2 border-[#84D8FF]">
                      <pre className="bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] p-4 text-sm font-mono font-bold overflow-x-auto leading-relaxed">
                        {block.content}
                      </pre>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {challenge.constraints && challenge.constraints.length > 0 && (
              <div className="mt-8 border-t-2 border-[#00031311] dark:border-white/10 pt-6">
                <h3 className="font-extrabold text-[#000313] dark:text-white mb-4">Constraints:</h3>
                <ul className="space-y-2">
                  {challenge.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 text-[#FC4B0B]">•</span>
                      <span className="font-mono text-sm font-bold text-[#000313] dark:text-white bg-[#F8F8F8] dark:bg-[#060a1d] px-2 py-1 rounded inline-block border-2 border-[#00031333] dark:border-white/20">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Sandbox */}
        <div className={`w-full lg:w-1/2 flex-col ${mobileTab === 'code' ? 'flex' : 'hidden'} lg:flex`}>
          <div className="flex-1 overflow-y-auto pr-2">
            <CodeSandbox
              key={`challenge-${challenge.id}-${retryCount}`}
              initialCode={challenge.initialCode || ''}
              expectedOutput={challenge.expectedOutput || ''}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex h-[60px] bg-white dark:bg-[#000313] fixed bottom-[80px] left-0 right-0 z-40 border-t-2 border-[#00031333] dark:border-white/20">
        <button
          onClick={() => setMobileTab('lesson')}
          className={`flex-1 text-center font-extrabold text-sm tracking-wide transition-colors ${
            mobileTab === 'lesson' 
              ? 'text-[#0ba2b3] border-t-4 border-[#0ba2b3] bg-[#F0F8FF] dark:bg-[#0a1128]' 
              : 'text-[#000313] dark:text-white/70 hover:bg-[#F8F8F8] dark:hover:bg-white/5 border-t-4 border-transparent'
          }`}
        >
          Problem
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

      {showResult && (
        <ResultModal
          isOpen={true}
          isSuccess={isCorrect}
          xpEarned={isCorrect ? challenge.xpReward : 0}
          onContinue={handleContinue}
          onRetry={() => {
            setShowResult(false);
            setRetryCount(prev => prev + 1);
          }}
        />
      )}

      {/* Floating AI Coding Tutor */}
      <Chatbot lessonTitle={challenge?.title} />
    </div>
  );
}
