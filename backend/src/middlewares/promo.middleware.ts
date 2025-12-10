import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export const promoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { promoCode, items } = req.body as {
      promoCode?: string;
      items?: { ticketTypeId: string; quantity: number }[];
    };

    // Kalau gak ada promo, lanjut aja
    if (!promoCode) return next();

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError("Items required to apply promo", 400);
    }

    const promo = await prisma.promo.findFirst({
      where: { code: promoCode, deletedAt: null },
    });

    if (!promo) throw new AppError("Promo not found", 404);

    const now = new Date();
    if (promo.startDate > now || promo.endDate < now) {
      throw new AppError("Promo expired", 400);
    }

    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      throw new AppError("Promo usage limit reached", 400);
    }

    // ✅ VALIDASI EVENT (PASTIKAN PROMO MATCH EVENT)
    if (!promo.isGlobal) {
      // Ambil ticket pertama, cek eventId-nya
      const firstItem = items[0];
      const ticket = await prisma.ticketType.findUnique({
        where: { id: firstItem.ticketTypeId },
        select: { eventId: true },
      });

      if (!ticket) throw new AppError("Ticket type not found", 404);
      if (!promo.eventId || promo.eventId !== ticket.eventId) {
        throw new AppError("Promo not valid for this event", 400);
      }
    }

    // Simpan promo ke request (tanpa finalPrice biar TS gak marah)
    (req as any).promo = promo;

    next();
  } catch (err) {
    next(err);
  }
};
