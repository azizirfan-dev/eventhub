// src/components/events/event-buy-box.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EventDetail, EventTicketType } from "@/hooks/useEventDetail";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useAuthStore } from "@/store/auth";

interface EventBuyBoxProps {
  event: EventDetail;
}

export function EventBuyBox({ event }: EventBuyBoxProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const createTransaction = useCreateTransaction();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    event.ticketTypes[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const selectedTicket: EventTicketType | undefined = useMemo(
    () => event.ticketTypes.find((t) => t.id === selectedTicketId),
    [event.ticketTypes, selectedTicketId]
  );

  const maxQty = selectedTicket?.stock ?? 0;
  const isSoldOut = maxQty <= 0;

  const totalPrice =
    selectedTicket && event.isPaid
      ? selectedTicket.price * quantity
      : 0;

  const handleBuy = () => {
    if (!token) {
      alert("Please login to buy tickets.");
      // nanti bisa router.push("/login");
      return;
    }

    if (!selectedTicket || isSoldOut) {
      return;
    }

    createTransaction.mutate(
      {
        items: [
          {
            ticketTypeId: selectedTicket.id,
            quantity,
          },
        ],
      },
      {
        onSuccess: (trx) => {
          // redirect ke transaksi detail setelah create
          router.push(`/transactions/${trx.id}`);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            "Failed to create transaction. Please try again.";
          alert(message);
        },
      }
    );
  };

  return (
    <aside className="sticky top-20 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tickets
        </p>

        {event.ticketTypes.length === 0 && (
          <p className="mt-2 text-sm text-slate-500">
            Tickets are not available yet.
          </p>
        )}

        <div className="mt-3 space-y-2">
          {event.ticketTypes.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => {
                setSelectedTicketId(ticket.id);
                setQuantity(1);
              }}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                selectedTicketId === ticket.id
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-slate-50 text-slate-800 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{ticket.name}</span>
                <span className="text-xs text-slate-500">
                  {ticket.stock > 0
                    ? `${ticket.stock} left`
                    : "Sold out"}
                </span>
              </div>
              <div className="text-right">
                {event.isPaid ? (
                  <span className="text-sm font-semibold text-indigo-600">
                    Rp{ticket.price.toLocaleString("id-ID")}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                    FREE
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedTicket && (
        <div className="space-y-3 border-t border-slate-100 pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Quantity</span>
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(maxQty || 1, q + 1)
                  )
                }
                className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                disabled={quantity >= maxQty || maxQty === 0}
              >
                +
              </button>
            </div>
          </div>

          {event.isPaid && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total</span>
              <span className="text-base font-semibold text-indigo-600">
                Rp{totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleBuy}
            disabled={
              createTransaction.isPending ||
              !selectedTicket ||
              isSoldOut
            }
            className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-indigo-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSoldOut
              ? "Sold out"
              : createTransaction.isPending
              ? "Processing..."
              : "Buy ticket"}
          </button>

          {!token && (
            <p className="text-xs text-slate-500">
              You need to be logged in to complete your purchase.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
