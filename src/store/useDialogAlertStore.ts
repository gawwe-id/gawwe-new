import { create } from "zustand";

interface DialogAlertConfig {
  title: string;
  description: string;
  textCancel: string;
  textAction: string;
  onAction: () => void;
  isLoading: boolean;
}

interface DialogAlertState {
  isOpen: boolean;
  dialogConfig: DialogAlertConfig | null;
  openDialog: (config: Omit<DialogAlertConfig, "isLoading">) => void;
  closeDialog: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useDialogAlertStore = create<DialogAlertState>((set) => ({
  isOpen: false,
  dialogConfig: null,
  openDialog: (config) =>
    set({
      isOpen: true,
      dialogConfig: {
        ...config,
        isLoading: false,
      },
    }),
  closeDialog: () =>
    set({
      isOpen: false,
      dialogConfig: null,
    }),
  setLoading: (isLoading) =>
    set((state) => ({
      dialogConfig: state.dialogConfig
        ? { ...state.dialogConfig, isLoading }
        : null,
    })),
}));
