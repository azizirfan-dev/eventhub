// src/components/profile/sections/profile-coupons-card.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function ProfileCouponsCard() {
  const { data } = useQuery({
    queryKey: ["my-coupons"],
    queryFn: async () => {
      const res = await api.get("/promos/me");
      return res.data.data ?? [];
    },
  });

  const coupons = data ?? [];

  return (
    <div className="p-4 bg-white rounded-xl border space-y-3">
      <h2 className="text-sm font-semibold text-slate-800">My Coupons</h2>
      {coupons.length === 0 && (
        <p className="text-[11px] text-slate-400">No coupons available</p>
      )}
      {coupons.map((c: any) => (
        <div key={c.id} className="text-xs flex justify-between">
          <span>{c.code}</span>
          <span className="text-slate-500">
            Exp: {new Date(c.endDate).toLocaleDateString("id-ID")}
          </span>
        </div>
      ))}
    </div>
  );
}
