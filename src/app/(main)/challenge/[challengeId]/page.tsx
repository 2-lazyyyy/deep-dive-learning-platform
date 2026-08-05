'use client';

import { useParams, useRouter } from 'next/navigation';
import { getChallengeById } from '@/data/challenges';
import { CodeSandbox } from '@/components/code-sandbox';
import { useUserStore } from '@/store/use-user-store';
import { ResultModal } from '@/components/result-modal';
import { useState, useCallback } from 'react';
import { ArrowLeft, BookOpen, Code, Swords, Zap, Gem } from 'lucide-react';
import Link from 'next/link';

export default function ChallengeWorkspace() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.challengeId as string;
  const challenge = getChallengeById(challengeId);

  const { completeChallenge, addXp, addGems } = useUserStore();
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSuccess = useCallback(() => {
    if (!challenge) return;
    setIsCorrect(true);
    setShowResult(true);
    completeChallenge(challenge.id);
    addXp(challenge.rewardXp);
    addGems(challenge.rewardGems);
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
        <h1 className="text-2xl font-extrabold text-[#4B4B4B] mb-2">Challenge Not Found</h1>
        <Link href="/challenge" className="text-[#1CB0F6] font-bold hover:underline">
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
          <Link href="/challenge" className="text-[#AFAFAF] hover:text-[#4B4B4B] transition">
            <ArrowLeft size={24} strokeWidth={3} />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#4B4B4B]">{challenge.title}</h1>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            challenge.difficulty === 'Easy' ? 'text-[#58CC02] bg-[#E8F5E9] border-[#58CC02]' :
            challenge.difficulty === 'Medium' ? 'text-[#FF9600] bg-[#FFF3E0] border-[#FF9600]' :
            'text-[#FF4B4B] bg-[#FFEBEE] border-[#FF4B4B]'
          }`}>
            {challenge.difficulty}
          </span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[#FFC800] font-bold">
            <Zap size={20} fill="currentColor" /> {challenge.rewardXp} XP
          </div>
          <div className="flex items-center gap-1.5 text-[#1CB0F6] font-bold">
            <Gem size={20} fill="currentColor" /> {challenge.rewardGems} Gems
          </div>
        </div>
      </div>

      {/* Split Workspace */}
      <div className="flex-1 flex gap-6 overflow-hidden pb-4">
        {/* Left Panel: Description */}
        <div className="w-1/2 bg-white border-2 border-[#E5E5E5] rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-[#F7F7F7] border-b-2 border-[#E5E5E5] flex items-center gap-2">
            <BookOpen size={18} className="text-[#AFAFAF]" />
            <h2 className="font-extrabold text-[#AFAFAF] text-sm uppercase tracking-wider">Problem Description</h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 text-[#4B4B4B]">
            <div className="prose prose-sm max-w-none">
              {challenge.description.split('\n').map((line, i) => (
                <p key={i} className="mb-4 font-semibold leading-relaxed">
                  {line.split('`').map((part, j) => 
                    j % 2 === 1 ? (
                      <code key={j} className="bg-[#F7F7F7] text-[#FF4B4B] px-1.5 py-0.5 rounded text-sm font-mono font-bold">
                        {part}
                      </code>
                    ) : (
                      part
                    )
                  )}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-extrabold text-[#4B4B4B] mb-3">Examples:</h3>
              {challenge.examples.map((ex, i) => (
                <div key={i} className="mb-4 bg-[#F7F7F7] p-4 rounded-xl border border-[#E5E5E5]">
                  <p className="font-mono text-sm text-[#4B4B4B] mb-2"><strong className="text-[#AFAFAF]">Input:</strong> {ex.input}</p>
                  <p className="font-mono text-sm text-[#4B4B4B]"><strong className="text-[#AFAFAF]">Output:</strong> {ex.output}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-extrabold text-[#4B4B4B] mb-3">Constraints:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {challenge.constraints.map((c, i) => (
                  <li key={i} className="font-mono text-sm text-[#4B4B4B] bg-[#F7F7F7] px-2 py-1 rounded inline-block mb-2">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel: Code Sandbox */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2">
            <CodeSandbox
              initialCode={challenge.initialCode}
              expectedOutput={challenge.expectedOutput}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>
      </div>

      {showResult && (
        <ResultModal
          isOpen={true}
          isSuccess={isCorrect}
          xpEarned={isCorrect ? challenge.rewardXp : 0}
          onContinue={handleContinue}
          onRetry={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
