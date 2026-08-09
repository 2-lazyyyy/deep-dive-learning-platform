'use client';

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
} from 'lucide-react';
import { useState } from 'react';

// Mock submission data
const allSubmissions = [
  { id: 1, student: 'Aung Kyaw', lesson: 'Output ထုတ်ခြင်း (print)', status: 'pass' as const, time: '2026-08-04 13:12', code: 'print("Hello Python!")', output: 'Hello Python!\n', xp: 10 },
  { id: 2, student: 'Thiri Wai', lesson: 'F-String သုံးခြင်း', status: 'fail' as const, time: '2026-08-04 13:08', code: 'language = "Java"\nprint(f"I code in {language}")', output: 'I code in Java\n', xp: 0 },
  { id: 3, student: 'Min Thant', lesson: '.format() သုံးခြင်း', status: 'pass' as const, time: '2026-08-04 12:55', code: 'print("I love {}".format("Python"))', output: 'I love Python\n', xp: 15 },
  { id: 4, student: 'Su Su Hlaing', lesson: 'Variable တည်ဆောက်ခြင်း', status: 'pass' as const, time: '2026-08-04 12:40', code: 'a = 10\nprint(a)', output: '10\n', xp: 15 },
  { id: 5, student: 'Zaw Lin', lesson: 'If Statement ရေးခြင်း', status: 'fail' as const, time: '2026-08-04 12:30', code: 'x = 25\nif x > 100:\n    print("Big number")', output: '', xp: 0 },
  { id: 6, student: 'Aye Chan', lesson: 'For Loop ရေးခြင်း', status: 'pass' as const, time: '2026-08-04 12:15', code: 'for i in range(1, 6):\n    print(i)', output: '1\n2\n3\n4\n5\n', xp: 25 },
  { id: 7, student: 'Htet Aung', lesson: 'Output ထုတ်ခြင်း (print)', status: 'pass' as const, time: '2026-08-04 11:50', code: 'print("Hello Python!")', output: 'Hello Python!\n', xp: 10 },
  { id: 8, student: 'May Thu', lesson: 'Type Casting ပြောင်းလဲခြင်း', status: 'fail' as const, time: '2026-08-04 11:30', code: 'x = "100"\nresult = int(x) + 3\nprint(result)', output: '103\n', xp: 0 },
  { id: 9, student: 'Kyaw Zin', lesson: 'While Loop ရေးခြင်း', status: 'pass' as const, time: '2026-08-04 11:10', code: 'count = 0\nwhile count < 3:\n    print("Hello")\n    count += 1', output: 'Hello\nHello\nHello\n', xp: 25 },
  { id: 10, student: 'Thin Thin', lesson: 'If-Else ရွေးချယ်ခြင်း', status: 'pass' as const, time: '2026-08-04 10:55', code: 'score = 75\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")', output: 'Pass\n', xp: 20 },
];

