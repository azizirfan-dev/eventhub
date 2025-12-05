// src/store/auth-modal.ts
import { create } from "zustand";

type AuthMode = "login" | "register";

interface AuthModalState {
  isOpen: boolean;
  mode: AuthMode;
  open: (mode: AuthMode) => void;
  close: () => void;
  switchMode: (mode: AuthMode) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: "login",
  open: (mode) => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
  switchMode: (mode) => set({ mode }),
}));
