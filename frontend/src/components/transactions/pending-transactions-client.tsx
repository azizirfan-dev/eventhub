"use client";

import { useState } from "react";
import { useOrganizerTransactions, useTransactionAction } from "@/hooks/useOrganizerTransaction";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const STATUS_TABS = [
  { label: "Pending", value: "WAITING_ADMIN" },
  { label: "Done", value: "DONE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Canceled", value: "CANCELED" },
] as const;

export default function PendingTransactionsClient() {
  const [status, setStatus] =
    useState<"WAITING_ADMIN" | "DONE" | "REJECTED" | "CANCELED">("WAITING_ADMIN");

  const { data, isLoading } = useOrganizerTransactions(status);
const transactions = data?.data || [];
console.log("➡️ FE Data:", data);


  const actionMut = useTransactionAction();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Transactions</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`px-3 pb-1 text-sm font-medium ${
              status === tab.value ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
            }`}
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State → Skeleton shimmer */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-slate-200" />
          ))}
        </div>
      ) : data.transactions.length === 0 ? (
        <p className="p-10 text-center text-sm text-slate-500">
          No transactions found 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {data.transactions.map((trx: any) => {
            const event = trx.items?.[0]?.event;

            return (
              <div key={trx.id} className="rounded-lg border p-4 bg-white shadow-sm space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{event?.title}</p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(trx.createdAt), "d MMM yyyy HH:mm")}
                    </p>
                  </div>

                  <div className="text-right text-sm font-medium">
                    Rp {trx.totalAmount.toLocaleString("id-ID")}
                  </div>
                </div>

                {trx.paymentProof?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {trx.paymentProof.map((img: any) => (
                      <img
                        key={img.id}
                        src={img.url}
                        className="h-20 w-20 object-cover border rounded"
                      />
                    ))}
                  </div>
                )}

                {status === "WAITING_ADMIN" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-green-600 text-white"
                      onClick={() => actionMut.mutate({ id: trx.id, type: "approve" })}
                      disabled={actionMut.isPending}
                    >
                      Approve
                    </Button>

                    <Button
                      className="flex-1 bg-red-600 text-white"
                      onClick={() => actionMut.mutate({ id: trx.id, type: "reject" })}
                      disabled={actionMut.isPending}
                    >
                      Reject
                    </Button>

                    <Button
                      className="flex-1 bg-gray-600 text-white"
                      onClick={() => actionMut.mutate({ id: trx.id, type: "cancel" })}
                      disabled={actionMut.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>    
  );
}
