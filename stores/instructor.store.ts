import { fetchInstructors } from "@/api/instructor.api";
import { Instructor } from "@/types/instructors.type";
import { create } from "zustand";

type InstructorState = {
  instructors: Instructor[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  hasNext: boolean;

  fetchInstructors: () => Promise<void>;
  refreshInstructors: () => Promise<void>;
};

export const useInstructorStore = create<InstructorState>((set, get) => ({
  instructors: [],
  loading: false,
  refreshing: false,
  error: null,
  page: 1,
  hasNext: true,

  fetchInstructors: async () => {
    const { page, instructors, hasNext, loading } = get();

    if (!hasNext || loading) return;

    set({ loading: true, error: null });

    try {
      const response = await fetchInstructors(page, 20);

      set({
        instructors: [...instructors, ...response.data.data],
        page: response.data.nextPage ? page + 1 : page,
        hasNext: response.data.nextPage,
        loading: false,
      });
    } catch (error: any) {
      console.error("Fetch instructors error:", error);
      set({
        loading: false,
        error: "Failed to load instructors",
      });
    }
  },

  refreshInstructors: async () => {
    set({
      page: 1,
      hasNext: true,
      instructors: [],
      error: null,
      refreshing: true,
    });

    try {
      const response = await fetchInstructors(1, 20);

      set({
        instructors: response.data.data,
        page: response.data.nextPage ? 2 : 1,
        hasNext: response.data.nextPage,
        error: null,
        refreshing: false,
      });
    } catch (error: any) {
      console.error("Refresh instructors error:", error);
      set({
        loading: false,
        refreshing: false,
        error: "Failed to refresh instructors",
      });
    }
  },
}));
