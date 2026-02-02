"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreatePuzzleDto,
  GeneratedPreviewDto,
  GeneratePreviewDto,
  PuzzleResponseDto,
} from "./dto";
import { puzzleKeys } from "./query";

async function createPuzzle(data: CreatePuzzleDto): Promise<PuzzleResponseDto> {
  const res = await fetch("/api/puzzles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to create puzzle");
  return result;
}

async function generatePreview(data: GeneratePreviewDto): Promise<GeneratedPreviewDto> {
  const res = await fetch("/api/puzzles/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to generate");
  return result;
}

async function deletePuzzle(id: string): Promise<void> {
  const res = await fetch(`/api/puzzles/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete puzzle");
}

async function updatePuzzle(params: {
  id: string;
  data: { title?: string; published?: boolean };
}): Promise<PuzzleResponseDto> {
  const res = await fetch(`/api/puzzles/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to update puzzle");
  return result;
}

export function useCreatePuzzleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPuzzle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: puzzleKeys.all });
    },
  });
}

export function useGeneratePreviewMutation() {
  return useMutation({
    mutationFn: generatePreview,
  });
}

export function useDeletePuzzleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePuzzle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: puzzleKeys.all });
    },
  });
}

export function useUpdatePuzzleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePuzzle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: puzzleKeys.all });
    },
  });
}
