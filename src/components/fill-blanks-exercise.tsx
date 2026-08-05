'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';

interface FillBlanksExerciseProps {
  codeTemplate: string[];
  correctTokens: string[];
  tokenPool: string[];
  onSuccess: () => void;
  onError: () => void;
}

export const FillBlanksExercise = ({
  codeTemplate,
  correctTokens,
  tokenPool,
  onSuccess,
  onError,
}: FillBlanksExerciseProps) => {
  const totalBlanks = correctTokens.length;

  // Track filled blanks — null means unfilled
  const [filledTokens, setFilledTokens] = useState<(string | null)[]>(
    new Array(totalBlanks).fill(null)
  );
  // Track which pool tokens have been used
  const [usedPoolIndices, setUsedPoolIndices] = useState<Set<number>>(new Set());
  // Track result state
  const [result, setResult] = useState<'none' | 'correct' | 'wrong'>('none');

  // Next blank index to fill
  const nextBlankIndex = filledTokens.findIndex((t) => t === null);

  // Pick a token from the pool
  const handlePickToken = useCallback(
    (token: string, poolIdx: number) => {
      if (usedPoolIndices.has(poolIdx)) return;
      if (nextBlankIndex === -1) return;

      const newFilled = [...filledTokens];
      newFilled[nextBlankIndex] = token;
      setFilledTokens(newFilled);
      setUsedPoolIndices((prev) => new Set([...prev, poolIdx]));
    },
    [filledTokens, usedPoolIndices, nextBlankIndex]
  );

  // Click on a filled blank to remove it
  const handleRemoveBlank = useCallback(
    (blankIdx: number) => {
      if (filledTokens[blankIdx] === null) return;
      if (result !== 'none') return;

      // Find which pool index corresponds to this token
      const token = filledTokens[blankIdx];
      const newFilled = [...filledTokens];
      newFilled[blankIdx] = null;
      setFilledTokens(newFilled);

      // Un-use the pool token
      const poolIdx = tokenPool.findIndex(
        (t, i) => t === token && usedPoolIndices.has(i)
      );
      if (poolIdx !== -1) {
        setUsedPoolIndices((prev) => {
          const next = new Set(prev);
          next.delete(poolIdx);
          return next;
        });
      }
    },
    [filledTokens, usedPoolIndices, tokenPool, result]
  );

  // Check answers
  const handleCheck = useCallback(() => {
    const allFilled = filledTokens.every((t) => t !== null);
    if (!allFilled) return;

    const isCorrect = filledTokens.every(
      (t, i) => t === correctTokens[i]
    );

    if (isCorrect) {
      setResult('correct');
      onSuccess();
    } else {
      setResult('wrong');
      onError();
    }
  }, [filledTokens, correctTokens, onSuccess, onError]);

  // Reset
  const handleReset = useCallback(() => {
    setFilledTokens(new Array(totalBlanks).fill(null));
    setUsedPoolIndices(new Set());
    setResult('none');
  }, [totalBlanks]);

  // Render code template with blanks
  const renderCodeLine = (line: string, lineIdx: number) => {
    const parts = line.split('_BLANK_');
    let blankCounter = 0;

    // Count blanks in previous lines
    for (let i = 0; i < lineIdx; i++) {
      const count = (codeTemplate[i].match(/_BLANK_/g) || []).length;
      blankCounter += count;
    }

    return (
      <div key={lineIdx} className="flex items-center flex-wrap gap-1 min-h-[36px]">
        <span className="text-[#6B7280] text-xs mr-2 select-none w-5 text-right">
          {lineIdx + 1}
        </span>
        {parts.map((part, partIdx) => {
          const isLastPart = partIdx === parts.length - 1;
          const currentBlankIdx = blankCounter;
          if (!isLastPart) blankCounter++;

          return (
            <span key={partIdx} className="flex items-center gap-1">
              {/* Code text before the blank */}
              {part && (
                <span className="text-[#E5E7EB] font-mono text-sm whitespace-pre">
                  {part}
                </span>
              )}

              {/* The blank slot */}
              {!isLastPart && (
                <motion.button
                  onClick={() => handleRemoveBlank(currentBlankIdx)}
                  whileTap={{ scale: 0.9 }}
                  className={`inline-flex items-center justify-center min-w-[52px] h-[32px] px-2.5 rounded-lg font-mono text-sm font-bold transition-all ${
                    filledTokens[currentBlankIdx] !== null
                      ? result === 'correct'
                        ? 'bg-[#58CC02] text-white border-2 border-[#46A302]'
                        : result === 'wrong'
                        ? 'bg-[#FF4B4B] text-white border-2 border-[#E53E3E]'
                        : 'bg-[#1CB0F6] text-white border-2 border-[#1899D6] cursor-pointer hover:bg-[#1899D6]'
                      : currentBlankIdx === nextBlankIndex
                      ? 'bg-[#374151] border-2 border-dashed border-[#1CB0F6] text-[#1CB0F6] animate-pulse'
                      : 'bg-[#374151] border-2 border-dashed border-[#4B5563] text-[#6B7280]'
                  }`}
                >
                  {filledTokens[currentBlankIdx] ?? ''}
                </motion.button>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const allFilled = filledTokens.every((t) => t !== null);

  return (
    <div className="flex flex-col h-full">
      {/* Code Template Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF]">
            python
          </span>
          {result !== 'none' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1CB0F6] hover:text-[#1899D6]"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        <div className="bg-[#1E293B] rounded-2xl p-5 space-y-1.5 mb-6">
          {codeTemplate.map((line, idx) => renderCodeLine(line, idx))}
        </div>

        {/* Token Pool */}
        <div className="mb-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] mb-3">
            Available Tokens
          </p>
          <div className="flex flex-wrap gap-2">
            {tokenPool.map((token, idx) => {
              const isUsed = usedPoolIndices.has(idx);
              return (
                <motion.button
                  key={`${token}-${idx}`}
                  whileHover={!isUsed && result === 'none' ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!isUsed && result === 'none' ? { scale: 0.95 } : {}}
                  onClick={() => result === 'none' && handlePickToken(token, idx)}
                  disabled={isUsed || result !== 'none'}
                  className={`px-4 py-2 rounded-xl font-mono text-sm font-bold transition-all ${
                    isUsed
                      ? 'bg-[#F7F7F7] text-[#E5E5E5] border-2 border-[#F7F7F7] cursor-default'
                      : 'bg-white text-[#4B4B4B] border-2 border-[#E5E5E5] hover:border-[#1CB0F6] hover:bg-[#DDF4FF] cursor-pointer shadow-sm'
                  }`}
                >
                  {token}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Feedback */}
      <AnimatePresence>
        {result !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`px-5 py-4 rounded-2xl mb-4 ${
              result === 'correct'
                ? 'bg-[#E8F5E9] border-2 border-green-200'
                : 'bg-[#FFEBEE] border-2 border-red-200'
            }`}
          >
            <p className={`font-extrabold text-sm ${result === 'correct' ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
              {result === 'correct' ? '✅ Correct! Well done!' : '❌ Not quite. Try again!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECK Button */}
      <motion.button
        whileHover={allFilled && result === 'none' ? { scale: 1.02 } : {}}
        whileTap={allFilled && result === 'none' ? { scale: 0.98, y: 2 } : {}}
        onClick={result === 'wrong' ? handleReset : handleCheck}
        disabled={!allFilled && result === 'none'}
        className={`w-full py-3.5 rounded-2xl font-extrabold text-base uppercase tracking-wider transition-all ${
          result === 'correct'
            ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]'
            : result === 'wrong'
            ? 'bg-[#FF9600] text-white border-b-4 border-[#E08500]'
            : allFilled
            ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:border-b-0 active:translate-y-1'
            : 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed'
        }`}
      >
        {result === 'correct' ? (
          <span className="flex items-center justify-center gap-2"><Check size={20} /> CONTINUE</span>
        ) : result === 'wrong' ? (
          'TRY AGAIN'
        ) : (
          'CHECK'
        )}
      </motion.button>
    </div>
  );
};
