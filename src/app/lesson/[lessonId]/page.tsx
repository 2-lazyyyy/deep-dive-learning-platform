'use client';

import { CodeSandbox } from '@/components/code-sandbox';
import { useUserStore } from '@/store/use-user-store';
import { Heart, X } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const { hearts } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between py-4 px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <Link href="/">
          <button className="text-gray-400 hover:text-gray-600 font-bold transition">
            <X size={32} strokeWidth={3} />
          </button>
        </Link>
        <div className="w-full mx-6 bg-gray-200 rounded-full h-4 relative overflow-hidden">
          <div className="bg-green-500 h-full rounded-full transition-all duration-500 relative" style={{ width: '20%' }}>
            {/* 3D Glossy Shine Effect */}
            <div className="bg-white h-1.5 absolute left-2 right-2 top-0.5 rounded-full opacity-30"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-extrabold text-xl">
          <Heart fill="currentColor" size={28} /> {hearts}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-8 mt-4">
        {/* Theory Left Side */}
        <div className="flex-1 flex flex-col gap-y-4">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Write a function to print "Hello Python!"
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to the very first step in Python. The <code>print()</code> function allows you to output text to the screen. 
            <br/><br/>
            Try writing the code to print the exact phrase: <strong>Hello Python!</strong>
          </p>
        </div>

        {/* Interactive Right Side */}
        <div className="flex-1">
          <CodeSandbox initialCode='print("Your code here")' />
        </div>
      </div>
    </div>
  );
}
