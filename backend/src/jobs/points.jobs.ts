import cron from "node-cron";
import { prisma } from "../config/database";

cron.schedule("0 0 * * *", async () => {
  console.log("[CRON] Expiring old points...");
  const now = new Date();
  await prisma.pointHistory.updateMany({
    where: {
      expiresAt: { lt: now },
      deletedAt: null,
    },
    data: { deletedAt: now }
  });
});
