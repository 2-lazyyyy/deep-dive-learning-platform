import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Challenge } from '@/types';

interface ChallengeStore {
  challenges: Challenge[];
  
  // Actions
  addChallenge: (challenge: Omit<Challenge, 'id'>) => string;
  updateChallenge: (id: string, updatedChallenge: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  getChallengeById: (id: string) => Challenge | undefined;
}

const defaultChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Variables Master',
    date: '2026-08-01',
    difficulty: 'medium',
    xpReward: 150,
    goal: 1,
    constraints: ['Use let or const', 'Do not use var', 'Variable name must be camelCase'],
    contentBlocks: [
      {
        type: 'text',
        content: 'In modern JavaScript, we declare variables using **let** and **const** instead of `var`. \n\nYour task is to declare a variable that cannot be reassigned.'
      },
      {
        type: 'code',
        content: 'const myVariable = 10;'
      }
    ],
    initialCode: 'var myVariable = 10;',
    expectedOutput: '' // Will match successful execution
  },
  {
    id: 'c2',
    title: 'Array Ninja',
    date: '2026-08-02',
    difficulty: 'hard',
    xpReward: 300,
    goal: 1,
    constraints: ['Must use map()', 'Array must have 5 elements'],
    contentBlocks: [
      {
        type: 'text',
        content: 'The **map()** method creates a new array populated with the results of calling a provided function on every element in the calling array.'
      }
    ],
    initialCode: 'const arr = [1, 2, 3];\n// Your code here',
    expectedOutput: ''
  }
];

export const useChallengeStore = create<ChallengeStore>()(
  persist(
    (set, get) => ({
      challenges: defaultChallenges,

      addChallenge: (challengeData) => {
        const newId = `challenge-${Date.now()}`;
        set((state) => ({
          challenges: [...state.challenges, { ...challengeData, id: newId }]
        }));
        return newId;
      },

      updateChallenge: (id, updatedChallenge) => {
        set((state) => ({
          challenges: state.challenges.map((c) => 
            c.id === id ? { ...c, ...updatedChallenge } : c
          )
        }));
      },

      deleteChallenge: (id) => {
        set((state) => ({
          challenges: state.challenges.filter((c) => c.id !== id)
        }));
      },

      getChallengeById: (id) => {
        return get().challenges.find((c) => c.id === id);
      }
    }),
    {
      name: 'deepdive-challenge-storage',
    }
  )
);
