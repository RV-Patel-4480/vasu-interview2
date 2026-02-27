import { fetchCourses } from "@/api/courses.api";
import { StorageKeys, StorageService } from "@/services/storage.service";
import { Course } from "@/types/courses.type";
import { create } from "zustand";

type CourseState = {
  courses: Course[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  hasNext: boolean;
  bookmarks: Course[];

  init: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  toggleBookmark: (course: Course) => void;
};

export const useCoursesStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,
  refreshing: false,
  error: null,
  page: 1,
  hasNext: true,
  bookmarks: [],

  init: async () => {
    const saved = await StorageService.getJSON(StorageKeys.BOOKMARKS);
    if (saved) set({ bookmarks: saved });
  },

  fetchCourses: async () => {
    const { page, courses, hasNext, loading } = get();

    if (!hasNext || loading) return;

    set({ loading: true, error: null });

    try {
      const response = await fetchCourses(page, 20);

      set({
        courses: [...courses, ...response.data.data],
        page: response.data.nextPage ? page + 1 : page,
        hasNext: response.data.nextPage,
        loading: false,
      });
    } catch (error: any) {
      console.error("Fetch courses error:", error);
      set({
        loading: false,
        error: "Failed to load courses",
      });
    }
  },

  refreshCourses: async () => {
    set({
      page: 1,
      hasNext: true,
      courses: [],
      error: null,
      refreshing: true,
    });

    try {
      const response = await fetchCourses(1, 20);

      set({
        courses: response.data.data || [],
        page: response.data.nextPage ? 2 : 1,
        hasNext: response.data.nextPage,
        error: null,
        refreshing: false,
      });
    } catch (error) {
      console.error("Refresh error:", error);
      set({
        refreshing: false,
        error: "Failed to refresh courses",
      });
    }
  },

  toggleBookmark: (course: Course) => {
    const { bookmarks } = get();
    let updated: Course[];

    if (bookmarks.includes(course)) {
      updated = bookmarks.filter((b) => b.id !== course.id);
    } else {
      updated = [...bookmarks, course];
    }

    StorageService.setJSON(StorageKeys.BOOKMARKS, updated);

    set({ bookmarks: updated });
  },
}));
