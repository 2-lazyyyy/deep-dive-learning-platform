'use client';

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
              ? 'bg-[#F0F8FF] border-[#0ba2b3]'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-6">
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
                    isSuccess ? 'text-teal-600' : 'text-red-600'
                  }`}
                >
                  {isSuccess ? 'Correct!' : 'Not quite right'}
                </h3>
                <p
                  className={`text-sm font-semibold mt-0.5 ${
                    isSuccess ? 'text-teal-500' : 'text-red-400'
                  }`}
                >
                  {message ||
                    (isSuccess
                      ? "You're doing great, keep it up!"
                      : "Don't worry, try again!")}
                </p>
                {isSuccess && xpEarned > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 mt-1.5"
                  >
                    <Star size={16} className="text-[#FFC800]" fill="currentColor" />
                    <span className="text-sm font-bold text-[#FFC800]">
                      +{xpEarned} XP
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: Action Button */}
            {isSuccess ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContinue}
                className="flex items-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold py-3 px-8 rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-sm"
              >
                CONTINUE
                <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRetry || onContinue}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-extrabold py-3 px-8 rounded-xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide text-sm"
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
