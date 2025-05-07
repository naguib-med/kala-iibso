/*
  Warnings:

  - You are about to drop the column `productId` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail,listingId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_productId_fkey";

-- DropIndex
DROP INDEX "Wishlist_productId_idx";

-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "productId",
ADD COLUMN     "listingId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Wishlist_listingId_idx" ON "Wishlist"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userEmail_listingId_key" ON "Wishlist"("userEmail", "listingId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
