// src/app/events/[id]/page.tsx
import { api } from "@/lib/api";
import EventDetailClient from "@/components/events/event-detail-client";

interface EventDetailApiResponse {
  status: string;
  message: string;
  data: any;
}

async function getEvent(eventId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/events/${eventId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params; // <== FIX params Promise

  const event = await getEvent(id);

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Event not found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          The event you're looking for may be unavailable.
        </p>
      </div>
    );
  }

  return <EventDetailClient event={event} />;
}
