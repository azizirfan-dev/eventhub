// src/store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "USER" | "ORGANIZER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  referralCode?: string | null; // 🆕
  points?: number; // 🆕
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setAuth: (payload: { token: string; user: AuthUser }) => void;
  updateUser: (updates: Partial<AuthUser>) => void; // 🆕
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ token, user }) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      updateUser: (updates) => {
        const current = get().user;
        if (!current) return;
        set({
          user: { ...current, ...updates },
        });
      },

      clearAuth: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "eventhub-auth",
    }
  )
);
