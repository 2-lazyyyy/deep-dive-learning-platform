'use client';

import { motion } from 'framer-motion';
import { Users, Star, BookOpen, CheckCircle, ArrowLeft, Trophy, Target, Shield, Clock, Award } from 'lucide-react';
import Link from 'next/link';

const TEACHER_ACHIEVEMENTS = [
  { id: 1, title: 'Master Educator', desc: 'Reach 100 total students', icon: Users, color: 'text-[#FF9600]', bg: 'bg-[#FF9600]/20', isUnlocked: true },
  { id: 2, title: 'Top Rated', desc: 'Maintain a 95% pass rate', icon: Star, color: 'text-[#FFC800]', bg: 'bg-[#FFC800]/20', isUnlocked: true },
  { id: 3, title: 'Curriculum Creator', desc: 'Publish 10 active lessons', icon: BookOpen, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20', isUnlocked: true },
  { id: 4, title: 'Submission Reviewer', desc: 'Review 1,000 submissions', icon: CheckCircle, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20', isUnlocked: true },
  { id: 5, title: 'Quick Responder', desc: 'Reply to 50 student questions within an hour', icon: Clock, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 6, title: 'Challenge Master', desc: 'Create 20 coding challenges', icon: Target, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 7, title: 'Mentor', desc: 'Have 10 students reach the Diamond League', icon: Trophy, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 8, title: 'Veteran', desc: 'Teach actively for 1 year', icon: Shield, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
  { id: 9, title: 'Influencer', desc: 'Get 500 upvotes on your lessons', icon: Award, color: 'text-[#6B7280]', bg: 'bg-[#F3F3F3]', isUnlocked: false },
];

export default function TeacherAchievementsPage() {
  return (
    <div className="pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/teacher/profile" className="p-2 hover:bg-[#F8F8F8] rounded-full transition text-[#1C1D20]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1C1D20]">All Achievements</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEACHER_ACHIEVEMENTS.map((ach, idx) => (
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
