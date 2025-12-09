"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type TrxStatus =
    | "WAITING_ADMIN"
    | "DONE"
    | "REJECTED"
    | "CANCELED";

export function useOrganizerTransactions(status: TrxStatus) {
    return useQuery({
        queryKey: ["transactions", status],
        queryFn: async () => {
            const res = await api.get("/transactions/pending", {
                params: { status },
            });
            return res.data.data ?? [];
        },
        staleTime: 60_000, // 1 menit cached, langsung muncul tanpa loading
        refetchOnWindowFocus: false,
    });
}

export function useTransactionAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            type,
        }: {
            id: string;
            type: "approve" | "reject" | "cancel";
        }) => api.patch(`/transactions/${id}/${type}`),

        onSuccess: (_, variables) => {
            // invalidate status source list
            queryClient.invalidateQueries({
                queryKey: ["transactions", "WAITING_ADMIN"],
            });

            if (variables.type === "approve") {
                queryClient.invalidateQueries({
                    queryKey: ["transactions", "DONE"],
                });
            }

            alert(`Transaction ${variables.type}d successfully!`);
        },
    });
}
