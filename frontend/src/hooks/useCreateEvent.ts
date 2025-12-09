"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  isPaid: boolean;
  totalSeats: number;
  bannerFile?: File | null;
}

interface CreatedEvent {
  id: string;
  title: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

async function createEventRequest(
  input: CreateEventPayload
): Promise<CreatedEvent> {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("category", input.category);
  formData.append("location", input.location);
  formData.append("startDate", input.startDate);
  formData.append("endDate", input.endDate);
  formData.append("price", String(input.price));
  formData.append("isPaid", String(input.isPaid));
  formData.append("totalSeats", String(input.totalSeats));

  if (input.bannerFile) {
    formData.append("banner", input.bannerFile);
  }

  const res = await api.post<ApiResponse<CreatedEvent>>(
    "/events",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
}
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventRequest,
    onSuccess: () => {
      // refresh list dashboard events
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
  });
}
