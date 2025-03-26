import { create } from 'zustand';

export const useTheme = create((set) => ({
  theme: localStorage.getItem('chatty-theme') || 'coffee',
  setTheme: (theme) => {
    localStorage.setItem('chatty-theme', theme);
    set({ theme });
  },
}));
