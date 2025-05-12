import { create } from "zustand";

type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface TaskState {
  isModalOpen: boolean;
  editId: string | null;
  searchTerm: string;
  selectedClass: string | null;
  dateRange: DateRange;
}

interface TaskActions {
  openModal: () => void;
  closeModal: () => void;
  setEditId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedClass: (classId: string | null) => void;
  setDateRange: (range: Partial<DateRange>) => void;
  resetFilters: () => void;
}

export const useTaskStore = create<TaskState & TaskActions>((set) => ({
  // Initial state
  isModalOpen: false,
  editId: null,
  searchTerm: "",
  selectedClass: null,
  dateRange: { start: null, end: null },

  // Actions
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, editId: null }),
  setEditId: (id) => set({ editId: id, isModalOpen: true }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedClass: (classId) => set({ selectedClass: classId }),
  setDateRange: (range) =>
    set((state) => ({
      dateRange: { ...state.dateRange, ...range },
    })),
  resetFilters: () =>
    set({
      searchTerm: "",
      selectedClass: null,
      dateRange: { start: null, end: null },
    }),
}));
