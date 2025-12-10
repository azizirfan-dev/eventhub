"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/components/profile/sections/change-password-dialog";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { uploadImage, isUploading } = useCloudinaryUpload();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl || "",
      });
    }
  }, [profile]);

  const fileInputId = "avatarInput";

  const handleAvatarUpload = async (file: File) => {
    const url = await uploadImage(file);
    if (!url) return alert("Upload failed!");

    updateProfile.mutate(
      { ...form, avatarUrl: url },
      {
        onSuccess: (res) => {
          setAuth({
            token: useAuthStore.getState().token!,
            user: {
              ...user!,
              avatarUrl: url,
              name: res.data.name,
              email: res.data.email,
            },
          });

          setForm({ ...form, avatarUrl: url });
          alert("Profile photo updated ✨");
        },
      }
    );
  };

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: (res) => {
        setAuth({
          token: useAuthStore.getState().token!,
          user: {
            ...user!,
            name: res.data.name,
            email: res.data.email,
            avatarUrl: form.avatarUrl,
          },
        });
        setIsEditing(false);
        alert("Profile updated ✨");
      },
    });
  };

  if (isLoading) return <p className="text-center p-10">Loading...</p>;
  if (!user) return <p className="text-center p-10">Not logged in</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>

      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={form.avatarUrl || "/placeholder-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border shadow-sm"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() =>
              document.getElementById(fileInputId)?.click()
            }
          >
            {isUploading ? "Uploading..." : "Change Photo"}
          </Button>

          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="text-xs text-slate-500">Full Name</label>
            {isEditing ? (
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{form.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-slate-500">Email</label>
            {isEditing ? (
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{form.email}</p>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm({
                      name: user.name,
                      email: user.email,
                      avatarUrl: user.avatarUrl ?? "",
                    });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordDialog />

      {user.role === "ORGANIZER" ? (
        <div className="p-4 border rounded-xl bg-white">
          <p className="text-xs text-slate-500">Organizer Rating</p>
          <p className="text-lg font-bold">
            {profile?.rating ?? 0} ⭐
          </p>
        </div>
      ) : (
        <div className="p-4 border rounded-xl bg-white">
          <p className="text-xs text-slate-500">Points</p>
          <p className="text-lg font-bold">
            {profile?.points ?? 0} pts
          </p>
        </div>
      )}
    </div>
  );
}
