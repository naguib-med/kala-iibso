/*
  Warnings:

  - You are about to drop the column `lastFourDigits` on the `PaymentMethod` table. All the data in the column will be lost.
  - Made the column `cardNumber` on table `PaymentMethod` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "lastFourDigits",
ADD COLUMN     "last4" TEXT NOT NULL DEFAULT '0000',
ALTER COLUMN "cardNumber" SET NOT NULL,
ALTER COLUMN "cardNumber" SET DEFAULT '';
