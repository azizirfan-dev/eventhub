// src/hooks/useAuth.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore, AuthUser } from "@/store/auth";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

interface RegisterResponse extends AuthResponse {
  promo?: any;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const res = await api.post<{ status: string; message: string; data: AuthResponse }>(
        "/auth/login",
        payload
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: RegisterInput) => {
      const res = await api.post<{ status: string; message: string; data: RegisterResponse }>(
        "/auth/register",
        payload
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      // Auto login setelah register
      setAuth({ token: data.token, user: data.user });
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
  };
}
