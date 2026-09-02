'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  X,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Globe2,
  ChevronDown,
  BookOpen,
  Code2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';

type AuthView = 'splash' | 'login' | 'signup';

export default function DuolingoAuthPage() {
  const [view, setView] = useState<AuthView>('splash');
  const [language, setLanguage] = useState<'my' | 'en'>('en');
  const { signIn, signUp, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openLogin = () => {
    clearError();
    setSuccessMessage(null);
    setView('login');
  };

  const openSignup = () => {
    clearError();
    setSuccessMessage(null);
    setView('signup');
  };

  const closeToSplash = () => {
    clearError();
    setSuccessMessage(null);
    setView('splash');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage(null);

    if (view === 'login') {
      const result = await signIn(email, password);
      if (result.success) {
        if (result.role === 'teacher') {
          router.push('/teacher');
        } else {
          router.push('/');
        }
      }
    } else if (view === 'signup') {
      const result = await signUp(email, password, name, role);
      if (result.success) {
        setSuccessMessage(
          language === 'my'
            ? 'အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ Login ဝင်ရောက်နိုင်ပါပြီခင်ဗျာ။'
            : 'Account created successfully! You can now log in.'
        );
        setView('login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000313] text-[#000313] dark:text-white flex flex-col justify-between selection:bg-[#84D8FF]">
      {/* 1. DUOLINGO TOP NAVIGATION HEADER */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={closeToSplash}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#0ba2b3] flex items-center justify-center text-white shadow-[0_3px_0_#157a87] group-hover:scale-105 transition-transform">
            <GraduationCap size={26} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-wide text-[#0ba2b3]">
            DeepDive
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle Dropdown */}
          <button
            onClick={() => setLanguage((prev) => (prev === 'en' ? 'my' : 'en'))}
            className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-xl transition"
          >
            <Globe2 size={18} className="text-gray-400" />
            <span>{language === 'en' ? 'ENGLISH' : 'MYANMAR'}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {/* SPLASH VIEW (HERO) */}
        {view === 'splash' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 py-6"
          >
            {/* Mascot / Hero Illustration */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative select-none"
              >
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#0ba2b3]/20 via-[#84D8FF]/30 to-emerald-200/40 dark:from-[#0ba2b3]/10 dark:to-blue-900/20 flex items-center justify-center border-4 border-dashed border-[#0ba2b3]/40">
                  <span className="text-8xl sm:text-9xl filter drop-shadow-xl animate-pulse">
                    🦉
                  </span>
                </div>
                {/* Floating Skill Badges */}
                <div className="absolute -top-2 -right-2 bg-white dark:bg-[#060a1d] border-2 border-[#84D8FF] px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-extrabold text-[#0ba2b3]">
                  <span>🐍</span> Python 3.12
                </div>
                <div className="absolute -bottom-2 -left-2 bg-white dark:bg-[#060a1d] border-2 border-orange-300 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-extrabold text-orange-500">
                  <span>🔥</span> Gamified
                </div>
              </motion.div>
            </div>

            {/* Hero CTA Block */}
            <div className="flex-1 max-w-md text-center lg:text-left flex flex-col gap-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#000313] dark:text-white leading-[1.15] tracking-tight">
                {language === 'my' ? (
                  <>
                    Python နှင့် Coding ပညာရပ်ကို{' '}
                    <span className="text-[#0ba2b3]">အခမဲ့ ပျော်ရွှင်စွာ</span> လေ့လာလိုက်ပါ!
                  </>
                ) : (
                  <>
                    The free, fun, and effective way to learn{' '}
                    <span className="text-[#0ba2b3]">Python & coding!</span>
                  </>
                )}
              </h1>

              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                {language === 'my'
                  ? 'အပြန်အလှန် Code ရေးသားလေ့ကျင့်ခြင်း၊ AI Tutor နှင့် Gamified Quests များဖြင့် စတင်လိုက်ပါ။'
                  : 'Interactive real-time execution, AI-powered pedagogical tutoring, and game-infused learning paths.'}
              </p>

              {/* Action Buttons (Duolingo 3D Button Style) */}
              <div className="flex flex-col gap-3.5 pt-2">
                <button
                  onClick={openSignup}
                  className="w-full py-4 rounded-2xl bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_0_#157a87] active:shadow-none active:translate-y-1 transition-all"
                >
                  {language === 'my' ? 'စတင်လေ့လာမည် (Get Started)' : 'GET STARTED'}
                </button>

                <button
                  onClick={openLogin}
                  className="w-full py-4 rounded-2xl bg-white dark:bg-[#000313] border-2 border-[#E5E5E5] dark:border-white/20 hover:bg-[#F8F8F8] dark:hover:bg-white/5 text-[#0ba2b3] font-black text-sm uppercase tracking-wider shadow-[0_4px_0_#E5E5E5] dark:shadow-[0_4px_0_rgba(255,255,255,0.1)] active:shadow-none active:translate-y-1 transition-all"
                >
                  {language === 'my' ? 'အကောင့်ရှိပြီးသားဖြစ်သည်' : 'I ALREADY HAVE AN ACCOUNT'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODAL AUTH VIEWS (LOGIN / SIGNUP) */}
        {(view === 'login' || view === 'signup') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white dark:bg-[#000313] border-2 border-[#00031333] dark:border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            {/* Top Close Button */}
            <button
              onClick={closeToSplash}
              className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
              title="Close"
            >
              <X size={20} />
            </button>


            <div className="pt-8 text-center mb-6">
              <h2 className="text-2xl font-black text-[#000313] dark:text-white">
                {view === 'login'
                  ? language === 'my'
                    ? 'အကောင့်ဝင်ပါ'
                    : 'Log in'
                  : language === 'my'
                  ? 'အကောင့်အသစ် ဖွင့်ပါ'
                  : 'Create your profile'}
              </h2>
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-900/50 flex items-center gap-2 text-xs font-black text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection Tabs (Only on Signup) */}
            {view === 'signup' && (
              <div className="flex p-1 bg-[#F8F8F8] dark:bg-[#060a1d] rounded-2xl border-2 border-[#E5E5E5] dark:border-white/20 mb-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                    role === 'student'
                      ? 'bg-white dark:bg-[#000313] text-[#0ba2b3] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <span>👨‍🎓</span>
                  <span>{language === 'my' ? 'ကျောင်းသား (Student)' : 'Student'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                    role === 'teacher'
                      ? 'bg-white dark:bg-[#000313] text-[#0ba2b3] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <span>👩‍🏫</span>
                  <span>{language === 'my' ? 'ဆရာ/ဆရာမ (Educator)' : 'Educator'}</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {view === 'signup' && (
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'my' ? 'နာမည် အပြည့်အစုံ' : 'Name (Optional)'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#F8F8F8] dark:bg-[#060a1d] border-2 border-[#E5E5E5] dark:border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                  />
                </div>
              )}

              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder={language === 'my' ? 'အီးမေးလ် လိပ်စာ' : 'Email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#F8F8F8] dark:bg-[#060a1d] border-2 border-[#E5E5E5] dark:border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder={language === 'my' ? 'စကားဝှက် (Password)' : 'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#F8F8F8] dark:bg-[#060a1d] border-2 border-[#E5E5E5] dark:border-white/20 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#000313] dark:text-white outline-none focus:border-[#0ba2b3] transition"
                />
              </div>

              {/* Submit Button (Duolingo 3D Button) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-black text-sm uppercase tracking-wider shadow-[0_4px_0_#157a87] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{language === 'my' ? 'လုပ်ဆောင်နေသည်...' : 'Processing...'}</span>
                  </>
                ) : view === 'login' ? (
                  language === 'my' ? 'အကောင့်ဝင်မည်' : 'LOG IN'
                ) : (
                  language === 'my' ? 'အကောင့်အသစ်ဖွင့်မည်' : 'CREATE ACCOUNT'
                )}
              </button>
            </form>

            {/* Terms & Conditions Notice */}
            {view === 'signup' && (
              <p className="text-[11px] font-bold text-center text-gray-400 dark:text-gray-500 mt-4 leading-relaxed">
                By registering with DeepDive, you agree to our{' '}
                <span className="font-extrabold text-gray-600 dark:text-gray-300">Terms</span> and{' '}
                <span className="font-extrabold text-gray-600 dark:text-gray-300">Privacy Policy</span>.
              </p>
            )}

            {/* Bottom Switcher */}
            <div className="mt-6 pt-4 border-t-2 border-[#00031333] dark:border-white/20 text-center">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {view === 'login' ? (
                  <>
                    {language === 'my' ? 'အကောင့် မရှိသေးပါက' : "Don't have an account?"}{' '}
                    <button
                      onClick={openSignup}
                      className="font-black text-[#0ba2b3] hover:underline uppercase"
                    >
                      {language === 'my' ? 'အကောင့်သစ်ဖွင့်ရန်' : 'SIGN UP'}
                    </button>
                  </>
                ) : (
                  <>
                    {language === 'my' ? 'အကောင့် ရှိပြီးသားဖြစ်ပါက' : 'Have an account?'}{' '}
                    <button
                      onClick={openLogin}
                      className="font-black text-[#0ba2b3] hover:underline uppercase"
                    >
                      {language === 'my' ? 'အကောင့်ဝင်ရန်' : 'LOG IN'}
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* 3. DUOLINGO FOOTER */}
      <footer className="w-full border-t-2 border-[#00031333] dark:border-white/20 py-4 text-center text-xs font-bold text-gray-400 dark:text-gray-600">
        <p>© 2026 DeepDive Learn Inc. Gamified Computer Science Education Platform.</p>
      </footer>
    </div>
  );
}
