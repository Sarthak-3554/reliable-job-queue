/*
  Warnings:

  - Added the required column `maxAttempts` to the `DeadLetterJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DeadLetterJob" ADD COLUMN     "maxAttempts" INTEGER NOT NULL,
ADD COLUMN     "replayOfJobId" INTEGER;
