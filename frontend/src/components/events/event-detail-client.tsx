"use client";

import { EventBanner } from "./event-banner";
import { EventInfo } from "./event-info";
import { TicketSelector } from "./ticket-selector";

interface EventDetailClientProps {
  event: any; // nanti kita strong-typing setelah jalan
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-6">
      {/* Banner */}
      <EventBanner event={event} />

      {/* Info */}
      <EventInfo event={event} />

      {/* Ticket Selector */}
      <TicketSelector tickets={event.ticketTypes || []} eventId={event.id} />
    </div>
  );
}
