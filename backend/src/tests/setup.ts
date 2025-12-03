import { prisma } from "../config/database";
import { expireWaitingPayments, autoCancelPending,expirePoints } from "../jobs/cron";

afterAll(async () => {
  expireWaitingPayments.stop();
  autoCancelPending.stop();
  expirePoints.stop();
  await prisma.$disconnect();
});
