import { create } from 'zustand';

interface AppState {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  toggleShowMenu: () => void;
  initializeShowMenu: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  showMenu: true, // default value

  setShowMenu: (show) => {
    localStorage.setItem('showMenu', show.toString());
    set({ showMenu: show });
  },

  toggleShowMenu: () => {
    const current = get().showMenu;
    localStorage.setItem('showMenu', (!current).toString());
    set({ showMenu: !current });
  },

  initializeShowMenu: () => {
    const stored = localStorage.getItem('showMenu');
    set({ showMenu: stored === null ? true : stored === 'true' });
  },
}));
