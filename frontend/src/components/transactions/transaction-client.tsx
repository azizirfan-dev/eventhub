// src/components/transactions/transaction-client.tsx
"use client";

import { useState, useMemo } from "react";
import { useMyTransactions } from "@/hooks/useMyTransactions";
import { Button } from "@/components/ui/button";
import { TransactionList } from "./transaction-list";
import type { TransactionStatus } from "@/hooks/useTransaction";

const FILTERS: { label: string; value: "ALL" | TransactionStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Waiting Payment", value: "WAITING_PAYMENT" },
  { label: "Waiting Admin", value: "WAITING_ADMIN" },
  { label: "Done", value: "DONE" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Expired", value: "EXPIRED" },
];

export function TransactionClient() {
  const [filter, setFilter] = useState<"ALL" | TransactionStatus>("ALL");
  const { data, isLoading, isError, refetch } = useMyTransactions();

  const transactions = data ?? [];

  const filtered = useMemo(() => {
    if (filter === "ALL") return transactions;
    return transactions.filter((t) => t.status === filter);
  }, [transactions, filter]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold text-slate-900">
          My Transactions
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Something went wrong while loading your transactions.
        </p>
        <Button
          className="mt-4 rounded-full"
          size="sm"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            My Transactions
          </h1>
          <p className="text-xs text-slate-500">
            Track your ticket payments and status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 text-xs">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1 ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <TransactionList transactions={filtered} />
    </div>
  );
}
