import { create } from "zustand";

export type SnackbarColor = "neutral" | "success" | "danger" | "warning";

export interface SnackbarState {
  open: boolean;
  message: string;
  color: SnackbarColor;
  showSnackbar: (message: string, color?: SnackbarColor) => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  color: "neutral",
  showSnackbar: (message: string, color: SnackbarColor = "neutral") =>
    set({ open: true, message, color }),
  hideSnackbar: () => set({ open: false, message: "", color: "neutral" }),
}));

export const useSnackbar = () => {
  const { showSnackbar, hideSnackbar } = useSnackbarStore();
  return { showSnackbar, hideSnackbar };
};
