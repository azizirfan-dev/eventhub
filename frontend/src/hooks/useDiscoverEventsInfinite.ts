"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type DiscoverSort =
  | "latest"
  | "oldest"
  | "price_asc"
  | "price_desc";

export interface DiscoverFiltersInput {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  sort?: DiscoverSort;
  limit?: number;
}

export interface DiscoverEvent {
  id: string;
  title: string;
  location: string | null;
  startDate: string;
  endDate: string;
  price: number;
  isPaid: boolean;
  bannerUrl?: string | null;
  organizerProfile?: { rating: number | null };
}

export interface DiscoverEventsApiResponse {
  status: string;
  message: string;
  data: {
    events: DiscoverEvent[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

async function fetchDiscoverEventsPage({
  pageParam,
  filters,
}: {
  pageParam: number;
  filters: DiscoverFiltersInput;
}) {
  const res = await api.get<DiscoverEventsApiResponse>("/events", {
    params: {
      page: pageParam,
      limit: filters.limit ?? 12,
      search: filters.search,
      category: filters.category,
      location: filters.location,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      startDate: filters.startDate,
      endDate: filters.endDate,
      sort: filters.sort ?? "latest",
    },
  });

  return res.data.data;
}

export function useDiscoverEventsInfinite(filters: DiscoverFiltersInput) {
  return useInfiniteQuery({
    queryKey: ["discover-events", JSON.stringify(filters)], // 🔥 Stabil

    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchDiscoverEventsPage({ pageParam, filters }),

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    // 🚀 Performance & anti duplicate magic
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    retry: false,
  });
}
