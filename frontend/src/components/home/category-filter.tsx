// src/components/home/category-filter.tsx
"use client";

import { useDiscoverFilters } from "@/hooks/useDiscoverFilters";

const CATEGORIES = [
  "All",
  "Music",
  "Festival",
  "Workshop",
  "Sport",
  "Conference",
  "Exhibition",
  "Community",
];

interface CategoryFilterProps {
  filtersHook: ReturnType<typeof useDiscoverFilters>;
}

export function CategoryFilter({ filtersHook }: CategoryFilterProps) {
  const { filters, setCategory } = filtersHook;

  const activeCategory = filters.category ?? "All";

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Browse by category
          </h2>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setCategory(cat === "All" ? null : cat.toLowerCase())
                }
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
