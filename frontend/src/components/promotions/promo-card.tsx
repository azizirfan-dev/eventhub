"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Promo, useDeletePromo } from "@/hooks/usePromos";

interface PromoCardProps {
  promo: Promo;
  onEdit: (promo: Promo) => void;
}

export function PromoCard({ promo, onEdit }: PromoCardProps) {
  const deleteMut = useDeletePromo();

  const handleDelete = () => {
    if (!confirm("Delete this promo?")) return;
    deleteMut.mutate(promo.id);
  };

  return (
    <div className="border rounded-lg bg-white p-4 shadow-sm flex justify-between items-center">
      <div>
        <p className="font-medium">{promo.code}</p>
        <p className="text-xs text-slate-500">
          {promo.isPercent
            ? `${promo.discount}%`
            : `Rp ${promo.discount.toLocaleString("id-ID")}`}
        </p>
        <p className="text-[10px] text-slate-400">
          {promo.startDate.slice(0, 10)} → {promo.endDate.slice(0, 10)}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(promo)}
        >
          Edit
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMut.isPending}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
