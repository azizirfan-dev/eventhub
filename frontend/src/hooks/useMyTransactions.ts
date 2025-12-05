// src/hooks/useMyTransactions.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  TransactionStatus,
  TransactionItem,
  PaymentProof,
} from "./useTransaction";

export interface MyTransaction {
  id: string;
  status: TransactionStatus;
  totalAmount: number;
  expiresAt: string | null;
  createdAt: string;
  items: TransactionItem[];
  paymentProof: PaymentProof[];
}

interface MyTransactionsApiResponse {
  status: string;
  message: string;
  data: MyTransaction[];
}
async function fetchMyTransactions(): Promise<MyTransaction[]> {
  const res = await api.get<MyTransactionsApiResponse>("/transactions/me");
  return res.data.data;
}
export function useMyTransactions() {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: fetchMyTransactions,
    refetchOnWindowFocus: false,
  });
}
