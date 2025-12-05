// src/components/transactions/transaction-list.tsx
"use client";

import type { MyTransaction } from "@/hooks/useMyTransactions";
import { TransactionCard } from "./transaction-card";

interface TransactionListProps {
  transactions: MyTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        You don&apos;t have any transactions yet.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {transactions.map((t) => (
        <TransactionCard key={t.id} transaction={t} />
      ))}
    </div>
  );
}
