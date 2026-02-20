/*
  Warnings:

  - You are about to drop the column `participantId` on the `votes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_participantId_fkey";

-- DropIndex
DROP INDEX "votes_participantId_idx";

-- AlterTable
ALTER TABLE "votes" DROP COLUMN "participantId",
ADD COLUMN     "participantIds" TEXT[];
