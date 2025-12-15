import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";
import { CreatePromoDTO } from "./promo.dto";

export class PromoService extends BaseService {

  async create(organizerId: string, data: CreatePromoDTO) {
    const { code, discount, isPercent, isGlobal, eventId, usageLimit, startDate, endDate, description } = data;

    const existing = await this.prisma.promo.findFirst({
      where: { code, deletedAt: null },
    });
    if (existing) {
      throw new AppError("Promo code already exists", 409);
    }

    if (!isGlobal && !eventId)
      throw new AppError("eventId required for non-global promo", 400);

    if (!isGlobal) {
      const event = await this.prisma.event.findFirst({
        where: { id: eventId, organizerId, deletedAt: null }
      });
      if (!event) throw new AppError("Event not found or not yours", 403);
    }

    return await this.prisma.promo.create({
      data: {
        code,
        discount,
        isPercent: isPercent ?? false,
        isGlobal: isGlobal ?? false,
        eventId: isGlobal ? null : eventId,
        organizerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: usageLimit ?? null,
        description,
      },
    });
  }
  async getMyPromos(organizerId: string) {
    return await this.prisma.promo.findMany({
      where: { organizerId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }
  async update(promoId: string, organizerId: string, data: Partial<CreatePromoDTO>) {
    const promo = await this.prisma.promo.findFirst({
      where: { id: promoId, organizerId, deletedAt: null }
    });

    if (!promo) throw new AppError("Promo not found or not yours", 404);

    return await this.prisma.promo.update({
      where: { id: promoId },
      data
    });
  }
  async softDelete(promoId: string, organizerId: string) {
    const promo = await this.prisma.promo.findFirst({
      where: { id: promoId, organizerId, deletedAt: null }
    });

    if (!promo) throw new AppError("Promo not found or not yours", 404);

    return await this.prisma.promo.update({
      where: { id: promoId },
      data: { deletedAt: new Date() }
    });
  }
}
