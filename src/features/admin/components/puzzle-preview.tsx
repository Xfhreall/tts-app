"use client";

import type { PlacedWord } from "@/shared/lib/types";
import { cn } from "@/shared/lib/utils";

interface PuzzlePreviewProps {
  grid: string[][];
  words: PlacedWord[];
  width: number;
  height: number;
}

export function PuzzlePreview({ grid, words, width, height }: PuzzlePreviewProps) {
  const getWordNumber = (x: number, y: number): number | undefined => {
    const word = words.find((w) => w.startX === x && w.startY === y);
    return word?.number;
  };

  const cellSize = Math.min(40, 600 / Math.max(width, height));

  return (
    <div className="space-y-4">
      <div
        className="inline-grid gap-px bg-border p-px rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const number = getWordNumber(x, y);
            const isEmpty = cell === "";
            const cellKey = `cell-${x}-${y}`;

            return (
              <div
                key={cellKey}
                className={cn(
                  "relative flex items-center justify-center font-bold",
                  isEmpty ? "bg-muted" : "bg-background"
                )}
                style={{
                  width: cellSize,
                  height: cellSize,
                  fontSize: cellSize * 0.5,
                }}
              >
                {number && (
                  <span
                    className="absolute top-0.5 left-1 text-muted-foreground font-normal"
                    style={{ fontSize: cellSize * 0.25 }}
                  >
                    {number}
                  </span>
                )}
                {cell}
              </div>
            );
          })
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Mendatar (Across)</h4>
          <ul className="space-y-1">
            {words
              .filter((w) => w.direction === "across")
              .sort((a, b) => a.number - b.number)
              .map((word) => (
                <li key={`across-${word.number}`}>
                  <span className="font-medium">{word.number}.</span> {word.clue}
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Menurun (Down)</h4>
          <ul className="space-y-1">
            {words
              .filter((w) => w.direction === "down")
              .sort((a, b) => a.number - b.number)
              .map((word) => (
                <li key={`down-${word.number}`}>
                  <span className="font-medium">{word.number}.</span> {word.clue}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
