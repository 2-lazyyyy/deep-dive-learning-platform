'use client';

import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const HeartsModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000313]/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#000313] rounded-3xl p-8 max-w-sm w-full text-center relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#000313] dark:text-white hover:text-[#000313] dark:text-white transition-colors"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Heart size={48} className="text-[#FC4B0B]" fill="currentColor" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 border-4 border-[#FC4B0B] rounded-full"
          />
        </div>

        <h2 className="text-2xl font-extrabold text-[#000313] dark:text-white mb-2">
          You ran out of hearts!
        </h2>
        <p className="text-[#000313] dark:text-white font-bold mb-8">
          Don't worry, you can refill them in the shop or wait for them to regenerate.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              router.push('/shop');
            }}
            className="w-full py-3.5 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold rounded-2xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
          >
            Refill in Shop
          </button>
          <button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="w-full py-3.5 bg-white dark:bg-[#000313] text-[#0ba2b3] font-extrabold rounded-2xl border-2 border-[#00031333] dark:border-white/20 hover:bg-[#F8F8F8] dark:bg-[#060a1d] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
          >
            End Lesson
          </button>
        </div>
      </motion.div>
    </div>
  );
};
