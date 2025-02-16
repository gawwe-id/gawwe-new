import { create } from 'zustand';

interface TabAccountParticipantState {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export const useTabAccountParticipantStore = create<TabAccountParticipantState>(
  (set) => ({
    activeTab: 0,
    setActiveTab: (tab) => set({ activeTab: tab })
  })
);
