-- CreateTable
CREATE TABLE "vote_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant_voting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participant_voting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "votes_categoryId_idx" ON "votes"("categoryId");

-- CreateIndex
CREATE INDEX "votes_participantId_idx" ON "votes"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_categoryId_deviceId_key" ON "votes"("categoryId", "deviceId");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "vote_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participant_voting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
