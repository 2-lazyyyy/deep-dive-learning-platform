'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Check, X } from 'lucide-react';

interface MultipleChoiceExerciseProps {
  question: string;
  options: string[];
  correctIndex: number;
  onSuccess: () => void;
  onError: () => void;
}

export const MultipleChoiceExercise = ({
  question,
  options,
  correctIndex,
  onSuccess,
  onError,
}: MultipleChoiceExerciseProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<'none' | 'correct' | 'wrong'>('none');

  const handleCheck = useCallback(() => {
    if (selectedIndex === null) return;

    if (selectedIndex === correctIndex) {
      setResult('correct');
      onSuccess();
    } else {
      setResult('wrong');
      onError();
    }
  }, [selectedIndex, correctIndex, onSuccess, onError]);

  const handleReset = useCallback(() => {
    setSelectedIndex(null);
    setResult('none');
  }, []);

  // Render question with code blocks
  const renderQuestion = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.replace(/```\w*\n?/, '').replace(/```$/, '').trim();
        return (
          <pre
            key={idx}
            className="bg-[#1E293B] text-green-400 p-4 rounded-xl text-sm font-mono my-3 overflow-x-auto"
          >
            {codeContent}
          </pre>
        );
      }
      return (
        <p key={idx} className="text-[#1C1D20] font-bold text-base leading-relaxed">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Question */}
      <div className="flex-1">
        <div className="mb-6">{renderQuestion(question)}</div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectAnswer = idx === correctIndex;
            const showCorrect = result !== 'none' && isCorrectAnswer;
            const showWrong = result === 'wrong' && isSelected && !isCorrectAnswer;

            return (
              <motion.button
                key={idx}
                whileHover={result === 'none' ? { scale: 1.01 } : {}}
                whileTap={result === 'none' ? { scale: 0.99 } : {}}
                onClick={() => result === 'none' && setSelectedIndex(idx)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all border-2 ${
                  showCorrect
                    ? 'bg-[#F0F8FF] border-[#0ba2b3] text-[#1e91a3]'
                    : showWrong
                    ? 'bg-[#FFEBEE] border-[#FC4B0B] text-[#C62828]'
                    : isSelected
                    ? 'bg-[#F0F8FF] border-[#0ba2b3] text-[#0ba2b3]'
                    : 'bg-white border-[#1C1D2033] text-[#1C1D20] hover:bg-[#F8F8F8] hover:border-[#CECECE]'
                }`}
              >
                {/* Radio circle / Check/X icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                    showCorrect
                      ? 'bg-[#0ba2b3] border-[#1e91a3]'
                      : showWrong
                      ? 'bg-[#FC4B0B] border-[#E53E3E]'
                      : isSelected
                      ? 'bg-[#0ba2b3] border-[#1e91a3]'
                      : 'bg-white border-[#1C1D2033]'
                  }`}
                >
                  {showCorrect && <Check size={16} className="text-white" strokeWidth={3} />}
                  {showWrong && <X size={16} className="text-white" strokeWidth={3} />}
                  {isSelected && result === 'none' && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>

                {/* Option text */}
                <span className="font-bold text-sm flex-1">{option}</span>
              </motion.button>
            );
          })}
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
                ? 'bg-[#F0F8FF] border-2 border-[#1e91a3]'
                : 'bg-[#FC4B0B]/10 border-2 border-[#FC4B0B]'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-extrabold text-sm ${
                result === 'correct' ? 'text-[#0ba2b3]' : 'text-[#FC4B0B]'
              }`}
            >
              {result === 'correct' ? (
                <>
                  <CheckCircle size={18} strokeWidth={3} />
                  Correct! Well done!
                </>
              ) : (
                <>
                  <XCircle size={18} strokeWidth={3} />
                  Not quite. The answer is: {options[correctIndex]}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECK Button */}
      <motion.button
        whileHover={selectedIndex !== null && result === 'none' ? { scale: 1.02 } : {}}
        whileTap={selectedIndex !== null && result === 'none' ? { scale: 0.98, y: 2 } : {}}
        onClick={result === 'wrong' ? handleReset : handleCheck}
        disabled={selectedIndex === null && result === 'none'}
        className={`w-full py-3.5 rounded-2xl font-extrabold text-base uppercase tracking-wider transition-all ${
          result === 'correct'
            ? 'bg-[#0ba2b3] text-white border-b-4 border-[#1e91a3]'
            : result === 'wrong'
            ? 'bg-[#FF9600] text-white border-b-4 border-[#E08500]'
            : selectedIndex !== null
            ? 'bg-[#0ba2b3] text-white border-b-4 border-[#1e91a3] hover:bg-[#1e91a3] active:border-b-0 active:translate-y-1'
            : 'bg-[#1C1D2033] text-[#1C1D20] cursor-not-allowed'
        }`}
      >
        {result === 'correct' ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={20} /> CONTINUE
          </span>
        ) : result === 'wrong' ? (
          'TRY AGAIN'
        ) : (
          'CHECK'
        )}
      </motion.button>
    </div>
  );
};
