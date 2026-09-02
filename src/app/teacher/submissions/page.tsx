'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  X,
  RefreshCw,
  Loader2,
  Terminal,
  AlertCircle
} from 'lucide-react';

interface SubmissionDetail {
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

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teacher/submissions?limit=100');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
      setLastRefreshed(new Date());
    } catch (e) {
      console.error('Failed to fetch audit trail submissions:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 5000);
    return () => clearInterval(interval);
  }, [fetchSubmissions]);

  const filtered = submissions.filter((sub) => {
    const isPassed = sub.status === 'completed' && sub.passed === true;
    const isFailed = sub.status === 'error' || sub.passed === false;

    if (filter === 'pass' && !isPassed) return false;
    if (filter === 'fail' && !isFailed) return false;

    const studentName = (sub.user_name || 'Demo Student').toLowerCase();
    const lessonName = (sub.lesson_title || 'Python Challenge').toLowerCase();
    const searchLower = search.toLowerCase();

    if (search && !studentName.includes(searchLower) && !lessonName.includes(searchLower)) {
      return false;
    }
    return true;
  });

  const viewingSub = submissions.find((s) => s.id === viewingId);

  const passCount = submissions.filter((s) => s.status === 'completed' && s.passed === true).length;
  const failCount = submissions.filter((s) => s.status === 'error' || s.passed === false).length;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white">Submissions Audit Trail</h1>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Real-time execution log • Refreshed: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          title="Refresh submissions"
          className="self-start sm:self-auto p-2.5 rounded-xl border-2 border-[#00031333] dark:border-white/20 hover:bg-[#F8F8F8] dark:hover:bg-white/5 text-[#000313] dark:text-white transition flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <FileText size={20} className="text-[#0ba2b3]" />
          <div>
            <p className="text-lg font-extrabold text-[#000313] dark:text-white">{submissions.length}</p>
            <p className="text-xs font-bold text-gray-500">Total Submissions</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <CheckCircle size={20} className="text-[#0ba2b3]" />
          <div>
            <p className="text-lg font-extrabold text-[#0ba2b3]">{passCount}</p>
            <p className="text-xs font-bold text-gray-500">Passed</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <XCircle size={20} className="text-[#FC4B0B]" />
          <div>
            <p className="text-lg font-extrabold text-[#FC4B0B]">{failCount}</p>
            <p className="text-xs font-bold text-gray-500">Failed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student name or lesson title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#00031333] dark:border-white/20 bg-white dark:bg-[#000313] text-sm font-semibold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {(['all', 'pass', 'fail'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-colors ${filter === f
                  ? f === 'pass'
                    ? 'bg-[#0ba2b3] text-white'
                    : f === 'fail'
                      ? 'bg-[#FC4B0B] text-white'
                      : 'bg-[#0ba2b3] text-white'
                  : 'bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 text-[#000313] dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-white/5'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-[#000313] rounded-2xl border-2 border-[#00031333] dark:border-white/20 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3.5 bg-[#F8F8F8] dark:bg-[#060a1d] border-b-2 border-[#00031333] dark:border-white/20 text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white">
            <div className="col-span-1">Status</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-3">Lesson</div>
            <div className="col-span-2">Execution</div>
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-1 text-center">Inspect</div>
          </div>

          {/* Rows */}
          {filtered.length > 0 ? (
            filtered.map((sub, idx) => {
              const isPass = sub.status === 'completed' && sub.passed === true;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-[#F8F8F8] dark:border-white/10 hover:bg-[#FAFAFA] dark:hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-1">
                    {isPass ? (
                      <CheckCircle size={18} className="text-[#0ba2b3]" fill="currentColor" />
                    ) : sub.status === 'running' ? (
                      <Loader2 size={18} className="text-[#FF9600] animate-spin" />
                    ) : sub.status === 'queued' ? (
                      <Clock size={18} className="text-gray-400" />
                    ) : (
                      <XCircle size={18} className="text-[#FC4B0B]" fill="currentColor" />
                    )}
                  </div>
                  <div className="col-span-3 font-bold text-[#000313] dark:text-white text-sm">
                    {sub.user_name || 'Demo Student'}
                  </div>
                  <div className="col-span-3 text-sm font-semibold text-gray-600 dark:text-gray-300 truncate">
                    {sub.lesson_title || 'Python Challenge'}
                  </div>
                  <div className="col-span-2 text-xs font-mono font-bold text-gray-500 flex items-center gap-1">
                    <Terminal size={13} className="text-gray-400" />
                    {sub.execution_time_ms !== null ? `${sub.execution_time_ms} ms` : '—'}
                  </div>
                  <div className="col-span-2 text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(sub.created_at)}
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => setViewingId(sub.id)}
                      className="p-1.5 rounded-lg text-[#0ba2b3] hover:bg-[#0ba2b3]/10 transition-colors"
                      title="Inspect code & output"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center text-gray-500 font-bold text-sm">
              {isLoading ? 'Loading submissions...' : 'No submissions found matching your filters.'}
            </div>
          )}
        </div>
      </div>

      {/* Code & Sandbox Inspector Modal */}
      {viewingSub && (
        <div className="fixed inset-0 bg-[#000313]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-[#000313] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border-2 border-[#00031333] dark:border-white/20 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#00031333] dark:border-white/20">
              <div>
                <h3 className="font-extrabold text-lg text-[#000313] dark:text-white">
                  {viewingSub.user_name || 'Demo Student'}
                </h3>
                <p className="text-xs font-bold text-gray-500">{viewingSub.lesson_title || 'Python Exercise'}</p>
              </div>
              <div className="flex items-center gap-3">
                {viewingSub.status === 'completed' && viewingSub.passed ? (
                  <span className="text-xs font-extrabold bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] px-3 py-1 rounded-full border border-[#1e91a3]">
                    PASSED ({viewingSub.execution_time_ms || 0}ms)
                  </span>
                ) : (
                  <span className="text-xs font-extrabold bg-red-50 text-[#FC4B0B] px-3 py-1 rounded-full border border-red-200">
                    FAILED
                  </span>
                )}
                <button
                  onClick={() => setViewingId(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-[#000313] dark:hover:text-white transition-colors"
                >
                  <X size={22} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Submitted Code */}
            <div className="px-6 py-5 border-b-2 border-[#00031333] dark:border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  Student Submitted Code ({viewingSub.language})
                </h4>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-2xl text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {viewingSub.submitted_code}
              </pre>
            </div>

            {/* Execution Console Output */}
            <div className="px-6 py-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2">
                Sandbox Execution Output
              </h4>
              {viewingSub.error ? (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-mono text-sm whitespace-pre-wrap flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{viewingSub.error}</span>
                </div>
              ) : viewingSub.output ? (
                <pre className="p-4 rounded-2xl bg-gray-50 dark:bg-[#060a1d] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap">
                  {viewingSub.output}
                </pre>
              ) : (
                <p className="text-xs font-bold text-gray-400 italic">No output produced</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
