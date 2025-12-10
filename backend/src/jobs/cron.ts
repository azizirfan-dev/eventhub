import cron from "node-cron";
import { TransactionService } from "../modules/transactions/transaction.service";

const trxService = new TransactionService();

/**
 * EXPIRE WAITING_PAYMENT → setiap 5 menit
 * (supaya gak terlalu spam database)
 */
cron.schedule("*/5 * * * *", async () => {
  console.log("[CRON] Running expireOverdueTransactions...");
  try {
    await trxService.expireOverdueTransactions();
  } catch (err) {
    console.error("Error in expire CRON:", err);
  }
});

/**
 * AUTO CANCEL WAITING_ADMIN → setiap jam
 */
cron.schedule("0 * * * *", async () => {
  console.log("[CRON] Running autoCancelWaitingAdminTransactions...");
  try {
    await trxService.autoCancelWaitingAdminTransactions();
  } catch (err) {
    console.error("Error in auto-cancel CRON:", err);
  }
});

export {}; // supaya dianggap module
