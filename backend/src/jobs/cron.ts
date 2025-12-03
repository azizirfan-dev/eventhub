import cron from "node-cron";
import { TransactionService } from "../modules/transactions/transaction.service";

const service = new TransactionService();

/**
 * EXPIRE WAITING_PAYMENT (every minute)
 * Logic:
 * - Jika lewat >2 jam & masih WAITING_PAYMENT → EXPIRED
 * - Rollback stock, voucher usage, & points (handled in service)
 */
export const expireWaitingPayments = cron.schedule("* * * * *", async () => {
  await service.expireOverdueTransactions();
});

/**
 * AUTO CANCEL WAITING_ADMIN (hourly check)
 * Logic:
 * - Jika >3 hari belum disetujui oleh organizer → CANCELED
 * - Rollback stock, voucher usage, & points (handled in service)
 */
export const autoCancelPending = cron.schedule("0 * * * *", async () => {
  await service.autoCancelWaitingAdminTransactions();
});

// Prevent auto execute before server init
expireWaitingPayments.stop();
autoCancelPending.stop();
