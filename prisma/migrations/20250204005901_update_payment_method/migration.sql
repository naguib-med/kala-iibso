-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "cardType" TEXT,
ADD COLUMN     "lastFourDigits" TEXT NOT NULL DEFAULT '0000',
ALTER COLUMN "cardNumber" DROP NOT NULL;
