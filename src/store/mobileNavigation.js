import { create } from 'zustand';

const useMobileNavigationStore = create((set) => ({
  currentScreen: 'home',
  history: ['home'],
  
  navigateTo: (screen) => set((state) => ({
    currentScreen: screen,
    history: [...state.history, screen]
  })),
  
  goBack: () => set((state) => {
    const newHistory = [...state.history];
    newHistory.pop();
    return {
      currentScreen: newHistory[newHistory.length - 1] || 'home',
      history: newHistory.length > 0 ? newHistory : ['home']
    };
  }),
  
  resetToHome: () => set({ currentScreen: 'home', history: ['home'] })
}));

export default useMobileNavigationStore;
