export interface WordInputDto {
  text: string;
  clue: string;
}

export interface PlacedWordDto {
  text: string;
  clue: string;
  direction: "across" | "down";
  startX: number;
  startY: number;
  number: number;
}

export interface CreatePuzzleDto {
  title: string;
  words: WordInputDto[];
  publish?: boolean;
}

export interface GeneratePreviewDto {
  words: WordInputDto[];
}

export interface PuzzleResponseDto {
  id: string;
  title: string;
  gridData: {
    grid: string[][];
    width: number;
    height: number;
  };
  words: PlacedWordDto[];
  published: boolean;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedPreviewDto {
  grid: string[][];
  words: PlacedWordDto[];
  width: number;
  height: number;
  unplacedWords: string[];
}
