import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,

      // Login -> save token & user state
      login: ({ user, token }) =>
        set({ user, token }),

      // Logout -> clear state + storage
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
