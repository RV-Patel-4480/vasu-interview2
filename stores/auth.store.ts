import { currentUserApi, logoutApi } from "@/api/auth.api";
import { StorageService } from "@/services/storage.service";
import { User } from "@/types/auth.type";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  setAuth: (token: string, data?: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,
  setAuth: async (token: string, data?: User) => {
    const { user } = get();
    await StorageService.setToken(token);
    set({
      user: data ? data : user,
      token: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  logout: async () => {
    try {
      await StorageService.clearAll();
      await logoutApi();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {}
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await StorageService.getToken();

      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const response = await currentUserApi();
      if (response.success && response.data) {
        console.log(response.data);

        set({
          user: response.data,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        await StorageService.removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      await StorageService.removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
