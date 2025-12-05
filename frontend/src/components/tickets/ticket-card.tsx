"use client";

import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import type { MyTicket } from "@/hooks/useMyTickets";
import { Button } from "@/components/ui/button";

export function TicketCard({ ticket }: { ticket: MyTicket }) {
  const router = useRouter();
  const qrValue = `${ticket.transactionId}-${ticket.eventId}-${ticket.ticketName}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-900 line-clamp-2">
          {ticket.eventTitle}
        </p>
        <p className="text-xs text-slate-500">{ticket.eventLocation}</p>
      </div>

      <div className="mt-3 flex justify-center">
        <QRCode value={qrValue} size={90} />
      </div>

      <p className="mt-3 text-xs font-medium text-slate-700">
        {ticket.ticketName} × {ticket.quantity}
      </p>

      <Button
        size="sm"
        className="mt-3 w-full rounded-full bg-linear-to-r from-indigo-600 to-sky-500 text-xs font-semibold text-white"
        onClick={() => router.push(`/events/${ticket.eventId}`)}
      >
        View Event Detail
      </Button>

      <button
        onClick={() => navigator.clipboard.writeText(qrValue)}
        className="mt-1 w-full rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
      >
        Copy Ticket Code
      </button>
    </article>
  );
}
