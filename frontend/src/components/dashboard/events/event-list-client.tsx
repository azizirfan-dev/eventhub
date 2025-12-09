"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMyEventsInfinite } from "@/hooks/useMyEventsInfinite";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { useRef, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function EventListClient() {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyEventsInfinite();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const role = useAuthStore.getState().user?.role;
  if (role !== "ORGANIZER") redirect("/dashboard/profile");

  // Infinite scroll trigger
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const events = data?.pages.flatMap((p) => p.events) || [];

  const handleCreate = () => router.push("/dashboard/events/create");

  const handleDelete = async (id: string) => {
    if (!confirm("Delete event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted!");
      router.refresh();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const formatDateRange = (s: string, e: string) =>
    `${format(new Date(s), "d MMM")} - ${format(new Date(e), "d MMM yyyy")}`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Events</h1>
        <Button onClick={handleCreate} className="rounded-full">
          + Create Event
        </Button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && <p className="text-red-500 text-sm">Failed to load</p>}

      {/* Empty state */}
      {!isLoading && events.length === 0 && (
        <div className="text-center text-sm text-slate-600 mt-12">
          No events yet.
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="flex justify-between items-center border p-4 rounded-lg bg-white shadow-sm">
            <div className="">
              <p className="font-medium">{ev.title}</p>
              <p className="text-xs text-slate-500">
                {ev.category} · {ev.location} · {formatDateRange(ev.startDate, ev.endDate)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline"
                onClick={() => router.push(`/dashboard/events/${ev.id}/edit`)}>
                Edit
              </Button>
              <Button size="sm" variant="outline"
                onClick={() => router.push(`/dashboard/events/${ev.id}/transactions`)}>
                Transactions
              </Button>
              <Button size="sm" variant="destructive"
                onClick={() => handleDelete(ev.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-10 text-center text-xs text-slate-500">
        {isFetchingNextPage && "Loading more..."}
      </div>
    </div>
  );
}
