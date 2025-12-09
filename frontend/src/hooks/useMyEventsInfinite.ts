"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MyEvent {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  price: number;
  isPaid: boolean;
  bannerUrl?: string | null;
}

interface MyEventsPage {
  events: MyEvent[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data: MyEventsPage;
}

export function useMyEventsInfinite() {
  return useInfiniteQuery<MyEventsPage, Error>({
    queryKey: ["my-events"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await api.get<ApiResponse>("/events/me", {
        params: { page: pageParam, limit: 10 },
      });

      return res.data.data; // <- MyEventsPage
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 10_000,
  });
}
