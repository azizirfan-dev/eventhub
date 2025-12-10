"use client";

import { DiscoverFiltersState } from "@/hooks/useDiscoverFilters";

const LOCATIONS = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Bali",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Makassar",
] as const;

interface LocationFilterProps {
  filtersHook: {
    filters: DiscoverFiltersState;
    setFilters: (data: Partial<DiscoverFiltersState>) => void;
  };
}

export function LocationFilter({ filtersHook }: LocationFilterProps) {
  const { filters, setFilters } = filtersHook;

  const handlePick = (loc: string) => {
    setFilters({
      location: loc === filters.location ? undefined : loc,
    });
  };

  return (
    <div className="w-full overflow-x-auto px-4 py-3 no-scrollbar flex gap-2 justify-center">
      {LOCATIONS.map((loc) => {
        const isActive = filters.location === loc;

        return (
          <button
            key={loc}
            onClick={() => handlePick(loc)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
            ${
              isActive
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
