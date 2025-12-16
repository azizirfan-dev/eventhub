// src/components/profile/sections/profile-info-card.tsx
"use client";

import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { api } from "@/lib/api";
import ChangePasswordDialog from "./change-password-dialog"; 

export default function ProfileInfoCard() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);

  if (!user || !token) return null;

  const updateProfile = async () => {
    try {
      setLoading(true);

      const res = await api.patch(
        "/users/me",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data.data;
      setAuth({ token, user: updatedUser });

      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl border space-y-4">
      <h2 className="text-sm font-semibold text-slate-800">Profile Info</h2>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Email</label>
        <input
          disabled
          value={user.email}
          className="w-full rounded-lg border px-3 py-2 text-sm bg-slate-100 text-slate-400"
        />
      </div>

      <button
        disabled={loading}
        onClick={updateProfile}
        className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
      >
        Save Changes
      </button>

      <ChangePasswordDialog />
    </div>
  );
}
