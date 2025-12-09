"use client";

import { useState } from "react";

export type SortOption =
  | "latest"
  | "oldest"
  | "price_asc"
  | "price_desc";

export interface DiscoverFiltersState {
  search: string;
  category?: string;  // ⬅️ undefined only
  location?: string;  // ⬅️ undefined only
  sort: SortOption;
}

const defaultState: DiscoverFiltersState = {
  search: "",
  category: undefined,
  location: undefined,
  sort: "latest",
};

export function useDiscoverFilters(
  initial: Partial<DiscoverFiltersState> = {}
) {
  const [filters, setFilters] = useState<DiscoverFiltersState>({
    ...defaultState,
    ...initial,
  });

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search }));

  const setCategory = (category?: string) =>
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
    }));

  const setLocation = (location?: string) =>
    setFilters((prev) => ({
      ...prev,
      location: location || undefined,
    }));

  const setSort = (sort: SortOption) =>
    setFilters((prev) => ({ ...prev, sort }));

  const setAll = (updates: Partial<DiscoverFiltersState>) =>
    setFilters((prev) => ({
      ...prev,
      ...updates,
      category: updates.category || undefined,
      location: updates.location || undefined,
    }));

  return {
    filters,
    setFilters: setAll,
    setSearch,
    setCategory,
    setLocation,
    setSort,
  };
}
