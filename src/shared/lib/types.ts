export interface WordInput {
  text: string;
  clue: string;
}

export interface PlacedWord extends WordInput {
  direction: "across" | "down";
  startX: number;
  startY: number;
  number: number;
}

export interface GeneratedGrid {
  grid: string[][];
  words: PlacedWord[];
  width: number;
  height: number;
  unplacedWords: string[];
}

export interface Puzzle {
  id: string;
  title: string;
  gridData: {
    grid: string[][];
    width: number;
    height: number;
  };
  words: PlacedWord[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CellState {
  letter: string;
  isBlocked: boolean;
  number?: number;
  isActive: boolean;
  isHighlighted: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}
