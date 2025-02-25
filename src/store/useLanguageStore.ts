// File: /store/languageStore.ts
import { create } from "zustand";

interface LanguageState {
  isAddLanguageModalOpen: boolean;
  openAddLanguageModal: () => void;
  closeAddLanguageModal: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  isAddLanguageModalOpen: false,
  openAddLanguageModal: () => set({ isAddLanguageModalOpen: true }),
  closeAddLanguageModal: () => set({ isAddLanguageModalOpen: false }),
}));
