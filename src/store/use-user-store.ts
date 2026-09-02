import { create } from 'zustand';
import { useAuthStore } from './use-auth-store';

interface UserState {
  // Profile
  username: string;
  profilePicture: string;
  level: number;
  isDarkMode: boolean;
  language: 'en' | 'my';

  // Gamification
  xp: number;
  hearts: number;
  streak: number;
  gems: number;

  // Progress tracking
  completedLessonIds: string[];
  completedChallenges: string[];

  // Actions — Gamification
  addXp: (amount: number) => void;
  reduceHeart: () => void;
  refillHearts: (userId?: string) => Promise<boolean>;
  spendGems: (amount: number) => boolean;
  addGems: (amount: number) => void;
  fetchProgress: (userId?: string) => Promise<void>;

  // Actions — Progress
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  completeChallenge: (challengeId: string) => void;

  // Actions — Profile
  setUsername: (name: string) => void;
  setProfilePicture: (pic: string) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'my') => void;
  toggleLanguage: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  username: 'Demo Student',
  profilePicture: '🦊',
  level: 1,
  isDarkMode: false,
  language: typeof window !== 'undefined' && localStorage.getItem('deepdive_lang') === 'my' ? 'my' : 'en',
  xp: 0,
  hearts: 5,
  streak: 0,
  gems: 500,
  completedLessonIds: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('deepdive_completed_lessons') || '[]') : [],
  completedChallenges: [],

  addXp: (amount) =>
    set((state) => {
      const newXp = state.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { xp: newXp, level: newLevel };
    }),

  reduceHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),

  refillHearts: async (userId?: string) => {
    const authUser = useAuthStore.getState().user;
    const targetUserId = userId || authUser?.id || '00000000-0000-0000-0000-000000000002';
    const token = useAuthStore.getState().token;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:8000/api/v1/users/${targetUserId}/shop/refill-hearts`, {
        method: 'POST',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        set({ hearts: data.hearts, gems: data.gems });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to refill hearts:', e);
      return false;
    }
  },

  spendGems: (amount) => {
    const current = get().gems;
    if (current < amount) return false;
    set({ gems: current - amount });
    return true;
  },

  addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

  fetchProgress: async (userId?: string) => {
    const authUser = useAuthStore.getState().user;
    const targetUserId = userId || authUser?.id || '00000000-0000-0000-0000-000000000002';
    const token = useAuthStore.getState().token;

    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:8000/api/v1/users/${targetUserId}/progress`, {
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        const serverCompleted = (data.completed_lessons as string[]) || [];
        const currentCompleted = get().completedLessonIds || [];
        const merged = Array.from(new Set([...currentCompleted, ...serverCompleted]));

        if (typeof window !== 'undefined') {
          localStorage.setItem('deepdive_completed_lessons', JSON.stringify(merged));
        }

        set({
          xp: data.xp,
          hearts: data.hearts,
          gems: data.gems,
          username: data.name || get().username,
          level: Math.floor(data.xp / 100) + 1,
          completedLessonIds: merged,
        });
      }
    } catch (e) {
      console.error('Failed to fetch progress:', e);
    }
  },

  completeLesson: (lessonId) =>
    set((state) => {
      const isAlreadyCompleted = state.completedLessonIds.includes(lessonId);
      const updated = isAlreadyCompleted
        ? state.completedLessonIds
        : [...state.completedLessonIds, lessonId];

      if (typeof window !== 'undefined') {
        localStorage.setItem('deepdive_completed_lessons', JSON.stringify(updated));
      }

      return {
        completedLessonIds: updated,
        streak: isAlreadyCompleted ? state.streak : Math.max(1, state.streak + 1),
      };
    }),

  isLessonCompleted: (lessonId) => get().completedLessonIds.includes(lessonId),
  
  completeChallenge: (challengeId) =>
    set((state) => {
      if (state.completedChallenges.includes(challengeId)) return state;
      return {
        completedChallenges: [...state.completedChallenges, challengeId],
      };
    }),

  setUsername: (name) => set({ username: name }),
  setProfilePicture: (pic) => set({ profilePicture: pic }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') localStorage.setItem('deepdive_lang', lang);
    set({ language: lang });
  },
  toggleLanguage: () => {
    const next = get().language === 'en' ? 'my' : 'en';
    if (typeof window !== 'undefined') localStorage.setItem('deepdive_lang', next);
    set({ language: next });
  },
}));
