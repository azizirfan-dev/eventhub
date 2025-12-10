"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePromo } from "@/hooks/usePromos";
import { useMyEvents } from "@/hooks/useMyEvents";

export function CreatePromoDialog() {
  const [open, setOpen] = useState(false);
  const create = useCreatePromo();

  // ⚠️ FIX DI SINI: selalu pakai Array.isArray
  const { data: eventsData, isLoading: loadingEvents } = useMyEvents();
  const events = Array.isArray(eventsData) ? eventsData : [];

  const [form, setForm] = useState({
    code: "",
    discount: 0,
    isPercent: false,
    isGlobal: true,
    eventId: "",
    usageLimit: 1,
    startDate: "",
    endDate: "",
    description: "",
  });

  const resetForm = () =>
    setForm({
      code: "",
      discount: 0,
      isPercent: false,
      isGlobal: true,
      eventId: "",
      usageLimit: 1,
      startDate: "",
      endDate: "",
      description: "",
    });

  const handleSubmit = () => {
    if (!form.isGlobal && !form.eventId) {
      return alert("Select an event for non-global promo");
    }
    if (!form.startDate || !form.endDate) {
      return alert("Start / end date required!");
    }

    create.mutate(form, {
      onSuccess: () => {
        resetForm();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Promo</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Promo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Code */}
          <Input
            placeholder="Promo Code"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />

          {/* Discount + Percent toggle */}
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              placeholder="Discount"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: Number(e.target.value) })
              }
            />
            <Label className="flex items-center gap-2 text-xs">
              Percent?
              <Switch
                checked={form.isPercent}
                onCheckedChange={(v) =>
                  setForm({ ...form, isPercent: v })
                }
              />
            </Label>
          </div>

          {/* Global / Event toggle */}
          <div className="flex justify-between items-center text-xs">
            <Label>Global Promo?</Label>
            <Switch
              checked={form.isGlobal}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  isGlobal: checked,
                  eventId: checked ? "" : prev.eventId,
                }))
              }
            />
          </div>

          {/* Event select (only if not global) */}
          {!form.isGlobal && (
            <select
              className="border rounded p-2 text-sm w-full"
              disabled={loadingEvents}
              value={form.eventId}
              onChange={(e) =>
                setForm({ ...form, eventId: e.target.value })
              }
            >
              <option value="">Select Event</option>
              {events.map((ev: any) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          )}

          {/* Date range */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
            />
          </div>

          {/* Usage limit */}
          <Input
            type="number"
            placeholder="Usage Limit"
            value={form.usageLimit}
            onChange={(e) =>
              setForm({ ...form, usageLimit: Number(e.target.value) })
            }
          />

          {/* Description */}
          <Textarea
            placeholder="Optional description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={create.isPending}
          >
            {create.isPending ? "Creating..." : "Create Promo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
