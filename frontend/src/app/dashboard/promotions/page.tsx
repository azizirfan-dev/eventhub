"use client";

import { useState } from "react";
import { useMyPromos, Promo } from "@/hooks/usePromos";
import { CreatePromoDialog } from "@/components/promotions/promo-dialog";
import { EditPromoDialog } from "@/components/promotions/edit-promo-dialog";
import { PromoCard } from "@/components/promotions/promo-card";

export default function PromotionsPage() {
  const { data = [], isLoading } = useMyPromos();
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);

  if (isLoading) return <p className="p-6 text-center">Loading promotions...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Promotions</h1>
        <CreatePromoDialog />
      </div>

      {data.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-10">
          No promos yet 👀
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onEdit={(p) => setEditingPromo(p)}
            />
          ))}
        </div>
      )}

      {editingPromo && (
        <EditPromoDialog
          promo={editingPromo}
          onClose={() => setEditingPromo(null)}
        />
      )}
    </div>
  );
}
