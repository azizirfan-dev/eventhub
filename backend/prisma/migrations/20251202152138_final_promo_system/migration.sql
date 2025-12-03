-- DropForeignKey
ALTER TABLE "Promo" DROP CONSTRAINT "Promo_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Promo" DROP CONSTRAINT "Promo_organizerId_fkey";

-- AlterTable
ALTER TABLE "Promo" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "usageLimit" DROP NOT NULL,
ALTER COLUMN "usageLimit" DROP DEFAULT,
ALTER COLUMN "eventId" DROP NOT NULL,
ALTER COLUMN "organizerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
