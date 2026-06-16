import { create } from 'zustand';

export const useGameStore = create((set) => ({
  reward: null,
  levelUp: null,
  showReward: (reward) => set({ reward, levelUp: reward?.leveledUp ? reward : null }),
  clearReward: () => set({ reward: null, levelUp: null }),
}));
