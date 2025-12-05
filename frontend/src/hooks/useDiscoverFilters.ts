"use client";

import { useState } from "react";

export type SortOption = "latest" | "oldest" | "price_asc" | "price_desc";

export interface DiscoverFiltersState {
  search: string;
  category: string | null;
  location: string;
  sort: SortOption;
}

export function useDiscoverFilters(initial?: Partial<DiscoverFiltersState>) {
  const [filters, setFilters] = useState<DiscoverFiltersState>({
    search: initial?.search ?? "",
    category: initial?.category ?? null,
    location: initial?.location ?? "",
    sort: initial?.sort ?? "latest",
  });

  const setSearch = (value: string) =>
    setFilters((prev) => ({ ...prev, search: value }));

  const setCategory = (value: string | null) =>
    setFilters((prev) => ({ ...prev, category: value }));

  const setLocation = (value: string) =>
    setFilters((prev) => ({ ...prev, location: value }));

  const setSort = (value: SortOption) =>
    setFilters((prev) => ({ ...prev, sort: value }));

  const resetFilters = () =>
    setFilters({
      search: "",
      category: null,
      location: "",
      sort: "latest",
    });

  return {
    filters,
    setSearch,
    setCategory,
    setLocation,
    setSort,
    resetFilters,
  };
}
