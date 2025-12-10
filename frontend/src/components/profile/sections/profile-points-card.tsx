// src/components/profile/sections/profile-points-card.tsx
"use client";

import { useAuthStore } from "@/store/auth";

export default function ProfilePointsCard() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="p-4 bg-white rounded-xl border">
      <h2 className="text-sm font-semibold text-slate-800 mb-2">Points</h2>
      <p className="text-lg font-bold text-indigo-600">
        {user.points?.toLocaleString("id-ID") ?? 0} pts
      </p>
      <p className="text-[11px] text-slate-500">Expires automatically after 3 months</p>
    </div>
  );
}
