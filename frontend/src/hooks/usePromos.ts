"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Promo {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  isGlobal: boolean;
  eventId?: string | null;
  usageLimit?: number | null;
  startDate: string;
  endDate: string;
  description?: string;
}

export function useMyPromos() {
  return useQuery({
    queryKey: ["my-promos"],
    queryFn: async () => {
      const res = await api.get("/promo/me");
      return res.data.data as Promo[];
    },
  });
}

export function useCreatePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Promo>) => {
      await api.post("/promo", data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-promos"] });
    },
  });
}

export function useUpdatePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (update: { id: string; data: Partial<Promo> }) => {
      await api.put(`/promo/${update.id}`, update.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-promos"] });
    },
  });
}

export function useDeletePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/promo/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-promos"] });
    },
  });
}
