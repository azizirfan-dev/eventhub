// src/components/transactions/transaction-card.tsx
"use client";

import { useRouter } from "next/navigation";
import type { MyTransaction } from "@/hooks/useMyTransactions";
import { StatusBadge } from "@/components/payment/status-badge";
import { Button } from "@/components/ui/button";

function formatCurrency(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface TransactionCardProps {
  transaction: MyTransaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const router = useRouter();

  const firstItem = transaction.items[0];
  const title = firstItem?.event?.title ?? "Event";
  const location = firstItem?.event?.location ?? "Location";
  const ticketSummary = transaction.items
    .map((item) => `${item.ticketType?.name ?? "Ticket"} × ${item.quantity}`)
    .join(", ");

  const isWaitingPayment = transaction.status === "WAITING_PAYMENT";
  const isDone = transaction.status === "DONE";

  const handlePrimaryAction = () => {
    if (isWaitingPayment) {
      router.push(`/payment/${transaction.id}`);
    } else if (isDone) {
      router.push("/my-tickets");
    }
  };

  const primaryLabel = isWaitingPayment
    ? "Upload Payment Proof"
    : isDone
    ? "View Tickets"
    : null;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 line-clamp-1">
              {title}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">
            {location}
          </p>
          <p className="text-[11px] text-slate-500">
            {ticketSummary}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={transaction.status} />
          <p className="text-[11px] text-slate-400">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-600">
          <span className="text-[11px] uppercase tracking-wide text-slate-400">
            Total
          </span>
          <p className="text-sm font-semibold text-slate-900">
            {formatCurrency(transaction.totalAmount)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {primaryLabel && (
            <Button
              size="sm"
              className="rounded-full bg-linear-to-r from-indigo-600 to-sky-500 text-xs font-semibold text-white"
              onClick={handlePrimaryAction}
            >
              {primaryLabel}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-slate-200 text-xs"
            onClick={() => router.push(`/payment/${transaction.id}`)}
          >
            View Detail
          </Button>
        </div>
      </div>
    </article>
  );
}
