"use client";

import { CATEGORIES } from "@/lib/constants/categories";
import { categoryGradients, defaultGradient } from "@/lib/constants/category-colors";
import { DiscoverFiltersState } from "@/hooks/useDiscoverFilters";

interface CategoryFilterProps {
  filtersHook: {
    filters: DiscoverFiltersState;
    setFilters: (updates: Partial<DiscoverFiltersState>) => void;
  };
}

export function CategoryFilter({ filtersHook }: CategoryFilterProps) {
  const { filters, setFilters } = filtersHook;

  const handlePick = (cat: string) => {
    setFilters({
      category: cat === filters.category ? undefined : cat,
    });
  };

  return (
    <div className="w-full overflow-x-auto px-4 no-scrollbar py-3 flex gap-2 justify-center">
      {CATEGORIES.map((cat) => {
        const isActive = filters.category === cat;
        const gradient = categoryGradients[cat] ?? defaultGradient;

        return (
          <button
            key={cat}
            onClick={() => handlePick(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
            ${
              isActive
                ? `bg-linear-to-r ${gradient} text-white shadow-md scale-105`
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
