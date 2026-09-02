'use client';

import React, { useState, useCallback } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/use-auth-store';
import { useUserStore } from '@/store/use-user-store';

interface CodeSandboxProps {
  lessonId: string;
  initialCode: string;
  expectedOutput?: string;
  onSuccess?: () => void;
  onError?: () => void;
  disabled?: boolean;
  isPractice?: boolean;
}

export const CodeSandbox = ({
  lessonId,
  initialCode,
  expectedOutput,
  onSuccess,
  onError,
  disabled = false,
  isPractice = false,
}: CodeSandboxProps) => {
  const language = useUserStore((state) => state.language);
  const [code, setCode] = useState(initialCode);
  const [hasResult, setHasResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');

  const handleRun = useCallback(async () => {
    if (disabled || isRunning) return;
    setHasResult(false);
    setIsCorrect(false);
    setIsRunning(true);
    setStdout('');
    setStderr('');

    try {
      const authState = useAuthStore.getState();
      const currentUserId = authState.user?.id || '00000000-0000-0000-0000-000000000002';
      const token = authState.token;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Submit Code to FastAPI Backend
      const response = await fetch('http://localhost:8000/api/v1/submissions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: currentUserId,
          lesson_id: lessonId,
          code: code,
          language: 'python',
          is_practice: isPractice
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Instant execution: if backend returned result directly, display immediately!
      if (data.status === 'completed' || data.status === 'error' || data.output !== undefined) {
        setIsRunning(false);
        setStdout(data.output || '');
        setStderr(data.error || '');
        setHasResult(true);
        
        if (data.passed) {
          setIsCorrect(true);
          onSuccess?.();
        } else {
          setIsCorrect(false);
          onError?.();
        }
        return;
      }

      const submissionId = data.submission_id;

      // Fallback: fast polling every 300ms if queued
      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`http://localhost:8000/api/v1/submissions/${submissionId}`);
          if (!checkRes.ok) throw new Error('Failed to check submission status');
          
          const checkData = await checkRes.json();
          
          if (checkData.status === 'completed' || checkData.status === 'error') {
            clearInterval(pollInterval);
            setIsRunning(false);
            setStdout(checkData.output || '');
            setStderr(checkData.error || '');
            setHasResult(true);
            
            if (checkData.passed) {
              setIsCorrect(true);
              onSuccess?.();
            } else {
              setIsCorrect(false);
              onError?.();
            }
          }
        } catch (pollErr) {
          clearInterval(pollInterval);
          setIsRunning(false);
          setStderr(String(pollErr));
          setIsCorrect(false);
          setHasResult(true);
          onError?.();
        }
      }, 300);

    } catch (err) {
      setIsRunning(false);
      setStderr(String(err));
      setIsCorrect(false);
      setHasResult(true);
      onError?.();
    }
  }, [code, disabled, isRunning, lessonId, onSuccess, onError]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Code Editor */}
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-gray-400 text-xs font-mono uppercase tracking-wider">
            Python
          </span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-44 p-4 font-mono text-sm bg-gray-900 text-green-400 outline-none resize-none leading-relaxed"
          spellCheck="false"
          disabled={disabled || isRunning}
        />
      </div>

      {/* Run Button */}
      <motion.button
        whileHover={!disabled && !isRunning ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isRunning ? { scale: 0.98 } : {}}
        onClick={handleRun}
        disabled={isRunning || disabled}
        className="flex items-center justify-center gap-2.5 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold py-3.5 px-8 rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
      >
        {isRunning ? (
          <>
            <Loader2 size={20} className="animate-spin" strokeWidth={3} />
            <span>{language === 'my' ? 'Cloud ပေါ်တွင် ကုဒ် run နေပါသည်...' : 'RUNNING ON CLOUD...'}</span>
          </>
        ) : (
          <>
            <Play size={20} fill="currentColor" strokeWidth={0} />
            <span>{language === 'my' ? 'ကုဒ် စစ်ဆေးမည်' : 'CHECK'}</span>
          </>
        )}
      </motion.button>

      {/* Console Output */}
      {hasResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`p-4 rounded-xl border-2 font-mono text-sm shadow-sm ${
            isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p className={`mb-2 font-bold uppercase text-xs tracking-wider ${
            isCorrect ? 'text-green-500' : 'text-red-500'
          }`}>
            {language === 'my' ? 'စနစ် ထွက်ပေါ်ရလဒ် (Console Output):' : 'Console Output:'}
          </p>
          {stdout && (
            <pre className="text-gray-800 whitespace-pre-wrap">{stdout}</pre>
          )}
          {stderr && (
            <pre className="text-red-600 whitespace-pre-wrap">{stderr}</pre>
          )}
          {!isCorrect && expectedOutput && !stderr && (
            <div className="mt-4 border-t border-red-200 pt-4">
              <p className="mb-2 font-bold uppercase text-xs tracking-wider text-red-500">
                {language === 'my' ? 'မျှော်မှန်းရလဒ် (Expected Output):' : 'Expected Output:'}
              </p>
              <pre className="text-gray-800 whitespace-pre-wrap">{expectedOutput}</pre>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
