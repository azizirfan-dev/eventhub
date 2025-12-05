// src/hooks/useDiscoverEvents.ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DiscoverFiltersState } from "./useDiscoverFilters";

export interface DiscoverEvent {
  id: string;
  title: string;
  location: string;
  category: string;
  price: number;
  isPaid: boolean;
  startDate: string;
  endDate: string;
  bannerUrl?: string | null;
  organizerProfile?: {
    rating?: number | null;
  } | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
}

export interface DiscoverEventsPage {
  events: DiscoverEvent[];
  pagination: PaginationInfo;
}

interface DiscoverEventsApiResponse {
  status: string;
  message: string;
  data: DiscoverEventsPage;
}

const DEFAULT_LIMIT = 9;

async function fetchDiscoverEvents(
  filters: DiscoverFiltersState,
  pageParam: number
): Promise<DiscoverEventsPage> {
  const params: Record<string, any> = {
    page: pageParam,
    limit: DEFAULT_LIMIT,
    sort: filters.sort,
  };

  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.location) params.location = filters.location;

  const response = await api.get<DiscoverEventsApiResponse>("/events", {
    params,
  });

  return response.data.data;
}

export function useDiscoverEvents(filters: DiscoverFiltersState) {
  return useInfiniteQuery({
    queryKey: ["discover-events", filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchDiscoverEvents(filters, Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      if (page < totalPages) return page + 1;
      return undefined;
    },
  });
}
