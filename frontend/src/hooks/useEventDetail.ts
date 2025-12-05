// src/hooks/useEventDetail.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface EventTicketType {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface EventReviewUser {
  id: string;
  name: string;
}

export interface EventReview {
  id?: string;
  rating: number;
  comment?: string | null;
  user: EventReviewUser;
}

export interface EventOrganizer {
  id: string;
  name: string;
  email: string;
}

export interface EventOrganizerProfile {
  rating: number | null;
}

export interface EventDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  isPaid: boolean;
  bannerUrl?: string | null;
  organizer: EventOrganizer;
  organizerProfile?: EventOrganizerProfile | null;
  ticketTypes: EventTicketType[];
  reviews: EventReview[];
  avgRating: number;
}

interface EventDetailApiResponse {
  status: string;
  message: string;
  data: EventDetail;
}

async function fetchEventDetail(eventId: string): Promise<EventDetail> {
  const response = await api.get<EventDetailApiResponse>(`/events/${eventId}`);
  return response.data.data;
}

export function useEventDetail(eventId?: string) {
  return useQuery({
    queryKey: ["event-detail", eventId],
    queryFn: () => fetchEventDetail(eventId!),
    enabled: !!eventId,
  });
}
