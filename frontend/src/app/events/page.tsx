"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";
import { EventCard } from "@/components/event-card";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/events");
        setEvents(res.data.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);

  return (
    <AuthGuard roles={["CUSTOMER", "ORGANIZER"]}>
      <main className="min-h-screen px-6 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-turquoise">Discover Events</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
