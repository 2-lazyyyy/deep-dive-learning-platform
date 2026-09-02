'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, CheckCircle, XCircle, TrendingUp, Clock, Flame, Play, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  online_students: number;
  total_submissions: number;
  passed_submissions: number;
  failed_submissions: number;
  total_lessons: number;
}

interface SubmissionItem {
  id: string;
  user_id: string;
  lesson_id: string;
  submitted_code: string;
  language: string;
  status: string;
  passed: boolean | null;
  output: string | null;
  error: string | null;
  execution_time_ms: number | null;
  created_at: string;
  user_name?: string | null;
  lesson_title?: string | null;
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    online_students: 0,
    total_submissions: 0,
    passed_submissions: 0,
    failed_submissions: 0,
    total_lessons: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, subsRes] = await Promise.all([
        fetch('http://localhost:8000/api/teacher/stats'),
        fetch('http://localhost:8000/api/teacher/submissions?limit=6')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setRecentSubmissions(subsData);
      }
      setLastRefreshed(new Date());
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Live polling every 4 seconds
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('http://localhost:8000/api/teacher/simulate', {
        method: 'POST',
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error('Failed to trigger simulation:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const passRate = stats.total_submissions > 0
    ? Math.round((stats.passed_submissions / stats.total_submissions) * 100)
    : 100;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="pb-20">
      {/* Header with Quick Actions */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white">Teacher Dashboard</h1>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Live updates every 4s • Last updated: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Refresh data"
            className="p-2.5 rounded-xl border-2 border-[#00031333] dark:border-white/20 hover:bg-[#F8F8F8] dark:hover:bg-white/5 text-[#000313] dark:text-white transition"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl transition shadow-[0_3px_0_#157a87] active:translate-y-0.5 active:shadow-none disabled:opacity-50"
          >
            {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            Simulate 5 Submissions
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users size={24} className="text-[#0ba2b3]" />}
          label="Total Students"
          value={stats.online_students}
          sub={`${stats.online_students} active`}
          color="bg-blue-50 dark:bg-blue-950/30"
          borderColor="border-blue-200 dark:border-blue-900/50"
          delay={0}
        />
        <StatCard
          icon={<BookOpen size={24} className="text-[#0ba2b3]" />}
          label="Active Lessons"
          value={stats.total_lessons}
          sub="Live syllabus"
          color="bg-green-50 dark:bg-green-950/30"
          borderColor="border-green-200 dark:border-green-900/50"
          delay={0.05}
        />
        <StatCard
          icon={<CheckCircle size={24} className="text-[#0ba2b3]" />}
          label="Total Submissions"
          value={stats.total_submissions}
          sub={`${stats.passed_submissions} passed`}
          color="bg-yellow-50 dark:bg-yellow-900/20"
          borderColor="border-yellow-200 dark:border-yellow-700/30"
          delay={0.1}
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-[#0ba2b3]" />}
          label="Pass Rate"
          value={`${passRate}%`}
          sub={`${stats.failed_submissions} failed`}
          color="bg-purple-50 dark:bg-purple-950/30"
          borderColor="border-purple-200 dark:border-purple-900/50"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass / Fail Donut Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 p-6 flex flex-col items-center justify-center"
        >
          <h2 className="font-extrabold text-[#000313] dark:text-white mb-4 self-start">Pass / Fail Accuracy</h2>

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
                stroke="#0ba2b3"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - passRate / 100) }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-[#000313] dark:text-white">{passRate}%</span>
              <span className="text-xs font-bold text-[#000313] dark:text-white">Pass</span>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#0ba2b3]" />
              <span className="text-xs font-bold text-[#000313] dark:text-white">{stats.passed_submissions} Passed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FC4B0B]" />
              <span className="text-xs font-bold text-[#000313] dark:text-white">{stats.failed_submissions} Failed</span>
            </div>
          </div>
        </motion.div>

        {/* Live Submissions Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#00031333] dark:border-white/20">
            <h2 className="font-extrabold text-[#000313] dark:text-white">Live Submissions Stream</h2>
            <Link href="/teacher/submissions" className="text-sm font-bold text-[#0ba2b3] hover:underline">
              Audit Trail →
            </Link>
          </div>

          <div className="divide-y divide-[#00031333] dark:divide-white/10 flex-1 overflow-y-auto max-h-[300px]">
            {recentSubmissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-bold text-sm">
                No submissions recorded yet. Click &quot;Simulate 5 Submissions&quot; above to test!
              </div>
            ) : (
              recentSubmissions.map((sub, idx) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.03 }}
                  className="flex items-center justify-between px-6 py-3 hover:bg-[#F8F8F8] dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {sub.status === 'completed' && sub.passed ? (
                      <CheckCircle size={20} className="text-[#0ba2b3] shrink-0" fill="currentColor" />
                    ) : sub.status === 'running' ? (
                      <Loader2 size={20} className="text-[#FF9600] animate-spin shrink-0" />
                    ) : sub.status === 'queued' ? (
                      <Clock size={20} className="text-gray-400 shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-[#FC4B0B] shrink-0" fill="currentColor" />
                    )}

                    <div>
                      <p className="font-bold text-[#000313] dark:text-white text-sm">
                        {sub.user_name || 'Demo Student'}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 truncate max-w-[200px] sm:max-w-[280px]">
                        {sub.lesson_title || 'Python Challenge'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {sub.execution_time_ms !== null && (
                      <span className="text-xs font-mono font-bold text-gray-500">
                        {sub.execution_time_ms}ms
                      </span>
                    )}
                    <span className="text-xs font-semibold text-gray-400">
                      {formatTime(sub.created_at)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
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
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white">
          {label}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-[#000313] dark:text-white">{value}</p>
      <p className="text-xs font-bold text-[#000313] dark:text-white mt-0.5 flex items-center gap-1">
        <Flame size={12} className="text-[#FF9600]" />
        {sub}
      </p>
    </motion.div>
  );
}
