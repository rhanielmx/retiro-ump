/*
  Warnings:

  - You are about to drop the column `email` on the `Participant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Participant_email_idx";

-- DropIndex
DROP INDEX "Participant_email_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "email",
ADD COLUMN     "medications" TEXT;
