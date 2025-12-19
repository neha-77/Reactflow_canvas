import { create } from 'zustand';

interface AppStore {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: 'config' | 'runtime';

  // NEW
  isAppsOpen: boolean;

  setSelectedAppId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: 'config' | 'runtime') => void;

  // NEW
  setIsAppsOpen: (open: boolean | ((v: boolean) => boolean)) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: 'app-1',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',

  // NEW
  isAppsOpen: false,

  setSelectedAppId: (id) =>
    set({ selectedAppId: id, selectedNodeId: null }),

  setSelectedNodeId: (id) =>
    set({ selectedNodeId: id }),

  setMobilePanelOpen: (open) =>
    set({ isMobilePanelOpen: open }),

  setActiveInspectorTab: (tab) =>
    set({ activeInspectorTab: tab }),

  // NEW
  setIsAppsOpen: (open) =>
    set((state) => ({
      isAppsOpen:
        typeof open === 'function' ? open(state.isAppsOpen) : open,
    })),
}));
