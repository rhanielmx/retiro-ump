/*
  Warnings:

  - You are about to drop the column `paid` on the `Participant` table. All the data in the column will be lost.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FULL', 'DAILY', 'PARTIAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE');

-- DropIndex
DROP INDEX "Participant_paid_idx";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "paid",
ADD COLUMN     "dailyRate" DECIMAL(10,2),
ADD COLUMN     "daysStayed" INTEGER DEFAULT 0,
ADD COLUMN     "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "fullPrice" DECIMAL(10,2),
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'FULL',
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Participant_status_idx" ON "Participant"("status");

-- CreateIndex
CREATE INDEX "Participant_paymentType_idx" ON "Participant"("paymentType");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_method_idx" ON "Payment"("method");
