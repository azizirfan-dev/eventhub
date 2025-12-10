import cron from "node-cron";
import { prisma } from "../config/database";

/**
 * Run everyday at midnight
 * Mark expired promos as deleted
 */
cron.schedule("0 0 * * *", async () => {
  console.log("[CRON] Cleaning expired promos...");
  
  const now = new Date();

  const result = await prisma.promo.updateMany({
    where: {
      deletedAt: null,
      endDate: { lt: now } // sudah lewat masa berlaku
    },
    data: {
      deletedAt: now
    }
  });

  console.log(`[CRON] ${result.count} promos expired`);
});
