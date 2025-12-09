// src/components/home/event-card.tsx
import { DiscoverEvent } from "@/hooks/useDiscoverEvents";
import { format } from "date-fns";
import Link from "next/link";

interface EventCardProps {
  event: DiscoverEvent;
}

function formatDateRange(startDate: string, endDate: string) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const sameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    if (sameDay) {
      // 2 argumen saja
      return format(start, "EEEE, d MMM yyyy");
    }

    return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
  } catch {
    return "";
  }
}

export function EventCard({ event }: EventCardProps) {
  const hasBanner = !!event.bannerUrl;
  const rating = event.organizerProfile?.rating ?? null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-slate-200">
        {hasBanner ? (
          // nanti bisa diganti <Image> Next
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.bannerUrl!}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-tr from-indigo-600 via-sky-500 to-indigo-400 text-xs font-semibold text-white">
            EventHub
          </div>
        )}

        {rating !== null && (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-amber-300 backdrop-blur">
            ★ {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {event.title}
        </h3>

        <p className="line-clamp-1 text-xs text-slate-500">
          {event.location || "Location TBA"}
        </p>

        <p className="text-xs font-medium text-slate-700">
          {formatDateRange(event.startDate, event.endDate)}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs">
          <div className="flex flex-col">
            {event.isPaid ? (
              <>
                <span className="text-slate-500">Mulai dari</span>
                <span className="text-sm font-semibold text-indigo-600">
                  Rp{event.price.toLocaleString("id-ID")}
                </span>
              </>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                FREE EVENT
              </span>
            )}
          </div>
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            View details
          </Link>

        </div>
      </div>
    </article>
  );
}
