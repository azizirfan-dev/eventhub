"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/auth";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function OrganizerDashboardClient() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: async () => {
      const res = await api.get("/dashboard/statistics");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // cache 5 menit
    refetchOnWindowFocus: false,
  });

  if (isError)
    return (
      <p className="text-center p-10 text-red-500">
        Failed loading statistics. Please try again.
      </p>
    );

  if (isLoading || !data)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-xl" />
        ))}
      </div>
    );
    
  const role = useAuthStore.getState().user?.role;
  if (role !== "ORGANIZER") redirect("/dashboard/profile");

  const labels = data.salesTrend?.map((d: any) => d.date) || [];
  const revenues = data.salesTrend?.map((d: any) =>
    Number(d.revenue) // prevent BigInt crash
  ) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenues,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Events" value={data.totalEvents} />
        <SummaryCard
          title="Revenue"
          value={`Rp ${Number(data.totalRevenue).toLocaleString("id-ID")}`}
        />
        <SummaryCard title="Attendees" value={data.totalAttendees} />
        <SummaryCard
          title="Rating"
          value={`${data.avgRating ?? 0} ⭐`}
        />
      </div>

      {/* Top Events */}
      <div className="rounded-xl border p-6 bg-white shadow">
        <h2 className="font-semibold text-sm mb-3">Top Events</h2>
        <div className="divide-y text-sm">
          {data.topEvents?.map((ev: any) => (
            <div key={ev.eventId} className="flex justify-between py-2">
              <span>{ev.title}</span>
              <span className="font-medium">{ev.ticketsSold} sold</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border p-6 bg-white shadow">
        <h2 className="font-semibold text-sm mb-3">Sales (30 Days)</h2>
        {labels.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-sm text-slate-500">No sales recorded</p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow text-center space-y-1">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="font-bold text-slate-900 text-lg">{value}</p>
    </div>
  );
}
