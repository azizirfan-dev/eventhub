// src/hooks/useUploadProof.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TransactionDetail } from "./useTransaction";

export interface UploadProofPayload {
  transactionId: string;
  files: File[];
}

interface UploadProofApiResponse {
  status: string;
  message: string;
  data: TransactionDetail;
}

async function uploadProofRequest(
  payload: UploadProofPayload
): Promise<TransactionDetail> {
  const formData = new FormData();

  payload.files.forEach((file) => {
    formData.append("images", file); 
  });

  const res = await api.post<UploadProofApiResponse>(
    `/transactions/${payload.transactionId}/upload-proof`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
}

export function useUploadProof() {
  return useMutation<TransactionDetail, unknown, UploadProofPayload>({
    mutationFn: uploadProofRequest,
  });
}
