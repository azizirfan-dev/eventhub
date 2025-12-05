// src/components/payment/status-badge.tsx
"use client";

import type { TransactionStatus } from "@/hooks/useTransaction";

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    WAITING_PAYMENT:
      "bg-amber-50 text-amber-700 border border-amber-200",
    WAITING_ADMIN:
      "bg-indigo-50 text-indigo-700 border border-indigo-200",
    DONE:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    REJECTED:
      "bg-red-50 text-red-600 border border-red-200",
    CANCELED:
      "bg-slate-200 text-slate-600 border border-slate-300",
    EXPIRED:
      "bg-slate-300 text-slate-500 border border-slate-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
