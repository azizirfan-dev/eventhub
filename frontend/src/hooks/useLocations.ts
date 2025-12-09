"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface LocationOption {
  location: string;
}

async function fetchLocations() {
  const res = await api.get("/events?limit=999");
  const events = res.data.data.events;

  const uniqueLocations = Array.from(
    new Set(events.map((e: any) => e.location).filter(Boolean))
  );

  return uniqueLocations.map((loc) => ({ location: loc }));
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 10, // 10 min caching
  });
}
