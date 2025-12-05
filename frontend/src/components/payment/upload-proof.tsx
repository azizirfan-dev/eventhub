// src/components/payment/upload-proof.tsx
"use client";

import { useState, DragEvent, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useUploadProof } from "@/hooks/useUploadProof";
import type { PaymentProof, TransactionStatus } from "@/hooks/useTransaction";

interface UploadProofProps {
  transactionId: string;
  status: TransactionStatus;
  existingProofs: PaymentProof[];
  onUploaded: () => void;
}

export function UploadProofSection({
  transactionId,
  status,
  existingProofs,
  onUploaded,
}: UploadProofProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const uploadMutation = useUploadProof();

  const disabled =
    status !== "WAITING_PAYMENT" || uploadMutation.isPending;

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;
    const selected = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || disabled) return;

    uploadMutation.mutate(
      {
        transactionId,
        files,
      },
      {
        onSuccess: () => {
          setFiles([]);
          onUploaded();
          alert("Payment proof uploaded. Waiting for verification.");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            "Failed to upload proof. Please try again.";
          alert(msg);
        },
      }
    );
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Payment proof
          </h3>
          <p className="text-xs text-slate-500">
            Upload transfer receipt. You can upload multiple images.
          </p>
        </div>
        {status !== "WAITING_PAYMENT" && (
          <span className="text-[11px] font-medium text-slate-400">
            Upload disabled (status: {status})
          </span>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center text-xs transition ${
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
              : isDragging
              ? "border-indigo-400 bg-indigo-50/40 text-indigo-700"
              : "cursor-pointer border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"
          }`}
          onClick={() => {
            if (disabled) return;
            const input = document.getElementById(
              "proof-file-input"
            ) as HTMLInputElement | null;
            input?.click();
          }}
        >
          <input
            id="proof-file-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <p className="mb-1 font-medium">
            Drag & drop images here, or click to browse
          </p>
          <p className="text-[11px] text-slate-500">
            JPG, PNG. Max ~5MB each is recommended.
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              New files to upload ({files.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px]"
                >
                  <span className="line-clamp-2 break-all">
                    {f.name}
                  </span>
                  <span className="mt-1 text-[10px] text-slate-500">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {existingProofs.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              Uploaded proofs
            </p>
            <div className="grid grid-cols-3 gap-2">
              {existingProofs.map((p, idx) => (
                <div
                  key={p.id ?? idx}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt="Payment proof"
                    className="h-24 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              disabled || files.length === 0 || uploadMutation.isPending
            }
            className="rounded-full bg-linear-to-r from-indigo-600 to-sky-500 text-xs font-semibold text-white"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload proof"}
          </Button>
        </div>
      </form>
    </section>
  );
}
