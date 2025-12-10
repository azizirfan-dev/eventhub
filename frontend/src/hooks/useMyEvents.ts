"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MyEvent {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  bannerUrl?: string | null;
  isPaid: boolean;
  price: number;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

async function fetchMyEvents(): Promise<MyEvent[]> {
  const res = await api.get<ApiResponse<MyEvent[]>>("/events/me");
  return res.data.data;
}

export function useMyEvents() {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: fetchMyEvents,
    select: (data) => data ?? [],
    staleTime: 1000 * 60 * 3,
  });
}
