"use client";

import { useMyTickets } from "@/hooks/useMyTickets";
import { TicketCard } from "./ticket-card";

export function TicketsClient() {
  const { data, isLoading, isError, refetch } = useMyTickets();
  const tickets = data ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-red-500">
          Failed to load tickets. Please retry.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 rounded-full border px-3 py-1 text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900">My Tickets</h1>
      <p className="text-xs text-slate-500">
        Show your tickets at the event entrance.
      </p>

      {tickets.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed bg-slate-50 p-6 text-center text-sm text-slate-500">
          You don&apos;t have any paid tickets yet.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
