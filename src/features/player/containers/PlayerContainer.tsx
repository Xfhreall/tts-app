"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CluePanel } from "@/features/player/components/clue-panel";
import { CompletionModal } from "@/features/player/components/completion-modal";
import { CrosswordGrid } from "@/features/player/components/crossword-grid";
import { Timer } from "@/features/player/components/timer";
import { GridSkeleton } from "@/shared/components/skeleton";
import { Button } from "@/shared/components/ui/button";
import { usePuzzleQuery } from "@/shared/repository/puzzle/query";
import { usePlayerState } from "../hooks/use-player-state";

interface PlayerContainerProps {
  puzzleId: string;
}

export function PlayerContainer({ puzzleId }: PlayerContainerProps) {
  const { data: puzzle, isLoading, error } = usePuzzleQuery(puzzleId);
  const { progress, isComplete, finalTime, setProgress, setComplete, updateTime } =
    usePlayerState();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <header className="glass border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted animate-pulse" />
            <div className="space-y-1.5 sm:space-y-2">
              <div className="h-4 sm:h-5 w-32 sm:w-40 bg-muted animate-pulse rounded" />
              <div className="h-3 sm:h-4 w-20 sm:w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-8">
            <div className="rounded-xl border bg-card p-4 sm:p-6 order-1">
              <GridSkeleton />
            </div>
            <div className="rounded-xl border bg-card p-4 sm:p-6 space-y-3 sm:space-y-4 order-2 lg:order-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i.toString()} className="h-5 sm:h-6 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold mb-2">Puzzle tidak ditemukan</h1>
          <Button asChild>
            <Link href="/puzzles">Kembali</Link>
          </Button>
        </div>
      </div>
    );
  }

  const gridData = puzzle.gridData as { grid: string[][]; width: number; height: number };

  return (
    <div className="min-h-screen">
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
              <Link href="/puzzles">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-base sm:text-lg font-bold line-clamp-1">{puzzle.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{puzzle.words.length} kata</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="flex sm:hidden items-center px-2 py-1 rounded-lg bg-muted/50">
              <span className="text-xs font-bold">{progress}%</span>
            </div>
            <Timer
              autoStart
              onTimeChange={(s) => {
                updateTime(s);
              }}
            />
          </div>
        </div>
      </header>

      <CompletionModal
        isOpen={isComplete}
        onClose={() => {}}
        puzzleId={puzzleId}
        finalTime={finalTime}
        puzzleTitle={puzzle.title}
        wordCount={puzzle.words.length}
      />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-8">
          <div className="rounded-xl border bg-card p-3 sm:p-6 overflow-x-auto order-1 h-max sticky top-28 z-10">
            <CrosswordGrid
              grid={gridData.grid}
              words={puzzle.words}
              onComplete={() => setComplete()}
              onProgressChange={setProgress}
            />
          </div>
          <div className="rounded-xl border bg-card p-4 sm:p-6 order-2 max-h-[40vh] lg:max-h-none overflow-y-auto">
            <h2 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Petunjuk</h2>
            <CluePanel words={puzzle.words} />
          </div>
        </div>
      </main>
    </div>
  );
}
