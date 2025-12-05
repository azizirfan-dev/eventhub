"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthGuard from "@/components/auth-guard";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    totalSeats: "",
    price: "",
    isPaid: true,
  });

  async function fetchEvent() {
    try {
      const res = await api.get(`/events/${id}`);
      const data = res.data.data;

      setForm({
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        startDate: data.startDate.slice(0, 16),
        endDate: data.endDate.slice(0, 16),
        totalSeats: data.totalSeats.toString(),
        price: data.price.toString(),
        isPaid: data.isPaid,
      });
    } catch (error) {
      console.error("Failed fetching event", error);
    }
  }

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  try {
    await api.put(`/events/${id}`, {
      ...form,
      totalSeats: Number(form.totalSeats),
      price: Number(form.price),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    });

    alert("Event updated!");
    router.push("/organizer/events");
  } catch (err) {
    console.error(err);
    alert("Failed to update event");
  }
}


  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen px-6 py-10">
        <h1 className="text-3xl font-bold text-turquoise mb-6">
          Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-lg space-y-4 border border-zinc-700 max-w-xl">
          
          <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />
          
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />

          <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />

          <input name="location" value={form.location} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />

          <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />
          
          <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />

          <input type="number" name="totalSeats" value={form.totalSeats} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />

          <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full p-2 bg-zinc-800 text-white rounded" />

          <label className="text-white flex gap-2 items-center">
            <input type="checkbox" name="isPaid" checked={form.isPaid} onChange={handleChange} />
            Paid Event?
          </label>

          <button type="submit" className="bg-turquoise px-4 py-2 rounded w-full text-black font-bold">
            Save Changes
          </button>
        </form>
      </main>
    </AuthGuard>
  );
}
