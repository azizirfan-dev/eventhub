// src/hooks/useCreateTransaction.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CreateTransactionItemInput {
  ticketTypeId: string;
  quantity: number;
}

export interface CreateTransactionInput {
  items: CreateTransactionItemInput[];
  promoCode?: string;
  usePoints?: number;
}

export interface Transaction {
  id: string;
  totalAmount: number;
  status: string;
  expiresAt: string;
}

interface CreateTransactionApiResponse {
  status: string;
  message: string;
  data: Transaction;
}

async function createTransactionRequest(
  payload: CreateTransactionInput
): Promise<Transaction> {
  const response = await api.post<CreateTransactionApiResponse>(
    "/transactions",
    payload
  );
  return response.data.data;
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: createTransactionRequest,
  });
}
