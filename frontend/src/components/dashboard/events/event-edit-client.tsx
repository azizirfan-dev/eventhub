"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { api } from "@/lib/api";

interface Props {
  event: any;
}

const CATEGORIES = [
  "Music",
  "Education",
  "Sports",
  "Technology",
  "Art",
  "Business",
];

export default function EventEditClient({ event }: Props) {
  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState(event.category || "");
  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.description || "");
  const [startDate, setStartDate] = useState(event.startDate?.slice(0, 16));
  const [endDate, setEndDate] = useState(event.endDate?.slice(0, 16));
  const [isPaid, setIsPaid] = useState(event.isPaid);
  const [price, setPrice] = useState(event.price);

  const [bannerPreview, setBannerPreview] = useState(event.bannerUrl || null);
  const [banner, setBanner] = useState<File | null>(null);

  const { uploadImage, isUploading } = useCloudinaryUpload();
  const [isSaving, setIsSaving] = useState(false);

  const handleBannerChange = (file: File | null) => {
    setBanner(file);
    if (!file) return setBannerPreview(event.bannerUrl);

    setBannerPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);

      let bannerUrl = event.bannerUrl;
      if (banner) {
        const uploaded = await uploadImage(banner);
        if (uploaded) bannerUrl = uploaded;
      }

      await api.put(`/events/${event.id}`, {
        title,
        category,
        location,
        description,
        startDate,
        endDate,
        isPaid,
        price: isPaid ? price : 0,
        bannerUrl,
      });

      alert("Event updated!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Edit Event</h1>

      {/* Banner Upload */}
      <div className="space-y-2">
        <Label>Banner</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleBannerChange(e.target.files?.[0] ?? null)}
        />
        {bannerPreview && (
          <img
            src={bannerPreview}
            alt="Preview"
            className="h-40 w-full rounded-lg border object-cover mt-2"
          />
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* Paid */}
      <div className="flex items-center justify-between border p-3 rounded-lg">
        <Label>Paid Event?</Label>
        <Switch
          checked={isPaid}
          onCheckedChange={(v) => {
            setIsPaid(v);
            if (!v) setPrice(0);
          }}
        />
      </div>

      {/* Price */}
      {isPaid && (
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
      )}

      {/* TICKETS — Edit + Delete Only */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">Tickets</h2>

        {event.ticketTypes.map((t: any, i: number) => (
          <div
            key={t.id}
            className="grid gap-3 rounded-lg border p-3 md:grid-cols-4"
          >
            <div className="col-span-4 text-sm font-medium text-slate-800">
              {t.name}
            </div>

            <Input
              type="number"
              value={t.price}
              disabled={!isPaid}
              onChange={(e) => (event.ticketTypes[i].price = Number(e.target.value))}
              className="md:col-span-2"
            />

            <Input
              type="number"
              value={t.stock}
              onChange={(e) => (event.ticketTypes[i].stock = Number(e.target.value))}
            />

            <Button
              type="button"
              size="sm"
              className="md:col-span-1"
              onClick={async () => {
                await api.put(`/events/tickets/${t.id}`, {
                  name: t.name,
                  price: isPaid ? t.price : 0,
                  stock: t.stock,
                });
                alert("Ticket updated!");
                location.reload();
              }}
            >
              Save Ticket
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="md:col-span-1"
              onClick={async () => {
                if (!confirm("Delete this ticket?")) return;
                await api.delete(`/events/tickets/${t.id}`);
                alert("Ticket deleted");
                location.reload();
              }}
            >
              Delete
            </Button>

          </div>
        ))}
      </div>

      {/* Action */}
      <div className="pt-4">
        <Button
          className="w-full rounded-full"
          disabled={isSaving || isUploading}
          onClick={handleUpdate}
        >
          {isSaving || isUploading ? "Saving..." : "Save Changes"}
        </Button>
      </div>


    </div>
  );
}
