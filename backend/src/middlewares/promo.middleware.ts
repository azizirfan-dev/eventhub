import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export const promoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promoCode, items } = req.body;

    if (!promoCode) return next();

    const promo = await prisma.promo.findFirst({
      where: { code: promoCode, deletedAt: null }
    });

    if (!promo) throw new AppError("Promo not found", 404);

    const now = new Date();
    if (promo.startDate > now || promo.endDate < now)
      throw new AppError("Promo expired", 400);

    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit)
      throw new AppError("Promo usage limit reached", 400);

    if (!promo.isGlobal) {
      const eventId = items[0]?.eventId;
      if (!eventId || eventId !== promo.eventId)
        throw new AppError("Promo not valid for this event", 400);
    }

    req.promo = promo;
    next();
  } catch (err) {
    next(err);
  }
};
