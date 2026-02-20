-- AlterTable
ALTER TABLE "participant_voting" ADD COLUMN     "nickname" TEXT;

-- AlterTable
ALTER TABLE "vote_categories" ADD COLUMN     "allowMultipleWinners" BOOLEAN NOT NULL DEFAULT false;
