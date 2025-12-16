"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Promo, useCreatePromo, useUpdatePromo } from "@/hooks/usePromos";

export interface PromoFormProps {
  promo?: Promo;
  onSuccess?: () => void;
}

export function PromoForm({ promo, onSuccess }: PromoFormProps) {
  const isEdit = !!promo;

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
  useEffect(() => {
    if (promo) {
      setForm({
        code: promo.code,
        discount: promo.discount,
        isPercent: promo.isPercent,
        isGlobal: promo.isGlobal,
        eventId: promo.eventId ?? "",
        usageLimit: promo.usageLimit ?? 1,
        startDate: promo.startDate.slice(0, 10),
        endDate: promo.endDate.slice(0, 10),
        description: promo.description ?? "",
      });
    }
  }, [promo]);

  const createPromo = useCreatePromo();
  const updatePromo = useUpdatePromo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && promo) {
      updatePromo.mutate(
        { id: promo.id, data: form },
        { onSuccess }
      );
    } else {
      createPromo.mutate(form, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        placeholder="Promo Code"
        value={form.code}
        onChange={(e) =>
          setForm({ ...form, code: e.target.value.toUpperCase() })
        }
      />

      <Input
        type="number"
        placeholder="Discount"
        value={form.discount}
        onChange={(e) =>
          setForm({ ...form, discount: Number(e.target.value) })
        }
      />

      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

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

      <Button
        type="submit"
        disabled={createPromo.isPending || updatePromo.isPending}
      >
        {isEdit ? "Update Promo" : "Create Promo"}
      </Button>
    </form>
  );
}
