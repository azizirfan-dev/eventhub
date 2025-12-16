import cron from "node-cron";
import { TransactionService } from "../modules/transactions/transaction.service";

const trxService = new TransactionService();

cron.schedule("*/5 * * * *", async () => {
  console.log("[CRON] Running expireOverdueTransactions...");
  try {
    await trxService.expireOverdueTransactions();
  } catch (err) {
    console.error("Error in expire CRON:", err);
  }
});

cron.schedule("0 * * * *", async () => {
  console.log("[CRON] Running autoCancelWaitingAdminTransactions...");
  try {
    await trxService.autoCancelWaitingAdminTransactions();
  } catch (err) {
    console.error("Error in auto-cancel CRON:", err);
  }
});

export {}; // supaya dianggap module
