"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export interface OrganizerEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  bannerUrl: string | null;
  isPaid: boolean;
  price: number;
  status: string;
}

async function fetchOrganizerEvents(): Promise<OrganizerEvent[]> {
  const token = useAuthStore.getState().token;
  const res = await api.get("/organizers/events", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

export function useOrganizerEvents() {
  return useQuery({
    queryKey: ["organizer-events"],
    queryFn: fetchOrganizerEvents,
  });
}
