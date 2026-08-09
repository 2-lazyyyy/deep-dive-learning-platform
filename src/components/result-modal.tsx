'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Star } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  xpEarned?: number;
  message?: string;
  onContinue: () => void;
  onRetry?: () => void;
}

export const ResultModal = ({
  isOpen,
  isSuccess,
  xpEarned = 0,
  message,
  onContinue,
  onRetry,
}: ResultModalProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleAction = (action: () => void) => {
    if (isClicked) return;
    setIsClicked(true);
    action();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed bottom-0 left-0 right-0 z-50 border-t-2 ${
            isSuccess
              ? 'bg-[#F0F8FF] dark:bg-[#0a1128] border-[#0ba2b3]'
              : 'bg-red-50 dark:bg-[#2b0d0d] border-red-200 dark:border-red-900'
          }`}
        >
          {/* Mascot appearing from behind the box */}
          <motion.img 
            src={isSuccess ? "/mascot2.svg" : "/mascot3.svg"}
            alt={isSuccess ? "Happy Mascot" : "Encouraging Mascot"}
            initial={{ y: 150, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 14 }}
            className="absolute -top-[140px] left-1/2 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] sm:-top-[180px] object-contain drop-shadow-2xl z-[-1] pointer-events-none"
          />
          
          <div className="relative max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-6 z-10">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-4">
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                >
                  <CheckCircle size={48} className="text-[#0ba2b3]" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                >
                  <XCircle size={48} className="text-red-500" strokeWidth={2.5} />
                </motion.div>
              )}

              <div>
                <h3
                  className={`text-xl font-extrabold ${
                    isSuccess ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isSuccess ? 'Correct!' : 'Not quite right'}
                </h3>
                <p
                  className={`text-sm font-semibold mt-0.5 ${
                    isSuccess ? 'text-teal-500 dark:text-teal-300' : 'text-red-400 dark:text-red-300'
                  }`}
                >
                  {message ||
                    (isSuccess
                      ? "You're doing great, keep it up!"
                      : "Don't worry, try again!")}
                </p>
                <div className="min-h-[24px] mt-1.5">
                  {isSuccess && xpEarned > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-1.5"
                    >
                      <Star size={16} className="text-[#FFC800]" fill="currentColor" />
                      <span className="text-sm font-bold text-[#FFC800]">
                        +{xpEarned} XP
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action Button */}
            {isSuccess ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAction(onContinue)}
                disabled={isClicked}
                className="flex items-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold py-3 px-8 rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                CONTINUE
                <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAction(onRetry || onContinue)}
                disabled={isClicked}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-extrabold py-3 px-8 rounded-xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                TRY AGAIN
                <RotateCcw size={18} strokeWidth={3} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
