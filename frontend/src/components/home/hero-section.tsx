// src/components/home/hero-section.tsx
"use client";

import { FormEvent } from "react";
import { useDiscoverFilters } from "@/hooks/useDiscoverFilters";

interface HeroSectionProps {
  filtersHook: ReturnType<typeof useDiscoverFilters>;
}

export function HeroSection({ filtersHook }: HeroSectionProps) {
  const { filters, setSearch } = filtersHook;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-linear-to-b from-indigo-50 via-sky-50 to-slate-50">
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="mx-auto h-64 max-w-4xl bg-linear-to-tr from-indigo-500 via-sky-400 to-indigo-300 opacity-40" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className="flex-1 space-y-5">
          <p className="inline-flex items-center rounded-full border border-indigo-100 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm backdrop-blur">
            Live experiences, simplified
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Temukan acara seru,{" "}
            <span className="bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              tiket dalam beberapa klik.
            </span>
          </h1>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            Jelajahi konser, festival, workshop, dan event lainnya — semua dalam
            satu tempat. Tanpa ribet, tanpa FOMO.
          </p>
          
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified organizers
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Secure payment
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Real-time availability
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}
