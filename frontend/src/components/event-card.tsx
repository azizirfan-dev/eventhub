"use client";

import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    location: string;
    startDate: string;
    price: number;
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-zinc-900 p-4 rounded-lg border border-zinc-700 hover:border-turquoise transition"
    >
      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
      <p className="text-gray-400 text-sm">{event.location}</p>
      <p className="text-gray-400 text-xs">
        {new Date(event.startDate).toLocaleDateString()}
      </p>

      <p className="mt-2 font-bold text-turquoise">
        {event.price > 0 ? `Rp ${event.price.toLocaleString()}` : "Free"}
      </p>
    </Link>
  );
}
