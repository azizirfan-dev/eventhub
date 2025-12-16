// src/components/profile/sections/profile-referral-card.tsx
"use client";

import { useAuthStore } from "@/store/auth";

export default function ProfileReferralCard() {
  const user = useAuthStore((s) => s.user); 

  if (!user) return null;

  const copyCode = async () => {
    if (!user.referralCode) return;
    await navigator.clipboard.writeText(user.referralCode);
    alert("Copied!");
  };

  return (
    <div className="p-4 bg-white rounded-xl border space-y-2">
      <h2 className="text-sm font-semibold text-slate-800">Referral Code</h2>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-indigo-600">
          {user.referralCode ?? "-"}
        </span>

        <button
          onClick={copyCode}
          className="text-[11px] px-2 py-1 border rounded-full hover:bg-slate-100"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
