"use client";

import { useLocations } from "@/hooks/useLocations";
import type { DiscoverFiltersState } from "@/hooks/useDiscoverFilters";

const CATEGORIES = [
  "Music",
  "Education",
  "Sports",
  "Technology",
  "Art",
  "Business",
] as const;

interface Props {
  filters: DiscoverFiltersState;
  setFilters: (updates: Partial<DiscoverFiltersState>) => void;
}

export function FilterSidebar({ filters, setFilters }: Props) {
  const { data } = useLocations();
  const locations = (data ?? []) as { location?: string | null }[];

  const updateFilter = (
    key: keyof DiscoverFiltersState,
    value?: string
  ) => {
    setFilters({ [key]: value });
  };

  const handleClear = () => {
    setFilters({
      category: undefined,
      location: undefined,
    });
  };

  return (
    <aside className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-xs ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
                onClick={() =>
                  updateFilter("category", active ? undefined : cat)
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Location
        </h3>
        <select
          value={filters.location ?? ""}
          onChange={(e) =>
            updateFilter(
              "location",
              e.target.value ? e.target.value : undefined
            )
          }
          className="w-full rounded-lg border-slate-300 text-sm"
        >
          <option value="">All</option>
          {locations.map((loc, idx) => {
            const value = loc.location ?? "";
            if (!value) return null;

            return (
              <option key={value || idx} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>

      <button
        className="w-full rounded-full border border-slate-300 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        onClick={handleClear}
      >
        Clear All
      </button>
    </aside>
  );
}
