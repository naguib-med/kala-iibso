/*
  Warnings:

  - You are about to drop the `UserInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserNotificationPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserInterest" DROP CONSTRAINT "UserInterest_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotificationPreferences" DROP CONSTRAINT "UserNotificationPreferences_userId_fkey";

-- DropTable
DROP TABLE "UserInterest";

-- DropTable
DROP TABLE "UserNotificationPreferences";
