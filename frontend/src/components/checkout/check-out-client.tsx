"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function CheckoutClient({ transactionId }: { transactionId: string }) {
  const router = useRouter();
  const token = useAuthStore.getState().token;

  const [trx, setTrx] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    api.get(`/transactions/${transactionId}`)
      .then((res) => setTrx(res.data.data))
      .finally(() => setIsLoading(false));
  }, [transactionId, token]);

  if (isLoading) return <p className="text-center p-10">Loading...</p>;
  if (!trx) return <p className="text-center p-10">Transaction not found</p>;

  const event = trx.items[0]?.event;
  const total = trx.totalAmount.toLocaleString("id-ID");

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold text-slate-900">Checkout</h2>

      <div className="rounded-lg border p-4 space-y-2">
        <p className="font-medium">{event?.title}</p>
        <p className="text-xs text-slate-500">{event?.location}</p>

        {trx.items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.ticketType.name} × {item.quantity}</span>
            <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
          </div>
        ))}

        <div className="border-t pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>Rp {total}</span>
        </div>
      </div>

      {trx.status === "WAITING_PAYMENT" && (
        <Button
          className="w-full rounded-full"
          onClick={() => router.push(`/checkout/${transactionId}/upload-proof`)}
        >
          Upload Payment Proof
        </Button>
      )}

      {trx.status === "WAITING_ADMIN" && (
        <p className="text-sm text-yellow-600 text-center">
          Waiting for admin approval
        </p>
      )}

      {trx.status === "DONE" && (
        <p className="text-sm text-green-600 text-center">
          Payment completed 🎉
        </p>
      )}
    </div>
  );
}
