/*
  Warnings:

  - You are about to drop the column `replayOfJobId` on the `DeadLetterJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DeadLetterJob" DROP COLUMN "replayOfJobId";
