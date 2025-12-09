"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/useLocations";
import type { DiscoverFiltersState } from "@/hooks/useDiscoverFilters";

// Simple: lokal list kategori
const CATEGORIES = [
  "Music",
  "Education",
  "Sports",
  "Technology",
  "Art",
  "Business",
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  filters: DiscoverFiltersState;
  setFilters: (updates: Partial<DiscoverFiltersState>) => void;
}

export function FilterModalMobile({
  open,
  onClose,
  filters,
  setFilters,
}: Props) {
  const { data } = useLocations();

  // paksa type locations supaya bukan unknown[]
  const locations = (data ?? []) as { location?: string | null }[];

  const updateFilter = (
    key: keyof DiscoverFiltersState,
    value?: string
  ) => {
    setFilters({ [key]: value });
  };

  const handleClearAll = () => {
    setFilters({
      category: undefined,
      location: undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-t-2xl bottom-0 translate-y-2">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 py-2">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-sm ${
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

        {/* Location */}
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Location</p>
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

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
