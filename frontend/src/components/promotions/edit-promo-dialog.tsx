"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdatePromo } from "@/hooks/usePromos";
import { useMyEvents } from "@/hooks/useMyEvents";

export function EditPromoDialog({ promo, onClose }: { promo: any; onClose: () => void }) {
  const updatePromo = useUpdatePromo();
  const { data: events = [] } = useMyEvents();

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

  // Load initial data
  useEffect(() => {
    if (promo) {
      setForm({
        code: promo.code,
        discount: promo.discount,
        isPercent: promo.isPercent,
        isGlobal: promo.isGlobal ?? true,
        eventId: promo.eventId ?? "",
        usageLimit: promo.usageLimit ?? 1,
        startDate: promo.startDate?.slice(0, 10) ?? "",
        endDate: promo.endDate?.slice(0, 10) ?? "",
        description: promo.description ?? "",
      });
    }
  }, [promo]);

  const handleSubmit = () => {
    updatePromo.mutate(
      { id: promo.id, data: form },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={!!promo} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />

          <div className="flex gap-3 items-center">
            <Input
              type="number"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: Number(e.target.value) })
              }
            />
            <Label className="flex items-center gap-2 text-xs">
              Percent?
              <Switch
                checked={form.isPercent}
                onCheckedChange={(v) => setForm({ ...form, isPercent: v })}
              />
            </Label>
          </div>

          <div className="flex justify-between items-center text-xs">
            <Label>Global Promo?</Label>
            <Switch
              checked={form.isGlobal}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  isGlobal: checked,
                  eventId: checked ? "" : form.eventId,
                })
              }
            />
          </div>

          {!form.isGlobal && (
            <select
              className="border rounded p-2 text-sm w-full"
              value={form.eventId}
              onChange={(e) =>
                setForm({ ...form, eventId: e.target.value })
              }
            >
              <option value="">Choose Event</option>
              {events.map((ev: any) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          )}

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

          <Input
            type="number"
            value={form.usageLimit}
            onChange={(e) =>
              setForm({ ...form, usageLimit: Number(e.target.value) })
            }
          />

          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <DialogFooter>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={updatePromo.isPending}
            >
              {updatePromo.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
