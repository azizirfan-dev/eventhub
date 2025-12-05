"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

export default function ManageTicketsPage() {
  const { id: eventId } = useParams();
  const [tickets, setTickets] = useState<any[]>([]);
  const [newTicket, setNewTicket] = useState({ name: "", price: 0, stock: 0 });

  async function fetchTickets() {
    try {
      const res = await api.get(`/events/${eventId}`);
      setTickets(res.data.data.ticketTypes);
    } catch (err) {
      console.error("Failed load tickets:", err);
    }
  }

  async function handleAdd() {
    try {
      await api.post(`/events/${eventId}/tickets`, newTicket);
      setNewTicket({ name: "", price: 0, stock: 0 });
      fetchTickets();
    } catch (err) {
      console.error("Add error:", err);
    }
  }

  async function handleDelete(ticketId: string) {
    if (!confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/events/tickets/${ticketId}`);
      fetchTickets();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen px-6 py-10">
        <h1 className="text-3xl font-bold text-turquoise mb-6">Tickets</h1>

        {/* Add New Ticket */}
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
          <h2 className="text-lg font-semibold text-white mb-3">
            Add Ticket Type
          </h2>

          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={newTicket.name}
              onChange={(e) =>
                setNewTicket({ ...newTicket, name: e.target.value })
              }
              className="bg-zinc-800 p-2 rounded text-white"
            />
            <input
              type="number"
              placeholder="Price"
              value={newTicket.price}
              onChange={(e) =>
                setNewTicket({ ...newTicket, price: Number(e.target.value) })
              }
              className="bg-zinc-800 p-2 rounded text-white"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newTicket.stock}
              onChange={(e) =>
                setNewTicket({ ...newTicket, stock: Number(e.target.value) })
              }
              className="bg-zinc-800 p-2 rounded text-white"
            />
            <button
              onClick={handleAdd}
              className="bg-turquoise text-black px-4 py-2 rounded"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Ticket List */}
        <div className="space-y-4 mt-6">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-700 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-gray-400 text-sm">
                  Rp {t.price.toLocaleString()} — Stock {t.stock}
                </p>
              </div>

              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
