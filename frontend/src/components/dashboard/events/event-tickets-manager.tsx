"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface TicketType {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function EventTicketsManager({
  eventId,
  initialTickets,
  isPaid,
  refresh,
}: {
  eventId: string;
  initialTickets: TicketType[];
  isPaid: boolean;
  refresh: () => void;
}) {
  const [tickets, setTickets] = useState(initialTickets);

  const updateTicket = (index: number, key: keyof TicketType, value: string | number) => {
    setTickets((prev) =>
      prev.map((t, idx) =>
        idx !== index ? t : { ...t, [key]: key === "name" ? String(value) : Number(value) }
      )
    );
  };

  const handleUpdate = async (ticket: TicketType) => {
    await api.put(`/events/tickets/${ticket.id}`, {
      name: ticket.name,
      price: isPaid ? ticket.price : 0,
      stock: ticket.stock,
    });
    refresh();
  };

  const handleDelete = async (ticketId: string) => {
    await api.delete(`/events/tickets/${ticketId}`);
    refresh();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-slate-900">Ticket Types</h3>

      {tickets.map((t, i) => (
        <div key={t.id} className="flex gap-3 items-center">
          <Input
            className="w-32"
            value={t.name}
            onChange={(e) => updateTicket(i, "name", e.target.value)}
          />
          <Input
            type="number"
            className="w-32"
            value={t.price}
            disabled={!isPaid}
            onChange={(e) => updateTicket(i, "price", Number(e.target.value))}
          />
          <Input
            type="number"
            className="w-24"
            value={t.stock}
            onChange={(e) => updateTicket(i, "stock", Number(e.target.value))}
          />

          <Button variant="outline" size="sm" onClick={() => handleUpdate(t)}>
            Update
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(t.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
