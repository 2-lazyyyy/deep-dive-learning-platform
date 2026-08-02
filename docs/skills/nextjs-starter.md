---
name: nextjs-starter
description: Next.js 14 (App Router) Starter skill optimized for building interactive, gamified learning platforms (Duolingo style) with in-browser Python execution (Pyodide).
---

# Next.js Learning Platform Starter Skill

This skill provides the architectural foundation for building a Duolingo-style interactive learning platform using Next.js 14, Tailwind CSS, Framer Motion (for animations), Zustand (for state management like XP and Hearts), and `react-py` (for in-browser Python execution).

---

## 1. Stack Overview & Dependencies

### Core Stack
- **Framework**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + `shadcn/ui`
- **Animations**: Framer Motion (Crucial for gamified UX)
- **State Management**: Zustand (To track XP, Streaks, Hearts, current lesson)
- **Code Execution**: `react-py` (Pyodide wrapper to run Python in browser without a server)
- **Icons**: Lucide React

### Installation Commands

```bash
# 1. Initialize Next.js project
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Install core gamification & learning dependencies
npm install framer-motion zustand react-py lucide-react clsx tailwind-merge
```

---

## 2. Directory Structure (App Router)

```
src/
├── app/
│   ├── (main)/              # Layout with Sidebar Navigation (Home, Leaderboard, Shop)
│   │   ├── layout.tsx       # Sidebar & Topbar for mobile
│   │   ├── learn/           # Main course path (Tree view)
│   │   │   └── page.tsx
│   │   ├── leaderboard/     # Rankings page
│   │   │   └── page.tsx
│   │   └── shop/            # Buy streak freezes, etc.
│   │       └── page.tsx
│   ├── lesson/              # Distraction-free lesson UI
│   │   ├── [lessonId]/
│   │   │   └── page.tsx     # The actual interactive coding exercise
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable shadcn-like components (Buttons, Modals)
│   ├── sidebar.tsx          # Left navigation menu
│   ├── mobile-header.tsx    # Top bar for mobile containing Hearts and Streak stats
│   ├── unit-banner.tsx      # Banner showing current chapter/topic
│   └── code-sandbox.tsx     # Interactive Python code editor using react-py
├── store/
│   └── use-user-store.ts    # Zustand store for Hearts, XP, and Streaks
├── lib/
│   └── utils.ts             # tailwind-merge utility
└── types/
    └── index.ts
```

---

## 3. Core Components Setup

### `src/store/use-user-store.ts` (State Management)
Tracks the user's gamification progress locally (or syncs with backend later).
```typescript
import { create } from 'zustand';

interface UserState {
  xp: number;
  hearts: number;
  streak: number;
  addXp: (amount: number) => void;
  reduceHeart: () => void;
  refillHearts: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  xp: 0,
  hearts: 5,
  streak: 0,
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  reduceHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  refillHearts: () => set({ hearts: 5 }),
}));
```

### `src/components/code-sandbox.tsx` (Python Execution)
This component lets users type Python code and see results in real-time, matching boot.dev style.
```typescript
'use client';

import React, { useState } from 'react';
import { usePython } from 'react-py';
import { Play } from 'lucide-react';

export const CodeSandbox = ({ initialCode }: { initialCode: string }) => {
  const [code, setCode] = useState(initialCode);
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const handleRun = () => {
    runPython(code);
  };

  return (
    <div className="flex flex-col gap-4 w-full border-2 border-gray-200 rounded-xl p-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg outline-none resize-none"
      />
      
      <button 
        onClick={handleRun}
        disabled={isLoading || isRunning}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
      >
        <Play size={20} />
        {isLoading ? 'Loading Python...' : isRunning ? 'Running...' : 'Run Code'}
      </button>

      {(stdout || stderr) && (
        <div className="p-4 bg-gray-100 rounded-lg mt-4 font-mono text-sm">
          <p className="text-gray-500 mb-2">Output:</p>
          <pre className="text-gray-800">{stdout}</pre>
          <pre className="text-red-500">{stderr}</pre>
        </div>
      )}
    </div>
  );
};
```

### `src/app/lesson/[lessonId]/page.tsx` (Lesson Layout)
A distraction-free UI focused entirely on the exercise.
```typescript
'use client';

import { CodeSandbox } from '@/components/code-sandbox';
import { useUserStore } from '@/store/use-user-store';
import { Heart } from 'lucide-react';

export default function LessonPage() {
  const { hearts } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto p-4">
      {/* Header */}
      <header className="flex items-center justify-between py-4 mb-8">
        <button className="text-gray-400 hover:text-gray-600 font-bold text-xl">X</button>
        <div className="w-full mx-4 bg-gray-200 rounded-full h-4">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: '50%' }}></div>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
          <Heart fill="currentColor" /> {hearts}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-extrabold text-gray-800">
          Write a function to print "Hello Python!"
        </h1>
        <p className="text-lg text-gray-600">
          Use the <code>print()</code> function to output the exact phrase.
        </p>

        {/* Python Sandbox */}
        <CodeSandbox initialCode='print("Your code here")' />
      </div>
    </div>
  );
}
```

---

## 4. UI/UX Rules (Duolingo Style Integration)

When implementing components, follow these core principles from `duolingo-ux-reference`:
1. **Chunky Borders**: Buttons should have a heavy bottom border (e.g., `border-b-4`) to simulate 3D depth, which disappears when active (clicked).
2. **Vibrant Colors**: Use strong, playful colors (Green-500, Blue-500, Yellow-400) on soft backgrounds.
3. **Rounded Geometry**: Use `rounded-xl` or `rounded-2xl` extensively. Sharp corners should be avoided.
4. **Micro-animations**: Use Framer Motion for success/fail modals springing up from the bottom of the screen.

## 5. Integrating with `deep-dive-python`
- Generate lessons dynamically by reading the `deep-dive-python/chapters/` markdown files.
- The backend API (Django, if decoupled, or Next.js API routes) will supply the theoretical content, while this frontend renders it into interactive bite-sized steps (1 concept -> 1 coding challenge).
