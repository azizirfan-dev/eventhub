"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

export default function OrganizerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  async function fetchPending() {
    try {
      const res = await api.get("/transactions/pending");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      await api.patch(`/transactions/${id}/${action}`);
      fetchPending(); // refresh
    } catch (error) {
      console.error("Action failed:", error);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-turquoise">
          Pending Approvals
        </h1>

        {orders.length === 0 && (
          <p className="text-gray-400">No pending transactions.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            const item = order.items[0];
            const proof = order.paymentProof[0];

            return (
              <div
                key={order.id}
                className="bg-zinc-900 p-5 rounded-lg border border-zinc-700 space-y-3"
              >
                <h2 className="text-xl font-bold text-white">
                  {item.event.title}
                </h2>

                <p className="text-gray-300 text-sm">
                  {item.ticketType.name} — Qty: {item.quantity}
                </p>

                <p className="text-turquoise font-bold text-lg">
                  Rp {order.totalAmount.toLocaleString()}
                </p>

                {proof?.url && (
                  <img
                    src={proof.url}
                    className="w-40 h-40 object-cover border border-zinc-600 rounded"
                    alt="Payment proof"
                  />
                )}

                <div className="flex gap-3 mt-3">
                  <button
                    className="bg-green-600 px-4 py-2 rounded text-white"
                    onClick={() => handleAction(order.id, "approve")}
                  >
                    Approve
                  </button>

                  <button
                    className="bg-red-600 px-4 py-2 rounded text-white"
                    onClick={() => handleAction(order.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </AuthGuard>
  );
}
