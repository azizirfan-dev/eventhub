"use client";

import { format } from "date-fns";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";



export default function EventDetailClient({ event }: { event: any }) {
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Banner */}
      {event.bannerUrl ? (
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="h-64 w-full rounded-xl object-cover shadow"
        />
      ) : (
        <div className="flex h-64 w-full items-center justify-center rounded-xl bg-slate-200 text-slate-500">
          No Banner
        </div>
      )}

      {/* Title + Organizer */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
        <p className="text-sm text-slate-600">
          {event.location} •{" "}
          {format(new Date(event.startDate), "d MMM yyyy")}
        </p>

        {event.organizer?.name && (
          <p className="text-xs text-slate-500">
            Organized by: <span className="font-medium">{event.organizer.name}</span>
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        {event.isPaid ? (
          <p className="text-lg font-bold text-indigo-600">
            Rp {event.price.toLocaleString("id-ID")}
          </p>
        ) : (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            FREE EVENT
          </span>
        )}
      </div>

      {/* Description */}
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
        {event.description || "No description provided"}
      </div>

      {/* Ticket Types */}
      {event.ticketTypes?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Tickets</h2>

          <div className="grid gap-3">
            {event.ticketTypes.map((t: any) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-slate-500">Stock: {t.stock}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-indigo-600">
                    {event.isPaid ? `Rp${t.price.toLocaleString("id-ID")}` : "FREE"}
                  </p>
                  <button
                    className="mt-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
                    onClick={async () => {
                      try {
                        const token = useAuthStore.getState().token;
                        if (!token) {
                          alert("Please login first");
                          return;
                        }
                        const res = await api.post("/transactions", {
                          items: [
                            {
                              ticketTypeId: t.id,
                              quantity: 1,
                            },
                          ],
                        });
                        const trx = res.data.data;
                        if (!trx?.id) throw new Error("Transaction not created");

                        window.location.href = `/checkout/${trx.id}`;
                      } catch (err) {
                        console.error(err);
                        alert("Failed to create transaction");
                      }
                    }}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
