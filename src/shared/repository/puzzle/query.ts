"use client";

import { useQuery } from "@tanstack/react-query";
import type { PuzzleResponseDto } from "./dto";

export const puzzleKeys = {
  all: ["puzzles"] as const,
  admin: ["puzzles", "admin"] as const,
  detail: (id: string) => ["puzzle", id] as const,
};

async function fetchPuzzles(): Promise<PuzzleResponseDto[]> {
  const res = await fetch("/api/puzzles");
  if (!res.ok) throw new Error("Failed to fetch puzzles");
  return res.json();
}

async function fetchAdminPuzzles(): Promise<PuzzleResponseDto[]> {
  const res = await fetch("/api/admin/puzzles");
  if (!res.ok) throw new Error("Failed to fetch puzzles");
  return res.json();
}

async function fetchPuzzle(id: string): Promise<PuzzleResponseDto> {
  const res = await fetch(`/api/puzzles/${id}`);
  if (!res.ok) throw new Error("Failed to fetch puzzle");
  return res.json();
}

export function usePuzzlesQuery() {
  return useQuery({
    queryKey: puzzleKeys.admin,
    queryFn: fetchAdminPuzzles,
  });
}

export function usePublicPuzzlesQuery() {
  return useQuery({
    queryKey: puzzleKeys.all,
    queryFn: fetchPuzzles,
  });
}

export function usePuzzleQuery(id: string) {
  return useQuery({
    queryKey: puzzleKeys.detail(id),
    queryFn: () => fetchPuzzle(id),
    enabled: !!id,
  });
}
