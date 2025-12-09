"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id;
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload proof first");

    const formData = new FormData();
    formData.append("images", file);

    try {
      setIsUploading(true);
      await api.post(`/transactions/${transactionId}/upload-proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Payment uploaded");
      router.push("/transactions");
    } catch (err) {
      console.error(err);
      alert("Failed upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6 space-y-6">
      <h1 className="text-xl font-semibold">Upload Payment Proof</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <Button
        className="w-full rounded-full"
        disabled={isUploading}
        onClick={handleUpload}
      >
        {isUploading ? "Uploading..." : "Submit Payment"}
      </Button>
    </div>
  );
}
