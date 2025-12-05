// src/components/home/event-grid.tsx
"use client";

import { useDiscoverEvents } from "@/hooks/useDiscoverEvents";
import { DiscoverFiltersState } from "@/hooks/useDiscoverFilters";
import { EventCard } from "./event-card";

interface EventGridProps {
    filters: DiscoverFiltersState;
}

export function EventGrid({ filters }: EventGridProps) {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useDiscoverEvents(filters);

    if (isLoading) {
        return (
            <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900">
                        Featured events
                    </h2>
                    <p className="text-xs text-slate-500">Loading events...</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                        >
                            <div className="mb-3 h-32 w-full rounded-xl bg-slate-200" />
                            <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
                            <div className="mb-1 h-3 w-1/2 rounded bg-slate-200" />
                            <div className="mb-1 h-3 w-1/3 rounded bg-slate-200" />
                            <div className="mt-3 flex items-center justify-between gap-2">
                                <div className="h-6 w-20 rounded-full bg-slate-200" />
                                <div className="h-6 w-24 rounded-full bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="mb-2 text-base font-semibold text-slate-900">
                    Featured events
                </h2>
                <p className="text-sm text-red-500">
                    Gagal memuat event. Coba refresh halaman.
                </p>
            </section>
        );
    }

    const events = data?.pages.flatMap((page) => page.events) ?? [];

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                    Recommended for you
                </h2>
                <p className="text-xs text-slate-500">
                    {events.length > 0
                        ? `${events.length} events found`
                        : "Tidak ada event yang cocok dengan filter saat ini."}
                </p>
            </div>

            {events.length > 0 ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    {hasNextPage && (
                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isFetchingNextPage ? "Loading..." : "Load more events"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                    Belum ada event yang cocok. Coba ubah kata kunci atau kategori.
                </div>
            )}
        </section>
    );
}
