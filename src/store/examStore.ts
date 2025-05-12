import { create } from "zustand";

type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface ExamState {
  isModalOpen: boolean;
  isEditOpen: boolean;
  editId: string | null;
  searchTerm: string;
  selectedClass: string | null;
  dateRange: DateRange;
  status: string | null;
}

interface ExamActions {
  openModal: () => void;
  openEdit: () => void;
  closeModal: () => void;
  closeEdit: () => void;
  setEditId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSelectedClass: (classId: string | null) => void;
  setDateRange: (range: Partial<DateRange>) => void;
  setStatus: (status: string) => void;
  resetFilters: () => void;
}

export const useExamStore = create<ExamState & ExamActions>((set) => ({
  // Initial state
  isModalOpen: false,
  isEditOpen: false,
  editId: null,
  searchTerm: "",
  selectedClass: null,
  dateRange: { start: null, end: null },
  status: null,

  // Actions
  openModal: () => set({ isModalOpen: true }),
  openEdit: () => set({ isEditOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  closeEdit: () => set({ isEditOpen: false }),
  setEditId: (id) => set({ editId: id, isEditOpen: true }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedClass: (classId) => set({ selectedClass: classId }),
  setDateRange: (range) =>
    set((state) => ({
      dateRange: { ...state.dateRange, ...range },
    })),
  setStatus: (status) => set({ status }),
  resetFilters: () =>
    set({
      searchTerm: "",
      selectedClass: null,
      status: null,
      dateRange: { start: null, end: null },
    }),
}));
