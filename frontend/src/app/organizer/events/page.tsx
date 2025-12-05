"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  async function fetchEvents() {
    try {
      const res = await api.get("/events/me");
      setEvents(res.data.data);
    } catch (err) {
      console.error("Failed load events:", err);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen px-6 py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-turquoise">My Events</h1>

          <button
            className="bg-turquoise text-black px-4 py-2 rounded"
            onClick={() => (window.location.href = "/organizer/events/create")}
          >
            + Create Event
          </button>
        </div>

        {events.length === 0 && (
          <p className="text-gray-400">You haven't created any events.</p>
        )}

        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-zinc-900 p-5 rounded-lg border border-zinc-700 space-y-3"
            >
              <h2 className="text-white text-xl font-semibold">{ev.title}</h2>
              <p className="text-gray-400 text-sm">{ev.location}</p>

              <div className="flex gap-3">
                <button
                  className="px-3 py-1 bg-blue-600 rounded text-white"
                  onClick={() =>
                    (window.location.href = `/organizer/events/${ev.id}/edit`)
                  }
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-purple-600 rounded text-white"
                  onClick={() =>
                    (window.location.href = `/organizer/events/${ev.id}/tickets`)
                  }
                >
                  Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
