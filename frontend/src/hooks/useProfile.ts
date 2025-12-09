"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface UpdateProfilePayload {
  name: string;
  email: string;
  avatarUrl?: string; // ⬅️ Add this
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile"); 
      return res.data.data; // Profile sudah include avatarUrl?
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfilePayload) => { // ⬅️ Update tipe
      const res = await api.put("/user/profile", data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] }); // Refresh auto
    },
  });
}

export function useUpdatePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { oldPass: string; newPass: string }) => {
      const res = await api.put("/user/password", data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
