import { create } from 'zustand';

interface UserState {
  // Profile
  username: string;
  profilePicture: string;
  level: number;
  isDarkMode: boolean;

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
  refillHearts: () => void;
  spendGems: (amount: number) => boolean;
  addGems: (amount: number) => void;
  fetchProgress: (userId: string) => Promise<void>;

  // Actions — Progress
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  completeChallenge: (challengeId: string) => void;

  // Actions — Profile
  setUsername: (name: string) => void;
  setProfilePicture: (pic: string) => void;
  toggleDarkMode: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  username: 'Aung Kyaw',
  profilePicture: '🦊',
  level: 1,
  isDarkMode: false,
  xp: 0,
  hearts: 5,
  streak: 0,
  gems: 500,
  completedLessonIds: [],
  completedChallenges: [],

  addXp: (amount) =>
    set((state) => {
      const newXp = state.xp + amount;
      // Level up every 100 XP
      const newLevel = Math.floor(newXp / 100) + 1;
      return { xp: newXp, level: newLevel };
    }),
  reduceHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  refillHearts: () => set({ hearts: 5 }),

  spendGems: (amount) => {
    const current = get().gems;
    if (current < amount) return false;
    set({ gems: current - amount });
    return true;
  },
  addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

  fetchProgress: async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/${userId}/progress`);
      if (res.ok) {
        const data = await res.json();
        set({ xp: data.xp, hearts: data.hearts });
      }
    } catch (e) {
      console.error("Failed to fetch progress:", e);
    }
  },

  completeLesson: (lessonId) =>
    set((state) => {
      if (state.completedLessonIds.includes(lessonId)) return state;
      return {
        completedLessonIds: [...state.completedLessonIds, lessonId],
        streak: state.streak + 1,
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
}));
