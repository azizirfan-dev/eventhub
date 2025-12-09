// src/app/events/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EventDetailClient from "@/components/events/event-detail-client";

async function fetchEvent(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseUrl}/events/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Failed to fetch event:", err);
    return null;
  }
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchEvent(id).then((data) => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        Loading event...
      </div>
    );
  }

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
