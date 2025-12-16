import { BaseService } from "../../core/base.service";
import { AppError } from "../../utils/app-error";
import { TransactionStatus } from "@prisma/client";
import { sendEmail } from "../../utils/email";
import { CreateTransactionDTO, UploadProofDTO } from "./transaction.dto";

export class TransactionService extends BaseService {
  async createTransaction(userId: string, data: CreateTransactionDTO) {
  const { items, promoCode, usePoints = 0 } = data;

  if (!items || !Array.isArray(items) || items.length === 0)
    throw new AppError("No items provided", 400);
  return await this.prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const transactionItemsData: any[] = [];

    for (const item of items) {
      const ticket = await tx.ticketType.findUnique({
        where: { id: item.ticketTypeId },
        include: { event: true },
      });

      if (!ticket) throw new AppError("Ticket type not found", 404);
      if (ticket.stock < item.quantity)
        throw new AppError("Not enough ticket stock", 400);

      // 🔒 lock stock
      await tx.ticketType.update({
        where: { id: ticket.id },
        data: { stock: ticket.stock - item.quantity },
      });

      transactionItemsData.push({
        eventId: ticket.eventId,
        ticketTypeId: ticket.id,
        quantity: item.quantity,
        price: ticket.price,
      });

      totalAmount += ticket.price * item.quantity;
    }

    let usedPromoId: string | null = null;

    // APPLY PROMO
    if (promoCode) {
      const promo = await tx.promo.findFirst({
        where: {
          code: promoCode,
          deletedAt: null,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (!promo) throw new AppError("Promo code invalid or expired", 400);

      const firstEventId = transactionItemsData[0].eventId;
      if (!promo.isGlobal && promo.eventId !== firstEventId)
        throw new AppError("Promo not valid for this event", 400);

      const discount = promo.isPercent
        ? Math.floor(totalAmount * (promo.discount / 100))
        : promo.discount;

      totalAmount = Math.max(0, totalAmount - discount);
      usedPromoId = promo.id;

      await tx.promo.update({
        where: { id: promo.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // APPLY POINTS
let usedPoints = 0;
if (usePoints > 0) {
  const validPoints = await tx.pointHistory.aggregate({
    where: {
      userId,
      deletedAt: null, 
      expiresAt: { gt: new Date() }, // only valid (not expired)
    },
    _sum: { amount: true },
  });

  const availablePoints = validPoints._sum.amount || 0;

  if (availablePoints < usePoints)
    throw new AppError("Not enough valid points", 400);

  usedPoints = usePoints;
  totalAmount = Math.max(0, totalAmount - usedPoints);

  await tx.user.update({
    where: { id: userId },
    data: { points: { decrement: usedPoints } },
  });

  await tx.pointHistory.create({
    data: {
      userId,
      amount: -usedPoints,
      reason: "Used for transaction",
    },
  });
}


    const transaction = await tx.transaction.create({
      data: {
        userId,
        totalAmount: Math.round(totalAmount),
        usedPromoId,
        usedPoints,
        status: "WAITING_PAYMENT",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    await tx.transactionItem.createMany({
      data: transactionItemsData.map((item) => ({
        ...item,
        transactionId: transaction.id,
      })),
    });

    console.log("🔥 Transaction created:", transaction.id);
    return transaction;
  });
}



  async getMyTransactions(userId: string) {
    await this.expireOverdueTransactions();
    await this.autoCancelWaitingAdminTransactions();

    return await this.prisma.transaction.findMany({
      where: { userId, deletedAt: null },
      include: {
        items: { include: { event: true, ticketType: true } },
        paymentProof: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async uploadProof(
  userId: string,
  transactionId: string,
  imageUrls: UploadProofDTO["imageUrl"]
) {
  return await this.prisma.$transaction(async (tx) => {
    const trx = await tx.transaction.findUnique({
      where: { id: transactionId },
    });

    console.log("🔥 Upload proof called by user:", userId, "Transaction:", transactionId);
    console.log("Cloudinary URLs:", imageUrls);

    if (!trx) throw new AppError("Transaction not found", 404);
    if (trx.userId !== userId) throw new AppError("Not your transaction", 403);
    if (trx.status !== "WAITING_PAYMENT")
      throw new AppError("Cannot upload proof", 400);

    await tx.paymentProof.createMany({
      data: imageUrls.map((url) => ({ transactionId, url })),
    });

    const updated = await tx.transaction.update({
      where: { id: transactionId },
      data: { status: "WAITING_ADMIN" },
    });

    console.log("🔥 Updated Transaction Status:", updated.status);

    return updated;
  });
}


  async approveTransaction(transactionId: string, organizerId: string) {
    const trx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: { include: { event: true } },
        user: { select: { email: true, name: true } },
      }
    });

    if (!trx) throw new AppError("Transaction not found", 404);
    if (trx.status !== "WAITING_ADMIN")
      throw new AppError("Cannot approve this transaction", 400);

    const firstEvent = trx.items[0]?.event;
    if (!firstEvent) throw new AppError("Invalid transaction data", 500);

    if (firstEvent.organizerId !== organizerId)
      throw new AppError("Not authorized", 403);

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "DONE" }
    });

    sendEmail(
      trx.user.email,
      "Your ticket is confirmed!",
      `Hi ${trx.user.name}, your ticket for ${firstEvent.title} has been approved!`
    ).catch((err) => console.error("Email failed:", err));

    return { message: "Transaction approved", status: "DONE" };
  }
  async rejectTransaction(transactionId: string, organizerId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const trx = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          items: {
            include: { event: true }
          },
          user: { select: { email: true, name: true } }
        }
      });

      if (!trx) throw new AppError("Transaction not found", 404);
      if (trx.status !== "WAITING_ADMIN")
        throw new AppError("Cannot reject this transaction", 400);

      const event = trx.items[0]?.event;
      if (!event) throw new AppError("Event not found", 404);
      if (event.organizerId !== organizerId)
        throw new AppError("Not authorized", 403);

      await this.rollbackTransaction(tx, trx);

      await tx.transaction.update({
        where: { id: transactionId },
        data: { status: "REJECTED" }
      });

      sendEmail(
        trx.user.email,
        "Transaction Rejected",
        `Hi ${trx.user.name}, your transaction for ${event.title} has been rejected.`
      ).catch(console.error);

      return { message: "Transaction rejected", status: "REJECTED" };
    });
  }


  async cancelTransaction(transactionId: string, userId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const trx = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          items: { include: { event: true } },
          user: { select: { email: true, name: true } }
        }
      });

      if (!trx) throw new AppError("Transaction not found", 404);
      if (trx.userId !== userId)
        throw new AppError("Not your transaction", 403);

      await this.rollbackTransaction(tx, trx);

      await tx.transaction.update({
        where: { id: transactionId },
        data: { status: "CANCELED" }
      });

      sendEmail(
        trx.user.email,
        "Transaction Canceled",
        `Hi ${trx.user.name}, your transaction has been successfully canceled.`
      ).catch(console.error);

      return { message: "Transaction canceled", status: "CANCELED" };
    });
  }


  private async rollbackTransaction(
    tx: any,
    trx: {
      id: string;
      userId: string;
      usedPoints: number;
      usedPromoId: string | null;
      items: { ticketTypeId: string | null; quantity: number }[];
    }
  ) {
    // Balikin stock tiket
    for (const item of trx.items) {
      if (item.ticketTypeId) {
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    // Rollback promo usage
    if (trx.usedPromoId) {
      await tx.promo.update({
        where: { id: trx.usedPromoId },
        data: { usedCount: { decrement: 1 } },
      });
    }

    // Rollback points
    if (trx.usedPoints > 0) {
      await tx.user.update({
        where: { id: trx.userId },
        data: { points: { increment: trx.usedPoints } },
      });

      await tx.pointHistory.create({
        data: {
          userId: trx.userId,
          amount: trx.usedPoints,
          reason: "Rollback",
        },
      });
    }
  }

  async expireOverdueTransactions() {
    return await this.prisma.$transaction(async (tx) => {
      const overdue = await tx.transaction.findMany({
        where: {
          status: "WAITING_PAYMENT",
          expiresAt: { lt: new Date() },
        },
        include: { items: true },
      });

      for (const trx of overdue) {
        await this.rollbackTransaction(tx, {
          id: trx.id,
          userId: trx.userId,
          usedPoints: trx.usedPoints,
          usedPromoId: trx.usedPromoId,
          items: trx.items.map((i) => ({
            ticketTypeId: i.ticketTypeId,
            quantity: i.quantity,
          })),
        });

        await tx.transaction.update({
          where: { id: trx.id },
          data: { status: "EXPIRED" },
        });
      }
    });
  }

  async getTransactionDetail(transactionId: string, userId: string) {
    return await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            event: true,
            ticketType: true,
          }
        },
        paymentProof: true,
      },
    });
  }


  async getPendingTransactions(organizerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: "WAITING_ADMIN",
        items: {
          some: {
            event: {
              organizerId: organizerId,
            },
          },
        },
        deletedAt: null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: { event: true, ticketType: true }
        },
        paymentProof: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await this.prisma.transaction.count({
      where: {
        status: "WAITING_ADMIN",
        items: {
          some: {
            event: {
              organizerId: organizerId,
            },
          },
        },
        deletedAt: null,
      },
    });

    return {
      transactions,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    };
  }

  async autoCancelWaitingAdminTransactions() {
    return await this.prisma.$transaction(async (tx) => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

      const pendingAdmin = await tx.transaction.findMany({
        where: {
          status: "WAITING_ADMIN",
          createdAt: { lt: threeDaysAgo },
        },
        include: { items: true },
      });

      for (const trx of pendingAdmin) {
        await this.rollbackTransaction(tx, {
          id: trx.id,
          userId: trx.userId,
          usedPoints: trx.usedPoints,
          usedPromoId: trx.usedPromoId,
          items: trx.items.map((i) => ({
            ticketTypeId: i.ticketTypeId,
            quantity: i.quantity,
          })),
        });

        await tx.transaction.update({
          where: { id: trx.id },
          data: { status: "CANCELED" },
        });
      }

      return { autoCanceled: pendingAdmin.length };
    });
  }
}
