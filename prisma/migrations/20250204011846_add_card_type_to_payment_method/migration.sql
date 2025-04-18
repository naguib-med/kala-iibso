/*
  Warnings:

  - You are about to drop the column `last4` on the `PaymentMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "last4",
ALTER COLUMN "cardNumber" DROP DEFAULT;
