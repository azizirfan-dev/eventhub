// src/hooks/useMyTickets.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TransactionDetail } from "./useTransaction";

export interface MyTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventLocation: string;
  ticketName: string;
  quantity: number;
  price: number;
  transactionId: string;
}

async function fetchMyTickets(): Promise<MyTicket[]> {
  const res = await api.get<{ data: TransactionDetail[] }>("/transactions/me");
  const trxs = res.data.data.filter((t) => t.status === "DONE");

  const tickets: MyTicket[] = [];

  trxs.forEach((trx) => {
    trx.items.forEach((item) => {
      tickets.push({
        id: `${trx.id}-${item.ticketType?.id ?? "no-id"}`,
        eventId: item.event.id,
        eventTitle: item.event.title,
        eventLocation: item.event.location ?? "TBA Location",
        ticketName: item.ticketType?.name ?? "Ticket",
        quantity: item.quantity,
        price: item.price,
        transactionId: trx.id,
      });
    });
  });

  return tickets;
}

export function useMyTickets() {
  return useQuery({
    queryKey: ["my-tickets"],
    queryFn: fetchMyTickets,
    refetchOnMount: true,
  });
}
