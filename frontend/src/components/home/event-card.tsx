import Link from "next/link";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    bannerUrl?: string | null;
    startDate: string;
    endDate: string;
    price: number;
    isPaid: boolean;
    organizer?: { name: string };
  };
}

function formatDateRange(start: string, end: string) {
  return `${format(new Date(start), "d MMM")} – ${format(
    new Date(end),
    "d MMM yyyy"
  )}`;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Banner */}
      <div className="relative aspect-video bg-slate-200">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {event.title}
        </h3>

        <p className="text-xs text-slate-500">
          {formatDateRange(event.startDate, event.endDate)}
        </p>

        <p className="text-sm font-semibold text-indigo-600">
          {event.isPaid
            ? `Rp${event.price.toLocaleString("id-ID")}`
            : "FREE"}
        </p>

        {event.organizer?.name && (
          <p className="pt-1 text-[11px] text-slate-400">
            by {event.organizer.name}
          </p>
        )}
      </div>
    </Link>
  );
}
