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
