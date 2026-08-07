'use client';

import { motion } from 'framer-motion';
import { Flame, Medal, Crown, Star, ArrowLeft, Target, Book, Zap, Award, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

// Expanded mock data for all achievements
const ALL_ACHIEVEMENTS = [
  { id: 1, title: 'Wildfire', desc: 'Reach a 7-day streak', icon: Flame, color: 'text-[#FF9600]', bg: 'bg-[#FF9600]/20', isUnlocked: true },
  { id: 2, title: 'Sage', desc: 'Earn 1,000 Total XP', icon: Star, color: 'text-[#FFC800]', bg: 'bg-[#FFC800]/20', isUnlocked: true },
  { id: 3, title: 'Scholar', desc: 'Learn 50 new words (Tokens)', icon: Medal, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20', isUnlocked: true },
  { id: 4, title: 'Champion', desc: 'Reach #1 in Bronze League', icon: Crown, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20', isUnlocked: true },
  { id: 5, title: 'Early Bird', desc: 'Complete a lesson before 8 AM', icon: Zap, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 6, title: 'Sharpshooter', desc: 'Complete 5 lessons with 100% accuracy', icon: Target, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 7, title: 'Bookworm', desc: 'Read 10 theory articles', icon: Book, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 8, title: 'Friendly Face', desc: 'Follow 5 friends', icon: Heart, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 9, title: 'World Traveler', desc: 'Complete a module in 3 different languages', icon: Globe, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 10, title: 'Legend', desc: 'Reach Diamond League', icon: Award, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
];

export default function StudentAchievementsPage() {
  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profile" className="p-2 hover:bg-[#F8F8F8] rounded-full transition text-[#1C1D20]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1C1D20]">All Achievements</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_ACHIEVEMENTS.map((ach, idx) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-5 rounded-2xl border-2 flex items-center gap-5 ${
              ach.isUnlocked 
                ? 'border-[#1C1D2033] bg-white' 
                : 'border-dashed border-[#1C1D2033] bg-[#F8F8F8] opacity-75 grayscale'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${ach.bg}`}>
              <ach.icon size={32} className={ach.color} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-lg text-[#1C1D20] mb-1">{ach.title}</h3>
              <p className="text-sm font-bold text-[#6B7280]">{ach.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
