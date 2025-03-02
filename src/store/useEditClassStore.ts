import { Class } from "@/server/db/schema/classes";
import { create } from "zustand";

interface EditClassConfig {
  class: Class | undefined;
}

interface EditClassState {
  isOpen: boolean;
  classConfig: EditClassConfig | null;
  openDialog: (config: EditClassConfig) => void;
  closeDialog: () => void;
}

export const useEditClassStore = create<EditClassState>((set) => ({
  isOpen: false,
  classConfig: null,
  openDialog: (config) =>
    set({
      isOpen: true,
      classConfig: {
        ...config,
      },
    }),
  closeDialog: () => set({ isOpen: false, classConfig: null }),
}));
