'use client';

import { motion } from 'framer-motion';
import { Lock, Check, Star, Code } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/use-user-store';

interface LessonNodeProps {
  lessonId: string;
  lessonNumber: number;
  status: 'completed' | 'current' | 'locked' | 'unlocked';
  offsetX?: number;
  color?: string;
  colorDark?: string;
  isLast?: boolean;
  nextOffsetX?: number;
}

export const LessonNode = ({
  lessonId,
  lessonNumber,
  status,
  offsetX = 0,
  color = '#0ba2b3',
  colorDark = '#1e91a3',
  isLast = false,
  nextOffsetX = 0,
}: LessonNodeProps) => {
  const language = useUserStore((state) => state.language);
  const isAccessible = status !== 'locked';

  const getColors = () => {
    switch (status) {
      case 'completed':
        return { bg: color, shadow: colorDark };
      case 'current':
        return { bg: color, shadow: colorDark };
      case 'unlocked':
        return { bg: color, shadow: colorDark };
      case 'locked':
        return { bg: '', shadow: '' };
    }
  };

  const colors = getColors();

  const Icon = status === 'completed' ? Check : status === 'locked' ? Lock : Star;

  const node = (
    <div style={{ transform: `translateX(${offsetX}px)` }}>
      <motion.div
        whileHover={isAccessible ? { scale: 1.08, y: -2 } : {}}
        whileTap={isAccessible ? { scale: 0.95, y: 6 } : {}}
        className="relative flex flex-col items-center z-10"
      >
      {/* Pulse ring for current lesson */}
      {status === 'current' && (
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute w-[88px] h-[88px] rounded-full"
          style={{ backgroundColor: `${color}33` }}
        />
      )}

      {/* 3D Bottom shadow — slightly offset down for depth */}
      <div
        className={`absolute w-[78px] h-[78px] rounded-full ${status === 'locked' ? 'bg-[#9CA3AF] dark:bg-[#374151]' : ''}`}
        style={{
          ...(status !== 'locked' ? { backgroundColor: colors.shadow } : {}),
          top: '8px',
        }}
      />

      {/* Main bubble — oval/circle shape */}
      <div
        className={`relative w-[78px] h-[78px] rounded-full flex items-center justify-center ${status === 'locked' ? 'bg-[#D1D5DB] dark:bg-[#4B5563]' : ''}`}
        style={{
          ...(status !== 'locked' ? { backgroundColor: colors.bg } : {}),
        }}
      >
        {/* Reflections (only for unlocked) */}
        {status !== 'locked' && (
          <>
            {/* Top reflection / gloss highlight */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top: '4px',
                left: '12px',
                right: '12px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 100%)',
              }}
            />

            {/* Secondary subtle rim light at bottom */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                bottom: '6px',
                left: '18px',
                right: '18px',
                height: '10px',
                borderRadius: '50%',
                background: 'linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              }}
            />
          </>
        )}

        {/* Icon */}
        {status === 'completed' ? (
          <Icon size={34} className="text-white drop-shadow-sm" strokeWidth={3} />
        ) : status === 'locked' ? (
          <Icon size={28} className="text-[#6B7280] dark:text-[#9CA3AF]" strokeWidth={2.5} />
        ) : (
          <Code size={34} className="text-white drop-shadow-sm" strokeWidth={2.5} />
        )}
      </div>

      {/* "START" label for current lesson */}
      {status === 'current' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          <div
            className="text-white text-xs font-extrabold px-4 py-1.5 rounded-xl uppercase tracking-wider shadow-md"
            style={{
              backgroundColor: color,
              boxShadow: `0 4px 0 0 ${colorDark}`,
            }}
          >
            {language === 'my' ? 'စတင်မည်' : 'START'}
          </div>
        </motion.div>
      )}
    </motion.div>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center py-4 w-full">
      {isAccessible ? (
        <Link href={`/lesson/${lessonNumber}`} className="z-10">{node}</Link>
      ) : (
        <div className="z-10">{node}</div>
      )}
    </div>
  );
};
