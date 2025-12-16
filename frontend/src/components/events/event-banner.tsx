// src/components/events/event-banner.tsx
import { EventDetail } from "@/hooks/useEventDetail";

interface EventBannerProps {
  event: EventDetail;
}

export function EventBanner({ event }: EventBannerProps) {
  const hasBanner = !!event.bannerUrl;

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="relative h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-80">
          {hasBanner ? (
            <img
              src={event.bannerUrl!}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-tr from-indigo-700 via-sky-500 to-indigo-400 text-sm font-semibold text-white">
              {event.title}
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10" />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full bg-indigo-600/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {event.category}
              </span>
              {event.avgRating > 0 && (
                <span className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-amber-300 backdrop-blur">
                  ★ {event.avgRating.toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="max-w-3xl text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              {event.title}
            </h1>
            <p className="text-sm text-slate-200">
              {event.location || "Location will be announced"}
            </p>
          </div>

          <div className="text-xs text-slate-200 sm:text-right">
            <p className="font-semibold text-slate-100">Organized by</p>
            <p>{event.organizer?.name}</p>
            <p className="text-slate-300">{event.organizer?.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
