// src/hooks/useTransaction.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type TransactionStatus =
  | "WAITING_PAYMENT"
  | "WAITING_ADMIN"
  | "DONE"
  | "EXPIRED"
  | "CANCELED"
  | "REJECTED";

export interface TransactionEvent {
  id: string;
  title: string;
  bannerUrl?: string | null;
  location?: string | null;
  startDate?: string | null;
}

export interface TransactionTicketType {
  id: string;
  name: string;
  price: number;
}

export interface TransactionItem {
  id?: string;
  event: TransactionEvent;
  ticketType: TransactionTicketType | null;
  quantity: number;
  price: number;
}

export interface PaymentProof {
  id?: string;
  url: string;
}

export interface TransactionDetail {
  id: string;
  status: TransactionStatus;
  totalAmount: number;
  expiresAt: string | null;
  items: TransactionItem[];
  paymentProof: PaymentProof[];
  createdAt?: string;
}

interface TransactionDetailApiResponse {
  status: string;
  message: string;
  data: TransactionDetail;
}

async function fetchTransactionDetail(
  transactionId: string
): Promise<TransactionDetail> {
  const res = await api.get<TransactionDetailApiResponse>(
    `/transactions/${transactionId}`
  );
  return res.data.data;
}

export function useTransaction(transactionId?: string) {
  return useQuery({
    queryKey: ["transaction-detail", transactionId],
    queryFn: () => fetchTransactionDetail(transactionId!),
    enabled: !!transactionId,
    refetchOnWindowFocus: false,
  });
}
