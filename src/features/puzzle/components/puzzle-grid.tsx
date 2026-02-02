"use client";

import { PuzzleCard } from "@/shared/components/puzzle-card";
import { useCompletedPuzzles } from "@/shared/hooks/use-completed-puzzles";

interface Puzzle {
  id: string;
  title: string;
  words: { id: string }[];
  createdAt: string;
}

interface PuzzleGridProps {
  puzzles: Puzzle[];
}

export function PuzzleGrid({ puzzles }: PuzzleGridProps) {
  const { completedIds, isLoaded } = useCompletedPuzzles();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {puzzles.map((puzzle) => (
        <PuzzleCard
          key={puzzle.id}
          id={puzzle.id}
          title={puzzle.title}
          wordCount={puzzle.words.length}
          createdAt={puzzle.createdAt}
          isCompleted={isLoaded && completedIds.includes(puzzle.id)}
        />
      ))}
    </div>
  );
}
