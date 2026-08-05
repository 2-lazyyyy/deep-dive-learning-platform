'use client';

import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const HeartsModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Heart size={48} className="text-[#FF4B4B]" fill="currentColor" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 border-4 border-[#FF4B4B] rounded-full"
          />
        </div>

        <h2 className="text-2xl font-extrabold text-[#4B4B4B] mb-2">
          You ran out of hearts!
        </h2>
        <p className="text-[#AFAFAF] font-bold mb-8">
          Don't worry, you can refill them in the shop or wait for them to regenerate.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              router.push('/shop');
            }}
            className="w-full py-3.5 bg-[#1CB0F6] hover:bg-[#1899D6] text-white font-extrabold rounded-2xl border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
          >
            Refill in Shop
          </button>
          <button
            onClick={() => {
              onClose();
              router.push('/');
            }}
            className="w-full py-3.5 bg-white text-[#1CB0F6] font-extrabold rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
          >
            End Lesson
          </button>
        </div>
      </motion.div>
    </div>
  );
};
