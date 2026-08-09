'use client';

import React, { useState, useCallback } from 'react';
import { usePython } from 'react-py';
import { Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeSandboxProps {
  initialCode: string;
  expectedOutput?: string;
  onSuccess?: () => void;
  onError?: () => void;
  disabled?: boolean;
}

export const CodeSandbox = ({
  initialCode,
  expectedOutput,
  onSuccess,
  onError,
  disabled = false,
}: CodeSandboxProps) => {
  const [code, setCode] = useState(initialCode);
  const [hasResult, setHasResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasChecked, setHasChecked] = useState(true);
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const handleRun = useCallback(async () => {
    if (disabled) return;
    setHasResult(false);
    setIsCorrect(false);
    setHasChecked(false);

    try {
      await runPython(code);
    } catch {
      // Errors are captured in stderr by react-py
    }
  }, [code, runPython, disabled]);

  // Check result after execution completes
  React.useEffect(() => {
    if (!isRunning && !isLoading && (stdout || stderr) && !hasChecked) {
      setHasResult(true);
      setHasChecked(true);

      if (expectedOutput && !stderr) {
        const normalize = (str: string) => str.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
        const normalizedStdout = normalize(stdout);
        const normalizedExpected = normalize(expectedOutput);

        const cleanStdout = normalizedStdout.replace(/[^a-zA-Z0-9-]/g, '');
        const cleanExpected = normalizedExpected.replace(/[^a-zA-Z0-9-]/g, '');
        const isMatch = cleanStdout === cleanExpected;

        if (isMatch) {
          setIsCorrect(true);
          onSuccess?.();
        } else {
          setIsCorrect(false);
          onError?.();
        }
      } else if (stderr) {
        setIsCorrect(false);
        onError?.();
      }
    }
  }, [isRunning, isLoading, stdout, stderr, expectedOutput, onSuccess, onError, hasChecked]);

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
          disabled={disabled}
        />
      </div>

      {/* Run Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={handleRun}
        disabled={isLoading || isRunning || disabled}
        className="flex items-center justify-center gap-2.5 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold py-3.5 px-8 rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
      >
        {isLoading || isRunning ? (
          <>
            <Loader2 size={20} className="animate-spin" strokeWidth={3} />
            {isLoading ? 'LOADING ENGINE...' : 'RUNNING...'}
          </>
        ) : (
          <>
            <Play size={20} fill="currentColor" strokeWidth={0} />
            CHECK
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
            Console Output:
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
                Expected Output:
              </p>
              <pre className="text-gray-800 whitespace-pre-wrap">{expectedOutput}</pre>

            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
