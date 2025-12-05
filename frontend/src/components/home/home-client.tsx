// src/components/home/home-client.tsx
"use client";

import { useDeferredValue, useEffect, useMemo } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useDiscoverFilters,
  DiscoverFiltersState,
  SortOption,
} from "@/hooks/useDiscoverFilters";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryFilter } from "@/components/home/category-filter";
import { EventGrid } from "@/components/home/event-grid";

export default function HomeClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 🔹 Ambil initial state dari URL
  const initialFromUrl = useMemo<Partial<DiscoverFiltersState>>(() => {
    const sortParam = (searchParams.get("sort") as SortOption | null) ?? "latest";
    const validSortOptions: SortOption[] = [
      "latest",
      "oldest",
      "price_asc",
      "price_desc",
    ];

    return {
      search: searchParams.get("search") ?? "",
      category: searchParams.get("category"),
      location: searchParams.get("location") ?? "",
      sort: validSortOptions.includes(sortParam) ? sortParam : "latest",
    };
  }, [searchParams]);

  const filtersHook = useDiscoverFilters(initialFromUrl);
  const { filters } = filtersHook;

  // 🔹 Debounce ringan pakai useDeferredValue biar query gak ke-trigger tiap keypress
  const deferredFilters = useDeferredValue(filters);

  // 🔹 Sync filters → URL (search, category, location, sort)
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.location) params.set("location", filters.location);
    if (filters.sort !== "latest") params.set("sort", filters.sort);

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [filters, pathname, router]);

  return (
    <div className="flex flex-col">
      <HeroSection filtersHook={filtersHook} />
      <CategoryFilter filtersHook={filtersHook} />
      {/* EventGrid pakai deferredFilters biar gak spam refetch waktu ngetik */}
      <EventGrid filters={deferredFilters} />
    </div>
  );
}
