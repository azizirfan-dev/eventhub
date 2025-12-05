"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

const statusColors: Record<string, string> = {
  WAITING_PAYMENT: "bg-yellow-600",
  WAITING_ADMIN: "bg-blue-600",
  DONE: "bg-green-600",
  REJECTED: "bg-red-600",
  CANCELED: "bg-gray-600",
  EXPIRED: "bg-gray-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get("/transactions/me");
        setOrders(res.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  return (
    <AuthGuard roles={["CUSTOMER"]}>
      <main className="min-h-screen px-6 py-10 space-y-6">
        <h1 className="text-3xl font-bold text-turquoise">My Orders</h1>

        <div className="space-y-4">
          {orders.length === 0 && (
            <p className="text-gray-400">No orders yet.</p>
          )}

          {orders.map((order) => {
            const item = order.items[0];

            return (
              <div
                key={order.id}
                className="bg-zinc-900 p-5 rounded-lg border border-zinc-700"
              >
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded text-sm text-white ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status.replace("_", " ")}
                </span>

                <h2 className="text-xl font-bold text-white mt-3">
                  {item.event.title}
                </h2>

                <p className="text-gray-300 text-sm">
                  {item.ticketType.name} — Qty: {item.quantity}
                </p>

                <p className="text-lg font-bold text-turquoise mt-2">
                  Rp {order.totalAmount.toLocaleString()}
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  Ordered at:{" "}
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </AuthGuard>
  );
}
