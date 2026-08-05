'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, CheckCircle, XCircle, TrendingUp, Clock, Flame } from 'lucide-react';

// Mock data for teacher dashboard
const stats = {
  totalStudents: 156,
  onlineNow: 23,
  totalSubmissions: 1248,
  passRate: 78,
  avgCompletionTime: '4.2 min',
  activeLessons: 10,
  todaySubmissions: 47,
};

const recentSubmissions = [
  { id: 1, student: 'Aung Kyaw', lesson: 'Output ထုတ်ခြင်း', status: 'pass', time: '2 min ago', xp: 10 },
  { id: 2, student: 'Thiri Wai', lesson: 'F-String သုံးခြင်း', status: 'fail', time: '5 min ago', xp: 0 },
  { id: 3, student: 'Min Thant', lesson: '.format() သုံးခြင်း', status: 'pass', time: '8 min ago', xp: 15 },
  { id: 4, student: 'Su Su', lesson: 'Variable တည်ဆောက်ခြင်း', status: 'pass', time: '12 min ago', xp: 15 },
  { id: 5, student: 'Zaw Lin', lesson: 'If Statement ရေးခြင်း', status: 'fail', time: '15 min ago', xp: 0 },
  { id: 6, student: 'Aye Chan', lesson: 'For Loop ရေးခြင်း', status: 'pass', time: '20 min ago', xp: 25 },
];

// Simple bar chart data (submissions per day, last 7 days)
const chartData = [
  { day: 'Mon', count: 32 },
  { day: 'Tue', count: 45 },
  { day: 'Wed', count: 28 },
  { day: 'Thu', count: 56 },
  { day: 'Fri', count: 41 },
  { day: 'Sat', count: 18 },
  { day: 'Sun', count: 47 },
];

const maxCount = Math.max(...chartData.map((d) => d.count));

export default function TeacherDashboard() {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#4B4B4B]">Dashboard</h1>
        <p className="text-sm font-semibold text-[#AFAFAF] mt-1">
          မင်္ဂလာပါ ဆရာ/ဆရာမ။ ဒီနေ့ student တွေရဲ့ progress ကိုကြည့်ပါ။
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users size={24} className="text-[#1CB0F6]" />}
          label="Total Students"
          value={stats.totalStudents}
          sub={`${stats.onlineNow} online`}
          color="bg-blue-50"
          borderColor="border-blue-200"
          delay={0}
        />
        <StatCard
          icon={<BookOpen size={24} className="text-[#58CC02]" />}
          label="Active Lessons"
          value={stats.activeLessons}
          sub="modules 4 ခု"
          color="bg-green-50"
          borderColor="border-green-200"
          delay={0.05}
        />
        <StatCard
          icon={<CheckCircle size={24} className="text-[#FFC800]" />}
          label="Total Submissions"
          value={stats.totalSubmissions}
          sub={`${stats.todaySubmissions} today`}
          color="bg-yellow-50"
          borderColor="border-yellow-200"
          delay={0.1}
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-[#CE82FF]" />}
          label="Pass Rate"
          value={`${stats.passRate}%`}
          sub={`avg ${stats.avgCompletionTime}`}
          color="bg-purple-50"
          borderColor="border-purple-200"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-[#E5E5E5] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-[#4B4B4B]">Submissions This Week</h2>
            <span className="text-xs font-bold text-[#AFAFAF] bg-[#F7F7F7] px-3 py-1 rounded-full">
              Last 7 days
            </span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-[180px]">
            {chartData.map((d, idx) => {
              const heightPct = (d.count / maxCount) * 100;
              const isToday = idx === chartData.length - 1;
              return (
                <div key={d.day} className="flex flex-col items-center flex-1 gap-2">
                  <span className="text-xs font-extrabold text-[#4B4B4B]">{d.count}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.3 + idx * 0.05, duration: 0.5, ease: 'easeOut' }}
                    className={`w-full rounded-t-lg relative overflow-hidden ${
                      isToday ? 'bg-[#CE82FF]' : 'bg-[#1CB0F6]'
                    }`}
                  >
                    <div className="absolute top-0 left-1 right-1 h-2 bg-white/20 rounded-full mt-1" />
                  </motion.div>
                  <span
                    className={`text-xs font-bold ${isToday ? 'text-[#CE82FF]' : 'text-[#AFAFAF]'}`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Pass / Fail Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 flex flex-col items-center justify-center"
        >
          <h2 className="font-extrabold text-[#4B4B4B] mb-4 self-start">Pass / Fail</h2>

          <div className="relative w-[140px] h-[140px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#FFE5E5" strokeWidth="14" />
              {/* Pass arc */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#58CC02"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - stats.passRate / 100) }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-[#4B4B4B]">{stats.passRate}%</span>
              <span className="text-xs font-bold text-[#AFAFAF]">Pass</span>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#58CC02]" />
              <span className="text-xs font-bold text-[#777777]">Pass</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FFE5E5]" />
              <span className="text-xs font-bold text-[#777777]">Fail</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#E5E5E5]">
          <h2 className="font-extrabold text-[#4B4B4B]">Recent Submissions</h2>
          <a href="/teacher/submissions" className="text-sm font-bold text-[#1CB0F6] hover:underline">
            View all →
          </a>
        </div>

        <div className="divide-y divide-[#E5E5E5]">
          {recentSubmissions.map((sub, idx) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.04 }}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F7F7F7] transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Status icon */}
                {sub.status === 'pass' ? (
                  <CheckCircle size={20} className="text-[#58CC02]" fill="currentColor" />
                ) : (
                  <XCircle size={20} className="text-[#FF4B4B]" fill="currentColor" />
                )}

                <div>
                  <p className="font-bold text-[#4B4B4B] text-sm">{sub.student}</p>
                  <p className="text-xs font-semibold text-[#AFAFAF]">{sub.lesson}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {sub.xp > 0 && (
                  <span className="text-xs font-extrabold text-[#58CC02]">+{sub.xp} XP</span>
                )}
                <div className="flex items-center gap-1 text-xs font-semibold text-[#AFAFAF]">
                  <Clock size={12} />
                  {sub.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  borderColor,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  borderColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`${color} border-2 ${borderColor} rounded-2xl p-4`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF]">
          {label}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-[#4B4B4B]">{value}</p>
      <p className="text-xs font-bold text-[#AFAFAF] mt-0.5 flex items-center gap-1">
        <Flame size={12} className="text-[#FF9600]" />
        {sub}
      </p>
    </motion.div>
  );
}
