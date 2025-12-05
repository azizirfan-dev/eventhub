"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [countdown, setCountdown] = useState("");

    async function fetchOrder() {
        try {
            const res = await api.get(`/transactions/${id}`);
            setOrder(res.data.data);
            updateTimer(res.data.data.expiresAt);
        } catch (err) {
            console.error("Error fetching order:", err);
        }
    }

    function updateTimer(expiry: string) {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const exp = new Date(expiry).getTime();
            const diff = exp - now;

            if (diff <= 0) {
                clearInterval(interval);
                setCountdown("Expired");
                return;
            }

            const min = Math.floor(diff / 60000);
            const sec = Math.floor((diff % 60000) / 1000);

            setCountdown(`${min}m ${sec}s`);
        }, 1000);
    }

    async function handleCancel() {
        if (!confirm("Cancel this order?")) return;
        try {
            await api.patch(`/transactions/${id}/cancel`);
            fetchOrder();
        } catch (err) {
            console.error("Cancel failed:", err);
        }
    }

    useEffect(() => {
        fetchOrder();
    }, []);

    if (!order) return <div className="text-white p-6">Loading...</div>;

    const item = order.items[0];
    const proof = order.paymentProof[0];

    return (
        <AuthGuard roles={["CUSTOMER"]}>
            <main className="min-h-screen px-6 py-10 space-y-6">
                <h1 className="text-3xl font-bold text-turquoise">Order Detail</h1>

                {/* Status */}
                <span
                    className={`px-4 py-2 text-white rounded ${statusColors[order.status]}`}
                >
                    {order.status.replace("_", " ")}
                </span>

                <div className="bg-zinc-900 p-5 rounded-lg border border-zinc-700 space-y-3">
                    <h2 className="text-white font-semibold text-lg">
                        {item.event.title}
                    </h2>

                    <p className="text-gray-300 text-sm">
                        {item.ticketType.name} — Qty: {item.quantity}
                    </p>

                    <p className="font-bold text-turquoise text-lg">
                        Rp {order.totalAmount.toLocaleString()}
                    </p>

                    {/* Countdown */}
                    {order.status === "WAITING_PAYMENT" && (
                        <p className="text-yellow-500 text-sm">
                            Pay within: {countdown}
                        </p>
                    )}

                    {/* Payment Proof Block */}
                    {proof?.url ? (
                        <>
                            <p className="text-gray-300 text-sm">Payment Proof:</p>
                            <img
                                src={proof.url}
                                className="w-full max-w-xs rounded-md border border-zinc-700"
                            />
                        </>
                    ) : (
                        order.status === "WAITING_PAYMENT" && (
                            <button
                                className="bg-blue-600 px-4 py-2 rounded text-white"
                                onClick={() => (window.location.href = `/checkout/${order.id}`)}
                            >
                                Upload Payment Proof
                            </button>
                        )
                    )}


                    {order.status === "DONE" && (
                        <button
                            className="bg-green-600 px-4 py-2 rounded text-white w-full"
                            onClick={() => (window.location.href = "/orders/me")}
                        >
                            View My Tickets
                        </button>
                    )}


                    {order.status === "WAITING_PAYMENT" && (
                        <button
                            className="bg-red-600 px-4 py-2 rounded text-white"
                            onClick={handleCancel}
                        >
                            Cancel Order
                        </button>
                    )}

                </div>
            </main>
        </AuthGuard>
    );
}
