'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Shield, Star, Trophy, Users, BookOpen, CheckCircle, TrendingUp, Swords } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 1, title: 'Master Educator', desc: 'Reach 100 total students', icon: Users, color: 'text-[#FF9600]', bg: 'bg-[#FF9600]/20' },
  { id: 2, title: 'Top Rated', desc: 'Maintain a 95% pass rate', icon: Star, color: 'text-[#FFC800]', bg: 'bg-[#FFC800]/20' },
  { id: 3, title: 'Curriculum Creator', desc: 'Publish 10 active lessons', icon: BookOpen, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20' },
  { id: 4, title: 'Submission Reviewer', desc: 'Review 1,000 submissions', icon: CheckCircle, color: 'text-[#0ba2b3]', bg: 'bg-[#0ba2b3]/20' },
];

export default function TeacherProfilePage() {
  const teacherName = "Teacher Alex";
  const handle = "@teacheralex";
  
  return (
    <div className="pb-20 max-w-2xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex items-center gap-6 mb-8 border-b-2 border-[#1C1D2033] pb-8">
        <div className="relative">
          <div className="w-32 h-32 shrink-0 rounded-full bg-[#0ba2b3] flex items-center justify-center text-white shadow-inner border-4 border-white">
            <User size={48} />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-[#1C1D20]">
            {teacherName}
          </h1>
          <p className="text-lg font-bold text-[#6B7280]">
            {handle}
          </p>
          <p className="text-[#1C1D20] font-bold mt-2">Joined August 2026</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-[#1C1D20] mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border-2 border-[#1C1D2033] flex items-center gap-4 bg-white">
            <Swords size={32} className="text-[#0ba2b3]" />
            <div>
              <p className="font-extrabold text-xl text-[#1C1D20]">24</p>
              <p className="text-sm font-bold text-[#1C1D20]">Challenges Made</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#1C1D2033] flex items-center gap-4 bg-white">
            <BookOpen size={32} className="text-[#0ba2b3]" />
            <div>
              <p className="font-extrabold text-xl text-[#1C1D20]">10</p>
              <p className="text-sm font-bold text-[#1C1D20]">Active Lessons</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#1C1D2033] flex items-center gap-4 bg-white">
            <CheckCircle size={32} className="text-[#0ba2b3]" />
            <div>
              <p className="font-extrabold text-xl text-[#1C1D20]">1,248</p>
              <p className="text-sm font-bold text-[#1C1D20]">Submissions</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl border-2 border-[#1C1D2033] flex items-center gap-4 bg-white">
            <TrendingUp size={32} className="text-[#0ba2b3]" />
            <div>
              <p className="font-extrabold text-xl text-[#1C1D20]">78%</p>
              <p className="text-sm font-bold text-[#1C1D20]">Pass Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#1C1D20]">Achievements</h2>
          <Link href="/teacher/profile/achievements" className="text-sm font-bold text-[#0ba2b3] hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {ACHIEVEMENTS.map((ach) => (
            <div key={ach.id} className="p-4 rounded-2xl border-2 border-[#1C1D2033] flex items-center gap-4 bg-white">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${ach.bg}`}>
                <ach.icon size={28} className={ach.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg text-[#1C1D20]">{ach.title}</h3>
                <p className="text-sm font-bold text-[#1C1D20]">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
