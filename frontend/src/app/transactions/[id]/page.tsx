"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

async function getTransaction(id: string) {
  const res = await api.get(`/transactions/${id}`);
  return res.data.data;
}

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TransactionDetailClient id={id} />;
}

function TransactionDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const data = await getTransaction(id);
    setTransaction(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (file: File | null) => {
    if (!file) return alert("Select image first!");

    setUploading(true);
    const form = new FormData();
    form.append("images", file);

    try {
      await api.post(`/transactions/${id}/upload-proof`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Proof uploaded!");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!transaction) return <div className="p-10">Loading...</div>;

  const status = transaction.status;

  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Transaction Details</h1>

      <div className="space-y-2 rounded-lg border bg-white p-4 text-sm">
        <p className="font-semibold">{transaction.items[0].event.title}</p>
        <p>{transaction.items[0].ticketType.name}</p>
        <p className="text-indigo-600 font-bold">
          Rp{transaction.totalAmount.toLocaleString("id-ID")}
        </p>
        <p>Status: <b>{status}</b></p>
      </div>

      {status === "WAITING_PAYMENT" && (
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
          />
          <Button disabled={uploading} className="w-full rounded-full">
            {uploading ? "Uploading..." : "Upload Payment Proof"}
          </Button>
        </div>
      )}

      {status === "WAITING_ADMIN" && (
        <p className="text-sm text-slate-600">Menunggu verifikasi admin...</p>
      )}

      {status === "DONE" && <p className="text-green-600 font-semibold">Payment Confirmed ✔</p>}
      {status === "CANCELED" && <p className="text-red-600 font-semibold">Transaction Canceled</p>}
      {status === "EXPIRED" && <p className="text-red-600 font-semibold">Transaction Expired</p>}

      <Button variant="outline" onClick={() => router.push("/transactions")} className="w-full">
        Back to My Transactions
      </Button>
    </div>
  );
}
