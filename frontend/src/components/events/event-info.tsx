// src/components/events/event-info.tsx
import { EventDetail } from "@/hooks/useEventDetail";
import { format } from "date-fns";

interface EventInfoProps {
  event: EventDetail;
}

function formatDateTimeRange(start: string, end: string) {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const sameDay =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();

    if (sameDay) {
      return format(startDate, "EEEE, d MMM yyyy • HH:mm");
    }

    return `${format(startDate, "d MMM yyyy • HH:mm")} - ${format(
      endDate,
      "d MMM yyyy • HH:mm"
    )}`;
  } catch {
    return "";
  }
}

export function EventInfo({ event }: EventInfoProps) {
  const occupied = event.totalSeats - event.availableSeats;
  const progress =
    event.totalSeats > 0
      ? Math.min(100, Math.round((occupied / event.totalSeats) * 100))
      : 0;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">About this event</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {event.description || "No description provided."}
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Date & Time
          </p>
          <p className="mt-1 text-slate-800">
            {formatDateTimeRange(event.startDate, event.endDate)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="mt-1 text-slate-800">
            {event.location || "Location will be announced"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Seats
          </p>
          <p className="mt-1 text-slate-800">
            {event.availableSeats} of {event.totalSeats} available
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-600 to-sky-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {event.organizerProfile && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Organizer rating
            </p>
            <p className="mt-1 text-slate-800">
              {event.organizerProfile.rating
                ? `★ ${event.organizerProfile.rating.toFixed(1)}`
                : "No rating yet"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
