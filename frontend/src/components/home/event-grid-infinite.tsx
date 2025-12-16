"use client";

import { useEffect, useRef } from "react";
import {
  useDiscoverEventsInfinite,
  DiscoverFiltersInput,
} from "@/hooks/useDiscoverEventsInfinite";
import { EventCard } from "./event-card";

interface EventGridInfiniteProps {
  filters: DiscoverFiltersInput;
  initialEvents?: any[]; 
}

export function EventGridInfinite({
  filters,
  initialEvents = [],
}: EventGridInfiniteProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverEventsInfinite(filters);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const flatEvents =
    data?.pages.flatMap((p) => p.events) ??
    initialEvents ??
    [];

  if (isLoading && initialEvents.length === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (isError && flatEvents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Failed to load events. Please try again later.
      </div>
    );
  }

  if (flatEvents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No events found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {flatEvents.map((event) => (
          <EventCard key={event.id} event={event as any} />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className="h-10 w-full flex items-center justify-center"
      >
        {hasNextPage && (
          <p className="mt-3 text-center text-[11px] text-slate-400">
            {isFetchingNextPage ? "Loading more events..." : "Scroll to load more"}
          </p>
        )}
      </div>
    </>
  );
}
