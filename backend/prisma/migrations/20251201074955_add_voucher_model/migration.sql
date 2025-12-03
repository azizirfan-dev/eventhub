/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `isPercent` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Voucher` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Made the column `eventId` on table `Voucher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_eventId_fkey";

-- DropIndex
DROP INDEX "PaymentProof_transactionId_key";

-- DropIndex
DROP INDEX "Voucher_code_idx";

-- DropIndex
DROP INDEX "Voucher_organizerId_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordOtp" TEXT;

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "deletedAt",
DROP COLUMN "endsAt",
DROP COLUMN "isPercent",
DROP COLUMN "startsAt",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usageLimit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "eventId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "PaymentProof_transactionId_idx" ON "PaymentProof"("transactionId");

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
