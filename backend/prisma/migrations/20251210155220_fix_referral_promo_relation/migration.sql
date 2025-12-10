-- AlterTable
ALTER TABLE "Promo" ADD COLUMN     "lockedToUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_lockedToUserId_fkey" FOREIGN KEY ("lockedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
