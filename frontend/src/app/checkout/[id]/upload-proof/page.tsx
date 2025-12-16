// src/app/checkout/[id]/upload-proof/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadProofPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const transactionId = params.id;

  const [trx, setTrx] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    api
      .get(`/transactions/${transactionId}`)
      .then((res) => setTrx(res.data.data))
      .finally(() => setIsLoading(false));
  }, [transactionId]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (!f) return;
    setFiles([...files, ...Array.from(f)]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Upload payment proof first!");

    try {
      setIsProcessing(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      await api.post(
        `/transactions/${transactionId}/upload-proof`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Upload sukses! Menunggu verifikasi admin");
      router.push(`/checkout/${transactionId}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this transaction?")) return;

    await api.patch(`/transactions/${transactionId}/cancel`);
    alert("Transaction canceled");
    router.push("/transactions");
  };

  if (isLoading) return <p className="text-center p-10">Loading...</p>;
  if (!trx) return <p className="text-center p-10">Transaction not found</p>;

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold text-slate-900">
        Upload Payment Proof
      </h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Upload transfer receipt
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
        />

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {files.map((file, i) => (
              <Image
                key={i}
                src={URL.createObjectURL(file)}
                alt="preview"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full rounded-full"
        onClick={handleUpload}
        disabled={isProcessing || files.length === 0}
      >
        {isProcessing ? "Uploading..." : "Submit Proof"}
      </Button>

      <Button
        className="w-full rounded-full"
        variant="outline"
        onClick={handleCancel}
      >
        Cancel Transaction
      </Button>
    </div>
  );
}
