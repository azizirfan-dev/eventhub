// src/app/profile/page.tsx
import ProfileClient from "@/components/profile/profile-client";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-bold mb-4 text-slate-900">My Profile</h1>
      <ProfileClient />
    </div>
  );
}
