"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [banner, setBanner] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    totalSeats: 0,
    price: 0,
    isPaid: true,
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value as any));
    if (banner) formData.append("banner", banner);

    try {
      await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event created!");
      router.push("/organizer/events");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  }

  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen px-6 py-10">
        <h1 className="text-3xl font-bold text-turquoise mb-6">
          Create Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 p-6 rounded-lg space-y-4 border border-zinc-700 max-w-xl"
        >
          <input className="input" name="title" placeholder="Title" onChange={handleChange} />
          <textarea className="input" name="description" placeholder="Description" onChange={handleChange} />
          <input className="input" name="category" placeholder="Category" onChange={handleChange} />
          <input className="input" name="location" placeholder="Location" onChange={handleChange} />
          <input className="input" type="datetime-local" name="startDate" onChange={handleChange} />
          <input className="input" type="datetime-local" name="endDate" onChange={handleChange} />
          <input className="input" type="number" name="totalSeats" placeholder="Seats" onChange={handleChange} />
          <input className="input" type="number" name="price" placeholder="Price (Rp)" onChange={handleChange} />

          {/* OPTIONAL BANNER UPLOAD */}
          <div>
            <label className="text-white text-sm">Event Banner (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBanner(e.target.files?.[0] || null)}
              className="text-gray-200"
            />
            {banner && (
              <img
                src={URL.createObjectURL(banner)}
                className="w-full max-w-xs mt-2 rounded-lg border border-zinc-700"
              />
            )}
          </div>

          <button type="submit" className="bg-turquoise px-4 py-2 text-black rounded w-full">
            Create Event
          </button>
        </form>
      </main>
    </AuthGuard>
  );
}
