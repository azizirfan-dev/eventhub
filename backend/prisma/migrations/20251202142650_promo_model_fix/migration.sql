/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Promo` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Promo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `Promo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Promo` table without a default value. This is not possible if the table is not empty.
  - Made the column `usageLimit` on table `Promo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Promo" DROP COLUMN "expiresAt",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "organizerId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "usageLimit" SET NOT NULL,
ALTER COLUMN "usageLimit" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_usedPromoId_fkey" FOREIGN KEY ("usedPromoId") REFERENCES "Promo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
