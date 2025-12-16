import cron from "node-cron";
import { prisma } from "../config/database";
import { TransactionStatus } from "@prisma/client";

export function initTransactionJobs() {

  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    console.log("[CRON] Checking expired WAITING_PAYMENT transactions...");

    const expired = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.WAITING_PAYMENT,
        expiresAt: { lt: now },
        deletedAt: null
      },
      include: { items: true }
    });

    for (const trx of expired) {
      await prisma.$transaction(async (tx) => {
        // rollback ticket stock
        for (const item of trx.items) {
          await tx.ticketType.update({
            where: { id: item.ticketTypeId! },
            data: { stock: { increment: item.quantity } }
          });
        }

        // rollback points
        if (trx.usedPoints > 0) {
          await tx.user.update({
            where: { id: trx.userId },
            data: { points: { increment: trx.usedPoints } }
          });

          await tx.pointHistory.create({
            data: {
              userId: trx.userId,
              amount: trx.usedPoints,
              reason: "Rollback from expired transaction"
            }
          });
        }

        await tx.transaction.update({
          where: { id: trx.id },
          data: { status: TransactionStatus.EXPIRED }
        });
      });
    }

    console.log(`[CRON] Expired transactions processed: ${expired.length}`);
  });

  // Every hour → Cancel WAITING_ADMIN > 3 days
  cron.schedule("0 * * * *", async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    console.log("[CRON] Checking stale WAITING_ADMIN transactions...");

    const stale = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.WAITING_ADMIN,
        updatedAt: { lt: threeDaysAgo },
        deletedAt: null
      },
      include: { items: true }
    });

    for (const trx of stale) {
      await prisma.$transaction(async (tx) => {
        // rollback ticket stock
        for (const item of trx.items) {
          await tx.ticketType.update({
            where: { id: item.ticketTypeId! },
            data: { stock: { increment: item.quantity } }
          });
        }

        // rollback points
        if (trx.usedPoints > 0) {
          await tx.user.update({
            where: { id: trx.userId },
            data: { points: { increment: trx.usedPoints } }
          });

          await tx.pointHistory.create({
            data: {
              userId: trx.userId,
              amount: trx.usedPoints,
              reason: "Rollback from canceled transaction"
            }
          });
        }

        await tx.transaction.update({
          where: { id: trx.id },
          data: { status: TransactionStatus.CANCELED }
        });
      });
    }
    console.log(`[CRON] Canceled transactions processed: ${stale.length}`);
  });
}
