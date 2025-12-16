import cron from "node-cron";
import { prisma } from "../config/database";


cron.schedule("0 0 * * *", async () => {
  console.log("[CRON] Cleaning expired promos...");
  
  const now = new Date();

  const result = await prisma.promo.updateMany({
    where: {
      deletedAt: null,
      endDate: { lt: now } 
    },
    data: {
      deletedAt: now
    }
  });

  console.log(`[CRON] ${result.count} promos expired`);
});
