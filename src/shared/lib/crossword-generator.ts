import type { GeneratedGrid, PlacedWord, WordInput } from "./types";

interface Position {
  x: number;
  y: number;
  direction: "across" | "down";
  intersections: number;
}

interface GridCell {
  letter: string | null;
  wordIndices: number[];
}

const GRID_SIZE = 50;

function createEmptyGrid(): GridCell[][] {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({ letter: null, wordIndices: [] }))
    );
}

function findIntersections(
  word: string,
  placedWords: PlacedWord[],
  grid: GridCell[][]
): Position[] {
  const positions: Position[] = [];
  const wordUpper = word.toUpperCase();

  for (let i = 0; i < wordUpper.length; i++) {
    const char = wordUpper[i];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y][x].letter === char) {
          const acrossStart = x - i;
          if (canPlaceWord(wordUpper, acrossStart, y, "across", grid)) {
            const intersectionCount = countIntersections(wordUpper, acrossStart, y, "across", grid);
            positions.push({
              x: acrossStart,
              y,
              direction: "across",
              intersections: intersectionCount,
            });
          }

          const downStart = y - i;
          if (canPlaceWord(wordUpper, x, downStart, "down", grid)) {
            const intersectionCount = countIntersections(wordUpper, x, downStart, "down", grid);
            positions.push({
              x,
              y: downStart,
              direction: "down",
              intersections: intersectionCount,
            });
          }
        }
      }
    }
  }

  return positions.sort((a, b) => b.intersections - a.intersections);
}

function canPlaceWord(
  word: string,
  startX: number,
  startY: number,
  direction: "across" | "down",
  grid: GridCell[][]
): boolean {
  const dx = direction === "across" ? 1 : 0;
  const dy = direction === "down" ? 1 : 0;

  if (startX < 0 || startY < 0) return false;
  if (direction === "across" && startX + word.length > GRID_SIZE) return false;
  if (direction === "down" && startY + word.length > GRID_SIZE) return false;

  const beforeX = startX - dx;
  const beforeY = startY - dy;
  if (beforeX >= 0 && beforeY >= 0 && grid[beforeY][beforeX].letter !== null) {
    return false;
  }

  const afterX = startX + word.length * dx;
  const afterY = startY + word.length * dy;
  if (afterX < GRID_SIZE && afterY < GRID_SIZE && grid[afterY][afterX].letter !== null) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    const cell = grid[y][x];

    if (cell.letter !== null && cell.letter !== word[i]) {
      return false;
    }

    if (cell.letter === null) {
      if (direction === "across") {
        if (y > 0 && grid[y - 1][x].letter !== null) return false;
        if (y < GRID_SIZE - 1 && grid[y + 1][x].letter !== null) return false;
      } else {
        if (x > 0 && grid[y][x - 1].letter !== null) return false;
        if (x < GRID_SIZE - 1 && grid[y][x + 1].letter !== null) return false;
      }
    }
  }

  return true;
}

function countIntersections(
  word: string,
  startX: number,
  startY: number,
  direction: "across" | "down",
  grid: GridCell[][]
): number {
  const dx = direction === "across" ? 1 : 0;
  const dy = direction === "down" ? 1 : 0;
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    if (grid[y][x].letter === word[i]) {
      count++;
    }
  }

  return count;
}

function placeWord(
  word: string,
  startX: number,
  startY: number,
  direction: "across" | "down",
  wordIndex: number,
  grid: GridCell[][]
): void {
  const dx = direction === "across" ? 1 : 0;
  const dy = direction === "down" ? 1 : 0;

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    grid[y][x].letter = word[i];
    grid[y][x].wordIndices.push(wordIndex);
  }
}

function findFirstEmptyPosition(word: string, grid: GridCell[][]): Position | null {
  const center = Math.floor(GRID_SIZE / 2);
  const startX = center - Math.floor(word.length / 2);

  if (canPlaceWord(word, startX, center, "across", grid)) {
    return { x: startX, y: center, direction: "across", intersections: 0 };
  }

  return null;
}

