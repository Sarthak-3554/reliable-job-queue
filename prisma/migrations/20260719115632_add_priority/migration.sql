-- CreateEnum
CREATE TYPE "public"."JobPriority" AS ENUM ('HIGH', 'NORMAL', 'LOW');

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "priority" "public"."JobPriority" NOT NULL DEFAULT 'NORMAL';
