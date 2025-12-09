"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useLocations } from "@/hooks/useLocations";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { api } from "@/lib/api";

const CATEGORIES = [
  "Music",
  "Education",
  "Sports",
  "Technology",
  "Art",
  "Business",
];

interface TicketType {
  name: string;
  price: number;
  stock: number;
}

export default function EventCreateClient() {
  const router = useRouter();
  const { uploadImage } = useCloudinaryUpload();
  const { data: locationsRaw } = useLocations();

  const locations =
    (locationsRaw as { location: string }[] | undefined) ?? [];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [tickets, setTickets] = useState<TicketType[]>([
    { name: "General", price: 0, stock: 100 },
  ]);

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addTicket = () =>
    setTickets((prev) => [
      ...prev,
      { name: "", price: isPaid ? price : 0, stock: 1 },
    ]);

  const removeTicket = (index: number) =>
    setTickets((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    );

  const updateTicket = (index: number, key: keyof TicketType, value: any) => {
    setTickets((prev) =>
      prev.map((t, i) => {
        if (i !== index) return t;
        return {
          ...t,
          [key]: key === "price" || key === "stock" ? Number(value) : value,
        };
      })
    );
  };

  const handleBannerChange = (file: File | null) => {
    setBanner(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    try {
      if (!title || !category || !location || !startDate || !endDate) {
        alert("Please fill all required fields");
        return;
      }

      setIsSaving(true);

      let bannerUrl: string | null = null;
      if (banner) {
        bannerUrl = await uploadImage(banner);
        if (!bannerUrl) throw new Error("Banner upload failed");
      }

      const payload = {
        title,
        description,
        category,
        location,
        startDate,
        endDate,
        isPaid,
        price,
        totalSeats: tickets.reduce((acc, t) => acc + Number(t.stock), 0),
        bannerUrl, // 👈 FIX
      };

      const res = await api.post("/events", payload);
      const eventId = res.data?.data?.id;

      if (!eventId) throw new Error("Event ID missing");

      alert("Event created successfully!");
      router.push(`/dashboard/events`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Create Event</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Banner Upload */}
      <div className="space-y-2">
        <Label>Event Banner</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleBannerChange(e.target.files?.[0] ?? null)}
        />
        {bannerPreview && (
          <img
            src={bannerPreview}
            alt="banner preview"
            className="mt-2 h-32 w-full rounded-lg border object-cover"
          />
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Select location</option>
          {locations.map((l) => (
            <option key={l.location} value={l.location}>
              {l.location}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Paid Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label>Paid Event?</Label>
        <Switch
          checked={isPaid}
          onCheckedChange={(v) => {
            setIsPaid(v);
            if (!v) setPrice(0);
          }}
        />
      </div>

      {/* Base Price */}
      {isPaid && (
        <div className="space-y-2">
          <Label>Base Price (IDR)</Label>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </div>
      )}

      {/* Tickets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Ticket Types</Label>
          <Button size="sm" variant="outline" onClick={addTicket}>
            + Add
          </Button>
        </div>

        {tickets.map((t, i) => (
          <div key={i} className="grid gap-3 rounded-lg border p-3 md:grid-cols-3">
            <Input
              placeholder="Name"
              value={t.name}
              onChange={(e) => updateTicket(i, "name", e.target.value)}
            />
            <Input
              type="number"
              min={0}
              placeholder="Price"
              disabled={!isPaid}
              value={t.price}
              onChange={(e) => updateTicket(i, "price", e.target.value)}
            />
            <Input
              type="number"
              min={1}
              placeholder="Stock"
              value={t.stock}
              onChange={(e) => updateTicket(i, "stock", e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="md:col-span-3"
              onClick={() => removeTicket(i)}
              disabled={tickets.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          rows={4}
          placeholder="Describe your event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button
          className="w-full rounded-full"
          disabled={isSaving}
          onClick={handleSubmit}
        >
          {isSaving ? "Saving..." : "Save Event"}
        </Button>
      </div>
    </div>
  );
}
