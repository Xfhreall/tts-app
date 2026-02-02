import { Store } from "@tanstack/react-store";
import type { Difficulty } from "@/shared/lib/difficulty";

export interface PuzzleFilters {
  difficulty: Difficulty | "all";
  published: "all" | "published" | "draft";
  search: string;
}

export interface PuzzleStoreState {
  filters: PuzzleFilters;
  selectedPuzzleId: string | null;
  sortBy: "createdAt" | "title" | "difficulty";
  sortOrder: "asc" | "desc";
}

export const puzzleStore = new Store<PuzzleStoreState>({
  filters: {
    difficulty: "all",
    published: "all",
    search: "",
  },
  selectedPuzzleId: null,
  sortBy: "createdAt",
  sortOrder: "desc",
});

export const puzzleActions = {
  setFilter: <K extends keyof PuzzleFilters>(key: K, value: PuzzleFilters[K]) => {
    puzzleStore.setState((state) => ({
      ...state,
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
  },

  resetFilters: () => {
    puzzleStore.setState((state) => ({
      ...state,
      filters: {
        difficulty: "all",
        published: "all",
        search: "",
      },
    }));
  },

  setSelectedPuzzle: (id: string | null) => {
    puzzleStore.setState((state) => ({
      ...state,
      selectedPuzzleId: id,
    }));
  },

  setSort: (sortBy: PuzzleStoreState["sortBy"], sortOrder: PuzzleStoreState["sortOrder"]) => {
    puzzleStore.setState((state) => ({
      ...state,
      sortBy,
      sortOrder,
    }));
  },
};
