// src/components/payment/payment-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransaction } from "@/hooks/useTransaction";
import { StatusBadge } from "./status-badge";
import { UploadProofSection } from "./upload-proof";
import { Button } from "@/components/ui/button";

interface PaymentClientProps {
  transactionId: string;
}

function formatCurrency(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function formatTimeLeft(seconds: number) {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export function PaymentClient({ transactionId }: PaymentClientProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } =
    useTransaction(transactionId);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    null
  );

  const transaction = data;

  // Countdown (only WAITING_PAYMENT)
  useEffect(() => {
    if (!transaction?.expiresAt) {
      setRemainingSeconds(null);
      return;
    }

    if (transaction.status !== "WAITING_PAYMENT") {
      setRemainingSeconds(null);
      return;
    }

    const expiry = new Date(transaction.expiresAt).getTime();

    const update = () => {
      const now = Date.now();
      const diffSec = Math.floor((expiry - now) / 1000);
      setRemainingSeconds(diffSec);
      if (diffSec <= 0) {
        router.replace("/my-transactions");
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [transaction?.expiresAt, transaction?.status, router]);

  // Status dependent redirect (DONE → /my-tickets, REJECTED → stay + alert)
  useEffect(() => {
    if (!transaction) return;

    if (transaction.status === "DONE") {
      router.replace("/my-tickets");
    } else if (transaction.status === "REJECTED") {
      // simple info; bisa diganti toast nanti
      alert("Your payment has been rejected. Please create a new transaction.");
    }
  }, [transaction?.status, transaction, router]);

  const firstItem = useMemo(
    () => transaction?.items?.[0],
    [transaction?.items]
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-40 w-full animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Transaction not found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Please check your transactions list.
        </p>
        <Button
          className="mt-4 rounded-full"
          size="sm"
          onClick={() => router.push("/my-transactions")}
        >
          Go to My Transactions
        </Button>
      </div>
    );
  }

  const showCountdown =
    typeof remainingSeconds === "number" && remainingSeconds > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Complete your payment
          </h1>
          <p className="text-xs text-slate-500">
            Transaction ID: {transaction.id}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={transaction.status} />
          {showCountdown && (
            <p className="text-[11px] font-medium text-amber-600">
              Time left: {formatTimeLeft(remainingSeconds!)}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Left: detail + items */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Order summary
            </h2>

            {firstItem && (
              <div className="mt-3 flex gap-3">
                <div className="hidden h-16 w-24 overflow-hidden rounded-lg bg-slate-200 sm:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {firstItem.event.bannerUrl ? (
                    <img
                      src={firstItem.event.bannerUrl}
                      alt={firstItem.event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-slate-500">
                      EventHub
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {firstItem.event.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {firstItem.event.location}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              {transaction.items.map((item, idx) => (
                <div
                  key={item.id ?? idx}
                  className="flex items-center justify-between text-xs text-slate-700"
                >
                  <span>
                    {item.ticketType?.name ?? "Ticket"} × {item.quantity}
                  </span>
                  <span>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(transaction.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">
              What&apos;s next?
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>
                Transfer the exact total amount to the provided bank
                account.
              </li>
              <li>Upload your payment proof in the section on the right.</li>
              <li>
                Our team will verify your payment and confirm your
                ticket.
              </li>
            </ul>
          </div>
        </section>

        {/* Right: upload proof */}
        <UploadProofSection
          transactionId={transaction.id}
          status={transaction.status}
          existingProofs={transaction.paymentProof ?? []}
          onUploaded={() => {
            refetch();
          }}
        />
      </div>
    </div>
  );
}