function trimGrid(grid: GridCell[][]): {
  trimmedGrid: string[][];
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
} {
  let minX = GRID_SIZE,
    maxX = 0,
    minY = GRID_SIZE,
    maxY = 0;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x].letter !== null) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const trimmedGrid: string[][] = [];
  for (let y = minY; y <= maxY; y++) {
    const row: string[] = [];
    for (let x = minX; x <= maxX; x++) {
      row.push(grid[y][x].letter || "");
    }
    trimmedGrid.push(row);
  }

  return { trimmedGrid, offsetX: minX, offsetY: minY, width, height };
}

function assignNumbers(placedWords: PlacedWord[], offsetX: number, offsetY: number): PlacedWord[] {
  const positions: Map<string, number> = new Map();
  let currentNumber = 1;

  const sortedWords = [...placedWords].sort((a, b) => {
    if (a.startY !== b.startY) return a.startY - b.startY;
    return a.startX - b.startX;
  });

  for (const word of sortedWords) {
    const key = `${word.startX},${word.startY}`;
    if (!positions.has(key)) {
      positions.set(key, currentNumber++);
    }
  }

  return placedWords.map((word) => ({
    ...word,
    startX: word.startX - offsetX,
    startY: word.startY - offsetY,
    number: positions.get(`${word.startX},${word.startY}`) || 0,
  }));
}

export function generateCrossword(words: WordInput[]): GeneratedGrid {
  if (words.length < 2) {
    throw new Error("Need at least 2 words to generate a crossword");
  }

  const sortedWords = [...words].sort((a, b) => b.text.length - a.text.length);

  const grid = createEmptyGrid();
  const placedWords: PlacedWord[] = [];
  const unplacedWords: string[] = [];

  const firstWord = sortedWords[0];
  const firstPos = findFirstEmptyPosition(firstWord.text.toUpperCase(), grid);

  if (!firstPos) {
    throw new Error("Could not place first word");
  }

  placeWord(firstWord.text.toUpperCase(), firstPos.x, firstPos.y, firstPos.direction, 0, grid);
  placedWords.push({
    ...firstWord,
    text: firstWord.text.toUpperCase(),
    direction: firstPos.direction,
    startX: firstPos.x,
    startY: firstPos.y,
    number: 0,
  });

  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    const wordUpper = word.text.toUpperCase();
    const positions = findIntersections(wordUpper, placedWords, grid);

    if (positions.length > 0) {
      const bestPos = positions[0];
      placeWord(wordUpper, bestPos.x, bestPos.y, bestPos.direction, placedWords.length, grid);
      placedWords.push({
        ...word,
        text: wordUpper,
        direction: bestPos.direction,
        startX: bestPos.x,
        startY: bestPos.y,
        number: 0,
      });
    } else {
      unplacedWords.push(word.text);
    }
  }

  const { trimmedGrid, offsetX, offsetY, width, height } = trimGrid(grid);
  const numberedWords = assignNumbers(placedWords, offsetX, offsetY);

  return {
    grid: trimmedGrid,
    words: numberedWords,
    width,
    height,
    unplacedWords,
  };
}

export function validateWords(words: WordInput[]): string[] {
  const errors: string[] = [];

  if (words.length < 5) {
    errors.push("Minimum 5 kata diperlukan");
  }

  if (words.length > 15) {
    errors.push("Maksimum 15 kata diperbolehkan");
  }

  const seen = new Set<string>();
  for (const word of words) {
    if (!word.text.trim()) {
      errors.push("Kata tidak boleh kosong");
      continue;
    }

    if (!word.clue.trim()) {
      errors.push(`Petunjuk untuk "${word.text}" tidak boleh kosong`);
    }

    if (!/^[a-zA-Z]+$/.test(word.text)) {
      errors.push(`"${word.text}" hanya boleh mengandung huruf`);
    }

    const upper = word.text.toUpperCase();
    if (seen.has(upper)) {
      errors.push(`Kata "${word.text}" duplikat`);
    }
    seen.add(upper);
  }

  return errors;
}
