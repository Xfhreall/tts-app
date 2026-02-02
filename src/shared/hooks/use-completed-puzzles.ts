"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tts-completed-puzzles";

export interface CompletedPuzzle {
  puzzleId: string;
  completedAt: string;
  time: number;
  stars: number;
}

function getCompletedPuzzlesFromStorage(): CompletedPuzzle[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCompletedPuzzlesToStorage(puzzles: CompletedPuzzle[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(puzzles));
  } catch {}
}

export function useCompletedPuzzles() {
  const [completedPuzzles, setCompletedPuzzles] = useState<CompletedPuzzle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCompletedPuzzles(getCompletedPuzzlesFromStorage());
    setIsLoaded(true);
  }, []);

  const markAsCompleted = useCallback((puzzleId: string, time: number, stars: number) => {
    setCompletedPuzzles((prev) => {
      const existingIndex = prev.findIndex((p) => p.puzzleId === puzzleId);

      const newEntry: CompletedPuzzle = {
        puzzleId,
        completedAt: new Date().toISOString(),
        time,
        stars,
      };

      let updated: CompletedPuzzle[];
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (time < existing.time || stars > existing.stars) {
          updated = [...prev];
          updated[existingIndex] = {
            ...newEntry,
            time: Math.min(time, existing.time),
            stars: Math.max(stars, existing.stars),
          };
        } else {
          return prev;
        }
      } else {
        updated = [...prev, newEntry];
      }

      saveCompletedPuzzlesToStorage(updated);
      return updated;
    });
  }, []);

  const isCompleted = useCallback(
    (puzzleId: string): boolean => {
      return completedPuzzles.some((p) => p.puzzleId === puzzleId);
    },
    [completedPuzzles]
  );

  const getCompletionData = useCallback(
    (puzzleId: string): CompletedPuzzle | undefined => {
      return completedPuzzles.find((p) => p.puzzleId === puzzleId);
    },
    [completedPuzzles]
  );

  const completedIds = completedPuzzles.map((p) => p.puzzleId);

  return {
    completedPuzzles,
    completedIds,
    isLoaded,
    markAsCompleted,
    isCompleted,
    getCompletionData,
  };
}
