"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Puzzle, WordInput } from "@/shared/lib/types";

async function fetchPuzzles(): Promise<Puzzle[]> {
  const res = await fetch("/api/puzzles");
  if (!res.ok) throw new Error("Failed to fetch puzzles");
  return res.json();
}

async function fetchPuzzle(id: string): Promise<Puzzle> {
  const res = await fetch(`/api/puzzles/${id}`);
  if (!res.ok) throw new Error("Failed to fetch puzzle");
  return res.json();
}

async function generatePreview(words: WordInput[]) {
  const res = await fetch("/api/puzzles/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to generate");
  return data;
}

async function createPuzzle(data: { title: string; words: WordInput[]; publish: boolean }) {
  const res = await fetch("/api/puzzles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to create puzzle");
  return result;
}

export function usePuzzles() {
  return useQuery({
    queryKey: ["puzzles"],
    queryFn: fetchPuzzles,
  });
}

export function usePuzzle(id: string) {
  return useQuery({
    queryKey: ["puzzle", id],
    queryFn: () => fetchPuzzle(id),
    enabled: !!id,
  });
}

export function useGeneratePreview() {
  return useMutation({
    mutationFn: generatePreview,
  });
}

export function useCreatePuzzle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPuzzle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puzzles"] });
    },
  });
}
