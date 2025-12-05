"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import AuthGuard from "@/components/auth-guard";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("transactionId", id as string);
    formData.append("proof", file);

    try {
      setLoading(true);
      const res = await api.post(`/transactions/${id}/upload-proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "success") {
        alert("Upload success! Waiting for approval.");
        window.location.href = "/orders";
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard roles={["CUSTOMER"]}>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
        <h1 className="text-2xl font-bold text-white">Upload Payment Proof</h1>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-white"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-turquoise text-black px-6 py-2 rounded-md font-semibold"
        >
          {loading ? "Uploading..." : "Submit Proof"}
        </button>
      </main>
    </AuthGuard>
  );
}
