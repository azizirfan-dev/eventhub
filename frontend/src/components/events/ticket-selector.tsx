"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useAuthStore } from "@/store/auth";
import { useAuthModalStore } from "@/store/auth-modal";

interface TicketType {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Props {
  tickets: TicketType[];
  eventId: string;
}

export function TicketSelector({ tickets }: Props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { mutate, isPending } = useCreateTransaction();

  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const updateQty = (id: string, value: number) => {
    setCart((prev) => {
      const qty = Math.max(0, (prev[id] || 0) + value);
      return { ...prev, [id]: qty };
    });
  };

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = tickets.reduce(
    (sum, t) => sum + (cart[t.id] || 0) * t.price,
    0
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    const items = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => ({
        ticketTypeId,
        quantity,
      }));

    if (items.length === 0) return;

    mutate(
      { items }, // <----- FIX HERE
      {
        onSuccess: (trx) => {
          router.push(`/payment/${trx.id}`);
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Transaction failed");
        },
      }
    );
  };

  return (
    <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Select Tickets</h3>

      {tickets.length === 0 && (
        <p className="text-sm text-slate-500">No tickets available.</p>
      )}

      {tickets.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">{t.name}</p>
            <p className="text-xs font-medium text-indigo-600">
              Rp{t.price.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-500">Stock: {t.stock}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={(cart[t.id] || 0) === 0}
              onClick={() => updateQty(t.id, -1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              -
            </button>

            <span className="w-6 text-center text-sm font-semibold">
              {cart[t.id] || 0}
            </span>

            <button
              disabled={cart[t.id] >= t.stock}
              onClick={() => updateQty(t.id, +1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      ))}

      {totalQty > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm font-medium text-slate-700">Total</span>
          <span className="text-lg font-bold text-indigo-600">
            Rp{totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      <Button
        className="w-full rounded-full bg-linear-to-r from-indigo-600 to-sky-500 text-sm font-semibold text-white"
        disabled={isPending || totalQty === 0}
        onClick={handleCheckout}
      >
        {isPending ? "Processing..." : "Buy Ticket"}
      </Button>
    </div>
  );
}
