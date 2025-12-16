// src/components/profile/sections/profile-avatar-card.tsx
"use client";

import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ProfileAvatarCard() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  if (!user || !token) return null;

  const uploadAvatar = async () => {
    if (!file) return;
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("avatar", file);

      const res = await api.patch("/users/me/avatar", fd);

      const updatedUser = res.data.data;

      setAuth({ token, user: updatedUser });

      alert("Avatar updated!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl border">
      <h2 className="text-sm font-semibold mb-3 text-slate-800">
        Profile Picture
      </h2>

      <div className="flex items-center gap-4">
        <img
          src={user.avatarUrl ?? "/default-avatar.png"}
          alt="Profile avatar"
          className="h-16 w-16 rounded-full border object-cover"
        />

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            disabled={loading || !file}
            onClick={uploadAvatar}
            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
