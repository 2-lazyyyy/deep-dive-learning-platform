'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('demo@deepdive.com');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      if (isTeacher) {
        router.push('/teacher');
      } else {
        router.push('/');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      {/* Container */}
      <div className="relative bg-white border-2 border-[#1C1D2033] rounded-3xl w-full max-w-[900px] h-[600px] overflow-hidden flex flex-col md:flex-row shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        
        {/* Mobile Toggle (Visible only on small screens) */}
        <div className="md:hidden absolute top-4 right-4 z-50">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-extrabold text-[#0ba2b3] bg-[#F0F8FF] px-4 py-2 rounded-xl"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        {/* Form Area - Sign Up (Right side logically) */}
        <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${isLogin ? 'opacity-0 z-0 pointer-events-none' : 'opacity-100 z-10'}`}>
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap size={32} className="text-[#0ba2b3]" />
            <span className="text-2xl font-extrabold text-[#1C1D20]">DeepDive</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1C1D20] mb-2">Create Account</h2>
          <p className="font-bold text-[#6B7280] mb-8">Start your learning journey today.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] outline-none focus:border-[#0ba2b3] transition bg-[#F8F8F8] focus:bg-white"
              />
            </div>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}
                className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] outline-none focus:border-[#0ba2b3] transition bg-[#F8F8F8] focus:bg-white"
              />
            </div>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isLogin}
                className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] outline-none focus:border-[#0ba2b3] transition bg-[#F8F8F8] focus:bg-white"
              />
            </div>
            
            <button 
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold uppercase px-6 py-4 rounded-xl transition shadow-[0_4px_0_#1e91a3] active:shadow-none active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Form Area - Login (Left side logically) */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-0 z-0 pointer-events-none' : 'opacity-100 z-10'}`}>
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap size={32} className="text-[#0ba2b3]" />
            <span className="text-2xl font-extrabold text-[#1C1D20]">DeepDive</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1C1D20] mb-2">Welcome Back</h2>
          <p className="font-bold text-[#6B7280] mb-8">Sign in to continue your progress.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={isLogin}
                className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] outline-none focus:border-[#0ba2b3] transition bg-[#F8F8F8] focus:bg-white"
              />
            </div>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={isLogin}
                className="w-full border-2 border-[#1C1D2033] rounded-xl pl-12 pr-4 py-3 font-bold text-[#1C1D20] outline-none focus:border-[#0ba2b3] transition bg-[#F8F8F8] focus:bg-white"
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isTeacher ? 'bg-[#0ba2b3] border-[#0ba2b3]' : 'border-[#1C1D2033] group-hover:border-[#0ba2b3]'}`}>
                  {isTeacher && <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="font-bold text-[#1C1D20] text-sm select-none">I am a teacher</span>
                <input 
                  type="checkbox" 
                  checked={isTeacher}
                  onChange={(e) => setIsTeacher(e.target.checked)}
                  className="hidden"
                />
              </label>
              <a href="#" className="text-sm font-bold text-[#0ba2b3] hover:underline">Forgot password?</a>
            </div>

            <button 
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-2 bg-[#0ba2b3] hover:bg-[#1e91a3] text-white font-extrabold uppercase px-6 py-4 rounded-xl transition shadow-[0_4px_0_#1e91a3] active:shadow-none active:translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sliding Overlay Panel (Desktop Only) */}
        <div 
          className="hidden md:flex absolute top-0 left-1/2 w-1/2 h-full z-20 transition-transform duration-700 ease-in-out pointer-events-none"
          style={{ transform: isLogin ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {/* Overlay Background */}
          <div className="absolute inset-0 bg-[#0ba2b3] text-white flex items-center justify-center pointer-events-auto shadow-2xl">
            {/* Overlay Content - Sign Up Prompt */}
            <div 
              className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0 delay-300' : 'opacity-0 translate-x-20 pointer-events-none'}`}
            >
              <h2 className="text-4xl font-extrabold mb-4">Hello, Friend!</h2>
              <p className="font-bold text-lg mb-8 opacity-90">Enter your personal details and start your coding journey with us.</p>
              <button 
                onClick={() => setIsLogin(false)}
                className="bg-transparent border-2 border-white text-white font-extrabold uppercase px-12 py-3 rounded-xl transition hover:bg-white hover:text-[#0ba2b3]"
              >
                Sign Up
              </button>
            </div>

            {/* Overlay Content - Login Prompt */}
            <div 
              className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center transition-all duration-700 ${!isLogin ? 'opacity-100 translate-x-0 delay-300' : 'opacity-0 -translate-x-20 pointer-events-none'}`}
            >
              <h2 className="text-4xl font-extrabold mb-4">Welcome Back!</h2>
              <p className="font-bold text-lg mb-8 opacity-90">To keep connected with us please login with your personal info.</p>
              <button 
                onClick={() => setIsLogin(true)}
                className="bg-transparent border-2 border-white text-white font-extrabold uppercase px-12 py-3 rounded-xl transition hover:bg-white hover:text-[#0ba2b3]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
