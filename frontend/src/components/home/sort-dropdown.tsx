"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DiscoverSort } from "@/hooks/useDiscoverEventsInfinite";

interface SortDropdownProps {
  value: DiscoverSort;
  onChange: (value: DiscoverSort) => void;
}

const SORT_LABEL: Record<DiscoverSort, string> = {
  latest: "Latest",
  oldest: "Oldest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
};

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
        <span>Sort</span>
        <span className="hidden sm:inline text-slate-500">
          {SORT_LABEL[value]}
        </span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 text-xs">
        {(Object.keys(SORT_LABEL) as DiscoverSort[]).map((key) => (
          <DropdownMenuItem
            key={key}
            className="cursor-pointer text-slate-700"
            onClick={() => onChange(key)}
          >
            {SORT_LABEL[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
