"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

export default function EventDetailPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<any>(null);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data.data);
            } catch (err) {
                console.error("Error fetching event detail:", err);
            }
        }
        if (id) fetchEvent();
    }, [id]);

    if (!event) {
        return (
            <main className="min-h-screen flex items-center justify-center text-gray-300">
                Loading event...
            </main>
        );
    }

    return (
        <AuthGuard roles={["CUSTOMER", "ORGANIZER"]}>
            <main className="min-h-screen px-6 py-12 space-y-6">
                <h1 className="text-4xl font-bold text-white">{event.title}</h1>
                <p className="text-gray-300">{event.description}</p>
                <p className="text-gray-400">
                    📍 {event.location}
                    <br />
                    📅{" "}
                    {new Date(event.startDate).toLocaleDateString("id-ID")}
                </p>

                <p className="text-lg font-semibold text-turquoise">
                    {event.price > 0 ? `Rp ${event.price.toLocaleString()}` : "Free Event"}
                </p>
                {/* Organizer Info */}
                {event.organizer && (
                    <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
                        <p className="text-gray-400 text-sm">Hosted by</p>
                        <p className="text-white font-semibold">{event.organizer.name}</p>
                        <p className="text-gray-400 text-xs">{event.organizer.email}</p>
                    </div>
                )}

                {/* Ticket Types */}
                <div className="space-y-3 mt-6">
                    <h2 className="text-xl font-bold text-turquoise">Ticket Types</h2>

                    {event.ticketTypes.map((ticket: any) => (
                        <div
                            key={ticket.id}
                            className="bg-zinc-900 p-4 rounded-md border border-zinc-700"
                        >
                            <p className="text-white font-semibold">{ticket.name}</p>
                            <p className="text-turquoise font-bold">
                                Rp {ticket.price.toLocaleString()}
                            </p>
                            <p className="text-gray-400 text-xs">
                                Stock: {ticket.stock}
                            </p>
                        </div>
                    ))}

                    {/* Select Ticket Section */}
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-bold text-turquoise">Select Ticket</h2>

                        {event.ticketTypes.map((ticket: any) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 rounded-md border cursor-pointer transition ${selectedTicket?.id === ticket.id
                                    ? "bg-turquoise text-black border-turquoise"
                                    : "bg-zinc-900 border-zinc-700 text-white"
                                    }`}
                            >
                                <p className="font-semibold">{ticket.name}</p>
                                <p>Rp {ticket.price.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">
                                    Stock: {ticket.stock}
                                </p>
                            </div>
                        ))}

                        {/* Quantity */}
                        {selectedTicket && (
                            <div className="flex items-center gap-3 mt-4">
                                <label className="text-sm">Qty</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    max={selectedTicket.stock}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-16 text-center bg-black border border-zinc-700 rounded text-white"
                                />
                            </div>
                        )}
                        {/* Total */}
                        {selectedTicket && (
                            <p className="text-lg font-bold text-turquoise">Total: Rp {(selectedTicket.price * quantity).toLocaleString()}</p>
                        )}
                        {/* Checkout Button */}
                        {selectedTicket && (
                            <button
                                className="w-full bg-turquoise text-white font-semibold p-3 rounded-md mt-2"
                                onClick={async () => {
                                    try {
                                        const res = await api.post("/transactions", {
                                            items: [{ ticketTypeId: selectedTicket.id, quantity},],
                                            promoCode: "",
                                            usePoints: 0,
                                        });
                                        if (res.data.status === "success") {
                                            const transactionId = res.data.data.id;
                                            window.location.href = `/checkout/${transactionId}`;
                                        } else {
                                            alert(res.data.message);
                                        }
                                    } catch (error: any) {
                                        alert(error?.response?.data?.message || "Checkout failed");
                                    }
                                }}
                            >Checkout
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}
