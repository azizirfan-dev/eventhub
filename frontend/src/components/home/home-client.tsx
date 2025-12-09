"use client";

import { useState, useDeferredValue, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  useDiscoverFilters,
  type SortOption,
} from "@/hooks/useDiscoverFilters";

import { HeroSection } from "@/components/home/hero-section";
import { CategoryFilter } from "@/components/home/category-filter";
import { SearchBar } from "@/components/home/search-bar";
import { SortDropdown } from "@/components/home/sort-dropdown";
import { EventGridInfinite } from "@/components/home/event-grid-infinite";
import { DiscoverFiltersInput } from "@/hooks/useDiscoverEventsInfinite";

export default function HomeClient({
  initialEvents = [],
  initialFilters = {},
}: {
  initialEvents?: any[];
  initialFilters?: Record<string, string | undefined>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Filters state
  const filtersHook = useDiscoverFilters({
    search: initialFilters.search ?? "",
    category: initialFilters.category,
    location: initialFilters.location,
    sort: (initialFilters.sort as SortOption) ?? "latest",
  });

  const { filters, setFilters, setSearch, setSort } = filtersHook;

  // Local state for input
  const [searchInput, setSearchInput] = useState(filters.search);
  const deferredSearch = useDeferredValue(searchInput);

  // Apply debounce → update filters.search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(deferredSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [deferredSearch]); // 👈 NO function deps

  // Apply debounce → sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.location) params.set("location", filters.location);
      if (filters.sort !== "latest") params.set("sort", filters.sort);

      const nextUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      if (nextUrl !== window.location.pathname + window.location.search) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.search, filters.category, filters.location, filters.sort, pathname]); // 👈 stable deps only

  const filtersForQuery: DiscoverFiltersInput = {
    search: filters.search || undefined,
    category: filters.category || undefined,
    location: filters.location || undefined,
    sort: filters.sort ?? "latest",
    limit: 12,
  };

  return (
    <div className="flex flex-col">
      <HeroSection filtersHook={filtersHook} />

      <CategoryFilter filtersHook={{ filters, setFilters }} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={filters.search} onSearchDebouncedChange={setSearchInput} />
        <SortDropdown value={filters.sort} onChange={setSort} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-12">
        <EventGridInfinite filters={filtersForQuery} initialEvents={initialEvents} />
      </div>
    </div>
  );
}
