"use client";

import { useStore } from "@tanstack/react-store";
import { Filter, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { type PuzzleFilters, puzzleActions, puzzleStore } from "@/shared/store/puzzle-store";

const difficultyOptions: { value: PuzzleFilters["difficulty"]; label: string }[] = [
  { value: "all", label: "Semua Level" },
  { value: "easy", label: "Mudah" },
  { value: "medium", label: "Sedang" },
  { value: "hard", label: "Sulit" },
];

const publishedOptions: { value: PuzzleFilters["published"]; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export function PuzzleFiltersPanel() {
  const filters = useStore(puzzleStore, (state) => state.filters);
  const hasActiveFilters = filters.difficulty !== "all" || filters.published !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 text-muted-foreground sm:hidden">
        <Filter className="w-4 h-4" />
      </div>

      <Select
        value={filters.difficulty}
        onValueChange={(value) =>
          puzzleActions.setFilter("difficulty", value as PuzzleFilters["difficulty"])
        }
      >
        <SelectTrigger className="w-30 sm:w-35 h-8 sm:h-9 text-xs sm:text-sm">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          {difficultyOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.published}
        onValueChange={(value) =>
          puzzleActions.setFilter("published", value as PuzzleFilters["published"])
        }
      >
        <SelectTrigger className="w-30 sm:w-35 h-8 sm:h-9 text-xs sm:text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {publishedOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm gap-1"
          onClick={puzzleActions.resetFilters}
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      )}
    </div>
  );
}
