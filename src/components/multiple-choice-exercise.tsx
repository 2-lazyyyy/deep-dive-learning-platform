'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <p key={idx} className="text-[#4B4B4B] font-bold text-base leading-relaxed">
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
                    ? 'bg-[#E8F5E9] border-[#58CC02] text-[#2E7D32]'
                    : showWrong
                    ? 'bg-[#FFEBEE] border-[#FF4B4B] text-[#C62828]'
                    : isSelected
                    ? 'bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6]'
                    : 'bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7] hover:border-[#CECECE]'
                }`}
              >
                {/* Radio circle / Check/X icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                    showCorrect
                      ? 'bg-[#58CC02] border-[#46A302]'
                      : showWrong
                      ? 'bg-[#FF4B4B] border-[#E53E3E]'
                      : isSelected
                      ? 'bg-[#1CB0F6] border-[#1899D6]'
                      : 'bg-white border-[#E5E5E5]'
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
                ? 'bg-[#E8F5E9] border-2 border-green-200'
                : 'bg-[#FFEBEE] border-2 border-red-200'
            }`}
          >
            <p
              className={`font-extrabold text-sm ${
                result === 'correct' ? 'text-[#2E7D32]' : 'text-[#C62828]'
              }`}
            >
              {result === 'correct'
                ? '✅ Correct! Well done!'
                : `❌ Not quite. The answer is: ${options[correctIndex]}`}
            </p>
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
            ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302]'
            : result === 'wrong'
            ? 'bg-[#FF9600] text-white border-b-4 border-[#E08500]'
            : selectedIndex !== null
            ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:border-b-0 active:translate-y-1'
            : 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed'
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
