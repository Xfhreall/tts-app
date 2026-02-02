-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gridData" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuzzleWord" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "clue" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "startX" INTEGER NOT NULL,
    "startY" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "puzzleId" TEXT NOT NULL,

    CONSTRAINT "PuzzleWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PuzzleWord_puzzleId_idx" ON "PuzzleWord"("puzzleId");

-- AddForeignKey
ALTER TABLE "PuzzleWord" ADD CONSTRAINT "PuzzleWord_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