export default function SubmissionsPage() {
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [search, setSearch] = useState('');
  const [viewingId, setViewingId] = useState<number | null>(null);

  const filtered = allSubmissions.filter((sub) => {
    if (filter !== 'all' && sub.status !== filter) return false;
    if (search && !sub.student.toLowerCase().includes(search.toLowerCase()) && !sub.lesson.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const viewingSub = allSubmissions.find((s) => s.id === viewingId);

  const passCount = allSubmissions.filter((s) => s.status === 'pass').length;
  const failCount = allSubmissions.filter((s) => s.status === 'fail').length;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#000313] dark:text-white">Submissions</h1>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <FileText size={20} className="text-[#0ba2b3]" />
          <div>
            <p className="text-lg font-extrabold text-[#000313] dark:text-white">{allSubmissions.length}</p>
            <p className="text-xs font-bold text-[#000313] dark:text-white">Total</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <CheckCircle size={20} className="text-[#0ba2b3]" />
          <div>
            <p className="text-lg font-extrabold text-[#0ba2b3]">{passCount}</p>
            <p className="text-xs font-bold text-[#000313] dark:text-white">Passed</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
          <XCircle size={20} className="text-[#FC4B0B]" />
          <div>
            <p className="text-lg font-extrabold text-[#FC4B0B]">{failCount}</p>
            <p className="text-xs font-bold text-[#000313] dark:text-white">Failed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#000313] dark:text-white" />
          <input
            type="text"
            placeholder="Search student or lesson..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#00031333] dark:border-white/20 bg-white dark:bg-[#000313] text-sm font-semibold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#000313] dark:text-white" />
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
        <div className="grid grid-cols-12 px-6 py-3 bg-[#F8F8F8] dark:bg-[#060a1d] border-b-2 border-[#00031333] dark:border-white/20 text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white">
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Student</div>
          <div className="col-span-4">Lesson</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-1">XP</div>
          <div className="col-span-1 text-center">View</div>
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          filtered.map((sub, idx) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-[#F8F8F8] dark:border-white/10 hover:bg-[#FAFAFA] dark:hover:bg-white/5 transition-colors"
            >
              <div className="col-span-1">
                {sub.status === 'pass' ? (
                  <CheckCircle size={18} className="text-[#0ba2b3]" />
                ) : (
                  <XCircle size={18} className="text-[#FC4B0B]" />
                )}
              </div>
              <div className="col-span-3 font-bold text-[#000313] dark:text-white text-sm">{sub.student}</div>
              <div className="col-span-4 text-sm font-semibold text-[#000313] dark:text-white truncate">{sub.lesson}</div>
              <div className="col-span-2 text-xs font-semibold text-[#000313] dark:text-white flex items-center gap-1">
                <Clock size={12} />
                {sub.time.split(' ')[1]}
              </div>
              <div className="col-span-1">
                {sub.xp > 0 ? (
                  <span className="text-xs font-extrabold text-[#0ba2b3]">+{sub.xp}</span>
                ) : (
                  <span className="text-xs font-bold text-[#000313] dark:text-white">—</span>
                )}
              </div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => setViewingId(sub.id)}
                  className="text-[#0ba2b3] hover:text-[#1e91a3] transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-bold text-[#000313] dark:text-white">No submissions found</p>
          </div>
        )}
      </div>
      </div>

      {/* Code Viewer Modal */}
      {viewingSub && (
        <div className="fixed inset-0 bg-[#000313]/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-[#000313] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#00031333] dark:border-white/20">
              <div>
                <h3 className="font-extrabold text-[#000313] dark:text-white">{viewingSub.student}</h3>
                <p className="text-sm font-semibold text-[#000313] dark:text-white">{viewingSub.lesson}</p>
              </div>
              <div className="flex items-center gap-3">
                {viewingSub.status === 'pass' ? (
                  <span className="text-xs font-extrabold bg-[#F0F8FF] dark:bg-[#0a1128] text-[#0ba2b3] px-3 py-1 rounded-full border border-[#1e91a3]">
                    PASS
                  </span>
                ) : (
                  <span className="text-xs font-extrabold bg-red-50 text-[#FC4B0B] px-3 py-1 rounded-full border border-red-200">
                    FAIL
                  </span>
                )}
                <button
                  onClick={() => setViewingId(null)}
                  className="text-[#000313] dark:text-white hover:text-[#000313] dark:text-white transition-colors"
                >
                  <X size={22} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Submitted Code */}
            <div className="px-6 py-5 border-b-2 border-[#00031333] dark:border-white/20">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white mb-3">
                Submitted Code
              </h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {viewingSub.code}
              </pre>
            </div>

            {/* Output */}
            <div className="px-6 py-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#000313] dark:text-white mb-3">
                Output
              </h4>
              <pre className={`p-4 rounded-xl text-sm font-mono border ${viewingSub.status === 'pass'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-green-200'
                  : 'bg-[#FFEBEE] text-[#C62828] border-red-200'
                }`}>
                {viewingSub.output || '(no output)'}
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
